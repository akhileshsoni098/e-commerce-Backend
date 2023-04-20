
// Handling error avoiding to reapeat code 

class ErrorHandler extends Error{
    constructor(message,statusCode){
        super(message)
        this.statusCode = statusCode

Error.captureStackTrace(this,this.constructor)  // need to understand about  ***captureStackTrace***

    }
}

module.exports = ErrorHandler



