import { Home } from 'lucide-react';
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

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-16 justify-center border-b">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <NavLink to="/home" onClick={() => setOpenMobile(false)}>
                <img src="/keyloop-logo.svg" alt="Keyloop" className="h-auto w-28 text-sidebar-foreground group-data-[collapsible=icon]:hidden" />
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Không gian làm việc</SidebarGroupLabel>
          <SidebarGroupContent>
            <nav aria-label="Điều hướng chính">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive
                    tooltip="Trang chủ"
                  >
                    <NavLink
                      to="/home"
                      end
                      onClick={() => setOpenMobile(false)}
                    >
                      <Home aria-hidden="true" />
                      <span>Trang chủ</span>
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
          Không gian làm việc của bạn
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
