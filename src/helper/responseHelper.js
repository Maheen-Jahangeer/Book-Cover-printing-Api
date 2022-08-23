export const responseHelper = (status, result, error, errorCode = '500', message = "Un authenticated") => {
    return {
        status: status ? status : 'ok',
        result: result && result,
        error: error && {
            errorCode:errorCode,
            message:message
        }
    }
}