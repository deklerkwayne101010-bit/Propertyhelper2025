import request from 'supertest';
import express from 'express';
import { propertyRoutes } from '../../src/routes/properties';

// Mock Prisma
const mockPrisma = {
  property: {
    findMany: jest.fn(),
    count: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  propertyImage: {
    updateMany: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  },
  lead: {
    count: jest.fn(),
  },
  deal: {
    count: jest.fn(),
    aggregate: jest.fn(),
  },
  activity: {
    count: jest.fn(),
  },
  auditLog: {
    create: jest.fn(),
  },
};

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => mockPrisma),
}));

describe('Property Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/properties', propertyRoutes);
    jest.clearAllMocks();
  });

  describe('GET /properties', () => {
    it('should return paginated properties with default filters', async () => {
      const mockProperties = [
        {
          id: 'prop-1',
          title: 'Test Property',
          price: 100000,
          status: 'ACTIVE',
          images: [{ url: 'image1.jpg' }],
          user: { id: 'user-1', firstName: 'John', lastName: 'Doe', email: 'john@test.com', phone: '1234567890' },
          _count: { leads: 5, deals: 2 },
        },
      ];

      mockPrisma.property.findMany.mockResolvedValue(mockProperties);
      mockPrisma.property.count.mockResolvedValue(1);

      const response = await request(app).get('/properties');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.properties).toEqual(mockProperties);
      expect(response.body.data.pagination).toEqual({
        page: 1,
        limit: 10,
        total: 1,
        pages: 1,
      });
      expect(mockPrisma.property.findMany).toHaveBeenCalledWith({
        where: { status: 'ACTIVE' },
        include: expect.any(Object),
        orderBy: { createdAt: 'desc' },
        skip: 0,
        take: 10,
      });
    });

    it('should apply search filter', async () => {
      mockPrisma.property.findMany.mockResolvedValue([]);
      mockPrisma.property.count.mockResolvedValue(0);

      await request(app).get('/properties?search=luxury');

      expect(mockPrisma.property.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: [
              { title: { contains: 'luxury', mode: 'insensitive' } },
              { description: { contains: 'luxury', mode: 'insensitive' } },
              { address: { contains: 'luxury', mode: 'insensitive' } },
              { city: { contains: 'luxury', mode: 'insensitive' } },
            ],
          }),
        })
      );
    });

    it('should apply price range filters', async () => {
      mockPrisma.property.findMany.mockResolvedValue([]);
      mockPrisma.property.count.mockResolvedValue(0);

      await request(app).get('/properties?minPrice=50000&maxPrice=200000');

      expect(mockPrisma.property.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            price: { gte: 50000, lte: 200000 },
          }),
        })
      );
    });

    it('should apply pagination parameters', async () => {
      mockPrisma.property.findMany.mockResolvedValue([]);
      mockPrisma.property.count.mockResolvedValue(100);

      const response = await request(app).get('/properties?page=2&limit=20');

      expect(mockPrisma.property.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 20,
          take: 20,
        })
      );
      expect(response.body.data.pagination.page).toBe(2);
      expect(response.body.data.pagination.limit).toBe(20);
      expect(response.body.data.pagination.pages).toBe(5);
    });
  });

  describe('GET /properties/:id', () => {
    it('should return property by id', async () => {
      const mockProperty = {
        id: 'prop-1',
        title: 'Test Property',
        images: [],
        documents: [],
        user: { id: 'user-1', firstName: 'John', lastName: 'Doe', email: 'john@test.com', phone: '1234567890', avatar: null },
        leads: [],
        deals: [],
      };

      mockPrisma.property.findUnique.mockResolvedValue(mockProperty);

      const response = await request(app).get('/properties/prop-1');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.property).toEqual(mockProperty);
    });

    it('should return 404 for non-existent property', async () => {
      mockPrisma.property.findUnique.mockResolvedValue(null);

      const response = await request(app).get('/properties/non-existent');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toBe('Property not found');
    });
  });

  describe('POST /properties', () => {
    const validPropertyData = {
      title: 'New Property',
      description: 'A beautiful property',
      price: 150000,
      propertyType: 'HOUSE',
      address: '123 Main St',
      city: 'Test City',
      province: 'Test Province',
      bedrooms: 3,
      bathrooms: 2,
    };

    it('should create new property when authenticated', async () => {
      const mockProperty = {
        id: 'new-prop-id',
        ...validPropertyData,
        userId: 'user-1',
        status: 'DRAFT',
        images: [],
        user: { id: 'user-1', firstName: 'John', lastName: 'Doe', email: 'john@test.com' },
      };

      mockPrisma.property.create.mockResolvedValue(mockProperty);
      mockPrisma.auditLog.create.mockResolvedValue({});

      // Mock authentication middleware
      app.use('/properties', (req: any, res, next) => {
        req.user = { userId: 'user-1' };
        next();
      }, propertyRoutes);

      const response = await request(app)
        .post('/properties')
        .send(validPropertyData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.property).toEqual(mockProperty);
      expect(mockPrisma.property.create).toHaveBeenCalledWith({
        data: {
          ...validPropertyData,
          userId: 'user-1',
          status: 'DRAFT',
        },
        include: expect.any(Object),
      });
    });

    it('should return 401 when not authenticated', async () => {
      const response = await request(app)
        .post('/properties')
        .send(validPropertyData);

      expect(response.status).toBe(401);
    });
  });

  describe('PUT /properties/:id', () => {
    const updateData = {
      title: 'Updated Property Title',
      price: 200000,
    };

    it('should update property when user owns it', async () => {
      const mockProperty = {
        id: 'prop-1',
        title: 'Updated Property Title',
        price: 200000,
        images: [],
        user: { id: 'user-1', firstName: 'John', lastName: 'Doe', email: 'john@test.com' },
      };

      mockPrisma.property.findUnique
        .mockResolvedValueOnce({ userId: 'user-1' }) // For ownership check
        .mockResolvedValueOnce({ id: 'prop-1', title: 'Old Title' }); // For old values

      mockPrisma.property.update.mockResolvedValue(mockProperty);
      mockPrisma.auditLog.create.mockResolvedValue({});

      // Mock authentication middleware
      app.use('/properties', (req: any, res, next) => {
        req.user = { userId: 'user-1' };
        next();
      }, propertyRoutes);

      const response = await request(app)
        .put('/properties/prop-1')
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.property.title).toBe('Updated Property Title');
    });

    it('should return 403 when user does not own property', async () => {
      mockPrisma.property.findUnique.mockResolvedValue({ userId: 'different-user' });

      // Mock authentication middleware
      app.use('/properties', (req: any, res, next) => {
        req.user = { userId: 'user-1' };
        next();
      }, propertyRoutes);

      const response = await request(app)
        .put('/properties/prop-1')
        .send(updateData);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toBe('Access denied');
    });

    it('should return 404 for non-existent property', async () => {
      mockPrisma.property.findUnique.mockResolvedValue(null);

      // Mock authentication middleware
      app.use('/properties', (req: any, res, next) => {
        req.user = { userId: 'user-1' };
        next();
      }, propertyRoutes);

      const response = await request(app)
        .put('/properties/non-existent')
        .send(updateData);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toBe('Property not found');
    });
  });

  describe('DELETE /properties/:id', () => {
    it('should soft delete property when user owns it', async () => {
      mockPrisma.property.findUnique.mockResolvedValue({
        userId: 'user-1',
        title: 'Test Property',
      });
      mockPrisma.property.update.mockResolvedValue({ id: 'prop-1', status: 'INACTIVE' });
      mockPrisma.auditLog.create.mockResolvedValue({});

      // Mock authentication middleware
      app.use('/properties', (req: any, res, next) => {
        req.user = { userId: 'user-1' };
        next();
      }, propertyRoutes);

      const response = await request(app).delete('/properties/prop-1');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.message).toBe('Property deleted successfully');
      expect(mockPrisma.property.update).toHaveBeenCalledWith({
        where: { id: 'prop-1' },
        data: { status: 'INACTIVE' },
      });
    });

    it('should return 403 when user does not own property', async () => {
      mockPrisma.property.findUnique.mockResolvedValue({ userId: 'different-user' });

      // Mock authentication middleware
      app.use('/properties', (req: any, res, next) => {
        req.user = { userId: 'user-1' };
        next();
      }, propertyRoutes);

      const response = await request(app).delete('/properties/prop-1');

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toBe('Access denied');
    });
  });

  describe('GET /properties/:id/stats', () => {
    it('should return property statistics', async () => {
      mockPrisma.lead.count.mockResolvedValue(10);
      mockPrisma.deal.count.mockResolvedValue(3);
      mockPrisma.activity.count.mockResolvedValue(25);
      mockPrisma.deal.aggregate.mockResolvedValue({ _avg: { value: 150000 } });

      const response = await request(app).get('/properties/prop-1/stats');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.stats).toEqual({
        leadsCount: 10,
        dealsCount: 3,
        viewsCount: 25,
        averageDealValue: 150000,
      });
    });

    it('should return 0 for average deal value when no deals exist', async () => {
      mockPrisma.lead.count.mockResolvedValue(0);
      mockPrisma.deal.count.mockResolvedValue(0);
      mockPrisma.activity.count.mockResolvedValue(0);
      mockPrisma.deal.aggregate.mockResolvedValue({ _avg: { value: null } });

      const response = await request(app).get('/properties/prop-1/stats');

      expect(response.body.data.stats.averageDealValue).toBe(0);
    });
  });

  describe('POST /properties/:id/images', () => {
    const imageData = {
      url: 'https://example.com/image.jpg',
      alt: 'Property image',
      isPrimary: true,
      order: 1,
    };

    it('should add image to property when user owns it', async () => {
      const mockImage = {
        id: 'image-1',
        ...imageData,
        propertyId: 'prop-1',
      };

      mockPrisma.property.findUnique.mockResolvedValue({ userId: 'user-1' });
      mockPrisma.propertyImage.updateMany.mockResolvedValue({ count: 1 });
      mockPrisma.propertyImage.create.mockResolvedValue(mockImage);

      // Mock authentication middleware
      app.use('/properties', (req: any, res, next) => {
        req.user = { userId: 'user-1' };
        next();
      }, propertyRoutes);

      const response = await request(app)
        .post('/properties/prop-1/images')
        .send(imageData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.image).toEqual(mockImage);
      expect(mockPrisma.propertyImage.updateMany).toHaveBeenCalledWith({
        where: { propertyId: 'prop-1' },
        data: { isPrimary: false },
      });
    });

    it('should not update other images when isPrimary is false', async () => {
      const nonPrimaryImageData = { ...imageData, isPrimary: false };

      mockPrisma.property.findUnique.mockResolvedValue({ userId: 'user-1' });
      mockPrisma.propertyImage.create.mockResolvedValue({
        id: 'image-1',
        ...nonPrimaryImageData,
        propertyId: 'prop-1',
      });

      // Mock authentication middleware
      app.use('/properties', (req: any, res, next) => {
        req.user = { userId: 'user-1' };
        next();
      }, propertyRoutes);

      await request(app)
        .post('/properties/prop-1/images')
        .send(nonPrimaryImageData);

      expect(mockPrisma.propertyImage.updateMany).not.toHaveBeenCalled();
    });
  });

  describe('DELETE /properties/:id/images/:imageId', () => {
    it('should remove image from property when user owns it', async () => {
      mockPrisma.property.findUnique.mockResolvedValue({ userId: 'user-1' });
      mockPrisma.propertyImage.delete.mockResolvedValue({});

      // Mock authentication middleware
      app.use('/properties', (req: any, res, next) => {
        req.user = { userId: 'user-1' };
        next();
      }, propertyRoutes);

      const response = await request(app).delete('/properties/prop-1/images/image-1');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.message).toBe('Image removed successfully');
      expect(mockPrisma.propertyImage.delete).toHaveBeenCalledWith({
        where: { id: 'image-1', propertyId: 'prop-1' },
      });
    });

    it('should return 403 when user does not own property', async () => {
      mockPrisma.property.findUnique.mockResolvedValue({ userId: 'different-user' });

      // Mock authentication middleware
      app.use('/properties', (req: any, res, next) => {
        req.user = { userId: 'user-1' };
        next();
      }, propertyRoutes);

      const response = await request(app).delete('/properties/prop-1/images/image-1');

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toBe('Access denied');
    });
  });
});