import React from "react";
import { sumArray } from "../../utils/sumPrice";
import { float } from "../../utils/localString";
import { useQuery } from "../../utils/urlQuery";
import { useNavigate } from "react-router-dom";

const Recap = ({ userCart, validateCart }) => {
	let query = useQuery();
	const regex = /^(true|false)$/i;
	const navigate = useNavigate();
	const totalPrice = userCart?.data?.cart?.map((products) => {
		return products.productId.price * products.quantity;
	});

	// move the container depending on the scroll postion

	document.addEventListener("scroll", function (e) {
		const recap = document.getElementById("recap");
		if (recap) {
			let scrollPostion = window.scrollY;
			recap.style.top = scrollPostion + "px";
		} else {
			return;
		}
	});

	if (!regex.test(validateCart)) {
		query.set("validate", "true");
		navigate(`?${query.toString()}`);
	}
	function validateCartFunc(e) {
		e.preventDefault();
		query.set("validate", "true");
		if (regex.test(validateCart)) {
			navigate(`?${query.toString()}`);
		} else {
			query.set("validate", "true");
			navigate(`?${query.toString()}`);
		}
	}

	return (
		<div className="recap-container" id="recap">
			<div>
				<div className="recap-header">
					<h1>Récapitulatif de la commande</h1>
				</div>
				<div className="recap-content">
					{validateCart === "true" && (
						<div className="recap-list">
							<h2>Votre commande : </h2>
							<ul>
								{userCart?.data?.cart?.map((products) => {
									return (
										<li>
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
					{validateCart !== "true" ? (
						<button onClick={validateCartFunc}>Valider le panier</button>
					) : (
						<button>Passer au paiement</button>
					)}
				</div>
			</div>
		</div>
	);
};

export default Recap;
