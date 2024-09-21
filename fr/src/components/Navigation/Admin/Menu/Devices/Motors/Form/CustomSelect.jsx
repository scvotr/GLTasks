import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const CustomSelect = ({ 
  label, 
  value, 
  onChange, 
  options, 
  placeholder = "Выберите значение", 
  id,
  units,
}) => {
  return (
    <FormControl fullWidth>
      <InputLabel variant="standard" htmlFor={id} sx={{ pl: 1 }} shrink={!!value}>
        {label}
      </InputLabel>
      <Select
        value={value}
        onChange={onChange}
        inputProps={{
          name: label.toLowerCase(),
          id: id,
        }}
      >
        <MenuItem value="" disabled>
          {placeholder}
        </MenuItem>
        {options.map(option => (
          <MenuItem key={option.id} value={option.id}>
            {option.name} {units}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CustomSelect;
