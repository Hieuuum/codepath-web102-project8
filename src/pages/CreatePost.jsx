import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function CreatePost() {
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [imageUrl, setImageUrl] = useState("");
	const navigate = useNavigate();

	async function handleSubmit(e) {
		e.preventDefault();

		const { data, error } = await supabase
			.from("Posts")
			.insert([{ title, content, image_url: imageUrl, upvotes: 0 }])
			.select();

		if (error) {
			console.error("Error creating post:", error);
			alert("Failed to create post");
		} else if (data && data.length > 0) {
			navigate(`/post/${data[0].id}`);
		}
	}

	return (
		<div className="page">
			<h2>Create New Post</h2>
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
						Create Post
					</button>
					<button
						type="button"
						className="btn secondary"
						onClick={() => navigate("/")}
					>
						Cancel
					</button>
				</div>
			</form>
		</div>
	);
}
