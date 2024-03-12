import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getResourceByID, addToCart } from '../utils/mktplaceFunctions'
import { slideInFromBottom } from '../utils/motion'

const Product = () => {
  const { itemID } = useParams();
  const [resourceData, setResourceData] = useState<any>({});
  useEffect(() => {
    if (itemID) {
      getResourceByID(itemID, setResourceData)
      console.log(resourceData)      
    }    
  }, [])
  
  return (
    <motion.div 
      variants={slideInFromBottom} 
      initial="hidden" 
      animate="visible"
      className='w-screen h-screen p-4'
    >      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-36 place-content-center">
        <section className=''>
          <div className='bg-slate-300'>
            <img className="" src={resourceData.resourceThumbnailURL}/>
          </div>          
        </section>
          <div className='mt-24'>
            <div className='text-4xl'>{resourceData.resourceName}</div>
            <div className='text-slate-400'>{"Posted by " + resourceData.sellerName}</div>            
            <div className='text-xl font-bold mt-24'>Price: <span className='text-slate-500 font-normal'>S${resourceData.resourcePrice}</span></div>
            <div className='text-xl font-bold'>Resource Description: <span className='text-slate-500 font-normal'>{resourceData.resourceDesc}</span></div>
            <hr className='mt-4 mb-4 mr-10'/>
            <div className='grid grid-cols-subgrid grid-cols-1 md:grid-cols-2 gap-4 mx-10'>
              <motion.button 
                    className="max-w-72 rounded-full border-solid border-2 border-gray-800 py-2 text-white bg-black hover:outline outline-offset-2 hover:outline-black"                  
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                  Purchase                   
              </motion.button>
              <motion.button 
                    className="max-w-72 rounded-full border-solid border-2 border-gray-800 py-2 hover:outline outline-offset-2 hover:outline-primary"                  
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => addToCart(resourceData)}
                  >
                  Add to Cart                    
              </motion.button>
            </div> 
          </div>                          
        <section>

        </section>
      </div>
    </motion.div>
  )
}

export default Product