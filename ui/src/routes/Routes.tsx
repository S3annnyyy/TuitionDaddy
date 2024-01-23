import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import Home from '../pages/Home'
import Ms1 from '../pages/Ms1'
import Signup from '../pages/Signup'

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {path: "", element: <Home />},
            {path: "microservice1", element: <Ms1 />},
            {path: "signup", element: <Signup />}
        ]
    }
])