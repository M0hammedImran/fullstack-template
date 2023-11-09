import { HttpStatus } from '@nestjs/common';

import type { IResponse } from '../interfaces';

export class ResponseUtility {
    static getFormattedResponse<T = unknown>(data: T, statusCode: number, message?: string): IResponse<T> {
        return {
            data,
            statusCode,
            message: message || 'success',
        };
    }

    public static Created(data?: unknown) {
        return ResponseUtility.getFormattedResponse(data, HttpStatus.CREATED);
    }

    public static Ok<T = unknown>(data: T) {
        return ResponseUtility.getFormattedResponse(data, HttpStatus.OK);
    }

    public static OkEmpty() {
        return ResponseUtility.getFormattedResponse(null, HttpStatus.OK);
    }

    public static BadRequest(message: string) {
        return ResponseUtility.getFormattedResponse(null, HttpStatus.BAD_REQUEST, message);
    }

    public static NotFound(message: string) {
        return ResponseUtility.getFormattedResponse(null, HttpStatus.NOT_FOUND, message);
    }

    public static Conflict(message: string) {
        return ResponseUtility.getFormattedResponse(null, HttpStatus.CONFLICT, message);
    }

    public static Unauthorized(message: string | undefined) {
        return ResponseUtility.getFormattedResponse(null, HttpStatus.UNAUTHORIZED, message);
    }

    public static Forbidden(message: string | undefined) {
        return ResponseUtility.getFormattedResponse(null, HttpStatus.FORBIDDEN, message);
    }
}
