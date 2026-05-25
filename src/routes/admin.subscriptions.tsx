import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
} from "@/lib/admin-data";

export const Route = createFileRoute("/admin/subscriptions")({
  component: SubscriptionsPage,
});

function StatCard({
  label,
  value,
  suffix,
  trend,
  accent,
  highlight,
}: {
  label: string;
  value: string | number;
  suffix?: string;
  trend?: string;
  accent?: boolean;
  highlight?: "warning";
}) {
  return (
    <div
      className={`relative overflow-hidden bg-white rounded-lg p-5 border border-border/60 ${
        accent ? "before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[3px] before:bg-primary" : ""
      }`}
    >
      <div className="text-xs text-muted-foreground mb-2">{label}</div>
      <div
        className={`text-[26px] font-semibold leading-tight ${
          highlight === "warning" ? "text-warning" : ""
        }`}
      >
        {value}
        {suffix && <span className="text-[13px] text-muted-foreground font-normal ml-0.5">{suffix}</span>}
      </div>
      {trend && <div className="text-xs text-muted-foreground mt-1.5">{trend}</div>}
    </div>
  );
}

function SubscriptionsPage() {
  const [users, setUsers] = useState<AdminUser[]>(INITIAL_USERS);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | RoleKey>("all");
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [batchOpen, setBatchOpen] = useState(false);

  const filtered = useMemo(
    () =>
      users.filter((u) => {
        const matchSearch =
          !search || u.name.includes(search) || u.account.toLowerCase().includes(search.toLowerCase());
        const matchRole = roleFilter === "all" || u.role === roleFilter;
        return matchSearch && matchRole;
      }),
    [users, search, roleFilter],
  );

  const totalUsers = users.length;
  const configured = users.filter((u) => u.subscriptionLimit > 0).length;
  const avgLimit = Math.round(
    users.reduce((s, u) => s + u.subscriptionLimit, 0) / Math.max(1, totalUsers),
  );
  const nearLimit = users.filter(
    (u) => u.subscriptionLimit > 0 && u.subscriptionUsed / u.subscriptionLimit >= 0.8,
  ).length;

  return (
    <div>
      <div className="flex justify-between items-end mb-5">
        <div>
          <h1 className="text-xl font-semibold">订阅管理</h1>
          <p className="text-sm text-muted-foreground mt-1">
            以用户为维度配置可开启的订阅数量上限 · 启停与推送统计请前往「推送记录」
          </p>
        </div>
        <Button onClick={() => setBatchOpen(true)} variant="outline" className="gap-1.5">
          <SlidersHorizontal className="w-4 h-4" /> 批量设置默认上限
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-5">
        <StatCard label="总用户数" value={totalUsers} suffix=" 人" accent />
        <StatCard label="已设置配额" value={configured} suffix=" 人" trend={`占比 ${Math.round((configured / totalUsers) * 100)}%`} />
        <StatCard label="平均配额" value={avgLimit} suffix=" 条/人" />
        <StatCard
          label="接近上限（≥80%）"
          value={nearLimit}
          suffix=" 人"
          trend="建议提升配额或提醒"
          highlight="warning"
        />
      </div>

      <div className="bg-white rounded-lg p-4 border border-border/60 mb-4 flex gap-3 items-center flex-wrap">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="搜索用户 / 账号"
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
              <th className="text-left font-medium px-4 py-3">已开启订阅</th>
              <th className="text-left font-medium px-4 py-3">订阅上限</th>
              <th className="text-left font-medium px-4 py-3 w-[200px]">使用率</th>
              <th className="text-left font-medium px-4 py-3 w-[120px]">操作</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => {
              const ratio = u.subscriptionLimit > 0 ? u.subscriptionUsed / u.subscriptionLimit : 0;
              const pct = Math.min(100, Math.round(ratio * 100));
              const barColor =
                ratio >= 1 ? "bg-destructive" : ratio >= 0.8 ? "bg-warning" : "bg-primary";
              return (
                <tr key={u.id} className="border-t border-border/60 hover:bg-muted/30">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-8 h-8 rounded-full bg-gradient-to-br ${u.avatarColor} text-white flex items-center justify-center text-xs font-semibold`}
                      >
                        {u.name.charAt(0)}
                      </div>
                      <div className="font-medium text-foreground">{u.name}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-foreground/80">{u.account}</td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${ROLE_BADGE[u.role]}`}
                    >
                      {ROLE_LABEL[u.role]}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-foreground/80">{u.subscriptionUsed} 条</td>
                  <td className="px-4 py-3.5 text-foreground/80">{u.subscriptionLimit} 条</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className={`h-full ${barColor} rounded-full`} style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground w-10 text-right">{pct}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <button
                      className="text-primary text-sm hover:underline"
                      onClick={() => setEditing(u)}
                    >
                      修改上限
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {editing && (
        <EditLimitDialog
          user={editing}
          onClose={() => setEditing(null)}
          onSave={(limit) => {
            setUsers((prev) =>
              prev.map((u) => (u.id === editing.id ? { ...u, subscriptionLimit: limit } : u)),
            );
            setEditing(null);
            toast.success(`已更新「${editing.name}」的订阅上限为 ${limit} 条`);
          }}
        />
      )}

      {batchOpen && (
        <BatchLimitDialog
          onClose={() => setBatchOpen(false)}
          onApply={(limit) => {
            setUsers((prev) => prev.map((u) => ({ ...u, subscriptionLimit: limit })));
            setBatchOpen(false);
            toast.success(`已为全部用户应用默认上限 ${limit} 条`);
          }}
        />
      )}
    </div>
  );
}

function EditLimitDialog({
  user,
  onClose,
  onSave,
}: {
  user: AdminUser;
  onClose: () => void;
  onSave: (limit: number) => void;
}) {
  const [val, setVal] = useState(String(user.subscriptionLimit));
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>修改订阅上限</DialogTitle>
          <DialogDescription>
            用户：{user.name}（当前已开启 {user.subscriptionUsed} 条）
          </DialogDescription>
        </DialogHeader>
        <div className="py-2">
          <Label>订阅数量上限</Label>
          <Input
            type="number"
            min={0}
            value={val}
            onChange={(e) => setVal(e.target.value)}
            className="mt-1.5"
          />
          <p className="text-xs text-muted-foreground mt-2">
            设为 0 表示禁止该用户开启新订阅。
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>取消</Button>
          <Button
            onClick={() => {
              const n = Number(val);
              if (Number.isNaN(n) || n < 0) return toast.error("请输入有效数字");
              if (n < user.subscriptionUsed)
                return toast.error(`新上限不能低于当前已开启数（${user.subscriptionUsed}）`);
              onSave(n);
            }}
          >
            保存
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function BatchLimitDialog({
  onClose,
  onApply,
}: {
  onClose: () => void;
  onApply: (limit: number) => void;
}) {
  const [val, setVal] = useState("5");
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>批量设置默认上限</DialogTitle>
          <DialogDescription>将为所有用户应用同一订阅数量上限</DialogDescription>
        </DialogHeader>
        <div className="py-2">
          <Label>默认订阅上限</Label>
          <Input
            type="number"
            min={0}
            value={val}
            onChange={(e) => setVal(e.target.value)}
            className="mt-1.5"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>取消</Button>
          <Button
            onClick={() => {
              const n = Number(val);
              if (Number.isNaN(n) || n < 0) return toast.error("请输入有效数字");
              onApply(n);
            }}
          >
            应用
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
