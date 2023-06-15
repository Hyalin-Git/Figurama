import { configureStore } from "@reduxjs/toolkit";
import getUserReducer from "../services/reducer/user.reducer";
import getProductsReducer from "../services/reducer/getProducts.reducer";
import getProductReducer from "../services/reducer/getProduct.reducer";
import getProductUniverseReducer from "../services/reducer/productUniverse.reducer";
import addToCartReducer from "../services/reducer/addToCart.reducer";
import getUserCartReducer from "../services/reducer/userCart.reducer";

const store = configureStore({
	reducer: {
		user: getUserReducer,
		userCart: getUserCartReducer,
		products: getProductsReducer,
		universe: getProductUniverseReducer,
		product: getProductReducer,
		addToCart: addToCartReducer,
	},
});

export default store;
