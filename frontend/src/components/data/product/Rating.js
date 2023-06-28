import React from "react";

const Rating = ({ ratings }) => {
	function fillStars(maxRating, rating) {
		// Filling a new array with a max rating (5) then mapping through it
		let stars = new Array(maxRating).fill(0).map((e, i) => {
			// if index is less than rating then add "colored"
			return (
				<img
					className={i < rating ? "colored" : ""}
					src="./svg/stars.svg"
					alt="stars"
					key={i}
				/>
			);
		});

		return stars;
	}
	return <span className="stars">{fillStars(5, Math.round(ratings))}</span>;
};

export default Rating;
