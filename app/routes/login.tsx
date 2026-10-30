import { LoginForm } from '~/features/auth/login-form';
import { useTranslation } from 'react-i18next';
import i18n from '~/i18n/i18n';
export function meta() {
  return [{ title: i18n.t('login.title') }];
}
export default function Login() {
  const { t } = useTranslation();
  return <LoginForm title={t('login.title')} />;
}
