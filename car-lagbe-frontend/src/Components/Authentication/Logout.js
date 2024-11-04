import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Navigate } from 'react-router'
import { authLogout } from '../../redux/authactionTypes';

const Logout = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(authLogout());
    }, [dispatch]);

    return (
        <Navigate to='/' />
    )
}

export default Logout