import { motion } from 'framer-motion'
import { slideInFromBottom } from '../utils/motion' 
import { useState } from 'react'
import { Link } from 'react-router-dom'

const primaryData = [
  { imgSrc: 'https://contents.sixshop.com/thumbnails/uploadedFiles/225377/product/image_1706076925053_1000.jpg', name: 'Product 1', price: 12.94 },
  { imgSrc: 'https://contents.sixshop.com/thumbnails/uploadedFiles/225377/product/image_1706076925053_1000.jpg', name: 'Product 2', price: 92.45 },
  { imgSrc: 'https://contents.sixshop.com/thumbnails/uploadedFiles/225377/product/image_1706076925053_1000.jpg', name: 'Product 3', price: 0 },
  { imgSrc: 'https://contents.sixshop.com/thumbnails/uploadedFiles/225377/product/image_1706076925053_1000.jpg', name: 'Product 4', price: 47.60 },
  { imgSrc: 'https://contents.sixshop.com/thumbnails/uploadedFiles/225377/product/image_1706076925053_1000.jpg', name: 'Product 5', price: 15.37 },
  { imgSrc: 'https://contents.sixshop.com/thumbnails/uploadedFiles/225377/product/image_1706076925053_1000.jpg', name: 'Product 6', price: 0 },
  { imgSrc: 'https://contents.sixshop.com/thumbnails/uploadedFiles/225377/product/image_1706076925053_1000.jpg', name: 'Product 7', price: 0 },
  { imgSrc: 'https://contents.sixshop.com/thumbnails/uploadedFiles/225377/product/image_1706076925053_1000.jpg', name: 'Product 8', price: 5.13 },
  { imgSrc: 'https://contents.sixshop.com/thumbnails/uploadedFiles/225377/product/image_1706076925053_1000.jpg', name: 'Product 9', price: 33.26 },
  { imgSrc: 'https://contents.sixshop.com/thumbnails/uploadedFiles/225377/product/image_1706076925053_1000.jpg', name: 'Product 10', price: 41.68 },
  { imgSrc: 'https://contents.sixshop.com/thumbnails/uploadedFiles/225377/product/image_1706076925053_1000.jpg', name: 'Product 11', price: 60.92 }
]

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

  const handleCategorySelection = (selectedCategory: string, index: number) => {    
    setCategory(selectedCategory);
    console.log(`Selected ${selectedCategory} category, index: ${index}`);

    // when selected
    // set prev status to false
    selection[activeBtnIndex]["status"] = false
    // set current index to true
    setActiveBtnIndex(index)
    selection[index]["status"] = true
    // once DB set up import function here to retrieve all the items related to the level
    // TODO
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
          {primaryData.map((item, index) => {
            return (
              <ItemCard key={index} imgSrc={item.imgSrc} itemName={item.name} itemPrice={item.price}/>
            )
          })}
      </section>
    </motion.div>
  )
}

export default Marketplace