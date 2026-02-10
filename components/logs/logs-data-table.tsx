"use client";

import React, {useState} from "react";
import * as XLSX from "xlsx";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
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
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
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
    Server,
    Database,
    Code2,
    Clock,
    Globe,
    Hash,
    CreditCard,
    Plane,
    Link as LinkIcon,
} from "lucide-react";
import {cn} from "@/lib/utils";

// --- Types ---
export interface APILog {
    APILogID: number;
    ApiUrl: string;
    Request: any;
    Respone: any; // Keeping typo 'Respone' to match DB
    APIVendorID: number;
    Entrydate: string;
    stat: string;
    statcode: number;
    Ipaddress: string;
    AccountID: number | null;
    sources: string | null;
    PnrNumber: string | null;
    BookingRequestID: string | null;
}

interface LogTableProps {
    data: APILog[];
    isLoading: boolean;
    compactMode?: boolean; // New prop to hide toolbar if used inside another sheet
    title?: string; // Optional title for compact mode headers
}

export function LogDataTable({
                                 data,
                                 isLoading,
                                 compactMode = false,
                                 title
                             }: LogTableProps) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [selectedLog, setSelectedLog] = useState<APILog | null>(null);

    // --- Helper Functions ---
    const formatTime = (dateString: string) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
    };

    const getStatusColor = (code: number) => {
        if (code >= 200 && code < 300)
            return "bg-green-100 text-green-700 border-green-200";
        if (code >= 400 && code < 500)
            return "bg-orange-100 text-orange-700 border-orange-200";
        if (code >= 500) return "bg-red-100 text-red-700 border-red-200";
        return "bg-slate-100 text-slate-700";
    };

    const safeJsonParse = (str: any) => {
        if (!str) return null;
        if (typeof str === "object") return str;
        try {
            const firstPass = JSON.parse(str);
            if (typeof firstPass === "string") return JSON.parse(firstPass);
            return firstPass;
        } catch (e) {
            return str;
        }
    };

    // --- Columns Definition ---
    const columns: ColumnDef<APILog>[] = [

        {

            accessorKey: "APILogID",

            header: ({column}) => (

                <Button

                    variant="ghost"

                    className="pl-0 hover:bg-transparent"

                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}

                >

                    ID <ArrowUpDown className="ml-2 h-3 w-3"/>

                </Button>

            ),

            cell: ({row}) => (

                <span className="font-mono text-xs text-slate-500">

{row.getValue("APILogID")}

</span>

            ),

        },

        {

            accessorKey: "Entrydate",

            header: ({column}) => (

                <Button

                    variant="ghost"

                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}

                    className="pl-0 hover:bg-transparent"

                >

                    Timestamp

                    <ArrowUpDown className="ml-2 h-3 w-3"/>

                </Button>

            ),

            cell: ({row}) => {

                const dateString = row.getValue("Entrydate");

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

            accessorKey: "statcode",

            header: "Status",

            cell: ({row}) => (

                <Badge

                    variant="outline"

                    className={cn(
                        "font-mono text-[10px]",

                        getStatusColor(row.getValue("statcode")),
                    )}

                >

                    {row.getValue("statcode")} {row.original.stat}

                </Badge>

            ),

        },

        {

            accessorKey: "ApiUrl",

            header: "Endpoint",

            cell: ({row}) => (

                <div

                    className="max-w-50 lg:max-w-75 truncate font-medium text-slate-700 text-xs"

                    title={row.getValue("ApiUrl")}

                >

                    {row.getValue("ApiUrl")}

                </div>

            ),

        },

        {

            accessorKey: "APIVendorID",

            header: ({column}) => (

                <Button

                    variant="ghost"

                    className="pl-0 hover:bg-transparent"

                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}

                >

                    Vendor <ArrowUpDown className="ml-2 h-3 w-3"/>

                </Button>

            ),

            cell: ({row}) =>

                row.getValue("APIVendorID") ? (

                    <span className="text-xs font-mono bg-slate-100 px-1 rounded">

{row.getValue("APIVendorID")}

</span>

                ) : (

                    <span className="text-slate-300">-</span>

                ),

        },

        {

            accessorKey: "AccountID",

            header: ({column}) => (

                <Button

                    variant="ghost"

                    className="pl-0 hover:bg-transparent"

                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}

                >

                    Account <ArrowUpDown className="ml-2 h-3 w-3"/>

                </Button>

            ),

            cell: ({row}) =>

                row.getValue("AccountID") ? (

                    <Badge variant="secondary" className="text-[10px]">

                        {row.getValue("AccountID")}

                    </Badge>

                ) : (

                    <span className="text-slate-300">-</span>

                ),

        },

        {

            accessorKey: "sources",

            header: ({column}) => (

                <Button

                    variant="ghost"

                    className="pl-0 hover:bg-transparent"

                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}

                >

                    Sources <ArrowUpDown className="ml-2 h-3 w-3"/>

                </Button>

            ),

            cell: ({row}) => {

                const stat = row.getValue("sources");

                return (

                    <div className="text-center">

                        <div className="max-w-50 lg:max-w-75 truncate font-medium text-slate-700 text-xs">

                            {stat ? String(stat) : "-"}

                        </div>

                    </div>

                );

            },

        },

        {

            accessorKey: "PnrNumber",

            header: ({column}) => (

                <Button

                    variant="ghost"

                    className="pl-0 hover:bg-transparent"

                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}

                >

                    PNR <ArrowUpDown className="ml-2 h-3 w-3"/>

                </Button>

            ),

            cell: ({row}) => {

                const stat = row.getValue("PnrNumber");

                return (

                    <div className="text-center">

                        <div className="max-w-50 lg:max-w-75 truncate font-medium text-slate-700 text-xs">

                            {stat ? String(stat) : "-"}

                        </div>

                    </div>

                );

            },

        },

        {

            accessorKey: "BookingRequestID",

            header: ({column}) => (

                <Button

                    variant="ghost"

                    className="pl-0 hover:bg-transparent"

                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}

                >

                    BookingID <ArrowUpDown className="ml-2 h-3 w-3"/>

                </Button>

            ),

            cell: ({row}) =>

                row.getValue("BookingRequestID") ? (

                    <Badge variant="secondary" className="text-[10px] text-center">

                        {row.getValue("BookingRequestID")}

                    </Badge>

                ) : (

                    <span className="text-slate-300">-</span>

                ),

        },

    ];


    // --- Table Hooks ---
    const table = useReactTable({
        data: data || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        state: {
            sorting,
            globalFilter,
        },
        onGlobalFilterChange: setGlobalFilter,
        // --- CUSTOM GLOBAL FILTER ---
        // This function allows searching inside Request and Response objects
        globalFilterFn: (row, columnId, filterValue) => {
            const searchTerm = filterValue.toLowerCase();
            const log = row.original;

            // 1. Check basic visible fields
            const basicMatch =
                String(log.APILogID).toLowerCase().includes(searchTerm) ||
                String(log.ApiUrl).toLowerCase().includes(searchTerm) ||
                String(log.statcode).toLowerCase().includes(searchTerm) ||
                (log.AccountID && String(log.AccountID).toLowerCase().includes(searchTerm)) ||
                (log.PnrNumber && String(log.PnrNumber).toLowerCase().includes(searchTerm)) ||
                (log.sources && String(log.sources).toLowerCase().includes(searchTerm));

            if (basicMatch) return true;

            // 2. Check Deeply inside Request and Response
            const toStringForSearch = (val: any) => {
                if (!val) return "";
                if (typeof val === 'string') return val.toLowerCase();
                return JSON.stringify(val).toLowerCase();
            };

            if (toStringForSearch(log.Request).includes(searchTerm)) return true;
            if (toStringForSearch(log.Respone).includes(searchTerm)) return true;

            return false;
        },
        initialState: {
            pagination: {pageSize: compactMode ? 5 : 15},
        },
    });

    // --- EXPORT WITH TRUNCATION ---
    const exportToExcel = () => {
        // Helper to truncate text to Excel's 32k limit
        const truncate = (str: string, limit = 32000) => {
            if (!str) return "";
            if (str.length > limit) return str.substring(0, limit) + "... [Truncated for Excel]";
            return str;
        };

        // Export only the rows currently visible (filtered)
        const rowsToExport = table.getFilteredRowModel().rows.map(row => {
            const original = row.original;
            return {
                ID: original.APILogID,
                Timestamp: formatTime(original.Entrydate),
                Status: `${original.statcode} ${original.stat}`,
                Endpoint: original.ApiUrl,
                Vendor: original.APIVendorID,
                Account: original.AccountID,
                Source: original.sources,
                PNR: original.PnrNumber,
                BookingReqID: original.BookingRequestID,
                // Truncate large JSON fields to prevent crash
                Request: truncate(JSON.stringify(original.Request)),
                Response: truncate(JSON.stringify(original.Respone))
            }
        });

        const worksheet = XLSX.utils.json_to_sheet(rowsToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Logs");
        XLSX.writeFile(workbook, `Logs_Export_${new Date().getTime()}.xlsx`);
    };

    if (isLoading) {
        return (
            <div className="space-y-4 p-4">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-12 bg-slate-100 animate-pulse rounded-md"/>
                ))}
            </div>
        );
    }

    if (!data?.length) {
        return (
            <div className="p-8 text-center text-slate-400 border rounded-xl bg-slate-50 border-dashed text-sm">
                No logs found.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* --- Toolbar (Standard) --- */}
            {!compactMode && (
                <div
                    className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border shadow-sm">
                    <div className="relative w-full sm:w-96">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400"/>
                        <Input
                            placeholder="Search Request, Response, ID or URL..."
                            value={globalFilter ?? ""}
                            onChange={(event) => setGlobalFilter(event.target.value)}
                            className="pl-8"
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={exportToExcel}
                            className="w-full sm:w-auto text-green-700 hover:text-green-800 hover:bg-green-50 border-green-200"
                        >
                            <Download className="mr-2 h-4 w-4"/> Export Excel
                        </Button>
                    </div>
                </div>
            )}

            {/* --- Toolbar (Compact Mode for Details Sheet) --- */}
            {compactMode && (
                <div className="flex items-center justify-between mb-4">
                    {title && <h4 className="text-sm font-semibold">{title}</h4>}
                    <Button variant="outline" size="sm" onClick={exportToExcel} className="h-8 text-xs">
                        <Download className="mr-2 h-3 w-3"/> Export Logs
                    </Button>
                </div>
            )}

            {/* --- Table --- */}
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
                                    data-state={row.getIsSelected() && "selected"}
                                    className="cursor-pointer hover:bg-blue-50/50"
                                    onClick={() => setSelectedLog(row.original)}
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
                                    className="h-24 text-center"
                                >
                                    No results found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* --- Pagination --- */}
            <div className="flex items-center justify-end space-x-2 py-2">
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
                    <ChevronLeft className="h-4 w-4"/>
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    <ChevronRight className="h-4 w-4"/>
                </Button>
            </div>

            {/* --- Details Sheet (Slide Over) --- */}
            <Sheet
                open={!!selectedLog}
                onOpenChange={(open) => !open && setSelectedLog(null)}
            >
                <SheetContent className="min-w-200 overflow-y-auto bg-slate-50/50 p-0 z-50">
                    {selectedLog && (
                        <div className="flex flex-col h-full">
                            <SheetHeader className="bg-white p-6 border-b sticky top-0 z-10 shadow-sm">
                                <div className="flex items-center gap-2 mb-2">
                                    <Badge className={getStatusColor(selectedLog.statcode)}>
                                        {selectedLog.statcode}
                                    </Badge>
                                    <span className="text-xs text-slate-400 font-mono">
                    Log ID: {selectedLog.APILogID}
                  </span>
                                </div>
                                <SheetTitle
                                    className="break-all font-mono text-sm text-blue-700 border p-2 rounded bg-blue-50/50">
                                    {selectedLog.ApiUrl}
                                </SheetTitle>
                                <SheetDescription className="flex gap-4 pt-2">
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-3 h-3"/>{" "}
                                        {formatTime(selectedLog.Entrydate)}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Server className="w-3 h-3"/>{" "}
                                        {selectedLog.Ipaddress || "No IP"}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Globe className="w-3 h-3"/> Vendor:{" "}
                                        {selectedLog.APIVendorID}
                                    </div>
                                </SheetDescription>
                            </SheetHeader>

                            <div className="p-6 space-y-6">
                                {/* --- Metadata Grid (Replicates old LogPage fields) --- */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white p-3 rounded border shadow-sm">
                                        <div
                                            className="text-xs text-slate-400 font-semibold mb-1 flex items-center gap-1">
                                            <CreditCard className="w-3 h-3"/> Account ID
                                        </div>
                                        <div className="text-sm font-medium">
                                            {selectedLog.AccountID || "N/A"}
                                        </div>
                                    </div>
                                    <div className="bg-white p-3 rounded border shadow-sm">
                                        <div
                                            className="text-xs text-slate-400 font-semibold mb-1 flex items-center gap-1">
                                            <Hash className="w-3 h-3"/> Source
                                        </div>
                                        <div className="text-sm font-medium">
                                            {selectedLog.sources || "N/A"}
                                        </div>
                                    </div>
                                    <div className="bg-white p-3 rounded border shadow-sm">
                                        <div
                                            className="text-xs text-slate-400 font-semibold mb-1 flex items-center gap-1">
                                            <Plane className="w-3 h-3"/> PNR Number
                                        </div>
                                        <div className="text-sm font-medium">
                                            {selectedLog.PnrNumber || "N/A"}
                                        </div>
                                    </div>
                                    <div className="bg-white p-3 rounded border shadow-sm">
                                        <div
                                            className="text-xs text-slate-400 font-semibold mb-1 flex items-center gap-1">
                                            <LinkIcon className="w-3 h-3"/> Booking Req ID
                                        </div>
                                        <div className="text-sm font-medium font-mono">
                                            {selectedLog.BookingRequestID || "N/A"}
                                        </div>
                                    </div>
                                </div>

                                {/* --- Request --- */}
                                <div className="space-y-2">
                                    <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                                        <Code2 className="w-4 h-4 text-purple-500"/> Request
                                        Payload
                                    </h4>
                                    <div
                                        className="bg-slate-950 text-slate-50 rounded-lg border border-slate-800 shadow-inner overflow-hidden">
                    <pre className="p-4 text-xs font-mono overflow-x-auto max-h-75">
                      {JSON.stringify(
                          safeJsonParse(selectedLog.Request),
                          null,
                          2,
                      )}
                    </pre>
                                    </div>
                                </div>

                                {/* --- Response --- */}
                                <div className="space-y-2">
                                    <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                                        <Database className="w-4 h-4 text-emerald-500"/> Response
                                        Body
                                    </h4>
                                    <div
                                        className="bg-slate-950 text-emerald-50 rounded-lg border border-slate-800 shadow-inner overflow-hidden">
                    <pre className="p-4 text-xs font-mono overflow-x-auto">
                      {JSON.stringify(
                          safeJsonParse(selectedLog.Respone),
                          null,
                          2,
                      )}
                    </pre>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    );
}