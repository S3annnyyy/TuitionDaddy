import { useEffect, useState } from 'react';
import { motion } from 'framer-motion'
import { slideInFromTop } from '../utils/motion';
import { HomeIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';

const UploadResource = () => {
    const [userID, setUserID] = useState<string>('');    
    const [username, setUsername] = useState<string>('');    
    const [educationLevel, setEducationLevel] = useState<string>('Select level');    
    const [thumbnail, setThumbnail] = useState<File | undefined>();
    const [resource, setResource] = useState<File | undefined>();
    const navigate = useNavigate();

    useEffect(() => {
        const username = sessionStorage.getItem('username');
        if (username) {
            setUsername(username);
        }        
    }, [])
    
    const onFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();        
    };
        
  return (
    <section className="bg-gray-50 dark:bg-gray-900 w-screen h-screen align-middle">
        <motion.div 
            variants={slideInFromTop}
            initial="hidden" 
            animate="visible" 
            className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0"
        >                      
            <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-2xl xl:p-0">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                        Upload resource
                    </h1>                   
                    <form onSubmit={onFormSubmit} encType="multipart/form-data">
                        <div className="grid gap-4 sm:grid-cols-6 sm:gap-6">

                            <div className='sm:col-span-3'>
                                <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900">Education Level</label>
                                <select id="category" className="login-form-component" value={educationLevel} onChange={e => setEducationLevel(e.target.value)} required>
                                    <option value="">Select level</option>                                    
                                    <option value="PSLE">Primary</option>
                                    <option value="O-LEVEL">Secondary</option>
                                    <option value="A-LEVEL">Junior College</option>
                                    <option value="IB">International Baccalaureate</option>
                                    <option value="UNIVERSITY">University</option>
                                </select>
                            </div>

                            <div className='sm:col-span-3'>
                                <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900">Price</label>
                                <input type="number" id="price" className="login-form-component" placeholder="2.00" min="0" step={0.01}required />
                            </div>                             

                            <div className='sm:col-span-6'>
                                <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900">Resource description</label>
                                <input type="description" name="description" id="description" className="login-form-component" placeholder="level-subject-syllabus-topic-week"  required />
                            </div>                            

                            <div className='sm:col-span-3'>
                                <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="file_input">Upload thumbnail</label>
                                <input className="login-form-component" id="file_input" type="file" onChange={(e) => setThumbnail(e.target.files?.[0])} required/>
                                <p className="mt-1 text-sm text-gray-500" id="file_input_help">PNG (MIN. 1000x1000px).</p>
                            </div>

                            <div className='sm:col-span-3'>
                                <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="file_input">Upload file</label>
                                <input className="login-form-component" id="file_input" type="file" onChange={(e) => setResource(e.target.files?.[0])} required/>
                                <p className="mt-1 text-sm text-gray-500" id="file_input_help">PDF (MAX. 100MB).</p>
                            </div>                                         
                        </div>

                        <motion.button 
                            type="submit" 
                            className="login-form-button mt-2"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}                           
                        >
                            Upload resource
                        </motion.button>
                        <Link to="/" className="mt-4 mb-6 text-sm font-semibold text-gray-900 flex items-center justify-center">
                            <HomeIcon className="w-6 h-6 mr-2 text-primary" />                            
                        </Link>                        
                    </form>
                </div>
            </div>
        </motion.div>
    </section>
  )
}

export default UploadResource