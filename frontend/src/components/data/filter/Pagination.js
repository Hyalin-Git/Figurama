import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "../../../utils/urlQuery";

const Pagination = ({ page, limit, total }) => {
	const totalPages = Math.ceil(total / limit);

	let query = useQuery();
	const navigate = useNavigate();

	const handlePage = (e) => {
		e.preventDefault();
		query.set("page", e.target.value);
		navigate(`?${query.toString()}`);
	};

	return (
		<div className="page-container">
			{totalPages > 1 &&
				// Create an Array and fill it with totalPage, and then map it,
				// to return every index in the array
				[...Array(totalPages)].map((val, index) => {
					return (
						<button
							id="btn"
							className={page - 1 === index ? "is-active" : "not-active"}
							key={index}
							onClick={handlePage}
							value={index + 1}>
							{index + 1}
						</button>
					);
				})}
		</div>
	);
};

export default Pagination;
