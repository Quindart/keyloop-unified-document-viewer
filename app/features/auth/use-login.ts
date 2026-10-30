import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import { loginSchema, type LoginValues } from './login-schema';
import { authenticate } from './auth-service';
import { useAuthStore } from './auth-store';

export type LoginPhase = 'idle' | 'submitting' | 'redirecting';

export function useLogin() {
  const { t } = useTranslation();
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' },
  });
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [phase, setPhase] = useState<LoginPhase>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [errorKey, setErrorKey] = useState('');
  const [navigationError, setNavigationError] = useState(false);
  const locked = useRef(false);
  const focusPassword = useRef(false);

  useEffect(() => {
    const subscription = form.watch(() => {
      setErrorKey((key) => (key === 'login.invalidCredentials' ? '' : key));
    });
    return () => subscription.unsubscribe();
  }, [form]);

  useEffect(() => {
    setErrorMessage(errorKey ? t(errorKey) : '');
  }, [errorKey, t]);

  useEffect(() => {
    if (phase === 'idle' && focusPassword.current) {
      focusPassword.current = false;
      form.setFocus('password');
    }
  }, [phase, form, errorMessage]);

  const showError = (key: string) => {
    const message = t(key);
    setErrorKey(key);
    setErrorMessage(message);
    enqueueSnackbar(message, { variant: 'error', autoHideDuration: 6000 });
  };

  const openHome = async () => {
    setPhase('redirecting');
    setNavigationError(false);
    setErrorMessage('');
    try {
      await navigate('/home', { replace: true });
    } catch {
      setNavigationError(true);
      showError('login.navigationError');
    }
  };

  const submit = form.handleSubmit(
    async (values) => {
      setPhase('submitting');
      setErrorMessage('');
      let user;
      try {
        user = await authenticate(values);
      } catch (error) {
        showError('login.loginError');
        return;
      }
      if (!user) {
        form.setValue('password', '');
        focusPassword.current = true;
        showError('login.invalidCredentials');
        return;
      }
      try {
        const response = await fetch('/auth/session', {
          method: 'POST',
          credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ intent: 'clear' }),
        });
        if (!response.ok) throw new Error('Could not clear server session');
      } catch {
        showError('login.loginError');
        return;
      }
      // Mark navigation ownership before publishing the user to route guards.
      setPhase('redirecting');
      const { persisted } = useAuthStore.getState().signIn(user);
      enqueueSnackbar(
        persisted
          ? t('login.success', { username: user.username })
          : t('login.persistenceWarning'),
        {
          variant: persisted ? 'success' : 'warning',
          autoHideDuration: persisted ? 4000 : 6000,
        },
      );
      await openHome();
    },
    () => {
      const values = form.getValues();
      if (!values.username.trim()) {
        form.setError('username', {
          type: 'required',
          message: t('login.usernameRequired'),
        });
      }
      if (!values.password) {
        form.setError('password', {
          type: 'required',
          message: t('login.passwordRequired'),
        });
      }
      showError('login.invalidForm');
    },
  );

  const onSubmit = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    if (locked.current) return;
    locked.current = true;
    try {
      await submit(event);
    } finally {
      locked.current = false;
      setPhase('idle');
    }
  };

  const retryHome = async () => {
    if (locked.current || !useAuthStore.getState().user) return;
    locked.current = true;
    try {
      await openHome();
    } finally {
      locked.current = false;
      setPhase('idle');
    }
  };

  return { form, onSubmit, phase, errorMessage, retryHome, navigationError };
}
