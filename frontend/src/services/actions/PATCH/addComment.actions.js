import { createAction } from "@reduxjs/toolkit";
import axios from "axios";

export const addCommentFetching = createAction("add-comment/fetching");
export const addCommentResolved = "add-comment/resolved";
export const addCommentRejected = "add-comment/rejected";

export const addComment = (productId, userId, rating, comment) => {
	return (dispatch, getState) => {
		const status = getState().addComment.status;
		if (status === "pending" || status === "updating") {
			return;
		}
		dispatch(addCommentFetching());
		return axios({
			method: "PATCH",
			url: `${process.env.REACT_APP_API_URL}/api/product/add-comment-product/${productId}`,
			withCredentials: true,
			data: {
				commenterId: userId,
				rating: rating,
				comment: comment,
			},
		})
			.then((res) => {
				return dispatch({ type: addCommentResolved, payload: res.data });
			})
			.catch((err) => {
				console.log(err);
				return dispatch({ type: addCommentRejected, payload: err });
			});
	};
};
