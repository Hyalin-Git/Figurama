import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Rating from "./Rating";
import { dateFormat } from "../../../utils/dateFormat";
import { UidContext } from "../../../utils/AppContext";

const Comment = ({ product }) => {
	const [writeComment, setwriteComment] = useState(false);
	const uid = useContext(UidContext);
	console.log(product);

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
		// dispatch(addComment(userId, rating, comment))
	}
	handleComment();

	return (
		<div className="comment-container">
			{uid ? (
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
								<textarea name="comment" cols="30" rows="10"></textarea>
							</div>
							<div>
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
			) : null}
			{product?.data?.comments.map((comment) => {
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
							<p>{comment.comment}</p>
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default Comment;
