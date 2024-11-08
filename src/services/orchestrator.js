import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_ORCHESTRATOR,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const create = async(data) => {
    try {
        const response = await api.post('/api/orchestrator', data);
        return response.data;

    } catch (error) {
        console.log('Error al generar registro:', error);
        throw error;
    }
};