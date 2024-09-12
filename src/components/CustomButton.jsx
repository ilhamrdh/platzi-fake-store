import { Button } from '@mui/material';
import React from 'react';

const CustomButton = ({ title, onClick, onChange, type = 'button', bgColor, hoverColor, textColor, otherStyleButton, ...rest }) => {
  return (
    <Button
      variant="text"
      type={type}
      color={textColor}
      onChange={onChange}
      onClick={onClick}
      fullWidth
      sx={{
        textTransform: 'none',
        fontSize: '14px',
        fontWeight: 500,
        mb: -1,
        color: textColor,
        ...otherStyleButton,
        backgroundColor: bgColor,
        '&:hover': {
          backgroundColor: hoverColor,
        },
      }}
      {...rest}
    >
      {title}
    </Button>
  );
};

export default CustomButton;
