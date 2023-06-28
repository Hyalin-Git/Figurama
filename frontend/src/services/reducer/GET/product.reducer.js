import { createReducer } from "@reduxjs/toolkit";
import {
	productFetching,
	productRejected,
	productResolved,
} from "../../actions/GET/product.actions";

const initialState = {
	status: "void",
	data: null,
	error: null,
};
export default createReducer(initialState, (builder) => {
	return builder
		.addCase(productFetching, (draft, action) => {
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
		.addCase(productRejected, (draft, action) => {
			draft.error = action.payload;
			draft.status = "rejected";
			return;
		})
		.addCase(productResolved, (draft, action) => {
			draft.data = action.payload;
			draft.status = "resolved";
			return;
		});
});
