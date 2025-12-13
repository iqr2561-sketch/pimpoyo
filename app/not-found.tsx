'use client'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-slate-900 mb-4">404</h2>
        <p className="text-slate-600 mb-6">Página no encontrada</p>
        <a href="/" className="text-indigo-600 hover:text-indigo-700 font-semibold">
          Volver al inicio
        </a>
      </div>
    </div>
  )
}

