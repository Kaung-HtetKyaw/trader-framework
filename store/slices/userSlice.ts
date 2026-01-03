import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/types/user';

const initialState: User = {
  id: '',
  organizationID: '',
  firstName: '',
  lastName: '',
  email: '',
  verified: false,
  role: 'user',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => ({ ...action.payload }),
    clearUser: () => initialState,
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
