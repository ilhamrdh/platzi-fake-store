import { Box, Button, Menu } from '@mui/material';
import React from 'react';
import CustomButton from './CustomButton';
import { useSelector } from 'react-redux';

const CustomDropdown = ({ children, handleOpen, handleClose, anchorEl, title }) => {
  const { darkMode } = useSelector((state) => state.theme);
  return (
    <Box sx={{ position: 'relative', minWidth: 120, width: { xs: '100%', md: 'auto', sm: 'auto' } }}>
      <CustomButton
        title={'Filter'}
        onClick={handleOpen}
        bgColor={darkMode ? '#282828' : 'white'}
        hoverColor={darkMode ? '#121212' : '#717171'}
        textColor={darkMode ? 'white' : 'black'}
        otherStyleButton={{ mb: -1, textTransform: 'none', border: '1px solid #C0C0C0' }}
        fullWidth={true}
      />
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {children}
      </Menu>
    </Box>
  );
};

export default CustomDropdown;
