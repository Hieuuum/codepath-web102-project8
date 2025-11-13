import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function EditPost() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [imageUrl, setImageUrl] = useState("");
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchPost() {
			const { data, error } = await supabase
				.from("Posts")
				.select("*")
				.eq("id", id)
				.single();

			if (error) {
				console.error("Error fetching post:", error);
			} else if (data) {
				setTitle(data.title);
				setContent(data.content || "");
				setImageUrl(data.image_url || "");
			}
			setLoading(false);
		}
		fetchPost();
	}, [id]);

	async function handleSubmit(e) {
		e.preventDefault();

		const { error } = await supabase
			.from("Posts")
			.update({ title, content, image_url: imageUrl })
			.eq("id", id);

		if (error) {
			console.error("Error updating post:", error);
			alert("Failed to update post");
		} else {
			navigate(`/post/${id}`);
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

	if (loading) return <div className="page">Loading...</div>;

	return (
		<div className="page">
			<h2>Edit Post</h2>
			<form onSubmit={handleSubmit} className="post-form">
				<label>
					Title <span className="required">*</span>
					<input
						type="text"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						required
					/>
				</label>

				<label>
					Content
					<textarea
						value={content}
						onChange={(e) => setContent(e.target.value)}
						rows={6}
					/>
				</label>

				<label>
					Image URL
					<input
						type="url"
						value={imageUrl}
						onChange={(e) => setImageUrl(e.target.value)}
						placeholder="https://example.com/image.jpg"
					/>
				</label>

				<div className="form-actions">
					<button type="submit" className="btn">
						Save Changes
					</button>
					<button
						type="button"
						className="btn secondary"
						onClick={() => navigate(`/post/${id}`)}
					>
						Cancel
					</button>
					<button type="button" className="btn danger" onClick={handleDelete}>
						Delete Post
					</button>
				</div>
			</form>
		</div>
	);
}
