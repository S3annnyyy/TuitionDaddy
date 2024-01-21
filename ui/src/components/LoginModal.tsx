import { useState } from 'react';
import { motion } from 'framer-motion'
import { dropInFromTop } from '../utils/motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { handleSubmit } from '../utils/loginFunctions';

interface BackdropProps {
    children: React.ReactNode;
    onClick: () => void;
}

interface ModalProps {
    handleClose: () => void;    
}

const Backdrop: React.FC<BackdropProps> = (props) => {    
    return (
        <motion.div 
            onClick={props.onClick}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='absolute top-0 left-0 h-screen w-screen flex items-center justify-center bg-primary-backdrop'>
            {props.children}
        </motion.div>
    )
}

const Modal: React.FC<ModalProps> = (props: ModalProps) => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const onFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const result = handleSubmit(email, password);
        console.log(result)
        // for future authentication & DB connection
    };
  return (
    <Backdrop onClick={props.handleClose}>
        <motion.div
            onClick={(e) => e.stopPropagation()}
            className='modal bg-white'
            variants={dropInFromTop}
            initial="hidden"
            animate="visible"
            exit="exit"
        >            
            <button onClick={props.handleClose} className='absolute right-0 m-5'><XMarkIcon className='h-8 w-8 text-black'/></button>          
           
                <div className="relative w-full my-auto space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900">Sign in to your account</h1>                       
                    <form className="space-y-4 md:space-y-6" onSubmit={onFormSubmit}>
                        <div>
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Your email</label>
                            <input type="email" id="email" className="login-form-component" placeholder="name@company.com" value={email} onChange={e => setEmail(e.target.value)} required/>
                        </div>
                        <div>
                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Password</label>
                            <input type="password" id="password" placeholder="••••••••" className="login-form-component" value={password} onChange={e => setPassword(e.target.value)} required/>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300" required/>
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="remember" className="text-gray-500">Remember me</label>
                                </div>
                            </div>
                            <a href="#" className="text-sm font-medium text-primary-600 hover:underline">Forgot password?</a>
                        </div>
                        <motion.button 
                            type="submit" 
                            className="login-form-button"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}                           
                        >
                            Sign in
                        </motion.button>
                        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                            Don’t have an account yet? <a href="#" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</a>
                        </p>
                    </form>
                </div>
            
        </motion.div>
    </Backdrop>
  )
}

export default Modal