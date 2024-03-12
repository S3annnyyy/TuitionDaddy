import { motion } from 'framer-motion'
import { slideInFromBottom } from '../utils/motion' 
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getAllResources, getResourcesByLevel, getCartCount } from '../utils/mktplaceFunctions'
import { DocumentPlusIcon } from "@heroicons/react/24/outline"
import { ShoppingBagIcon } from "@heroicons/react/24/solid"

const selection = [
  { name: "ALL", status: true },
  { name: "PSLE", status: false },
  { name: "O-LEVEL", status: false },
  { name: "N-LEVEL", status: false },
  { name: "A-LEVEL", status: false },
  { name: "IB", status: false },
  { name: "UNIVERSITY", status: false }
]

const ItemCard = (props: {imgSrc: string, itemName: string, itemPrice: number, itemID: string}): JSX.Element => {
  const {imgSrc, itemName, itemPrice, itemID} = props
  return (
    <Link to={`/marketplace/${itemID}`}>
      <div className="sm:col-span-1 rounded shadow-lg mb-5">
      <img className="w-full h-full object-cover" src={imgSrc}/>
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{itemName}</div>
        {itemPrice === 0 ? 
          <button className="px-5 py-1 align-middle text-gray-700 rounded-full bg-green-500">Free</button> : <p className="text-gray-700 text-base">S${itemPrice}</p>  
        }           
      </div>  
    </div>
    </Link>
  )
}

const Marketplace = () => {
  const [category, setCategory] = useState<string>("all")
  const [activeBtnIndex, setActiveBtnIndex] = useState<number>(0)
  const [primaryData, setPrimaryData] = useState<any[]>([]);
  const [noData, setNoData] = useState<boolean>(true);
  const [cartCount, setCount] =useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    setCategory("all")
    setActiveBtnIndex(0)
    getCartCount(setCount)    
    getAllResources(setPrimaryData, setNoData)    
  }, []);    

  const handleCategorySelection = (selectedCategory: string, index: number) => {    
    setCategory(selectedCategory);
    console.log(`Selected ${selectedCategory} category, index: ${index}, Pre category: ${category}`);

    // when selected
    // set prev status to false
    selection[activeBtnIndex]["status"] = false
    // set current index to true
    setActiveBtnIndex(index)
    selection[index]["status"] = true
    // retrieve all the items related to the level    
    if (selectedCategory === "ALL") {
      setNoData(false)
      getAllResources(setPrimaryData, setNoData)
    } else {
      getResourcesByLevel(setPrimaryData, selectedCategory)
      .then(() => {
        console.log("successfully filtered data by level");
        setNoData(false)       
      })
      .catch(error => {
          console.error('Error fetching data:', error);          
          setPrimaryData([])
          setNoData(true)         
      });
    }
  };
  
  const handleUploadResource = () => {
    // check if user is logged in direct to url, else notify user to login
    if (sessionStorage.getItem('username')) {
      navigate('/marketplace/user/uploadresource');
    } else {
      alert("Please login to upload resource 😊")
    }      
  }

  return (
    <motion.div 
      variants={slideInFromBottom} 
      initial="hidden" 
      animate="visible"
      className='w-screen h-screen'
    >
      {/* Selection bar   */}
      <section className='flex flex-row justify-center my-5'>
        <div className='flex flex-row justify-center'>
          {selection.map((level, index) => {
            return (
              <button key={index} className={`mx-4 text-sm cursor-pointer ${level.status === true ? 'btn-active' : ''}`} onClick={() => handleCategorySelection(level.name, index)}>{level.name}</button>
            )
          })}         
          <motion.button className="text-bold cursor-pointer bg-green-400 btn-active flex items-center" onClick={handleUploadResource} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            Upload resource <DocumentPlusIcon className='h-5 w-5 inline align-middle'/>           
          </motion.button>                            
        </div>
        <Link to={`/marketplace/user/cart`} className='absolute right-5'>
          <ShoppingBagIcon className='h-8 w-8 cursor-pointer' />
          <span className="absolute right-0 top-0 rounded-full bg-red-600 w-4 h-4 top right text-white text-xs text-center">{cartCount}</span>                
        </Link>          
      </section>

      {/* Content portion */}
      {noData &&
      <section className='flex justify-center items-center'>
        <motion.div variants={slideInFromBottom} initial="hidden" animate="visible"id="toast-danger" className="flex items-center max-w-md p-4 mb-4 text-gray-500 rounded-lg shadow" role="alert">
          <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg">
              <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z"/>
              </svg>
              <span className="sr-only">Error icon</span>
          </div>
          <div className="ms-3 text-sm font-normal">No resources for sale at this level at this moment.</div>          
        </motion.div>        
      </section>     
      }  
      <section className='justify-center items-center grid sm:grid-cols-4 sm:gap-4 mx-20'>           
          {primaryData.map((item, index) => {
            return (
              <ItemCard key={index} imgSrc={item.resourceThumbnailURL} itemName={item.resourceName} itemPrice={item.resourcePrice} itemID={item.resourceID}/>
            )
          })}
      </section>
    </motion.div>
  )
}

export default Marketplace