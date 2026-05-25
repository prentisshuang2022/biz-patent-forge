import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ROLE_TEMPLATES,
  TEMPLATES,
  type TemplateKey,
} from "@/lib/admin-data";

export const Route = createFileRoute("/admin/roles")({
  component: RolesPage,
});

type RoleId = "patent" | "analysis";

const ROLES: { id: RoleId; name: string; desc: string }[] = [
  { id: "patent", name: "专利服务", desc: "面向专利从业者，可使用 4 个撰写/查新/答复模板" },
  { id: "analysis", name: "企业分析", desc: "面向企业战略分析，可使用 2 个分析类模板" },
];

function RolesPage() {
  const [selectedRole, setSelectedRole] = useState<RoleId>("patent");
  const [mapping, setMapping] = useState<Record<RoleId, TemplateKey[]>>({
    patent: [...ROLE_TEMPLATES.patent],
    analysis: [...ROLE_TEMPLATES.analysis],
  });

  const toggleTemplate = (key: TemplateKey) => {
    setMapping((prev) => {
      const cur = prev[selectedRole];
      const next = cur.includes(key) ? cur.filter((k) => k !== key) : [...cur, key];
      return { ...prev, [selectedRole]: next };
    });
  };

  const reset = () => {
    setMapping({
      patent: [...ROLE_TEMPLATES.patent],
      analysis: [...ROLE_TEMPLATES.analysis],
    });
    toast.info("已重置为默认授权");
  };

  const save = () => {
    toast.success(`已保存「${ROLES.find((r) => r.id === selectedRole)?.name}」的模板授权`);
  };

  const current = mapping[selectedRole];

  return (
    <div>
      <div className="flex justify-between items-end mb-5">
        <div>
          <h1 className="text-xl font-semibold">角色管理</h1>
          <p className="text-sm text-muted-foreground mt-1">
            按角色配置可使用的任务模板 · 角色为系统内置，不可新增或删除
          </p>
        </div>
      </div>

      <div className="grid grid-cols-[320px_1fr] gap-4 min-h-[540px]">
        {/* Left: role list */}
        <div className="bg-white rounded-lg border border-border/60 flex flex-col overflow-hidden">
          <div className="px-4 py-3.5 border-b border-border/60 font-medium text-sm">
            角色列表
            <span className="text-muted-foreground/70 text-xs font-normal ml-2">共 2 项</span>
          </div>
          <div className="flex-1 p-2">
            {ROLES.map((r) => {
              const active = r.id === selectedRole;
              return (
                <button
                  key={r.id}
                  onClick={() => setSelectedRole(r.id)}
                  className={`w-full text-left px-3 py-3 rounded-md mb-1 transition-colors ${
                    active ? "bg-primary-light" : "hover:bg-muted"
                  }`}
                >
                  <div className={`font-medium text-sm ${active ? "text-primary" : "text-foreground"}`}>
                    {r.name}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{r.desc}</div>
                  <div className="text-[11px] text-muted-foreground mt-1.5">
                    已勾选 {mapping[r.id].length} / {r.id === "patent" ? 4 : 2} 个模板
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: template list */}
        <div className="bg-white rounded-lg border border-border/60 flex flex-col overflow-hidden">
          <div className="px-4 py-3.5 border-b border-border/60 flex justify-between items-center">
            <div className="font-medium text-sm">
              可分配模板
              <span className="text-muted-foreground/70 text-xs font-normal ml-2">
                当前角色：{ROLES.find((r) => r.id === selectedRole)?.name}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">已勾选 {current.length} 个</div>
          </div>
          <div className="flex-1 p-3 overflow-y-auto space-y-2">
            {TEMPLATES.map((t) => {
              const checked = current.includes(t.key);
              return (
                <label
                  key={t.key}
                  className={`flex items-center gap-3 p-3 rounded-md border cursor-pointer transition-colors ${
                    checked
                      ? "border-primary/40 bg-primary-light/40"
                      : "border-border/60 hover:bg-muted/40"
                  }`}
                >
                  <Checkbox checked={checked} onCheckedChange={() => toggleTemplate(t.key)} />
                  <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center text-xl flex-shrink-0">
                    {t.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{t.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{t.cat}</div>
                  </div>
                </label>
              );
            })}
          </div>
          <div className="px-4 py-3 border-t border-border/60 flex justify-end gap-2">
            <Button variant="outline" onClick={reset}>重置</Button>
            <Button onClick={save}>保存授权</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
