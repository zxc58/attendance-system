const { Router } = require('express')
const { recordController } = require('../../controllers')

const router = Router()
router.get(
  '/today', recordController.getTodaysRecord
  // #swagger.tags = ['Record']
  // #swagger.description = 'Get personal today;s punching'
)

router.get(
  '/recent', recordController.getRecentlRecords
  // #swagger.tags = ['Record']
  // #swagger.description = 'Get personal punching receet'
)

router.post(
  '/', recordController.postRecord
  // #swagger.tags = ['Record']
  // #swagger.description = 'Puching in'
)

router.put(
  '/:id', recordController.putRecord
  // #swagger.tags = ['Record']
  // #swagger.description = 'Punching out'
)

module.exports = router
