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
export const articles = writable([{
    title: {values:[], styles:[]},
    image: {values:[], styles:[]},
    date: (new Date(Date.now())).toISOString().substring(0,10),
}]);