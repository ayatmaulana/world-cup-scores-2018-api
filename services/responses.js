class Responses {

    static generateResponse(expresResponse, code = Responses.SUCCESS, data) {
        let response = {
            code,
            status: (code == Responses.SUCCESS) ? true : false,
            message: (code == Responses.SUCCESS) ? "success" : "failed",
            data
        }

        return expresResponse.json(response)
    }
}

Responses.SUCCESS = 200
Responses.FAILDER = 501

module.exports = Responses
