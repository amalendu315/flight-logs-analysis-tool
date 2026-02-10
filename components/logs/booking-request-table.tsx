"use client";

import React, { useState } from "react";
import * as XLSX from "xlsx";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    useReactTable,
    SortingState,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";
import {
    ArrowUpDown,
    Download,
    Search,
    ChevronLeft,
    ChevronRight,
    FileText,
    User,
    Plane,
    Activity,
    Calendar,
    Hash, Clock,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { LogDataTable } from "@/components/logs/logs-data-table";

// --- Types ---
interface BookingRequest {
    ID: number;
    Request: string;
    AccountId: string;
    EntryDate: string;
    D: string;
    shortdesc: string;
    tpax: number;
}

// --- Helper Functions ---
const safeJsonParse = (str: any) => {
    try {
        if (!str) return {};
        const firstPass = JSON.parse(str);
        if (typeof firstPass === "string") return JSON.parse(firstPass);
        return firstPass;
    } catch (e) {
        return str;
    }
};

const formatTime = (dateString: string) => {
// Safe conversion handling

        const date = new Date(dateString as string);

        const _date = new Date(date);

        const offsetMilliseconds = (5 * 60 + 30) * 60 * 1000;

        _date.setTime(date.getTime() - offsetMilliseconds);


       return _date.toLocaleString("en-IN", {

            timeZone: "Asia/Kolkata",

            year: "numeric",

            month: "2-digit",

            day: "2-digit",

            hour: "2-digit",

            minute: "2-digit",

            second: "2-digit",

        });
};

// --- Sub-Component: Booking Details & Export Logic ---
// This component handles fetching related logs AND the combined export logic
const BookingDetails = ({ request }: { request: BookingRequest }) => {
    const { data: logsData, isLoading } = useQuery({
        queryKey: ["booking-related-logs", request.ID],
        queryFn: async () => {
            const res = await fetch(
                `/api/logs/requests?bookingRequestId=${request.ID}`
            );
            if (!res.ok) throw new Error("Failed to fetch related logs");
            return res.json();
        },
        enabled: !!request.ID,
    });

    const exportCombinedDetails = () => {
        const workbook = XLSX.utils.book_new();

        // 1. Prepare Booking Details Sheet
        const bookingSheetData = [
            {
                "Booking ID": request.ID,
                "Entry Date": formatTime(request.EntryDate),
                "Account ID": request.AccountId,
                "Description": request.shortdesc,
                "Pax": request.tpax,
                "D Value": request.D,
                "Full Request JSON": JSON.stringify(safeJsonParse(request.Request), null, 2)
            }
        ];
        const bookingSheet = XLSX.utils.json_to_sheet(bookingSheetData);
        XLSX.utils.book_append_sheet(workbook, bookingSheet, "Booking Details");

        // 2. Prepare Related Logs Sheet (if data exists)
        if (logsData && logsData.length > 0) {
            const truncate = (str: string, limit = 32000) => {
                if (!str) return "";
                if (str.length > limit) return str.substring(0, limit) + "... [Truncated]";
                return str;
            };

            const logsSheetData = logsData.map((log: any) => ({
                "Log ID": log.APILogID,
                "Time": formatTime(log.Entrydate),
                "Status": `${log.statcode} ${log.stat}`,
                "Endpoint": log.ApiUrl,
                "Vendor": log.APIVendorID,
                "Source": log.sources,
                "PNR": log.PnrNumber,
                "Request Body": truncate(JSON.stringify(log.Request)),
                "Response Body": truncate(JSON.stringify(log.Respone))
            }));
            const logsSheet = XLSX.utils.json_to_sheet(logsSheetData);
            XLSX.utils.book_append_sheet(workbook, logsSheet, "Related API Logs");
        }

        XLSX.writeFile(workbook, `Booking_${request.ID}_Case_Export.xlsx`);
    };

    return (
        <div className="flex flex-col h-full">
            {/* Header with Export Button */}
            <SheetHeader className="bg-white p-6 border-b sticky top-0 z-10 flex flex-row items-center justify-between">
                <div className="space-y-1">
                    <SheetTitle className="flex items-center gap-2 text-xl">
                        <Plane className="w-6 h-6 text-blue-600" /> Booking Request #{request.ID}
                    </SheetTitle>
                    <SheetDescription>
                        Created on {formatTime(request.EntryDate)} by{" "}
                        <span className="font-mono text-blue-600">{request.AccountId}</span>
                    </SheetDescription>
                </div>
                <Button
                    onClick={exportCombinedDetails}
                    variant="outline"
                    size="sm"
                    className="gap-2 text-blue-700 border-blue-200 hover:bg-blue-50"
                >
                    <Download className="w-4 h-4" /> Export Case
                </Button>
            </SheetHeader>

            {/* Content */}
            <div className="p-6 pb-20 overflow-y-auto">
                {/* Top Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-slate-50 p-3 rounded-lg border">
                        <div className="text-xs text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                            <User className="w-3 h-3" /> Short Desc
                        </div>
                        <div
                            className="font-medium text-slate-800 text-sm truncate"
                            title={request.shortdesc}
                        >
                            {request.shortdesc}
                        </div>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg border">
                        <div className="text-xs text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                            <User className="w-3 h-3" /> Total Pax
                        </div>
                        <div className="font-medium text-slate-800 text-sm">
                            {request.tpax}
                        </div>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg border">
                        <div className="text-xs text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                            <Hash className="w-3 h-3" /> D Value
                        </div>
                        <div className="font-medium text-slate-800 text-sm truncate">
                            {request.D || "N/A"}
                        </div>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg border">
                        <div className="text-xs text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                            <User className="w-3 h-3" /> Account
                        </div>
                        <div className="font-medium text-slate-800 text-sm">
                            {request.AccountId}
                        </div>
                    </div>
                </div>

                {/* Original Request JSON */}
                <div className="mb-6">
                    <h4 className="flex items-center gap-2 text-sm font-semibold mb-2 text-slate-800">
                        <FileText className="w-4 h-4 text-purple-500" /> Original Request JSON
                    </h4>
                    <div className="bg-slate-950 text-slate-50 rounded-lg p-4 overflow-auto border border-slate-800 max-h-[250px] shadow-inner">
            <pre className="text-xs font-mono">
              {JSON.stringify(safeJsonParse(request.Request), null, 2)}
            </pre>
                    </div>
                </div>

                {/* --- Related Logs Table --- */}
                <div className="mt-8 border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-blue-600" />
                        Related API Logs
                    </h3>
                    <div className="bg-slate-50 p-4 rounded-xl border">
                        <LogDataTable data={logsData} isLoading={isLoading} compactMode={true} />
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Main Component ---
export function BookingRequestTable({
                                        data,
                                        isLoading,
                                    }: {
    data: BookingRequest[];
    isLoading: boolean;
}) {
    const [sorting, setSorting] = useState<SortingState>([
        { id: "EntryDate", desc: true },
    ]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [selected, setSelected] = useState<BookingRequest | null>(null);

    const columns: ColumnDef<BookingRequest>[] = [
        {
            accessorKey: "ID",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    className="pl-0"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    ID <ArrowUpDown className="ml-2 h-3 w-3" />
                </Button>
            ),
            cell: ({ row }) => (
                <span className="font-mono font-bold text-slate-700">
          #{row.getValue("ID")}
        </span>
            ),
        },
        {
            accessorKey: "EntryDate",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    className="pl-0"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Entry Date <ArrowUpDown className="ml-2 h-3 w-3" />
                </Button>
            ),
            cell: ({row}) => {

                const dateString = row.getValue("EntryDate");

// Safe conversion handling

                const date = new Date(dateString as string);

                const formattedDate = date;

                const _date = new Date(formattedDate);

                const offsetMilliseconds = (5 * 60 + 30) * 60 * 1000;

                _date.setTime(date.getTime() - offsetMilliseconds);


                const updatedFormattedDate = _date.toLocaleString("en-IN", {

                    timeZone: "Asia/Kolkata",

                    year: "numeric",

                    month: "2-digit",

                    day: "2-digit",

                    hour: "2-digit",

                    minute: "2-digit",

                    second: "2-digit",

                });

                return (

                    <div className="flex items-center gap-2 text-xs text-slate-600">

                        <Clock className="w-3 h-3 text-slate-400"/>

                        {updatedFormattedDate}

                    </div>

                );

            },
        },
        {
            accessorKey: "AccountId",
            header:  ({ column }) => (
                <Button
                    variant="ghost"
                    className="pl-0"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Account ID <ArrowUpDown className="ml-2 h-3 w-3" />
                </Button>
            ),
            cell: ({ row }) => (
                <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-mono font-medium">
          {row.getValue("AccountId")}
        </span>
            ),
        },
        {
            accessorKey: "D",
            header:  ({ column }) => (
                <Button
                    variant="ghost"
                    className="pl-0"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    D <ArrowUpDown className="ml-2 h-3 w-3" />
                </Button>
            ),
            cell: ({ row }) => (
                <span className="text-xs font-mono text-slate-500">
          {row.getValue("D")}
        </span>
            ),
        },
        {
            accessorKey: "shortdesc",
            header: "Description",
            cell: ({ row }) => (
                <span
                    className="text-sm text-slate-700 max-w-[200px] truncate block"
                    title={row.getValue("shortdesc")}
                >
          {row.getValue("shortdesc")}
        </span>
            ),
        },
        {
            accessorKey: "tpax",
            header:  ({ column }) => (
                <Button
                    variant="ghost"
                    className="pl-0"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Pax <ArrowUpDown className="ml-2 h-3 w-3" />
                </Button>
            ),
            cell: ({ row }) => (
                <span className="font-mono font-medium">{row.getValue("tpax")}</span>
            ),
        },
    ];

    const table = useReactTable({
        data: data || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(), // Required for filtering
        onSortingChange: setSorting,
        state: { sorting, globalFilter },
        onGlobalFilterChange: setGlobalFilter,
        // --- CUSTOM FILTER: Searches all visible fields deeply ---
        globalFilterFn: (row, columnId, filterValue) => {
            const searchTerm = filterValue.toLowerCase();
            const item = row.original;

            return (
                String(item.ID).toLowerCase().includes(searchTerm) ||
                String(item.AccountId).toLowerCase().includes(searchTerm) ||
                String(item.shortdesc).toLowerCase().includes(searchTerm) ||
                String(item.D).toLowerCase().includes(searchTerm) ||
                // Also search inside the JSON request for power users
                JSON.stringify(item.Request).toLowerCase().includes(searchTerm)
            );
        },
        initialState: {
            pagination: { pageSize: 12 },
        },
    });

    if (isLoading)
        return (
            <div className="p-12 text-center animate-pulse text-slate-400 border rounded-xl bg-slate-50 border-dashed">
                Loading booking requests...
            </div>
        );

    return (
        <div className="space-y-4">
            {/* Toolbar - No Export Button Here anymore */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border shadow-sm">
                <div className="relative w-full">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search by ID, Account, Description or JSON content..."
                        value={globalFilter ?? ""}
                        onChange={(event) => setGlobalFilter(event.target.value)}
                        className="pl-8"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext(),
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    className="cursor-pointer hover:bg-slate-50 transition-colors"
                                    onClick={() => setSelected(row.original)}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center text-slate-500"
                                >
                                    No bookings found matching your search.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-end space-x-2 py-4">
        <span className="text-xs text-slate-500 mr-4">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
        </span>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>

            {/* Details Sheet - Now Uses the Smart Sub-Component */}
            <Sheet
                open={!!selected}
                onOpenChange={(open) => !open && setSelected(null)}
            >
                <SheetContent className="min-w-[800px] bg-white p-0 overflow-y-auto">
                    {selected && <BookingDetails request={selected} />}
                </SheetContent>
            </Sheet>
        </div>
    );
}