import React, { useState, useEffect, useCallback } from "react"
import { Box } from "@mui/material"
import Select from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import InputLabel from "@mui/material/InputLabel"
import FormControl from "@mui/material/FormControl"
import FormHelperText from "@mui/material/FormHelperText"
import { useAuthContext } from "../../../../context/AuthProvider"
import { getDataFromEndpoint } from "../../../../utils/getDataFromEndpoint"

export const UserSelect = props => {
  const currentUser = useAuthContext()
  const [reqStatus, setReqStatus] = useState({ loading: true, error: null })
  const [allUser, setAllUser] = useState([])
  const [selectedUser, setSelectedUser] = useState("")
  const hasUsers = allUser.length !== 0

  const fetchData = useCallback(async () => {
    if (currentUser.login) {
      try {
        setReqStatus({ loading: true, error: null })
        const data = await getDataFromEndpoint(
          currentUser.token,
          "/orgStruct/getUserByPositionId",
          "POST",
          props.selectedPosition,
          setReqStatus
        )
        setAllUser(data)
        setReqStatus({ loading: false, error: null })
      } catch (error) {
        setReqStatus({ loading: false, error: error.message })
      }
    }
  }, [currentUser, props.selectedPosition])

  useEffect(() => {
    setSelectedUser("")
  }, [props.selectedPosition])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleChange = e => {
    setSelectedUser(e.target.value)
    props.getData(e)
  }

  return (
    <>
      {reqStatus.loading ? (
        <div>Идет загрузка...</div>
      ) : (
        <Box>
          <FormControl sx={{ minWidth: 222 }} disabled={!hasUsers}>
            <InputLabel id="user-simple-select-label">
              {selectedUser ? "Сотрудник" : "Выберите сотрудника"}
            </InputLabel>
            <Select
              required
              value={selectedUser}
              name="responsible_user_id"
              labelId="user-select-label"
              label={selectedUser ? "Сотрудник" : "Выберите сотрудника"}
              onChange={handleChange}>
              {allUser &&
                allUser.map(user => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.last_name}
                  </MenuItem>
                ))}
            </Select>
            <FormHelperText>
              {hasUsers ? " " : "Выберите Должность"}
            </FormHelperText>
          </FormControl>
        </Box>
      )}
    </>
  )
}

//Usage
{/* <Stack direction="row" spacing={2}>
<DepartmentSelect {...props}>
  <SubDepartmenSelect {...props}>
    <PositionSelect {...props}>
      <UserSelect {...props} />
    </PositionSelect>
  </SubDepartmenSelect>
</DepartmentSelect>
</Stack> */}


{/* <PositionSelect getData={getInputData} selectedSubDep={currentUser.subDep}>
<UserSelect getData={getInputData} />
</PositionSelect> */}