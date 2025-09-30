import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, requireAuth } from '@/middleware/auth';
import { validateBody, creditPurchaseSchema } from '@/validation/schemas';

const router = Router();
const prisma = new PrismaClient();

// Get user credits
router.get('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;

    const credits = await prisma.credit.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    // Calculate current balance
    const balance = credits.reduce((acc, credit) => {
      return acc + (credit.type === 'USAGE' ? -credit.amount : credit.amount);
    }, 0);

    res.json({
      success: true,
      data: {
        credits,
        balance,
        summary: {
          totalEarned: credits
            .filter(c => c.type !== 'USAGE')
            .reduce((acc, c) => acc + c.amount, 0),
          totalUsed: credits
            .filter(c => c.type === 'USAGE')
            .reduce((acc, c) => acc + c.amount, 0),
          currentBalance: balance
        }
      }
    });

  } catch (error) {
    console.error('Get credits error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error'
      }
    });
  }
});

// Purchase credits (legacy endpoint - redirects to new payment system)
router.post('/purchase', authenticateToken, validateBody(creditPurchaseSchema), async (req: Request, res: Response) => {
  try {
    const { amount, paymentMethod } = req.body;
    const userId = (req as any).user?.userId;

    // Find a package that matches the requested amount (approximate match)
    const creditPackage = await prisma.creditPackage.findFirst({
      where: {
        credits: amount,
        isActive: true
      },
      orderBy: { price: 'asc' }
    });

    if (!creditPackage) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'No matching credit package found. Please use the new payment system.'
        }
      });
    }

    // Redirect to new payment system
    res.status(201).json({
      success: true,
      data: {
        message: 'Please use the new payment system at /api/payments/create',
        redirectTo: '/api/payments/create',
        package: creditPackage
      }
    });

  } catch (error) {
    console.error('Purchase credits error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error'
      }
    });
  }
});

// Use credits
router.post('/use', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { amount, description, entityType, entityId } = req.body;
    const userId = (req as any).user?.userId;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Valid amount is required'
        }
      });
    }

    // Get current balance
    const credits = await prisma.credit.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' }
    });

    const currentBalance = credits.reduce((acc, credit) => {
      return acc + (credit.type === 'USAGE' ? -credit.amount : credit.amount);
    }, 0);

    if (currentBalance < amount) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Insufficient credits'
        }
      });
    }

    // Create usage credit record
    const usageCredit = await prisma.credit.create({
      data: {
        amount,
        balance: -amount, // Negative for usage
        type: 'USAGE',
        description: description || 'Credit usage',
        userId
      }
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'USAGE',
        entityType: entityType || 'CREDIT',
        entityId: entityId || usageCredit.id,
        userId,
        newValues: usageCredit
      }
    });

    res.json({
      success: true,
      data: {
        credit: usageCredit,
        remainingBalance: currentBalance - amount,
        message: 'Credits used successfully'
      }
    });

  } catch (error) {
    console.error('Use credits error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error'
      }
    });
  }
});

// Add bonus credits (admin only)
router.post('/bonus', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { userId: targetUserId, amount, description } = req.body;
    const currentUserId = (req as any).user?.userId;

    // Check if current user is admin
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

    if (!targetUserId || !amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Valid user ID and amount are required'
        }
      });
    }

    // Create bonus credit record
    const bonusCredit = await prisma.credit.create({
      data: {
        amount,
        balance: amount,
        type: 'BONUS',
        description: description || 'Bonus credits',
        userId: targetUserId
      }
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'BONUS',
        entityType: 'CREDIT',
        entityId: bonusCredit.id,
        userId: currentUserId,
        newValues: bonusCredit
      }
    });

    res.status(201).json({
      success: true,
      data: {
        credit: bonusCredit,
        message: 'Bonus credits added successfully'
      }
    });

  } catch (error) {
    console.error('Add bonus credits error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error'
      }
    });
  }
});

// Refund credits (admin only)
router.post('/refund', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { userId: targetUserId, amount, description } = req.body;
    const currentUserId = (req as any).user?.userId;

    // Check if current user is admin
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

    if (!targetUserId || !amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Valid user ID and amount are required'
        }
      });
    }

    // Create refund credit record
    const refundCredit = await prisma.credit.create({
      data: {
        amount,
        balance: amount,
        type: 'REFUND',
        description: description || 'Credit refund',
        userId: targetUserId
      }
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'REFUND',
        entityType: 'CREDIT',
        entityId: refundCredit.id,
        userId: currentUserId,
        newValues: refundCredit
      }
    });

    res.status(201).json({
      success: true,
      data: {
        credit: refundCredit,
        message: 'Credits refunded successfully'
      }
    });

  } catch (error) {
    console.error('Refund credits error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error'
      }
    });
  }
});

// Get credit packages/pricing (legacy endpoint - redirects to new packages API)
router.get('/packages', async (req: Request, res: Response) => {
  try {
    // Redirect to new packages API
    res.json({
      success: true,
      data: {
        message: 'Please use the new packages API at /api/packages',
        redirectTo: '/api/packages'
      }
    });

  } catch (error) {
    console.error('Get credit packages error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error'
      }
    });
  }
});

// Get credit usage history
router.get('/usage-history', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    const {
      page = 1,
      limit = 20,
      type
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    const where: any = { userId };
    if (type) {
      where.type = type as string;
    }

    const [credits, total] = await Promise.all([
      prisma.credit.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limitNum
      }),
      prisma.credit.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        credits,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      }
    });

  } catch (error) {
    console.error('Get credit usage history error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error'
      }
    });
  }
});

export { router as creditRoutes };