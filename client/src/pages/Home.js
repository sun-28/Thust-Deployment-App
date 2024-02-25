import React from 'react'
import {useEffect} from 'react'
import { useNavigate } from 'react-router-dom'


const Home = () => {
  let navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    if (!token) {
      navigate("/auth");
    }
  },[])

  return (
    <div>
      
    </div>
  )
}

export default Home
