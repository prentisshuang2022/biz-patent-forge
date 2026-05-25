import { Link, Outlet, createFileRoute, useRouterState } from "@tanstack/react-router";
import { Users, ShieldCheck, Bell, Inbox, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

type NavItem = {
  to: "/admin/users" | "/admin/roles" | "/admin/subscriptions" | "/admin/push";
  label: string;
  icon: typeof Users;
  badge?: string;
};

const groups: { title: string; items: NavItem[] }[] = [
  {
    title: "用户与权限",
    items: [
      { to: "/admin/users", label: "用户管理", icon: Users },
      { to: "/admin/roles", label: "角色管理", icon: ShieldCheck },
    ],
  },
  {
    title: "订阅与推送",
    items: [
      { to: "/admin/subscriptions", label: "订阅管理", icon: Bell },
      { to: "/admin/push", label: "推送记录", icon: Inbox, badge: "12" },
    ],
  },
];

function AdminLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-[#f7f8fb] text-foreground">
      {/* Topbar */}
      <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-white border-b border-border flex items-center px-6">
        <div className="flex items-center gap-2 font-semibold">
          <div className="w-7 h-7 rounded-md bg-gradient-to-br from-primary to-primary/70 text-primary-foreground flex items-center justify-center text-sm font-bold">
            P
          </div>
          <span>AI 专利创新空间</span>
          <span className="ml-3 px-2 py-0.5 text-xs rounded bg-primary-light text-primary font-medium">
            后台管理
          </span>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary">
            <ArrowLeft className="w-3.5 h-3.5" /> 返回前台
          </button>
          <div className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-muted cursor-pointer">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 text-white flex items-center justify-center text-xs font-semibold">
              管
            </div>
            <span className="text-xs text-muted-foreground">管理员 admin</span>
            <span className="text-[11px] px-1.5 py-px rounded bg-amber-100 text-amber-700">超管</span>
          </div>
        </div>
      </header>

      <div className="flex pt-14 min-h-screen">
        {/* Sidebar */}
        <aside className="fixed top-14 bottom-0 left-0 w-[220px] bg-white border-r border-border p-3 overflow-y-auto">
          {groups.map((g) => (
            <div key={g.title}>
              <div className="text-[11px] text-muted-foreground/70 font-medium px-3 pt-3 pb-2 tracking-wider">
                {g.title}
              </div>
              {g.items.map((item) => {
                const Icon = item.icon;
                const active = pathname.startsWith(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-[13.5px] mb-0.5 transition-colors ${
                      active
                        ? "bg-primary-light text-primary font-medium"
                        : "text-foreground/80 hover:bg-muted"
                    }`}
                  >
                    <Icon className="w-4 h-4 opacity-85" />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto bg-destructive text-destructive-foreground text-[10px] px-1.5 rounded-full min-w-[16px] text-center leading-4">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </aside>

        <main className="ml-[220px] flex-1 p-8 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
