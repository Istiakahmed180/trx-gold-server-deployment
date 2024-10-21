/* eslint-disable @typescript-eslint/no-explicit-any */

import httpStatus from 'http-status';

const handleDuplicateError = (err: any) => {
    const [value] = Object.values(err?.keyValue);
    const errorMessage: string = `${value} is already exist`;

    const statusCode = httpStatus.NOT_ACCEPTABLE;
    return {
        statusCode,
        message: 'Duplicate Entry',
        errorMessage,
    };
};
export default handleDuplicateError;