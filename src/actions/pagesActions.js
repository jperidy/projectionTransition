import axios from 'axios';
import { get } from 'svelte/store';
import { userInfo, pageRequest } from '../store';
import config from '../config.json';

const API_URL = config.API_URL;

export const updateOrCreateContent = async (content) => {

    const userInfoStored = get(userInfo);
    const currentPageRequest = get(pageRequest);

    pageRequest.set({ ...currentPageRequest, loading: true, message: '' });

    try {

        const config = {
            headers: {
                'Content-type': 'Application/json',
                Authorization: `Bearer ${userInfoStored.token}`
            }
        };

        const { data } = await axios.post(`${API_URL}/api/pages`, content, config);

        pageRequest.set({ content: JSON.parse(JSON.stringify(data.value)), loading: false, message: '' });
        return { content: data.value, loading: false, message: '' };

    } catch (error) {

        pageRequest.set({ ...currentPageRequest, loading: false, message: 'Error updating page ' + error });
        return { ...currentPageRequest, loading: false, message: 'Error updating page ' + error };
    }

};

export const updateDisplayState = async (id, displayState) => {
    const userInfoStored = get(userInfo);

    try {

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfoStored.token}`
            }
        }

        const { data } = await axios.put(`${API_URL}/api/pages/${id}`, { display: displayState}, config);

        return { content: data.value, loading: false, message: 'Display state updated' };

    } catch (error) {
        return { content: {}, loading: false, message: 'Error updating display state ' + id + ' ' + error };
    }
}

export const getContent = async (pageName) => {

    try {
        pageRequest.set({ content: { content: [], name: pageName }, loading: true, message: '' });

        const config = {
            headers: {
                'Content-type': 'application/json',
                'accept': 'application/json'
            }
        };

        const { data } = await axios.get(`${API_URL}/api/pages/${pageName}`, config);

        pageRequest.set({ content: JSON.parse(JSON.stringify(data.value)) , loading: false, message: '' });

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

        const { data } = await axios.get(`${API_URL}/api/pages`, config);

        return { list: data.value, loading: false, message: '' };

    } catch (error) {

        return { list: [], loading: false, message: 'Error getting pages' };
    }

};

export const createAPage = async (page) => {

    const userInfoStored = get(userInfo);

    try {

        const config = {
            headers: {
                'Content-type': 'Application/json',
                Authorization: `Bearer ${userInfoStored.token}`
            }
        };

        const { data } = await axios.post(`${API_URL}/api/pages`, page, config);

        return { page: data.value, loading: false, message: '' };

    } catch (error) {

        return { page:[], loading: false, message: 'Error creating page ' + error };

    }

};

export const duplicateAPage = async (pageName) => {

    const userInfoStored = get(userInfo);

    try {

        const config = {
            headers: {
                'Content-type': 'Application/json',
                Authorization: `Bearer ${userInfoStored.token}`
            }
        };

        const { data } = await axios.post(`${API_URL}/api/pages/duplicate`, {pageName}, config);

        return { page: data.value, loading: false, message: '' };

    } catch (error) {

        return { page:[], loading: false, message: 'Error duplicate page ' + error };

    }

};

export const deleteAPage = async (id) => {

    const userInfoStored = get(userInfo);

    try {

        const config = {
            headers: {
                'Content-type': 'Application/json',
                Authorization: `Bearer ${userInfoStored.token}`
            }
        };

        const { data } = await axios.delete(`${API_URL}/api/pages/${id}`, config);

        return { page: data.value, loading: false, message: '' };

    } catch (error) {

        return { page:[], loading: false, message: 'Error creating page ' + error };

    }

};