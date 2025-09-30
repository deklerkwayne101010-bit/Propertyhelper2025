import { Router, Request, Response } from 'express';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '@/middleware/auth';
import { validateBody } from '@/validation/schemas';

const router = Router();
const prisma = new PrismaClient();

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-08-27.basil',
});

// Create payment intent/session
router.post('/create', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { amount, paymentMethod, creditPackageId, promoCode, successUrl, cancelUrl } = req.body;
    const userId = (req as any).user?.userId;

    if (!amount || !paymentMethod || !creditPackageId) {
      return res.status(400).json({
        success: false,
        error: { message: 'Amount, payment method, and credit package ID are required' }
      });
    }

    // Get credit package details
    const creditPackage = await prisma.creditPackage.findUnique({
      where: { id: creditPackageId }
    });

    if (!creditPackage || !creditPackage.isActive) {
      return res.status(404).json({
        success: false,
        error: { message: 'Credit package not found or inactive' }
      });
    }

    // Validate amount matches package price
    if (Math.abs(amount - creditPackage.price) > 0.01) {
      return res.status(400).json({
        success: false,
        error: { message: 'Payment amount does not match package price' }
      });
    }

    // Check for promo code and calculate discount
    let discountAmount = 0;
    let promoCodeRecord = null;

    if (promoCode) {
      promoCodeRecord = await prisma.promoCode.findUnique({
        where: { code: promoCode }
      });

      if (!promoCodeRecord || !promoCodeRecord.isActive) {
        return res.status(400).json({
          success: false,
          error: { message: 'Invalid or inactive promo code' }
        });
      }

      if (promoCodeRecord.expiresAt && promoCodeRecord.expiresAt < new Date()) {
        return res.status(400).json({
          success: false,
          error: { message: 'Promo code has expired' }
        });
      }

      if (promoCodeRecord.maxUses && promoCodeRecord.usedCount >= promoCodeRecord.maxUses) {
        return res.status(400).json({
          success: false,
          error: { message: 'Promo code usage limit exceeded' }
        });
      }

      // Calculate discount
      if (promoCodeRecord.discountType === 'PERCENTAGE') {
        discountAmount = (amount * promoCodeRecord.discountValue) / 100;
      } else {
        discountAmount = Math.min(promoCodeRecord.discountValue, amount);
      }
    }

    const finalAmount = Math.max(0, amount - discountAmount);

    // Create transaction record
    const transaction = await prisma.transaction.create({
      data: {
        amount: finalAmount,
        currency: creditPackage.currency,
        status: 'PENDING',
        paymentMethod: paymentMethod as any,
        userId,
        packageId: creditPackageId,
        promoCodeId: promoCodeRecord?.id,
      }
    });

    let paymentData: any = {};

    if (paymentMethod === 'STRIPE') {
      // Create Stripe checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: creditPackage.currency.toLowerCase(),
              product_data: {
                name: creditPackage.name,
                description: creditPackage.description || `${creditPackage.credits} credits`,
              },
              unit_amount: Math.round(finalAmount * 100), // Convert to cents
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: successUrl || `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: cancelUrl || `${process.env.FRONTEND_URL}/payment/cancel`,
        metadata: {
          transactionId: transaction.id,
          userId,
          creditPackageId,
        },
      });

      paymentData = {
        url: session.url,
        sessionId: session.id,
      };

      // Update transaction with gateway ID
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          gatewayId: session.id,
          gatewayData: JSON.parse(JSON.stringify({ session })),
        }
      });

    } else if (paymentMethod === 'PAYFAST') {
      // PayFast integration would go here
      // For now, return placeholder
      paymentData = {
        url: `${process.env.PAYFAST_URL}`,
        formData: {
          merchant_id: process.env.PAYFAST_MERCHANT_ID,
          merchant_key: process.env.PAYFAST_MERCHANT_KEY,
          amount: finalAmount.toFixed(2),
          item_name: creditPackage.name,
          return_url: successUrl,
          cancel_url: cancelUrl,
          notify_url: `${process.env.BACKEND_URL}/api/payments/webhook/payfast`,
          custom_str1: transaction.id,
          custom_str2: userId,
        }
      };
    }

    res.json({
      success: true,
      data: {
        transactionId: transaction.id,
        paymentData,
        discountApplied: discountAmount,
        finalAmount,
      }
    });

  } catch (error) {
    console.error('Create payment error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to create payment' }
    });
  }
});

// Stripe webhook handler
router.post('/webhook/stripe', async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret!);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        await handleStripePaymentSuccess(session);
        break;

      case 'payment_intent.payment_failed':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handleStripePaymentFailure(paymentIntent);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// PayFast ITN (Instant Transaction Notification) handler
router.post('/webhook/payfast', async (req: Request, res: Response) => {
  try {
    const {
      payment_status,
      pf_payment_id,
      amount_gross,
      custom_str1: transactionId,
      custom_str2: userId
    } = req.body;

    if (payment_status === 'COMPLETE') {
      await handlePayFastPaymentSuccess(transactionId, pf_payment_id, parseFloat(amount_gross));
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('PayFast webhook error:', error);
    res.status(500).send('ERROR');
  }
});

// Get payment history
router.get('/history', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    const { page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where: { userId },
        include: {
          package: true,
          promoCode: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limitNum,
      }),
      prisma.transaction.count({ where: { userId } })
    ]);

    res.json({
      success: true,
      data: {
        transactions,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      }
    });

  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch payment history' }
    });
  }
});

// Helper functions
async function handleStripePaymentSuccess(session: Stripe.Checkout.Session) {
  const transactionId = session.metadata?.transactionId;
  const userId = session.metadata?.userId;
  const creditPackageId = session.metadata?.creditPackageId;

  if (!transactionId || !userId || !creditPackageId) {
    throw new Error('Missing required metadata in Stripe session');
  }

  // Update transaction status
  const transaction = await prisma.transaction.update({
    where: { id: transactionId },
    data: {
      status: 'COMPLETED',
      gatewayData: JSON.parse(JSON.stringify({ session })),
      updatedAt: new Date(),
    },
    include: { package: true }
  });

  // Add credits to user account
  if (transaction.package) {
    await prisma.credit.create({
      data: {
        amount: transaction.package.credits,
        balance: transaction.package.credits,
        type: 'PURCHASE',
        description: `Purchase: ${transaction.package.name}`,
        userId,
        transactionId,
      }
    });
  }

  // Update promo code usage if applicable
  if (transaction.promoCodeId) {
    await prisma.promoCode.update({
      where: { id: transaction.promoCodeId },
      data: { usedCount: { increment: 1 } }
    });
  }
}

async function handleStripePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
  // Update transaction status to failed
  await prisma.transaction.updateMany({
    where: { gatewayId: paymentIntent.id },
    data: {
      status: 'FAILED',
      updatedAt: new Date(),
    }
  });
}

async function handlePayFastPaymentSuccess(transactionId: string, paymentId: string, amount: number) {
  // Update transaction status
  const transaction = await prisma.transaction.update({
    where: { id: transactionId },
    data: {
      status: 'COMPLETED',
      gatewayId: paymentId,
      gatewayData: { amount, paymentId },
      updatedAt: new Date(),
    },
    include: { package: true }
  });

  // Add credits to user account
  if (transaction.package) {
    await prisma.credit.create({
      data: {
        amount: transaction.package.credits,
        balance: transaction.package.credits,
        type: 'PURCHASE',
        description: `Purchase: ${transaction.package.name}`,
        userId: transaction.userId,
        transactionId,
      }
    });
  }

  // Update promo code usage if applicable
  if (transaction.promoCodeId) {
    await prisma.promoCode.update({
      where: { id: transaction.promoCodeId },
      data: { usedCount: { increment: 1 } }
    });
  }
}

export { router as paymentRoutes };