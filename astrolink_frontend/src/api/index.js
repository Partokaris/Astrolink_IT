import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:5000/api", // Flask backend
});

// =======================
// 🔹 Auth
// =======================
export const signupUser = (data) => API.post("/auth/signup", data);
export const loginUser = (data) => API.post("/auth/login", data);

// =======================
// 🔹 Products
// =======================
export const fetchProducts = () => API.get("/products/");
export const addProduct = (data) => API.post("/products/", data);

// =======================
// 🔹 Projects
// =======================
export const fetchProjects = () => API.get("/projects/");
export const addProject = (data) => API.post("/projects/", data);

// =======================
// 🔹 Testimonials
// =======================
export const fetchTestimonials = () => API.get("/testimonials/");
export const addTestimonial = (data) => API.post("/testimonials/", data);
export const deleteTestimonial = (id) => API.delete(`/testimonials/${id}`);

// Orders
export const createOrder = (data) => API.post('/orders/', data);
export const fetchOrders = (params) => API.get('/orders/', { params });
export const updateOrder = (id, data) => {
  const token = localStorage.getItem('token');
  const numId = Number(id);
  if (!isFinite(numId) || numId <= 0) {
    console.error('updateOrder called with invalid id:', id);
    return Promise.reject(new Error('Invalid order id: ' + id));
  }
  return API.patch(`/orders/${numId}`, data, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
};

export const fetchOrdersAdmin = (params) => {
  const token = localStorage.getItem('token');
  return API.get('/orders/', { params, headers: token ? { Authorization: `Bearer ${token}` } : {} });
};

export const fetchOrderAdmin = (id) => {
  const token = localStorage.getItem('token');
  const numId = Number(id);
  if (!isFinite(numId) || numId <= 0) return Promise.reject(new Error('Invalid id'));
  return API.get(`/orders/${numId}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
};
