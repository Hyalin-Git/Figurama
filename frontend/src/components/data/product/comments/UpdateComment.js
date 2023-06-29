import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { editComment } from "../../../../services/actions/PATCH/editComment.actions";
import { getProduct } from "../../../../services/actions/GET/product.actions";

const UpdateComment = ({ productId, comment, setIsUpdated }) => {
	const [newComment, setNewComment] = useState("");
	const dispatch = useDispatch();
	function handleUpdate(e) {
		e.preventDefault();
		if (newComment === "") {
			setNewComment(comment.comment);
			return;
		}
		dispatch(editComment(productId, comment._id, newComment))
			.then(() => dispatch(getProduct(productId)))
			.then(() => setIsUpdated(false));
	}

	return (
		<div className="edit-comment">
			<form action="" onSubmit={handleUpdate} id="edit">
				<textarea
					type="text"
					name="comment"
					defaultValue={comment.comment}
					onChange={(e) => setNewComment(e.target.value)}></textarea>
			</form>
		</div>
	);
};
export default UpdateComment;
