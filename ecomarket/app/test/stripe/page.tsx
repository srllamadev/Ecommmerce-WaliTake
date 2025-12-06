export default function StripeTestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              🧪 Pruebas de Pago con Stripe
            </h1>
            <p className="text-gray-600">
              Información para probar el flujo de compra usando tarjetas de prueba de Stripe
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Tarjetas de Prueba */}
            <div className="bg-white/70 backdrop-blur-sm border border-green-200 rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-semibold text-green-800 mb-4">
                💳 Tarjetas de Prueba
              </h2>
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded p-4">
                  <h3 className="font-semibold text-green-800">Pago Exitoso</h3>
                  <p className="text-sm text-green-700 font-mono">4242 4242 4242 4242</p>
                  <p className="text-xs text-green-600">Cualquier fecha futura, cualquier CVC</p>
                </div>

                <div className="bg-red-50 border border-red-200 rounded p-4">
                  <h3 className="font-semibold text-red-800">Pago Rechazado</h3>
                  <p className="text-sm text-red-700 font-mono">4000 0000 0000 0002</p>
                  <p className="text-xs text-red-600">Cualquier fecha futura, cualquier CVC</p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
                  <h3 className="font-semibold text-yellow-800">Requiere Autenticación</h3>
                  <p className="text-sm text-yellow-700 font-mono">4000 0025 0000 3155</p>
                  <p className="text-xs text-yellow-600">Cualquier fecha futura, cualquier CVC</p>
                </div>
              </div>
            </div>

            {/* Instrucciones */}
            <div className="bg-white/70 backdrop-blur-sm border border-green-200 rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-semibold text-green-800 mb-4">
                📋 Cómo Probar
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">1.</span>
                  <div>
                    <p className="font-medium">Ve al Marketplace</p>
                    <p className="text-sm text-gray-600">Navega a /marketplace y selecciona un producto</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">2.</span>
                  <div>
                    <p className="font-medium">Haz clic en "Comprar Ahora"</p>
                    <p className="text-sm text-gray-600">Serás redirigido a Stripe Checkout</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">3.</span>
                  <div>
                    <p className="font-medium">Usa una tarjeta de prueba</p>
                    <p className="text-sm text-gray-600">Ingresa los datos de la tarjeta de arriba</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">4.</span>
                  <div>
                    <p className="font-medium">Completa el pago</p>
                    <p className="text-sm text-gray-600">Serás redirigido a la página de éxito</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Información Técnica */}
          <div className="mt-8 bg-white/70 backdrop-blur-sm border border-green-200 rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-semibold text-green-800 mb-4">
              🔧 Información Técnica
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Flujo de Compra</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Verificación de stock disponible</li>
                  <li>• Creación de sesión de Stripe Checkout</li>
                  <li>• Redirección al checkout de Stripe</li>
                  <li>• Procesamiento del pago</li>
                  <li>• Webhook actualiza inventario</li>
                  <li>• Creación de orden en base de datos</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2">URLs Importantes</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• <code>/api/checkout</code> - Crear sesión de pago</li>
                  <li>• <code>/api/stripe/webhook</code> - Webhook de Stripe</li>
                  <li>• <code>/checkout/success</code> - Página de éxito</li>
                  <li>• <code>/marketplace</code> - Página de productos</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Nota Importante */}
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="text-yellow-600 text-xl">⚠️</span>
              <div>
                <h3 className="font-semibold text-yellow-800">Nota Importante</h3>
                <p className="text-yellow-700 text-sm">
                  Estas son tarjetas de prueba de Stripe. No se procesan pagos reales y son completamente seguras para usar en desarrollo.
                  Para producción, necesitarás configurar claves reales de Stripe y un webhook endpoint público.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}