import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
  } from "@/components/ui/sidebar";
  import { Calendar, BanknoteIcon, ChevronDown, ChevronUp, HelpCircle, ScanTextIcon, Home, Wallet2Icon, User2, } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
 
  
export default function AppSidebar() {
  const {toast} = useToast();

  const userSessionString = localStorage.getItem("userSession") || sessionStorage.getItem("userSession");

let userSession;
// Check if the user session exists
if (userSessionString) {
  try {
    // Parse the JSON string into an object
    userSession = JSON.parse(userSessionString);
  } catch (error) {
    console.error("Failed to parse user session:", error);
    window.location.href = '/'
  }
} else {
  console.log("No user session found in local storage.");
  window.location.href = '/'
}

const items = [
  {
    title: "Home",
    url: `/dashboard/${userSession.data.id}`,
    icon: Home,
  },
  {
    title: "Budgets",
    url: `/dashboard/${userSession.data.id}/budgets`,
    icon: Wallet2Icon,
  },
  {
    title: "Incomes",
    url: `/dashboard/${userSession.data.id}/income`,
    icon: Calendar,
  },
  {
    title: "Expenses",
    url: `/dashboard/${userSession.data.id}/expense`,
    icon: BanknoteIcon,
  },
]


const signout = () => {
  // Remove user session based on its type
  const isPersistent = !!userSessionString;

  if (isPersistent) {
    localStorage.removeItem("userSession"); // For persistent session
  } else {
    sessionStorage.removeItem("userSession"); // For temporary session
  }
  
  // Show toast notification
  toast({
    title: "Logged out successfully",
  });

  // Delay the redirect to allow the user to see the notification
  setTimeout(() => {
    window.location.href = '/'; // Redirect after a short delay
  }, 2000); // Adjust the time (2000ms = 2 seconds) as needed
};


  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
            {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton>
            <Workflow />
              Select Workspace
              <ChevronDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
            <DropdownMenuItem>
              <span>Acme Inc</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span>Acme Corp.</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> */}
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <Collapsible defaultOpen className="group/collapsible">
      <SidebarGroup>
        <SidebarGroupLabel asChild>
          <CollapsibleTrigger>
          <SidebarMenuButton>
          <ScanTextIcon  className="mr-2"/>
          Analytics
          <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
          </SidebarMenuButton>
          </CollapsibleTrigger>
        </SidebarGroupLabel>
        <CollapsibleContent>
       
                  <SidebarMenuButton asChild>
                    <a href="#help">
                      <HelpCircle />
                      <span>Help</span>
                    </a>
                  </SidebarMenuButton>
             
             
          <SidebarGroupContent />
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>

      </SidebarContent>
      <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    <User2 /> {
                      userSession.data.fullName ? <p className="font-bold">{userSession.data.fullName}</p> : "username"
                    }
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-[--radix-popper-anchor-width]"
                >
                  <DropdownMenuItem>
                    <Link to={`/dashboard/${userSession.data.id}/account`} className="font-bold">Account</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                  <Link to={`/dashboard/${userSession.data.id}/upgrade`} className="font-bold">upgrade to Pro</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <div>
                      <span className="border-0 p-o text-left cursor-pointer font-bold" onClick={() => signout()}>
                      Sign out
                      </span>
                      </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
    </Sidebar>
  )
}