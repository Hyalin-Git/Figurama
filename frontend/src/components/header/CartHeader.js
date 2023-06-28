import React, { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserCart } from "../../services/actions/GET/userCart.actions";
import { clearUserCart } from "../../services/actions/PATCH/clearUserCart.actions";
import { UidContext } from "../../utils/AppContext";
import { NavLink } from "react-router-dom";
import { float } from "../../utils/localString";
import { sumArray } from "../../utils/sumPrice";

const CartHeader = () => {
	const [openCart, setOpenCart] = useState(false);
	const uid = useContext(UidContext);
	const dispatch = useDispatch();
	const userCart = useSelector((state) => state.userCart);

	const totalProduct = userCart?.data?.cart.map((item) => {
		return item.quantity;
	});

	const totalPrice = userCart?.data?.cart.map((item) => {
		// Return the price of all products * the choosen quantity
		return item?.productId?.price * item?.quantity;
	});

	function handleCart(e) {
		e.preventDefault();
		setOpenCart(!openCart);
	}

	async function clearCart(e) {
		e.preventDefault();
		await dispatch(clearUserCart(uid));

		dispatch(getUserCart(uid));
	}

	return (
		<div className="cart-container">
			<div className="cart" onClick={handleCart}>
				<span>{sumArray(totalProduct)}</span>
			</div>
			{openCart ? (
				<div className="cart-dropdown" onMouseLeave={handleCart}>
					<div className="cart-scroll">
						<div className="product-container">
							{userCart?.data?.cart?.map((product, idx) => {
								return (
									<div className="product-list" key={idx}>
										<div className="product-header">
											<NavLink to={`/products/${product?.productId?._id}`}>
												<img src={product?.productId?.cover} alt="cover" />
											</NavLink>
											<div className="product-name">
												<h2>{product?.productId?.name}</h2>
												<span>x{product?.quantity}</span>
											</div>
										</div>
									</div>
								);
							})}
						</div>
					</div>
					<div className="product-binding">
						<div>
							<div className="info">
								<p>
									Total: <span>{float(sumArray(totalPrice))}</span>
								</p>
								<p>
									Quantité: <span>{sumArray(totalProduct)}</span>
								</p>
							</div>
							<div className="btn">
								<button>Mon panier</button>
								<button onClick={clearCart}>Vider le panier</button>
							</div>
						</div>
					</div>
				</div>
			) : null}
		</div>
	);
};

export default CartHeader;
