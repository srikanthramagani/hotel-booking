import React from 'react'
import Navbar from '../../components/hotelOwner/Navbar'
import Sidebar from '../../components/hotelOwner/Sidebar'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <div className='flex flex-col h-screen'>
        <Navbar/>
        <div className='flex flex-col h-screen'>
            <Sidebar/>
            <div className='flex-1 p-4 pt-10 md:px h-full'>
                <Outlet/>
            </div>
        </div>
    </div>
  )
}

export default Layout