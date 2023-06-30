import React, { useState } from "react";
import { useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { capitalizeFirstLetter } from "../../utils/capitalizeFirstLetter";

const UniverseSelection = ({ sideBarOpen, setSideBarOpen, handleSideBar }) => {
	let activeLink = { color: "white" };
	const universe = useSelector((state) => state.universe);
	const [universeSelection, setUniverseSelection] = useState(false);
	const [menu, setMenu] = useState(false);
	const navigate = useNavigate();

	const uniArray = universe?.data?.universe.map((val) => {
		return val.universe[1];
	});

	return (
		<div className="menu-wrapper">
			<div
				onClick={(e) => {
					setMenu(!menu);
				}}
				className="menu-button">
				<div className="line-container">
					<div className="line1"></div>
					<div className="line2"></div>
					<div className="line3"></div>
				</div>
				<div>
					<p>Nos liscences</p>
				</div>
			</div>
			{menu && (
				<ul className="menu-selection">
					<li>
						<span
							onClick={(e) => {
								setUniverseSelection(true);
							}}>
							{" "}
							Univers <img src="./svg/angle-right.svg" alt="angle" />
						</span>
						{universeSelection && (
							<>
								<div
									className="dropdown-item"
									onMouseLeave={(e) => setUniverseSelection(false)}>
									<div
										className="close-dropdown"
										onClick={(e) => setUniverseSelection(!universeSelection)}>
										<img className="close" src="./svg/close.svg" alt="close" />
									</div>
									{[...Array(uniArray)].map((elt) => {
										let uniqueArray = [...new Set(elt)].map((uni, idx) => {
											return (
												<div key={idx}>
													<p
														onClick={(e) => {
															navigate(
																`/products/${
																	e.target.innerHTML.includes("/")
																		? encodeURIComponent(
																				e.target.innerHTML.toLowerCase()
																		  )
																		: e.target.innerHTML.toLowerCase()
																}`
															);
															if (sideBarOpen === true) {
																handleSideBar();
															}
														}}>
														{capitalizeFirstLetter(uni)}
													</p>
												</div>
											);
										});

										return uniqueArray.sort((a, b) =>
											a.props.children.props.children.localeCompare(
												b.props.children.props.children
											)
										);
									})}
								</div>
							</>
						)}
					</li>
					<NavLink
						className="link"
						style={({ isActive }) => (isActive ? activeLink : undefined)}
						to={`/products?page=1`}>
						<li onClick={() => handleSideBar()}>Nos figurines</li>
					</NavLink>
				</ul>
			)}
		</div>
	);
};

export default UniverseSelection;
