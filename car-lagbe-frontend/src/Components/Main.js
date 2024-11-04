import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import Home from './Body/Home'
import AuthBody from './Authentication/AuthBody'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { authCheck } from '../redux/authactionTypes'
import Logout from './Authentication/Logout'
import AddCar from './CarList/AddCar'
import EditCar from './CarList/EditCar'
import CarDetail from './CarList/CarDetail'
import Profile from './Body/Profile'
import Bookings from './Body/Bookings'
import OwnerBookingCars from './Body/OwnerBookingCars'
import CarList from './CarList/CarList'

const Main = () => {

    const token = useSelector(state => state.token);
    const type = useSelector(state => state.type)
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(authCheck())
    }, [dispatch]);

    return (
        <div>
            <Routes>
                <Route path='/login' element={token === null ? <AuthBody /> : <Navigate to='/' />} />
                {/* Protect routes with a check for token */}
                <Route element={token ? <Home type={type} /> : <Navigate to='/login' />}>
                    <Route path='/' element={<CarList />} /> {/* Default redirect if at home */}
                    <Route path='add-car' element={<AddCar />} />
                    <Route path='edit-car/:carId' element={<EditCar />} />
                    <Route path='details/:carId' element={<CarDetail />} />
                    <Route path='profile' element={<Profile />} />
                    <Route path='Bookings' element={<Bookings />} />
                    <Route path='Bookings-Cars' element={<OwnerBookingCars />} />
                    <Route path='logout' element={<Logout />} />
                </Route>
            </Routes>
        </div>
    )
}

export default Main