import React from 'react'
import { BrowserRouter,Route,Routes } from 'react-router-dom'
import App from './Components/App'
import Transaction from './Components/Transaction'
import Overview from './Components/Overview'
 
const AllRoutes = () => {
  return (
    <BrowserRouter>
    <Routes>
        <Route path='/' element={<App/>} />
        <Route path='/transaction' element={<Transaction/>} />
        <Route path='/overview' element={<Overview/>} />
    </Routes>
    </BrowserRouter>
  )
}

export default AllRoutes