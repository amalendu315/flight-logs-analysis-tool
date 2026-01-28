"use client";

import { Bell } from "lucide-react";

export function Header() {
  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-6 shadow-sm z-10 sticky top-0">
      <div className="flex items-center gap-4">
        {/* Breadcrumb or Title could go here */}
        <h2 className="text-slate-500 text-sm font-medium">
          System Status: <span className="text-green-600">Online</span>
        </h2>
      </div>

      <div className="flex items-center gap-4">
        {/* <button className="relative p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button> */}

        {/* User Profile Snippet */}
        <div className="flex items-center gap-3 pl-4 border-l">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-slate-900">Admin User</p>
            <p className="text-xs text-slate-500">Super Admin</p>
          </div>
          <div className="h-9 w-9 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-bold shadow-sm">
            A
          </div>
        </div>
      </div>
    </header>
  );
}
