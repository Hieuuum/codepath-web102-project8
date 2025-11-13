# Posts Web App

A full-featured React + Supabase posts web app with create, read, update, delete operations, comments, upvotes, search, and sorting.

## Features

- **Create Posts**: Form to create posts with title (required), content, and image URL
- **Home Feed**: Displays all posts with creation time, title, and upvote count
- **Search & Sort**: Search posts by title and sort by creation time or upvotes
- **Post Detail Page**: View full post with content, image, comments, and upvote button
- **Edit/Delete**: Edit or delete your posts from the post detail or edit pages
- **Comments**: Leave comments on any post
- **Upvotes**: Upvote posts unlimited times (each click increases count by 1)

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Supabase

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Add your Supabase credentials to `.env`:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### 3. Create Database Tables

Run this SQL in your Supabase SQL Editor:

```sql
-- Create posts table
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  title TEXT NOT NULL,
  content TEXT,
  image_url TEXT,
  upvotes INTEGER DEFAULT 0
);

-- Create comments table
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  content TEXT NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust as needed for your use case)
CREATE POLICY "Enable read access for all users" ON posts FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON posts FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON posts FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON comments FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON comments FOR INSERT WITH CHECK (true);
```

### 4. Run Development Server

```bash
npm run dev
```

Open http://localhost:5173 to view the app.

## Routes

- `/` - Home feed (list all posts with search and sort)
- `/create` - Create new post
- `/post/:id` - View post detail with comments
- `/edit/:id` - Edit existing post

## Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool
- **React Router** - Client-side routing
- **Supabase** - Backend database and authentication
- **CSS** - Styling

## Database Schema

### `posts` table

- `id` (UUID, primary key)
- `created_at` (timestamp)
- `title` (text, required)
- `content` (text, optional)
- `image_url` (text, optional)
- `upvotes` (integer, default 0)

### `comments` table

- `id` (UUID, primary key)
- `created_at` (timestamp)
- `post_id` (UUID, foreign key to posts)
- `content` (text, required)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
