import axios from 'axios'

export const getAllResources = async (setPrimaryData:any) => {
    const URL = `${import.meta.env.VITE_RESOURCE_ENDPOINT}/all`
    try {
        const response = await axios.get(URL);   
        setPrimaryData(response.data.data)
        console.log(response.data.data)
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

export const getResourcesByLevel = async (setPrimaryData:any, level:string) => {
    const URL = `${import.meta.env.VITE_RESOURCE_ENDPOINT}/${level}`
    try {
        const response = await axios.get(URL);   
        setPrimaryData(response.data.data)
        console.log(response.data.data)
    } catch (error) {        
        throw error; 
    }
}