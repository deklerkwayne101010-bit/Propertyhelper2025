import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '@/middleware/auth';
import { validateBody } from '@/validation/schemas';

const router = Router();
const prisma = new PrismaClient();

// Get all active credit packages
router.get('/', async (req: Request, res: Response) => {
  try {
    const packages = await prisma.creditPackage.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' }
    });

    res.json({
      success: true,
      data: { packages }
    });

  } catch (error) {
    console.error('Get credit packages error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch credit packages' }
    });
  }
});

// Get credit package by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const packageData = await prisma.creditPackage.findUnique({
      where: { id }
    });

    if (!packageData) {
      return res.status(404).json({
        success: false,
        error: { message: 'Credit package not found' }
      });
    }

    res.json({
      success: true,
      data: { package: packageData }
    });

  } catch (error) {
    console.error('Get credit package error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch credit package' }
    });
  }
});

// Create credit package (admin only)
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

    const { name, description, credits, price, currency, isPopular, sortOrder } = req.body;

    if (!name || !credits || !price) {
      return res.status(400).json({
        success: false,
        error: { message: 'Name, credits, and price are required' }
      });
    }

    const packageData = await prisma.creditPackage.create({
      data: {
        name,
        description,
        credits: parseInt(credits),
        price: parseFloat(price),
        currency: currency || 'ZAR',
        isPopular: isPopular || false,
        sortOrder: sortOrder || 0,
      }
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'CREATE',
        entityType: 'CREDIT_PACKAGE',
        entityId: packageData.id,
        userId: currentUserId,
        newValues: packageData
      }
    });

    res.status(201).json({
      success: true,
      data: { package: packageData }
    });

  } catch (error) {
    console.error('Create credit package error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to create credit package' }
    });
  }
});

// Update credit package (admin only)
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

    const existingPackage = await prisma.creditPackage.findUnique({
      where: { id }
    });

    if (!existingPackage) {
      return res.status(404).json({
        success: false,
        error: { message: 'Credit package not found' }
      });
    }

    const { name, description, credits, price, currency, isActive, isPopular, sortOrder } = req.body;

    const updatedPackage = await prisma.creditPackage.update({
      where: { id },
      data: {
        name,
        description,
        credits: credits ? parseInt(credits) : undefined,
        price: price ? parseFloat(price) : undefined,
        currency,
        isActive,
        isPopular,
        sortOrder,
      }
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'UPDATE',
        entityType: 'CREDIT_PACKAGE',
        entityId: updatedPackage.id,
        userId: currentUserId,
        oldValues: existingPackage,
        newValues: updatedPackage
      }
    });

    res.json({
      success: true,
      data: { package: updatedPackage }
    });

  } catch (error) {
    console.error('Update credit package error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to update credit package' }
    });
  }
});

// Delete credit package (admin only)
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

    const existingPackage = await prisma.creditPackage.findUnique({
      where: { id }
    });

    if (!existingPackage) {
      return res.status(404).json({
        success: false,
        error: { message: 'Credit package not found' }
      });
    }

    // Check if package has associated transactions
    const transactionCount = await prisma.transaction.count({
      where: { packageId: id }
    });

    if (transactionCount > 0) {
      // Soft delete - mark as inactive instead of deleting
      await prisma.creditPackage.update({
        where: { id },
        data: { isActive: false }
      });
    } else {
      // Hard delete if no transactions
      await prisma.creditPackage.delete({
        where: { id }
      });
    }

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'DELETE',
        entityType: 'CREDIT_PACKAGE',
        entityId: id,
        userId: currentUserId,
        oldValues: existingPackage
      }
    });

    res.json({
      success: true,
      message: 'Credit package deleted successfully'
    });

  } catch (error) {
    console.error('Delete credit package error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to delete credit package' }
    });
  }
});

// Get all credit packages (admin only - including inactive)
router.get('/admin/all', authenticateToken, async (req: Request, res: Response) => {
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

    const packages = await prisma.creditPackage.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: {
          select: { transactions: true }
        }
      }
    });

    res.json({
      success: true,
      data: { packages }
    });

  } catch (error) {
    console.error('Get all credit packages error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch credit packages' }
    });
  }
});

export { router as packageRoutes };