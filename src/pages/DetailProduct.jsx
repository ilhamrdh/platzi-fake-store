import { Box, Container, Typography, useMediaQuery } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import 'animate.css';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import CustomButton from '../components/CustomButton';
import EditProduct from '../components/forms/EditProduct';
import Loading from '../components/Loading';
import { ROLES } from '../constants/role';
import { addToCart } from '../redux/cartSlice';
import { deleteProduct, detailProduct } from '../services/product';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 1000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

const DetailProduct = () => {
  const { idProduct } = useParams();
  const { role } = useSelector((state) => state.auth);
  const { darkMode } = useSelector((state) => state.theme);
  const isMobile = useMediaQuery('(max-width: 600px)');
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const [openModalEdit, setOpenModalEdit] = useState(false);

  const { data, error, isLoading, isError, isSuccess } = useQuery({
    queryKey: ['detailProduct', idProduct],
    queryFn: () => detailProduct(idProduct),
    refetchOnWindowFocus: false,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
      Swal.fire({
        title: 'Deleted!',
        text: 'Product has been deleted.',
        icon: 'success',
      });
      navigate('/');
    },
    onError: () => {
      Swal.fire({
        title: 'Error!',
        text: 'Something went wrong.',
        icon: 'error',
      });
    },
  });

  const handleDelete = (product) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(product.id);
      }
    });
  };

  const handleAddToCart = (product) => {
    Toast.fire({
      icon: 'success',
      title: 'Berhasil disimpan ke keranjang',
    });
    const item = {
      id: product.id,
      title: product.title,
      price: product.price,
      quantity: 1,
    };
    dispatch(addToCart(item));
  };

  if (isLoading) return <Loading />;

  if (isError) return <div>Error: {error.message}</div>;

  return (
    <Container maxWidth="lg" sx={{ my: 3 }}>
      {isSuccess && (
        <Box className={'animate__fadeIn'} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
            <Box justifyContent={'center'} display={'flex'} sx={{ width: '100%' }}>
              <Carousel
                autoFocus={true}
                width={isMobile ? 300 : 400}
                centerSlidePercentage={50}
                infiniteLoop={true}
                showThumbs={true}
                showStatus={false}
                useKeyboardArrows={true}
                autoPlay={true}
              >
                {data &&
                  data?.images?.map((image, index) => (
                    <Box
                      key={index}
                      sx={{
                        width: '100%',
                        height: 300,
                        backgroundImage: `url(${image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        borderRadius: 2,
                      }}
                    />
                  ))}
              </Carousel>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
              <Box sx={{ gap: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h4">{data?.title}</Typography>
                <Typography
                  variant="subtitle1"
                  fontWeight={500}
                  py={0.5}
                  px={1}
                  bgcolor={darkMode ? '#575757' : 'papaya.main'}
                  sx={{ borderRadius: 5, alignSelf: 'flex-start' }}
                >
                  {data?.category?.name}
                </Typography>
                <Typography variant="h5" color="gray" fontWeight={700} px={2} py={1}>
                  $ {data?.price}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', width: '100%' }}>
                {role === ROLES.ADMIN ? (
                  <>
                    <CustomButton
                      title="Edit Product"
                      bgColor={'warning.main'}
                      textColor={'#000'}
                      hoverColor={'warning.dark'}
                      otherStyleButton={{ width: 'auto' }}
                      onClick={() => setOpenModalEdit(true)}
                    />
                    <CustomButton
                      title="Delete Product"
                      bgColor={'error.main'}
                      textColor={'#FFF'}
                      hoverColor={'error.dark'}
                      otherStyleButton={{ width: 'auto' }}
                      onClick={() => handleDelete(data)}
                    />
                  </>
                ) : (
                  role === ROLES.USER && (
                    <CustomButton
                      title="Add to cart"
                      textColor={'#FFF'}
                      bgColor={'#0096c7'}
                      hoverColor={'#0077B6'}
                      otherStyleButton={{ width: 'auto' }}
                      onClick={() => handleAddToCart(data)}
                    />
                  )
                )}
              </Box>
            </Box>
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={700}>
              Product Description
            </Typography>
            <Typography variant="body1">{data?.description}</Typography>
          </Box>
        </Box>
      )}
      <EditProduct open={openModalEdit} setOpen={setOpenModalEdit} productId={idProduct} />
    </Container>
  );
};

export default DetailProduct;
