import AppSidebar from "@/components/sidebar"
import {SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider
    style={{
        "--sidebar-width": "20rem",
        "--sidebar-width-mobile": "20rem",
      }}
    >
    <AppSidebar />
    <main className="w-[100%]">
      <SidebarTrigger />
      {children}
    </main>
  </SidebarProvider>
  )
}