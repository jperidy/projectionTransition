import axios from 'axios';
import { API_URL } from '../config/backend_api';

export const uploadImage = async(file, imageToDelete) => {
    try {
        
        // const config = {
        //     headers: {
        //         'Content-type': 'application/json'
        //         //Authorization: `Bearer ${userInfo.token}`
        //     }
        // };

        
        await axios.delete(`${API_URL}/api/upload/images/1000x250/${imageToDelete}`);

        const { data } = await axios.post(`${API_URL}/api/upload/images/1000x250`, file);

        console.log(`${API_URL}${data.path}`);
        return { status: 'Ok', data: `${API_URL}${data.path}` };
        
    } catch (error) {
        console.log(error);

        return { status: 'Error', data: error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        }
    }
}