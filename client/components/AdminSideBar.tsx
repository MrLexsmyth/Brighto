'use client';

import Link from "next/link";
import {
  Home,
  Building2,
  PlusCircle,
  Users,
  BarChart3,
  Image as ImageIcon,
  Settings,
  LogOut,
} from "lucide-react";

const menuItems = [
  { href: "/admin/dashboard", icon: Home, label: "Dashboard" },
  { href: "/admin/dashboard/properties", icon: Building2, label: "Properties" },
  { href: "/admin/dashboard/properties/new", icon: PlusCircle, label: "Add Property" },
  { href: "/admin/dashboard/blog", icon: ImageIcon, label: "Blogs" },
  { href: "/admin/dashboard/agents", icon: Users, label: "Agents" },
  { href: "/admin/dashboard/agents/addAgent", icon: PlusCircle, label: "Add Agent" },
  { href: "/admin/reports", icon: BarChart3, label: "Reports" },
  { href: "/admin/gallery", icon: ImageIcon, label: "Gallery" },
  { href: "/admin/settings", icon: Settings, label: "Settings" },
];

export default function AdminSidebar() {
  return (
    <aside className="h-screen w-64 bg-slate-900 text-slate-100 flex flex-col px-4 py-6 ">
      
      {/* Logo / Title */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-wide text-white">
          RealEstate Admin
        </h2>
        <p className="text-sm text-slate-400">Manage your listings</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {menuItems.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white transition"
          >
            <Icon size={20} />
            <span className="text-sm font-medium">{label}</span>
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="pt-6 border-t border-slate-800">
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-slate-300 hover:bg-red-500/10 hover:text-red-400 transition">
          <LogOut size={20} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
