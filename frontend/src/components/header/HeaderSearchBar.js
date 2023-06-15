import React from "react";
import { useNavigate } from "react-router-dom";

const HeaderSearchBar = () => {
	const navigate = useNavigate();
	const handleResearch = (e) => {
		navigate("/products");
	};
	return (
		<form
			action=""
			method="get"
			onSubmit={handleResearch}
			className="search-form">
			<input
				id="search"
				type="text"
				name="search"
				placeholder="Recherchez une figurine..."
			/>
			<button>
				<img className="search-svg" src="./svg/search.svg" alt="search" />
			</button>
		</form>
	);
};

export default HeaderSearchBar;
