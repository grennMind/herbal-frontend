// routes/research.js
import express from "express";
import { authenticate, optionalAuth } from "../middleware/auth.js";
import supabase, { supabaseAdmin } from "../config/supabase.js";

const router = express.Router();

// ----------------------
// Create a research post
// ----------------------
router.post("/", authenticate, async (req, res) => {
  try {
    const {
      title,
      abstract,
      content,
      references,
      attachments,
      relatedHerbId,
      relatedDiseaseId,
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required",
      });
    }

    const { data, error } = await supabase
      .from("research_posts")
      .insert([
        {
          title,
          abstract,
          content,
          references: references || [],
          attachments: attachments || [],
          relatedHerbId: relatedHerbId || null,
          relatedDiseaseId: relatedDiseaseId || null,
          authorId: req.user.id,
          status: "published",
          isVerified: ["researcher", "herbalist", "admin"].includes(
            req.user.userType
          ),
        },
      ])
      .select("*")
      .single();

    if (error) throw error;

    res.status(201).json({ success: true, data: { post: data } });
  } catch (err) {
    console.error("Create research post error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ----------------------
// List/search research posts
// ----------------------
router.get("/", optionalAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, q, herbId, diseaseId, verified } = req.query;
    const from = (page - 1) * limit;
    const to = from + parseInt(limit) - 1;

    let query = supabase
      .from("research_posts")
      .select("*")
      .order("createdAt", { ascending: false })
      .range(from, to);

    if (q) {
      query = query.ilike("title", `%${q}%`); // Supabase supports ilike
    }
    if (herbId) query = query.eq("relatedHerbId", herbId);
    if (diseaseId) query = query.eq("relatedDiseaseId", diseaseId);
    if (verified === "true") query = query.eq("isVerified", true);

    const { data, error, count } = await query;

    if (error) throw error;

    res.json({
      success: true,
      data: {
        posts: data,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil((count || data.length) / limit),
          totalItems: count || data.length,
          itemsPerPage: parseInt(limit),
        },
      },
    });
  } catch (err) {
    console.error("List research posts error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ----------------------
// Get single post with comments
// ----------------------
router.get("/:id", optionalAuth, async (req, res) => {
  try {
    const { data: post, error } = await supabase
      .from("research_posts")
      .select("*")
      .eq("id", req.params.id)
      .single();

    if (error) throw error;
    if (!post)
      return res.status(404).json({ success: false, message: "Post not found" });

    // Fetch comments (threaded)
    const { data: comments, error: commentError } = await supabase
      .from("comments")
      .select("*")
      .eq("postId", req.params.id);

    if (commentError) console.warn("Comments fetch warning:", commentError.message);

    res.json({ success: true, data: { post, comments } });
  } catch (err) {
    console.error("Get research post error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ----------------------
// Update post (author/admin)
// ----------------------
router.put("/:id", authenticate, async (req, res) => {
  try {
    const { data: post, error } = await supabase
      .from("research_posts")
      .select("authorId")
      .eq("id", req.params.id)
      .single();

    if (error) throw error;
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });

    const isOwner = post.authorId === req.user.id;
    const isAdmin = req.user.userType === "admin";
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const updatable = [
      "title",
      "abstract",
      "content",
      "references",
      "attachments",
      "relatedHerbId",
      "relatedDiseaseId",
      "status",
      "isVerified",
    ];

    const dataToUpdate = {};
    updatable.forEach((k) => {
      if (req.body[k] !== undefined) dataToUpdate[k] = req.body[k];
    });

    const { data: updatedPost, error: updateError } = await supabase
      .from("research_posts")
      .update(dataToUpdate)
      .eq("id", req.params.id)
      .select()
      .single();

    if (updateError) throw updateError;

    res.json({ success: true, message: "Post updated", data: { post: updatedPost } });
  } catch (err) {
    console.error("Update research post error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ----------------------
// Add comment or reply
// ----------------------
router.post("/:id/comments", authenticate, async (req, res) => {
  try {
    const { content, parentId } = req.body;
    if (!content)
      return res.status(400).json({ success: false, message: "Content is required" });

    const { data: comment, error } = await supabase
      .from("comments")
      .insert([
        {
          content,
          parentId: parentId || null,
          postId: req.params.id,
          authorId: req.user.id,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ success: true, data: { comment } });
  } catch (err) {
    console.error("Create comment error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
