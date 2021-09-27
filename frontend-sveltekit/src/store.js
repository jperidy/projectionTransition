import { writable } from 'svelte/store';
import { browser } from "$app/env";

const getInitialUserInfo = () => {
    const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;
    // ADD method to verify validity of token !
    // Complicated because async function > no risk because no modification possible if token corupted
    return userInfo;
};

export const userInfo = writable(browser ? getInitialUserInfo() : '');

export const pageRequest = writable({content:{content:[], name:''}, loading: false, message: ''});

export const pageName = writable('homePage');

export const articleRequest = writable({article:null, loading:false, message:''});
export const articleUpdateRequest = writable({success:false, loading:false, message:''});
export const articleAllRequest = writable({articles:null, loading:false, message:''});
export const articleCreateRequest = writable({success:false, loading:false, message:''});
export const articleDeleteRequest = writable({success:false, loading:false, message:''});

export const filmRequest = writable({film:null, loading:false, message:''});
export const filmUpdateRequest = writable({success:false, loading:false, message:''});
export const filmAllRequest = writable({films:null, loading:false, message:''});
export const filmCreateRequest = writable({success:false, loading:false, message:''});
export const filmDeleteRequest = writable({success:false, loading:false, message:''});

export const emailSendRequest = writable({success:false, loading:false, message:''});
