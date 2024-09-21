import React from "react"
import { FormControl, InputLabel, NativeSelect } from "@mui/material"

// Универсальный компонент SelectInput
const SelectInputUniv = ({ label, options, onChange, value, inputProps }) => {
  return (
    <FormControl fullWidth sx={{ mt: 2 }}>
      <InputLabel variant="standard" htmlFor={inputProps.id} shrink={!value}>
        {label}
      </InputLabel>
      <NativeSelect value={value} onChange={onChange} inputProps={inputProps}>
        {options.map(option => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </NativeSelect>
    </FormControl>
  )
}

export default SelectInputUniv
