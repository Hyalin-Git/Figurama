import { createAction } from "@reduxjs/toolkit";
import axios from "axios";

export const updateCartFetching = createAction("update-cart/fechting");
export const updateCartResolved = "update-cart/resolved";
export const updateCartRejected = "update-cart/rejected";

export const updateCart = (userId, productId, quantity) => {
	return (dispatch, getState) => {
		const status = getState().updateCart.status;
		if (status === "pending" || status === "updating") {
			return;
		}
		dispatch(updateCartFetching());
		return axios({
			method: "PATCH",
			url: `${process.env.REACT_APP_API_URL}/api/user/update-cart/${userId}`,
			withCredentials: true,
			data: {
				productId: productId,
				quantity: quantity,
			},
		})
			.then((res) => {
				return dispatch({ type: updateCartResolved, payload: res.data });
			})
			.catch((err) => {
				console.log(err);
				return dispatch({ type: updateCartRejected, payload: err });
			});
	};
};
