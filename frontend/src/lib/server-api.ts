import axios from "axios";

// Ensure backend base URL is set. Fallback to local dev backend with global prefix /api
const baseURL = process.env.NEST_API_URL || "http://localhost:5000/api";

const serverApi = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default serverApi;
