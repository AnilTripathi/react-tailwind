import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState, AppDispatch } from '../store';
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from '../store/authSlice';
import { logoutThunk } from '../store/authThunks';
import { useLoginMutation } from '../service/auth';
import { tokenStorage } from '../utils/tokenStorage';
import { persistor } from '../store';
import type { LoginRequest } from '../types/auth';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const authState = useSelector((state: RootState) => state.auth);
  const [loginMutation] = useLoginMutation();

  const login = async (credentials: LoginRequest) => {
    dispatch(loginStart());
    try {
      const result = await loginMutation(credentials).unwrap();
      tokenStorage.setRefreshToken(result.refreshToken);
      dispatch(loginSuccess({ accessToken: result.accessToken }));
      return result;
    } catch (error: unknown) {
      const errorMessage = (error as { data?: { message?: string } })?.data?.message || 'Login failed';
      dispatch(loginFailure(errorMessage));
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutThunk());
      await persistor.purge();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/login');
    }
  };

  return {
    ...authState,
    login,
    logout: handleLogout,
  };
};
