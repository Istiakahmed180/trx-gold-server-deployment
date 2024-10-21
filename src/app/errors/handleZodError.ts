import { ZodError, ZodIssue } from "zod";
import { TGenericErrorResponse } from "../interface/error";
import httpStatus from "http-status";

const handleZodError = (err: ZodError): TGenericErrorResponse => {
    let errorMessage = ''
    err.issues.map((issue: ZodIssue) => {
        return errorMessage += `${(issue?.path[issue.path.length - 1])} is ${issue.message}.`
    })
    const statusCode = httpStatus.NOT_ACCEPTABLE;
    return {
        statusCode,
        message: "Validation Error",
        errorMessage,

    }
}

export default handleZodError;