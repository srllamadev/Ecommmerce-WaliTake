"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Product {
  id: string
  title: string
  price: number
  quantity: number
  unit: string
  status: string
  createdAt: string
  seller: {
    id: string
    name: string
  }
}

interface Order {
  id: string
  quantity: number
  totalPrice: number
  status: string
  createdAt: string
  buyerId: string
  sellerId: string
  product: {
    title: string
    price: number
    unit: string
  }
  seller?: {
    name: string
  }
  buyer?: {
    name: string
  }
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [successMessage, setSuccessMessage] = useState("")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login")
    } else if (status === "authenticated") {
      fetchDashboardData()
      
      // Check for success message from URL params
      const urlParams = new URLSearchParams(window.location.search)
      if (urlParams.get("success") === "true") {
        setSuccessMessage("¡Compra realizada exitosamente!")
        // Clean URL
        router.replace("/dashboard")
      }
    }
  }, [status, router])

  const fetchDashboardData = async () => {
    try {
      // Fetch user's products
      const productsResponse = await fetch("/api/products?limit=10")
      const productsData = await productsResponse.json()
      // Filter products by current user
      const userProducts = productsData.products.filter(
        (p: Product) => p.seller.id === session?.user?.id
      )
      setProducts(userProducts)

      // Fetch orders
      const ordersResponse = await fetch("/api/orders")
      const ordersData = await ordersResponse.json()
      setOrders(ordersData)

      // Fetch contacts
      const contactsResponse = await fetch("/api/contacts")
      const contactsData = await contactsResponse.json()
      setContacts(contactsData)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este producto?")) {
      return
    }

    try {
      const response = await fetch(`/api/products?id=${productId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        // Refresh products
        fetchDashboardData()
      } else {
        alert("Error al eliminar el producto")
      }
    } catch (error) {
      console.error("Error deleting product:", error)
      alert("Error al eliminar el producto")
    }
  }

  if (status === "loading" || loading) {
    return <div className="container mx-auto px-4 py-8">Cargando...</div>
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-green-200 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent hover:from-green-700 hover:to-emerald-700 transition-all duration-300 flex items-center gap-2">
            🌱 EcoMarket
          </Link>
          <div className="flex gap-4 items-center">
            <span className="text-gray-700 font-medium">Hola, {session.user.name}</span>
            <Link href="/marketplace">
              <Button variant="outline" className="border-green-300 text-green-700 hover:bg-green-50 hover:border-green-400 transition-all duration-300">
                Ir al Marketplace
              </Button>
            </Link>
            <Button variant="outline" onClick={() => signOut()} className="border-gray-300 hover:bg-gray-50 transition-all duration-300">
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-800 px-4 py-3 rounded-lg mb-4 shadow-sm animate-in slide-in-from-top-2 duration-500">
          ✅ {successMessage}
        </div>
      )}

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* My Products */}
          <Card className="lg:col-span-2 bg-white/70 backdrop-blur-sm border-green-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-t-lg">
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  📦 Mis Productos
                </CardTitle>
                <Link href="/products/new">
                  <Button size="sm" className="bg-white text-green-600 hover:bg-green-50 border-green-300 transition-all duration-300">
                    ➕ Agregar Producto
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {products.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">🌱</div>
                  <p className="text-gray-500 mb-4">No tienes productos publicados aún.</p>
                  <Link href="/products/new">
                    <Button className="bg-green-600 hover:bg-green-700 text-white transition-all duration-300">
                      Publicar tu primer producto
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {products.map((product) => (
                    <div key={product.id} className="flex justify-between items-center border-b border-green-100 pb-4 hover:bg-green-50/50 rounded-lg p-3 transition-all duration-300">
                      <div>
                        <p className="font-semibold text-gray-800">{product.title}</p>
                        <p className="text-sm text-gray-600">
                          💰 ${product.price}/{product.unit} • 📦 {product.quantity} disponible
                        </p>
                      </div>
                      <div className="flex gap-2 items-center">
                        <Link href={`/products/${product.id}/edit`}>
                          <Button size="sm" variant="outline" className="border-green-300 text-green-700 hover:bg-green-50 transition-all duration-300">
                            ✏️ Editar
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteProduct(product.id)}
                          className="bg-red-500 hover:bg-red-600 transition-all duration-300"
                        >
                          🗑️ Eliminar
                        </Button>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          product.status === "available"
                            ? "bg-green-100 text-green-800 border border-green-300"
                            : "bg-gray-100 text-gray-800 border border-gray-300"
                        }`}>
                          {product.status === "available" ? "✅ Disponible" : "⏸️ Pausado"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* My Orders */}
          <Card className="bg-white/70 backdrop-blur-sm border-green-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                🛒 Mis Compras
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {orders.filter(order => order.buyerId === session.user.id).length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">🛒</div>
                  <p className="text-gray-500">No tienes compras aún.</p>
                  <p className="text-sm text-gray-400 mt-2">¡Explora el marketplace para encontrar materiales reciclables!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.filter(order => order.buyerId === session.user.id).map((order) => (
                    <div key={order.id} className="border-b border-blue-100 pb-4 hover:bg-blue-50/50 rounded-lg p-3 transition-all duration-300">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-gray-800">{order.product.title}</p>
                          <p className="text-sm text-gray-600">
                            📦 Cantidad: {order.quantity} • 💰 Total: ${order.totalPrice}
                          </p>
                          <p className="text-xs text-gray-500">
                            📅 {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          order.status === "completed"
                            ? "bg-green-100 text-green-800 border border-green-300"
                            : order.status === "pending"
                            ? "bg-yellow-100 text-yellow-800 border border-yellow-300"
                            : "bg-gray-100 text-gray-800 border border-gray-300"
                        }`}>
                          {order.status === "completed" ? "✅ Completada" : order.status === "pending" ? "⏳ Pendiente" : "❌ Cancelada"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* My Sales */}
          <Card className="bg-white/70 backdrop-blur-sm border-green-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                💰 Mis Ventas
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {orders.filter(order => order.sellerId === session.user.id).length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">💰</div>
                  <p className="text-gray-500">No tienes ventas aún.</p>
                  <p className="text-sm text-gray-400 mt-2">¡Publica productos para empezar a vender!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.filter(order => order.sellerId === session.user.id).map((order) => (
                    <div key={order.id} className="border-b border-emerald-100 pb-4 hover:bg-emerald-50/50 rounded-lg p-3 transition-all duration-300">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-gray-800">{order.product.title}</p>
                          <p className="text-sm text-gray-600">
                            📦 Cantidad: {order.quantity} • 💰 Total: ${order.totalPrice}
                          </p>
                          <p className="text-xs text-gray-500">
                            📅 {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          order.status === "completed"
                            ? "bg-green-100 text-green-800 border border-green-300"
                            : order.status === "pending"
                            ? "bg-yellow-100 text-yellow-800 border border-yellow-300"
                            : "bg-gray-100 text-gray-800 border border-gray-300"
                        }`}>
                          {order.status === "completed" ? "✅ Completada" : order.status === "pending" ? "⏳ Pendiente" : "❌ Cancelada"}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        👤 Comprador: {order.buyer?.name}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* My Messages */}
          <Card className="lg:col-span-2 bg-white/70 backdrop-blur-sm border-green-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                💬 Mensajes Recibidos
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {contacts.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">💬</div>
                  <p className="text-gray-500">No tienes mensajes aún.</p>
                  <p className="text-sm text-gray-400 mt-2">Los interesados en tus productos te contactarán aquí.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {contacts.map((contact) => (
                    <div key={contact.id} className="border-b border-purple-100 pb-4 hover:bg-purple-50/50 rounded-lg p-3 transition-all duration-300">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-gray-800">📦 Re: {contact.product.title}</p>
                          <p className="text-sm text-gray-600">
                            👤 De: {contact.sender.name} ({contact.sender.email})
                          </p>
                          <p className="text-sm mt-2 bg-gray-50 p-3 rounded-lg">{contact.message}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            📅 {new Date(contact.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}