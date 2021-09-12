import axios from 'axios';
import { API_URL } from '../config/backend_api';
import { get } from 'svelte/store';
import { userInfo, pageRequest } from '../store';


export const updateOrCreateContent = async (content) => {

    const userInfoStored = get(userInfo);


    pageRequest.set({content:{content:[], name:content.name}, loading:false, message:''});

    try {
        
        const config = {
            headers: {
                'Content-type': 'Application/json',
                Authorization: `Bearer ${userInfoStored.token}`
            }
        };

        //const { data } = await axios.post(`${API_URL}/api/page/${content.name}`, content, config);
        const { data } = await axios.post(`${API_URL}/api/page/${content.name}`, content, config);
        
        pageRequest.set({content:data.value, loading:false, message:''});
        //pageContent.set(data.value);
        //pageContentMessage.set(null);

        //return { status: 'Ok', data: data};

    } catch (error) {

        pageRequest.set({content:{content:[], name:content.name}, loading:false, message:'Error updating page'});
        
        // pageContent.set([]);
        // pageContentMessage.set({color: 'danger', value: error.response && error.response.data.message
        //     ? error.response.data.message
        //     : error.message});
        // return { status: 'Error', data: error.response && error.response.data.message
        //     ? error.response.data.message
        //     : error.message
        // }
    }

};

export const getContent = async (pageName) => {

    try {

        pageRequest.set({content:{content:[], name:pageName}, loading:true, message:''});
        
        //pageContent.set(null);
        //pageContentMessage.set(null);
        
        const config = {
            headers: {
                'Content-type': 'application/json',
            }
        }

        // const { data } = await axios.get(`${API_URL}/api/page/${pageName}`, config);
        const { data } = await axios.get(`${API_URL}/api/page/${pageName}`, config);
        
        pageRequest.set({content:data.value, loading:false, message:''});
        //pageContent.set(data.value);
        //pageContentMessage.set(null);

        //return { status: 'Ok', data: data.value};

    } catch (error) {

        pageRequest.set({content:{content:[], name:pageName}, loading:false, message:'Error loading page '+ pageName });

        //console.log(error);
        // pageContent.set({name:pageName, content:[]});
        // pageContentMessage.set({color: 'danger', value: error.response && error.response.data.message
        //     ? error.response.data.message
        //     : error.message});

        // return { status: 'Error', data: error.response && error.response.data.message
        //     ? error.response.data.message
        //     : error.message
        // }
    }

};