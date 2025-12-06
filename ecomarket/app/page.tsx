import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <header className="border-b border-green-200 bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent hover:from-green-700 hover:to-emerald-700 transition-all duration-300 flex items-center gap-2">
            🌿 WaliTake
          </Link>
          <nav className="flex gap-4 items-center">
            <Link href="/marketplace" className="text-gray-600 hover:text-green-600 font-medium transition-all duration-300 hover:scale-105">
              🛍️ Marketplace
            </Link>
            <Link href="/auth/login" className="text-gray-600 hover:text-green-600 font-medium transition-all duration-300 hover:scale-105">
              🚀 Iniciar Sesión
            </Link>
            <Link href="/auth/register">
              <Button variant="outline" className="border-green-300 text-green-700 hover:bg-green-50 transition-all duration-300 shadow-sm hover:shadow-md">
                🌱 Registrarse
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-emerald-400/10 rounded-3xl"></div>
        <div className="relative z-10">
          <div className="text-6xl mb-6 animate-bounce">🌍</div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Materiales Reciclables
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent block animate-pulse">
              para un Futuro Sostenible
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Conecta con empresas para comprar y vender residuos reutilizables.
            Cáscaras de papa, plásticos, vidrios, metales y más. ¡Únete al movimiento ecológico!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/marketplace">
              <Button size="lg" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 px-8 py-3 text-lg">
                🛍️ Explorar Productos
              </Button>
            </Link>
            <Link href="/products/new">
              <Button size="lg" variant="outline" className="border-2 border-green-300 text-green-700 hover:bg-green-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 px-8 py-3 text-lg">
                💰 Vender Materiales
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          🌱 ¿Cómo Funciona WaliTake?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-white/70 backdrop-blur-sm border-green-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
            <CardHeader className="text-center pb-4">
              <div className="text-5xl mb-4 group-hover:animate-bounce">🌿</div>
              <CardTitle className="text-green-600 text-xl group-hover:text-green-700 transition-colors duration-300">
                1. Regístrate
              </CardTitle>
              <CardDescription className="text-gray-600">
                Crea tu cuenta como empresa o usuario individual
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-700">Accede a nuestra plataforma de manera gratuita y segura.</p>
            </CardContent>
          </Card>
          <Card className="bg-white/70 backdrop-blur-sm border-green-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
            <CardHeader className="text-center pb-4">
              <div className="text-5xl mb-4 group-hover:animate-bounce">🔄</div>
              <CardTitle className="text-green-600 text-xl group-hover:text-green-700 transition-colors duration-300">
                2. Publica o Busca
              </CardTitle>
              <CardDescription className="text-gray-600">
                Vende tus excedentes o encuentra materiales para tu negocio
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-700">Sube tus productos con fotos, descripción y ubicación.</p>
            </CardContent>
          </Card>
          <Card className="bg-white/70 backdrop-blur-sm border-green-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
            <CardHeader className="text-center pb-4">
              <div className="text-5xl mb-4 group-hover:animate-bounce">💚</div>
              <CardTitle className="text-green-600 text-xl group-hover:text-green-700 transition-colors duration-300">
                3. Compra y Vende
              </CardTitle>
              <CardDescription className="text-gray-600">
                Realiza transacciones seguras con integración de pagos
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-700">Pagos seguros con Stripe. Entrega directa entre empresas.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="text-6xl mb-6 animate-pulse">🌍</div>
          <h2 className="text-4xl font-bold mb-6">
            Únete a la Economía Circular
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Ayuda al planeta reutilizando materiales que de otra manera se desperdiciarían.
            Cada transacción es un paso hacia un futuro más sostenible.
          </p>
          <Link href="/auth/register">
            <Button size="lg" className="bg-white text-green-600 hover:bg-green-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 px-8 py-4 text-lg font-semibold">
              🚀 Comenzar Ahora - ¡Es Gratis!
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                🌱 WaliTake
              </h3>
              <p className="text-gray-300">
                Plataforma líder en comercio de materiales reciclables.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Enlaces Rápidos</h4>
              <ul className="space-y-2 text-gray-300">
                <li><Link href="/marketplace" className="hover:text-green-400 transition-colors duration-300">Marketplace</Link></li>
                <li><Link href="/products/new" className="hover:text-green-400 transition-colors duration-300">Vender Productos</Link></li>
                <li><Link href="/auth/login" className="hover:text-green-400 transition-colors duration-300">Iniciar Sesión</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Categorías</h4>
              <ul className="space-y-2 text-gray-300">
                <li>🌱 Orgánicos</li>
                <li>🔄 Plásticos</li>
                <li>🥃 Vidrios</li>
                <li>⚡ Metales</li>
                <li>📄 Papel</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contacto</h4>
              <p className="text-gray-300 text-sm">
                💚 Juntos por un planeta más verde<br/>
                Soporte: support@ecomarket.com
              </p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 WaliTake. Todos los derechos reservados. ♻️ Reduce, Reutiliza, Recicla.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
