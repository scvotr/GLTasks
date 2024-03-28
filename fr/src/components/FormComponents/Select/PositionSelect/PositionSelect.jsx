import React, { useState, useEffect, useCallback } from "react"
import { Box } from "@mui/material"
import Select from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import InputLabel from "@mui/material/InputLabel"
import FormControl from "@mui/material/FormControl"
import FormHelperText from "@mui/material/FormHelperText"
import { useAuthContext } from "../../../../context/AuthProvider"
import { getDataFromEndpoint } from "../../../../utils/getDataFromEndpoint"

export const PositionSelect = props => {
  const currentUser = useAuthContext()
  const [reqStatus, setReqStatus] = useState({ loading: true, error: null })
  const [allPosition, setAllPosition] = useState([])
  const [selectedPosition, setSelectedPosition] = useState("")
  const hasPosition = allPosition && allPosition.length !== 0

  const fetchData = useCallback(async () => {
    if (currentUser.login) {
      try {
        setReqStatus({ loading: true, error: null })
        const data = await getDataFromEndpoint(
          currentUser.token,
          "/orgStruct/getPositionsByID",
          "POST",
          props.selectedSubDep,
          setReqStatus
        )
        setAllPosition(data)
        setReqStatus({ loading: false, error: null })
      } catch (error) {
        setReqStatus({ loading: false, error: error.message })
      }
    }
  }, [currentUser, props.selectedSubDep])

  useEffect(() => {
    setSelectedPosition("")
  }, [props.selectedSubDep, props.reRender])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleChange = e => {
    setSelectedPosition(e.target.value)
    props.getData(e)
  }

  const childrenWithProps = props.children
    ? React.Children.map(props.children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { selectedPosition })
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
          <FormControl sx={{ minWidth: 222 }} disabled={!hasPosition}>
            <InputLabel id="position-simple-select-label">
              {selectedPosition ? "Должность" : "Выберите должность"}
            </InputLabel>
            <Select
              required
              value={selectedPosition}
              name={currentUser.role === "admin" ? "position_id" : "responsible_position_id"}
              labelId="position-select-label"
              label={selectedPosition ? "Должность" : "Выберите должность"}
              onChange={handleChange}>
              {allPosition &&
                allPosition.map(position => (
                  <MenuItem key={position.id} value={position.id}>
                    {position.name}
                  </MenuItem>
                ))}
            </Select>
            <FormHelperText>
              {hasPosition ? ".." : "Выберите Отдел"}
            </FormHelperText>
          </FormControl>
        </Box>
      )}
      {childrenWithProps}
    </>
  )
}
