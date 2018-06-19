const Api  = require('../services/api.js')
const Responses = require('../services/responses.js')

module.exports = async (req, res) => {
    let api = new Api;
    let response = await api.main();

    if(response) {
       return Responses.generateResponse(res, Responses.SUCCESS, response)
    }
}
