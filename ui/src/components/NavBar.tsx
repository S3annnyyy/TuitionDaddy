import { useState } from "react";
import {  PaperAirplaneIcon, MoonIcon, SunIcon, UserIcon, Bars3CenterLeftIcon } from "@heroicons/react/24/outline";
import { Link } from 'react-router-dom'

const navigation = [
  {name: "Home", ref: "/" , active: true},
  {name: "Microservice 1", ref: "/microservice1" , active: false},
  {name: "Microservice 2", ref: "/s2" , active: false},
  {name: "Microservice 3", ref: "/s3" , active: false},
]

const CustomNavLink = (props: { children: string, href: string }): JSX.Element => {
  const { children, href } = props;
  return (
    <div className="group relative h-fit w-fit">
      <Link to={href} className="relative">
        {children}
        <span className="navbar-underline-anim"/>
      </Link>   
    </div>  
  )
}

const LightDarkToggleBtn = ():JSX.Element => {
    const [isDarkTheme, setDarkTheme] = useState(false);
  return (
    <div className="hidden lg:flex items-center gap-2 hover:cursor-pointer" onClick={() => setDarkTheme(!isDarkTheme)}>
      {isDarkTheme ? <MoonIcon className="h-6 w-6" /> : <SunIcon className="h-6 w-6" />}
    </div>
  )
}

const NavBar = () => {
  const [toggleMenu, setToggleMenu] = useState(false);
  return ( 
    <nav>
      <div className="w-screen mx-auto border-b-2 border-b-grey-300">
        <div className="flex justify-between mx-auto w-5/6">
          {/* Primary menu and logo */}
          <div className="flex items-center gap-16 my-5">              
            <div>
              <Link to="/" className="flex gap-1 font-bold text-gray-700 items-center ">
                <PaperAirplaneIcon className="h-6 w-6 text-primary" />
                <span>Logo Here</span>
              </Link>
            </div>
            
            <div className="hidden lg:flex gap-8 ">             
              {navigation.map((item) => {
                return (
                  <CustomNavLink key={item.name} href={item.ref}>{item.name}</CustomNavLink>
                )
              })}
            </div>
          </div>
          {/* secondary */}
          <div className="flex gap-6">
            <div className="hidden md:flex items-center gap-10">
              
              <LightDarkToggleBtn />

              <div>
                <button className="align-middle rounded-full border-solid border-2 border-gray-800 py-2 px-4 hover:outline outline-offset-2 hover:outline-primary">
                  Sign Up<UserIcon className="h-5 w-5 inline"/>                    
                </button>
              </div>
              
            </div>
            {/* Mobile navigation toggle */}
            <div className="lg:hidden flex items-center">
              <button onClick={() => setToggleMenu(!toggleMenu)}>
                <Bars3CenterLeftIcon className="h-6" />
              </button>
            </div>
          </div>

        </div>
      </div>


      
      {/* mobile navigation */}
      <div
        className={`fixed z-40 w-full  bg-gray-100 overflow-hidden flex flex-col lg:hidden gap-12  origin-top duration-700 ${
          !toggleMenu ? "h-0" : "h-full"
        }`}
      >
        <div className="px-8 pt-8">
          <div className="flex flex-col gap-8 font-bold tracking-wider">
            {navigation.map((item) => {
                return (
                  <CustomNavLink key={item.name} href={item.ref}>{item.name}</CustomNavLink>
                )
            })}
          </div>
        </div>
      </div>


    </nav>   
  );
}

export default NavBar