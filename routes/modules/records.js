/* eslint-disable no-unused-vars */
const { Router } = require('express')
const { recordController } = require('../../controllers')
const router = Router()
router.post('/', recordController.postRecord)
router.get('/today', recordController.getOnesPunching)
module.exports = router
