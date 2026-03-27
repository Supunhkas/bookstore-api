import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import type { Request, Response, NextFunction } from 'express';

jest.unstable_mockModule('../config/config.js', () => ({
  default: {
    authToken: 'test-secret-token',
    port: 3000,
    nodeEnv: 'test',
  },
}));

const { authMiddleware } = await import('./auth.js');

describe('authMiddleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFn: jest.Mock;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    nextFn = jest.fn();

    mockRequest = { headers: {} };
    mockResponse = {
      status: statusMock,
      json: jsonMock,
    } as unknown as Response;
  });

  // without token
  describe('when no token is provided', () => {
    it("should return 401 with 'No token provided' message", () => {
      mockRequest.headers = {};

      authMiddleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFn as unknown as NextFunction,
      );

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Unauthorized: No token provided',
      });
      expect(nextFn).not.toHaveBeenCalled();
    });
  });

  // invalid tokev
  describe('when an invalid token is provided', () => {
    it('should return 401 when Authorization Bearer token is wrong', () => {
      mockRequest.headers = { authorization: 'Bearer wrong-token' };

      authMiddleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFn as unknown as NextFunction,
      );

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Unauthorized: Invalid token',
      });
      expect(nextFn).not.toHaveBeenCalled();
    });

    it('should return 401 when x-api-key value is wrong', () => {
      mockRequest.headers = { 'x-api-key': 'bad-key' };

      authMiddleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFn as unknown as NextFunction,
      );

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Unauthorized: Invalid token',
      });
      expect(nextFn).not.toHaveBeenCalled();
    });

    it('should return 401 when a raw (non-Bearer) Authorization token is wrong', () => {
      mockRequest.headers = { authorization: 'wrong-token' };

      authMiddleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFn as unknown as NextFunction,
      );

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Unauthorized: Invalid token',
      });
      expect(nextFn).not.toHaveBeenCalled();
    });
  });

  // valid token
  describe('when a valid token is provided', () => {
    it('should call next() when Authorization contains a valid Bearer token', () => {
      mockRequest.headers = { authorization: 'Bearer test-secret-token' };

      authMiddleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFn as unknown as NextFunction,
      );

      expect(nextFn).toHaveBeenCalledTimes(1);
      expect(statusMock).not.toHaveBeenCalled();
    });

    it('should call next() when x-api-key contains the correct token', () => {
      mockRequest.headers = { 'x-api-key': 'test-secret-token' };

      authMiddleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFn as unknown as NextFunction,
      );

      expect(nextFn).toHaveBeenCalledTimes(1);
      expect(statusMock).not.toHaveBeenCalled();
    });

    it('should call next() when Authorization contains the raw token (no Bearer prefix)', () => {
      mockRequest.headers = { authorization: 'test-secret-token' };

      authMiddleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFn as unknown as NextFunction,
      );

      expect(nextFn).toHaveBeenCalledTimes(1);
      expect(statusMock).not.toHaveBeenCalled();
    });

    it('should use the first value when the Authorization header is an array', () => {
      mockRequest.headers = {
        authorization: ['Bearer test-secret-token', 'Bearer other'],
      } as unknown as Request['headers'];

      authMiddleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFn as unknown as NextFunction,
      );

      expect(nextFn).toHaveBeenCalledTimes(1);
      expect(statusMock).not.toHaveBeenCalled();
    });
  });
});
