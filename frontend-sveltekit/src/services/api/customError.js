import { ValidationError } from 'joi';
import { HTTP_STATUS_CODE } from 'types/enums/httpStatusCode';

export class CustomApiError extends Error {
	
	constructor(code, message) {
		super(message);
		this.code = code;
		this.name = 'CustomApiError';
	}
}

export const handleErrorsAndFinaliseHttpResponse = (error, req) => {
	if (error instanceof CustomApiError) {
		console.log(`Error ${error.code}: ${req.url} - ${error.message}`);
		return {
			status: error.code,
			body: { message: error.message }
		}
	}
	
	if (error instanceof ValidationError) {
		console.log(`Error ${HTTP_STATUS_CODE.HTTP_BAD_REQUEST}: ${req.url}`, error.details.map((x) => x.message).join(', '));
		return {
			status: 400,
			body: { message: error.details.map((x) => x.message).join(', ') }
		}
	}
	
	console.log(`Error ${HTTP_STATUS_CODE.HTTP_SERVER_ERROR}: Server error ${req.url}`, error);
	return {
		status: 500,
		body: { message: 'Server error' }
	}
};
