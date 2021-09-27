import{a3 as e,a4 as a}from"./vendor-3fdee985.js";import{b as s,c as t,a as r,u as i,d as n,e as c,f as o}from"./CustomContainer-bc27152c.js";const l=t.API_URL_DEV,g=async(a,t,r,i)=>{n.set({articles:null,loading:!0,message:""});try{const s={headers:{"Content-type":"Application/json"}},{data:c}=await e.get(`${l}/api/article?category=${a}&keyword=${i}&page=${r}&size=${t}`,s);return n.set({articles:c.value,loading:!1,message:""}),{articles:c.value,loading:!1,message:""}}catch(c){return s.set({articles:null,loading:!1,message:"Error loading articles "+a+" "+c}),{articles:null,loading:!1,message:"Error loading articles "+a+" "+c}}},d=async a=>{s.set({article:null,loading:!0,message:""});try{const t={headers:{"Content-type":"Application/json"}},{data:r}=await e.get(`${l}/api/article/${a}`,t);return s.set({article:r.value,loading:!1,message:""}),{article:r.value,loading:!1,message:""}}catch(t){return s.set({article:null,loading:!1,message:"Error loading the article"+t}),{article:null,loading:!1,message:"Error loading the article"+t}}},u=async(s,t)=>{r.set({success:!1,loading:!0,message:""});const n=a(i);try{const a={headers:{"Content-type":"Application/json",Authorization:`Bearer ${n.token}`}},{data:i}=await e.put(`${l}/api/article/${s}`,t,a);r.set({success:!0,loading:!1,message:"Article updated"})}catch(c){r.set({success:!1,loading:!1,message:"Error updating article "+c})}},p=async s=>{c.set({success:!1,loading:!0,message:""});const t=a(i);try{const a={headers:{"Content-type":"Application/json",Authorization:`Bearer ${t.token}`}},{data:r}=await e.post(`${l}/api/article`,s,a);c.set({success:!0,loading:!1,message:"Article updated"})}catch(r){c.set({success:!1,loading:!1,message:"Error updating article "+r})}},m=async s=>{o.set({success:!1,loading:!0,message:""});const t=a(i);try{const a={headers:{"Content-type":"Application/json",Authorization:`Bearer ${t.token}`}},{data:r}=await e.delete(`${l}/api/article/${s}`,a);o.set({success:!0,loading:!1,message:"Article deleted"})}catch(r){o.set({success:!1,loading:!1,message:"Error deleting article "+r})}};export{g as a,p as c,m as d,d as g,u};
