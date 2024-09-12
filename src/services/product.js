import instance from './axiosConfig';

export const fetchProducts = async ({ queryKey }) => {
  const [_key, { offset, limit, title, price_min, price_max, categoryId }] = queryKey;
  const res = await instance.get('/products', {
    params: {
      limit: limit,
      offset: offset,
      title: title,
      price_min: price_min,
      price_max: price_max,
      categoryId: categoryId,
    },
  });
  return res.data;
};

export const detailProduct = async (id) => {
  const res = await instance.get(`/products/${id}`);
  return res.data;
};

export const deleteProduct = async (id) => {
  const res = await instance.delete(`/products/${id}`);
  return res.data;
};

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await instance.post('/files/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data.location;
};

export const updateProduct = async ({ id, data }) => {
  const res = await instance.put(`/products/${id}`, data);
  return res.data;
};

export const addProduct = async (data) => {
  const res = await instance.post('/products', data);
  return res.data;
};
