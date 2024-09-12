import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Box, Card, CardContent, CardMedia, Container, Grid, MenuItem, Typography, useMediaQuery } from '@mui/material';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import EmptyProduct from '../assets/images/empty-product.png';
import CustomButton from '../components/CustomButton';
import CustomDropdown from '../components/CustomDropdown';
import EmptyList from '../components/EmptyList';
import Loading from '../components/Loading';
import SelectMenu from '../components/SelectMenu';
import TextInput from '../components/TextInput';
import { useDebounce } from '../hooks/useDebounce';
import { addToCart } from '../redux/cartSlice';
import { fetchCategory } from '../services/category';
import { fetchProducts } from '../services/product';

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

const ListProduct = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery('(max-width:600px)');
  const isTablet = useMediaQuery('(max-width:900px)');
  const [openDropdown, setOpenDropdown] = useState(null);

  const [filter, setFilter] = useState({
    range: { min: '', max: '' },
    category: '',
    search: '',
  });

  const query = useDebounce(filter.search, 500);
  const [applyCategory, setApplyCategory] = useState('');
  const [applyRange, setApplyRange] = useState({ min: '', max: '' });
  const params = {
    title: query,
    price_min: applyRange.min,
    price_max: applyRange.max,
    categoryId: applyCategory,
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } = useInfiniteQuery({
    queryKey: ['products', params],
    queryFn: fetchProducts,
    getNextPageParam: (lastPage, allPages) => {
      const morePagesExist = lastPage.length === 15;
      if (!morePagesExist) return undefined;
      return allPages.length * 15;
    },
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategory,
  });

  const handleApply = () => {
    setApplyRange(filter.range);
    setApplyCategory(filter.category);
    setPriceRangeAnchorEl(null);
  };

  const handleClear = () => {
    setApplyRange({ min: '', max: '' });
    setApplyCategory('');
    setFilter({
      range: { min: '', max: '' },
      category: '',
      search: '',
    });
    setOpenDropdown(null);
  };

  const observerElem = useRef();
  const loadMore = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  useEffect(() => {
    if (!observerElem.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          loadMore();
        }
      },
      {
        rootMargin: '100px',
      }
    );
    observer.observe(observerElem.current);
    return () => {
      if (observerElem.current) observer.unobserve(observerElem.current);
    };
  }, [observerElem, hasNextPage]);

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

  return (
    <Container maxWidth="lg" sx={{ my: 1, zIndex: -1 }}>
      <Box
        sx={{
          display: 'flex',
          marginBottom: { xs: 4, md: 2 },
          justifyContent: 'space-between',
          flexDirection: { xs: 'column', sm: 'row', md: 'row' },
          alignItems: 'center',
          gap: 1,
        }}
      >
        <TextInput
          onChange={(e) => setFilter({ ...filter, search: e.target.value })}
          value={filter.search}
          placeholder={'Product Name'}
          icon={<SearchIcon />}
          fullWidth={isMobile || isTablet ? true : false}
        />
        <CustomDropdown
          handleOpen={(event) => setOpenDropdown(event.currentTarget)}
          handleClose={(event) => setOpenDropdown(null)}
          anchorEl={openDropdown}
          title={'Filter'}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', padding: 1 }}>
            <SelectMenu label={'Category'} onChange={(e) => setFilter({ ...filter, category: e.target.value })} value={filter.category}>
              <MenuItem value="">All</MenuItem>
              {categories?.map((category, index) => (
                <MenuItem key={index} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </SelectMenu>
            <TextInput
              onChange={(e) => setFilter({ ...filter, range: { ...filter.range, min: e.target.value } })}
              value={filter.range.min}
              label={'Min Price'}
              otherStyle={{ mb: -1 }}
              fullWidth={false}
              type="number"
            />
            <TextInput
              onChange={(e) => setFilter({ ...filter, range: { ...filter.range, max: e.target.value } })}
              value={filter.range.max}
              label={'Max Price'}
              fullWidth={false}
              type="number"
            />
            <Box display={'flex'} gap={1}>
              <CustomButton title={'Apply'} onClick={handleApply} bgColor={'primary.main'} hoverColor={'primary.dark'} textColor={'white'} />
              <CustomButton title={'Clear'} onClick={handleClear} bgColor={'error.main'} hoverColor={'error.dark'} textColor={'white'} />
            </Box>
          </Box>
        </CustomDropdown>
      </Box>
      <Grid container spacing={4}>
        {isLoading ? (
          <Loading />
        ) : (
          data?.pages?.flatMap((page) =>
            page.length > 0 ? (
              page.map((product) => (
                <Grid item xs={6} sm={4} md={3} key={product.id}>
                  <Card
                    sx={{
                      maxWidth: 345,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      height: '100%',
                    }}
                  >
                    <CardMedia
                      component={'img'}
                      image={product.images[0]}
                      alt={product.title}
                      onClick={() => navigate(`/detail-product/${product.id}`)}
                    />
                    <CardContent>
                      <Box
                        sx={{
                          fontSize: { xs: 12, sm: 14, md: 16 },
                          display: 'flex',
                          flexDirection: 'column',
                          width: '100%',
                          mb: 1,
                        }}
                      >
                        <Typography gutterBottom variant="body2" fontWeight={'bold'} component="div">
                          {product.title}
                        </Typography>
                        <Typography gutterBottom variant="overline" component="div" color="text.secondary">
                          {product.category.name}
                        </Typography>
                        <Typography gutterBottom variant="inherit" component="div" sx={{ alignSelf: 'flex-end' }}>
                          $ {product.price}
                        </Typography>
                      </Box>
                      <CustomButton
                        onClick={() => handleAddToCart(product)}
                        title={'Add to cart'}
                        startIcon={<ShoppingCartIcon />}
                        bgColor={'#0096c7'}
                        hoverColor={'#0077B6'}
                        textColor={'white'}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <EmptyList url={EmptyProduct} title={'No product found'} />
            )
          )
        )}
      </Grid>
      <div ref={observerElem} />
      {isFetchingNextPage && <Loading />}
    </Container>
  );
};
export default ListProduct;
