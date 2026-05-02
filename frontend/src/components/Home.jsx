import React from 'react'
import { Outlet } from 'react-router-dom'
import Feed from './Feed.jsx'
import useGetAllPost from '../hooks/useGetAllPost.jsx'
import useGetSuggestedUsers from '../hooks/useGetSuggestedUsers.jsx'
import Search from './Search.jsx'


function Home() {
  useGetAllPost();
  useGetSuggestedUsers();
  return (
    <div className='flex'>
      <div className='flex-grow pb-14 md:pb-8'>
        <Feed/>
        <Outlet/>
      </div>
    </div>
  )
}

export default Home;