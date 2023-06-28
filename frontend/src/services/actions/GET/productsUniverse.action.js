import axios from "axios";
import { createAction } from "@reduxjs/toolkit";

export const productsUniverseFetching = createAction(
	"get/products_universe/fetching"
);
export const productsUniverseResolved = "get/products_universe/resolved";
export const productsUniverseRejected = "get/products_universe/rejected";

export const getProductsUniverse = () => {
	return (dispatch, getState) => {
		const status = getState().universe.status;
		if (status === "pending" || status === "updating") {
			return;
		}
		dispatch(productsUniverseFetching());
		return axios({
			method: "GET",
			url: `${process.env.REACT_APP_API_URL}/api/product/get-universe`,
			withCredentials: true,
		})
			.then((res) => {
				return dispatch({ type: productsUniverseResolved, payload: res.data });
			})
			.catch((err) => {
				return dispatch({ type: productsUniverseRejected, payload: err });
			});
	};
};
