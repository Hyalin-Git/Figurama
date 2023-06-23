import { createReducer } from "@reduxjs/toolkit";
import {
	removeFromCartFetching,
	removeFromCartRejected,
	removeFromCartResolved,
} from "../../actions/PATCH/removeFromCart.actions";

const initialState = {
	status: "void",
	data: null,
	error: null,
};

export default createReducer(initialState, (builder) => {
	return builder
		.addCase(removeFromCartFetching, (draft, action) => {
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
		.addCase(removeFromCartRejected, (draft, action) => {
			if (draft.status === "pending" || draft.status === "updating") {
				draft.error = action.payload;
				draft.status = "rejected";
				return;
			}
		})
		.addCase(removeFromCartResolved, (draft, action) => {
			if (draft.status === "pending" || draft.status === "updating") {
				draft.data = action.payload;
				draft.status = "resolved";
				return;
			}
		});
});
