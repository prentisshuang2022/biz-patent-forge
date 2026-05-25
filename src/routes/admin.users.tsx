import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type AdminUser,
  INITIAL_USERS,
  ROLE_BADGE,
  ROLE_LABEL,
  type RoleKey,
  templateCountForRole,
} from "@/lib/admin-data";

export const Route = createFileRoute("/admin/users")({
  component: UsersPage,
});

function StatCard({
  label,
  value,
  suffix,
  trend,
  accent,
}: {
  label: string;
  value: string | number;
  suffix?: string;
  trend?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden bg-white rounded-lg p-5 border border-border/60 ${
        accent ? "before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[3px] before:bg-primary" : ""
      }`}
    >
      <div className="text-xs text-muted-foreground mb-2">{label}</div>
      <div className="text-[26px] font-semibold leading-tight">
        {value}
        {suffix && <span className="text-[13px] text-muted-foreground font-normal ml-0.5">{suffix}</span>}
      </div>
      {trend && <div className="text-xs text-muted-foreground mt-1.5">{trend}</div>}
    </div>
  );
}

function RoleBadge({ role }: { role: RoleKey }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${ROLE_BADGE[role]}`}>
      {ROLE_LABEL[role]}
    </span>
  );
}

function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>(INITIAL_USERS);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | RoleKey>("all");

  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [deleting, setDeleting] = useState<AdminUser | null>(null);
  const [creating, setCreating] = useState(false);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        !search || u.name.includes(search) || u.account.toLowerCase().includes(search.toLowerCase());
      const matchRole = roleFilter === "all" || u.role === roleFilter;
      return matchSearch && matchRole;
    });
  }, [users, search, roleFilter]);

  const superCount = users.filter((u) => u.role === "super").length;

  return (
    <div>
      <div className="flex justify-between items-end mb-5">
        <div>
          <h1 className="text-xl font-semibold">用户管理</h1>
          <p className="text-sm text-muted-foreground mt-1">管理系统内所有用户及其角色</p>
        </div>
        <Button onClick={() => setCreating(true)} className="gap-1.5">
          <Plus className="w-4 h-4" /> 新建用户
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-5">
        <StatCard label="注册用户" value={users.length} suffix=" 人" trend="↑ 本月新增 12" accent />
        <StatCard label="活跃用户（30天）" value={42} suffix=" 人" trend="活跃率 48.8%" />
        <StatCard label="超级管理员" value={superCount} suffix=" 人" trend="含 1 个系统超管" />
      </div>

      <div className="bg-white rounded-lg p-4 border border-border/60 mb-4 flex gap-3 items-center flex-wrap">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="搜索用户名 / 账号"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 w-[240px] h-9"
          />
        </div>
        <Select value={roleFilter} onValueChange={(v) => setRoleFilter(v as typeof roleFilter)}>
          <SelectTrigger className="w-[160px] h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部角色</SelectItem>
            <SelectItem value="super">超级管理员</SelectItem>
            <SelectItem value="patent">专利服务</SelectItem>
            <SelectItem value="analysis">企业分析</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white rounded-lg border border-border/60 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr className="text-muted-foreground text-xs">
              <th className="text-left font-medium px-4 py-3">用户</th>
              <th className="text-left font-medium px-4 py-3">账号</th>
              <th className="text-left font-medium px-4 py-3">角色</th>
              <th className="text-left font-medium px-4 py-3">已授权模板</th>
              <th className="text-left font-medium px-4 py-3">最近登录</th>
              <th className="text-left font-medium px-4 py-3 w-[180px]">操作</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-t border-border/60 hover:bg-muted/30">
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-full bg-gradient-to-br ${u.avatarColor} text-white flex items-center justify-center text-xs font-semibold`}
                    >
                      {u.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{u.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">注册于 {u.registeredAt}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-foreground/80">{u.account}</td>
                <td className="px-4 py-3.5">
                  <RoleBadge role={u.role} />
                </td>
                <td className="px-4 py-3.5 text-foreground/80">
                  {u.role === "super" ? "—（全部）" : `${templateCountForRole(u.role)} 个`}
                </td>
                <td className="px-4 py-3.5 text-foreground/80">{u.lastLogin}</td>
                <td className="px-4 py-3.5">
                  <div className="flex gap-3 items-center">
                    <button
                      className="text-primary text-sm hover:underline"
                      onClick={() => setEditing(u)}
                    >
                      修改
                    </button>
                    <button
                      className="text-destructive text-sm hover:underline"
                      onClick={() => setDeleting(u)}
                    >
                      删除
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-12 text-muted-foreground">
                  暂无匹配用户
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <EditUserDialog
          user={editing}
          onClose={() => setEditing(null)}
          onSave={(updated) => {
            setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
            setEditing(null);
            toast.success("用户已更新");
          }}
        />
      )}

      {creating && (
        <CreateUserDialog
          onClose={() => setCreating(false)}
          onCreate={(u) => {
            setUsers((prev) => [u, ...prev]);
            setCreating(false);
            toast.success("用户已创建");
          }}
        />
      )}

      <AlertDialog open={!!deleting} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除用户？</AlertDialogTitle>
            <AlertDialogDescription>
              将永久删除用户 <span className="font-medium text-foreground">{deleting?.name}</span>
              （账号 {deleting?.account}），此操作不可恢复。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (deleting) {
                  setUsers((prev) => prev.filter((u) => u.id !== deleting.id));
                  toast.success("用户已删除");
                }
                setDeleting(null);
              }}
            >
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function EditUserDialog({
  user,
  onClose,
  onSave,
}: {
  user: AdminUser;
  onClose: () => void;
  onSave: (u: AdminUser) => void;
}) {
  const [account, setAccount] = useState(user.account);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const submit = () => {
    if (!account.trim()) return toast.error("账号不能为空");
    if (password && password !== confirm) return toast.error("两次输入的密码不一致");
    onSave({ ...user, account: account.trim(), password: password || user.password });
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>修改用户</DialogTitle>
          <DialogDescription>
            {user.name} · {ROLE_LABEL[user.role]}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <Label>账号</Label>
            <Input value={account} onChange={(e) => setAccount(e.target.value)} className="mt-1.5" />
          </div>
          <div>
            <Label>新密码</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="留空表示不修改"
              className="mt-1.5"
            />
          </div>
          <div>
            <Label>确认新密码</Label>
            <Input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="再次输入新密码"
              className="mt-1.5"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>取消</Button>
          <Button onClick={submit}>保存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CreateUserDialog({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (u: AdminUser) => void;
}) {
  const [name, setName] = useState("");
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<RoleKey>("patent");

  const submit = () => {
    if (!name.trim() || !account.trim() || !password.trim()) {
      return toast.error("请完整填写姓名、账号和密码");
    }
    onCreate({
      id: `u${Date.now()}`,
      name: name.trim(),
      account: account.trim(),
      password,
      role,
      avatarColor: "from-slate-400 to-slate-500",
      registeredAt: new Date().toISOString().slice(0, 10),
      lastLogin: "—",
      subscriptionUsed: 0,
      subscriptionLimit: 5,
    });
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>新建用户</DialogTitle>
          <DialogDescription>填写基础信息并指定角色</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <Label>姓名</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5" />
          </div>
          <div>
            <Label>账号</Label>
            <Input value={account} onChange={(e) => setAccount(e.target.value)} className="mt-1.5" />
          </div>
          <div>
            <Label>密码</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label>角色</Label>
            <Select value={role} onValueChange={(v) => setRole(v as RoleKey)}>
              <SelectTrigger className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="super">超级管理员</SelectItem>
                <SelectItem value="patent">专利服务</SelectItem>
                <SelectItem value="analysis">企业分析</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>取消</Button>
          <Button onClick={submit}>创建</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
