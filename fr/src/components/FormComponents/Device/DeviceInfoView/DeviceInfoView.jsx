import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import { useState } from "react"
import Tab from "@mui/material/Tab"
import TabContext from "@mui/lab/TabContext"
import TabList from "@mui/lab/TabList"
import TabPanel from "@mui/lab/TabPanel"
import { MotorInfoView } from "../MotorInfoView/MotorInfoView"
import { TypeInfoView } from "../TypeInfoView/TypeInfoView"
import { QRCodePrinter } from "../../../Navigation/Admin/Menu/Machines/QRCode/QRCodePrinter"

export const DeviceInfoView = ({ device }) => {
  const [value, setValue] = useState("1")

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <>
      <Box>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow></TableRow>
              <TableRow>
                <TableCell align="center">Департамент</TableCell>
                <TableCell align="center">Цех (п\м.)</TableCell>
                <TableCell align="center">Тип</TableCell>
                <TableCell align="center">Тех. номер</TableCell>
                <TableCell align="center">кВт</TableCell>
                <TableCell align="center">qr_code</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableCell align="center">{device.department_name || "---"}</TableCell>
              <TableCell align="center">{device.workshop_name || "---"}</TableCell>
              <TableCell align="center">{device.type_name || "---"}</TableCell>
              <TableCell align="center">{device.tech_num || "---"}</TableCell>
              <TableCell align="center">{device.power_value || "---"}</TableCell>
              <TableCell align="center">
                {device.qr_code && typeof device.qr_code === "string" && device.qr_code.startsWith("data:image/png;base64,") ? (
                  <>
                    <img src={device.qr_code} alt="QR Code" style={{ maxWidth: "100%", height: "auto" }} />
                    {/* <QRCodePrinter qrCodeData={device.qr_code} /> */}
                  </>
                ) : (
                  <p>QR Code not available</p>
                )}
              </TableCell>
            </TableBody>
          </Table>
        </TableContainer>
        {/* ------------------------------ */}
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider", width: "100%", mt: 2 }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="Механизм" value="1" />
              <Tab label="Двигатель" value="2" />
              <Tab label="Информация" value="3" />
            </TabList>
          </Box>
          <TabPanel value="1">
            <TypeInfoView device={{ id: device.device_id, type_id: device.type_id }} />
          </TabPanel>
          <TabPanel value="2">
            <MotorInfoView device={device.device_id} />
          </TabPanel>
          <TabPanel value="3">Item Three</TabPanel>
        </TabContext>
        {/* ------------------------------ */}
      </Box>
    </>
  )
}
