import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import Home from '../pages/Home'
import Marketplace from '../pages/Marketplace'
import Signup from '../pages/Signup'
import Product from '../pages/Product'
import Class from '../pages/Class'

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { path: "", element: <Home /> },
            { path: "marketplace", element: <Marketplace /> },
            { path: 'marketplace/:productId', element: <Product /> },
            { path: "signup", element: <Signup /> },
            { path: "class", element: <Class /> }

        ]
    }
])