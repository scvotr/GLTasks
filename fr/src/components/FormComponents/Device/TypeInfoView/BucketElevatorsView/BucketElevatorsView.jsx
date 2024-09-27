import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Divider } from "@mui/material"
import { useState } from "react"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"

export const BucketElevatorsView = ({ data }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleClick = event => {
    // Получаем координаты курсора
    const { clientX, clientY } = event
    // Устанавливаем anchorEl как объект с координатами
    setAnchorEl({ top: clientY, left: clientX })
  }

  return (
    <>
      <Menu
        id="basic-menu"
        anchorReference="anchorPosition"
        anchorPosition={anchorEl ? { top: anchorEl.top, left: anchorEl.left } : undefined}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        >
        <MenuItem onClick={handleClose}>Забрать на ремонт</MenuItem>
        <MenuItem onClick={handleClose}>Запланировать ТО</MenuItem>
        <Divider/>
        <MenuItem onClick={handleClose}>Редактировать</MenuItem>
      </Menu>
      <Box>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell align="center" colSpan={1}></TableCell>
                <TableCell align="center" colSpan={4}>
                  Цех и Департамент
                </TableCell>
                <TableCell align="center" colSpan={6}>
                  Лента Ковш и Редуктор
                </TableCell>
                <TableCell align="center" colSpan={2}></TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="center">ID</TableCell>
                <TableCell align="center">Департамент</TableCell>
                <TableCell align="center">Цех (п\м.)</TableCell>
                <TableCell align="center">Тип</TableCell>
                <TableCell align="center">Тех. номер</TableCell>
                <TableCell align="center">Высота (п\м.)</TableCell>
                <TableCell align="center">Лента</TableCell>
                <TableCell align="center">Длина (м.)</TableCell>
                <TableCell align="center">Ковш</TableCell>
                <TableCell align="center">кол-во. (шт.)</TableCell>
                <TableCell align="center">кол-во. ковшей на 1 м ленты (шт.)</TableCell>
                <TableCell align="center">Редуктор</TableCell>
                <TableCell align="center">Приводной ремень</TableCell>
                <TableCell align="center">кол-во. (шт.)</TableCell>
                {/* <TableCell align="center">qr_code</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow key={data.name} sx={{ "&:last-child td, &:last-child th": { border: 0 } }} hover onClick={handleClick}>
                <TableCell align="center">{data.device_id || "---"}</TableCell>
                <TableCell align="center">{data.department_name || "---"}</TableCell>
                <TableCell align="center">{data.workshop_name || "---"}</TableCell>
                <TableCell align="center">{data.type_name || "---"}</TableCell>
                <TableCell align="center">{data.tech_num || "---"}</TableCell>
                <TableCell align="center">{data.height || "---"}</TableCell>
                <TableCell align="center">{data.beltBrands_name || "---"}</TableCell>
                <TableCell align="center">{data.belt_length || "---"}</TableCell>
                <TableCell align="center">{data.bucketBrand_name || "---"}</TableCell>
                <TableCell align="center">{data.bucket_quantity || "---"}</TableCell>
                <TableCell align="center">{data.belt_length ? (data.bucket_quantity / data.belt_length).toFixed(2) : "---"}</TableCell>
                <TableCell align="center">{data.gearboxBrand_name || "---"}</TableCell>
                <TableCell align="center">{data.driveBeltsBrand_name || "---"}</TableCell>
                <TableCell align="center">{data.driveBelt_quantity || "---"}</TableCell>
                <TableCell align="center">
                  <Button
                    id="basic-button"
                    aria-controls={open ? "basic-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                    onClick={handleClick}>
                    Действия
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  )
}
