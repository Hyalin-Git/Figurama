import React from "react";
import { NavLink } from "react-router-dom";

const Cart = ({ userCart, validateCart }) => {
	return (
		<>
			<div className="cart-container">
				<div className="cart-header">
					<h1>Mes achats</h1>
				</div>
				<div
					className={
						validateCart ? "product-container locked" : "product-container"
					}>
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
									<span>x{product.quantity}</span>
								</div>
								<div className="product-trash">
									<img
										className="trash-img"
										src="./svg/trash.svg"
										alt="trash"
									/>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</>
	);
};

export default Cart;
