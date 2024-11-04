import * as actionTypes from '../redux/actionTypes';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { message } from 'antd';

const saveTokenDataAndGetUserId = (access, user_type) => {
    const token = jwtDecode(access) //decode the token
    //console.log(token)
    //save token and userid in local storage
    localStorage.setItem('token', access)
    localStorage.setItem('user_id', token.user_id)
    localStorage.setItem('user_type', user_type)
    const expirationTime = new Date(token.exp * 1000) //multiply 1000 casuse get time () in ms and expiresIn is 3600sec
    localStorage.setItem('expiration_time', expirationTime)
    return token.user_id
}
export const authSuccess = (token, userId, user_type) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        payload: {
            token: token,
            userId: userId,
            user_type: user_type,
        }
    }
}

export const authLoading = (isLoading) => {
    return {
        type: actionTypes.AUTH_LOADING,
        payload: isLoading
    }
}

export const auth = (email, password, mode, user_type) => dispatch => {
    dispatch(authLoading(true));

    const authData = {
        email: email,
        password: password,
        user_type: user_type,
    }

    let authUrl = null;
    if (mode === 'SignUp') {
        authUrl = actionTypes.Url + '/account/users/'
        authData['user_type'] = user_type
    }

    else if (mode === 'Login') {
        authUrl = actionTypes.Url + '/account/token/'
    }

    axios.post(authUrl, authData)
        .then(response => {
            dispatch(authLoading(false));
            if (mode === 'SignUp') {
                message.success('Account Created Successfully !!');
            } else {
                message.info('Logged In');
            }

            const user_id = saveTokenDataAndGetUserId(response.data.access, user_type);
            dispatch(authSuccess(response.data.access, user_id, user_type));
        })
        .catch(error => {
            dispatch(authLoading(false));
            console.log(error)

            // Check for network or response errors
            if (error.response && error.response.data) {
                if (typeof error.response.data === 'object') {
                    const key = Object.keys(error.response.data)[0];  // Safe to access Object.keys
                    const errValue = error.response.data[key];
                    message.error(errValue);
                } else {
                    message.error('Server error with unexpected response format.');
                }
            } else if (error.request) {
                message.error('No response received from the server.');
            } else {
                message.error('An error occurred while sending the request.');
            }
        });

}

export const authLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user_id')
    localStorage.removeItem('user_type')
    localStorage.removeItem('expiration_time')

    return {
        type: actionTypes.AUTH_LOGOUT
    }
}

export const authCheck = () => dispatch => {
    const token = localStorage.getItem('token')
    if (!token)
        dispatch(authLogout())
    else {
        const expirationTime = new Date(localStorage.getItem('expiration_time'))
        if (expirationTime <= new Date())
            dispatch(authLogout())
        else {
            const userId = localStorage.getItem('user_id')
            const user_type = localStorage.getItem('user_type')
            dispatch(authSuccess(token, userId, user_type))
        }
    }

}
