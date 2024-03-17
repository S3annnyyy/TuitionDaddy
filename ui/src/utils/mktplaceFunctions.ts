import axios from 'axios'
import { resourceDataType, formattedResult, formattedResource, urlLinksDataType } from './types';

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
    const URL = `${import.meta.env.VITE_USER_ENDPOINT}/userinfo`
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
    const URL = `${import.meta.env.VITE_RESOURCE_ENDPOINT}/user/upload`
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

export function getCartCount(setCount: React.Dispatch<React.SetStateAction<number>>) {
    const cartCount = sessionStorage.getItem("cartCount");
    
    if (cartCount !== null) {
      setCount(parseInt(cartCount, 10));
    } else {
      setCount(0);
    }
  }

export function addToCart(rData:resourceDataType) {
    console.log(`Added to cart: ${rData.resourceID}`)
    const storageKey = "cart";

    const existingData = sessionStorage.getItem(storageKey);

    if (existingData) {
        // If data exists, parse it as an array of Resource objects
        const resourceArray: resourceDataType[] = JSON.parse(existingData);

        // Check if rData already exists in the array
        const isDuplicate = resourceArray.some((item) => item.resourceID === rData.resourceID);

        if (isDuplicate) {
            // If rData already exists, display an alert and return
            alert("This item is already in the cart!");
        return;
        }

        // Append the new resource object to the array
        resourceArray.push(rData);

        // Store the updated array back in sessionStorage
        sessionStorage.setItem(storageKey, JSON.stringify(resourceArray));
        alert(`${rData.resourceName} added to cart!`)       
    } else {
        // If no data exists, create a new array with the resource object
        const newResourceArray: resourceDataType[] = [rData];

        // Store the new array in sessionStorage
        sessionStorage.setItem(storageKey, JSON.stringify(newResourceArray));
        alert(`${rData.resourceName} added to cart!`) 
    }

    const cartCountKey = "cartCount";
    const cartCount = sessionStorage.getItem(cartCountKey);

    if (cartCount !== null) {
        // If cartCount exists, parse it as a number and increment by one
        const count = parseInt(cartCount, 10);
        sessionStorage.setItem(cartCountKey, (count + 1).toString());
    } else {
        // If cartCount doesn't exist, initialize it to 1
        sessionStorage.setItem(cartCountKey, "1");
    }
}

export function removeItemFromCart(resourceID: string) {
    const storageKey = "cart";
    const storedCartItems = sessionStorage.getItem(storageKey);
  
    if (storedCartItems) {
      let cartItems: any[] = JSON.parse(storedCartItems);
      cartItems = cartItems.filter((item) => item.resourceID !== resourceID);
      alert(`Item removed from cart`)
      sessionStorage.setItem(storageKey, JSON.stringify(cartItems));

      // update cartCount
      const cartCount = sessionStorage.getItem("cartCount");
      if (cartCount !== null) {
        const count = parseInt(cartCount, 10);
        sessionStorage.setItem("cartCount", (count - 1).toString());
      }      
    }
}

export function formatResources(resources: resourceDataType[]): formattedResult {
    const result: formattedResult = {};
  
    for (const resource of resources) {
      const { sellerID, sellerName, resourceID, resourceName, resourcePrice } = resource;
  
      if (!result[sellerID]) {
        result[sellerID] = {
          sellerName,
          totalCost: 0,
          resources: [],
        };
      }
  
      result[sellerID].totalCost += resourcePrice;
      result[sellerID].resources.push({ resourceID, resourceName, resourcePrice });
    }
  
    return result;
}

export const purchaseStudyResource = async (sellerID:string, price: number, resources: formattedResource[], paymentMethodID:string, desc:string, buyerID:string) => {
    const URL = `${import.meta.env.VITE_PURCHASERESOURCE_ENDPOINT}`       

    console.log(sellerID, price, resources, paymentMethodID, desc, buyerID)
    // call complex MS to purchase study resource
    // return true if successful signup else false
    const purchaseData = {
        "Description": desc,
        "PaymentMethodID": paymentMethodID,
        "Price": price,
        "SellerID": sellerID,        
        "UserID": buyerID,
        "Resources": resources
    }

    try {
        const response = await axios.post(URL, purchaseData, {
        headers: {
            'Content-Type': 'application/json',
        },
        })
        console.log(response)
        return response
    } catch (error: unknown) {
        console.log(`uploadresource catch error: ${error}`)
        return false
    } 
    
}

export const storePurchasedResources = async (resource: urlLinksDataType, userID: string) => {
    const URL = `${import.meta.env.VITE_USER_ENDPOINT}/users/${userID}/resource-links`
    try {
        const response = await axios.post(URL, resource, {
        headers: {
            'Content-Type': 'application/json',
        },
        })
        console.log(response)
        return response
    } catch (error: unknown) {
        console.log(`store purchased resource catch error: ${error}`)
        return false
    } 
}

export const getPurchasedResources = async (userID: string) => {
    const URL = `${import.meta.env.VITE_USER_ENDPOINT}/users/${userID}/resource-links`
    try {
        const response = await axios.get(URL)
        console.log(response)
        return response
    } catch (error: unknown) {
        console.log(`store purchased resource catch error: ${error}`)        
    } 
}