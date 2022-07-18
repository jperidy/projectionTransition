import axios from 'axios';
//import { API_URL } from '../config/backend_api';
import { articleAllRequest, articleRequest, articleUpdateRequest, articleCreateRequest, userInfo, articleDeleteRequest } from '../store';
import { get } from 'svelte/store';
import config from '../config.json';

const API_URL = config.API_URL;

export const getAllArticles = async (category, size, page, keyword) => {

    articleAllRequest.set({articles:null, loading:true, message:''});

    try {
        
        const config = {
            headers: {
                'Content-type': 'Application/json',
                //Authorization: `Bearer ${userInfoStored.token}`
            }
        };

        const { data } = await axios.get(`${API_URL}/api/article?category=${category}&keyword=${keyword}&page=${page}&size=${size}`, config);
        
        articleAllRequest.set({articles:data.value, loading:false, message:''});
        return {articles:data.value, loading:false, message:''};

    } catch (error) {
        articleRequest.set({articles:null, loading:false, message:'Error loading articles '+ category + ' ' + error});
        return {articles:null, loading:false, message:'Error loading articles '+ category + ' ' + error};
    }
};


export const getArticle = async (id) => {

    //const userInfoStored = get(userInfo);
    articleRequest.set({article:null, loading:true, message:''});

    try {
        
        const config = {
            headers: {
                'Content-type': 'Application/json',
                //Authorization: `Bearer ${userInfoStored.token}`
            }
        };

        const { data } = await axios.get(`${API_URL}/api/article/${id}`, config);
        
        articleRequest.set({article:data.value, loading:false, message:''});
        return {article:data.value, loading:false, message:''};

    } catch (error) {
        articleRequest.set({article:null, loading:false, message:'Error loading the article' + error});
        return {article:null, loading:false, message:'Error loading the article' + error};
    }
};

export const updateArticleRequest = async (id, article) => {

    articleUpdateRequest.set({success:false, loading:true, message:''});
    const userInfoStored = get(userInfo);

    try {
        
        const config = {
            headers: {
                'Content-type': 'Application/json',
                Authorization: `Bearer ${userInfoStored.token}`
            }
        };

        await axios.put(`${API_URL}/api/article/${id}`, article, config);
        
        articleUpdateRequest.set({success:true, loading:false, message:'Article updated'});

    } catch (error) {
        articleUpdateRequest.set({success:false, loading:false, message:'Error updating article ' + error});
    }
};

export const createArticleRequest = async (article) => {

    articleCreateRequest.set({success:false, loading:true, message:''});
    const userInfoStored = get(userInfo);

    try {
        
        const config = {
            headers: {
                'Content-type': 'Application/json',
                Authorization: `Bearer ${userInfoStored.token}`
            }
        };

        await axios.post(`${API_URL}/api/article`, article, config);
        
        articleCreateRequest.set({success:true, loading:false, message:'Article updated'});

    } catch (error) {
        articleCreateRequest.set({success:false, loading:false, message:'Error updating article ' + error});
    }
};

export const deleteArticleRequest = async (id) => {

    articleDeleteRequest.set({success:false, loading:true, message:''});
    const userInfoStored = get(userInfo);

    try {
        
        const config = {
            headers: {
                'Content-type': 'Application/json',
                Authorization: `Bearer ${userInfoStored.token}`
            }
        };

        await axios.delete(`${API_URL}/api/article/${id}`, config);
        
        articleDeleteRequest.set({success:true, loading:false, message:'Article deleted'});

    } catch (error) {
        articleDeleteRequest.set({success:false, loading:false, message:'Error deleting article ' + error});
    }
};