"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { getStripe } from "@/lib/stripe"

interface Product {
  id: string
  title: string
  description: string
  price: number
  quantity: number
  unit: string
  category: string
  condition: string
  images: string
  location: string
  seller: {
    id: string
    name: string
    businessName?: string
    location: string
    phone?: string
    email: string
  }
}

export default function ProductDetail() {
  const params = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [contactMessage, setContactMessage] = useState("")
  const [contactLoading, setContactLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchProduct()
    }
  }, [params.id])

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setProduct(data)
      }
    } catch (error) {
      console.error("Error fetching product:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCheckout = async () => {
    if (!product) return

    setCheckoutLoading(true)
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          quantity: quantity,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.error || 'Error al procesar el pago')
        return
      }

      // Redirigir a Stripe Checkout
      const stripe = await getStripe()
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({
          sessionId: data.sessionId,
        })

        if (error) {
          console.error('Stripe redirect error:', error)
          alert('Error al redirigir al checkout')
        }
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Error al procesar la compra')
    } finally {
      setCheckoutLoading(false)
    }
  }

  const handleContact = async () => {
    if (!product || !contactMessage.trim()) return

    setContactLoading(true)
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.id,
          message: contactMessage,
        }),
      })

      if (response.ok) {
        alert("Mensaje enviado exitosamente")
        setContactMessage("")
        setDialogOpen(false)
      } else {
        alert("Error al enviar el mensaje")
      }
    } catch (error) {
      console.error("Contact error:", error)
      alert("Error al enviar el mensaje")
    } finally {
      setContactLoading(false)
    }
  }

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Cargando...</div>
  }

  if (!product) {
    return <div className="container mx-auto px-4 py-8">Producto no encontrado</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="text-2xl font-bold text-green-600">
            EcoMarket
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Images */}
          <div className="space-y-4">
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[0]}
                alt={product.title}
                className="w-full h-96 object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Sin imagen</span>
              </div>
            )}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(1).map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${product.title} ${index + 2}`}
                    className="w-full h-20 object-cover rounded cursor-pointer"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
              <p className="text-gray-600 mb-4">{product.description}</p>

              <div className="flex gap-2 mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {product.category}
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                  {product.condition}
                </span>
              </div>
            </div>

            {/* Price and Quantity */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-3xl font-bold text-green-600">
                    ${product.price}/{product.unit}
                  </span>
                  <span className="text-sm text-gray-500">
                    {product.quantity} disponible
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="quantity">Cantidad</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      max={product.quantity}
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    />
                  </div>

                  <div className="text-lg font-semibold">
                    Total: ${(product.price * quantity).toFixed(2)}
                  </div>

                  <Button
                    onClick={handleCheckout}
                    disabled={checkoutLoading || quantity > product.quantity}
                    className="w-full"
                    size="lg"
                  >
                    {checkoutLoading ? "Procesando..." : "Comprar Ahora"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Contact Seller */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  Contactar al Vendedor
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Contactar a {product.seller.name}</DialogTitle>
                  <DialogDescription>
                    Envía un mensaje al vendedor sobre este producto.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="message">Mensaje</Label>
                    <Textarea
                      id="message"
                      placeholder="Escribe tu mensaje aquí..."
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      rows={4}
                    />
                  </div>
                  <Button
                    onClick={handleContact}
                    disabled={contactLoading || !contactMessage.trim()}
                    className="w-full"
                  >
                    {contactLoading ? "Enviando..." : "Enviar Mensaje"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Seller Info */}
            <Card>
              <CardHeader>
                <CardTitle>Vendedor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-semibold">
                    {product.seller.businessName || product.seller.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    📍 {JSON.parse(product.seller.location).city}, {JSON.parse(product.seller.location).state}
                  </p>
                  {product.seller.phone && (
                    <p className="text-sm text-gray-600">
                      📞 {product.seller.phone}
                    </p>
                  )}
                  <p className="text-sm text-gray-600">
                    ✉️ {product.seller.email}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}