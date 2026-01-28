"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { LogDataTable } from "@/components/logs/logs-data-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarIcon, RefreshCw, Filter } from "lucide-react";

export default function LogsPage() {
  // 1. State: Default to today's date (YYYY-MM-DD)
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  // 2. Data Fetching Hook (React Query)
  // This automatically handles caching, loading states, and refetching
  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["logs", date], // Unique key: if 'date' changes, it refetches automatically
    queryFn: async () => {
      const res = await fetch(`/api/logs?date=${date}`);
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    placeholderData: (previousData) => previousData, // Prevents flickering when changing dates
  });

  return (
    <div className="space-y-6 max-w-400 mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            General API Logs
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Monitor API traffic, latency, and status codes.
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white p-1.5 pl-3 rounded-lg border shadow-sm">
            <CalendarIcon className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-400 font-medium mr-1">
              Filter Date:
            </span>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-8 border-0 p-0 focus-visible:ring-0 w-auto text-sm"
            />
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            className={
              isFetching ? "animate-spin text-blue-600 border-blue-200" : ""
            }
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <LogDataTable data={data} isLoading={isLoading} />
    </div>
  );
}
