import express from 'express';
import { User } from '../models/index.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validateUserUpdate } from '../utils/validation.js';

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', authenticate, async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        user: req.user
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', authenticate, async (req, res) => {
  try {
    const { error } = validateUserUpdate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const allowedFields = [
      'name', 'phone', 'address', 'bio', 'businessName', 
      'credentials', 'specializations', 'experience'
    ];
    
    const updateData = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    await req.user.update(updateData);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: req.user
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/users/herbalists
// @desc    Get verified herbalists
// @access  Public
router.get('/herbalists', async (req, res) => {
  try {
    const { page = 1, limit = 10, specialization } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {
      userType: 'herbalist',
      herbalistVerificationStatus: 'approved',
      isActive: true
    };

    if (specialization) {
      whereClause.specializations = {
        [Op.contains]: [specialization]
      };
    }

    const herbalists = await User.findAndCountAll({
      where: whereClause,
      attributes: [
        'id', 'name', 'bio', 'specializations', 'credentials',
        'experience', 'rating', 'totalReviews', 'avatar'
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['rating', 'DESC'], ['totalReviews', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        herbalists: herbalists.rows,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(herbalists.count / limit),
          totalItems: herbalists.count,
          itemsPerPage: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get herbalists error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/users/sellers
// @desc    Get verified sellers
// @access  Public
router.get('/sellers', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const sellers = await User.findAndCountAll({
      where: {
        userType: 'seller',
        sellerVerificationStatus: 'approved',
        isActive: true
      },
      attributes: [
        'id', 'name', 'businessName', 'bio', 'rating', 
        'totalReviews', 'avatar'
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['rating', 'DESC'], ['totalReviews', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        sellers: sellers.rows,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(sellers.count / limit),
          totalItems: sellers.count,
          itemsPerPage: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get sellers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router;
