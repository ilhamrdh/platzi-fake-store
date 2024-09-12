import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CloseIcon from '@mui/icons-material/Close';
import { Grid } from '@mui/joy';
import { Box, IconButton, MenuItem, Typography } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { addProduct, uploadImage } from '../../services/product';
import { productSchema } from '../../validation/productSchema';
import CustomButton from '../CustomButton';
import CustomModal from '../CustomModal';
import SelectMenu from '../SelectMenu';
import TextInput from '../TextInput';

const AddNewProduct = ({ open, setOpen, categories }) => {
  const [fileName, setFileName] = useState('');
  const [filePreview, setFilePreview] = useState(null);
  const [fileTypeError, setFileTypeError] = useState('');
  const [file, setFile] = useState(null);
  const queryClient = useQueryClient();

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
      console.error('Error uploading image:', error);
    },
  });

  const addProductMutation = useMutation({
    mutationFn: addProduct,
    onError: (error) => {
      console.error('Error adding product:', error);
    },
  });

  const formik = useFormik({
    initialValues: {
      title: '',
      price: null,
      description: '',
      category: '',
      images: [],
    },
    validationSchema: productSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      console.log(values);
      if (file) {
        uploadImageMutation.mutate(file, {
          onSuccess: (imageUrl) => {
            console.log('Image uploaded successfully:', imageUrl);
            addProductMutation.mutate(
              {
                title: values.title,
                price: values.price,
                description: values.description,
                categoryId: values.category,
                images: [imageUrl],
              },
              {
                onSuccess: () => {
                  setSubmitting(false);
                  setOpen(false);
                  resetForm();
                  queryClient.invalidateQueries({ queryKey: ['products'] });
                  console.log('Product added successfully');
                },
              }
            );
          },
        });
      } else {
        setSubmitting(false);
        resetForm();
        console.error('No file selected');
      }
    },
  });

  return (
    <CustomModal open={open} setOpen={setOpen} title={'Add New Product'}>
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
            title="Add"
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

export default AddNewProduct;
