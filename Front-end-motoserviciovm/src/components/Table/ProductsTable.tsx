import * as React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import type { Column } from './Table';

type Props<T> = {
  columns: Column<T>[];
  rows: T[];
  headerColor?: string;
  /** optional maximum height for scroll */
  maxHeight?: number;
  colorHeader?: string;
};

export default function ProductsTable<T>({ columns, rows, headerColor = '#1976d2', maxHeight = 400, colorHeader = '#ffffff' }: Props<T>) {
  return (
    <Paper sx={{ width: '100%', overflow: 'auto', backgroundColor: '#ffffff' }} elevation={1}>
      <TableContainer sx={{ maxHeight }}>{/* white background is on Paper */}
        <Table stickyHeader aria-label="products-table">
          <TableHead>
            <TableRow sx={{ backgroundColor: headerColor }}>
              {columns.map((col) => (
                <TableCell
                  key={String(col.id)}
                  align={col.align}
                  sx={{
                    backgroundColor: headerColor,
                    color: colorHeader,
                    fontWeight: '600',
                    border: '1px solid rgba(0,0,0,0.2)',
                    minWidth: col.minWidth,
                    padding: '8px 16px',
                  }}
                >
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((row, rowIndex) => (
              <TableRow hover role="checkbox" tabIndex={-1} key={rowIndex} sx={{ backgroundColor: '#ffffff' }}>
                {columns.map((column) => {
                  if (column.id === 'actions') {
                    const actionsForRow = typeof column.actions === 'function' ? column.actions(row) : column.actions;
                    return (
                      <TableCell key={`actions-${rowIndex}`} align="center" sx={{ border: '1px solid rgba(0,0,0,0.12)' }}>
                        {/* reuse any passed ActionsMenu by rendering nodes or simple buttons */}
                        {Array.isArray(actionsForRow) ? (
                          actionsForRow.map((a, i) => (
                            <span key={i} style={{ marginRight: 8 }}>{typeof a.label === 'string' ? a.label : a.label}</span>
                          ))
                        ) : null}
                      </TableCell>
                    );
                  }

                  const value = (row as any)[column.id as keyof typeof row];
                  return (
                    <TableCell key={String(column.id)} align={column.align} sx={{ color: '#000000', border: '1px solid rgba(0,0,0,0.12)', padding: '8px 16px' }}>
                      {column.format ? column.format(value, row) : String(value ?? '')}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
