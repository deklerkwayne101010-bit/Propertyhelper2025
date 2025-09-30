import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, requireAuth } from '@/middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get all listings (public facing)
router.get('/', async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      propertyType,
      city,
      province,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      featured = false
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    // Build where clause for active listings only
    const where: any = {
      status: 'ACTIVE'
    };

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

    // Featured listings (for homepage showcase)
    if (featured === 'true') {
      where.featured = true;
    }

    const [listings, total] = await Promise.all([
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
              phone: true,
              avatar: true
            }
          },
          _count: {
            select: {
              leads: true,
              deals: true
            }
          }
        },
        orderBy: featured === 'true'
          ? { createdAt: 'desc' } // For featured, just show recent
          : { [sortBy as string]: sortOrder as 'asc' | 'desc' },
        skip: offset,
        take: limitNum
      }),
      prisma.property.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        listings,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      }
    });

  } catch (error) {
    console.error('Get listings error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error'
      }
    });
  }
});

// Get featured listings for homepage
router.get('/featured', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 6;

    const featuredListings = await prisma.property.findMany({
      where: {
        status: 'ACTIVE',
        featured: true
      },
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
            phone: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    });

    res.json({
      success: true,
      data: { listings: featuredListings }
    });

  } catch (error) {
    console.error('Get featured listings error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error'
      }
    });
  }
});

// Get listings by location
router.get('/location/:location', async (req: Request, res: Response) => {
  try {
    const { location } = req.params;
    const {
      page = 1,
      limit = 10,
      propertyType
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    const where: any = {
      status: 'ACTIVE',
      OR: [
        { city: { contains: location, mode: 'insensitive' } },
        { province: { contains: location, mode: 'insensitive' } }
      ]
    };

    if (propertyType) {
      where.propertyType = propertyType as string;
    }

    const [listings, total] = await Promise.all([
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
              phone: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limitNum
      }),
      prisma.property.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        listings,
        location,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      }
    });

  } catch (error) {
    console.error('Get listings by location error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error'
      }
    });
  }
});

// Search listings with advanced filters
router.get('/search/advanced', async (req: Request, res: Response) => {
  try {
    const {
      q: searchQuery,
      propertyType,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      garages,
      minFloorSize,
      maxFloorSize,
      yearBuilt,
      city,
      province,
      features,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    const where: any = {
      status: 'ACTIVE'
    };

    // Text search
    if (searchQuery) {
      where.OR = [
        { title: { contains: searchQuery as string, mode: 'insensitive' } },
        { description: { contains: searchQuery as string, mode: 'insensitive' } },
        { address: { contains: searchQuery as string, mode: 'insensitive' } },
        { city: { contains: searchQuery as string, mode: 'insensitive' } },
        { features: { has: searchQuery as string } }
      ];
    }

    // Property type filter
    if (propertyType) {
      where.propertyType = propertyType as string;
    }

    // Price range
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice as string);
      if (maxPrice) where.price.lte = parseFloat(maxPrice as string);
    }

    // Bedrooms
    if (bedrooms) {
      where.bedrooms = parseInt(bedrooms as string);
    }

    // Bathrooms
    if (bathrooms) {
      where.bathrooms = parseFloat(bathrooms as string);
    }

    // Garages
    if (garages) {
      where.garages = parseInt(garages as string);
    }

    // Floor size range
    if (minFloorSize || maxFloorSize) {
      where.floorSize = {};
      if (minFloorSize) where.floorSize.gte = parseFloat(minFloorSize as string);
      if (maxFloorSize) where.floorSize.lte = parseFloat(maxFloorSize as string);
    }

    // Year built
    if (yearBuilt) {
      where.yearBuilt = parseInt(yearBuilt as string);
    }

    // Location filters
    if (city) {
      where.city = { contains: city as string, mode: 'insensitive' };
    }
    if (province) {
      where.province = { contains: province as string, mode: 'insensitive' };
    }

    // Features array search
    if (features) {
      const featureList = (features as string).split(',');
      where.features = { hasSome: featureList };
    }

    const [listings, total] = await Promise.all([
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
              phone: true,
              avatar: true
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
        listings,
        searchCriteria: {
          query: searchQuery,
          filters: {
            propertyType,
            priceRange: { min: minPrice, max: maxPrice },
            bedrooms,
            bathrooms,
            garages,
            floorSize: { min: minFloorSize, max: maxFloorSize },
            yearBuilt,
            location: { city, province },
            features
          }
        },
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      }
    });

  } catch (error) {
    console.error('Advanced search listings error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error'
      }
    });
  }
});

// Get listing statistics
router.get('/stats/summary', async (req: Request, res: Response) => {
  try {
    const [
      totalListings,
      averagePrice,
      propertyTypeCounts,
      locationStats
    ] = await Promise.all([
      prisma.property.count({ where: { status: 'ACTIVE' } }),
      prisma.property.aggregate({
        where: { status: 'ACTIVE' },
        _avg: { price: true }
      }),
      prisma.property.groupBy({
        by: ['propertyType'],
        where: { status: 'ACTIVE' },
        _count: { id: true }
      }),
      prisma.property.groupBy({
        by: ['city'],
        where: { status: 'ACTIVE' },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 10
      })
    ]);

    res.json({
      success: true,
      data: {
        summary: {
          totalListings,
          averagePrice: averagePrice._avg.price || 0,
          propertyTypeBreakdown: propertyTypeCounts.map(ptc => ({
            type: ptc.propertyType,
            count: ptc._count.id
          })),
          topLocations: locationStats.map(ls => ({
            city: ls.city,
            count: ls._count.id
          }))
        }
      }
    });

  } catch (error) {
    console.error('Get listing stats error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error'
      }
    });
  }
});

// Express interest in a listing (create lead)
router.post('/:id/interest', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, phone, message } = req.body;

    // Check if listing exists and is active
    const listing = await prisma.property.findUnique({
      where: { id, status: 'ACTIVE' },
      select: { id: true, title: true, userId: true }
    });

    if (!listing) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Listing not found or not available'
        }
      });
    }

    // Check if lead already exists for this listing and email
    const existingLead = await prisma.lead.findFirst({
      where: {
        propertyId: id,
        email: email,
        status: { not: 'CLOSED_LOST' }
      }
    });

    if (existingLead) {
      return res.status(409).json({
        success: false,
        error: {
          message: 'Interest already expressed for this listing'
        }
      });
    }

    // Create lead (anonymous user or get user ID if authenticated)
    const userId = (req as any).user?.userId;

    const lead = await prisma.lead.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        source: 'WEBSITE',
        notes: message,
        propertyId: id,
        userId: userId || null
      }
    });

    // Create activity log
    await prisma.activity.create({
      data: {
        type: 'NOTE',
        title: 'Interest expressed in listing',
        description: `${firstName} ${lastName} expressed interest in "${listing.title}"`,
        metadata: {
          leadId: lead.id,
          propertyId: id,
          contactInfo: { email, phone }
        },
        userId: userId || lead.id, // Use lead ID if no user
        leadId: lead.id
      }
    });

    res.status(201).json({
      success: true,
      data: {
        lead: {
          id: lead.id,
          firstName: lead.firstName,
          lastName: lead.lastName,
          status: lead.status,
          createdAt: lead.createdAt
        },
        message: 'Interest expressed successfully'
      }
    });

  } catch (error) {
    console.error('Express interest error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error'
      }
    });
  }
});

export { router as listingRoutes };