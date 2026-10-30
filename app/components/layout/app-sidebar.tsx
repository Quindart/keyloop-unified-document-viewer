import { Home } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '~/components/ui/sidebar';

export function AppSidebar() {
  const { setOpenMobile } = useSidebar();
  const { t } = useTranslation();

  function handleCloseMobileNavigation() {
    setOpenMobile(false);
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-16 justify-center border-b">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <NavLink to="/home" onClick={handleCloseMobileNavigation}>
                <img
                  src="/keyloop-logo.svg"
                  alt="Keyloop"
                  className="h-auto w-28 text-sidebar-foreground group-data-[collapsible=icon]:hidden"
                />
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t('navigation.workspace')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <nav aria-label={t('navigation.primary')}>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive tooltip={t('home.label')}>
                    <NavLink
                      to="/home"
                      end
                      onClick={handleCloseMobileNavigation}
                    >
                      <Home aria-hidden="true" />
                      <span>{t('home.label')}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </nav>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t p-4 group-data-[collapsible=icon]:hidden">
        <p className="text-xs text-muted-foreground">
          {t('navigation.footer')}
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
