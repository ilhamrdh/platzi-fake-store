import * as yup from 'yup';

export const productSchema = yup.object().shape({
  title: yup.string().required('product name is required'),
  price: yup.number().required('Price is required').typeError('Price must be a number'),
  description: yup.string().required('Description is required'),
  category: yup.number().required('Category is required').typeError('Category must be a number'),
  images: yup.array().required('Images is required'),
});
