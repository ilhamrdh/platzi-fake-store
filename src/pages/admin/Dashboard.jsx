import AddIcon from '@mui/icons-material/Add';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  Box,
  Container,
  IconButton,
  MenuItem,
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import CustomButton from '../../components/CustomButton';
import CustomDropdown from '../../components/CustomDropdown';
import AddNewProduct from '../../components/forms/AddNewProduct';
import EditProduct from '../../components/forms/EditProduct';
import SelectMenu from '../../components/SelectMenu';
import TextInput from '../../components/TextInput';
import { useDebounce } from '../../hooks/useDebounce';
import { fetchCategory } from '../../services/category';
import { deleteProduct, fetchProducts } from '../../services/product';
import { formatDate } from '../../utils/formatDate';

const Dashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isMobile = useMediaQuery('(max-width:600px)');
  const isTablet = useMediaQuery('(max-width:900px)');

  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [productId, setProductId] = useState(0);

  const [filter, setFilter] = useState({
    search: '',
    category: '',
    range: {
      min: '',
      max: '',
    },
  });
  const query = useDebounce(filter.search, 500);
  const [sorting, setSorting] = useState([]);
  const [applyCategory, setApplyCategory] = useState('');
  const [applyRange, setApplyRange] = useState({ min: '', max: '' });

  const handleApply = () => {
    setApplyRange({ min: filter.range.min, max: filter.range.max });
    setApplyCategory(filter.category);
    setOpenDropdown(null);
  };

  const handleClear = () => {
    setApplyRange({ min: '', max: '' });
    setApplyCategory('');
    setFilter({ search: '', category: '', range: { min: '', max: '' } });
    setOpenDropdown(null);
  };

  const handleEdit = (product) => {
    setOpenEditModal(true);
    setProductId(product.id);
  };

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
      Swal.fire({
        title: 'Deleted!',
        text: 'Product has been deleted.',
        icon: 'success',
      });
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

  const handleDetail = (product) => {
    navigate(`/detail-product/${product.id}`);
  };

  const columns = [
    {
      accessorKey: 'title',
      header: 'Product Name',
      enableSorting: true,
      cell: (props) => <Typography fontWeight="semibold">{props.getValue()}</Typography>,
    },
    {
      accessorKey: 'price',
      header: 'Price',
      enableSorting: true,
      cell: (props) => <Typography>$ {props.getValue()}</Typography>,
    },
    {
      accessorKey: 'category',
      header: 'Category',
      enableSorting: false,
      cell: (props) => <Typography>{props.getValue()?.name}</Typography>,
    },
    {
      accessorKey: 'creationAt',
      header: 'Created At',
      enableSorting: true,
      cell: (props) => <Typography>{formatDate(props.getValue())}</Typography>,
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const product = row.original;
        return (
          <Box sx={{ display: 'flex', gap: '10px' }}>
            <IconButton onClick={() => handleDetail(product)} variant="contained" color="#8b8b8b">
              <VisibilityIcon />
            </IconButton>
            <IconButton onClick={() => handleEdit(product)} variant="contained" color="success">
              <BorderColorIcon />
            </IconButton>
            <IconButton onClick={() => handleDelete(product)} variant="contained" color="error">
              <DeleteSweepIcon />
            </IconButton>
          </Box>
        );
      },
    },
  ];

  const params = {
    offset: 0,
    limit: 10,
    title: query,
    price: 0,
    price_min: applyRange.min,
    price_max: applyRange.max,
    categoryId: applyCategory,
  };

  const { data, error, isFetching, isPending } = useQuery({
    queryKey: ['products', params],
    queryFn: fetchProducts,
    keepPreviousData: true,
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategory,
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  if (error) return <div>Error: {error.message}</div>;
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <CustomButton
        onClick={() => setOpenAddModal(true)}
        title={'Add Product'}
        startIcon={<AddIcon />}
        fullWidth={false}
        bgColor={'primary.main'}
        hoverColor={'primary.dark'}
        textColor={'white'}
      />
      <Box
        sx={{
          display: 'flex',
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
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              {table.getFlatHeaders().map((header) => (
                <TableCell key={header.id} sx={{ fontWeight: 'bold', fontSize: 14 }}>
                  {header.column.getCanSort() ? (
                    <TableSortLabel
                      active={header.column.getIsSorted() !== false}
                      direction={header.column.getIsSorted() === 'asc' ? 'asc' : 'desc'}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </TableSortLabel>
                  ) : (
                    flexRender(header.column.columnDef.header, header.getContext())
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          {isPending || isFetching ? (
            <TableRow>
              <TableCell colSpan={columns.length} align="center">
                <Typography>Loading...</Typography>
              </TableCell>
            </TableRow>
          ) : data && data.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} align="center">
                <Typography>No rows</Typography>
              </TableCell>
            </TableRow>
          )}
        </Table>
      </TableContainer>
      <AddNewProduct open={openAddModal} setOpen={setOpenAddModal} categories={categories} />
      <EditProduct open={openEditModal} setOpen={setOpenEditModal} productId={productId} />
    </Container>
  );
};

export default Dashboard;
