import React, {createContext, useContext, useState, useEffect} from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const storedToken = sessionStorage.getItem('jwtToken');
    const [token, setToken] = useState(storedToken);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    const validateToken = async () => {
        if (!token) {
            setIsAuthenticated(false);
            setLoading(false);
            return;
        }

        await axios.post("https://libraryapi-production-b14d.up.railway.app/auth/validate-token", {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((r) => {
            if (r.data) {
                setIsAuthenticated(true);
                setLoading(false);
            } else {
                setIsAuthenticated(false);
                setToken(null);
                sessionStorage.removeItem('jwtToken');
                setLoading(false);
            }
        }).catch((e) => {
            setIsAuthenticated(false);
            setToken(null);
            sessionStorage.removeItem('jwtToken');
            setLoading(false);
        })
    };

    useEffect(() => {
        if (token) {
            validateToken();
        } else {
            setLoading(false);
        }
    }, [token]);

    const login = (newToken) => {
        setToken(newToken);
        setIsAuthenticated(true);
        sessionStorage.setItem('jwtToken', newToken);
    };

    const logout = () => {
        setToken(null);
        setIsAuthenticated(false);
        sessionStorage.removeItem('jwtToken');
    };

    return (
        <AuthContext.Provider value={{isAuthenticated, token, login, logout, loading}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
