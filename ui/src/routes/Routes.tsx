import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import Home from '../pages/Home'
import Marketplace from '../pages/Marketplace'
import Signup from '../pages/Signup'
import Product from '../pages/Product'
import Tutors from '../pages/Tutors'
import Class from '../pages/Class'
import Quiz from '../pages/Quiz'

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { path: "", element: <Home /> },
            { path: "signup", element: <Signup /> },
            { path: "marketplace", element: <Marketplace /> },
            { path: 'marketplace/:productId', element: <Product /> },
            { path: "tutors", element: <Tutors /> },
            { path: "class", element: <Class /> },
            { path: "quiz", element: <Quiz /> }

        ]
    }
])