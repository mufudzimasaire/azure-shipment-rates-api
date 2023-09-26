import { handleResponse } from "./handle-response";

describe('handleResponse', () => {
  it('should set the status code and body content in the response object', () => {
    // Arrange
    const context = { res: { status: null, body: null } };
    const status = 200;
    const body = 'Success';

    // Act
    handleResponse(context, status, body);

    // Assert
    expect(context.res.status).toBe(status);
    expect(context.res.body).toBe(body);
  });

  it('should accept a string as the body content', () => {
    // Arrange
    const context = { res: { status: null, body: null } };
    const status = 200;
    const body = 'Success';

    // Act
    handleResponse(context, status, body);

    // Assert
    expect(context.res.body).toBe(body);
  });

  it('should accept an object as the body content', () => {
    // Arrange
    const context = { res: { status: null, body: null } };
    const status = 200;
    const body = { message: 'Success' };

    // Act
    handleResponse(context, status, body);

    // Assert
    expect(context.res.body).toBe(body);
  });

  it('should set the body content to null', () => {
    // Arrange
    const context = { res: { status: null, body: null } };
    const status = 200;
    const body = null;

    // Act
    handleResponse(context, status, body);

    // Assert
    expect(context.res.body).toBe(body);
  });

  it('should set the body content to undefined', () => {
    // Arrange
    const context = { res: { status: null, body: null } };
    const status = 200;
    const body = undefined;

    // Act
    handleResponse(context, status, body);

    // Assert
    expect(context.res.body).toBe(body);
  });

  it('should default to status 200', () => {
    // Arrange
    const context = { res: { status: null, body: null } };

    // Act
    handleResponse(context, null, null);

    // Assert
    expect(context.res.status).toBe(200);
  });
});
