import React from "react";
import { float } from "../../../utils/localString";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

const PopUp = ({ product, modal, setModal }) => {
	const userCart = useSelector((state) => state.userCart);

	const totalProduct = userCart.data.cart.map((item) => {
		// Return the price of all products * the choosen quantity
		return item.quantity;
	});

	const totalPrice = userCart.data.cart.map((item) => {
		// Return the price of all products * the choosen quantity
		return item.productId.price * item.quantity;
	});

	function sumArray(array) {
		let total = 0;

		for (let i = 0; i < array.length; i++) {
			total += array[i];
		}

		return total;
	}

	const btn = document.getElementsByClassName("btn");

	for (let i = 0; i < btn.length; i++) {
		btn[i]?.addEventListener("mouseover", (e) => {
			e.preventDefault();
			btn[i].classList.add("animation-reverse");
		});
	}

	return (
		<>
			<div className={modal ? "backdrop" : ""}></div>
			{modal ? (
				<div id="pop-up-container">
					<div className="pop-up-header">
						<h1>
							<i className="material-icons">check</i> Produit ajouté au panier
							avec succès
						</h1>
						<div className="underline"></div>
					</div>
					<div className="pop-up-wrapper">
						<div className="pop-up-left-row">
							<img src={product.cover} alt="cover" />
							<div className="product-info">
								<h2>{product.name}</h2>
								<p>
									Prix : <span className="price">{float(product.price)}</span>
								</p>
								<p>
									Quantité : <span>1</span>
								</p>
							</div>
							<div className="cart-info"></div>
						</div>

						<div className="pop-up-right-row">
							<h3>Votre panier</h3>
							<div className="underline"></div>
							<p>
								Produits :{" "}
								<span className="totalProduct">{sumArray(totalProduct)}</span>
							</p>
							<p>
								Total : <span>{float(sumArray(totalPrice))}</span>
							</p>
							<div className="btn-container">
								<button
									className="btn"
									onClick={(e) => {
										setModal(!modal);
									}}>
									Continuer mes achats
								</button>
								<NavLink to="/cart">
									<button className="btn">Aller au panier</button>
								</NavLink>
							</div>
						</div>
					</div>
				</div>
			) : null}
		</>
	);
};

export default PopUp;
