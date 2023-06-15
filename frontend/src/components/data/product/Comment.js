// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";

// const Comment = ({ product }) => {

// 	const comment = useSelector((state) => state.comment);
// 	console.log(comment);

// 	return (
// 		<div className="comment-container">
// 			{comment?.data?.comments.map((com) => {
// 				return (
// 					<div className="comment" key={com._id}>
// 						<div className="comment-header">
// 							<div className="header-left">
// 								<h3>
// 									{com?.commenterId?.firstName} {com?.commenterId?.lastName}
// 								</h3>
// 							</div>
// 							<div className="header-right">
// 								<p>{com?.commenterId?.createdAt}</p>
// 							</div>
// 						</div>
// 						<div className="comment-content">
// 							<p>{com.comment}</p>
// 						</div>
// 					</div>
// 				);
// 			})}
// 		</div>
// 	);
// };

// export default Comment;
