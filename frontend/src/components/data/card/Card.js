import React, { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "../../../services/actions/PATCH/addToCart.actions";
import { float } from "../../../utils/localString";
import { UidContext } from "../../../utils/AppContext";
import { getUserCart } from "../../../services/actions/GET/userCart.actions";
import PopUp from "./PopUp";

const Card = ({ product }) => {
	const [modal, setModal] = useState(false);
	const dispatch = useDispatch();
	const user = useSelector((state) => state.user);
	const uid = useContext(UidContext);

	async function addItemToCart(e) {
		e.preventDefault();
		if (uid) {
			const data = new FormData();
			data.append("productId", product._id);
			data.append("quantity", 1);

			await dispatch(addToCart(data, user.data._id));

			dispatch(getUserCart(uid));
			setModal(true);
		} else {
			console.log("auth pls");
		}
	}

	return (
		<>
			<NavLink to={`/product/${product._id}`} className="link">
				<div className="card">
					<img className="hover" src={product.pictures[0]} alt="cover" />
					<img src={product.cover} alt="cover" />
					<h1 className="card__title">{product.name}</h1>
					<div>
						<p>{float(product.price)}</p>
						<button className="card__button" onClick={addItemToCart}>
							Ajouter au panier{" "}
							<img src="./svg/addToCart.svg" alt="addtocart" />
						</button>
					</div>
				</div>
			</NavLink>
			{modal && <PopUp product={product} modal={modal} setModal={setModal} />}
		</>
	);
};

export default Card;
