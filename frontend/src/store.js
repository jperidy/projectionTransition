import { writable } from 'svelte/store';

const getInitialUserInfo = () => {
    const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;
    // ADD method to verify validity of token !
    // Complicated because async function > no risk because no modification possible if token corupted
    return userInfo;
};

export const userInfo = writable(getInitialUserInfo());
export const pageName = writable('homePage');
export const pageContent = writable([]);
export const pageContentMessage = writable(null);

export const articleAllRequest = writable({articles:null, loading:false, message:''});
export const articleRequest = writable({article:null, loading:false, message:''});
export const articleCreateRequest = writable({success:false, loading:false, message:''});
export const articleUpdateRequest = writable({success:false, loading:false, message:''});
export const articleDeleteRequest = writable({success:false, loading:false, message:''});