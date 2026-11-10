export const setToken=(token)=>{
    localStorage.setItem("access",token.access);
    localStorage.setItem("refresh",token.refresh);
}
export const getToken=()=>localStorage.getItem("access");
export const getRefreshToken=()=>localStorage.getItem("refresh");
export const removeToken=()=>localStorage.removeItem("access");
export const removeRefreshToken=()=>localStorage.removeItem("refresh");

export const authFetch =(url,options={})=>{
    const access=getToken();

    const headers={
        ...options.headers
    }

    if(access){
        headers["Authorization"]=`Bearer ${access}`;
    }

    // todo:authFetch a first url ashbe, options thakle ager options a ja ase ta set hobe, na thakle {} 
    return fetch(url,{...options,headers});
}
export const logout=()=>{
    removeToken();
    removeRefreshToken();
    alert("Logout successful!");
}