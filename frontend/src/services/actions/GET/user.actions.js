import { createAction } from "@reduxjs/toolkit";
import axios from "axios";

export const getUserFetching = createAction("get/user/fetching");
export const getUserRejected = "get/user/rejected";
export const getUserResolved = "get/user/resolved";

export const getUser = (uid) => {
	return (dispatch, getState) => {
		const status = getState().user.status;
		if (status === "pending" || status === "updating") {
			return;
		}
		dispatch(getUserFetching());
		return axios({
			method: "GET",
			url: `${process.env.REACT_APP_API_URL}/api/user/${uid}`,
			withCredentials: true,
		})
			.then((res) => {
				dispatch({ type: getUserResolved, payload: res.data });
			})
			.catch((err) => {
				dispatch({ type: getUserRejected, payload: err });
			});
	};
};
