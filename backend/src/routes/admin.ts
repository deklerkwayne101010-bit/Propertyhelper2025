import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, requireAdmin } from '@/middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Apply authentication and admin role requirement to all admin routes
router.use(authenticateToken);
router.use(requireAdmin);

// Dashboard analytics endpoint
router.get('/dashboard', async (req, res) => {
  try {
    // Get user statistics
    const totalUsers = await prisma.user.count();
    const activeUsers = await prisma.user.count({
      where: { isActive: true }
    });

    // Get property statistics
    const totalProperties = await prisma.property.count();
    const activeProperties = await prisma.property.count({
      where: { status: 'ACTIVE' }
    });

    // Get template statistics
    const totalTemplates = await prisma.template.count();

    // Get credit/transaction statistics
    const totalCredits = await prisma.credit.aggregate({
      _sum: { amount: true }
    });

    const totalRevenue = await prisma.transaction.aggregate({
      where: { status: 'COMPLETED' },
      _sum: { amount: true }
    });

    // Get recent activities (last 24 hours)
    const recentActivities = await prisma.auditLog.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { firstName: true, lastName: true, email: true }
        }
      }
    });

    // Get system health metrics
    const systemHealth = {
      database: { status: 'healthy', uptime: '99.9%', responseTime: '45ms' },
      api: { status: 'healthy', responseTime: '120ms' },
      storage: { status: 'healthy', usage: '67%' },
      ai: { status: 'healthy', message: 'All services operational' }
    };

    // Get AI usage statistics (mock for now)
    const aiGenerations = 1250;

    res.json({
      stats: {
        totalUsers,
        activeUsers,
        totalProperties,
        activeProperties,
        totalTemplates,
        aiGenerations,
        totalCredits: totalCredits._sum.amount || 0,
        revenue: totalRevenue._sum.amount || 0
      },
      recentActivities: recentActivities.map(activity => ({
        id: activity.id,
        action: activity.action,
        entityType: activity.entityType,
        user: activity.user ? `${activity.user.firstName} ${activity.user.lastName}` : 'System',
        timestamp: activity.createdAt.toISOString(),
        severity: activity.action.includes('DELETE') ? 'warning' : 'info'
      })),
      systemHealth
    });
  } catch (error) {
    console.error('Dashboard analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// User management endpoints
router.get('/users', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      role,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};
    if (search) {
      where.OR = [
        { email: { contains: search as string, mode: 'insensitive' } },
        { firstName: { contains: search as string, mode: 'insensitive' } },
        { lastName: { contains: search as string, mode: 'insensitive' } }
      ];
    }
    if (role) where.role = role;
    if (status === 'active') where.isActive = true;
    if (status === 'inactive') where.isActive = false;

    const users = await prisma.user.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { [sortBy as string]: sortOrder },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        isVerified: true,
        lastLogin: true,
        createdAt: true,
        _count: {
          select: {
            properties: true,
            templates: true,
            credits: true
          }
        }
      }
    });

    const total = await prisma.user.count({ where });

    res.json({
      users,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Users fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { role, isActive, firstName, lastName } = req.body;

    const user = await prisma.user.update({
      where: { id },
      data: { role, isActive, firstName, lastName },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        isVerified: true
      }
    });

    // Log the action
    await prisma.auditLog.create({
      data: {
        action: 'USER_UPDATE',
        entityType: 'USER',
        entityId: id,
        newValues: { role, isActive, firstName, lastName },
        userId: (req as any).user.id
      }
    });

    res.json(user);
  } catch (error) {
    console.error('User update error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({ where: { id } });

    // Log the action
    await prisma.auditLog.create({
      data: {
        action: 'USER_DELETE',
        entityType: 'USER',
        entityId: id,
        userId: (req as any).user.id
      }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('User delete error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Bulk user operations
router.post('/users/bulk', async (req, res) => {
  try {
    const { action, userIds } = req.body;

    if (action === 'activate') {
      await prisma.user.updateMany({
        where: { id: { in: userIds } },
        data: { isActive: true }
      });
    } else if (action === 'deactivate') {
      await prisma.user.updateMany({
        where: { id: { in: userIds } },
        data: { isActive: false }
      });
    } else if (action === 'delete') {
      await prisma.user.deleteMany({
        where: { id: { in: userIds } }
      });
    }

    // Log bulk action
    await prisma.auditLog.create({
      data: {
        action: `USER_BULK_${action.toUpperCase()}`,
        entityType: 'USER',
        entityId: userIds.join(','),
        userId: (req as any).user.id
      }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Bulk user operation error:', error);
    res.status(500).json({ error: 'Failed to perform bulk operation' });
  }
});

// Asset management endpoints
router.get('/assets', async (req, res) => {
  try {
    const { type, category } = req.query;

    // For now, return mock data - in real implementation, you'd have asset tables
    const assets = [
      {
        id: '1',
        name: 'Modern House Template',
        type: 'template',
        category: 'residential',
        url: '/assets/templates/modern-house.json',
        thumbnail: '/assets/thumbnails/modern-house.png',
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        name: 'For Sale Sticker',
        type: 'sticker',
        category: 'marketing',
        url: '/assets/stickers/for-sale.png',
        thumbnail: '/assets/stickers/for-sale-thumb.png',
        createdAt: new Date().toISOString()
      }
    ];

    res.json({ assets });
  } catch (error) {
    console.error('Assets fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch assets' });
  }
});

// Pricing and promo code management
router.get('/packages', async (req, res) => {
  try {
    const packages = await prisma.creditPackage.findMany({
      orderBy: { sortOrder: 'asc' }
    });
    res.json({ packages });
  } catch (error) {
    console.error('Packages fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch packages' });
  }
});

router.post('/packages', async (req, res) => {
  try {
    const { name, description, credits, price, currency, isActive, isPopular, sortOrder } = req.body;

    const package_ = await prisma.creditPackage.create({
      data: {
        name,
        description,
        credits: Number(credits),
        price: Number(price),
        currency,
        isActive: Boolean(isActive),
        isPopular: Boolean(isPopular),
        sortOrder: Number(sortOrder)
      }
    });

    await prisma.auditLog.create({
      data: {
        action: 'PACKAGE_CREATE',
        entityType: 'CREDIT_PACKAGE',
        entityId: package_.id,
        newValues: req.body,
        userId: (req as any).user.id
      }
    });

    res.json(package_);
  } catch (error) {
    console.error('Package create error:', error);
    res.status(500).json({ error: 'Failed to create package' });
  }
});

router.put('/packages/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, credits, price, currency, isActive, isPopular, sortOrder } = req.body;

    const package_ = await prisma.creditPackage.update({
      where: { id },
      data: {
        name,
        description,
        credits: Number(credits),
        price: Number(price),
        currency,
        isActive: Boolean(isActive),
        isPopular: Boolean(isPopular),
        sortOrder: Number(sortOrder)
      }
    });

    await prisma.auditLog.create({
      data: {
        action: 'PACKAGE_UPDATE',
        entityType: 'CREDIT_PACKAGE',
        entityId: id,
        newValues: req.body,
        userId: (req as any).user.id
      }
    });

    res.json(package_);
  } catch (error) {
    console.error('Package update error:', error);
    res.status(500).json({ error: 'Failed to update package' });
  }
});

// Promo codes
router.get('/promocodes', async (req, res) => {
  try {
    const promoCodes = await prisma.promoCode.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json({ promoCodes });
  } catch (error) {
    console.error('Promo codes fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch promo codes' });
  }
});

router.post('/promocodes', async (req, res) => {
  try {
    const { code, description, discountType, discountValue, maxUses, expiresAt } = req.body;

    const promoCode = await prisma.promoCode.create({
      data: {
        code,
        description,
        discountType,
        discountValue: Number(discountValue),
        maxUses: maxUses ? Number(maxUses) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null
      }
    });

    await prisma.auditLog.create({
      data: {
        action: 'PROMO_CODE_CREATE',
        entityType: 'PROMO_CODE',
        entityId: promoCode.id,
        newValues: req.body,
        userId: (req as any).user.id
      }
    });

    res.json(promoCode);
  } catch (error) {
    console.error('Promo code create error:', error);
    res.status(500).json({ error: 'Failed to create promo code' });
  }
});

// Billing and transactions
router.get('/transactions', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      paymentMethod,
      dateFrom,
      dateTo
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};
    if (status) where.status = status;
    if (paymentMethod) where.paymentMethod = paymentMethod;
    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = new Date(dateFrom as string);
      if (dateTo) where.createdAt.lte = new Date(dateTo as string);
    }

    const transactions = await prisma.transaction.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { email: true, firstName: true, lastName: true }
        },
        package: true,
        promoCode: true,
        credits: true
      }
    });

    const total = await prisma.transaction.count({ where });

    const revenue = await prisma.transaction.aggregate({
      where: { ...where, status: 'COMPLETED' },
      _sum: { amount: true }
    });

    res.json({
      transactions,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      },
      summary: {
        totalRevenue: revenue._sum.amount || 0,
        totalTransactions: total
      }
    });
  } catch (error) {
    console.error('Transactions fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Audit logs
router.get('/audit-logs', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      action,
      entityType,
      userId,
      dateFrom,
      dateTo
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};
    if (action) where.action = action;
    if (entityType) where.entityType = entityType;
    if (userId) where.userId = userId;
    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = new Date(dateFrom as string);
      if (dateTo) where.createdAt.lte = new Date(dateTo as string);
    }

    const auditLogs = await prisma.auditLog.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { email: true, firstName: true, lastName: true }
        }
      }
    });

    const total = await prisma.auditLog.count({ where });

    res.json({
      auditLogs,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Audit logs fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
});

