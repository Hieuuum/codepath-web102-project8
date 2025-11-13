import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function PostDetail() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [post, setPost] = useState(null);
	const [comments, setComments] = useState([]);
	const [newComment, setNewComment] = useState("");

	useEffect(() => {
		async function fetchPost() {
			const { data, error } = await supabase
				.from("Posts")
				.select("*")
				.eq("id", id)
				.single();

			if (error) {
				console.error("Error fetching post:", error);
			} else {
				setPost(data);
			}
		}

		async function fetchComments() {
			const { data, error } = await supabase
				.from("comments")
				.select("*")
				.eq("post_id", id)
				.order("created_at", { ascending: true });

			if (error) {
				console.error("Error fetching comments:", error);
			} else {
				setComments(data || []);
			}
		}

		fetchPost();
		fetchComments();
	}, [id]);

	async function handleUpvote() {
		if (!post) return;
		const newUpvotes = (post.upvotes || 0) + 1;

		const { error } = await supabase
			.from("Posts")
			.update({ upvotes: newUpvotes })
			.eq("id", id);

		if (error) {
			console.error("Error upvoting:", error);
		} else {
			setPost({ ...post, upvotes: newUpvotes });
		}
	}

	async function handleAddComment(e) {
		e.preventDefault();
		if (!newComment.trim()) return;

		const { error } = await supabase
			.from("comments")
			.insert([{ post_id: id, content: newComment }]);

		if (error) {
			console.error("Error adding comment:", error);
		} else {
			setNewComment("");
			// Refetch comments
			const { data } = await supabase
				.from("comments")
				.select("*")
				.eq("post_id", id)
				.order("created_at", { ascending: true });
			setComments(data || []);
		}
	}

	async function handleDelete() {
		if (!confirm("Delete this post?")) return;

		const { error } = await supabase.from("Posts").delete().eq("id", id);

		if (error) {
			console.error("Error deleting post:", error);
		} else {
			navigate("/");
		}
	}

	if (!post) return <div className="page">Loading...</div>;

	return (
		<div className="page">
			<div className="post-detail">
				<div className="post-header">
					<h1>{post.title}</h1>
					<div className="post-actions">
						<Link to={`/edit/${post.id}`} className="btn small">
							Edit
						</Link>
						<button className="btn small danger" onClick={handleDelete}>
							Delete
						</button>
					</div>
				</div>

				<div className="post-meta">
					<span>{new Date(post.created_at).toLocaleString()}</span>
					<button className="upvote-btn" onClick={handleUpvote}>
						⬆ {post.upvotes || 0}
					</button>
				</div>

				{post.content && (
					<div className="post-content">
						<p>{post.content}</p>
					</div>
				)}

				{post.image_url && (
					<div className="post-image">
						<img src={post.image_url} alt={post.title} />
					</div>
				)}

				<div className="comments-section">
					<h3>Comments ({comments.length})</h3>

					<form onSubmit={handleAddComment} className="comment-form">
						<textarea
							value={newComment}
							onChange={(e) => setNewComment(e.target.value)}
							placeholder="Add a comment..."
							rows={3}
						/>
						<button type="submit" className="btn small">
							Post Comment
						</button>
					</form>

					<div className="comments-list">
						{comments.map((comment) => (
							<div key={comment.id} className="comment">
								<div className="comment-meta">
									{new Date(comment.created_at).toLocaleString()}
								</div>
								<div className="comment-content">{comment.content}</div>
							</div>
						))}
					</div>
				</div>

				<Link to="/" className="btn secondary">
					← Back to Feed
				</Link>
			</div>
		</div>
	);
}
