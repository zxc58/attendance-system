/* eslint-disable no-unused-vars */
const { Router } = require('express')
const { recordController } = require('../../controllers')
const router = Router()
router.get('/today', recordController.getTodayRecord)
router.get('/recent', recordController.getRecentlRecords)
router.post('/', recordController.postRecord)
router.put('/:id', recordController.putRecord)

module.exports = router
