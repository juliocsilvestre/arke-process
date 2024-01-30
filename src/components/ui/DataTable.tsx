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
import { checkIfStatusKeyword } from '@/utils/constants'
import { cn } from '@/utils/styles'
import type { Pagination as PaginationProps } from '@/utils/types'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table'
import { ReactNode, useState } from 'react'
import { Badge } from './Badge'
import { Input } from './Input'
import { Label } from './Label'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  actions?: (row: TData) => ReactNode
  data: TData[]
  count: number
  pages: number
  currentPage: number
  onRowClick?: (row: TData) => void
  onQueryChange?: (query: string) => void
}
interface PaginationLinksProps {
  currentPage: number
  pages: number
  visiblePages?: number
}

const PaginationLinks: React.FC<PaginationLinksProps> = ({ currentPage, pages, visiblePages = 4 }) => {
  const pageGroupStart = Math.max(1, Math.floor((currentPage - 1) / visiblePages) * visiblePages + 1)
  const pageGroupEnd = Math.min(pages, pageGroupStart + visiblePages - 1)
  const limitedPages =
    pageGroupEnd >= pageGroupStart
      ? Array(pageGroupEnd - pageGroupStart + 1)
          .fill(0)
          .map((_, index) => index + pageGroupStart)
      : []
  const isPreviousGroupNeeded = pageGroupStart > 1
  const isNextGroupNeeded = pageGroupEnd < pages

  return (
    <>
      {isPreviousGroupNeeded && (
        <>
          <PaginationItem>
            <PaginationLink
              params=""
              search={(prev: PaginationProps) => ({
                ...prev,
                page: 1,
              })}
              isActive={false}
              className="mx-1"
            >
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink
              params=""
              search={(prev: PaginationProps) => ({
                ...prev,
                page: Math.max(1, pageGroupStart - visiblePages),
              })}
              isActive={false}
              className="mx-1"
            >
              ...
            </PaginationLink>
          </PaginationItem>
        </>
      )}
      {limitedPages.map((page) => (
        <PaginationItem key={`page-${page}`}>
          <PaginationLink
            params=""
            search={(prev: PaginationProps) => ({ ...prev, page })}
            isActive={currentPage === page}
            className="mx-1"
          >
            {page}
          </PaginationLink>
        </PaginationItem>
      ))}
      {isNextGroupNeeded && (
        <>
          <PaginationItem>
            <PaginationLink
              params=""
              search={(prev: PaginationProps) => ({
                ...prev,
                page: Math.min(pages, pageGroupEnd + 1),
              })}
              isActive={false}
              className="mx-1"
            >
              ...
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink
              params=""
              search={(prev: PaginationProps) => ({
                ...prev,
                page: pages,
              })}
              isActive={false}
              className="mx-1"
            >
              {pages}
            </PaginationLink>
          </PaginationItem>
        </>
      )}
    </>
  )
}

export const DataTable = <TData, TValue>({
  columns,
  actions,
  data,
  count,
  pages,
  currentPage,
  onRowClick,
  onQueryChange,
}: DataTableProps<TData, TValue>) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })
  const hasColumnStatus = columns.some((column) => column.header === 'Status')

  const [query, setQuery] = useState('')

  const showSearchFeedback = query !== ''

  return (
    <div className="flex flex-col justify-end	gap-4">
      <div className="relative ml-auto">
        <MagnifyingGlassIcon className="h-6 w-6 text-gray-400 absolute left-3 top-[50%] translate-y-[-50%]" />
        <Input
          className="w-full mt-4 md:w-64 md:mt-0 pl-10"
          type="search"
          placeholder="Pesquisar"
          onChange={(e) => {
            const filteredValue = checkIfStatusKeyword({ value: e.target.value.toLowerCase(), hasColumnStatus })
            onQueryChange?.(filteredValue)
            setQuery(e.target.value)
          }}
        />
      </div>
      <div className={`${showSearchFeedback ? 'opacity-1' : 'opacity-0'}`}>
        <Label label="Resultados da busca por: " />
        <span className="ml-[4px] font-thin italic text-sm p-2">
          <Badge variant="search" size="md">
            {query}
          </Badge>
        </span>
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
                {actions && <TableHead className="bg-gray-200 font-semibold">Ações</TableHead>}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className={cn('even:bg-gray-100', onRowClick && 'cursor-pointer hover:bg-gray-200')}
                  onClick={() => onRowClick?.(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                  {actions && <TableCell>{actions(row.original)}</TableCell>}
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
        <Pagination className="!mx-0 !justify-end select-none">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                disabled={currentPage === 1}
                params=""
                search={(prev: PaginationProps) => ({
                  ...prev,
                  page: Number(prev.page) > 1 ? Number(prev.page) - 1 : 1,
                })}
              />
            </PaginationItem>
            <PaginationLinks currentPage={currentPage} pages={pages} />
            <PaginationItem>
              <PaginationNext
                disabled={currentPage === pages}
                params=""
                search={(prev: PaginationProps) => {
                  return {
                    ...prev,
                    page: Number(prev.page) + 1 > (pages ?? 0) ? pages : Number(prev.page) + 1,
                  }
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}
