import api from '../api'
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants'

import { Navigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import { useState, useEffect } from 'react'

function ProtectedRoute({children}) {
    const [isAuthorized, setIsAuthorized] = useState(null) 

    useEffect(() => {
        // Calls auth function. If error occurs (catch) sets user authentification to false
        auth().catch(() => setIsAuthorized(false))
    }, [])


    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN)

        try {
            // Send request to backend with REFRESH_TOKEN to get new ACCESS_TOKEN (/api/token/refresh)
            const payload = {refresh: refreshToken,};
            const res = await api.post('/api/token/refresh/', payload); // post request (CREATE/UPDATE)
            if (res.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.ACCESS_TOKEN)
                setIsAuthorized(true)
            } else {
                setIsAuthorized(false)
            }
        } catch (error) {
            console.log(error)
            setIsAuthorized(false)
        }
    }


    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN)
        // Checking if Access Token exist in users localstorage
        if (!token) { // Token does not exist, user is not authorized. Navigate them to login
            setIsAuthorized(false)
            return
        }

        // Access Token exist
        // Is the token expired?
        const decoded = jwtDecode(token) // decodes token
        const tokenExpiration = decoded.exp // token expiration
        const now = Date.now() / 1000 // seconds

        // If token is expired refresh the token, else
        // If the token is NOT expired, the user is authorized
        if (tokenExpiration < now) {
            await refreshToken()
        } else {
            setIsAuthorized(true)
        }
    }

    
    if (isAuthorized === null) {
        return <div>Loading...</div>
    }

    return isAuthorized ? children : <Navigate to="/login" />
}

export default ProtectedRoute