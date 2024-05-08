import React, { useState, useEffect } from "react"
import { Box, FormControl, TextField, Select, MenuItem, Stack, Divider, Button } from "@mui/material"
import ThumbUpIcon from "@mui/icons-material/ThumbUp"
import ThumbDownIcon from "@mui/icons-material/ThumbDown"
import { useAuthContext } from "../../../../../context/AuthProvider"
import { getDataFromEndpoint } from "../../../../../utils/getDataFromEndpoint"
import { SelectDep } from "./SelectDataField/SelectDep"
import { SelectSubDep } from "./SelectDataField/SelectSubDep"
import { PositionSelect } from "../../../../FormComponents/Select/PositionSelect/PositionSelect"

export const AddStuctForm = ({reRender}) => {
  const currentUser = useAuthContext()
  const [updatedForm, setUpdatedForm] = useState(0)

  const [reqStatus, setReqStatus] = useState({
    loading: false,
    error: null,
  })

  const [formData, setFormData] = useState({
    department_id: "",
    subdepartment_id: "",
    position_id: "",
  })

  useEffect(()=> {
    reRender(prevKey => prevKey + 1)
  }, [updatedForm])

  const handleSubmitAddNewDep = (isApprove, event) => {
    event.preventDefault()
    if (isApprove) {
      try {
        setReqStatus({ loading: true, error: null })
        getDataFromEndpoint(currentUser.token, "/admin/createNewDep", "POST", formData, setReqStatus)
        setUpdatedForm(prevKey => prevKey + 1)
        setReqStatus({ loading: false, error: null })
      } catch (error) {
        setReqStatus({ loading: false, error: error })
      }
    } else {
      try {
        setReqStatus({ loading: true, error: null })
        getDataFromEndpoint(currentUser.token, "/admin/deleteDep", "POST", formData.department_id, setReqStatus)
        setUpdatedForm(prevKey => prevKey + 1)
        setReqStatus({ loading: false, error: null })
      } catch (error) {
        setReqStatus({ loading: false, error: error })
      }
    }
  }

  const handleSubmitAddNewSubDep = (isApprove, event) => {
    event.preventDefault()
    if (isApprove) {
      try {
        setReqStatus({ loading: true, error: null })
        getDataFromEndpoint(currentUser.token, "/admin/createNewSubDep", "POST", formData, setReqStatus)
        setUpdatedForm(prevKey => prevKey + 1)
        setReqStatus({ loading: false, error: null })
      } catch (error) {
        setReqStatus({ loading: false, error: error })
      }
    } else {
      try {
        setReqStatus({ loading: true, error: null })
        getDataFromEndpoint(currentUser.token, "/admin/deleteSubDep", "POST", formData.subdepartment_id, setReqStatus)
        setUpdatedForm(prevKey => prevKey + 1)
        setReqStatus({ loading: false, error: null })
      } catch (error) {
        setReqStatus({ loading: false, error: error })
      }
    }
  }

  const handleSubmitAddNewPosition = (isApprove, event) => {
    event.preventDefault()
    if (isApprove) {
      try {
        setReqStatus({ loading: true, error: null })
        getDataFromEndpoint(currentUser.token, "/admin/createNewPosition", "POST", formData, setReqStatus)
        setUpdatedForm(prevKey => prevKey + 1)
        setReqStatus({ loading: false, error: null })
      } catch (error) {
        setReqStatus({ loading: false, error: error })
      }
    } else {
      try {
        setReqStatus({ loading: true, error: null })
        getDataFromEndpoint(currentUser.token, "/admin/deletePosition", "POST", formData.position_id, setReqStatus)
        setUpdatedForm(prevKey => prevKey + 1)
        setReqStatus({ loading: false, error: null })
      } catch (error) {
        setReqStatus({ loading: false, error: error })
      }
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
              Удалить департамент
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
          <SelectDep getData={getInputData} value={formData} reRender={updatedForm}/>
          <TextField
            name="subdep_name"
            value={formData.subdep_name}
            onChange={e => {
              getInputData(e)
            }}
          />
          <Divider />
          <Stack direction="row" spacing={3} justifyContent="center" alignItems="center">
            <Button variant="outlined" color="error" startIcon={<ThumbDownIcon />} onClick={e => handleSubmitAddNewSubDep(false, e)}>
              Удалить отдел
            </Button>
            <Button variant="contained" color="success" endIcon={<ThumbUpIcon />} onClick={e => handleSubmitAddNewSubDep(true, e)}>
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
          <SelectSubDep getData={getInputData} selectedDep={formData.department_id} reRender={updatedForm}/>
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
              Удалить должность
            </Button>
            <Button variant="contained" color="success" endIcon={<ThumbUpIcon />} onClick={e => handleSubmitAddNewPosition(true, e)}>
              Добавть должность
            </Button>
          </Stack>
          <Divider />
          <Stack sx={{mt:2}}>
            <PositionSelect getData={getInputData} selectedSubDep={formData.subdepartment_id} reRender={updatedForm}/>
          </Stack>
        </Box>
      </FormControl>
    </Box>
  )
}
