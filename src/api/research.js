// src/api/research.js
import { supabase } from "../config/supabase";
import { ensureAppJwt } from "../services/authService";

// Dynamic API base: localhost for dev, Render backend for production
const API_BASE = import.meta.env.VITE_API_BASE
  || (window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "https://herbal-backend-msfb.onrender.com/api");

// ------------------------------
// Fetch research posts
// ------------------------------
export const fetchResearchPosts = async (params = {}) => {
  try {
    const token = localStorage.getItem("token");
    const qs = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/research${qs ? `?${qs}` : ""}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => null);
      throw new Error(errJson?.message || `Failed to fetch posts (${res.status})`);
    }

    const data = await res.json();
    if (!data.success) throw new Error(data.message || "Failed to fetch posts");
    return data.data;
  } catch (err) {
    console.error(err);
    return {
      posts: [],
      pagination: { currentPage: 1, totalPages: 1, totalItems: 0, itemsPerPage: 10 }
    };
  }
};

// ------------------------------
// Fetch single research post
// ------------------------------
export const fetchResearchPost = async (id) => {
  console.log(`[DEBUG] Frontend: fetching research post ${id} -> ${API_BASE}/research/${id}`);
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE}/research/${id}`, {
      cache: 'no-store',
      headers: {
        Accept: 'application/json',
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    console.log(`[DEBUG] Frontend: response status for post ${id}:`, res.status);
    const clone = res.clone();
    let data;
    try {
      data = await res.json();
    } catch {
      const text = await clone.text().catch(() => "<no text>");
      console.error(`[DEBUG] Non-JSON response for post ${id}:`, text?.slice(0, 500));
      throw new Error(`Non-JSON response: status ${res.status}`);
    }

    if (!data?.success) {
      console.error(`[DEBUG] API error for post ${id}:`, data?.message);
      throw new Error(data?.message || "Failed to fetch post");
    }
    return data.data;
  } catch (err) {
    console.error(`[DEBUG] fetchResearchPost error for ${id}:`, err);
    return { post: null, comments: [], myVote: 0 };
  }
};

// ------------------------------
// Create research post
// ------------------------------
export const createResearchPost = async (newPost) => {
  try {
    const { data: auth } = await supabase.auth.getUser().catch(() => ({}));
    if (auth?.user && !newPost.authorId) newPost = { ...newPost, authorId: auth.user.id };

    await ensureAppJwt().catch(() => {});
    let token = localStorage.getItem("token");
    let headers = token
      ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
      : { "Content-Type": "application/json" };

    let res = await fetch(`${API_BASE}/research`, {
      method: "POST",
      headers,
      body: JSON.stringify(newPost),
    });

    // Retry once on 401/403
    if (res.status === 401 || res.status === 403) {
      await ensureAppJwt().catch(() => {});
      token = localStorage.getItem("token");
      headers = token
        ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
        : { "Content-Type": "application/json" };
      res = await fetch(`${API_BASE}/research`, {
        method: "POST",
        headers,
        body: JSON.stringify(newPost),
      });
    }

    const data = await res.json();
    if (data?.success && data?.data?.post) return data.data.post;
  } catch (err) {
    console.warn("Backend create failed, falling back to Supabase:", err?.message || err);
  }

  // Fallback to Supabase
  try {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth?.user) throw new Error("User must be logged in");

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
    console.error("Supabase fallback failed:", err);
    return null;
  }
};

// ------------------------------
// Comments, voting, and save
// ------------------------------
export const postComment = async (postId, content, parentId = null) => {
  try {
    await ensureAppJwt().catch(() => {});
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Login required");

    const res = await fetch(`${API_BASE}/research/${postId}/comments`, {
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

export const fetchComments = async (postId) => {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE}/research/${postId}/comments`, {
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
