import TabContext from "@mui/lab/TabContext"
import TabList from "@mui/lab/TabList"
import { Box, Tab } from "@mui/material"
import { useState } from "react"

export const MotorInfoViewV2 = ({ motor }) => {
  console.log(motor)
  const [value, setValue] = useState("1")

  const handleChange = (event, newValue) => {
    setValue(newValue)
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
        </TabContext>
      </Box>
    </>
  )
}
