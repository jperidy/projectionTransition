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
	
	console.log(`Error 500: Server error ${req.url}`, error);
	return {
		status: 500,
		body: { message: 'Server error' }
	}
};
