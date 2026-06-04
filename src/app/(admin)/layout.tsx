import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LogOut, LayoutDashboard, FileText, Settings, ShieldAlert } from "lucide-react";
import { UserMenu } from "@/components/UserMenu";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin-login");
  }

  // Защита админского макета: только для роли ADMIN
  if (session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground relative selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Background gradients for enterprise feel */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[128px] -translate-y-1/2"></div>
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[128px] translate-x-1/3"></div>
      </div>

      {/* Боковая панель (Sidebar) - Premium Glassmorphism */}
      <aside className="w-64 border-r border-border/60 bg-card/40 backdrop-blur-xl flex flex-col hidden md:flex relative z-10 shadow-[4px_0_24px_rgba(0,0,0,0.05)] dark:shadow-[4px_0_24px_rgba(0,0,0,0.2)]">
        <div className="p-6 border-b border-border/60 flex items-center gap-3 bg-muted/20">
          <div className="relative group cursor-pointer">
            <div className="absolute inset-0 bg-indigo-500 blur-md opacity-40 group-hover:opacity-70 transition-opacity"></div>
            <div className="relative bg-gradient-to-br from-indigo-500 to-blue-600 p-2 rounded-xl text-white shadow-lg">
              <ShieldAlert className="w-6 h-6" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground">
              autodocs
            </h2>
            <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 dark:text-indigo-400">Enterprise Admin</p>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <Link href="/admin-panel/dashboard" className="flex items-center gap-3 px-3 py-2.5 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all duration-200 group">
            <LayoutDashboard className="w-5 h-5 text-muted-foreground group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors" />
            <span className="font-medium">Панель управления</span>
          </Link>
          <Link href="/admin-panel/documents" className="flex items-center gap-3 px-3 py-2.5 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all duration-200 group">
            <FileText className="w-5 h-5 text-muted-foreground group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors" />
            <span className="font-medium">Все документы</span>
          </Link>
        </nav>
        
        <div className="p-4 border-t border-border/60 bg-muted/20 backdrop-blur-md">
          <UserMenu dropdownPosition="top-left">
            <div className="flex items-center gap-3 w-full px-2 hover:bg-muted/50 p-2 rounded-lg transition-colors cursor-pointer group">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center text-foreground font-bold border border-border shadow-inner group-hover:border-indigo-500/50 transition-colors">
                {session.user.name?.[0] || session.user.email?.[0]?.toUpperCase() || "A"}
              </div>
              <div className="overflow-hidden flex-1 text-left">
                <p className="text-sm font-semibold text-foreground truncate">{session.user.name}</p>
                <p className="text-[11px] text-muted-foreground truncate">{session.user.email}</p>
              </div>
            </div>
          </UserMenu>
        </div>
      </aside>

      {/* Основной контент */}
      <main className="flex-1 flex flex-col min-w-0 relative z-10">
        <header className="h-16 border-b border-border/60 bg-card/40 backdrop-blur-md flex items-center justify-between px-6 md:hidden sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-1.5 rounded-lg text-white">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-foreground tracking-tight">autodocs Admin</h2>
          </div>
          <UserMenu />
        </header>
        
        <div className="flex-1 p-6 lg:p-10 overflow-y-auto animate-in fade-in zoom-in-95 duration-500 ease-out">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
