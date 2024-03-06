import { Stack } from "@mui/material"
import { DepartmentSelect } from "../../../../../../FormComponents/Select/DepartmentSelect/DepartmentSelect"
import { SubDepartmenSelect } from "../../../../../../FormComponents/Select/SubDepartmenSelect/SubDepartmenSelect"
import { PositionSelect } from "../../../../../../FormComponents/Select/PositionSelect/PositionSelect"
import { UserSelect } from "../../../../../../FormComponents/Select/UserSelect/UserSelect"

export const SelectDataField = props => {
  console.log("SelectDataField", props.internalTask)
  return (
    <>
      <Stack direction="column" spacing={2} sx={{ alignItems: "center" }}>
        <DepartmentSelect {...props}>
          <SubDepartmenSelect {...props}>
            {props.internalTask ? (
              <PositionSelect {...props}>
                <UserSelect {...props} />
              </PositionSelect>
            ) : (
              <></>
            )}
          </SubDepartmenSelect>
        </DepartmentSelect>
      </Stack>
    </>
  )
}

{
  /* <Stack direction="row" spacing={2}>
        <DepartmentSelect {...props}>
          <SubDepartmenSelect {...props}>
            <PositionSelect {...props}>
              <UserSelect {...props} />
            </PositionSelect>
          </SubDepartmenSelect>
        </DepartmentSelect>
      </Stack> */
}
