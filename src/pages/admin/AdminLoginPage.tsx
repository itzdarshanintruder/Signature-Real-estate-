import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { ArrowLeft, LockKeyhole } from 'lucide-react'
import { Seo } from '@/components/ui/Seo'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { FieldError, Input, Label } from '@/components/ui/Input'
import { ApiError } from '@/services/api-client'
import { useAuthStore } from '@/store/auth-store'

const loginSchema = z.object({
  email: z.string().trim().min(1, 'Please enter your email').email('Enter a valid email address'),
  password: z.string().min(1, 'Please enter your password'),
})

type LoginFormValues = z.infer<typeof loginSchema>

function getLoginErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    const message = error.message.toLowerCase()
    if (message.includes('invalid credential')) {
      return 'Incorrect email or password.'
    }
    if (error.code === 'AUTH_NOT_CONFIGURED') {
      return 'Admin sign-in is not configured on this deployment.'
    }
    if (message.includes('unauthorized')) {
      return 'This account is not authorised to sign in.'
    }
    return error.message || 'Sign-in failed. Please try again.'
  }
  return 'Could not sign in. Check your connection and try again.'
}

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)
  const status = useAuthStore((state) => state.status)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  if (status === 'authenticated') {
    return <Navigate to="/admin" replace />
  }

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null)
    try {
      await login(values)
      navigate('/admin', { replace: true })
    } catch (error) {
      setServerError(getLoginErrorMessage(error))
    }
  }

  return (
    <>
      <Seo title="Admin Login" description="Sign in to the Signature City admin dashboard." />

      <div className="flex min-h-svh flex-col bg-ink-900">
        <header className="border-b border-gold-500/20">
          <Container className="flex h-16 items-center justify-between">
            <p className="font-display text-sm tracking-[0.3em] text-gold-400 uppercase">
              Signature City · Admin
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-cream-50/70 transition-colors hover:text-cream-50"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Back to site
            </Link>
          </Container>
        </header>

        <main className="flex flex-1 items-center justify-center px-4 py-16">
          <div className="w-full max-w-md border border-gold-500/25 bg-ink-800/60 p-8 sm:p-10">
            <span className="mb-6 flex h-12 w-12 items-center justify-center border border-gold-500/30 text-gold-400">
              <LockKeyhole className="h-6 w-6" aria-hidden />
            </span>

            <h1 className="font-display text-2xl text-cream-50">Admin Sign In</h1>
            <p className="mt-2 text-sm text-cream-50/60">
              Restricted area — authorised staff only.
            </p>

            {serverError ? (
              <div
                role="alert"
                className="mt-6 border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200"
              >
                {serverError}
              </div>
            ) : null}

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8 space-y-6">
              <div>
                <Label htmlFor="login-email" required>
                  Email
                </Label>
                <Input
                  id="login-email"
                  type="email"
                  autoComplete="username"
                  placeholder="admin@signaturecity.in"
                  className="border-cream-50/20 bg-cream-50/5 text-cream-50 placeholder:text-cream-50/30 focus:bg-cream-50/5"
                  invalid={Boolean(errors.email)}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'login-email-error' : undefined}
                  {...register('email')}
                />
                <FieldError id="login-email-error" message={errors.email?.message} />
              </div>

              <div>
                <Label htmlFor="login-password" required>
                  Password
                </Label>
                <Input
                  id="login-password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="border-cream-50/20 bg-cream-50/5 text-cream-50 placeholder:text-cream-50/30 focus:bg-cream-50/5"
                  invalid={Boolean(errors.password)}
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={errors.password ? 'login-password-error' : undefined}
                  {...register('password')}
                />
                <FieldError id="login-password-error" message={errors.password?.message} />
              </div>

              <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
                {isSubmitting ? 'Signing in…' : 'Sign In'}
              </Button>
            </form>
          </div>
        </main>
      </div>
    </>
  )
}
