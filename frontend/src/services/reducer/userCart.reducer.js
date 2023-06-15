import { createReducer } from "@reduxjs/toolkit";
import {
	getUserCartFetching,
	getUserCartRejected,
	getUserCartResolved,
} from "../actions/GET/getUserCart.actions";

const baseState = {
	status: "void",
	data: null,
	error: null,
};

export default createReducer(baseState, (builder) => {
	return builder
		.addCase(getUserCartFetching, (draft, action) => {
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
			}
		})
		.addCase(getUserCartRejected, (draft, action) => {
			if (draft.status === "pending" || draft.status === "updating") {
				draft.error = action.payload;
				draft.status = "rejected";
			}
		})
		.addCase(getUserCartResolved, (draft, action) => {
			if (draft.status === "pending" || draft.status === "updating") {
				draft.data = action.payload;
				draft.status = "resolved";
			}
		});
});
