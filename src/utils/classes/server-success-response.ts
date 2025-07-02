// Define types for the class properties
interface ServerSuccessResponseProps {
  success: boolean;
  statusCode: number;
  statusMessage: string;
  message: string;
  data: any; // You can replace `any` with a more specific type based on your data structure
}

class ServerSuccessResponse implements ServerSuccessResponseProps {
  success: boolean;
  statusCode: number;
  statusMessage: string;
  message: string;
  data: any; // You can replace `any` with a more specific type based on your data structure

  constructor(
    success: boolean,
    code: number,
    statusMessage: string,
    message: string,
    data: any
  ) {
    this.success = success;
    this.statusCode = code;
    this.message = message;
    this.statusMessage = statusMessage;
    this.data = data;
  }

  // Static method to create an instance of the class
  static successResponse(
    success: boolean,
    statusMessage: string,
    code: number,
    message: string,
    data?: any
  ): ServerSuccessResponse {
    return new ServerSuccessResponse(
      success,
      code,
      statusMessage,
      message,
      data
    );
  }
}

export default ServerSuccessResponse;
