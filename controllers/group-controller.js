const Api  = require('../services/api.js')
const Responses = require('../services/responses.js')

module.exports = async (req, res) => {
    let api = new Api;
    let groupName = req.query.group
    let response = await api.group( groupName );

    if(response) {
       return Responses.generateResponse(res, Responses.SUCCESS, response)
    }
}
