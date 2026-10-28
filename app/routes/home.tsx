import { useTranslation } from 'react-i18next';

export function meta() {
  return [{ title: 'Workspace' }];
}

export const handle = { breadcrumbKey: 'home.label' };

export default function Home() {
  const { t } = useTranslation();
  return <section aria-label={t('home.label')} className="min-h-full flex-1" />;
}
