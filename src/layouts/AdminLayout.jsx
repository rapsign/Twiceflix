import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AdminSidebar from "@/components/Admin/AdminSidebar";
import { getAuth, signOut } from "firebase/auth";

// Data menu (sama seperti di AdminSidebar)
const navMain = [
  { title: "Dashboard", url: "/admin" },
  { title: "Videos", url: "/admin/videos" },
  { title: "Playlists", url: "/admin/playlists" },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const activeItem = navMain.find((item) => item.url === location.pathname);

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth); // logout user
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      alert("Gagal logout, coba lagi.");
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AdminSidebar onLogout={handleLogout} />
        <main className="flex-1 bg-neutral-900">
          <header className="flex h-14 items-center gap-4 border-b px-4">
            <SidebarTrigger />
            <h1 className="text-sm font-medium">
              {activeItem ? activeItem.title : "Admin Panel"}
            </h1>
          </header>
          <div className="p-4">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
