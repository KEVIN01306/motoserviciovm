import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import * as XLSX from 'xlsx';
import type { Column } from './Table';
import type { ReactNode } from 'react';

type Props<T> = {
  columns: Column<T>[];
  rows: T[];
  footerRow?: Partial<T>; // Optional footer row
  headerColor?: string;
  /** optional maximum height for scroll */
  maxHeight?: number | string;
  colorHeader?: string;
  showExportButton?: boolean;
  exportFileName?: string;
};

export default function ProductsTable<T>({ columns, rows, footerRow, headerColor = '#1976d2', maxHeight = 400, colorHeader = '#ffffff', showExportButton = false, exportFileName = 'export.xlsx' }: Props<T>) {
  // Helper to convert formatted cell values to plain text
  const cellToText = (val: any) => {
    if (val === null || val === undefined) return '';
    if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') return String(val);
    try {
      return String(val);
    } catch (e) {
      return '';
    }
  };

  const exportXlsx = (fileName = 'export.xlsx') => {
    let name = fileName || 'export.xlsx';
    if (!name.toLowerCase().endsWith('.xlsx')) name = `${name}.xlsx`;
    const headers = columns.map(c => String(c.label ?? ''));
    const data: any[][] = [];
    data.push(headers);

    for (const row of rows) {
      const rowData = columns.map(col => {
        if (col.id === 'actions') return '';
        const value = (row as any)[col.id as keyof typeof row];
        const formatted = col.format ? col.format(value, row) : value;
        return cellToText(formatted);
      });
      data.push(rowData);
    }

    if (footerRow) {
      const footerData = columns.map(col => {
        const v = (footerRow as any)[col.id as keyof typeof footerRow];
        return cellToText(v);
      });
      data.push(footerData);
    }

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, name);
  };

  return (
    <>
    {showExportButton && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
          <Button startIcon={<DownloadIcon />} variant="outlined" size="small" onClick={() => exportXlsx(exportFileName)}>Exportar</Button>
        </Box>
      )}
    <Paper sx={{ width: '100%', overflow: 'auto', backgroundColor: '#ffffff' }} elevation={1}>
      {/* Export button area (right) */}
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
                      <TableCell  key={`actions-${rowIndex}`} align="center" sx={{ border: '1px solid rgba(0,0,0,0.12)', padding: '8px 16px'  }}>
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
                    <TableCell key={String(column.id)} /*align={column.align}*/ sx={{ color: '#000000', border: '1px solid rgba(0,0,0,0.12)', padding: '8px 16px' }}>
                      {column.format ? column.format(value, row) : String(value ?? '')}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
            {footerRow && (
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.id as string}>
                    {footerRow ? (footerRow[column.id as keyof T] as ReactNode) || '' : ''}                  </TableCell>
                ))}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
    </>
  );
}
