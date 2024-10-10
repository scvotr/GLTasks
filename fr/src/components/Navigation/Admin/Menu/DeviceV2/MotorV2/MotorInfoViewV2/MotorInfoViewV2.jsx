import TabContext from "@mui/lab/TabContext"
import TabList from "@mui/lab/TabList"
import TabPanel from "@mui/lab/TabPanel"
import { Box, Tab } from "@mui/material"
import { useState } from "react"

export const MotorInfoViewV2 = ({ motor }) => {
  console.log(motor)
  const [value, setValue] = useState("1")
  const [logTabValue, setLogTabValue] = useState("1")

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const handleLogTabChange = (event, newValue) => {
    setLogTabValue(newValue)
  }

  return (
    <>
      <Box>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider", width: "100%", mt: 2 }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="Журналы" value="1" />
              <Tab label="Конфигурация" value="2" />
              <Tab label="Информация" value="3" />
            </TabList>
          </Box>
          <TabPanel value="1">
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="Аварии" logTabValue="1" />
              <Tab label="Обслуживание" logTabValue="2" />
              <Tab label="Сводная" logTabValue="3" />
            </TabList>
          </TabPanel>
        </TabContext>
      </Box>
    </>
  )
}
