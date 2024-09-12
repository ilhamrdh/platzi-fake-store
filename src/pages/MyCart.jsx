import { Box, Container, Typography, Checkbox, Grid, Button, useMediaQuery, IconButton } from '@mui/material';
import React, { Fragment, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import 'animate.css';
import Lottie from 'lottie-react';
import checkoutAnimation from '../assets/animation/loading-cart.json';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { checkout, removeItem, updateQuantity } from '../redux/cartSlice';
import EmptyList from '../components/EmptyList';
import EmptyCart from '../assets/images/empty-cart.png';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import { useNavigate } from 'react-router-dom';

const MyCart = () => {
  const { cart } = useSelector((state) => state.cart);
  const { darkMode } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:600px)');
  const [selectedItems, setSelectedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectItem = (item) => {
    if (selectedItems.includes(item.id)) {
      setSelectedItems(selectedItems.filter((id) => id !== item.id));
    } else {
      setSelectedItems([...selectedItems, item.id]);
    }
  };

  const calculateTotalPrice = () => {
    return cart.filter((item) => selectedItems.includes(item.id)).reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCheckout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to buy this item',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#4caf50',
      cancelButtonColor: '#f44336',
      confirmButtonText: 'Yes, buy it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        setIsLoading(true);
        setTimeout(() => {
          setIsLoading(false);
          dispatch(checkout(selectedItems));
          Swal.fire({
            title: 'Deleted!',
            text: 'Your file has been deleted.',
            icon: 'success',
          });
        }, 2000);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: 'Cancelled',
          text: 'Your imaginary file is safe :)',
          icon: 'error',
        });
      }
    });
  };

  const handleIncreaseQuantity = (item) => {
    const newQuantity = item.quantity + 1;
    dispatch(updateQuantity({ id: item.id, quantity: newQuantity }));
  };

  const handleDecreaseQuantity = (item) => {
    const newQuantity = item.quantity > 1 ? item.quantity - 1 : 1;
    dispatch(updateQuantity({ id: item.id, quantity: newQuantity }));
  };

  return (
    <Fragment>
      <Container maxWidth="lg" sx={{ my: 4 }}>
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          fontWeight="bold"
          color={darkMode ? 'white' : 'black'}
          sx={{ fontFamily: 'Roboto, sans-serif', letterSpacing: '0.1rem' }}
        >
          <ShoppingCartIcon sx={{ mr: 2, fontSize: '2.5rem' }} /> My Cart
        </Typography>

        {cart.length > 0 ? (
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {cart.map((item) => (
              <Grid item xs={12} key={item.id} className="animate__animated animate__fadeInUp">
                <Box
                  display="flex"
                  alignItems="center"
                  sx={{
                    p: { xs: 1, sm: 2 },
                    boxShadow: 3,
                    borderRadius: 2,
                    bgcolor: darkMode ? 'primary.dark' : 'white',
                    transition: 'all 0.3s',
                    '&:hover': { boxShadow: 6 },
                  }}
                >
                  <Checkbox
                    checked={selectedItems.includes(item.id)}
                    onChange={() => handleSelectItem(item)}
                    color={darkMode ? 'secondary' : 'primary'}
                  />
                  <Box
                    display="flex"
                    sx={{ width: '100%', alignItems: 'center' }}
                    flexDirection={{ xs: 'column', sm: 'row' }}
                    justifyContent={isMobile ? 'center' : 'space-between'}
                  >
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      sx={{ width: { xs: '100%', sm: 400 }, cursor: 'pointer' }}
                      onClick={() => navigate(`/detail-product/${item.id}`)}
                    >
                      {item.title}
                    </Typography>
                    <Typography variant="h6" sx={{ minWidth: 100 }}>
                      ${item.price}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={2} sx={{ width: 150 }}>
                      <IconButton onClick={() => handleIncreaseQuantity(item)}>
                        <AddIcon />
                      </IconButton>
                      <Typography variant="h6">{item.quantity}</Typography>
                      <IconButton onClick={() => handleDecreaseQuantity(item)}>
                        <RemoveIcon />
                      </IconButton>
                    </Box>
                    <Typography variant="h6" fontWeight="bold" color={darkMode ? 'white' : 'black'} sx={{ minWidth: 150 }}>
                      Subtotal: ${item.price * item.quantity}
                    </Typography>
                    <IconButton
                      onClick={() => {
                        dispatch(removeItem(item.id));
                      }}
                      variant="contained"
                      color="error"
                    >
                      <DeleteSweepIcon />
                    </IconButton>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        ) : (
          <EmptyList url={EmptyCart} title="Your cart is empty" />
        )}
      </Container>
      <Grid
        item
        xs={12}
        sx={{
          px: 6,
          py: 2,
          alignItems: 'center',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          width: '100%',
          position: 'fixed',
          bottom: 0,
          backgroundColor: darkMode ? '#333' : '#FFF',
        }}
      >
        <Typography variant="h5" fontWeight="bold" color={darkMode ? 'white' : 'black'} sx={{ textAlign: 'right', mb: { xs: 2, sm: 0 } }}>
          Total Selected: ${calculateTotalPrice()}
        </Typography>
        {isLoading ? (
          <Lottie animationData={checkoutAnimation} style={{ width: 50, height: 50 }} />
        ) : (
          <Button
            variant="contained"
            color={darkMode ? '#717171' : 'primary'}
            disabled={selectedItems.length === 0}
            onClick={handleCheckout}
            sx={{
              fontWeight: 'bold',
              fontSize: '1.2rem',
              transition: 'background-color 0.3s',
              '&:hover': { backgroundColor: darkMode ? '#717171' : 'primary.main' },
            }}
            className="animate__animated animate__pulse"
          >
            Checkout
          </Button>
        )}
      </Grid>
    </Fragment>
  );
};

export default MyCart;
