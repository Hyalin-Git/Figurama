import { createAction } from "@reduxjs/toolkit";
import axios from "axios";

export const deleteCommentFetching = createAction("delete-comment/fetching");
export const deleteCommentResolved = "delete-comment/resolved";
export const deleteCommentRejected = "delete-comment/rejected";

export const deleteComment = (productId, commentId) => {
	return (dispatch, getState) => {
		const status = getState().deleteComment.status;
		if (status === "pending" || status === "updating") {
			return;
		}
		dispatch(deleteCommentFetching());
		return axios({
			method: "PATCH",
			url: `${process.env.REACT_APP_API_URL}/api/product/delete-comment-product/${productId}`,
			withCredentials: true,
			data: {
				commentId: commentId,
			},
		})
			.then((res) => {
				return dispatch({ type: deleteCommentResolved, payload: res.data });
			})
			.catch((err) => {
				console.log(err);
				return dispatch({ type: deleteCommentRejected, payload: err });
			});
	};
};
