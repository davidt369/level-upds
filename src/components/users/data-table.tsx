"use client";

import * as React from "react";
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";

import {
    ArrowUpDown,
    ChevronLeft,
    ChevronRight,
    Download,
    Filter,
    Search,
    Settings2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    filterColumn?: string;
    filterOptions?: { label: string; value: string }[];
}

export function DataTable<TData, TValue>({
    columns,
    data,
    filterColumn,
    filterOptions,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    );
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [globalFilter, setGlobalFilter] = React.useState("");
    const [isMobileFilterOpen, setIsMobileFilterOpen] = React.useState(false);

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onGlobalFilterChange: setGlobalFilter,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            globalFilter,
        },
    });

    const exportToCSV = () => {
        const headers = table.getVisibleLeafColumns().map((col) => col.id);

        const rows = table.getFilteredRowModel().rows.map((row) =>
            headers.map((header) => {
                const cellValue = row.getValue(header);
                return typeof cellValue === "string"
                    ? `"${cellValue}"`
                    : cellValue ?? "";
            })
        );

        const csvContent =
            "data:text/csv;charset=utf-8," +
            [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="w-full space-y-4">
            {/* MOBILE FIRST CONTROLS */}
            <div className="lg:hidden space-y-3">
                {/* SEARCH BAR */}
                <div className="relative">
                    <Input
                        placeholder="Buscar..."
                        value={globalFilter ?? ""}
                        onChange={(event) => setGlobalFilter(event.target.value)}
                        className="w-full pl-10"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                    {/* MOBILE FILTER BUTTON */}
                    <Dialog open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
                        <DialogTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                            >
                                <Filter className="h-4 w-4" />
                            </Button>
                        </DialogTrigger>

                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Filtros y columnas</DialogTitle>
                            </DialogHeader>

                            <div className="space-y-6 py-4">
                                {filterColumn &&
                                    filterOptions &&
                                    table.getColumn(filterColumn) && (
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Filtrar por</label>

                                            <Select
                                                value={
                                                    (table
                                                        .getColumn(filterColumn)
                                                        ?.getFilterValue() as string) ?? "all"
                                                }
                                                onValueChange={(value) =>
                                                    table
                                                        .getColumn(filterColumn)
                                                        ?.setFilterValue(value === "all" ? "" : value)
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Seleccione" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">Todos</SelectItem>
                                                    {filterOptions.map((opt) => (
                                                        <SelectItem key={opt.value} value={opt.value}>
                                                            {opt.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}

                                <div className="space-y-2">
                                    <span className="text-sm font-medium">Columnas visibles</span>
                                    <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto">
                                        {table
                                            .getAllColumns()
                                            .filter((column) => column.getCanHide())
                                            .map((column) => (
                                                <label
                                                    key={column.id}
                                                    className="flex items-center gap-2 text-sm capitalize"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={column.getIsVisible()}
                                                        onChange={(e) =>
                                                            column.toggleVisibility(e.target.checked)
                                                        }
                                                    />
                                                    {column.id}
                                                </label>
                                            ))}
                                    </div>
                                </div>

                                <Button className="w-full" onClick={exportToCSV}>
                                    <Download className="h-4 w-4 mr-2" />
                                    Exportar CSV
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* MOBILE ACTIONS */}
                <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                        {table.getFilteredRowModel().rows.length} resultados
                    </span>

                    <div className="flex gap-2">
                        <Button variant="outline" size="icon" onClick={exportToCSV}>
                            <Download className="h-4 w-4" />
                        </Button>

                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="icon">
                                    <Settings2 className="h-4 w-4" />
                                </Button>
                            </DialogTrigger>

                            <DialogContent className="sm:max-w-sm">
                                <DialogHeader>
                                    <DialogTitle>Columnas</DialogTitle>
                                </DialogHeader>

                                <div className="space-y-2 py-2">
                                    {table
                                        .getAllColumns()
                                        .filter((col) => col.getCanHide())
                                        .map((col) => (
                                            <label
                                                key={col.id}
                                                className="flex items-center gap-2 text-sm capitalize"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={col.getIsVisible()}
                                                    onChange={(e) => col.toggleVisibility(e.target.checked)}
                                                />
                                                {col.id}
                                            </label>
                                        ))}
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>

            {/* DESKTOP CONTROLS */}
            <div className="hidden lg:flex items-center justify-between gap-4">
                <Input
                    placeholder="Buscar..."
                    value={globalFilter ?? ""}
                    onChange={(event) => setGlobalFilter(event.target.value)}
                    className="max-w-sm"
                />

                {filterColumn && filterOptions && table.getColumn(filterColumn) && (
                    <Select
                        value={
                            (table.getColumn(filterColumn)?.getFilterValue() as string) ??
                            "all"
                        }
                        onValueChange={(value) =>
                            table
                                .getColumn(filterColumn)
                                ?.setFilterValue(value === "all" ? "" : value)
                        }
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filtrar" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos</SelectItem>
                            {filterOptions.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}

                <div className="flex gap-2">
                    <Button variant="outline" onClick={exportToCSV} size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Exportar
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                                <Settings2 className="h-4 w-4 mr-2" />
                                Columnas
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-56">
                            {table
                                .getAllColumns()
                                .filter((col) => col.getCanHide())
                                .map((col) => (
                                    <DropdownMenuCheckboxItem
                                        key={col.id}
                                        checked={col.getIsVisible()}
                                        onCheckedChange={(v) => col.toggleVisibility(!!v)}
                                        className="capitalize"
                                    >
                                        {col.id}
                                    </DropdownMenuCheckboxItem>
                                ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* TABLE */}
            <div className="rounded-md border overflow-x-auto">
                <Table className="min-w-full">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="px-3 py-3 whitespace-nowrap">
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>

                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="px-3 py-3 whitespace-nowrap">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="py-6 text-center">
                                    No hay resultados.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* PAGINACIÓN */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                {/* MOBILE */}
                <div className="flex sm:hidden items-center gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        disabled={!table.getCanPreviousPage()}
                        onClick={() => table.previousPage()}
                        className="h-8 w-8"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <span className="text-sm font-medium">
                        {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
                    </span>

                    <Button
                        variant="outline"
                        size="icon"
                        disabled={!table.getCanNextPage()}
                        onClick={() => table.nextPage()}
                        className="h-8 w-8"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>

                {/* DESKTOP */}
                <div className="hidden sm:flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={!table.getCanPreviousPage()}
                        onClick={() => table.previousPage()}
                    >
                        Anterior
                    </Button>

                    <span className="text-sm">
                        Página {table.getState().pagination.pageIndex + 1} de{" "}
                        {table.getPageCount()}
                    </span>

                    <Button
                        variant="outline"
                        size="sm"
                        disabled={!table.getCanNextPage()}
                        onClick={() => table.nextPage()}
                    >
                        Siguiente
                    </Button>
                </div>
            </div>
        </div>
    );
}
