import axios from "axios";
import { createAction } from "@reduxjs/toolkit";

export const productsFetching = createAction("get/products/fetching");
export const productsResolved = "get/products/resolved";
export const productsRejected = "get/products/rejected";

export const getProducts = (
	page,
	search,
	sortByUniverse,
	sortBy,
	sortByName,
	sortByPrice
) => {
	return (dispatch, getState) => {
		const status = getState().products.status;
		if (status === "pending" || status === "updating") {
			return;
		}
		dispatch(productsFetching());
		return axios({
			method: "GET",
			url: `${process.env.REACT_APP_API_URL}/api/product?page=${page}&search=${search}&sortByUniverse=${sortByUniverse}&sortBy=${sortBy}&sortByName=${sortByName}&sortByPrice=${sortByPrice}`,
			withCredentials: true,
		})
			.then((res) => {
				return dispatch({ type: productsResolved, payload: res.data });
			})
			.catch((err) => {
				return dispatch({ type: productsRejected, payload: err });
			});
	};
};

export const ADD_PRODUCT = "ADD_PRODUCT";

export const addProduct = (data) => {
	return (dispatch) => {
		return axios({
			method: "POST",
			url: `${process.env.REACT_APP_API_URL}/api/product/create-product`,
			withCredentials: true,
			data,
		})
			.then((res) => {
				return dispatch({ type: ADD_PRODUCT, payload: res.data });
			})
			.catch((err) => {
				console.log(err);
			});
	};
};
