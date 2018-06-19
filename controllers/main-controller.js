const Api  = require('../services/api.js')

module.exports = async (req, res) => {
    let api = new Api;
    let response = await api.main();
    res.json(response)
}
