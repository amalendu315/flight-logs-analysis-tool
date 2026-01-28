"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Plane,
  Search,
  FileJson,
  LogOut,
  ShieldAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";

// Define your navigation items here
const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "General Logs", href: "/logs", icon: FileJson },
  { name: "Search Logs", href: "/search-logs", icon: Search },
  { name: "Booking Requests", href: "/booking-requests", icon: Plane },
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth(); 

  return (
    <div className="flex flex-col h-full">
      {/* Logo Area */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-950">
        <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
          <ShieldAlert className="w-6 h-6 text-blue-500" />
          <span className="bg-linear-to-r from-white to-slate-400 bg-clip-text text-transparent">
            FlightOps
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-800",
              )}
            >
              <item.icon
                className={cn(
                  "w-5 h-5",
                  isActive ? "text-white" : "text-slate-500",
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-slate-800 bg-slate-950">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-950/30 rounded-md transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
