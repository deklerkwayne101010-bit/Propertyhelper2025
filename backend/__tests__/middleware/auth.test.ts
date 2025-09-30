import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { authenticateToken, authorizeRoles, optionalAuth, requireAdmin, requireAgent, requireAuth } from '../../src/middleware/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Auth Middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockReq = {
      headers: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe('authenticateToken', () => {
    it('should return 401 if no authorization header', async () => {
      await authenticateToken(mockReq as any, mockRes as any, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: { message: 'Access token required' },
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 if malformed authorization header', async () => {
      mockReq.headers = { authorization: 'InvalidToken' };

      await authenticateToken(mockReq as any, mockRes as any, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: { message: 'Access token required' },
      });
    });

    it('should return 401 for invalid JWT token', async () => {
      mockReq.headers = { authorization: 'Bearer invalid.jwt.token' };

      await authenticateToken(mockReq as any, mockRes as any, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: { message: 'Invalid token' },
      });
    });

    it('should return 401 for expired JWT token', async () => {
      const expiredToken = jwt.sign(
        { userId: 'test-user-id' },
        'test-secret',
        { expiresIn: '-1h' }
      );
      mockReq.headers = { authorization: `Bearer ${expiredToken}` };

      await authenticateToken(mockReq as any, mockRes as any, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: { message: 'Token expired' },
      });
    });

    it('should return 401 if user not found', async () => {
      const validToken = jwt.sign(
        { userId: 'non-existent-user' },
        process.env.JWT_SECRET || 'test-secret'
      );
      mockReq.headers = { authorization: `Bearer ${validToken}` };

      prisma.user.findUnique.mockResolvedValue(null);

      await authenticateToken(mockReq as any, mockRes as any, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: { message: 'User not found or account disabled' },
      });
    });

    it('should return 401 if user is inactive', async () => {
      const validToken = jwt.sign(
        { userId: 'inactive-user' },
        process.env.JWT_SECRET || 'test-secret'
      );
      mockReq.headers = { authorization: `Bearer ${validToken}` };

      prisma.user.findUnique.mockResolvedValue({
        id: 'inactive-user',
        email: 'inactive@test.com',
        role: 'USER',
        isActive: false,
      });

      await authenticateToken(mockReq as any, mockRes as any, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: { message: 'User not found or account disabled' },
      });
    });

    it('should authenticate successfully and call next', async () => {
      const validToken = jwt.sign(
        { userId: 'active-user' },
        process.env.JWT_SECRET || 'test-secret'
      );
      mockReq.headers = { authorization: `Bearer ${validToken}` };

      const mockUser = {
        id: 'active-user',
        email: 'active@test.com',
        role: 'USER',
        isActive: true,
      };

      prisma.user.findUnique.mockResolvedValue(mockUser);

      await authenticateToken(mockReq as any, mockRes as any, mockNext);

      expect(mockReq.user).toEqual({
        userId: 'active-user',
        email: 'active@test.com',
        role: 'USER',
      });
      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should return 500 for unexpected errors', async () => {
      mockReq.headers = { authorization: 'Bearer valid-token' };

      prisma.user.findUnique.mockRejectedValue(new Error('Database error'));

      await authenticateToken(mockReq as any, mockRes as any, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: { message: 'Internal server error' },
      });
    });
  });

  describe('authorizeRoles', () => {
    it('should return 401 if no user in request', () => {
      const middleware = authorizeRoles('ADMIN');

      middleware(mockReq as any, mockRes as any, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: { message: 'Authentication required' },
      });
    });

    it('should return 403 if user role not allowed', () => {
      const middleware = authorizeRoles('ADMIN');
      mockReq.user = { userId: 'user-id', email: 'user@test.com', role: 'USER' };

      middleware(mockReq as any, mockRes as any, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: { message: 'Insufficient permissions' },
      });
    });

    it('should call next if user role is allowed', () => {
      const middleware = authorizeRoles('ADMIN', 'USER');
      mockReq.user = { userId: 'user-id', email: 'user@test.com', role: 'USER' };

      middleware(mockReq as any, mockRes as any, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });
  });

  describe('optionalAuth', () => {
    it('should call next without user if no token provided', async () => {
      await optionalAuth(mockReq as any, mockRes as any, mockNext);

      expect(mockReq.user).toBeUndefined();
      expect(mockNext).toHaveBeenCalled();
    });

    it('should set user if valid token provided', async () => {
      const validToken = jwt.sign(
        { userId: 'active-user' },
        process.env.JWT_SECRET || 'test-secret'
      );
      mockReq.headers = { authorization: `Bearer ${validToken}` };

      const mockUser = {
        id: 'active-user',
        email: 'active@test.com',
        role: 'USER',
        isActive: true,
      };

      prisma.user.findUnique.mockResolvedValue(mockUser);

      await optionalAuth(mockReq as any, mockRes as any, mockNext);

      expect(mockReq.user).toEqual({
        userId: 'active-user',
        email: 'active@test.com',
        role: 'USER',
      });
      expect(mockNext).toHaveBeenCalled();
    });

    it('should call next without user if token is invalid', async () => {
      mockReq.headers = { authorization: 'Bearer invalid-token' };

      await optionalAuth(mockReq as any, mockRes as any, mockNext);

      expect(mockReq.user).toBeUndefined();
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('Pre-configured middlewares', () => {
    it('requireAuth should be authenticateToken', () => {
      expect(requireAuth).toBe(authenticateToken);
    });

    it('requireAdmin should authorize SUPER_ADMIN and ADMIN roles', () => {
      const middleware = requireAdmin;
      mockReq.user = { userId: 'admin-id', email: 'admin@test.com', role: 'ADMIN' };

      middleware(mockReq as any, mockRes as any, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it('requireAgent should authorize SUPER_ADMIN, ADMIN, and AGENT roles', () => {
      const middleware = requireAgent;
      mockReq.user = { userId: 'agent-id', email: 'agent@test.com', role: 'AGENT' };

      middleware(mockReq as any, mockRes as any, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });
  });
});