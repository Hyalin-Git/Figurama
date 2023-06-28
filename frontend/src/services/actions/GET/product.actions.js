import { createAction } from "@reduxjs/toolkit";
import axios from "axios";

export const productFetching = createAction("get/product/fetching");
export const productResolved = "get/product/resolved";
export const productRejected = "get/product/rejected";

export const getProduct = (id) => {
	return (dispatch, getState) => {
		if (getState.status === "pending" || getState.status === "updating") {
			return;
		}
		dispatch(productFetching());
		return axios({
			method: "GET",
			url: `${process.env.REACT_APP_API_URL}/api/product/${id}`,
			withCredentials: true,
		})
			.then((res) => {
				return dispatch({ type: productResolved, payload: res.data });
			})
			.catch((err) => {
				return dispatch({ type: productRejected, payload: err });
			});
	};
};
