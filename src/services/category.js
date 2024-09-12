import instance from './axiosConfig';

export const fetchCategory = async () => {
  const res = await instance.get('/categories');
  return res.data;
};
