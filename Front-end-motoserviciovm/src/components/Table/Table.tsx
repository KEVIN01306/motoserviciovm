import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Paper,
} from "@mui/material";
import { ActionsMenu } from "./components/ActionsMenu"; 

export interface Column<T> {
  id: keyof T | "actions";
  label: string;
  minWidth?: number;
  type?: string;
  align?: "left" | "right" | "center";
  // actions can be a static array or a function that receives the row and returns the array
  actions?:
    | { label: string | React.ReactNode; onClick: (row: T) => void }[]
    | ((row: T) => { label: string | React.ReactNode; onClick: (row: T) => void }[]);
  format?: (value: any, row?: T) => string | number | React.ReactNode;
}

interface TableCustomProps<T> {
  columns: Column<T>[];
  rows: T[];
  actionsPosition?: "start" | "end";
}

export default function TableCustom<T>({
  columns,
  rows,
  actionsPosition = "start",
}: TableCustomProps<T>) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // ensure actions column is placed according to prop (default: end)
  const actionsIndex = columns.findIndex((c) => c.id === "actions");
  const orderedColumns =
    actionsIndex === -1
      ? columns
      : actionsPosition === "start"
      ? [columns[actionsIndex], ...columns.filter((_, i) => i !== actionsIndex)]
      : [...columns.filter((_, i) => i !== actionsIndex), columns[actionsIndex]];

  return (
    <Paper sx={{ width: "100%", overflow: "auto",boxShadow:'0px 0px 3px rgb(0,0,0,0.1)' }} >
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {orderedColumns.map((column) => (
                <TableCell
                  key={String(column.id)}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, rowIndex) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={rowIndex}>
                  {orderedColumns.map((column) => {
                    if (column.id === "actions") {
                      const actionsForRow = typeof column.actions === "function" ? column.actions(row) : column.actions;
                      return (
                        <TableCell key={`actions-${rowIndex}`} align="center" sx={{ width: 80 }}>
                          <ActionsMenu actions={actionsForRow!} row={row} />
                        </TableCell>
                      );
                    }
                    const value = row[column.id as keyof typeof row];
                    return (
                      <TableCell key={String(column.id)} align={column.align}>
                        {column.format ? column.format(value, row) : String(value)}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
