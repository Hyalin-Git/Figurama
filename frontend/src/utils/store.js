import { configureStore } from "@reduxjs/toolkit";
import getUserReducer from "../services/reducer/GET/user.reducer";
import getProductsReducer from "../services/reducer/GET/products.reducer";
import getProductReducer from "../services/reducer/GET/product.reducer";
import getProductUniverseReducer from "../services/reducer/GET/productUniverse.reducer";
import getUserCartReducer from "../services/reducer/GET/userCart.reducer";
import addToCartReducer from "../services/reducer/PATCH/addToCart.reducer";
import updateCart from "../services/reducer/PATCH/updateCart.reducer";
import removeFromCart from "../services/reducer/PATCH/removeFromCart.reducer";
import addCommentReducer from "../services/reducer/PATCH/addComment.reducer";
import editCommentReducer from "../services/reducer/PATCH/editComment.reducer";
import deleteCommentReducer from "../services/reducer/PATCH/deleteComment.reducer";

const store = configureStore({
	reducer: {
		user: getUserReducer,
		userCart: getUserCartReducer,
		products: getProductsReducer,
		universe: getProductUniverseReducer,
		product: getProductReducer,
		addComment: addCommentReducer,
		editComment: editCommentReducer,
		deleteComment: deleteCommentReducer,
		addToCart: addToCartReducer,
		updateCart: updateCart,
		removeFromCart: removeFromCart,
	},
});

export default store;
