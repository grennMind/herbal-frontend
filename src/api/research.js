// src/api/research.js

// Fetch all research posts
export const fetchResearchPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/research", {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
  
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to fetch posts");
      return data.data.posts || [];
    } catch (err) {
      console.error(err);
      return [];
    }
  };
  
  // Fetch a single research post by ID
  export const fetchResearchPost = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/research/${id}`, {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
  
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to fetch post");
      return data.data.post || null;
    } catch (err) {
      console.error(err);
      return null;
    }
  };
  
  // Create a new research post
  export const createResearchPost = async (newPost) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User must be logged in to create a post");
  
      const res = await fetch("/api/research", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newPost),
      });
  
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to create post");
      return data.data.post || null;
    } catch (err) {
      console.error(err);
      return null;
    }
  };
  
  // Post a comment on a research post
  export const postComment = async (postId, content, parentId = null) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User must be logged in to post a comment");
  
      const res = await fetch(`/api/research/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content, parentId }),
      });
  
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to post comment");
      return data.data.comment || null;
    } catch (err) {
      console.error(err);
      return null;
    }
  };
  
  // Optional: fetch comments for a post
  export const fetchComments = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/research/${postId}/comments`, {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
  
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to fetch comments");
      return data.data.comments || [];
    } catch (err) {
      console.error(err);
      return [];
    }
  };
  