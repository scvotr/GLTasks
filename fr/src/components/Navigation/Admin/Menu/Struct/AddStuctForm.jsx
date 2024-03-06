import React, { useState, useEffect } from 'react';
import { Box, FormControl, TextField, Select, MenuItem, Stack } from '@mui/material';
import { useCallback } from 'react';
import { useAuthContext } from '../../../../../context/AuthProvider';
import { getDataFromEndpoint } from '../../../../../utils/getDataFromEndpoint';

export const AddStuctForm = () => {

  return(
    <Box sx={{ width: '100%' }}>
      <FormControl sx={{ minWidth: 222 }}>
        <Stack direction='row'>
          
        <TextField label="Название департамента" />
        </Stack>
      </FormControl>
    </Box>
  )
}
