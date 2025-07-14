import React from 'react'
import { Routes, Route } from 'react-router-dom'
import AuthCheck from '../component/AuthCheck'
import Home from '../component/Home'
import DirectMeeting from '../component/DirectMeeting'
import GroupMeeting from '../component/GroupMeeting'
import RoundRobinMeeting from '../component/RoundRobinMeeting'
import Login from '../component/Login'
import Register from '../component/Register'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<AuthCheck />} />
      <Route path="/home" element={<Home />} />
      <Route path="/direct" element={<DirectMeeting />} />
      <Route path="/group" element={<GroupMeeting />} />
      <Route path="/roundrobin" element={<RoundRobinMeeting />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  )
}

export default App