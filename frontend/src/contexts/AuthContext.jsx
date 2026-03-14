import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

// Get API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

// Action types
const AUTH_START = 'AUTH_START';
const AUTH_SUCCESS = 'AUTH_SUCCESS';
const AUTH_FAILURE = 'AUTH_FAILURE';
const LOGOUT = 'LOGOUT';
const REFRESH_TOKEN_SUCCESS = 'REFRESH_TOKEN_SUCCESS';

// Initial state
const initialState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  loading: false,
  error: null
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_START:
      return {
        ...state,
        loading: true,
        error: null
      };
    case AUTH_SUCCESS:
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        error: null
      };
    case AUTH_FAILURE:
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        accessToken: null,
        error: action.payload
      };
    case LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        accessToken: null,
        error: null
      };
    case REFRESH_TOKEN_SUCCESS:
      return {
        ...state,
        accessToken: action.payload.accessToken,
        error: null
      };
    default:
      return state;
  }
};

// Create axios instance with interceptors
const createAxiosInstance = (dispatch) => {
  const instance = axios.create({
    baseURL: `${API_URL}/api`,
    withCredentials: true
  });

  // Request interceptor to add access token
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor to handle token refresh
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const response = await axios.post(
            `${API_URL}/api/auth/refresh`,
            {},
            { withCredentials: true }
          );

          const { accessToken } = response.data;
          localStorage.setItem('accessToken', accessToken);
          
          dispatch({
            type: REFRESH_TOKEN_SUCCESS,
            payload: { accessToken }
          });

          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return instance(originalRequest);
        } catch (refreshError) {
          // Refresh failed, logout user
          dispatch({ type: LOGOUT });
          localStorage.removeItem('accessToken');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const apiRef = React.useRef(null);

  // Initialize axios instance
  useEffect(() => {
    apiRef.current = createAxiosInstance(dispatch);
  }, [dispatch]);

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      // Verify token validity
      apiRef.current.get('/auth/verify')
        .then(response => {
          dispatch({
            type: AUTH_SUCCESS,
            payload: {
              user: response.data.user,
              accessToken: token
            }
          });
        })
        .catch(() => {
          // Token invalid, remove it
          localStorage.removeItem('accessToken');
        });
    }
  }, []);

  const login = async (role, identifier, password) => {
    dispatch({ type: AUTH_START });
    
    try {
      const response = await axios.post(
        `${API_URL}/api/auth/login`,
        { role, identifier, password },
        { withCredentials: true }
      );

      const { user, accessToken } = response.data;
      localStorage.setItem('accessToken', accessToken);

      dispatch({
        type: AUTH_SUCCESS,
        payload: { user, accessToken }
      });

      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || 'Login failed';
      dispatch({
        type: AUTH_FAILURE,
        payload: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await apiRef.current.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      dispatch({ type: LOGOUT });
    }
  };

  const value = {
    ...state,
    api: apiRef.current,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
