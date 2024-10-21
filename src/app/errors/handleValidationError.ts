import httpStatus from "http-status";
import mongoose from "mongoose";

const handleValidationError = (err: mongoose.Error.ValidationError) => {
    let errorMessage = ''
    Object.values(err.errors).map(
        (val: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
            return errorMessage += val?.message
        }
    );
    const statusCode = httpStatus.NOT_ACCEPTABLE;
    return {
        statusCode,
        message: 'Validation Error',
        errorMessage,
    };
}
export default handleValidationError;