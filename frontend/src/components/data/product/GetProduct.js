import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProduct } from "../../../services/actions/GET/product.actions";
import { getProducts } from "../../../services/actions/GET/products.actions";
import { float } from "../../../utils/localString";
import { capitalizeFirstLetter } from "../../../utils/capitalizeFirstLetter";
import { UidContext } from "../../../utils/AppContext";
import { addToCart } from "../../../services/actions/PATCH/addToCart.actions";
import { getUserCart } from "../../../services/actions/GET/userCart.actions";
import Comment from "./comments/Comment";
import Card from "../card/Card";
import Rating from "./Rating";
const GetProduct = () => {
	const { id } = useParams();
	const uid = useContext(UidContext);
	const dispatch = useDispatch();
	const [index, setIndex] = useState(0);
	const product = useSelector((state) => state.product);
	const products = useSelector((state) => state.products);
	const user = useSelector((state) => state.user);
	const isLoading = product.status === "pending" || product.status === "void";
	const isRejected = product.status === "rejected";

	let universe = product?.data?.universe[1];

	useEffect(() => {
		dispatch(getProduct(id));
		setTimeout(() => {
			dispatch(getProducts("", "", universe, "", "", ""));
		}, 500);

		setTimeout(() => {
			if (window.location.href.includes("#details")) {
				document.getElementById("details-product").className = "details-active";
				document
					.getElementsByClassName("details-title")[0]
					.classList.add("selected");
			}
			if (window.location.href.includes("#comment")) {
				document.getElementById("comment-product").className = "comment-active";
				document
					.getElementsByClassName("comment-title")[0]
					.classList.add("selected");
			}
		}, 100);
	}, [id, universe, dispatch]);

	const btn = document.getElementById("btn");
	btn?.addEventListener("mouseover", (e) => {
		e.preventDefault();
		return btn.classList.add("animation-reverse");
	});

	async function addItemToCart(e) {
		e.preventDefault();
		if (uid) {
			const selectedQty = document.getElementsByClassName("qty")[0].value;
			const data = new FormData();
			data.append("productId", product?.data?._id);
			data.append("quantity", selectedQty);

			await dispatch(addToCart(data, user.data._id));

			dispatch(getUserCart(uid));
		} else {
			console.log("auth pls");
		}
	}
	let pictures = [product?.data?.cover, product?.data?.pictures];
	// extract values from the array data.picture
	pictures = pictures.flat();
	function leftArrow(e) {
		e.preventDefault();
		// if idx !== to 0 then idx - 1
		// if idx === to 0 then set pic.length - 1 as value
		setIndex(index !== 0 ? index - 1 : pictures.length - 1);
	}
	function rightArrow(e) {
		e.preventDefault();
		// if idx === to pic.length - 1
		// (-1 is needed for the length to be the same as the idx)
		// then set idx to 0 or idx + 1
		setIndex(index === pictures.length - 1 ? 0 : index + 1);
	}
	return (
		<div className="product-page">
			{isLoading ? (
				<span>loading</span>
			) : (
				<>
					{isRejected ? (
						<div>Aucun produit trouvé</div>
					) : (
						<div className="product-container">
							<div className="product-left">
								<div className="displayed-pictures">
									<img id="cover" src={pictures[index]} alt="cover" />
									<div className="sliders-container">
										<div>
											<img
												onClick={leftArrow}
												src="./svg/angle-left.svg"
												alt="angle"
											/>
										</div>
										<div>
											<img
												onClick={rightArrow}
												src="./svg/angle-right.svg"
												alt="angle"
											/>
										</div>
									</div>
								</div>

								<div className="product-pictures">
									{pictures.map((pic, idx) => {
										return (
											<img
												onClick={(e) => {
													setIndex(idx);
													document.getElementById("cover").src = `${pic}`;
												}}
												src={pic}
												alt="cover"
												key={idx}
											/>
										);
									})}
								</div>
							</div>

							<div className="product-right">
								<h1>
									Artoria - figurine d'Artoria de l'anime fate/grand order 28cm
								</h1>
								<div className="underline"></div>
								<p>{product?.data?.description}</p>
								<p>
									Taille: <span>25cm</span>
								</p>
								<p>Editeur: Bandai</p>
								<br />
								<div className="underline"></div>
								<div className="product-price">
									<span>{float(product?.data?.price)}</span>
								</div>
								<br />
								<div className="product-rating">
									<Rating ratings={product?.data?.averageRating} />
								</div>
								<div className="product-buy">
									<br />
									<select id="qty" className="qty">
										<option defaultValue="1">1</option>
										<option value="2">2</option>
										<option value="3">3</option>
										<option value="4">4</option>
										<option value="5">5</option>
										<option value="6">6</option>
										<option value="7">7</option>
										<option value="8">8</option>
										<option value="9">9</option>
										<option value="10">10</option>
									</select>
									<button className="btn-buy" id="btn" onClick={addItemToCart}>
										Ajouter au panier{" "}
										<img src="./svg/addToCart.svg" alt="addtocart" />
									</button>
								</div>
							</div>
						</div>
					)}
					<div className="product-details">
						<div className="title-container">
							<div className="anchor-details">
								<h2
									className="details-title"
									onClick={(e) => {
										window.location.hash = "#details";
										e.target.classList.add("selected");
										document
											.getElementsByClassName("comment-title")[0]
											.classList.remove("selected");
										// show / hide the selected content
										document.getElementById("details-product").className =
											"details-active";
										document
											.getElementById("comment-product")
											.classList.remove("comment-active");
									}}>
									Détails du produit
								</h2>
							</div>
							<div className="anchor-comment">
								<h2
									className="comment-title"
									onClick={(e) => {
										window.location.hash = "#comment";
										e.target.classList.add("selected");
										document
											.getElementsByClassName("details-title")[0]
											.classList.remove("selected");
										// show / hide the selected content
										document.getElementById("comment-product").className =
											"comment-active";
										document
											.getElementById("details-product")
											.classList.remove("details-active");
									}}>
									Avis
								</h2>
							</div>
						</div>
						<div id="details-product">
							<h3>{product?.data?.name}</h3>
							<p>Marque : {product?.data?.brand}</p>
							<p>
								Univers : {capitalizeFirstLetter(product?.data?.universe[1])}
							</p>
							<p>
								En stock : {product?.data?.inStock} <span></span>
							</p>
							<p>
								Date de mise en ligne sur Figurama : {product?.data?.createdAt}
							</p>
						</div>
						<div id="comment-product">
							<Comment product={product} />
						</div>
					</div>

					<div className="recommandation">
						<h3>Vous aimerez aussi...</h3>

						<div className="recommandation-container">
							<div className="recommandation-list">
								{products?.data?.products
									// remove the selectioned product of the array
									.filter((prod) => prod._id !== id)
									.map((card) => {
										return <Card product={card} key={card._id} />;
									})}
							</div>
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export default GetProduct;
