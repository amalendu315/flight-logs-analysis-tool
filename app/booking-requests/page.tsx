"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BookingRequestTable } from "@/components/logs/booking-request-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalendarIcon, RefreshCw, Plane } from "lucide-react";

export default function BookingRequestsPage() {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["booking-requests", date],
    queryFn: async () => {
      const res = await fetch(`/api/booking-requests?date=${date}`);
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    placeholderData: (previousData) => previousData,
  });

  return (
    // ✅ Fixed width from 'max-w-400' to 'max-w-[1600px]'
    <div className="space-y-6 max-w-400 mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Plane className="w-6 h-6 text-green-600" />
            Booking Requests
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Track all booking attempts and PNR generations.
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
            className={isFetching ? "animate-spin text-green-600" : ""}
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <BookingRequestTable data={data} isLoading={isLoading} />
    </div>
  );
}
