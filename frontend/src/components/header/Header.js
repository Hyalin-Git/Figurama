import React, { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { UidContext } from "../../utils/AppContext";
import { useDispatch, useSelector } from "react-redux";
import SignOut from "../auth/SignOut";
import CartHeader from "./CartHeader";
import { getProductsUniverse } from "../../services/actions/GET/productsUniverse.action";
import HeaderSearchBar from "./HeaderSearchBar";
import UniverseSelection from "./UniverseSelection";

const Header = () => {
	let activeLink = { color: "white" };
	const uid = useContext(UidContext);
	const user = useSelector((state) => state.user);
	const [sideBarOpen, setSideBarOpen] = useState(false);

	const [isOpen, setIsOpen] = useState(false);

	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getProductsUniverse());

		window.addEventListener("resize", function () {
			if (window.innerWidth >= 980) {
				setSideBarOpen(false);
				handleAnimation();
			}
		});
		if (sideBarOpen === true) {
			document.body.style.backgroundColor = "#adadad";
		} else {
			document.body.style.backgroundColor = "#cfcfcf";
		}
	}, [sideBarOpen, dispatch]);

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

	function handleAnimation() {
		const btn1 = document.getElementsByClassName("btn1")[0];
		btn1.classList.toggle("btn1Anim");

		const btn2 = document.getElementsByClassName("btn2")[0];
		btn2.classList.toggle("btn2Anim");

		const btn3 = document.getElementsByClassName("btn3")[0];
		btn3.classList.toggle("btn3Anim");
	}

	function handleSideBar(e) {
		setSideBarOpen(!sideBarOpen);
		handleAnimation();
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

					<UniverseSelection />
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
									<li></li>
									<li>{user.status === "resolved" && <CartHeader />}</li>
								</>
							) : (
								<>
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
								</>
							)}
						</ul>
					</div>
				) : (
					// Side bar open
					<div className="phone-nav">
						{uid ? (
							<>
								<ul>
									<li>{user.status === "resolved" && <CartHeader />}</li>
									<li>Bonjour, {user?.data?.firstName}</li>
									<li onClick={handleSideBar}>
										{user?.data?.isAdmin ? (
											<NavLink className="link" to={"/dashboard"}>
												{" "}
												<p>Tableau de bord</p>
											</NavLink>
										) : null}
									</li>
									<li onClick={handleSideBar}>
										<SignOut />
									</li>
								</ul>
							</>
						) : (
							<li onClick={handleSideBar}>
								{" "}
								<NavLink
									className="link"
									style={({ isActive }) => (isActive ? activeLink : undefined)}
									to={"/auth"}>
									S'identifier
								</NavLink>
							</li>
						)}
						<UniverseSelection
							sideBarOpen={sideBarOpen}
							setSideBarOpen={setSideBarOpen}
							handleSideBar={handleSideBar}
						/>
						<HeaderSearchBar />
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
