"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { LogDataTable } from "@/components/logs/logs-data-table"; // Reusing the generic table
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalendarIcon, RefreshCw, Search as SearchIcon } from "lucide-react";

export default function SearchLogsPage() {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  // Fetching from your existing Search API
  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["search-logs", date],
    queryFn: async () => {
      // Note: This points to your existing API route
      const res = await fetch(`/api/search-logs?date=${date}`);
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    placeholderData: (previousData) => previousData,
  });

  return (
    <div className="space-y-6 max-w-400 mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <SearchIcon className="w-6 h-6 text-purple-600" />
            Search Logs
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Detailed logs of flight search queries.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white p-1.5 pl-3 rounded-lg border shadow-sm">
            <CalendarIcon className="w-4 h-4 text-slate-400" />
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
            className={isFetching ? "animate-spin text-purple-600" : ""}
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Reuse the LogDataTable because Search Logs have similar JSON structure */}
      <LogDataTable data={data} isLoading={isLoading} />
    </div>
  );
}
