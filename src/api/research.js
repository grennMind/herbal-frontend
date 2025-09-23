// src/api/research.js
import { supabase } from "../config/supabase";

// Fetch research posts with optional query params (sorting, filtering, pagination)
export const fetchResearchPosts = async (params = {}) => {
  try {
    const token = localStorage.getItem("token");
    const qs = new URLSearchParams(params).toString();
    const res = await fetch(`/api/research${qs ? `?${qs}` : ""}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    const data = await res.json();
    if (!data.success) throw new Error(data.message || "Failed to fetch posts");
    return data.data;
  } catch (err) {
    console.error(err);
    return { posts: [], pagination: { currentPage: 1, totalPages: 1, totalItems: 0, itemsPerPage: 10 } };
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
    return data.data;
  } catch (err) {
    console.error(err);
    return { post: null, comments: [], myVote: 0 };
  }
};

// Create a new research post
export const createResearchPost = async (newPost) => {
  // Always try backend first (it accepts optional auth); if that fails, fall back to Supabase client
  try {
    // Include authorId if we have a Supabase session to help backend associate author
    try {
      const { data: auth } = await supabase.auth.getUser();
      if (auth?.user && !newPost.authorId) {
        newPost = { ...newPost, authorId: auth.user.id };
      }
    } catch {}

    const token = localStorage.getItem("token");
    const headers = token
      ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
      : { "Content-Type": "application/json" };
    const res = await fetch("/api/research", {
      method: "POST",
      headers,
      body: JSON.stringify(newPost),
    });
    const data = await res.json();
    if (data?.success && data?.data?.post) return data.data.post;
  } catch (err) {
    // continue to fallback
  }

  // Fallback: insert directly into Supabase with RLS using logged-in Supabase user
  try {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth?.user) throw new Error("User must be logged in to create a post");

    const insertBody = {
      title: newPost.title,
      abstract: newPost.abstract || null,
      content: newPost.content,
      references_list: Array.isArray(newPost.references) ? newPost.references : [],
      attachments: Array.isArray(newPost.attachments) ? newPost.attachments : [],
      related_herb_id: newPost.relatedHerbId || null,
      related_disease_id: newPost.relatedDiseaseId || null,
      author_id: auth.user.id,
      status: 'published',
    };

    const { data, error } = await supabase
      .from('research_posts')
      .insert([insertBody])
      .select('*')
      .single();
    if (error) throw error;
    return data;
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

// Fetch comments for a post
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

// Voting and saving
export const voteOnPost = async (postId, value) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("User must be logged in to vote");
    const res = await fetch(`/api/research/${postId}/votes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ value }),
    });
    const data = await res.json();
    return data.success;
  } catch (err) {
    console.error(err);
    return false;
  }
};

// Delete a research post (author must be a researcher)
export const deleteResearchPost = async (postId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("User must be logged in to delete");
    const res = await fetch(`/api/research/${postId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    return data.success;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export const savePost = async (postId, action) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("User must be logged in to save");
    const res = await fetch(`/api/research/${postId}/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ action }),
    });
    const data = await res.json();
    return data.success;
  } catch (err) {
    console.error(err);
    return false;
  }
};