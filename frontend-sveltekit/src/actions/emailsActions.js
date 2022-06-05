import axios from 'axios';
import { emailSendRequest } from '../store';

export const sendContactEmail = async (email) => {

    emailSendRequest.set({success:false, loading:true, message:''});

    try {
        
        const config = {
            headers: {
                'Content-type': 'Application/json',
            }
        };

        await axios.post(`/api/emails`, email, config);
        
        emailSendRequest.set({success:true, loading:false, message:'Message envoyé ! Nous revenons vers vous rapidement.'});

    } catch (error) {
        emailSendRequest.set({success:false, loading:false, message:'Error sending email ' + error});
    }
};