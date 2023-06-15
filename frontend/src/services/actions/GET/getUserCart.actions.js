import { createAction } from "@reduxjs/toolkit";
import axios from "axios";

export const getUserCartFetching = createAction("get-user/cart/fecthing");
export const getUserCartRejected = "get-user/cart/rejected";
export const getUserCartResolved = "get-user/cart/resolved";

export const getUserCart = (uid) => {
	return (dispatch, getState) => {
		dispatch(getUserCartFetching());
		return axios({
			method: "GET",
			url: `${process.env.REACT_APP_API_URL}/api/user/get-cart/${uid}`,
			withCredentials: true,
		})
			.then((res) => {
				dispatch({ type: getUserCartResolved, payload: res.data });
			})
			.catch((err) => {
				dispatch({ type: getUserCartRejected, payload: err });
			});
	};
};
