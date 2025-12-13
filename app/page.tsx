'use client'

import { useState, FormEvent, useMemo } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export default function Home() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [loginData, setLoginData] = useState({
    email: 'test@example.com',
    password: 'password123',
  })

  const [registerData, setRegisterData] = useState({
    email: 'test@example.com',
    password: 'password123',
    name: 'Usuario de Prueba',
    companyName: 'Empresa de Prueba',
    companyCuit: '20-12345678-9',
  })

  const isDevMode = useMemo(() => process.env.NODE_ENV !== 'production', [])

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      const result = await signIn('credentials', {
        email: loginData.email,
        password: loginData.password,
        redirect: false,
      })

      if (result?.error) {
        setError('Credenciales inválidas')
      } else {
        setSuccess('¡Listo! Entrando...')
        router.push('/dashboard')
      }
    } catch (error) {
      setError('Error al iniciar sesión')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Error al registrar')
      }

      // Auto login después del registro
      const result = await signIn('credentials', {
        email: registerData.email,
        password: registerData.password,
        redirect: false,
      })

      if (result?.error) {
        setError('Registro exitoso, pero error al iniciar sesión')
      } else {
        setSuccess('¡Cuenta creada! Entrando...')
        router.push('/dashboard')
      }
    } catch (error: any) {
      setError(error.message || 'Error al registrar usuario')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDevLogin = async () => {
    setIsLoading(true)
    setError('')
    setSuccess('')
    try {
      await fetch('/api/auth/dev-login', { method: 'POST' })
      const result = await signIn('credentials', {
        email: 'demo@factura.dev',
        password: 'demo1234',
        redirect: false,
      })
      if (result?.error) {
        setError('No se pudo entrar en modo demo')
      } else {
        setSuccess('Entrando en modo demo...')
        router.push('/dashboard')
      }
    } catch (err) {
      setError('Error al activar modo demo')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden relative">
      <div className="absolute inset-0">
        <div className="absolute -left-20 -top-20 w-96 h-96 bg-blue-600 opacity-30 blur-3xl animate-pulse" />
        <div className="absolute right-0 top-10 w-80 h-80 bg-purple-600 opacity-25 blur-3xl animate-[pulse_12s_ease-in-out_infinite]" />
        <div className="absolute -bottom-10 left-1/4 w-72 h-72 bg-cyan-500 opacity-30 blur-3xl animate-[pulse_10s_ease-in-out_infinite]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-medium border border-white/10">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              Plataforma de facturación + venta móvil
            </span>
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
              Factura rápida, venta ágil y control total en un solo lugar.
            </h1>
            <p className="text-slate-200/80 text-lg">
              Accede al panel web, registra ventas desde el móvil y genera documentos al instante.
              Diseñamos un login moderno con animación para que entrar sea tan rápido como cobrar.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-white/5 border-white/10 text-white">
                <p className="text-sm text-slate-200/80">Modo móvil</p>
                <p className="text-2xl font-semibold mt-1">Venta rápida</p>
                <p className="text-xs text-slate-200/70 mt-1">
                  Acceso directo a `/mobile` para cobrar en mostrador.
                </p>
              </Card>
              <Card className="bg-white/5 border-white/10 text-white">
                <p className="text-sm text-slate-200/80">Documentos</p>
                <p className="text-2xl font-semibold mt-1">Facturas y remitos</p>
                <p className="text-xs text-slate-200/70 mt-1">
                  IVA, totales y PDF listos para enviar.
                </p>
              </Card>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/mobile">
                <Button variant="secondary">Ir a venta móvil</Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="ghost" className="border border-white/20 hover:border-white/40">
                  Ver panel (requiere sesión)
                </Button>
              </Link>
            </div>
          </div>

          <Card className="bg-white/95 text-slate-900 shadow-[0_20px_60px_-28px_rgba(59,130,246,0.55)] border border-slate-200/80 relative overflow-hidden p-8 sm:p-10">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 pointer-events-none" />
            <div className="absolute -right-16 -top-16 w-56 h-56 bg-blue-500/10 blur-3xl" />
            <div className="absolute -left-20 bottom-0 w-64 h-64 bg-purple-500/10 blur-3xl" />
            <div className="relative space-y-6">
              <div className="flex border border-slate-200/70 rounded-full overflow-hidden bg-slate-100/80">
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(true)
                    setError('')
                    setSuccess('')
                  }}
                  className={`flex-1 py-3 text-center font-medium transition ${
                    isLogin
                      ? 'text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-inner'
                      : 'text-slate-600'
                  }`}
                >
                  Iniciar Sesión
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(false)
                    setError('')
                    setSuccess('')
                  }}
                  className={`flex-1 py-3 text-center font-medium transition ${
                    !isLogin
                      ? 'text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-inner'
                      : 'text-slate-600'
                  }`}
                >
                  Registrarse
                </button>
              </div>

              {(error || success) && (
                <div
                  className={`mb-4 p-3 rounded-lg text-sm ${
                    error
                      ? 'bg-red-50 border border-red-200 text-red-700'
                      : 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                  }`}
                >
                  {error || success}
                </div>
              )}

              {isLogin ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <Input
                    label="Email"
                    type="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    required
                    autoComplete="email"
                  />
                  <Input
                    label="Contraseña"
                    type="password"
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({
                        ...loginData,
                        password: e.target.value,
                      })
                    }
                    required
                    autoComplete="current-password"
                  />
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Acceso seguro con NextAuth</span>
                    <span className="inline-flex items-center gap-1 text-emerald-600">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      En línea
                    </span>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Iniciando...' : 'Entrar'}
                  </Button>
                  {isDevMode && (
                    <Button
                      type="button"
                      variant="secondary"
                      className="w-full"
                      onClick={handleDevLogin}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Preparando demo...' : 'Entrar rápido (modo demo)'}
                    </Button>
                  )}
                </form>
              ) : (
                <form onSubmit={handleRegister} className="space-y-4">
                  <Input
                    label="Nombre"
                    value={registerData.name}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        name: e.target.value,
                      })
                    }
                    required
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={registerData.email}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        email: e.target.value,
                      })
                    }
                    required
                  />
                  <Input
                    label="Contraseña"
                    type="password"
                    value={registerData.password}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        password: e.target.value,
                      })
                    }
                    required
                    minLength={6}
                  />
                  <Input
                    label="Nombre de la Empresa"
                    value={registerData.companyName}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        companyName: e.target.value,
                      })
                    }
                    required
                  />
                  <Input
                    label="CUIT de la Empresa"
                    value={registerData.companyCuit}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        companyCuit: e.target.value,
                      })
                    }
                    required
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Creando cuenta...' : 'Crear y entrar'}
                  </Button>
                </form>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}


