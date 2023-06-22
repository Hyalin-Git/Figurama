import React, { useEffect } from "react";
import { sumArray } from "../../utils/sumPrice";
import { float } from "../../utils/localString";
import axios from "axios";
import PaymentBtn from "./PaymentBtn";

const Recap = ({
	userData,
	userCart,
	setClientSecret,
	shippingInformations,
	paymentBtn,
	query,
	navigate,
}) => {
	const totalPrice = userCart?.data?.cart?.map((products) => {
		return products.productId.price * products.quantity;
	});

	// move the container depending on the scroll postion

	const recap = document.getElementById("recap");

	if (window.innerWidth > 1024) {
		document.addEventListener("scroll", function (e) {
			let scrollPostion = window.scrollY;

			if (recap) {
				recap.style.top = scrollPostion + "px";
			} else {
				return;
			}
		});
	} else {
		window.addEventListener("resize", function (e) {
			if (window.innerWidth <= 1024) {
				return;
			} else {
				document.addEventListener("scroll", function (e) {
					let scrollPostion = window.scrollY;
					console.log(scrollPostion);
					if (recap) {
						recap.style.top = scrollPostion + "px";
					} else {
						return;
					}
				});
			}
		});
	}
	const validateCartFunc = (e) => {
		e.preventDefault();
		query.set("validate", "true");
		navigate(`?${query.toString()}`);
		document
			.getElementsByClassName("shipping-container")[0]
			.classList.remove("locked");
	};

	function proceedToPayment(e) {
		e.preventDefault();

		query.set("proceed_payment", "true");

		navigate(`?${query.toString()}`);

		axios({
			method: "POST",
			url: `${process.env.REACT_APP_API_URL}/api/payment/create-payment-intent`,
			withCredentials: true,
			data: {
				userId: userData?.data?._id,
				email: userData?.data?.email,
				items: userCart?.data?.cart,
				address: shippingInformations.address,
				zip: shippingInformations.zip,
				city: shippingInformations.city,
			},
		})
			.then((res) => {
				setClientSecret(res.data.clientSecret);
			})
			.catch((err) => console.log(err));
		document
			.getElementsByClassName("payment-container")[0]
			.classList.remove("locked");
	}

	return (
		<div className="recap-container" id="recap">
			<div>
				<div className="recap-header">
					<h1>Récapitulatif de la commande</h1>
				</div>
				<div className="recap-content">
					{(query.get("validate") === "true") &
						(userCart?.data?.cart.length > 0) && (
						<div className="recap-list">
							<h2>Votre commande : </h2>
							<ul>
								{userCart?.data?.cart?.map((products) => {
									return (
										<li key={products._id}>
											- {products.productId.name}{" "}
											<span>
												{products.quantity > 1 ? "x" + products.quantity : null}{" "}
											</span>
										</li>
									);
								})}
							</ul>
						</div>
					)}
					<div>
						<p>
							Montant total: <span>{float(sumArray(totalPrice))}</span>{" "}
						</p>
					</div>
				</div>
				<div className="recap-footer">
					{paymentBtn ? (
						<PaymentBtn />
					) : (
						<>
							{query.get("validate") !== "true" ? (
								<button
									className={userCart?.data?.cart.length === 0 ? "locked" : ""}
									disabled={userCart?.data?.cart.length === 0}
									onClick={validateCartFunc}>
									Valider mon panier
								</button>
							) : (
								<>
									{Object.keys(shippingInformations).length !== 0 ? (
										<button onClick={proceedToPayment}>
											Passer au paiement
										</button>
									) : (
										<button className="locked">Passer au paiement</button>
									)}
								</>
							)}
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default Recap;
