import React, { useState } from "react";
import { useQuery } from "../../../utils/urlQuery";
import { useNavigate } from "react-router-dom";

const ResearchBar = () => {
	const [writting, setWritting] = useState(false);
	let query = useQuery();
	const navigate = useNavigate();
	// Research bar logic
	const handleKeyUp = (e) => {
		e.preventDefault();
		let input = e.target.value;

		if (input < 1) {
			return;
		}

		if (e.key === "Enter") {
			query.set("page", "1");
			query.set("search", input);
			navigate(`?${query.toString()}`);
		}
	};
	const handleSearch = (e) => {
		e.preventDefault();
		let value = e.target.value;
		setWritting(true);
		if (value < 1) {
			setWritting(false);
			query.delete("search");
			navigate(`?${query.toString()}`);
		}
	};

	const resetInputValue = (e) => {
		e.preventDefault();
		setWritting(false);
		query.delete("search");
		navigate(`?${query.toString()}`);
		document.getElementById("search").value = "";
	};
	//
	return (
		<>
			<div className="searchContainer">
				<div>
					{writting ? (
						<img
							onClick={resetInputValue}
							className="close-svg"
							src="./svg/close.svg"
							alt="search"
						/>
					) : (
						<img className="search-svg" src="./svg/search.svg" alt="search" />
					)}
				</div>
				<input
					id="search"
					type="text"
					name="search"
					placeholder="Recherchez dans cet univers..."
					onKeyUp={handleKeyUp}
					onChange={handleSearch}
				/>
			</div>
			<div className="underline"></div>
		</>
	);
};

export default ResearchBar;
