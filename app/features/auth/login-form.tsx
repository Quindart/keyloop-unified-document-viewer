// Adapted from official shadcn login-04: https://ui.shadcn.com/blocks/login
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Navigate, useSearchParams } from 'react-router';
import { Eye, EyeOff, LoaderCircle } from 'lucide-react';
import { LanguageSelect } from '~/components/atoms/language-select';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { useLogin } from './use-login';
import { useAuthStore } from './auth-store';
import { SessionPending } from './auth-gate';
import { LoginProgress } from './login-progress';

export function LoginForm({ title }: { title: string }) {
  const { t, i18n: translation } = useTranslation();
  const { form, onSubmit, phase, errorMessage, navigationError, retryHome } =
    useLogin();
  const user = useAuthStore((state) => state.user);
  const hydrated = useAuthStore((state) => state.hydrated);
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const busy = phase !== 'idle';
  const googleError = searchParams.get('auth_error') === 'google';
  const { errors } = form.formState;
  useEffect(() => {
    document.title = title;
  }, [title]);
  if (!hydrated) return <SessionPending />;
  if (user && !busy && !navigationError) return <Navigate to="/home" replace />;
  return (
    <main className="relative grid min-h-svh overflow-hidden bg-white md:grid-cols-2">
      <section
        aria-label="Keyloop"
        className="login-art relative hidden min-h-svh flex-col justify-between overflow-hidden bg-slate-950 bg-[url('/keyloop-bg.jpg')] bg-cover bg-center bg-no-repeat p-12 md:flex lg:p-16"
      >
        <div className="absolute inset-0 bg-slate-950/45" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/25 via-slate-950/15 to-slate-950/65" />
        <img
          src="/keyloop-logo.svg"
          alt="Keyloop"
          className="relative z-10 h-auto w-36 brightness-0 invert"
        />
        <div className="relative z-10 max-w-xl text-white">
          <div className="relative z-10 flex items-center justify-between gap-4">
            <p className="login-copy login-copy-delay-1 text-xs font-semibold uppercase tracking-[0.22em] text-white/75">
              {t('login.brandLabel')}
            </p>
          </div>
          <h2 className="login-copy login-copy-delay-2 mt-4 text-3xl font-semibold leading-tight tracking-tight lg:text-4xl">
            {t('login.brandHeading')}
          </h2>
          <p className="login-copy login-copy-delay-3 mt-4 max-w-md text-sm leading-6 text-white/75">
            {t('login.brandDescription')}
          </p>
        </div>
      </section>
      <svg
        aria-hidden="true"
        className="login-curve pointer-events-none absolute inset-0 z-10 hidden h-full w-full md:block"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path d="M 51 0 C 58 27, 59 72, 50 100" />
      </svg>
      <section className="login-panel relative z-20 flex min-h-svh items-center justify-center px-6 pb-12 pt-24 sm:px-12">
        <nav
          aria-label={t('language.label')}
          className="absolute right-6 top-6 z-30 sm:right-12"
        >
          <LanguageSelect />
        </nav>
        <div className="w-full max-w-md">
          <div className="mb-10 md:hidden">
            <img
              src="/keyloop-logo.svg"
              alt="Keyloop"
              className="h-auto w-32"
            />
          </div>
          <form
            noValidate
            onSubmit={onSubmit}
            aria-busy={busy}
            className="login-form flex flex-col gap-7 text-base"
          >
            <div>
              <h1 className="login-copy login-copy-delay-1 text-4xl font-semibold tracking-tight">
                {t('login.welcome')}
              </h1>
              <p className="login-copy login-copy-delay-2 mt-3 text-base leading-7 text-muted-foreground">
                {t('login.description')}
              </p>
            </div>
            <LoginProgress phase={phase} />
            <div className="grid gap-3">
              <Label htmlFor="username">{t('login.username')}</Label>
              <Input
                id="username"
                autoComplete="username"
                placeholder={t('login.usernamePlaceholder')}
                className="h-14 rounded-xl text-base"
                disabled={busy}
                aria-invalid={!!errors.username}
                aria-describedby={
                  errors.username ? 'username-error' : undefined
                }
                {...form.register('username')}
              />
              {errors.username && (
                <p id="username-error" className="text-sm text-red-700">
                  {errors.username.message}
                </p>
              )}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="password">{t('login.password')}</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder={t('login.passwordPlaceholder')}
                  className="h-14 rounded-xl pr-12 text-base"
                  disabled={busy}
                  aria-invalid={!!errors.password}
                  aria-describedby={
                    errors.password ? 'password-error' : undefined
                  }
                  {...form.register('password')}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-2 h-10 w-10"
                  aria-label={
                    showPassword
                      ? t('login.hidePassword')
                      : t('login.showPassword')
                  }
                  aria-pressed={showPassword}
                  disabled={busy}
                  onClick={() => setShowPassword((value) => !value)}
                >
                  {showPassword ? (
                    <EyeOff aria-hidden="true" />
                  ) : (
                    <Eye aria-hidden="true" />
                  )}
                </Button>
              </div>
              {errors.password && (
                <p id="password-error" className="text-sm text-red-700">
                  {errors.password.message}
                </p>
              )}
            </div>
            {(errorMessage || googleError) && (
              <p
                role="alert"
                className="rounded-lg bg-red-50 p-3 text-base leading-7 text-red-700"
              >
                {errorMessage || t('login.googleLoginError')}
              </p>
            )}
            {navigationError ? (
              <Button
                type="button"
                className="h-14 rounded-xl text-base"
                disabled={busy}
                onClick={retryHome}
              >
                {t('login.retryHome')}
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={busy}
                className="h-14 w-full rounded-xl text-base"
              >
                {busy ? (
                  <LoaderCircle
                    aria-hidden="true"
                    className="motion-safe:animate-spin"
                  />
                ) : null}
                {phase === 'redirecting'
                  ? t('login.redirecting')
                  : phase === 'submitting'
                    ? t('login.submitting')
                    : t('login.submit')}
              </Button>
            )}
            <div className="relative flex items-center gap-3 text-xs text-muted-foreground before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
              <span>{t('login.or')}</span>
            </div>
            <Button
              asChild
              variant="outline"
              className="h-14 w-full rounded-xl text-base aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
              aria-disabled={busy}
            >
              <Link
                to="/auth/google"
                aria-label={t('login.continueGoogle')}
                tabIndex={busy ? -1 : undefined}
                onClick={(event) => {
                  if (busy) event.preventDefault();
                }}
              >
                <svg
                  aria-hidden="true"
                  className="size-7"
                  viewBox="0 0 48 48"
                  focusable="false"
                >
                  <path
                    fill="#4285F4"
                    d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5.1h6.6c3.9-3.6 6.1-8.9 6.1-15Z"
                  />
                  <path
                    fill="#34A853"
                    d="M24 44c5.5 0 10.1-1.8 13.5-4.9l-6.6-5.1c-1.8 1.2-4.1 2-6.9 2-5.3 0-9.8-3.6-11.4-8.4H5.8v5.3A20 20 0 0 0 24 44Z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M12.6 27.6a12 12 0 0 1 0-7.2v-5.3H5.8a20 20 0 0 0 0 17.8l6.8-5.3Z"
                  />
                  <path
                    fill="#EA4335"
                    d="M24 12c3 0 5.7 1 7.8 3.1l5.8-5.8C34.1 6 29.5 4 24 4A20 20 0 0 0 5.8 15.1l6.8 5.3C14.2 15.6 18.7 12 24 12Z"
                  />
                </svg>
                {t('login.continueGoogle')}
              </Link>
            </Button>
            <p className="text-center text-sm leading-6 text-muted-foreground">
              {t('login.encouragement')}
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}
