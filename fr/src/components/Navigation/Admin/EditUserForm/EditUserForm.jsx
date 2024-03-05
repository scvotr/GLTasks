import { Box, TextField } from "@mui/material"
import { useState } from "react"
import { SelectDataField } from "./SelectDataField/SelectDataField"

export const EditUserForm = ({ user }) => {
  console.log("EditUserForm", user)
  const [formData, setFormData] = useState({
    name: user.name,
    role: user.role,
    first_name: user.first_name,
    middle_name: user.middle_name,
    last_name: user.last_name,
    department_id: user.department_id,
    office_number: user.office_number,
    subdepartment_id: user.subdepartment_id,
    position_id: user.position_id,
  })
  console.log("formData", formData)
  

  const handleSubmit = event => {
    event.preventDefault()

  }

  const getInputData = event => {
    const { name, value, files, checked } = event.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      autoComplete="off"
      sx={{
        p: 1,
        boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
        border: "1px solid #e0e0e0",
        borderRadius: "5px",
        "& .MuiTextField-root": { m: 1, width: "55ch" },
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}>
        <TextField 
          name="name"
          value={formData.name}
          onChange={e => {
            getInputData(e)
          }}
        />
        <TextField 
          name="role"
          value={formData.role}
          onChange={e => {
            getInputData(e)
          }}
        />
        <SelectDataField getData={getInputData} value={formData}/>
      </Box>
  )
}
