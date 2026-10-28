import { LoginForm } from '~/features/auth/login-form';
import { useTranslation } from 'react-i18next';
export function meta() {
  return [{ title: 'Workspace' }];
}
export default function Login() {
  const { t } = useTranslation();
  return <LoginForm title={t('login.title')} />;
}
