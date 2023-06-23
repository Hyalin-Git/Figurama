import { configureStore } from "@reduxjs/toolkit";
import getUserReducer from "../services/reducer/user.reducer";
import getProductsReducer from "../services/reducer/getProducts.reducer";
import getProductReducer from "../services/reducer/getProduct.reducer";
import getProductUniverseReducer from "../services/reducer/productUniverse.reducer";
import getUserCartReducer from "../services/reducer/userCart.reducer";
import addToCartReducer from "../services/reducer/addToCart.reducer";
import updateCart from "../services/reducer/PATCH/updateCart.reducer";
import removeFromCart from "../services/reducer/PATCH/removeFromCart.reducer";

const store = configureStore({
	reducer: {
		user: getUserReducer,
		userCart: getUserCartReducer,
		products: getProductsReducer,
		universe: getProductUniverseReducer,
		product: getProductReducer,
		addToCart: addToCartReducer,
		updateCart: updateCart,
		removeFromCart: removeFromCart,
	},
});

export default store;
