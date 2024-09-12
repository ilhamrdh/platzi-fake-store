import { FormControl, InputLabel, Select, Typography } from '@mui/material';
import React from 'react';

const SelectMenu = ({ onChange, value, label, children, error = false, helperText }) => {
  return (
    <FormControl fullWidth size="small" sx={{ minWidth: 120, marginBottom: -1 }}>
      <InputLabel id={`${label}-label`}>{label}</InputLabel>
      <Select labelId={`${label}-label`} id={`${label}"`} value={value} error={error} label={label} onChange={onChange}>
        {children}
      </Select>
      {error && (
        <Typography variant="caption" style={{ color: 'red', marginLeft: 15, marginTop: 5 }}>
          {helperText}
        </Typography>
      )}
    </FormControl>
  );
};

export default SelectMenu;
