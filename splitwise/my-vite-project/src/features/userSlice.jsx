import {createSlice} from "@reduxjs/toolkit";
const initialState={
    userData:{
        name:"",
        email:"",
        pic: "",
        uid: "",
        groupChats:[{}],
    }

};
export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
      updateUser: (state, action) => {
        const { name, email, pic, uid, groupChats } = action.payload;
        state.userData.name = name;
        state.userData.email = email;
        state.userData.pic = pic;
        state.userData.uid = uid;
        state.userData.groupChats = groupChats;
      },
      removeUser: (state, action) => {
        state.userData.name = "";
        state.userData.email = "";
        state.userData.pic = "";
        state.userData.uid = "";
        state.userData.groupChats = [{}];
      },
      getUserDataStart: (state) => {
        state.loading = true;
        state.error = null;
      },
    },
  });
  
export const {updateUser,removeUser,getUserDataStart}=userSlice.actions;
export const selectUserData = (state) => state.user.userData;
export default userSlice.reducer;