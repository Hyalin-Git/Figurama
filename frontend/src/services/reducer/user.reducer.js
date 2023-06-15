import { createReducer } from "@reduxjs/toolkit";

import {
	getUserFetching,
	getUserRejected,
	getUserResolved,
} from "../actions/GET/getUser.actions";

const baseState = {
	status: "void",
	data: null,
	error: null,
};

export default createReducer(baseState, (builder) => {
	return builder
		.addCase(getUserFetching, (draft, action) => {
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
		.addCase(getUserRejected, (draft, action) => {
			if (draft.status === "pending" || draft.status === "updating") {
				draft.error = action.payload;
				draft.status = "rejected";
			}
		})
		.addCase(getUserResolved, (draft, action) => {
			if (draft.status === "pending" || draft.status === "updating") {
				draft.data = action.payload;
				draft.status = "resolved";
			}
		});
});
