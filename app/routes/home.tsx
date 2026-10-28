export function meta() {
  return [{ title: 'Trang chủ | Workspace' }];
}

export const handle = { breadcrumb: 'Trang chủ' };

export default function Home() {
  return <section aria-label="Trang chủ" className="min-h-full flex-1" />;
}
