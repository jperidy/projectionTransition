import axios from 'axios';
import { API_URL } from '../config/backend_api';

export const updateOrCreateContent = async (content) => {

    try {
        
        const config = {
            'Content-type': 'application/json',
        }

        const { data } = await axios.post(`${API_URL}/api/page/${content.name}`, content, config);

        return { status: 'Ok', data: data};

    } catch (error) {
        console.log(error);

        return { status: 'Error', data: error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        }
    }

};

export const getContent = async (pageName) => {

    try {
        
        const config = {
            'Content-type': 'application/json',
        }

        const { data } = await axios.get(`${API_URL}/api/page/${pageName}`, config);

        return { status: 'Ok', data: data.value};

    } catch (error) {
        console.log(error);

        return { status: 'Error', data: error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        }
    }

};