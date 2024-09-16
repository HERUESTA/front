import axios from "axios";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
console.log('API Base URL:', process.env.NEXT_PUBLIC_API_BASE_URL);

// デフォルトエクスポートを追加
export default instance;