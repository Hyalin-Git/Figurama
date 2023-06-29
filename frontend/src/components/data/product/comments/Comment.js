import React, { useContext, useState } from "react";
import { useDispatch } from "react-redux";
import Rating from "../Rating";
import { dateFormat } from "../../../../utils/dateFormat";
import { UidContext } from "../../../../utils/AppContext";
import { addComment } from "../../../../services/actions/PATCH/addComment.actions";
import { getProduct } from "../../../../services/actions/GET/product.actions";
import DeleteComment from "./DeleteComment";
import UpdateComment from "./UpdateComment";

const Comment = ({ product }) => {
	const [writeComment, setwriteComment] = useState(false);
	const [isUpdated, setIsUpdated] = useState(false);
	const [comment, setComment] = useState("");
	const dispatch = useDispatch();
	const uid = useContext(UidContext);

	let rating = 0;

	const handleRating = (e) => {
		e.preventDefault();

		const stars = document.querySelectorAll(".star");

		Array.from(stars).map((star, idx) => {
			return star.addEventListener("click", function () {
				for (let i = 0; i <= stars.length; i++) {
					if (i <= idx) {
						stars[i].classList.add("colored");
						rating = star.getAttribute("data-value");
					} else {
						stars[i]?.classList?.remove("colored");
					}
				}
			});
		});
	};

	function handleComment(e) {
		e.preventDefault();
		const productId = product?.data?._id;
		if (!rating || comment === "") {
			return;
		}
		dispatch(addComment(productId, uid, rating, comment))
			.then(() => dispatch(getProduct(productId)))
			.then(() => {
				setwriteComment(false);
			});
	}

	return (
		<div className="comment-container">
			{uid ? (
				<>
					<div className="comment-form">
						<h1>Votre avis est important</h1>
						{writeComment ? (
							<form action="" onSubmit={handleComment}>
								<div className="rating">
									<label htmlFor="rating">Quelle note donneriez-vous ?</label>
									<div
										className="rating-input"
										onMouseEnter={(e) => handleRating(e)}>
										<span className="stars">
											<img
												className="star"
												data-value="1"
												src="./svg/stars.svg"
												alt="stars"
											/>
										</span>
										<span className="stars">
											<img
												className="star"
												data-value="2"
												src="./svg/stars.svg"
												alt="stars"
											/>
										</span>
										<span className="stars">
											<img
												className="star"
												data-value="3"
												src="./svg/stars.svg"
												alt="stars"
											/>
										</span>
										<span className="stars">
											<img
												className="star"
												data-value="4"
												src="./svg/stars.svg"
												alt="stars"
											/>
										</span>
										<span className="stars">
											<img
												className="star"
												data-value="5"
												src="./svg/stars.svg"
												alt="stars"
											/>
										</span>
									</div>
								</div>
								<div className="comment-input">
									<label htmlFor="comment">Un commentaire ?</label>
									<br />
									<textarea
										name="comment"
										cols="30"
										rows="10"
										value={comment}
										onChange={(e) => setComment(e.target.value)}></textarea>
								</div>
								<div className="comment-button">
									<button>Publier votre avis</button>
									<button onClick={() => setwriteComment(!writeComment)}>
										Annuler
									</button>
								</div>
							</form>
						) : (
							<button onClick={() => setwriteComment(!writeComment)}>
								Laisser un commentaire ?
							</button>
						)}
					</div>
					<div className="comment-underline"></div>
				</>
			) : null}
			{product?.data?.comments
				.map((comment) => {
					return (
						<div className="comment" key={comment._id}>
							<div className="comment-header">
								<div className="header-left">
									<h3>
										{comment?.commenterId?.firstName}{" "}
										{comment?.commenterId?.lastName}
									</h3>
									<div>
										<Rating ratings={comment.rating} />
									</div>
								</div>
								<div className="header-right">
									<p>
										Publié le:{" "}
										<span>{dateFormat(comment?.commenterId?.createdAt)}</span>
									</p>
								</div>
							</div>
							<div className="comment-content">
								<div className="message">
									{isUpdated === comment._id ? (
										<UpdateComment
											setIsUpdated={setIsUpdated}
											productId={product?.data?._id}
											comment={comment}
										/>
									) : (
										<p>{comment.comment}</p>
									)}
								</div>
								{comment?.commenterId?._id === uid ? (
									<div className="comment-manager">
										{isUpdated ? (
											<div>
												<button form="edit">Enregistrer</button>
											</div>
										) : (
											<div>
												<button onClick={(e) => setIsUpdated(comment._id)}>
													Modifier
												</button>
											</div>
										)}
										<div>
											<DeleteComment
												productId={product?.data?._id}
												commentId={comment._id}
											/>
										</div>
									</div>
								) : null}
							</div>
						</div>
					);
				})
				.reverse()}
		</div>
	);
};

export default Comment;
