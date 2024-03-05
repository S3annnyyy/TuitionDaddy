import { motion } from 'framer-motion'
import { slideInFromBottom } from '../utils/motion' 
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAllResources, getResourcesByLevel } from '../utils/mktplaceFunctions'

const selection = [
  { name: "ALL", status: true },
  { name: "PSLE", status: false },
  { name: "O-LEVEL", status: false },
  { name: "N-LEVEL", status: false },
  { name: "A-LEVEL", status: false },
  { name: "IB", status: false },
  { name: "UNIVERSITY", status: false }
]

const ItemCard = (props: {imgSrc: string, itemName: string, itemPrice: number}): JSX.Element => {
  const {imgSrc, itemName, itemPrice} = props
  return (
    <Link to={`/marketplace/placeholderproductID`}>
      <div className="sm:col-span-1 rounded shadow-lg">
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
  const [noData, setNoData] = useState<boolean>(false);

  useEffect(() => {    
    getAllResources(setPrimaryData)    
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
      getAllResources(setPrimaryData)
    } else {
      getResourcesByLevel(setPrimaryData, selectedCategory)
      .then(() => {
        console.log("successfully filtered data by level");
        setNoData(false)       
      })
      .catch(error => {
          console.error('Error fetching data:', error);
          //TODO SET UP SHOW NO RESOURCES
          setPrimaryData([])
          setNoData(true)         
      });
    }
  };  

  return (
    <motion.div 
      variants={slideInFromBottom} 
      initial="hidden" 
      animate="visible"
      className='w-screen h-screen'
    >
      {/* Selection bar   */}
      <section className='flex flex-row justify-center my-5'>
          {selection.map((level, index) => {
            return (
              <button key={index} className={`mx-4 text-sm cursor-pointer ${level.status === true ? 'btn-active' : ''}`} onClick={() => handleCategorySelection(level.name, index)}>{level.name}</button>
            )
          })}
      </section>

      {/* Content portion */}
      <section className='justify-center items-center grid sm:grid-cols-4 sm:gap-4 mx-20'>          
          {noData && <p>No available resources at the level</p>}  
          {primaryData.map((item, index) => {
            return (
              <ItemCard key={index} imgSrc={item.resourceThumbnailURL} itemName={item.resourceName} itemPrice={item.resourcePrice}/>
            )
          })}
      </section>
    </motion.div>
  )
}

export default Marketplace