import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, requireAdmin } from '@/middleware/auth';
import { validateBody, userUpdateSchema } from '@/validation/schemas';
import { body } from 'express-validator';

const router = Router();
const prisma = new PrismaClient();

// Get all users (admin only)
router.get('/', authenticateToken, requireAdmin, async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      role,
      isActive,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    // Build where clause
    const where: any = {};
    if (search) {
      where.OR = [
        { firstName: { contains: search as string, mode: 'insensitive' } },
        { lastName: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } }
      ];
    }
    if (role) {
      where.role = role as string;
    }
    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    // Get users with pagination
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          avatar: true,
          role: true,
          isActive: true,
          isVerified: true,
          lastLogin: true,
          createdAt: true,
          _count: {
            select: {
              properties: true,
              leads: true,
              deals: true
            }
          }
        },
        orderBy: {
          [sortBy as string]: sortOrder as 'asc' | 'desc'
        },
        skip: offset,
        take: limitNum
      }),
      prisma.user.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      }
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error'
      }
    });
  }
});

// Get user by ID
router.get('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const currentUserId = (req as any).user?.userId;

    // Users can only view their own profile unless they're admin
    if (currentUserId !== id) {
      // Check if user is admin
      const currentUser = await prisma.user.findUnique({
        where: { id: currentUserId },
        select: { role: true }
      });

      if (currentUser?.role !== 'ADMIN' && currentUser?.role !== 'SUPER_ADMIN') {
        return res.status(403).json({
          success: false,
          error: {
            message: 'Access denied'
          }
        });
      }
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true,
        role: true,
        isActive: true,
        isVerified: true,
        lastLogin: true,
        createdAt: true,
        _count: {
          select: {
            properties: true,
            leads: true,
            deals: true,
            credits: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'User not found'
        }
      });
    }

    res.json({
      success: true,
      data: { user }
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error'
      }
    });
  }
});

// Update user profile
router.put('/:id', authenticateToken, validateBody(userUpdateSchema), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const currentUserId = (req as any).user?.userId;
    const updateData = req.body;

    // Users can only update their own profile unless they're admin
    if (currentUserId !== id) {
      const currentUser = await prisma.user.findUnique({
        where: { id: currentUserId },
        select: { role: true }
      });

      if (currentUser?.role !== 'ADMIN' && currentUser?.role !== 'SUPER_ADMIN') {
        return res.status(403).json({
          success: false,
          error: {
            message: 'Access denied'
          }
        });
      }
    }

    // Check if email is being changed and if it's already taken
    if (updateData.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: updateData.email }
      });

      if (existingUser && existingUser.id !== id) {
        return res.status(409).json({
          success: false,
          error: {
            message: 'Email already in use'
          }
        });
      }
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true,
        role: true,
        isActive: true,
        isVerified: true,
        lastLogin: true,
        createdAt: true
      }
    });

    res.json({
      success: true,
      data: { user }
    });

  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error'
      }
    });
  }
});

// Deactivate/activate user (admin only)
router.patch('/:id/status', authenticateToken, requireAdmin, [
  body('isActive').isBoolean(),
], async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    // Prevent admin from deactivating themselves
    const currentUserId = (req as any).user?.userId;
    if (currentUserId === id && !isActive) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Cannot deactivate your own account'
        }
      });
    }

    const user = await prisma.user.update({
      where: { id },
      data: { isActive },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        isActive: true,
        role: true
      }
    });

    res.json({
      success: true,
      data: { user }
    });

  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error'
      }
    });
  }
});

// Change user role (super admin only)
router.patch('/:id/role', authenticateToken, requireAdmin, [
  body('role').isIn(['SUPER_ADMIN', 'ADMIN', 'AGENT', 'USER']),
], async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // Prevent role changes to self unless super admin
    const currentUser = await prisma.user.findUnique({
      where: { id: (req as any).user?.userId },
      select: { role: true }
    });

    if (currentUser?.role !== 'SUPER_ADMIN' && (req as any).user?.userId === id) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Insufficient permissions to change your own role'
        }
      });
    }

    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true
      }
    });

    res.json({
      success: true,
      data: { user }
    });

  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error'
      }
    });
  }
});

// Get user statistics
router.get('/:id/stats', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const currentUserId = (req as any).user?.userId;

    // Users can only view their own stats unless they're admin
    if (currentUserId !== id) {
      const currentUser = await prisma.user.findUnique({
        where: { id: currentUserId },
        select: { role: true }
      });

      if (currentUser?.role !== 'ADMIN' && currentUser?.role !== 'SUPER_ADMIN') {
        return res.status(403).json({
          success: false,
          error: {
            message: 'Access denied'
          }
        });
      }
    }

    const [
      propertiesCount,
      leadsCount,
      dealsCount,
      creditsBalance,
      recentActivities
    ] = await Promise.all([
      prisma.property.count({ where: { userId: id } }),
      prisma.lead.count({ where: { userId: id } }),
      prisma.deal.count({ where: { userId: id } }),
      prisma.credit.aggregate({
        where: { userId: id },
        _sum: { balance: true }
      }),
      prisma.activity.findMany({
        where: { userId: id },
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
          id: true,
          type: true,
          title: true,
          createdAt: true
        }
      })
    ]);

    res.json({
      success: true,
      data: {
        stats: {
          propertiesCount,
          leadsCount,
          dealsCount,
          creditsBalance: creditsBalance._sum.balance || 0,
          recentActivities
        }
      }
    });

  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error'
      }
    });
  }
});

export { router as userRoutes };