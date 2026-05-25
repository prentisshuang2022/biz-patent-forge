export type RoleKey = "super" | "patent" | "analysis";

export const ROLE_LABEL: Record<RoleKey, string> = {
  super: "超级管理员",
  patent: "专利服务",
  analysis: "企业分析",
};

export const ROLE_BADGE: Record<RoleKey, string> = {
  super: "bg-info-light text-info",
  patent: "bg-success-light text-success",
  analysis: "bg-warning-light text-warning",
};

export type TemplateKey =
  | "novelty"
  | "disclosure"
  | "drafting"
  | "oa"
  | "landscape"
  | "highvalue";

export const TEMPLATES: { key: TemplateKey; name: string; icon: string; cat: string }[] = [
  { key: "novelty", name: "专利查新", icon: "🔍", cat: "查新" },
  { key: "disclosure", name: "技术交底书撰写", icon: "📝", cat: "撰写" },
  { key: "drafting", name: "专利申请文件撰写", icon: "📄", cat: "撰写" },
  { key: "oa", name: "OA 审查意见答复", icon: "✉️", cat: "答复" },
  { key: "landscape", name: "技术全景扫描", icon: "🌐", cat: "分析" },
  { key: "highvalue", name: "高价值专利筛选", icon: "⭐", cat: "分析" },
];

export const ROLE_TEMPLATES: Record<Exclude<RoleKey, "super">, TemplateKey[]> = {
  patent: ["novelty", "disclosure", "drafting", "oa"],
  analysis: ["landscape", "highvalue"],
};

export type AdminUser = {
  id: string;
  name: string;
  account: string;
  password: string;
  role: RoleKey;
  avatarColor: string;
  registeredAt: string;
  lastLogin: string;
  subscriptionUsed: number;
  subscriptionLimit: number;
};

export const INITIAL_USERS: AdminUser[] = [
  {
    id: "u1",
    name: "王晓明",
    account: "wangxm",
    password: "wangxm123",
    role: "super",
    avatarColor: "from-indigo-400 to-indigo-600",
    registeredAt: "2025-08-12",
    lastLogin: "2026-05-19 09:23",
    subscriptionUsed: 0,
    subscriptionLimit: 20,
  },
  {
    id: "u2",
    name: "李芳",
    account: "lifang",
    password: "lifang123",
    role: "patent",
    avatarColor: "from-orange-400 to-orange-500",
    registeredAt: "2025-09-03",
    lastLogin: "2026-05-19 14:01",
    subscriptionUsed: 4,
    subscriptionLimit: 5,
  },
  {
    id: "u3",
    name: "陈志强",
    account: "chenzq",
    password: "chenzq123",
    role: "patent",
    avatarColor: "from-emerald-400 to-emerald-500",
    registeredAt: "2025-10-21",
    lastLogin: "2026-05-18 16:55",
    subscriptionUsed: 2,
    subscriptionLimit: 5,
  },
  {
    id: "u4",
    name: "赵小琴",
    account: "zhaoxq",
    password: "zhaoxq123",
    role: "analysis",
    avatarColor: "from-pink-400 to-pink-500",
    registeredAt: "2025-11-08",
    lastLogin: "2026-04-22 10:11",
    subscriptionUsed: 0,
    subscriptionLimit: 3,
  },
  {
    id: "u5",
    name: "刘宏伟",
    account: "liuhw",
    password: "liuhw123",
    role: "analysis",
    avatarColor: "from-violet-400 to-violet-500",
    registeredAt: "2026-01-15",
    lastLogin: "2026-05-19 11:42",
    subscriptionUsed: 3,
    subscriptionLimit: 5,
  },
  {
    id: "u6",
    name: "孙志国",
    account: "sunzg",
    password: "sunzg123",
    role: "patent",
    avatarColor: "from-sky-400 to-sky-500",
    registeredAt: "2026-02-02",
    lastLogin: "2026-05-10 09:00",
    subscriptionUsed: 1,
    subscriptionLimit: 5,
  },
  {
    id: "u7",
    name: "吴鹏",
    account: "wupeng",
    password: "wupeng123",
    role: "analysis",
    avatarColor: "from-rose-400 to-rose-500",
    registeredAt: "2026-03-11",
    lastLogin: "2026-05-19 08:15",
    subscriptionUsed: 5,
    subscriptionLimit: 5,
  },
];

export function templateCountForRole(role: RoleKey): number {
  if (role === "super") return TEMPLATES.length;
  return ROLE_TEMPLATES[role].length;
}
