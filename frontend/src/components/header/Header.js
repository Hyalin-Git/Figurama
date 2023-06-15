import React, { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { UidContext } from "../../utils/AppContext";
import { useDispatch, useSelector } from "react-redux";
import SignOut from "../auth/SignOut";
import CartHeader from "./CartHeader";
import { capitalizeFirstLetter } from "../../utils/capitalizeFirstLetter";
import { getProductsUniverse } from "../../services/actions/productUniverse.action";
import HeaderSearchBar from "./HeaderSearchBar";

const Header = () => {
	let activeLink = { color: "white" };
	const uid = useContext(UidContext);
	const user = useSelector((state) => state.user);
	const [sideBarOpen, setSideBarOpen] = useState(false);
	const [universeSelection, setUniverseSelection] = useState(false);
	const [menu, setMenu] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const universe = useSelector((state) => state.universe);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	useEffect(() => {
		dispatch(getProductsUniverse());

		if (sideBarOpen === true) {
			document.body.style.backgroundColor = "#adadad";
		} else {
			document.body.style.backgroundColor = "#cfcfcf";
		}
	}, [sideBarOpen, dispatch]);
	const uniArray = universe?.data?.universe.map((val) => {
		return val.universe[1];
	});

	function stickyHeader() {
		let header = document.getElementsByTagName("nav")[0];
		let sticky = header.offsetTop;
		if (window.scrollY > sticky) {
			header.classList.add("sticky");
		} else {
			header.classList.remove("sticky");
		}
	}
	window.onscroll = function () {
		stickyHeader();
	};

	function handleSideBar(e) {
		e.preventDefault();
		setSideBarOpen(!sideBarOpen);
		const btn1 = document.getElementsByClassName("btn1")[0];
		btn1.classList.toggle("btn1Anim");

		const btn2 = document.getElementsByClassName("btn2")[0];
		btn2.classList.toggle("btn2Anim");

		const btn3 = document.getElementsByClassName("btn3")[0];
		btn3.classList.toggle("btn3Anim");
	}

	return (
		<header>
			<nav>
				<div className="header-left">
					<NavLink className="link" to={"/"}>
						<div className="logo">
							<div className="sideLine"></div>
							<img
								className="logo__img"
								src="./img/logo/ninja.png"
								alt="logo"
							/>
							<h1>
								F<span>i</span>g<span>u</span>r<span>a</span>m<span>a</span>
							</h1>
							<div className="sideLine"></div>
						</div>
					</NavLink>
					<div
						className="menu-wrapper"
						onClick={(e) => {
							setUniverseSelection(false);
							setMenu(!menu);
						}}>
						<div className="line-container">
							<div className="line1"></div>

							<div className="line2"></div>
							<div className="line3"></div>
						</div>
						<div>
							<p>Nos liscences</p>
						</div>
						{menu && (
							<ul className="menu-selection">
								<li>
									<span onMouseEnter={(e) => setUniverseSelection(true)}>
										{" "}
										Univers <img src="./svg/angle-right.svg" alt="angle" />
									</span>
									{universeSelection && (
										<div
											className="dropdown-item"
											onMouseLeave={(e) => setUniverseSelection(false)}>
											{[...Array(uniArray)].map((elt) => {
												let uniqueArray = [...new Set(elt)].map((uni, idx) => {
													return (
														<div
															key={idx}
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
															}}>
															<p>{capitalizeFirstLetter(uni)}</p>
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
									)}
								</li>
								<NavLink
									className="link"
									style={({ isActive }) => (isActive ? activeLink : undefined)}
									to={`/products?page=1`}>
									<li>Nos figurines</li>
								</NavLink>
							</ul>
						)}
					</div>
					<HeaderSearchBar />
				</div>

				{/* If side bar is not open  */}
				{!sideBarOpen ? (
					<div className="desktop-nav">
						<ul>
							<li></li>
							{uid ? (
								<>
									<li>
										{user.status === "resolved" && (
											<div
												className="nav-dropdown"
												onMouseEnter={(e) => setIsOpen(!isOpen)}
												onMouseLeave={(e) => setIsOpen(!isOpen)}>
												<div
													className={
														isOpen ? "user-info clicked" : "user-info"
													}>
													{user.data.firstName} {user.data.lastName}
													<br />
													<p>{user.data.email}</p>
												</div>

												{isOpen ? (
													<div className="nav-dropdown__content">
														<div className="nav-dropdown__list">
															<div>
																{user.data.isAdmin ? (
																	<NavLink className="link" to={"/dashboard"}>
																		{" "}
																		<p>Tableau de bord</p>{" "}
																	</NavLink>
																) : null}
															</div>
															<div></div>
															<div className="sign-out">
																<SignOut />
															</div>
														</div>
													</div>
												) : null}
											</div>
										)}
									</li>
								</>
							) : (
								<li>
									{" "}
									<NavLink
										className="link"
										style={({ isActive }) =>
											isActive ? activeLink : undefined
										}
										to={"/auth"}>
										S'identifier
									</NavLink>
								</li>
							)}
							<li></li>
							<li>
								<img width="25px" src="./svg/cart.svg" alt="cart" />
							</li>
							{user.status === "resolved" && <CartHeader />}
						</ul>
					</div>
				) : (
					// Side bar open
					<div className="phone-nav">
						<ul>
							<li onClick={handleSideBar}>
								<NavLink
									className="link"
									style={({ isActive }) => (isActive ? activeLink : undefined)}
									to={"/products"}>
									Nos produits
								</NavLink>
							</li>
							<li></li>
							{uid ? (
								<>
									<li onClick={handleSideBar}>
										<SignOut />
									</li>
									<li onClick={handleSideBar}>
										{user.isAdmin ? (
											<NavLink className="link" to={"/dashboard"}>
												{" "}
												<p>Tableau de bord</p>
											</NavLink>
										) : null}
									</li>
									<li>
										<img src="./svg/user-icon.svg" alt="" /> Bonjour,{" "}
										{user.firstName}
									</li>
								</>
							) : (
								<li onClick={handleSideBar}>
									{" "}
									<NavLink
										className="link"
										style={({ isActive }) =>
											isActive ? activeLink : undefined
										}
										to={"/auth"}>
										S'identifier
									</NavLink>
								</li>
							)}
							<li></li>
							{/* <li>
								<img width="25px" src="./svg/cart.svg" alt="cart" />
							</li> */}
							{/* {cart.length === 0 ? null : <Span>{cart}</Span>} */}
						</ul>
					</div>
				)}
				<div className="SideBarBtn" id="openBtn" onClick={handleSideBar}>
					<div className="btn1"></div>
					<div className="btn2"></div>
					<div className="btn3"></div>
				</div>
			</nav>
		</header>
	);
};

export default Header;
