import axios from 'axios';
import { get } from 'svelte/store';
import { userInfo, pageRequest } from '../store';
import config from '../config.json';

const API_URL = config.SVELTE_ENV === 'dev' ? config.API_URL_DEV : config.SVELTE_ENV === 'preprod' ? config.API_URL_PREPROD : config.SVELTE_ENV === 'production' ? config.API_URL_PROD : config.API_URL_DEV;

export const updateOrCreateContent = async (content) => {

    const userInfoStored = get(userInfo);
    const currentPageRequest = get(pageRequest);

    //pageRequest.set({ content: { content: [], name: content.name }, loading: true, message: '' });
    pageRequest.set({ ...currentPageRequest, loading: true, message: '' });

    try {

        const config = {
            headers: {
                'Content-type': 'Application/json',
                Authorization: `Bearer ${userInfoStored.token}`
            }
        };

        const { data } = await axios.post(`${API_URL}/api/page/${content.name}`, content, config);

        pageRequest.set({ content: JSON.parse(JSON.stringify(data.value)), loading: false, message: '' });
        return { content: data.value, loading: false, message: '' };

    } catch (error) {

        //pageRequest.set({ content: { content: [], name: content.name }, loading: false, message: 'Error updating page ' + error });
        pageRequest.set({ ...currentPageRequest, loading: false, message: 'Error updating page ' + error });
        return { ...currentPageRequest, loading: false, message: 'Error updating page ' + error };
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

        pageRequest.set({ content: JSON.parse(JSON.stringify(data.value)) , loading: false, message: '' });

        //console.log(data.value);
        return { content: data.value, loading: false, message: '' };

    } catch (error) {

        pageRequest.set({ content: { content: [], name: pageName }, loading: false, message: 'Error loading page ' + pageName + ' ' + error });
        return { content: { content: [], name: pageName }, loading: false, message: 'Error loading page ' + pageName + ' ' + error };

    }

};

export const getAllPagesList = async () => {

    const userInfoStored = get(userInfo);

    try {

        const config = {
            headers: {
                'Content-type': 'Application/json',
                Authorization: `Bearer ${userInfoStored.token}`
            }
        };

        const { data } = await axios.get(`${API_URL}/api/page/list`, config);

        return { list: data.value, loading: false, message: '' };

    } catch (error) {

        return { list: [], loading: false, message: 'Error getting pages' };
    }

};