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
