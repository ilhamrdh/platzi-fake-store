import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import React from 'react';

const TextInput = ({
  placeholder,
  label,
  value,
  onChange,
  icon = null,
  iconPosition = 'start',
  onIconClick,
  type = 'text',
  fullWidth = true,
  size = 'small',
  variant = 'outlined',
  margin = 'normal',
  otherStyle = {},
  ...rest
}) => {
  const iconAdornment = icon ? (
    <IconButton onClick={onIconClick} aria-label="icon">
      {icon}
    </IconButton>
  ) : null;

  return (
    <TextField
      label={label}
      type={type}
      variant={variant}
      placeholder={placeholder}
      size={size}
      margin={margin}
      value={value}
      onChange={onChange}
      fullWidth={fullWidth}
      sx={{
        bgcolor: 'background.paper',
        ...otherStyle,
      }}
      InputProps={{
        ...(icon && { [`${iconPosition}Adornment`]: iconAdornment }),
      }}
      {...rest}
    />
  );
};

export default TextInput;
