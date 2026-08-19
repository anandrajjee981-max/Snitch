import { register, login, getme, verifyGoogleAuthToken } from "../service/auth.api";
import { authStart, authFailure, authSuccess } from "../auth.slice";
import { useDispatch } from "react-redux";

const useauth = () => {
  const dispatch = useDispatch();

  async function handleGoogleVerify(tokenData) {
    dispatch(authStart());
    try {
      const res = await verifyGoogleAuthToken(tokenData);
      if (res && res.success) {
        if (res.token) {
          localStorage.setItem('authToken', res.token);
        }
        dispatch(authSuccess({ user: res.user ?? null, token: res.token ?? null }));
        return { success: true, user: res.user, token: res.token };
      }
      throw new Error(res?.message || 'Google Authentication failed');
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || 'Google login failed';
      dispatch(authFailure(message));
      return { success: false, error: message };
    }
  }

  async function handleregister(email, password, role, phonenumber, username) {
    dispatch(authStart());
    try {
      const res = await register(email, password, role, phonenumber, username);
      dispatch(authSuccess({ user: res.user ?? null, token: res.token ?? null }));
      return { success: true, res };
    } catch (error) {
      const message = error?.message || 'Registration failed';
      dispatch(authFailure(message));
      return { success: false, error: message };
    }
  }

  async function handlelogin(email, password) {
    dispatch(authStart());
    try {
      const data = await login(email, password);
      dispatch(authSuccess({ user: data.user ?? null, token: data.token ?? null }));
      return { success: true, data };
    } catch (error) {
      const message = error?.message || 'Login failed';
      dispatch(authFailure(message));
      return { success: false, error: message };
    }
  }
  async function handlegetme() {
    dispatch(authStart());
    try {
      const res = await getme();
      dispatch(authSuccess({ user: res?.user ?? null, token: null }));
      return { success: true, user: res?.user ?? null };
    } catch (error) {
      const message = error?.message || 'Session refresh failed';
      dispatch(authFailure(message));
      return { success: false, error: message };
    }
  }

  return { handleregister, handlelogin, handlegetme, handleGoogleVerify };
};

export default useauth;


