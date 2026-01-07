import { useState, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

export default function DataTable({
  columns,
  data,
  rowsPerPageOptions = [5, 10, 20],
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(
    rowsPerPageOptions[0].toString()
  );

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: null,
  });

  /* ================= SORT ================= */
  const handleSort = (accessor) => {
    setSortConfig((prev) => {
      if (prev.key === accessor) {
        if (prev.direction === "asc")
          return { key: accessor, direction: "desc" };
        if (prev.direction === "desc") return { key: null, direction: null };
      }
      return { key: accessor, direction: "asc" };
    });
    setCurrentPage(1);
  };

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (aVal == null) return 1;
      if (bVal == null) return -1;

      if (typeof aVal === "number") {
        return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
      }

      return sortConfig.direction === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [data, sortConfig]);

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(sortedData.length / Number(rowsPerPage));

  const currentData = useMemo(() => {
    const start = (currentPage - 1) * Number(rowsPerPage);
    const end = start + Number(rowsPerPage);
    return sortedData.slice(start, end);
  }, [currentPage, rowsPerPage, sortedData]);

  const startItem =
    sortedData.length === 0 ? 0 : (currentPage - 1) * Number(rowsPerPage) + 1;

  const endItem = Math.min(
    currentPage * Number(rowsPerPage),
    sortedData.length
  );

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxPagesToShow - 1);

    if (end - start < maxPagesToShow - 1) {
      start = Math.max(1, end - maxPagesToShow + 1);
    }

    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  const pageNumbers = getPageNumbers();
  return (
    <div className="w-full overflow-x-auto  rounded-lg shadow-sm">
      <table className="w-full border-collapse">
        <thead className="bg-neutral-800">
          <tr className="border">
            {columns.map((col) => (
              <th
                key={col.accessor}
                onClick={() => col.sortable && handleSort(col.accessor)}
                className={`p-3 text-sm font-semibold border-b border-neutral-700
    ${col.sortable ? "cursor-pointer select-none hover:bg-neutral-700" : ""}
    ${col.accessor === "title" ? "text-left" : "text-center"}
  `}
              >
                <div
                  className={`flex items-center gap-1 ${
                    col.accessor === "title"
                      ? "justify-start"
                      : "justify-center"
                  }`}
                >
                  {col.header}

                  {col.sortable && (
                    <>
                      {sortConfig.key !== col.accessor && (
                        <ArrowUpDown className="w-4 h-4 opacity-50" />
                      )}
                      {sortConfig.key === col.accessor &&
                        sortConfig.direction === "asc" && (
                          <ArrowUp className="w-4 h-4" />
                        )}
                      {sortConfig.key === col.accessor &&
                        sortConfig.direction === "desc" && (
                          <ArrowDown className="w-4 h-4" />
                        )}
                    </>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentData.map((row, idx) => (
            <tr key={idx} className="border-b border-neutral-700">
              {columns.map((col) => (
                <td
                  key={col.accessor}
                  className={`p-2 text-sm border-b border-neutral-700
    ${col.accessor === "title" ? "text-left" : "text-center"}
  `}
                >
                  {col.cell ? col.cell(row) : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}

          {currentData.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="p-4 text-center">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="flex flex-col lg:flex-row flex-wrap items-center border justify-between  gap-3 px-4 py-3 rounded-b-lg shadow-sm bg-neutral-800">
        <div className="flex-shrink-0 text-xs  px-2 py-1 rounded">
          Showing {currentData.length > 0 ? startItem : 0}–{endItem} of{" "}
          {data.length}
        </div>

        {/* ShadCN Pagination (tengah) */}
        <div className="flex-1 flex justify-center min-w-auto">
          <Pagination>
            <PaginationContent className="flex flex-wrap gap-1 justify-center">
              {/* Previous */}
              <PaginationItem>
                <PaginationPrevious
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage((p) => Math.max(p - 1, 1));
                  }}
                  disabled={currentPage === 1}
                  className="cursor-pointer"
                />
              </PaginationItem>

              {/* Page numbers */}
              {pageNumbers[0] > 1 && (
                <PaginationItem>
                  <PaginationLink
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(1);
                    }}
                    className="hover:bg-neutral-800 cursor-pointer"
                  >
                    1
                  </PaginationLink>
                </PaginationItem>
              )}
              {pageNumbers[0] > 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              {pageNumbers.map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(page);
                    }}
                    isActive={page === currentPage}
                    className={`${
                      page === currentPage
                        ? "bg-neutral-800 hover:bg-neutral-700 cursor-pointer"
                        : "hover:bg-neutral-800 cursor-pointer"
                    }`}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

              {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              {pageNumbers[pageNumbers.length - 1] < totalPages && (
                <PaginationItem>
                  <PaginationLink
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(totalPages);
                    }}
                    className="hover:bg-neutral-800 cursor-pointer"
                  >
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              )}

              {/* Next */}
              <PaginationItem>
                <PaginationNext
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage((p) => Math.min(p + 1, totalPages));
                  }}
                  disabled={currentPage === totalPages}
                  className="cursor-pointer"
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>

        {/* Rows per page */}
        <div className="flex-shrink-0 flex items-center gap-2 mt-2 md:mt-0">
          <span className="text-sm">Rows per page:</span>
          <Select
            value={rowsPerPage}
            onValueChange={(value) => {
              setRowsPerPage(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-36 bg-neutral-800 border border-neutral-700 rounded-md">
              <SelectValue placeholder="Rows" className="text-sm text-white" />
            </SelectTrigger>
            <SelectContent className="bg-neutral-800 text-white border border-neutral-700">
              {rowsPerPageOptions.map((opt) => (
                <SelectItem
                  key={opt}
                  value={opt.toString()}
                  className="hover:bg-neutral-700 focus:bg-neutral-700"
                >
                  {opt} / page
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
