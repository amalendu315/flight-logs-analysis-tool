"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Search, Plane, ArrowRight } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">
        Dashboard
      </h1>

      <div className="grid gap-4 md:grid-cols-3">
        {/* General Logs Card */}
        <Link href="/logs">
          <Card className="hover:shadow-lg transition-all cursor-pointer border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                General API Logs
              </CardTitle>
              <Activity className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">System Logs</div>
              <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                View all traffic <ArrowRight className="w-3 h-3" />
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Search Logs Card */}
        <Link href="/search-logs">
          <Card className="hover:shadow-lg transition-all cursor-pointer border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Search Traffic
              </CardTitle>
              <Search className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Search Logs</div>
              <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                Analyze queries <ArrowRight className="w-3 h-3" />
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Booking Requests Card */}
        <Link href="/booking-requests">
          <Card className="hover:shadow-lg transition-all cursor-pointer border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bookings</CardTitle>
              <Plane className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Booking Requests</div>
              <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                Manage orders <ArrowRight className="w-3 h-3" />
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
