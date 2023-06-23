import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { removeFromCart } from "../../services/actions/PATCH/removeFromCart.actions";
import { updateCart } from "../../services/actions/PATCH/updateCart.actions";
import { getUserCart } from "../../services/actions/GET/getUserCart.actions";
import { UidContext } from "../../utils/AppContext";

const Cart = ({ userCart, query }) => {
	const [isLoading, setIsloading] = useState(false);
	const dispatch = useDispatch();

	const uid = useContext(UidContext);

	useEffect(() => {
		if (userCart?.status === "void" || userCart?.status === "pending") {
			setIsloading(true);
		} else {
			setIsloading(false);
		}
	}, [userCart, setIsloading]);

	function deleteFromCart(productId) {
		const productContainerLocked = document.getElementsByClassName(
			"product-container locked"
		)[0];
		if (productContainerLocked) {
			return;
		} else {
			async function updateUserCart() {
				await dispatch(removeFromCart(uid, productId));
				await dispatch(getUserCart(uid));
			}

			updateUserCart();
		}
	}

	function changeQty(productId, productStock) {
		const inputs = document.getElementsByClassName("quantity");
		const input = Array.from(inputs).find(
			(input) => input.dataset.productid === productId
		);

		// Cannot exceed 10
		if (input?.value === "0") {
			input.value = 1;
		}
		if (input?.value > 10) {
			input.value = 10;
		}
		// Cannot exceed the number of products in stock
		if (input?.value > 10 || input?.value > productStock) {
			input.value = productStock;
		}

		async function updateUserCart() {
			await dispatch(updateCart(uid, productId, input?.value));
			await dispatch(getUserCart(uid));
		}

		updateUserCart();
	}

	return (
		<>
			<div className="cart-container">
				<div className="cart-header">
					<h1>Mes achats</h1>
				</div>
				<div
					className={
						query.get("validate") === "true"
							? "product-container locked"
							: "product-container"
					}>
					{isLoading ? (
						<div className="loader-container">
							<div className="lds-ring">
								<div></div>
								<div></div>
								<div></div>
								<div></div>
							</div>
						</div>
					) : (
						<>
							{userCart?.data?.cart.length === 0 && (
								<h2>Votre panier est vide</h2>
							)}
							{userCart?.data?.cart?.map((product, idx) => {
								return (
									<div className="product-list" key={idx}>
										<NavLink
											className="link"
											to={`/product/${product?.productId?._id}`}>
											<img
												className="cover"
												src={product.productId.cover}
												alt="cover"
											/>
										</NavLink>
										<div className="product-name">
											<h2>{product.productId.name}</h2>
											<div className="product-description">
												<p>{product.productId.description}</p>
											</div>
										</div>
										<div className="product-qty">
											<input
												className="quantity"
												data-productid={product.productId._id}
												type="number"
												id="quantity"
												name="quantity"
												min="1"
												max="10"
												defaultValue={product.quantity}
												onChange={(e) => {
													e.preventDefault();
													changeQty(
														product.productId._id,
														product.productId.inStock
													);
												}}
											/>
											<br />
										</div>
										<div className="product-trash">
											<img
												onClick={(e) => {
													e.preventDefault();
													deleteFromCart(product.productId._id);
												}}
												className="trash-img"
												src="./svg/trash.svg"
												alt="trash"
											/>
										</div>
									</div>
								);
							})}
						</>
					)}
				</div>
			</div>
		</>
	);
};

export default Cart;
