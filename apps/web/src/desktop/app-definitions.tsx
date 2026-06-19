import {
  BriefcaseBusiness,
  Calculator,
  FileText,
  Mail,
  ShoppingBag,
  type LucideIcon,
} from "lucide-react";
import {
  CalculatorApp,
  ContactApp,
  PortfolioApp,
  ResumeApp,
  StoreApp,
} from "@/apps/app-content";

export type AppId = "portfolio" | "store" | "resume" | "contact" | "calculator";

export type DesktopApp = {
  id: AppId;
  label: string;
  title: string;
  icon: LucideIcon;
  defaultSize: {
    width: number;
    height: number;
  };
  defaultPosition: {
    x: number;
    y: number;
  };
  content: React.ComponentType;
};

export const desktopApps: DesktopApp[] = [
  {
    id: "portfolio",
    label: "Portfolio",
    title: "Portfolio",
    icon: BriefcaseBusiness,
    defaultSize: { width: 820, height: 560 },
    defaultPosition: { x: 230, y: 58 },
    content: PortfolioApp,
  },
  {
    id: "store",
    label: "Store",
    title: "Store",
    icon: ShoppingBag,
    defaultSize: { width: 720, height: 520 },
    defaultPosition: { x: 430, y: 148 },
    content: StoreApp,
  },
  {
    id: "resume",
    label: "Resume",
    title: "Resume",
    icon: FileText,
    defaultSize: { width: 620, height: 540 },
    defaultPosition: { x: 500, y: 100 },
    content: ResumeApp,
  },
  {
    id: "contact",
    label: "Contact",
    title: "Contact",
    icon: Mail,
    defaultSize: { width: 680, height: 220 },
    defaultPosition: { x: 610, y: 190 },
    content: ContactApp,
  },
  {
    id: "calculator",
    label: "Calculator",
    title: "Calculator",
    icon: Calculator,
    defaultSize: { width: 300, height: 500 },
    defaultPosition: { x: 760, y: 84 },
    content: CalculatorApp,
  },
];

export const appsById = new Map(desktopApps.map((app) => [app.id, app]));