// System monitoring
router.get('/system/health', async (req, res) => {
  try {
    // Mock system health data - in real implementation, you'd check actual services
    const health = {
      database: {
        status: 'healthy',
        uptime: '99.9%',
        responseTime: '45ms',
        connections: 12
      },
      api: {
        status: 'healthy',
        responseTime: '120ms',
        requestsPerMinute: 245
      },
      storage: {
        status: 'healthy',
        usage: '67%',
        totalSpace: '100GB',
        usedSpace: '67GB'
      },
      ai: {
        status: 'healthy',
        message: 'All AI services operational',
        queueLength: 3,
        processingTime: '2.3s'
      },
      timestamp: new Date().toISOString()
    };

    res.json(health);
  } catch (error) {
    console.error('System health error:', error);
    res.status(500).json({ error: 'Failed to fetch system health' });
  }
});

// Portal mapping configuration (mock for now)
router.get('/portal-mappings', async (req, res) => {
  try {
    const mappings = [
      {
        id: '1',
        portal: 'Property24',
        fieldMappings: {
          title: 'property.title',
          description: 'property.description',
          price: 'property.price',
          address: 'property.address',
          bedrooms: 'property.bedrooms',
          bathrooms: 'property.bathrooms'
        },
        lastSync: new Date().toISOString(),
        status: 'active'
      }
    ];

    res.json({ mappings });
  } catch (error) {
    console.error('Portal mappings fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch portal mappings' });
  }
});

export { router as adminRoutes };