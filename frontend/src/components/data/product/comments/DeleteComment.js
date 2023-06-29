import React from "react";
import { deleteComment } from "../../../../services/actions/PATCH/deleteComment.actions";
import { useDispatch } from "react-redux";
import { getProduct } from "../../../../services/actions/GET/product.actions";

const DeleteComment = ({ productId, commentId }) => {
	const dispatch = useDispatch();
	function handleDelete(e) {
		e.preventDefault();

		dispatch(deleteComment(productId, commentId))
			.then(() => dispatch(getProduct(productId)))
			.catch((err) => console.log(err));
	}

	return (
		<>
			<button onClick={handleDelete}>Supprimer</button>
		</>
	);
};

export default DeleteComment;
