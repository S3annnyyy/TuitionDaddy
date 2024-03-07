import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getResourceByID } from '../utils/mktplaceFunctions'

const Product = () => {
  const { itemID } = useParams();
  const [resourceData, setResourceData] = useState<any[]>([]);
  useEffect(() => {
    if (itemID) {
      getResourceByID(itemID, setResourceData)
      console.log(resourceData)      
    }    
  }, [])
  
  return (
    <div>This is single product page{ itemID }</div>
  )
}

export default Product