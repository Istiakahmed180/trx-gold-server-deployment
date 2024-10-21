import mongoose from "mongoose";
import { TGenericErrorResponse } from "../interface/error";
import httpStatus from "http-status";


const handleCastError = (err: mongoose.Error.CastError): TGenericErrorResponse => {
    const statusCode = httpStatus.NOT_ACCEPTABLE;
    return {
        statusCode,
        message: "Invalid ID",
        errorMessage: `${err?.value} is not a valid ID !`
    }
}
export default handleCastError;