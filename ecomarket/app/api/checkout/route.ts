import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getStripeServer } from "@/lib/stripe"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { productId, quantity } = await request.json()

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { seller: true }
    })

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

    // Verificar que no sea el propio producto del usuario
    if (product.sellerId === session.user.id) {
      return NextResponse.json({ error: 'No puedes comprar tu propio producto' }, { status: 400 })
    }

    // Verificar stock disponible
    if (product.quantity < quantity) {
      return NextResponse.json({ error: 'Stock insuficiente' }, { status: 400 })
    }

    // Crear sesión de pago de Stripe
    const stripe = getStripeServer()
    if (!stripe) {
      // Modo desarrollo: simular compra exitosa
      console.log('Stripe no configurado - simulando compra en modo desarrollo')

      // Crear orden simulada
      const order = await prisma.order.create({
        data: {
          productId,
          buyerId: session.user.id,
          sellerId: product.sellerId,
          quantity,
          totalPrice: product.price * quantity,
          stripePaymentIntentId: `simulated_${Date.now()}`,
          status: 'completed'
        }
      })

      // Actualizar inventario
      await prisma.product.update({
        where: { id: productId },
        data: {
          quantity: { decrement: quantity }
        }
      })

      return NextResponse.json({
        url: `${process.env.NEXTAUTH_URL}/checkout/success?session_id=simulated_${order.id}`,
        sessionId: `simulated_${order.id}`
      })
    }

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: product.title,
              description: `Vendido por: ${product.seller.businessName || product.seller.name}`,
              images: product.images ? JSON.parse(product.images) : [],
            },
            unit_amount: product.price * 100, // precio en centavos
          },
          quantity: quantity,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXTAUTH_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/marketplace`,
      metadata: {
        productId: product.id,
        buyerId: session.user.id,
        sellerId: product.sellerId,
        quantity: quantity.toString(),
        unitPrice: product.price.toString(),
      },
    })

    return NextResponse.json({
      sessionId: stripeSession.id,
      url: stripeSession.url
    })
  } catch (error) {
    console.error("Checkout error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}