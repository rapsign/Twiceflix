import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase/firebase";
import { loginRequest, loginSuccess, loginFailure, logout } from "./authSlice";

export const login = () => async (dispatch) => {
  dispatch(loginRequest());
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    dispatch(loginSuccess(user));
  } catch (error) {
    dispatch(loginFailure(error.message));
  }
};

export const logoutUser = () => async (dispatch) => {
  try {
    await auth.signOut();
    dispatch(logout());
  } catch (error) {
    console.error("Logout Error:", error);
  }
};
