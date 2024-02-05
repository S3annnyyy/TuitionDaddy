import { useState } from 'react';
import { motion } from 'framer-motion'
import { slideInFromTop } from '../utils/motion';
import { PaperAirplaneIcon, HomeIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom'
import { handleSignUp } from '../utils/authFunctions';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [fullname, setFullName] = useState<string>('');
    const [organisation, setOrganisation] = useState<string>('');
    const [educationLevel, setEducationLevel] = useState<string>('Select level');
    const [role, setRole] = useState<string>('');
    const [transcript, setTranscript] = useState<File | undefined>();
    const navigate = useNavigate();
    
    const onFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();       
        const signUpResult = await handleSignUp(email, password, fullname, organisation, educationLevel, role, transcript);   
        if (signUpResult) {               
            navigate('/');
        }
    };
        
  return (
    <section className="bg-gray-50 dark:bg-gray-900 w-screen h-screen align-middle">
        <motion.div 
            variants={slideInFromTop}
            initial="hidden" 
            animate="visible" 
            className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0"
        >           
            <Link to="/" className="flex items-center mb-6 text-2xl font-semibold text-gray-900">
                <PaperAirplaneIcon className="w-8 h-8 mr-2 text-primary" />
                <span>TuitionDaddy</span>
            </Link>
            <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-2xl xl:p-0">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                        Create account
                    </h1>                   
                    <form onSubmit={onFormSubmit} encType="multipart/form-data">
                        <div className="grid gap-4 sm:grid-cols-6 sm:gap-6">

                            <div className='sm:col-span-3'>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Your email</label>
                                <input type="email" name="email" id="email" className="login-form-component" placeholder="name@company.com" value={email} onChange={e => setEmail(e.target.value)} required />
                            </div>
                            <div className='sm:col-span-3'>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Password</label>
                                <input type="password" name="password" id="password" placeholder="••••••••" className="login-form-component" value={password} onChange={e => setPassword(e.target.value)} required/>
                            </div>

                            <div className='sm:col-span-2'>
                                <label htmlFor="fullname" className="block mb-2 text-sm font-medium text-gray-900">Your Full Name</label>
                                <input type="fullname" name="fullname" id="fullname" className="login-form-component" placeholder="Nicholas Tan Chee Hiang" value={fullname} onChange={e => setFullName(e.target.value)} required />
                            </div>
                            <div className='sm:col-span-2'>
                                <label htmlFor="organisation" className="block mb-2 text-sm font-medium text-gray-900">Your Organisation</label>
                                <input type="organisation" name="organisation" id="organisation" className="login-form-component" placeholder="SMU" value={organisation} onChange={e => setOrganisation(e.target.value)} required />
                            </div>                           
                            
                            <div className='sm:col-span-2'>
                                <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900">Your Education Level</label>
                                <select id="category" className="login-form-component" value={educationLevel} onChange={e => setEducationLevel(e.target.value)} required>
                                    <option value="">Select level</option>                                    
                                    <option value="primary">Primary</option>
                                    <option value="secondary">Secondary</option>
                                    <option value="jc">Junior College</option>
                                    <option value="poly">Polytechnic</option>
                                    <option value="uni">University</option>
                                </select>
                            </div>

                            <div className='sm:col-span-2'>
                                <label htmlFor="role" className="block mb-2 text-sm font-medium text-gray-900">Designation</label>
                                <select id="role" className="login-form-component" value={role} onChange={e => setRole(e.target.value)} required>
                                    <option value="">Select Role</option>                                    
                                    <option value="student">Student</option>
                                    <option value="teacher">Teacher</option>
                                    <option value="parent">Parent</option>                                    
                                </select>
                            </div>

                            <div className='sm:col-span-4'>
                                <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="file_input">Upload file</label>
                                <input className="login-form-component" id="file_input" type="file" onChange={(e) => setTranscript(e.target.files?.[0])} required multiple/>
                                <p className="mt-1 text-sm text-gray-500" id="file_input_help">PNG, JPG or PDF (MAX. 800x400px).</p>
                            </div>                                         
                        </div>

                        <motion.button 
                            type="submit" 
                            className="login-form-button mt-2"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}                           
                        >
                            Create an account
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

export default Signup