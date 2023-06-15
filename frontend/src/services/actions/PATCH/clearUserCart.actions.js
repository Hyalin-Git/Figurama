import axios from "axios";

export const CLEAR_USER_CART = "clear-user-cart";

export const clearUserCart = (uid) => {
	return (dispatch) => {
		return axios({
			method: "PATCH",
			url: `${process.env.REACT_APP_API_URL}/api/user/delete-all-cart-item/${uid}`,
			withCredentials: true,
		})
			.then((res) => {
				return dispatch({ type: CLEAR_USER_CART, payload: res.data });
			})
			.catch((err) => {
				console.log(err);
			});
	};
};
