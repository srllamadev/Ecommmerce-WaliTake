"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
    name: string
    businessName?: string
  }
}

export default function Marketplace() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [city, setCity] = useState("")
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [search, category, city])

  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams()
      if (search) params.append("search", search)
      if (category && category !== "all") params.append("category", category)
      if (city) params.append("city", city)

      const response = await fetch(`/api/products?${params}`)
      const data = await response.json()
      setProducts(data.products || [])
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleQuickBuy = async (productId: string) => {
    setCheckoutLoading(productId)
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: productId,
          quantity: 1, // Compra rápida por defecto 1 unidad
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.error || 'Error al procesar el pago')
        return
      }

      // Importar Stripe dinámicamente solo cuando se necesite
      const { getStripe } = await import('@/lib/stripe')
      const stripe = await getStripe()

      if (stripe) {
        const { error } = await stripe.redirectToCheckout({
          sessionId: data.sessionId,
        })

        if (error) {
          console.error('Stripe redirect error:', error)
          alert('Error al redirigir al checkout')
        }
      } else {
        // Fallback: redirigir manualmente si Stripe no está disponible
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Error al procesar la compra')
    } finally {
      setCheckoutLoading(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">🌱</div>
          <p className="text-green-600 font-medium">Cargando marketplace...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-green-200 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-6">
            <Link href="/" className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent hover:from-green-700 hover:to-emerald-700 transition-all duration-300 flex items-center gap-2">
              🌿 EcoMarket
            </Link>
            <div className="flex gap-3">
              <Link href="/test/stripe">
                <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50 transition-all duration-300">
                  🧪 Probar Pagos
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" className="border-green-300 text-green-700 hover:bg-green-50 transition-all duration-300">
                  📊 Mi Dashboard
                </Button>
              </Link>
              <Link href="/products/new">
                <Button className="bg-green-600 hover:bg-green-700 text-white transition-all duration-300 shadow-lg hover:shadow-xl">
                  ➕ Vender Producto
                </Button>
              </Link>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-green-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              🔍 Filtrar Productos
            </h2>
            <div className="flex gap-4 flex-wrap">
              <div className="flex-1 min-w-64">
                <Input
                  placeholder="🔍 Buscar productos..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border-green-300 focus:border-green-500 focus:ring-green-500 transition-all duration-300"
                />
              </div>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="max-w-xs border-green-300 focus:border-green-500 transition-all duration-300">
                  <SelectValue placeholder="📂 Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">🌍 Todas las categorías</SelectItem>
                  <SelectItem value="organico">🌱 Orgánico</SelectItem>
                  <SelectItem value="plastico">🔄 Plástico</SelectItem>
                  <SelectItem value="vidrio">🥃 Vidrio</SelectItem>
                  <SelectItem value="metal">⚡ Metal</SelectItem>
                  <SelectItem value="papel">📄 Papel</SelectItem>
                  <SelectItem value="textil">👕 Textil</SelectItem>
                  <SelectItem value="electronico">📱 Electrónico</SelectItem>
                  <SelectItem value="otros">❓ Otros</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex-1 min-w-48">
                <Input
                  placeholder="📍 Ciudad"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="border-green-300 focus:border-green-500 focus:ring-green-500 transition-all duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Products Grid */}
      <main className="container mx-auto px-4 py-8">
        {products.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-6">🌱</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">No se encontraron productos</h2>
            <p className="text-gray-600 mb-6">Intenta cambiar los filtros de búsqueda o sé el primero en publicar un producto reciclable.</p>
            <Link href="/products/new">
              <Button className="bg-green-600 hover:bg-green-700 text-white transition-all duration-300 shadow-lg hover:shadow-xl">
                ➕ Publicar Primer Producto
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                🛍️ Productos Disponibles
              </h1>
              <p className="text-gray-600">
                {products.length} producto{products.length !== 1 ? 's' : ''} encontrado{products.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="bg-white/70 backdrop-blur-sm border-green-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                  <CardHeader className="pb-3">
                    {product.images && JSON.parse(product.images).length > 0 ? (
                      <div className="relative overflow-hidden rounded-t-lg">
                        <img
                          src={JSON.parse(product.images)[0]}
                          alt={product.title}
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          ♻️ Reciclable
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-green-100 to-emerald-100 rounded-t-lg flex items-center justify-center">
                        <div className="text-4xl">📦</div>
                      </div>
                    )}
                    <CardTitle className="text-lg text-gray-800 group-hover:text-green-700 transition-colors duration-300">
                      {product.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      🏢 {product.seller.businessName || product.seller.name} • 📍 {JSON.parse(product.location).city}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        💰 ${product.price}/{product.unit}
                      </span>
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        📦 {product.quantity} disponible
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.category === 'organico' ? 'bg-green-100 text-green-800' :
                        product.category === 'plastico' ? 'bg-blue-100 text-blue-800' :
                        product.category === 'vidrio' ? 'bg-purple-100 text-purple-800' :
                        product.category === 'metal' ? 'bg-gray-100 text-gray-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {product.category === 'organico' ? '🌱 Orgánico' :
                         product.category === 'plastico' ? '🔄 Plástico' :
                         product.category === 'vidrio' ? '🥃 Vidrio' :
                         product.category === 'metal' ? '⚡ Metal' :
                         product.category === 'papel' ? '📄 Papel' :
                         product.category === 'textil' ? '👕 Textil' :
                         product.category === 'electronico' ? '📱 Electrónico' :
                         '❓ Otros'}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.condition === 'nuevo' ? 'bg-green-100 text-green-800' :
                        product.condition === 'usado' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {product.condition === 'nuevo' ? '✨ Nuevo' :
                         product.condition === 'usado' ? '🔄 Usado' :
                         '♻️ Reciclable'}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button
                        onClick={() => handleQuickBuy(product.id)}
                        disabled={checkoutLoading === product.id || product.quantity < 1}
                        className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        {checkoutLoading === product.id ? '🛒 Procesando...' : '🛒 Comprar Ahora'}
                      </Button>
                      <Link href={`/products/${product.id}`} className="flex-1">
                        <Button variant="outline" className="w-full border-green-300 text-green-700 hover:bg-green-50 transition-all duration-300">
                          👀 Ver Detalles
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}