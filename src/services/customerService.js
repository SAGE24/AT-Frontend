import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_CUSTOMER,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const searchByDocument = async(document) => {
    
    try {
        const response = await api.get(`/api/customers/${document}`);
        return response.data;
    } catch (error) {
        console.log('Error consultar datos de cliente:', error);
        throw error;
    }
};