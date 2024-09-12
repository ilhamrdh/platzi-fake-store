import { Box, CardMedia, Typography } from '@mui/material';
import React from 'react';

const EmptyList = ({ title, url }) => {
  return (
    <Box width={'100%'}>
      <CardMedia
        component="img"
        src={url}
        alt={title}
        sx={{
          opacity: 0.8,
          maxWidth: 300,
          height: '100%',
          objectFit: 'contain',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          margin: 'auto',
          my: 4,
        }}
      />
      <Typography variant="h6" align="center" gutterBottom fontWeight="bold" color="error">
        {title}
      </Typography>
    </Box>
  );
};

export default EmptyList;
