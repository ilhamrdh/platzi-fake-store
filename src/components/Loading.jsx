import React from 'react';
import LoadingScreen from '../assets/animation/loading-screen.json';
import Lottie from 'lottie-react';
import { Box } from '@mui/material';

const Loading = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100%' }}>
      <Lottie animationData={LoadingScreen} loop={true} style={{ width: 200, height: 200 }} />
    </Box>
  );
};

export default Loading;
