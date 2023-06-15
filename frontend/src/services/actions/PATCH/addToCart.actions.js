import { createAction } from "@reduxjs/toolkit";
import axios from "axios";

export const addToCartFetching = createAction("add-to-cart/fetching");
export const addToCartResolved = "add-to-cart/resolved";
export const addToCartRejected = "add-to-cart/rejected";

export const addToCart = (data, userId) => {
	return (dispatch, getState) => {
		const status = getState().addToCart.status;
		if (status === "pending" || status === "updating") {
			return;
		}
		dispatch(addToCartFetching());
		return axios({
			method: "PATCH",
			url: `${process.env.REACT_APP_API_URL}/api/user/add-to-cart/${userId}`,
			withCredentials: true,
			data,
		})
			.then((res) => {
				return dispatch({ type: addToCartResolved, payload: res.data });
			})
			.catch((err) => {
				console.log(err);
				return dispatch({ type: addToCartRejected, payload: err });
			});
	};
};
