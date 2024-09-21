import React from "react"
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Stack } from "@mui/material"

const CustomTableView = ({ items, onEdit, onDelete, onRowClick, headers, units }) => {
  return (
    <TableContainer>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow></TableRow>
          <TableRow>
            {headers.map((header, index) => (
              <TableCell key={index} align="left">
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {items &&
            items.map(data => (
              <TableRow key={data.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }} hover onClick={() => onRowClick(data)}>
                <TableCell align="left">{data.id}</TableCell>
                <TableCell align="left">{data.name} {units}</TableCell>
                <TableCell align="left">
                  <Stack direction="row">
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ mr: 1 }}
                      onClick={e => {
                        e.stopPropagation() // предотвращаем всплытие события
                        onEdit(data)
                      }}>
                      Изменить
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={e => {
                        e.stopPropagation() // предотвращаем всплытие события
                        onDelete(data.id)
                      }}>
                      Удалить
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default CustomTableView
