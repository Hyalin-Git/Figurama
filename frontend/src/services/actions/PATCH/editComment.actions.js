import { createAction } from "@reduxjs/toolkit";
import axios from "axios";

export const editCommentFetching = createAction("edit-comment/fetching");
export const editCommentResolved = "edit-comment/resolved";
export const editCommentRejected = "edit-comment/rejected";

export const editComment = (productId, commentId, comment) => {
	return (dispatch, getState) => {
		const status = getState().editComment.status;
		if (status === "pending" || status === "updating") {
			return;
		}
		dispatch(editCommentFetching());
		return axios({
			method: "PATCH",
			url: `${process.env.REACT_APP_API_URL}/api/product/edit-comment-product/${productId}`,
			withCredentials: true,
			data: {
				commentId: commentId,
				comment: comment,
			},
		})
			.then((res) => {
				return dispatch({ type: editCommentResolved, payload: res.data });
			})
			.catch((err) => {
				console.log(err);
				return dispatch({ type: editCommentRejected, payload: err });
			});
	};
};
