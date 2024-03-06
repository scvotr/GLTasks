import React, { useState, useEffect } from "react"
import { Box, FormControl, TextField, Select, MenuItem, Stack, Divider, Button } from "@mui/material"
import ThumbUpIcon from "@mui/icons-material/ThumbUp"
import ThumbDownIcon from "@mui/icons-material/ThumbDown"
import { useCallback } from "react"
import { useAuthContext } from "../../../../../context/AuthProvider"
import { getDataFromEndpoint } from "../../../../../utils/getDataFromEndpoint"
import { SelectDep } from "./SelectDataField/SelectDep"
import { SelectSubDep } from "./SelectDataField/SelectSubDep"

export const AddStuctForm = () => {
  const [formData, setFormData] = useState({
    department_id: "",
    subdepartment_id: "",
    position_id: "",
  })

  const handleSubmitAddNewDep = (isApprove, event) => {
    event.preventDefault();
    if (isApprove) {
      console.log(formData)
    }
  }

  const handleSubmitAddNewSubDep = (isApprove, event) => {
    event.preventDefault();
    if (isApprove) {
      console.log(formData)
    }
  }

  const handleSubmitAddNewPosition = (isApprove, event) => {
    event.preventDefault();
    if (isApprove) {
      console.log(formData)
    }
  }

  const getInputData = event => {
    const { name, value } = event.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <Box sx={{ width: "100%" }}>
      <FormControl sx={{ minWidth: 222 }}>
        <Box
          component="form"
          onSubmit={handleSubmitAddNewDep}
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
            name="dep_name"
            value={formData.dep_name}
            onChange={e => {
              getInputData(e)
            }}
          />
          <Divider />
          <Stack direction="row" spacing={3} justifyContent="center" alignItems="center">
            <Button variant="outlined" color="error" startIcon={<ThumbDownIcon />} onClick={e => handleSubmitAddNewDep(false, e)}>
              Отмена
            </Button>
            <Button variant="contained" color="success" endIcon={<ThumbUpIcon />} onClick={e => handleSubmitAddNewDep(true, e)}>
              Добавть департамент
            </Button>
          </Stack>
        </Box>
        {/* ----------------------------------------- */}
        <Box
          component="form"
          onSubmit={handleSubmitAddNewSubDep}
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
          <SelectDep getData={getInputData} value={formData}/>
          <TextField
            name="subdep_name"
            value={formData.subdep_name}
            onChange={e => {
              getInputData(e)
            }}
          />
          <Divider />
          <Stack direction="row" spacing={3} justifyContent="center" alignItems="center">
            <Button variant="outlined" color="error" startIcon={<ThumbDownIcon />} onClick={e => handleSubmitAddNewDep(false, e)}>
              Отмена
            </Button>
            <Button variant="contained" color="success" endIcon={<ThumbUpIcon />} onClick={e => handleSubmitAddNewDep(true, e)}>
              Добавть отдел
            </Button>
          </Stack>
        </Box>
        {/* ----------------------------------------- */}
        <Box
          component="form"
          onSubmit={handleSubmitAddNewSubDep}
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
          {/* <SelectSubDep getData={getInputData} value={formData}/> */}
          <TextField
            name="position_name"
            value={formData.position_name}
            onChange={e => {
              getInputData(e)
            }}
          />
          <Divider />
          <Stack direction="row" spacing={3} justifyContent="center" alignItems="center">
            <Button variant="outlined" color="error" startIcon={<ThumbDownIcon />} onClick={e => handleSubmitAddNewPosition(false, e)}>
              Отмена
            </Button>
            <Button variant="contained" color="success" endIcon={<ThumbUpIcon />} onClick={e => handleSubmitAddNewPosition(true, e)}>
              Добавть должность
            </Button>
          </Stack>
        </Box>
      </FormControl>
    </Box>
  )
}
