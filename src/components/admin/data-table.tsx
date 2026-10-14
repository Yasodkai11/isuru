"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface ColumnDef<T> {
  key: string;
  header: string;
  sortable?: boolean;
  className?: string;
  render?: (row: T) => React.ReactNode;
  sortValue?: (row: T) => string | number | boolean;
}

export interface FilterOption {
  key: string;
  label: string;
  options: { label: string; value: string }[];
}

export interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  searchPlaceholder?: string;
  searchFilter?: (row: T, query: string) => boolean;
  filterOptions?: FilterOption[];
  filterFn?: (row: T, activeFilters: Record<string, string>) => boolean;
  defaultSortKey?: string;
  defaultSortDirection?: "asc" | "desc";
  actions?: React.ReactNode;
  exportFilename?: string;
  emptyMessage?: string;
  initialPageSize?: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  searchPlaceholder = "Search records...",
  searchFilter,
  filterOptions = [],
  filterFn,
  defaultSortKey,
  defaultSortDirection = "desc",
  actions,
  exportFilename = "export-data",
  emptyMessage = "No matching records found.",
  initialPageSize = 10,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<string | undefined>(defaultSortKey);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">(defaultSortDirection);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // 1. Filter by search & custom filters
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        if (searchFilter) {
          if (!searchFilter(item, query)) return false;
        } else {
          // Default generic search across all string/number fields
          const match = Object.values(item).some((val) => {
            if (typeof val === "string" || typeof val === "number") {
              return String(val).toLowerCase().includes(query);
            }
            return false;
          });
          if (!match) return false;
        }
      }

      // Dropdown filters
      if (filterFn) {
        if (!filterFn(item, activeFilters)) return false;
      } else if (filterOptions.length > 0) {
        for (const [key, val] of Object.entries(activeFilters)) {
          if (val && val !== "all") {
            const itemVal = String(item[key] || "");
            if (itemVal.toLowerCase() !== val.toLowerCase()) return false;
          }
        }
      }

      return true;
    });
  }, [data, searchQuery, searchFilter, activeFilters, filterFn, filterOptions]);

  // 2. Sort
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;

    const column = columns.find((c) => c.key === sortKey);
    const sorted = [...filteredData].sort((a, b) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let valA: any = column?.sortValue ? column.sortValue(a) : a[sortKey];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let valB: any = column?.sortValue ? column.sortValue(b) : b[sortKey];

      if (valA === undefined || valA === null) valA = "";
      if (valB === undefined || valB === null) valB = "";

      if (typeof valA === "number" && typeof valB === "number") {
        return sortDirection === "asc" ? valA - valB : valB - valA;
      }

      const strA = String(valA).toLowerCase();
      const strB = String(valB).toLowerCase();

      return sortDirection === "asc" ? strA.localeCompare(strB) : strB.localeCompare(strA);
    });

    return sorted;
  }, [filteredData, sortKey, sortDirection, columns]);

  // 3. Paginate
  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * pageSize;
  const paginatedData = sortedData.slice(startIndex, startIndex + pageSize);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else {
        setSortKey(undefined);
      }
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const handleFilterChange = (filterKey: string, value: string) => {
    setActiveFilters((prev) => {
      const updated = { ...prev };
      if (!value || value === "all") {
        delete updated[filterKey];
      } else {
        updated[filterKey] = value;
      }
      return updated;
    });
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setActiveFilters({});
    setCurrentPage(1);
  };

  const handleExportCSV = () => {
    if (sortedData.length === 0) return;

    const headers = columns.map((c) => `"${c.header.replace(/"/g, '""')}"`).join(",");
    const rows = sortedData.map((row) =>
      columns
        .map((col) => {
          let val = col.sortValue ? col.sortValue(row) : row[col.key];
          if (val === undefined || val === null) val = "";
          return `"${String(val).replace(/"/g, '""')}"`;
        })
        .join(",")
    );

    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${exportFilename}-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const activeFilterCount = Object.keys(activeFilters).length + (searchQuery.trim() ? 1 : 0);

  return (
    <div className="space-y-4">
      {/* Top Toolbar: Search, Filters, Actions */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3.5">
        {/* Search bar & Filter dropdowns */}
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative min-w-[260px] max-w-sm flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2B2B2B]/40" />
            <Input
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={searchPlaceholder}
              className="pl-10 pr-9 text-sm h-10 bg-white/80 border-[#B8924A]/30 focus:border-[#5E0F1E]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2B2B2B]/40 hover:text-[#5E0F1E]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Dynamic Filter Dropdowns */}
          {filterOptions.map((f) => (
            <select
              key={f.key}
              value={activeFilters[f.key] || "all"}
              onChange={(e) => handleFilterChange(f.key, e.target.value)}
              className="text-sm h-10 bg-white/80 border border-[#B8924A]/30 text-[#2B2B2B] px-3.5 py-2 rounded-xs focus:outline-none focus:border-[#5E0F1E] font-medium transition-colors"
            >
              <option value="all">All {f.label}</option>
              {f.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ))}

          {/* Reset Filters button */}
          {activeFilterCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="text-xs text-[#5E0F1E] hover:underline font-semibold flex items-center gap-1.5 px-2.5 py-1.5 bg-[#5E0F1E]/5 rounded-xs"
            >
              <X className="w-3.5 h-3.5" />
              Clear filters ({activeFilterCount})
            </button>
          )}
        </div>

        {/* Export & Custom Actions */}
        <div className="flex items-center gap-2.5 self-end lg:self-auto shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="text-sm h-10 px-4 flex items-center gap-2 border-[#B8924A]/40 text-[#5E0F1E] hover:bg-[#B8924A]/10 font-semibold"
            title="Export filtered records to CSV"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </Button>

          {actions}
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto border border-[#B8924A]/30 bg-white/70 shadow-xs">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-[#F2EADB]/80 border-b border-[#B8924A]/30 text-[#5E0F1E] uppercase tracking-wider text-xs font-bold">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`p-4 select-none ${col.className || ""} ${
                    col.sortable ? "cursor-pointer hover:bg-[#F2EADB]" : ""
                  }`}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{col.header}</span>
                    {col.sortable && (
                      <span className="text-[#B8924A]">
                        {sortKey === col.key ? (
                          sortDirection === "asc" ? (
                            <ArrowUp className="w-4 h-4 text-[#5E0F1E]" />
                          ) : (
                            <ArrowDown className="w-4 h-4 text-[#5E0F1E]" />
                          )
                        ) : (
                          <ArrowUpDown className="w-3.5 h-3.5 text-[#B8924A]/50" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#B8924A]/15">
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="p-12 text-center text-[#2B2B2B]/60 italic font-medium text-sm"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, idx) => (
                <tr
                  key={row.id || idx}
                  className="hover:bg-[#FDFBF7] transition-colors"
                >
                  {columns.map((col) => (
                    <td key={col.key} className={`p-4 align-middle ${col.className || ""}`}>
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3.5 text-sm text-[#2B2B2B]/80 pt-2">
        {/* Results summary & page size */}
        <div className="flex items-center gap-3.5">
          <span>
            Showing{" "}
            <strong className="text-[#5E0F1E]">
              {sortedData.length > 0 ? startIndex + 1 : 0}
            </strong>{" "}
            to{" "}
            <strong className="text-[#5E0F1E]">
              {Math.min(startIndex + pageSize, sortedData.length)}
            </strong>{" "}
            of <strong className="text-[#5E0F1E]">{sortedData.length}</strong> records
          </span>

          <div className="flex items-center gap-1.5">
            <span className="text-[#2B2B2B]/50">• Rows:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-transparent border border-[#B8924A]/30 text-sm px-2.5 py-1 rounded-xs text-[#5E0F1E] font-semibold"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        {/* Page navigation buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={validCurrentPage <= 1}
            className="h-9 px-3 text-sm border-[#B8924A]/30 text-[#5E0F1E] disabled:opacity-40 font-medium"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Prev</span>
          </Button>

          <span className="px-3.5 py-1.5 bg-[#F2EADB] border border-[#B8924A]/30 text-sm font-semibold text-[#5E0F1E]">
            {validCurrentPage} / {totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={validCurrentPage >= totalPages}
            className="h-9 px-3 text-sm border-[#B8924A]/30 text-[#5E0F1E] disabled:opacity-40 font-medium"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
