import axios from 'axios'

export const getAllResources = async (setPrimaryData:any, setNoData:any) => {
    const URL = `${import.meta.env.VITE_RESOURCE_ENDPOINT}/all`
    try {
        const response = await axios.get(URL);
        setNoData(false)   
        setPrimaryData(response.data.data)
        console.log(response.data.data)
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

export const getResourcesByLevel = async (setPrimaryData:any, level:string) => {
    const URL = `${import.meta.env.VITE_RESOURCE_ENDPOINT}/level/${level}`
    try {
        const response = await axios.get(URL);   
        setPrimaryData(response.data.data)
        console.log(response.data.data)
    } catch (error) {        
        throw error; 
    }
}

export const getResourceByID = async (resourceID: string, setResourceData: any) => {
    const URL = `${import.meta.env.VITE_RESOURCE_ENDPOINT}/${resourceID}`
    try {
        const response = await axios.get(URL);
        setResourceData(response.data.data)
        console.log(response.data.data)        
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

export const getUserInfo = async (setUserInfo: any) => {
    const URL = `${import.meta.env.VITE_AUTH_ENDPOINT}/userinfo`
    const token = sessionStorage.getItem('token')   
    console.log(token)
    const config = {
        withCredentials: true,
        headers: {
            'Authorization': `Bearer ${token}`,
        }        
    }    
    try {
        const response = await axios.get(URL, config)
        setUserInfo(response.data.response)
    } catch (error) {
        console.error('Error retrieving user info:', error);
    }
}

export const uploadResource = async (ID:string, username:string, price:number, resource:File, thumbnail:File, desc:string, level:string) => {
    const URL = `${import.meta.env.VITE_RESOURCE_ENDPOINT}/upload`
    const formData = new FormData();
    formData.append("resource", resource);
    formData.append("thumbnail", thumbnail);
    formData.append("description", desc);
    formData.append("price", price.toString());
    formData.append("username", username);
    formData.append("userID", ID);
    formData.append("level", level);     

    // call endpoint to upload and store resource
    // return true if successful signup else false
    try {
        const response = await axios.post(URL, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        })
        console.log(response)
        return true
    } catch (error: unknown) {
        console.log(`uploadresource catch error: ${error}`)
        return false
    } 
}