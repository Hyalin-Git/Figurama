import React from "react";
import Dropdown from "../../Dropdown";
import { useQuery } from "../../../utils/urlQuery";
import { useNavigate } from "react-router-dom";

const Sort = () => {
	let query = useQuery();
	const navigate = useNavigate();

	// stock all of the products universe withing a variable

	// filter by date
	function filterByDate(e) {
		e.preventDefault();
		// sortByDate takes the value: asc || desc and set empty strings for others
		query.delete("sortByName");
		query.delete("sortByPrice");
		query.set("sortByDate", e.target.value);
		// Navigate to the new url
		navigate(`?${query.toString()}`);
	}

	// filter by name
	function filterByName(e) {
		e.preventDefault();
		// sortByName takes the value: asc || desc and set empty strings for others
		query.delete("sortByDate");
		query.delete("sortByPrice");
		query.set("sortByName", e.target.value);
		// Navigate to the new url
		navigate(`?${query.toString()}`);
	}

	// filter by price
	function filterByPrice(e) {
		e.preventDefault();
		// sortByPrice takes the value: asc || desc and set empty strings for others
		query.delete("sortByName");
		query.delete("sortByDate");
		query.set("sortByPrice", e.target.value);
		// Navigate to the new url
		navigate(`?${query.toString()}`);
	}

	return (
		<>
			<div className="dropdown">
				<Dropdown
					title={<h3>Trier par date</h3>}
					content={
						<div>
							<button value="asc" onClick={filterByDate}>
								Du - récent au + récent
							</button>
							<button value="desc" onClick={filterByDate}>
								Du + récent au - récent
							</button>
						</div>
					}
				/>
			</div>
			<div className="dropdown">
				<Dropdown
					title={<h3>Trier par nom</h3>}
					content={
						<div>
							<button value="asc" onClick={filterByName}>
								Alphabétique A-Z
							</button>
							<button value="desc" onClick={filterByName}>
								Alphabétique Z-A
							</button>
						</div>
					}
				/>
			</div>
			<div className="dropdown">
				<Dropdown
					title={<h3>Trier par prix</h3>}
					content={
						<div>
							<button value="asc" onClick={filterByPrice}>
								Du - chère au + chère
							</button>
							<button value="desc" onClick={filterByPrice}>
								Du + chère au - chère
							</button>
						</div>
					}
				/>
			</div>
		</>
	);
};

export default Sort;
