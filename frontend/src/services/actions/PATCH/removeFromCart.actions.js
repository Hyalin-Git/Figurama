import { createAction } from "@reduxjs/toolkit";
import axios from "axios";

export const removeFromCartFetching = createAction("remove-from-cart/fetching");
export const removeFromCartResolved = "remove-from-cart/resolved";
export const removeFromCartRejected = "remove-from-cart/rejected";

export const removeFromCart = (userId, productId) => {
	return (dispatch, getState) => {
		const status = getState().removeFromCart.status;
		if (status === "pending" || status === "updating") {
			return;
		}
		dispatch(removeFromCartFetching());
		return axios({
			method: "PATCH",
			url: `${process.env.REACT_APP_API_URL}/api/user/delete-cart-item/${userId}`,
			withCredentials: true,
			data: {
				productId: productId,
			},
		})
			.then((res) => {
				return dispatch({ type: removeFromCartResolved, payload: res.data });
			})
			.catch((err) => {
				console.log(err);
				return dispatch({ type: removeFromCartRejected, payload: err });
			});
	};
};
