import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Request interceptor
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Log para depuração
  console.log('Enviando requisição:', {
    url: config.url,
    method: config.method,
    headers: config.headers,
    data: config.data
  });
  
  return config;
}, error => {
  console.error('Erro no interceptor de requisição:', error);
  return Promise.reject(error);
});

// Response interceptor
api.interceptors.response.use(response => {
  console.log('Resposta recebida:', {
    status: response.status,
    data: response.data,
    headers: response.headers
  });
  return response;
}, error => {
  if (error.response) {
    console.error('Erro na resposta:', {
      status: error.response.status,
      data: error.response.data,
      headers: error.response.headers
    });
    
    if (error.response.status === 401) {
      window.location.href = '/login';
    }
    
    return Promise.reject({
      message: error.response.data?.message || 'Erro na requisição',
      status: error.response.status,
      data: error.response.data
    });
  } else {
    console.error('Erro de conexão:', error.message);
    return Promise.reject({ message: 'Erro de conexão com o servidor' });
  }
});

export default api;