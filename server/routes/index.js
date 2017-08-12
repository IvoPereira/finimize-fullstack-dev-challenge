const router = require('express').Router()

router.get('/projection/monthly', require('./projection/get-data.js'))
router.get('/currency/rate', require('./currency/get-rate.js'))

module.exports = router
