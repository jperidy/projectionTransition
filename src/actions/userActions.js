import axios from 'axios';
import { userInfo } from '../store';

export const login = async ({email, password}) => {

    try {

        const config = {
            headers:{
                'Content-type': 'Application/json',
                'Accept': 'Application/json'
            }
        };

        const { data }  = await axios.post(`/api/users/login`, {email: email, password: password}, config);
        
        const userInfo = { ...data };

        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        
        return { status: 'Ok', data: userInfo};

    } catch (error) {
        return { status: 'Error', data: error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        }
    }
};

export const logout = () => {
    localStorage.clear();
    userInfo.set(null);
};

export const verifyLocalToken = async (token) => {
    try {

        const config = {
            headers:{
                'Content-type': 'Application/json',
                Authorization: `Bearer ${token}`
            }
        };

        const { data }  = await axios.post(`/api/users/verify`, {}, config);
        
        return { status: 'Ok', data: data};

    } catch (error) {
        return { status: 'Error', data: error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        }
    }
}