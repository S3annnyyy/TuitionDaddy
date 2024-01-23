import './App.css'
import NavBar from './components/NavBar'
import { Outlet, useLocation } from 'react-router' 

function App() {  
   const location = useLocation()

  // Define an array of paths where NavBar should not be displayed
  const pathsWithoutNavBar = ['/signup']

  // Check if the current path is in the array of paths without NavBar
  const showNavBar = !pathsWithoutNavBar.includes(location.pathname)  

  return (
    <>
      {showNavBar && <NavBar />}
      <Outlet />
    </>
  )
}

export default App
