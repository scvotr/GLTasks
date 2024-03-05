import React, { useState, useEffect, useCallback } from "react"
import { Box } from "@mui/material"
import Select from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import InputLabel from "@mui/material/InputLabel"
import FormControl from "@mui/material/FormControl"
import { useAuthContext } from "../../../../context/AuthProvider"
import { getDataFromEndpoint } from "../../../../utils/getDataFromEndpoint"

export const DepartmentSelect = props => {
  const currentUser = useAuthContext()

  const [reqStatus, setReqStatus] = useState({ loading: true, error: null })
  const [allDeps, setAllDeps] = useState([])

  const [selectedDep, setSelectedDep] = useState("")
  // сброс значений полей ввода
  useEffect(() => {
    setSelectedDep(props.value.responsible_department_id)
  }, [props.value.responsible_department_id])

  const fetchData = useCallback(async () => {
    if (currentUser.login) {
      try {
        setReqStatus({ loading: true, error: null })
        const data = await getDataFromEndpoint(currentUser.token, "/orgStruct/getDepartments", "POST", null, setReqStatus)
        setAllDeps(data)
        setReqStatus({ loading: false, error: null })
      } catch (error) {
        setReqStatus({ loading: false, error: error.message })
      }
    }
  }, [currentUser])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleChange = e => {
    setSelectedDep(e.target.value)
    props.getData(e)
  }

  const childrenWithProps = props.children
    ? React.Children.map(props.children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { selectedDep })
        }
        return child
      })
    : null

  return (
    <>
      {reqStatus.loading ? (
        <div>Идет загрузка...</div>
      ) : (
        <Box>
          <FormControl sx={{ minWidth: 222 }}>
            <InputLabel id="depart-simple-select-label">{selectedDep ? "Департамент" : "Выберите департамент"}</InputLabel>
            <Select
              required
              value={selectedDep}
              // value={currentUser.role === "admin" ? props.value.department_id : {selectedDep}}
              name={currentUser.role === "admin" ? "department_id" : "responsible_department_id"}
              labelId="depart-select-label"
              label={selectedDep ? "Департамент" : "Выберите департамент"}
              onChange={handleChange}>
              {allDeps &&
                allDeps.map(dep => (
                  <MenuItem key={dep.id} value={dep.id}>
                    {dep.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Box>
      )}
      {childrenWithProps}
    </>
  )
}

// useEffect(() => {
//   const fetchData = async () => {
//     if (currentUser.login) {
//       try {
//         setReqStatus({ loading: true, error: null })
//         const data = await getDataFromEndpoint(
//           currentUser.token,
//           "/orgStruct/getDepartments",
//           "POST",
//           null,
//           setReqStatus
//         )
//         setAllDeps(data)
//         setReqStatus({ loading: false, error: null })
//       } catch (error) {
//         setReqStatus({ loading: false, error: error.message })
//       }
//     }
//   }
//   fetchData()
// }, [currentUser])
