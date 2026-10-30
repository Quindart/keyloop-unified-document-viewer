import { Fragment } from 'react';
import { Link, useMatches } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Languages, LogOut, UserRound } from 'lucide-react';
import i18n, { LANGUAGE_STORAGE_KEY } from '~/i18n/i18n';
import type { AppLanguage } from '~/i18n/resources';
import { useAuthStore } from '~/features/auth/auth-store';
import { useLogout } from '~/features/auth/use-logout';
import { Avatar, AvatarFallback } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '~/components/ui/breadcrumb';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { Separator } from '~/components/ui/separator';
import { SidebarTrigger } from '~/components/ui/sidebar';

export function AppHeader() {
  const matches = useMatches();
  const { t, i18n: translation } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const { logout, isPending } = useLogout();
  const breadcrumbs = matches.flatMap((match) => {
    const handle = match.handle;
    if (
      typeof handle !== 'object' ||
      handle === null ||
      !('breadcrumbKey' in handle) ||
      typeof handle.breadcrumbKey !== 'string'
    )
      return [];
    return [
      { id: match.id, href: match.pathname, label: t(handle.breadcrumbKey) },
    ];
  });

  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-3 border-b bg-background px-4 md:px-6">
      <SidebarTrigger aria-label={t('navigation.toggle')} />
      <Separator orientation="vertical" className="!h-4" />
      <Breadcrumb
        aria-label={t('navigation.currentPath')}
        className="min-w-0 flex-1"
      >
        <BreadcrumbList>
          {breadcrumbs.map((crumb, index) => (
            <Fragment key={crumb.id}>
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem className="min-w-0">
                {index === breadcrumbs.length - 1 ? (
                  <BreadcrumbPage className="truncate">
                    {crumb.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={crumb.href}>{crumb.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="shrink-0 gap-2"
            aria-label={t('language.label')}
          >
            <Languages aria-hidden="true" className="size-4" />
            <span>{translation.resolvedLanguage === 'en' ? 'EN' : 'VI'}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuLabel>{t('language.label')}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {(['vi', 'en'] as const).map((language: AppLanguage) => (
            <DropdownMenuItem
              key={language}
              onSelect={() => {
                window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
                void i18n.changeLanguage(language);
              }}
              aria-current={
                translation.resolvedLanguage === language ? 'true' : undefined
              }
              className="cursor-pointer"
            >
              {t(`language.${language === 'vi' ? 'vietnamese' : 'english'}`)}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 rounded-full"
            aria-label={t('account.menu')}
          >
            <Avatar className="size-9 border">
              <AvatarFallback>
                <UserRound className="!size-5" aria-hidden="true" />
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="space-y-1">
            <p className="text-xs font-normal text-muted-foreground">
              {t('account.label')}
            </p>
            {user?.kind === 'google' ? (
              <>
                <p className="truncate">{user.name || user.email}</p>
                {user.name && (
                  <p className="truncate text-xs font-normal text-muted-foreground">
                    {user.email}
                  </p>
                )}
              </>
            ) : (
              <p className="truncate">{user?.username}</p>
            )}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            disabled={isPending}
            onSelect={() => void logout()}
            className="cursor-pointer text-destructive focus:text-destructive"
          >
            <LogOut aria-hidden="true" />
            {t('account.logout')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
