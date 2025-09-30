import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '@/middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Validate promo code
router.post('/validate', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { code, packageId } = req.body;
    const userId = (req as any).user?.userId;

    if (!code) {
      return res.status(400).json({
        success: false,
        error: { message: 'Promo code is required' }
      });
    }

    const promoCode = await prisma.promoCode.findUnique({
      where: { code: code.toUpperCase() }
    });

    if (!promoCode || !promoCode.isActive) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid promo code' }
      });
    }

    if (promoCode.expiresAt && promoCode.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        error: { message: 'Promo code has expired' }
      });
    }

    if (promoCode.maxUses && promoCode.usedCount >= promoCode.maxUses) {
      return res.status(400).json({
        success: false,
        error: { message: 'Promo code usage limit exceeded' }
      });
    }

    // Check if user has already used this promo code
    const existingUsage = await prisma.transaction.count({
      where: {
        userId,
        promoCodeId: promoCode.id,
        status: 'COMPLETED'
      }
    });

    if (existingUsage > 0) {
      return res.status(400).json({
        success: false,
        error: { message: 'Promo code already used by this user' }
      });
    }

    // Get package price for discount calculation
    let packagePrice = 0;
    if (packageId) {
      const creditPackage = await prisma.creditPackage.findUnique({
        where: { id: packageId }
      });
      packagePrice = creditPackage?.price || 0;
    }

    // Calculate discount
    let discountAmount = 0;
    if (promoCode.discountType === 'PERCENTAGE') {
      discountAmount = (packagePrice * promoCode.discountValue) / 100;
    } else {
      discountAmount = Math.min(promoCode.discountValue, packagePrice);
    }

    res.json({
      success: true,
      data: {
        promoCode: {
          id: promoCode.id,
          code: promoCode.code,
          description: promoCode.description,
          discountType: promoCode.discountType,
          discountValue: promoCode.discountValue,
          discountAmount,
          expiresAt: promoCode.expiresAt
        }
      }
    });

  } catch (error) {
    console.error('Validate promo code error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to validate promo code' }
    });
  }
});

// Get all promo codes (admin only)
router.get('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const currentUserId = (req as any).user?.userId;

    // Check if current user is admin
    const currentUser = await prisma.user.findUnique({
      where: { id: currentUserId },
      select: { role: true }
    });

    if (currentUser?.role !== 'ADMIN' && currentUser?.role !== 'SUPER_ADMIN') {
      return res.status(403).json({
        success: false,
        error: { message: 'Access denied' }
      });
    }

    const { page = 1, limit = 20, active } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    const where: any = {};
    if (active !== undefined) {
      where.isActive = active === 'true';
    }

    const [promoCodes, total] = await Promise.all([
      prisma.promoCode.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limitNum,
        include: {
          _count: {
            select: { transactions: true }
          }
        }
      }),
      prisma.promoCode.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        promoCodes,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      }
    });

  } catch (error) {
    console.error('Get promo codes error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch promo codes' }
    });
  }
});

// Create promo code (admin only)
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const currentUserId = (req as any).user?.userId;

    // Check if current user is admin
    const currentUser = await prisma.user.findUnique({
      where: { id: currentUserId },
      select: { role: true }
    });

    if (currentUser?.role !== 'ADMIN' && currentUser?.role !== 'SUPER_ADMIN') {
      return res.status(403).json({
        success: false,
        error: { message: 'Access denied' }
      });
    }

    const { code, description, discountType, discountValue, maxUses, expiresAt } = req.body;

    if (!code || !discountType || discountValue === undefined) {
      return res.status(400).json({
        success: false,
        error: { message: 'Code, discount type, and discount value are required' }
      });
    }

    // Check if code already exists
    const existingCode = await prisma.promoCode.findUnique({
      where: { code: code.toUpperCase() }
    });

    if (existingCode) {
      return res.status(400).json({
        success: false,
        error: { message: 'Promo code already exists' }
      });
    }

    const promoCode = await prisma.promoCode.create({
      data: {
        code: code.toUpperCase(),
        description,
        discountType,
        discountValue: parseFloat(discountValue),
        maxUses: maxUses ? parseInt(maxUses) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      }
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'CREATE',
        entityType: 'PROMO_CODE',
        entityId: promoCode.id,
        userId: currentUserId,
        newValues: promoCode
      }
    });

    res.status(201).json({
      success: true,
      data: { promoCode }
    });

  } catch (error) {
    console.error('Create promo code error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to create promo code' }
    });
  }
});

// Update promo code (admin only)
router.put('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const currentUserId = (req as any).user?.userId;

    // Check if current user is admin
    const currentUser = await prisma.user.findUnique({
      where: { id: currentUserId },
      select: { role: true }
    });

    if (currentUser?.role !== 'ADMIN' && currentUser?.role !== 'SUPER_ADMIN') {
      return res.status(403).json({
        success: false,
        error: { message: 'Access denied' }
      });
    }

    const existingPromoCode = await prisma.promoCode.findUnique({
      where: { id }
    });

    if (!existingPromoCode) {
      return res.status(404).json({
        success: false,
        error: { message: 'Promo code not found' }
      });
    }

    const { description, discountType, discountValue, maxUses, isActive, expiresAt } = req.body;

    const updatedPromoCode = await prisma.promoCode.update({
      where: { id },
      data: {
        description,
        discountType,
        discountValue: discountValue ? parseFloat(discountValue) : undefined,
        maxUses: maxUses ? parseInt(maxUses) : null,
        isActive,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      }
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'UPDATE',
        entityType: 'PROMO_CODE',
        entityId: updatedPromoCode.id,
        userId: currentUserId,
        oldValues: existingPromoCode,
        newValues: updatedPromoCode
      }
    });

    res.json({
      success: true,
      data: { promoCode: updatedPromoCode }
    });

  } catch (error) {
    console.error('Update promo code error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to update promo code' }
    });
  }
});

// Delete promo code (admin only)
router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const currentUserId = (req as any).user?.userId;

    // Check if current user is admin
    const currentUser = await prisma.user.findUnique({
      where: { id: currentUserId },
      select: { role: true }
    });

    if (currentUser?.role !== 'ADMIN' && currentUser?.role !== 'SUPER_ADMIN') {
      return res.status(403).json({
        success: false,
        error: { message: 'Access denied' }
      });
    }

    const existingPromoCode = await prisma.promoCode.findUnique({
      where: { id }
    });

    if (!existingPromoCode) {
      return res.status(404).json({
        success: false,
        error: { message: 'Promo code not found' }
      });
    }

    // Check if promo code has been used
    const usageCount = await prisma.transaction.count({
      where: { promoCodeId: id }
    });

    if (usageCount > 0) {
      // Soft delete - mark as inactive instead of deleting
      await prisma.promoCode.update({
        where: { id },
        data: { isActive: false }
      });
    } else {
      // Hard delete if not used
      await prisma.promoCode.delete({
        where: { id }
      });
    }

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'DELETE',
        entityType: 'PROMO_CODE',
        entityId: id,
        userId: currentUserId,
        oldValues: existingPromoCode
      }
    });

    res.json({
      success: true,
      message: 'Promo code deleted successfully'
    });

  } catch (error) {
    console.error('Delete promo code error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to delete promo code' }
    });
  }
});

export { router as promoCodeRoutes };