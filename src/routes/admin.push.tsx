import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export const Route = createFileRoute("/admin/push")({
  component: PushPage,
});

type PushRecord = {
  id: string;
  subscription: string;
  subCode: string;
  user: string;
  type: string;
  count: number;
  time: string;
  status: "success" | "warning";
  patents: { no: string; title: string; meta: string }[];
};

const RECORDS: PushRecord[] = [
  {
    id: "1",
    subscription: "固态电池领域新增专利",
    subCode: "SUB-2026-0142",
    user: "李芳",
    type: "技术领域",
    count: 12,
    time: "2026-05-19 08:00",
    status: "success",
    patents: [
      {
        no: "CN118456712A",
        title: "一种基于硫化物电解质的全固态电池及其制备方法",
        meta: "宁德时代 · 2026-05-15",
      },
      {
        no: "CN118450901A",
        title: "适用于全固态电池的复合正极材料",
        meta: "比亚迪 · 2026-05-14",
      },
    ],
  },
  {
    id: "2",
    subscription: "华为终端公司新增专利",
    subCode: "SUB-2026-0139",
    user: "陈志强",
    type: "申请人",
    count: 5,
    time: "2026-05-19 08:00",
    status: "success",
    patents: [],
  },
  {
    id: "3",
    subscription: "人形机器人触觉传感专题",
    subCode: "SUB-2026-0136",
    user: "刘宏伟",
    type: "检索式",
    count: 0,
    time: "2026-05-19 08:00",
    status: "warning",
    patents: [],
  },
  {
    id: "4",
    subscription: "CN114567890A 同族监控",
    subCode: "SUB-2026-0130",
    user: "李芳",
    type: "单件专利",
    count: 2,
    time: "2026-05-18 08:00",
    status: "success",
    patents: [],
  },
  {
    id: "5",
    subscription: "张三发明人监控",
    subCode: "SUB-2026-0119",
    user: "吴鹏",
    type: "发明人",
    count: 0,
    time: "2026-05-19 08:00",
    status: "warning",
    patents: [],
  },
];

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
      <div className={`text-[26px] font-semibold leading-tight ${highlight === "warning" ? "text-warning" : ""}`}>
        {value}
        {suffix && <span className="text-[13px] text-muted-foreground font-normal ml-0.5">{suffix}</span>}
      </div>
      {trend && <div className="text-xs text-muted-foreground mt-1.5">{trend}</div>}
    </div>
  );
}

function PushPage() {
  const [active, setActive] = useState<PushRecord | null>(null);

  return (
    <div>
      <div className="flex justify-between items-end mb-5">
        <div>
          <h1 className="text-xl font-semibold">推送记录</h1>
          <p className="text-sm text-muted-foreground mt-1">
            观测订阅推送是否正常执行 · 是否存在堆积、无推送、未读过多
          </p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-5">
        <StatCard label="运行中订阅" value={147} suffix=" 条" trend="今日触发 62 次" accent />
        <StatCard label="今日推送次数" value={62} suffix=" 次" trend="↑ 较昨日 +5" />
        <StatCard label="推送总量" value={234} suffix=" 件" trend="平均 3.8 件/次" />
        <StatCard label="未读推送" value={12} suffix=" 条" trend="来自 5 位用户" highlight="warning" />
      </div>

      <div className="bg-white rounded-lg p-4 border border-border/60 mb-4 flex gap-3 items-center flex-wrap">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="搜索订阅名称 / 用户" className="pl-8 w-[240px] h-9" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-[140px] h-9"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部时间</SelectItem>
            <SelectItem value="today">今天</SelectItem>
            <SelectItem value="7d">近 7 天</SelectItem>
            <SelectItem value="30d">近 30 天</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-[140px] h-9"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部状态</SelectItem>
            <SelectItem value="success">有推送</SelectItem>
            <SelectItem value="warning">0 件</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white rounded-lg border border-border/60 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr className="text-muted-foreground text-xs">
              <th className="text-left font-medium px-4 py-3">订阅</th>
              <th className="text-left font-medium px-4 py-3">所属用户</th>
              <th className="text-left font-medium px-4 py-3">类型</th>
              <th className="text-left font-medium px-4 py-3">推送时间</th>
              <th className="text-left font-medium px-4 py-3">推送数量</th>
              <th className="text-left font-medium px-4 py-3 w-[120px]">操作</th>
            </tr>
          </thead>
          <tbody>
            {RECORDS.map((r) => (
              <tr key={r.id} className="border-t border-border/60 hover:bg-muted/30">
                <td className="px-4 py-3.5">
                  <div className="font-medium text-foreground">{r.subscription}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{r.subCode}</div>
                </td>
                <td className="px-4 py-3.5 text-foreground/80">{r.user}</td>
                <td className="px-4 py-3.5">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-primary-light text-primary">
                    {r.type}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-foreground/80">{r.time}</td>
                <td className={`px-4 py-3.5 ${r.status === "warning" ? "text-warning" : "text-foreground/80"}`}>
                  {r.count} 件
                </td>
                <td className="px-4 py-3.5">
                  <button
                    className="text-primary text-sm hover:underline"
                    onClick={() => setActive(r)}
                  >
                    查看详情
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Sheet open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <SheetContent className="w-[480px] sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{active?.subscription}</SheetTitle>
            <SheetDescription>
              {active?.subCode} · {active?.user} · {active?.time}
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            <div className="text-sm text-muted-foreground mb-3">
              本次推送 {active?.count ?? 0} 件专利
            </div>
            {active && active.patents.length > 0 ? (
              <div className="space-y-2">
                {active.patents.map((p) => (
                  <div key={p.no} className="p-3 border border-border/60 rounded-md">
                    <div className="text-xs text-primary font-medium mb-1">{p.no}</div>
                    <div className="text-sm text-foreground leading-snug mb-1.5">{p.title}</div>
                    <div className="text-xs text-muted-foreground">{p.meta}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground text-sm">
                本次推送无专利
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
