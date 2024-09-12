import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import React from 'react';

const CustomModal = ({ open, setOpen, title, children }) => {
  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="modal-title"
      aria-describedby="modal-desc"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          backgroundColor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 1,
        }}
      >
        <Typography id="modal-title" variant="h6" component="h2">
          {title}
        </Typography>
        {children}
      </Box>
    </Modal>
  );
};

export default CustomModal;
