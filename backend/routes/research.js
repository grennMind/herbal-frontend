import express from 'express';
import { Op } from 'sequelize';
import { authenticate, authorize, optionalAuth } from '../middleware/auth.js';
import { ResearchPost, Comment, Herb, Disease, User } from '../models/index.js';

const router = express.Router();

// Create research post
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, abstract, content, references, attachments, relatedHerbId, relatedDiseaseId } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required' });
    }

    const post = await ResearchPost.create({
      title,
      abstract,
      content,
      references: references || [],
      attachments: attachments || [],
      relatedHerbId: relatedHerbId || null,
      relatedDiseaseId: relatedDiseaseId || null,
      authorId: req.user.id,
      status: 'published',
      isVerified: ['researcher', 'herbalist', 'admin'].includes(req.user.userType) || false
    });

    const created = await ResearchPost.findByPk(post.id, {
      include: [
        { model: User, as: 'author', attributes: ['id', 'name', 'userType'] },
        { model: Herb, as: 'herb', attributes: ['id', 'name', 'scientificName'] },
        { model: Disease, as: 'disease', attributes: ['id', 'name'] }
      ]
    });

    res.status(201).json({ success: true, data: { post: created } });
  } catch (error) {
    console.error('Create research post error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// List/search research posts
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, q, herbId, diseaseId, verified } = req.query;
    const offset = (page - 1) * limit;
    const where = {};

    if (q) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${q}%` } },
        { abstract: { [Op.iLike]: `%${q}%` } },
        { content: { [Op.iLike]: `%${q}%` } }
      ];
    }
    if (herbId) where.relatedHerbId = herbId;
    if (diseaseId) where.relatedDiseaseId = diseaseId;
    if (verified === 'true') where.isVerified = true;

    const posts = await ResearchPost.findAndCountAll({
      where,
      include: [
        { model: User, as: 'author', attributes: ['id', 'name', 'userType'] },
        { model: Herb, as: 'herb', attributes: ['id', 'name', 'scientificName'] },
        { model: Disease, as: 'disease', attributes: ['id', 'name'] },
        { model: Comment, as: 'comments', include: [{ model: User, as: 'author', attributes: ['id', 'name'] }] }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: {
        posts: posts.rows,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(posts.count / limit),
          totalItems: posts.count,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('List research posts error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get single post with threaded comments
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const post = await ResearchPost.findByPk(req.params.id, {
      include: [
        { model: User, as: 'author', attributes: ['id', 'name', 'userType'] },
        { model: Herb, as: 'herb', attributes: ['id', 'name', 'scientificName'] },
        { model: Disease, as: 'disease', attributes: ['id', 'name'] },
        {
          model: Comment,
          as: 'comments',
          include: [
            { model: User, as: 'author', attributes: ['id', 'name'] },
            { model: Comment, as: 'replies', include: [{ model: User, as: 'author', attributes: ['id', 'name'] }] }
          ]
        }
      ]
    });

    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    res.json({ success: true, data: { post } });
  } catch (error) {
    console.error('Get research post error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update post (author or admin)
router.put('/:id', authenticate, async (req, res) => {
  try {
    const post = await ResearchPost.findByPk(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    const isOwner = post.authorId === req.user.id;
    const isAdmin = req.user.userType === 'admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const updatable = ['title', 'abstract', 'content', 'references', 'attachments', 'relatedHerbId', 'relatedDiseaseId', 'status', 'isVerified'];
    const data = {};
    updatable.forEach((k) => { if (req.body[k] !== undefined) data[k] = req.body[k]; });

    await post.update(data);
    res.json({ success: true, message: 'Post updated', data: { post } });
  } catch (error) {
    console.error('Update research post error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Add comment or reply
router.post('/:id/comments', authenticate, async (req, res) => {
  try {
    const { content, parentId } = req.body;
    if (!content) return res.status(400).json({ success: false, message: 'Content is required' });

    const post = await ResearchPost.findByPk(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    // Optional: validate parent comment belongs to this post
    if (parentId) {
      const parent = await Comment.findByPk(parentId);
      if (!parent || parent.postId !== post.id) {
        return res.status(400).json({ success: false, message: 'Invalid parent comment' });
      }
    }

    const comment = await Comment.create({
      content,
      parentId: parentId || null,
      postId: post.id,
      authorId: req.user.id
    });

    const created = await Comment.findByPk(comment.id, {
      include: [{ model: User, as: 'author', attributes: ['id', 'name'] }]
    });

    res.status(201).json({ success: true, data: { comment: created } });
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;


