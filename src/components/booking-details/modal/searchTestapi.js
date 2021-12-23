import axios from 'axios';
import { API_BASE_URL } from '../../../config/index'
export default axios.create({
baseURL: API_BASE_URL,
headers: {
},
});