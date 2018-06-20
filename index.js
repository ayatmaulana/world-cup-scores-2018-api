const express = require('express')
const app = express()


const MainController = require('./controllers/main-controller.js')
const GroupController = require('./controllers/group-controller.js')

app.get('/main', MainController)
app.get('/group', GroupController)
app.get('/hello', (req, res) => res.send("hello"))

app.listen(6000, () => console.log('Example app listening on port 6000!'))
