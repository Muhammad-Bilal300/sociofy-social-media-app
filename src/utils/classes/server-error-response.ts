import { STATUS_CODE } from "../../constants/status-codes";
import { STATUS_MESSAGES } from "../../constants/status-messages";

// Define types for the class properties
interface ServerErrorResponseProps {
  success: boolean;
  statusCode: number;
  statusMessage: string;
  message: string;
  error?: any; // error is optional and can be of any type, but you can refine it later
}

class ServerErrorResponse implements ServerErrorResponseProps {
  success: boolean;
  statusCode: number;
  statusMessage: string;
  message: string;
  error?: any; // Optional error field

  constructor(
    success: boolean,
    code: number,
    statusMessage: string,
    message: string,
    error?: any // error is optional in the constructor
  ) {
    this.success = success;
    this.statusCode = code;
    this.message = message;
    this.statusMessage = statusMessage;
    if (error) {
      this.error = error;
    }
  }

  // Static method for bad request error
  static badRequest(message: string): ServerErrorResponse {
    return new ServerErrorResponse(
      false,
      STATUS_CODE.BAD_REQUEST,
      STATUS_MESSAGES.FAILED,
      message
    );
  }

  // Static method for internal server error
  static internal(error: any): ServerErrorResponse {
    return new ServerErrorResponse(
      false,
      STATUS_CODE.SERVER_ERROR,
      STATUS_MESSAGES.SERVER_ERROR,
      STATUS_MESSAGES.SERVER_ERROR,
      error
    );
  }

  // Static method for not found error
  static notFound(message: string): ServerErrorResponse {
    return new ServerErrorResponse(
      false,
      STATUS_CODE.NOT_FOUND,
      STATUS_MESSAGES.FAILED,
      message
    );
  }

  // Static method for custom error
  static customError(
    statusMessage: string,
    code: number,
    message: string,
    data: any
  ): ServerErrorResponse {
    return new ServerErrorResponse(false, code, statusMessage, message, data);
  }

  // Static method for custom error with stack trace
  static customErrorWithStackTrace(
    code: number,
    message: string,
    stack: any
  ): ServerErrorResponse {
    return new ServerErrorResponse(
      false,
      code,
      STATUS_MESSAGES.ERROR,
      message,
      stack
    );
  }
}

export default ServerErrorResponse;
