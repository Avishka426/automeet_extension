import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from '../component/Home'
import DirectMeeting from '../component/DirectMeeting'
import GroupMeeting from '../component/GroupMeeting'
import RoundRobinMeeting from '../component/RoundRobinMeeting'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/direct" element={<DirectMeeting />} />
      <Route path="/group" element={<GroupMeeting />} />
      <Route path="/roundrobin" element={<RoundRobinMeeting />} />
    </Routes>
  )
}

export default App
