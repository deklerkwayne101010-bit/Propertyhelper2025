import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, requireAuth } from '@/middleware/auth';
import { validateBody, propertyCreateSchema, propertyUpdateSchema } from '@/validation/schemas';

const router = Router();
const prisma = new PrismaClient();

// Get all properties with filtering and pagination
router.get('/', async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      propertyType,
      status = 'ACTIVE',
      city,
      province,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      userId
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    // Build where clause
    const where: any = {};

    // Status filter (default to ACTIVE for public, but allow authenticated users to see all)
    if (status === 'ALL') {
      // Show all statuses for authenticated users
    } else if (status) {
      where.status = status as string;
    } else {
      where.status = 'ACTIVE';
    }

    // Search filter
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
        { address: { contains: search as string, mode: 'insensitive' } },
        { city: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    // Other filters
    if (propertyType) {
      where.propertyType = propertyType as string;
    }
    if (city) {
      where.city = { contains: city as string, mode: 'insensitive' };
    }
    if (province) {
      where.province = { contains: province as string, mode: 'insensitive' };
    }
    if (minPrice) {
      where.price = { ...where.price, gte: parseFloat(minPrice as string) };
    }
    if (maxPrice) {
      where.price = { ...where.price, lte: parseFloat(maxPrice as string) };
    }
    if (bedrooms) {
      where.bedrooms = parseInt(bedrooms as string);
    }
    if (bathrooms) {
      where.bathrooms = parseFloat(bathrooms as string);
    }
    if (userId) {
      where.userId = userId as string;
    }

    // Get properties with pagination
    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        include: {
          images: {
            where: { isPrimary: true },
            take: 1
          },
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true
            }
          },
          _count: {
            select: {
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
      prisma.property.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        properties,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      }
    });

  } catch (error) {
    console.error('Get properties error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error'
      }
    });
  }
});

// Get property by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { order: 'asc' }
        },
        documents: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            avatar: true
          }
        },
        leads: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            status: true,
            createdAt: true
          },
          orderBy: { createdAt: 'desc' },
          take: 5
        },
        deals: {
          select: {
            id: true,
            title: true,
            status: true,
            value: true,
            createdAt: true
          },
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      }
    });

    if (!property) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Property not found'
        }
      });
    }

    res.json({
      success: true,
      data: { property }
    });

  } catch (error) {
    console.error('Get property error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error'
      }
    });
  }
});

// Create new property
router.post('/', authenticateToken, validateBody(propertyCreateSchema), async (req: Request, res: Response) => {
  try {
    const propertyData = req.body;
    const userId = (req as any).user?.userId;

    const property = await prisma.property.create({
      data: {
        ...propertyData,
        userId,
        status: propertyData.status || 'DRAFT'
      },
      include: {
        images: true,
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
        entityType: 'PROPERTY',
        entityId: property.id,
        userId,
        newValues: property
      }
    });

    res.status(201).json({
      success: true,
      data: { property }
    });

  } catch (error) {
    console.error('Create property error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error'
      }
    });
  }
});

// Update property
router.put('/:id', authenticateToken, validateBody(propertyUpdateSchema), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const userId = (req as any).user?.userId;

    // Check if property exists and user owns it
    const existingProperty = await prisma.property.findUnique({
      where: { id },
      select: { userId: true }
    });

    if (!existingProperty) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Property not found'
        }
      });
    }

    if (existingProperty.userId !== userId) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Access denied'
        }
      });
    }

    const oldProperty = await prisma.property.findUnique({ where: { id } });

    const property = await prisma.property.update({
      where: { id },
      data: updateData,
      include: {
        images: true,
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
        entityType: 'PROPERTY',
        entityId: property.id,
        userId,
        oldValues: oldProperty,
        newValues: property
      }
    });

    res.json({
      success: true,
      data: { property }
    });

  } catch (error) {
    console.error('Update property error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error'
      }
    });
  }
});

// Delete property
router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.userId;

    // Check if property exists and user owns it
    const existingProperty = await prisma.property.findUnique({
      where: { id },
      select: { userId: true, title: true }
    });

    if (!existingProperty) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Property not found'
        }
      });
    }

    if (existingProperty.userId !== userId) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Access denied'
        }
      });
    }

    // Soft delete by setting status to INACTIVE
    const property = await prisma.property.update({
      where: { id },
      data: { status: 'INACTIVE' }
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'DELETE',
        entityType: 'PROPERTY',
        entityId: property.id,
        userId,
        oldValues: existingProperty,
        newValues: { status: 'INACTIVE' }
      }
    });

    res.json({
      success: true,
      data: { message: 'Property deleted successfully' }
    });

  } catch (error) {
    console.error('Delete property error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error'
      }
    });
  }
});

// Get property statistics
router.get('/:id/stats', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [
      leadsCount,
      dealsCount,
      viewsCount,
      averageValue
    ] = await Promise.all([
      prisma.lead.count({ where: { propertyId: id } }),
      prisma.deal.count({ where: { propertyId: id } }),
      prisma.activity.count({
        where: {
          type: 'VIEWING',
          metadata: {
            path: ['propertyId'],
            equals: id
          }
        }
      }),
      prisma.deal.aggregate({
        where: { propertyId: id },
        _avg: { value: true }
      })
    ]);

    res.json({
      success: true,
      data: {
        stats: {
          leadsCount,
          dealsCount,
          viewsCount,
          averageDealValue: averageValue._avg.value || 0
        }
      }
    });

  } catch (error) {
    console.error('Get property stats error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error'
      }
    });
  }
});

// Add property image
router.post('/:id/images', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { url, alt, isPrimary, order } = req.body;
    const userId = (req as any).user?.userId;

    // Check if property exists and user owns it
    const existingProperty = await prisma.property.findUnique({
      where: { id },
      select: { userId: true }
    });

    if (!existingProperty) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Property not found'
        }
      });
    }

    if (existingProperty.userId !== userId) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Access denied'
        }
      });
    }

    // If this is set as primary, remove primary from other images
    if (isPrimary) {
      await prisma.propertyImage.updateMany({
        where: { propertyId: id },
        data: { isPrimary: false }
      });
    }

    const image = await prisma.propertyImage.create({
      data: {
        url,
        alt: alt || '',
        isPrimary: isPrimary || false,
        order: order || 0,
        propertyId: id
      }
    });

    res.status(201).json({
      success: true,
      data: { image }
    });

  } catch (error) {
    console.error('Add property image error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error'
      }
    });
  }
});

// Remove property image
router.delete('/:id/images/:imageId', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id, imageId } = req.params;
    const userId = (req as any).user?.userId;

    // Check if property exists and user owns it
    const existingProperty = await prisma.property.findUnique({
      where: { id },
      select: { userId: true }
    });

    if (!existingProperty) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Property not found'
        }
      });
    }

    if (existingProperty.userId !== userId) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Access denied'
        }
      });
    }

    await prisma.propertyImage.delete({
      where: { id: imageId, propertyId: id }
    });

    res.json({
      success: true,
      data: { message: 'Image removed successfully' }
    });

  } catch (error) {
    console.error('Remove property image error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error'
      }
    });
  }
});

export { router as propertyRoutes };