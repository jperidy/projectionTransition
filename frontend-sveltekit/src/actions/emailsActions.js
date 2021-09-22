import axios from 'axios';
//import { API_URL } from '../config/backend_api';
import { emailSendRequest } from '../store';
import config from '../config.json';

const API_URL = config.SVELTE_ENV === 'dev' ? config.API_URL_DEV : config.SVELTE_ENV === 'preprod' ? config.API_URL_PREPROD : config.SVELTE_ENV === 'production' ? config.API_URL_PROD : config.API_URL_DEV;

export const sendContactEmail = async (email) => {

    emailSendRequest.set({success:false, loading:true, message:''});

    try {
        
        const config = {
            headers: {
                'Content-type': 'Application/json',
                //Authorization: `Bearer ${userInfoStored.token}`
            }
        };

        const { data } = await axios.post(`${API_URL}/api/emails/contact`, email, config);
        
        emailSendRequest.set({success:true, loading:false, message:'Message envoyé ! Nous revenons vers vous rapidement.'});

    } catch (error) {
        emailSendRequest.set({success:false, loading:false, message:'Error sending email ' + error});
    }
};