import axios from 'axios';
import { get } from 'svelte/store';
import config from '../config.json';
import { userInfo, statisticsSendRequest } from '../store';

const API_URL = config.SVELTE_ENV === 'dev' ? config.API_URL_DEV : config.SVELTE_ENV === 'preprod' ? config.API_URL_PREPROD : config.SVELTE_ENV === 'production' ? config.API_URL_PROD : config.API_URL_DEV;

export const getStatistics = async (type, target, start, end) => {

    try {

        statisticsSendRequest.set({loading:true, message:'', statistics:null});

        const userInfoStored = get(userInfo);
        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfoStored.token}`
            }
        }

        const { data } = await axios.get(`${API_URL}/api/statistics?type=${type}&target=${target}&start=${start}&end=${end}`, config);
        statisticsSendRequest.set({loading:false, success: true, message:'success', statistics:data});
                
    } catch (error) {
        statisticsSendRequest.set({ loading:false, success: false, message: 'Error fetching statistics ' + error });
    }
};