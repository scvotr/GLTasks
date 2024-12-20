import { useDeviceData } from "../../../Navigation/Admin/Menu/Devices/useDeviceData"
import { useState } from "react"
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material"

export const DepartmentSelectOnce = ({ selectedDepartment, setSelectedDepartment }) => {
  const { useGroupedWorkflowsByDep } = useDeviceData()

  const handleDepartmentChange = e => {
    const selected = useGroupedWorkflowsByDep[e.target.value]
    setSelectedDepartment({
      name: e.target.value,
      id: selected ? selected[0].department_id : "",
    })
  }

  return (
    <FormControl fullWidth sx={{ mt: 2 }}>
      <InputLabel htmlFor="department-select" sx={{ pl: 1 }}>
        Департамент
      </InputLabel>
      <Select value={selectedDepartment?.name || ""} onChange={handleDepartmentChange} label="Департамент" required>
        <MenuItem value="" disabled>
          Выберите департамент
        </MenuItem>
        {Object.keys(useGroupedWorkflowsByDep).map(department => (
          <MenuItem key={department} value={department}>
            {department}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
