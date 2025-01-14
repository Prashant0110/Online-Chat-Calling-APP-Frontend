import { loginRequest, loginSuccess, loginFailure } from "./authSlice";
import authService from "../../services/authService";

export const login = (credentials) => async (dispatch) => {
  dispatch(loginRequest());
  try {
    const data = await authService.login(credentials);
    dispatch(loginSuccess(data));
  } catch (error) {
    dispatch(loginFailure(error.response.data.message));
  }
};
