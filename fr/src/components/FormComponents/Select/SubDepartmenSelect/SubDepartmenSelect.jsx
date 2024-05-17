import React, { useState, useEffect, useCallback } from "react"
import { Box } from "@mui/material"
import Select from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import InputLabel from "@mui/material/InputLabel"
import FormControl from "@mui/material/FormControl"
import FormHelperText from "@mui/material/FormHelperText"
import { useAuthContext } from "../../../../context/AuthProvider"
import { getDataFromEndpoint } from "../../../../utils/getDataFromEndpoint"

export const SubDepartmenSelect = props => {
  const currentUser = useAuthContext()
  const [reqStatus, setReqStatus] = useState({ loading: true, error: null })
  const [allSubDeps, setAllSubDeps] = useState([])
  const [selectedSubDep, setSelectedSubDep] = useState("")
  const hasSubDep = allSubDeps && allSubDeps.lenght !== 0

  const fetchData = useCallback(async () => {
    if (currentUser.login) {
      try {
        setReqStatus({ loading: true, error: null })
        const data = await getDataFromEndpoint(
          currentUser.token,
          "/orgStruct/getSubDepartmentsByID",
          "POST",
          props.selectedDep,
          setReqStatus
        )
        setAllSubDeps(data)
        setReqStatus({ loading: false, error: null })
      } catch (error) {
        setReqStatus({ loading: false, error: error.message })
      }
    }
  }, [currentUser, props.selectedDep, props.reRender])

  useEffect(() => {
    setSelectedSubDep(props.value ? props.value.responsible_subdepartment_id : '')
  }, [props.selectedDep])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleChange = e => {
    setSelectedSubDep(e.target.value)
    props.getData(e)
  }

  const childrenWithProps = props.children
    ? React.Children.map(props.children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { selectedSubDep })
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
          <FormControl sx={{ minWidth: 222 }} disabled={!hasSubDep}>
            <InputLabel id="subDepart-simple-select-label">
              {selectedSubDep ? "Отдел" : "Выберите отдел"}
            </InputLabel>
            <Select
              required
              value={selectedSubDep}
              name={currentUser.role === "admin" ? "subdepartment_id" : "responsible_subdepartment_id"}
              labelId="subDepart-select-label"
              label={selectedSubDep ? "Отдел" : "Выберите отдел"}
              onChange={handleChange}>
              {allSubDeps &&
                allSubDeps.map(subDep => (
                  <MenuItem key={subDep.id} value={subDep.id}>
                    {subDep.name}
                  </MenuItem>
                ))}
            </Select>
            <FormHelperText>
              {hasSubDep ? "" : "Выберите Департамент"}
            </FormHelperText>
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
//           "/orgStruct/getSubDepartments",
//           "POST",
//           null,
//           setReqStatus
//         )
//         setAllSubDeps(data)
//         setReqStatus({ loading: false, error: null })
//       } catch (error) {
//         setReqStatus({ loading: false, error: error.message })
//       }
//     }
//   }
//   fetchData()
// }, [currentUser])
