import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { getStripeServer } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const stripe = getStripeServer()
    if (!stripe) {
      return NextResponse.json({ error: 'Stripe no configurado' }, { status: 500 })
    }

    const body = await request.text()
    const sig = headers().get('stripe-signature')

    let event

    try {
      event = stripe.webhooks.constructEvent(body, sig!, process.env.STRIPE_WEBHOOK_SECRET!)
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message)
      return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 })
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object

        // Extraer metadata
        const { productId, buyerId, sellerId, quantity, unitPrice } = session.metadata!

        // Crear la orden en la base de datos
        const order = await prisma.order.create({
          data: {
            productId: productId!,
            buyerId: buyerId!,
            sellerId: sellerId!,
            quantity: parseInt(quantity!),
            totalPrice: parseFloat(unitPrice!) * parseInt(quantity!),
            stripePaymentIntentId: session.payment_intent as string,
            status: 'completed'
          }
        })

        // Actualizar el inventario del producto
        await prisma.product.update({
          where: { id: productId! },
          data: {
            quantity: { decrement: parseInt(quantity!) }
          }
        })

        console.log('Order created and inventory updated:', order.id)
        break

      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}