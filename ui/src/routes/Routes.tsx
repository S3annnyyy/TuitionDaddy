import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import Home from '../pages/Home'
import Marketplace from '../pages/Marketplace'
import Signup from '../pages/Signup'
import Product from '../pages/Product'
import Tutors from '../pages/Tutors'
import Tutor from '../pages/Tutor'
import TutorPayment from '../pages/TutorPayment'
import Class from '../pages/Class'
import Quiz from '../pages/Quiz'
import UploadResource from '../pages/UploadResource'
import Cart from '../pages/Cart'

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { path: "", element: <Home /> },
            { path: "signup", element: <Signup /> },
            { path: "marketplace", element: <Marketplace /> },
            { path: 'marketplace/user/uploadresource', element: <UploadResource />},
            { path: 'marketplace/user/cart', element: <Cart />},
            { path: 'marketplace/:itemID', element: <Product /> },            
            { path: "tutors", element: <Tutors /> },
            { path: "tutors/:tutorid", element: <Tutor /> },
            { path: "tutors/payment/:slotid", element: <TutorPayment />},
            { path: "class", element: <Class /> },
            { path: "quiz", element: <Quiz /> }

        ]
    }
])