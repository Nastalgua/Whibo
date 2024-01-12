import { createSlice, createStore, PayloadAction } from "@reduxjs/toolkit"
import { IUser } from "@/types/user"

type InitialState = {
  value: AuthState
}

type AuthState = {
  isAuth: boolean,
  user: IUser | null,
  loaded: boolean
}

const initialState: InitialState = {
  value : {
    isAuth : false,
    user: null,
    loaded: false
  } as AuthState
}

export const auth = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: () => {
      const logout = async () => {
        const res = await fetch("/api/v1/auth/logout/");
        return (await res.json()).logoutSuccess;
      }

      logout();

      return {
        value: {
          loaded: true,
          isAuth: false,
          user: null
        }
      };
    },
    login: (state, action: PayloadAction<IUser>) => {
      return {
        value: {
          isAuth: true,
          user: action.payload,
          loaded: state.value.loaded
        }
      }
    },
    fullyLoaded: (state) => {
      return {
        value: {
          isAuth: state.value.isAuth,
          user: state.value.user,
          loaded: true
        }
      }
    }
  }
});

export const { logout, login, fullyLoaded } = auth.actions;
export default auth.reducer;