import axios from 'axios';
import { API_URL } from '../config/backend_api';
import { get } from 'svelte/store';
import { userInfo } from '../store';


export const updateOrCreateContent = async (content) => {

    const userInfoStored = get(userInfo);

    try {
        
        const config = {
            headers: {
                'Content-type': 'Application/json',
                Authorization: `Bearer ${userInfoStored.token}`
            }
        };

        //const { data } = await axios.post(`${API_URL}/api/page/${content.name}`, content, config);
        const { data } = await axios.post(`${API_URL}/api/pageNew/${content.name}`, content, config);

        return { status: 'Ok', data: data};

    } catch (error) {
        return { status: 'Error', data: error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        }
    }

};

export const getContent = async (pageName) => {

    try {
        
        const config = {
            headers: {
                'Content-type': 'application/json',
            }
        }

        // const { data } = await axios.get(`${API_URL}/api/page/${pageName}`, config);
        const { data } = await axios.get(`${API_URL}/api/pageNew/${pageName}`, config);

        return { status: 'Ok', data: data.value};

    } catch (error) {
        //console.log(error);
        return { status: 'Error', data: error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        }
    }

};