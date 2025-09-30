import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, requireAuth } from '@/middleware/auth';
import { validateBody, templateCreateSchema } from '@/validation/schemas';

const router = Router();
const prisma = new PrismaClient();

// Get all templates with filtering
router.get('/', async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      isPublic,
      userId,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    // Build where clause
    const where: any = {};

    // Search filter
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
        { category: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    // Category filter
    if (category) {
      where.category = category as string;
    }

    // Public/private filter
    if (isPublic !== undefined) {
      where.isPublic = isPublic === 'true';
    }

    // User filter (for admin or user's own templates)
    if (userId) {
      where.userId = userId as string;
    }

    const [templates, total] = await Promise.all([
      prisma.template.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          }
        },
        orderBy: {
          [sortBy as string]: sortOrder as 'asc' | 'desc'
        },
        skip: offset,
        take: limitNum
      }),
      prisma.template.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        templates,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      }
    });

  } catch (error) {
    console.error('Get templates error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error'
      }
    });
  }
});

// Get template by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const template = await prisma.template.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatar: true
          }
        }
      }
    });

    if (!template) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Template not found'
        }
      });
    }

    // Check if user can access this template (public templates or own templates)
    const currentUserId = (req as any).user?.userId;
    if (!template.isPublic && template.userId !== currentUserId) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Access denied'
        }
      });
    }

    res.json({
      success: true,
      data: { template }
    });

  } catch (error) {
    console.error('Get template error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error'
      }
    });
  }
});

// Create new template
router.post('/', authenticateToken, validateBody(templateCreateSchema), async (req: Request, res: Response) => {
  try {
    const templateData = req.body;
    const userId = (req as any).user?.userId;

    const template = await prisma.template.create({
      data: {
        ...templateData,
        userId,
        isPublic: templateData.isPublic || false
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'CREATE',
        entityType: 'TEMPLATE',
        entityId: template.id,
        userId,
        newValues: template
      }
    });

    res.status(201).json({
      success: true,
      data: { template }
    });

  } catch (error) {
    console.error('Create template error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error'
      }
    });
  }
});

// Update template
router.put('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const userId = (req as any).user?.userId;

    // Check if template exists and user owns it
    const existingTemplate = await prisma.template.findUnique({
      where: { id },
      select: { userId: true }
    });

    if (!existingTemplate) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Template not found'
        }
      });
    }

    if (existingTemplate.userId !== userId) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Access denied'
        }
      });
    }

    const oldTemplate = await prisma.template.findUnique({ where: { id } });

    const template = await prisma.template.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'UPDATE',
        entityType: 'TEMPLATE',
        entityId: template.id,
        userId,
        oldValues: oldTemplate,
        newValues: template
      }
    });

    res.json({
      success: true,
      data: { template }
    });

  } catch (error) {
    console.error('Update template error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error'
      }
    });
  }
});

// Delete template
router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.userId;

    // Check if template exists and user owns it
    const existingTemplate = await prisma.template.findUnique({
      where: { id },
      select: { userId: true, name: true }
    });

    if (!existingTemplate) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Template not found'
        }
      });
    }

    if (existingTemplate.userId !== userId) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Access denied'
        }
      });
    }

    await prisma.template.delete({
      where: { id }
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'DELETE',
        entityType: 'TEMPLATE',
        entityId: id,
        userId,
        oldValues: existingTemplate
      }
    });

    res.json({
      success: true,
      data: { message: 'Template deleted successfully' }
    });

  } catch (error) {
    console.error('Delete template error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error'
      }
    });
  }
});

// Duplicate template
router.post('/:id/duplicate', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.userId;

    // Get original template
    const originalTemplate = await prisma.template.findUnique({
      where: { id }
    });

    if (!originalTemplate) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Template not found'
        }
      });
    }

    // Check if user can access this template
    if (!originalTemplate.isPublic && originalTemplate.userId !== userId) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Access denied'
        }
      });
    }

    // Create duplicate
    const duplicatedTemplate = await prisma.template.create({
      data: {
        name: `${originalTemplate.name} (Copy)`,
        description: originalTemplate.description,
        category: originalTemplate.category,
        data: originalTemplate.data,
        isPublic: false, // Duplicates are always private
        tags: originalTemplate.tags,
        userId
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'DUPLICATE',
        entityType: 'TEMPLATE',
        entityId: duplicatedTemplate.id,
        userId,
        newValues: duplicatedTemplate,
        oldValues: { originalTemplateId: id }
      }
    });

    res.status(201).json({
      success: true,
      data: { template: duplicatedTemplate }
    });

  } catch (error) {
    console.error('Duplicate template error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error'
      }
    });
  }
});

// Get template categories
router.get('/categories/list', async (req: Request, res: Response) => {
  try {
    const categories = await prisma.template.findMany({
      where: {
        OR: [
          { isPublic: true },
          { userId: (req as any).user?.userId }
        ]
      },
      select: {
        category: true
      },
      distinct: ['category']
    });

    const categoryList = categories.map(c => c.category);

    res.json({
      success: true,
      data: { categories: categoryList }
    });

  } catch (error) {
    console.error('Get template categories error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error'
      }
    });
  }
});

// Toggle template visibility (public/private)
router.patch('/:id/visibility', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isPublic } = req.body;
    const userId = (req as any).user?.userId;

    // Check if template exists and user owns it
    const existingTemplate = await prisma.template.findUnique({
      where: { id },
      select: { userId: true }
    });

    if (!existingTemplate) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Template not found'
        }
      });
    }

    if (existingTemplate.userId !== userId) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Access denied'
        }
      });
    }

    const template = await prisma.template.update({
      where: { id },
      data: { isPublic },
      select: {
        id: true,
        name: true,
        isPublic: true,
        userId: true
      }
    });

    res.json({
      success: true,
      data: { template }
    });

  } catch (error) {
    console.error('Toggle template visibility error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error'
      }
    });
  }
});

export { router as templateRoutes };