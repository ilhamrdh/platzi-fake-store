import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { Grid } from '@mui/joy';
import { Box, IconButton, MenuItem } from '@mui/material';
import React, { useEffect, useState } from 'react';
import CustomModal from '../CustomModal';
import TextInput from '../TextInput';
import SelectMenu from '../SelectMenu';
import CustomButton from '../CustomButton';
import { useFormik } from 'formik';
import CloseIcon from '@mui/icons-material/Close';
import { useDropzone } from 'react-dropzone';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { detailProduct, updateProduct, uploadImage } from '../../services/product';
import { fetchCategory } from '../../services/category';

const EditProduct = ({ open, setOpen, productId }) => {
  const queryClient = useQueryClient();
  const [fileName, setFileName] = useState('');
  const [filePreview, setFilePreview] = useState(null);
  const [fileTypeError, setFileTypeError] = useState('');
  const [file, setFile] = useState(null);
  const [initialImage, setInitialImage] = useState('');

  const handleRemoveImage = () => {
    setFileName('');
    setFilePreview(null);
  };

  const imageDropzoneConfig = {
    accept: { 'image/png': [], 'image/jpeg': [], 'image/jpg': [] },
    onDrop: (acceptedFiles, fileRejections) => {
      if (fileRejections.length > 0) {
        setFileTypeError('Only image files are accepted.');
      } else {
        const file = acceptedFiles[0];
        if (file) {
          setFileName(file.name);
          setFilePreview(URL.createObjectURL(file));
          setFileTypeError('');
          setFile(file);
        }
      }
    },
  };

  const { getInputProps, getRootProps } = useDropzone(imageDropzoneConfig);

  const renderFileDropzone = () => {
    if (filePreview) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src={filePreview} alt={fileName} style={{ width: 100, height: 100, objectFit: 'cover', marginRight: 10 }} />
          </div>
          <IconButton onClick={handleRemoveImage}>
            <CloseIcon />
          </IconButton>
        </div>
      );
    } else {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px dashed #2C8AD3',
            borderRadius: '8px',
            padding: '16px',
          }}
        >
          <AddPhotoAlternateIcon style={{ fontSize: 50, color: '#2C8AD3' }} />
          {fileTypeError && (
            <Typography fontSize={10} color="error">
              {fileTypeError}
            </Typography>
          )}
        </div>
      );
    }
  };

  const uploadImageMutation = useMutation({
    mutationFn: uploadImage,
    onError: (error) => {
      console.error('Image upload failed:', error);
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: updateProduct,
    onError: (error) => {
      console.error('Product update failed:', error);
    },
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategory,
  });

  const { data } = useQuery({
    queryKey: ['detailProduct', productId],
    queryFn: () => detailProduct(productId),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (data) {
      setFileName(data?.images[0]);
      setFilePreview(data?.images[0]);
      setInitialImage(data?.images[0]);
    }
  }, [data]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: data?.title || '',
      price: data?.price || '',
      description: data?.description || '',
      category: data?.category?.id || '',
      images: data?.images[0] || [],
    },
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      let imageUrl = initialImage;
      if (file) {
        const uploadedImageUrl = await uploadImageMutation.mutateAsync(file);
        imageUrl = uploadedImageUrl;
      }

      updateProductMutation.mutate(
        {
          id: productId,
          data: {
            title: values.title,
            price: values.price.toString(),
            description: values.description,
            categoryId: values.category.toString(),
            images: [imageUrl],
          },
        },
        {
          onSuccess: () => {
            setSubmitting(false);
            setOpen(false);
            resetForm();
            queryClient.invalidateQueries({ queryKey: ['products'] });
            console.log('Product updated successfully');
          },
        }
      );
    },
  });

  return (
    <CustomModal open={open} setOpen={setOpen} title={'Edit Product'}>
      <form onSubmit={formik.handleSubmit}>
        <Grid>
          <Box sx={{ position: 'relative' }}>
            <label htmlFor="image-upload">
              <Box
                {...getRootProps()}
                sx={{
                  textAlign: 'center',
                  marginTop: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'start',
                  cursor: 'pointer',
                }}
                width={'5.5em'}
              >
                <input {...getInputProps()} />
                <span>{renderFileDropzone()}</span>
              </Box>
            </label>
          </Box>
        </Grid>
        <TextInput
          name="title"
          label={'Product Name'}
          onChange={formik.handleChange}
          value={formik.values.title}
          error={formik.touched.title && Boolean(formik.errors.title)}
          helperText={formik.touched.title && formik.errors.title}
        />
        <TextInput
          name="price"
          placeholder={'Price'}
          icon={<AttachMoneyIcon />}
          onChange={formik.handleChange}
          value={formik.values.price}
          error={formik.touched.price && Boolean(formik.errors.price)}
          helperText={formik.touched.price && formik.errors.price}
        />
        <TextInput
          name="description"
          label={'Description'}
          onChange={formik.handleChange}
          value={formik.values.description}
          error={formik.touched.description && Boolean(formik.errors.description)}
          helperText={formik.touched.description && formik.errors.description}
          multiline={true}
          minRows={3}
        />
        <Box sx={{ paddingY: 1 }} />
        <SelectMenu
          label={'Category'}
          onChange={(e) => formik.setFieldValue('category', e.target.value)}
          value={formik.values.category}
          error={formik.touched.category && Boolean(formik.errors.category)}
          helperText={formik.touched.category && formik.errors.category}
        >
          <MenuItem value={''} sx={{ color: 'gray' }}>
            None
          </MenuItem>
          {categories &&
            categories?.map((category, index) => (
              <MenuItem key={index} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
        </SelectMenu>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 3, gap: 2 }}>
          <CustomButton
            title="Save"
            type="submit"
            bgColor={'primary.main'}
            hoverColor={'primary.dark'}
            disabled={formik.isSubmitting}
            textColor={'white'}
            fullWidth={false}
          />
          <CustomButton
            title="Close"
            onClick={() => setOpen(false)}
            bgColor={'#DADADA'}
            hoverColor={'#C0C0C0'}
            textColor={'black'}
            fullWidth={false}
          />
        </Box>
      </form>
    </CustomModal>
  );
};

export default EditProduct;
