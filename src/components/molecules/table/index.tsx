import React, { ReactNode } from "react"
import { navigate } from "gatsby"
import ArrowLeftIcon from "../../fundamentals/icons/arrow-left-icon"
import ArrowRightIcon from "../../fundamentals/icons/arrow-right-icon"
import clsx from "clsx"
import Actionables, { ActionType } from "../../molecules/actionables"
import FilteringOptions, { FilteringOptionProps } from "./filtering-option"
import TableSearch from "./table-search"

type TableRowProps = React.HTMLAttributes<HTMLTableRowElement> & {
  actions?: ActionType[]
  linkTo?: string
}

type TablePaginationProps = React.HTMLAttributes<HTMLDivElement> & {
  title: string
  currentPage: number
  pageSize: number
  count: number
  offset: number
  limit: number
  pageCount: number
  nextPage: () => void
  prevPage: () => void
  hasNext: boolean
  hasPrev: boolean
}

type TableProps = {
  filteringOptions?: FilteringOptionProps[] | ReactNode
  enableSearch?: boolean
  handleSearch?: (searchTerm: string) => void
} & React.HTMLAttributes<HTMLTableElement>

type TableElement<T> = React.ForwardRefExoticComponent<T> &
  React.RefAttributes<unknown>

type TableType = {
  Head: TableElement<React.HTMLAttributes<HTMLTableElement>>
  HeadRow: TableElement<React.HTMLAttributes<HTMLTableRowElement>>
  HeadCell: TableElement<React.HTMLAttributes<HTMLTableCellElement>>
  Body: TableElement<React.HTMLAttributes<HTMLTableSectionElement>>
  Row: TableElement<TableRowProps>
  Cell: TableElement<React.HTMLAttributes<HTMLTableCellElement>>
} & TableElement<TableProps>

const Table: TableType = React.forwardRef(
  (
    {
      className,
      children,
      enableSearch,
      handleSearch,
      filteringOptions,
      ...props
    }: TableProps,
    ref
  ) => {
    if (enableSearch && !handleSearch) {
      throw new Error("Table cannot enable search without a search handler")
    }

    return (
      <div className="flex flex-col">
        <div className="w-full flex justify-between">
          {filteringOptions && (
            <div className="flex mb-2 self-end">
              {Array.isArray(filteringOptions)
                ? filteringOptions.map((fo) => <FilteringOptions {...fo} />)
                : filteringOptions}
            </div>
          )}
          <div className="flex">
            {enableSearch && <TableSearch onSearch={handleSearch} />}
          </div>
        </div>
        <table
          ref={ref}
          className={clsx("w-full table-auto", className)}
          {...props}
        >
          {children}
        </table>
      </div>
    )
  }
)

Table.Head = React.forwardRef(
  (
    { className, children, ...props }: React.HTMLAttributes<HTMLTableElement>,
    ref
  ) => (
    <thead
      ref={ref}
      className={clsx(
        "whitespace-nowrap inter-small-semibold text-grey-50 border-t border-b border-grey-20",
        className
      )}
      {...props}
    >
      {children}
    </thead>
  )
)

Table.HeadRow = React.forwardRef(
  (
    {
      className,
      children,
      ...props
    }: React.HTMLAttributes<HTMLTableRowElement>,
    ref
  ) => (
    <tr ref={ref} className={clsx(className)} {...props}>
      {children}
    </tr>
  )
)

Table.HeadCell = React.forwardRef(
  (
    {
      className,
      children,
      ...props
    }: React.HTMLAttributes<HTMLTableCellElement>,
    ref
  ) => (
    <th ref={ref} className={clsx("text-left py-2.5", className)} {...props}>
      {children}
    </th>
  )
)

Table.Body = React.forwardRef(
  (
    {
      className,
      children,
      ...props
    }: React.HTMLAttributes<HTMLTableSectionElement>,
    ref
  ) => (
    <tbody ref={ref} className={clsx(className)} {...props}>
      {children}
    </tbody>
  )
)

Table.Cell = React.forwardRef(
  (
    {
      className,
      children,
      ...props
    }: React.HTMLAttributes<HTMLTableCellElement>,
    ref
  ) => (
    <td ref={ref} className={clsx(" py-1.5", className)} {...props}>
      <div className="w-inherit truncate">{children}</div>
    </td>
  )
)

Table.Row = React.forwardRef(
  ({ className, actions, children, linkTo, ...props }: TableRowProps, ref) => (
    <tr
      ref={ref}
      className={clsx(
        "inter-small-regular border-t border-b border-grey-20 text-grey-90",
        className,
        { "cursor-pointer": linkTo !== undefined }
      )}
      {...props}
      {...(linkTo && { onClick: () => navigate(linkTo) })}
    >
      {children}
      {actions && (
        <Table.Cell onClick={(e) => e.stopPropagation()} className="w-[32px]">
          <Actionables actions={actions} />
        </Table.Cell>
      )}
    </tr>
  )
)

export const TablePagination = ({
  className,
  title = "Elements",
  currentPage,
  pageCount,
  pageSize,
  count,
  offset,
  nextPage,
  prevPage,
  hasNext,
  hasPrev,
}: TablePaginationProps) => {
  return (
    <div
      className={clsx(
        "flex w-full justify-between inter-small-regular text-grey-50 mt-14",
        className
      )}
    >
      <div>{`${offset + 1} - ${pageSize} of ${count} ${title}`}</div>
      <div className="flex space-x-4">
        <div>{`${currentPage + 1} of ${pageCount}`}</div>
        <div className="flex space-x-4 items-center">
          <div
            className={clsx(
              { ["text-grey-30"]: !hasPrev },
              { ["cursor-pointer"]: hasPrev }
            )}
            onClick={() => prevPage()}
          >
            <ArrowLeftIcon />
          </div>
          <div
            className={clsx(
              { ["text-grey-30"]: !hasNext },
              { ["cursor-pointer"]: hasNext }
            )}
            onClick={() => nextPage()}
          >
            <ArrowRightIcon />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Table
