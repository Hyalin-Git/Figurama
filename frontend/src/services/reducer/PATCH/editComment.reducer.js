import { createReducer } from "@reduxjs/toolkit";
import {
	editCommentFetching,
	editCommentRejected,
	editCommentResolved,
} from "../../actions/PATCH/editComment.actions";

const initialState = {
	status: "void",
	data: null,
	error: null,
};

export default createReducer(initialState, (builder) => {
	return builder
		.addCase(editCommentFetching, (draft, action) => {
			if (draft.status === "void") {
				draft.status = "pending";
				return;
			}
			if (draft.status === "rejected") {
				draft.error = null;
				draft.status = "pending";
				return;
			}
			if (draft.status === "resolved") {
				draft.status = "updating";
				return;
			}
		})
		.addCase(editCommentRejected, (draft, action) => {
			if (draft.status === "pending" || draft.status === "updating") {
				draft.error = action.payload;
				draft.status = "rejected";
				return;
			}
		})
		.addCase(editCommentResolved, (draft, action) => {
			if (draft.status === "pending" || draft.status === "updating") {
				draft.data = action.payload;
				draft.status = "resolved";
				return;
			}
		});
});
