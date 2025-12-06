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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-green-600">
            EcoMarket
          </Link>
          <div className="flex gap-4 items-center">
            <span>Hola, {session.user.name}</span>
            <Link href="/marketplace">
              <Button variant="outline">Ir al Marketplace</Button>
            </Link>
            <Button variant="outline" onClick={() => signOut()}>
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* My Products */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Mis Productos</CardTitle>
                <Link href="/products/new">
                  <Button size="sm">Agregar Producto</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {products.length === 0 ? (
                <p className="text-gray-500">No tienes productos publicados.</p>
              ) : (
                <div className="space-y-4">
                  {products.map((product) => (
                    <div key={product.id} className="flex justify-between items-center border-b pb-2">
                      <div>
                        <p className="font-semibold">{product.title}</p>
                        <p className="text-sm text-gray-600">
                          ${product.price}/{product.unit} • {product.quantity} disponible
                        </p>
                      </div>
                      <div className="flex gap-2 items-center">
                        <Link href={`/products/${product.id}/edit`}>
                          <Button size="sm" variant="outline">Editar</Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          Eliminar
                        </Button>
                        <span className={`px-2 py-1 rounded text-xs ${
                          product.status === "available"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          {product.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* My Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Mis Compras</CardTitle>
            </CardHeader>
            <CardContent>
              {orders.filter(order => order.buyerId === session.user.id).length === 0 ? (
                <p className="text-gray-500">No tienes compras.</p>
              ) : (
                <div className="space-y-4">
                  {orders.filter(order => order.buyerId === session.user.id).map((order) => (
                    <div key={order.id} className="border-b pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">{order.product.title}</p>
                          <p className="text-sm text-gray-600">
                            Cantidad: {order.quantity} • Total: ${order.totalPrice}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${
                          order.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : order.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* My Sales */}
          <Card>
            <CardHeader>
              <CardTitle>Mis Ventas</CardTitle>
            </CardHeader>
            <CardContent>
              {orders.filter(order => order.sellerId === session.user.id).length === 0 ? (
                <p className="text-gray-500">No tienes ventas.</p>
              ) : (
                <div className="space-y-4">
                  {orders.filter(order => order.sellerId === session.user.id).map((order) => (
                    <div key={order.id} className="border-b pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">{order.product.title}</p>
                          <p className="text-sm text-gray-600">
                            Cantidad: {order.quantity} • Total: ${order.totalPrice}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${
                          order.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : order.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Comprador: {order.buyer?.name}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* My Messages */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Mensajes Recibidos</CardTitle>
            </CardHeader>
            <CardContent>
              {contacts.length === 0 ? (
                <p className="text-gray-500">No tienes mensajes.</p>
              ) : (
                <div className="space-y-4">
                  {contacts.map((contact) => (
                    <div key={contact.id} className="border-b pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">Re: {contact.product.title}</p>
                          <p className="text-sm text-gray-600">
                            De: {contact.sender.name} ({contact.sender.email})
                          </p>
                          <p className="text-sm mt-2">{contact.message}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(contact.createdAt).toLocaleDateString()}
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