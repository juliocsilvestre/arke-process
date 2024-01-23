import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/Pagination'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import { cn } from '@/utils/styles'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table'
import { Input } from './Input'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  count: number
  onRowClick?: (row: TData) => void
  onQueryChange?: (query: string) => void
}

export const DataTable = <TData, TValue>({
  columns,
  data,
  count,
  onRowClick,
  onQueryChange,
}: DataTableProps<TData, TValue>) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div className="flex flex-col justify-end	gap-4">
      <div className="relative ml-auto">
        <MagnifyingGlassIcon className="h-6 w-6 text-gray-400 absolute left-3 top-[50%] translate-y-[-50%]" />
        <Input
          className="w-full mt-4 md:w-64 md:mt-0 pl-10"
          type="search"
          placeholder="Pesquisar"
          onChange={(e) => onQueryChange?.(e.target.value)}
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="bg-gray-200 font-semibold">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  data-state={row.getIsSelected() && 'selected'}
                  className={cn('even:bg-gray-100', onRowClick && 'cursor-pointer hover:bg-gray-200')}
                  onClick={() => onRowClick?.(row.original)}
                  key={row.id}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex w-full justify-between mt-4">
        <p className="text-primary-600 font-semibold w-full">{count} Registros</p>
        <Pagination className="!mx-0 !justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}
