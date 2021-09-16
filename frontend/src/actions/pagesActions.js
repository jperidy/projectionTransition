import axios from 'axios';
//import { API_URL } from '../config/backend_api';
import { get } from 'svelte/store';
import { userInfo, pageRequest } from '../store';
import config from '../config.json';

const API_URL = config.SVELTE_ENV === 'dev' ? config.API_URL_DEV : config.SVELTE_ENV === 'preprod' ? config.API_URL_PREPROD : config.SVELTE_ENV === 'prod' ? config.API_URL_PROD : config.API_URL_DEV;

export const updateOrCreateContent = async (content) => {

    const userInfoStored = get(userInfo);


    pageRequest.set({ content: { content: [], name: content.name }, loading: false, message: '' });

    try {

        const config = {
            headers: {
                'Content-type': 'Application/json',
                Authorization: `Bearer ${userInfoStored.token}`
            }
        };

        const { data } = await axios.post(`${API_URL}/api/page/${content.name}`, content, config);

        pageRequest.set({ content: data.value, loading: false, message: '' });

    } catch (error) {

        pageRequest.set({ content: { content: [], name: content.name }, loading: false, message: 'Error updating page ' + error });

    }

};

export const getContent = async (pageName) => {

    try {
        pageRequest.set({ content: { content: [], name: pageName }, loading: true, message: '' });

        const config = {
            headers: {
                'Content-type': 'application/json',
            }
        }

        const { data } = await axios.get(`${API_URL}/api/page/${pageName}`, config);

        pageRequest.set({ content: data.value, loading: false, message: '' });

    } catch (error) {

        pageRequest.set({ content: { content: [], name: pageName }, loading: false, message: 'Error loading page ' + pageName + ' ' + error });
    }

};