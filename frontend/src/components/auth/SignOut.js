import React from "react";
import cookie from "js-cookie";
import axios from "axios";
const SignOut = () => {
	const removeCookie = (key) => {
		if (window !== "undefined") {
			cookie.remove(key, { expires: 1 });
		}
	};

	const logout = async () => {
		await axios({
			method: "GET",
			url: `${process.env.REACT_APP_API_URL}/api/auth/logout`,
			withCredentials: true,
		})
			.then(() => {
				removeCookie("jwt");
			})
			.catch((err) => console.log(err));

		window.location.reload();
	};

	return <p onClick={logout}>Se déconnecter</p>;
};

export default SignOut;
