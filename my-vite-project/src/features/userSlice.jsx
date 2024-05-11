import {createSlice} from "@reduxjs/toolkit";
const initialState={
    user:{
        name:"sonali",
        email:"sonali@gmail.com",
        pic: "",
        uid: ""
    }

};
export const userSlice=createSlice({
    name:'user',
    initialState,
    reducers:{
        updateUser:(state,action)=>{
            const {name,email,pic,uid}=action.payload;
            state.user.name=name;
            state.user.email=email;
            state.user.pic=pic;
            state.user.uid=uid;
        },
        removeUser: (state,action)=>{
            state.user.name="invalid";
            state.user.email="invalid@gmail.com",
            state.user.pic="";
            state.user.uid="";
        },
        getUserDataStart: (state) => {
            state.loading = true;
            state.error = null;
          },
    }
});
export const {updateUser,removeUser,getUserDataStart}=userSlice.actions;
export const selectUserData = (state) => state.user.userData;
export default userSlice.reducer;

  