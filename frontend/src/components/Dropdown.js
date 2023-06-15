import React, { useState } from "react";

const Dropdown = ({ title, content }) => {
	const [isOpen, setIsOpen] = useState(false);
	setTimeout(() => {
		const dropdown = document.getElementsByClassName("dropdown-content");
		for (let i = 0; i < dropdown.length; i++) {
			dropdown[i].style.animationDuration = "180ms";
		}
		const imgDown = document.getElementsByClassName("down");
		for (let i = 0; i < imgDown.length; i++) {
			imgDown[i].style.animationDuration = "150ms";
		}
	}, 200);

	return (
		<>
			<div
				id="header"
				className="dropdown-header"
				onClick={(e) => setIsOpen(!isOpen)}>
				{title}
				<img
					src="./svg/dropdown.svg"
					className={isOpen ? "up" : "down"}
					alt="arrow"
				/>
			</div>

			<div
				id="content"
				className={isOpen ? "dropdown-content show" : "dropdown-content hide"}>
				{content}
			</div>
		</>
	);
};

export default Dropdown;
