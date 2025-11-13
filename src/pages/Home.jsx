import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function Home() {
	const [posts, setPosts] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [sortBy, setSortBy] = useState("created_at"); // 'created_at' or 'upvotes'

	useEffect(() => {
		async function fetchPosts() {
			const { data, error } = await supabase
				.from("Posts")
				.select("id, created_at, title, upvotes")
				.order(sortBy, { ascending: false });

			if (error) {
				console.error("Error fetching posts:", error);
			} else {
				setPosts(data || []);
			}
		}
		fetchPosts();
	}, [sortBy]);

	const filteredPosts = posts.filter((p) =>
		p.title.toLowerCase().includes(searchTerm.toLowerCase())
	);

	return (
		<div className="page">
			<div className="header">
				<h1>Posts Feed</h1>
				<Link to="/create" className="btn">
					Create Post
				</Link>
			</div>

			<div className="controls">
				<input
					type="text"
					placeholder="Search by title..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="search-input"
				/>
				<select
					value={sortBy}
					onChange={(e) => setSortBy(e.target.value)}
					className="sort-select"
				>
					<option className="sort-select" value="created_at">
						Sort by Time
					</option>
					<option className="sort-select"value="upvotes">Sort by Upvotes</option>
				</select>
			</div>

			{filteredPosts.length === 0 ? (
				<p>No posts yet.</p>
			) : (
				<div className="posts-grid">
					{filteredPosts.map((post) => (
						<Link to={`/post/${post.id}`} key={post.id} className="post-card">
							<h3>{post.title}</h3>
							<div className="post-meta">
								<span>{new Date(post.created_at).toLocaleString()}</span>
								<span>⬆ {post.upvotes || 0}</span>
							</div>
						</Link>
					))}
				</div>
			)}
		</div>
	);
}
