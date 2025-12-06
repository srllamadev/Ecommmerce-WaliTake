"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function NewProduct() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    quantity: "",
    unit: "",
    category: "",
    condition: "",
    city: "",
    state: "",
    country: "",
    images: [] as string[],
  })

  if (status === "loading") {
    return <div className="container mx-auto px-4 py-8">Cargando...</div>
  }

  if (!session) {
    router.push("/auth/login")
    return null
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price),
          quantity: parseInt(formData.quantity),
          unit: formData.unit,
          category: formData.category,
          condition: formData.condition,
          images: JSON.stringify(formData.images),
          location: {
            city: formData.city,
            state: formData.state,
            country: formData.country,
          },
        }),
      })

      if (response.ok) {
        router.push("/dashboard")
      } else {
        alert("Error al crear el producto")
      }
    } catch (error) {
      console.error("Error creating product:", error)
      alert("Error al crear el producto")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-green-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent hover:from-green-700 hover:to-emerald-700 transition-all duration-300 flex items-center gap-2">
              🌱 WaliTake
            </Link>
            <div className="flex gap-3">
              <Link href="/marketplace">
                <Button variant="outline" className="border-green-300 text-green-700 hover:bg-green-50 transition-all duration-300">
                  🛍️ Ver Marketplace
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" className="border-green-300 text-green-700 hover:bg-green-50 transition-all duration-300">
                  📊 Mi Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto bg-white/70 backdrop-blur-sm border-green-200 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-2xl">
              ➕ Publicar Nuevo Producto
            </CardTitle>
            <CardDescription className="text-green-100">
              Completa la información de tu material reciclable y contribuye al medio ambiente
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="title">Título del Producto</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Precio por Unidad</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="quantity">Cantidad Disponible</Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="unit">Unidad de Medida</Label>
                  <Select value={formData.unit} onValueChange={(value) => handleSelectChange("unit", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar unidad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">Kilogramos</SelectItem>
                      <SelectItem value="tonelada">Toneladas</SelectItem>
                      <SelectItem value="litro">Litros</SelectItem>
                      <SelectItem value="unidad">Unidad</SelectItem>
                      <SelectItem value="metro cubico">Metro Cúbico</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="category">Categoría</Label>
                  <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="organico">Orgánico</SelectItem>
                      <SelectItem value="plastico">Plástico</SelectItem>
                      <SelectItem value="vidrio">Vidrio</SelectItem>
                      <SelectItem value="metal">Metal</SelectItem>
                      <SelectItem value="papel">Papel</SelectItem>
                      <SelectItem value="textil">Textil</SelectItem>
                      <SelectItem value="electronico">Electrónico</SelectItem>
                      <SelectItem value="otros">Otros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="condition">Estado del Material</Label>
                <Select value={formData.condition} onValueChange={(value) => handleSelectChange("condition", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nuevo">Nuevo</SelectItem>
                    <SelectItem value="usado">Usado</SelectItem>
                    <SelectItem value="reciclable">Reciclable</SelectItem>
                    <SelectItem value="residuo">Residuo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">Ciudad</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="state">Estado</Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="country">País</Label>
                  <Input
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="images">URLs de Imágenes (opcional)</Label>
                <Textarea
                  id="images"
                  placeholder="Una URL por línea"
                  rows={3}
                  onChange={(e) => {
                    const urls = e.target.value.split('\n').filter(url => url.trim())
                    setFormData({ ...formData, images: urls })
                  }}
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin">🌱</div>
                    Publicando...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    🌍 Publicar Producto
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}