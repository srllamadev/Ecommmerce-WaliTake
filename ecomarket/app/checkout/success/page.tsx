'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function CheckoutSuccess() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [orderDetails, setOrderDetails] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const sessionId = searchParams.get('session_id')

  useEffect(() => {
    if (sessionId) {
      // En un escenario real, verificarías la sesión con Stripe
      // Por ahora, solo mostraremos un mensaje de éxito
      setOrderDetails({
        id: sessionId,
        status: 'completed'
      })
    }
    setLoading(false)
  }, [sessionId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">🌱</div>
          <p className="text-green-600 font-medium">Verificando pago...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-white/70 backdrop-blur-sm border-green-200 shadow-xl">
            <CardHeader className="text-center bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-t-lg">
              <div className="text-6xl mb-4">✅</div>
              <CardTitle className="text-3xl">¡Compra Exitosa!</CardTitle>
              <CardDescription className="text-green-100">
                Tu pago ha sido procesado correctamente
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 text-center">
              <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">
                    🎉 ¡Felicitaciones!
                  </h3>
                  <p className="text-green-700">
                    Has contribuido a un planeta más verde al adquirir materiales reciclables.
                    Tu compra ayudará a reducir residuos y promover la economía circular.
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">
                    📦 Detalles de la Compra
                  </h3>
                  <p className="text-blue-700">
                    ID de Sesión: <code className="bg-blue-100 px-2 py-1 rounded text-sm">{sessionId}</code>
                  </p>
                  <p className="text-blue-700 mt-2">
                    El vendedor ha sido notificado y procesará tu pedido pronto.
                  </p>
                </div>

                <div className="flex gap-4 justify-center">
                  <Link href="/dashboard">
                    <Button className="bg-green-600 hover:bg-green-700 text-white transition-all duration-300">
                      📊 Ver Mis Compras
                    </Button>
                  </Link>
                  <Link href="/marketplace">
                    <Button variant="outline" className="border-green-300 text-green-700 hover:bg-green-50 transition-all duration-300">
                      🛍️ Seguir Comprando
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}