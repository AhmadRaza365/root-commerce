import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface AuthState {
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  isAdmin: boolean;
  token: string;
}

const initialState: AuthState = {
  uuid: '',
  email: '',
  firstName: '',
  lastName: '',
  phoneNumber: '',
  isAdmin: false,
  token: '',
};

export const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<AuthState>) => {
      state.uuid = action.payload.uuid;
      state.email = action.payload.email;
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.phoneNumber = action.payload.phoneNumber;
      state.isAdmin = action.payload.isAdmin;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.uuid = '';
      state.email = '';
      state.firstName = '';
      state.lastName = '';
      state.token = '';
      state.phoneNumber = '';
      state.isAdmin = false;
    },
  },
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;
