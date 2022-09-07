
const router = require('express').Router()
const middleware = require('../utils/middleware')

// Controllers
const RoleBarrier = require('../controllers/RoleBarrier')
const { ExporterController } = require('../controllers/ExporterController')
const { XLSXExporterStrategy } = require('../controllers/XLSXExporterStrategy')
const { ReevaluateController } = require('../controllers/ReevaluateController')

/** 
 * Routes
 * 
 * prefix: /api/spreadsheet/
 */

// upload
router.get('/download/:id/:assessmentID',middleware.authBarrier, RoleBarrier.cohortsEvaluatorRoleBarrier, async (request, response) => {
  const cohortID = request.params.id
  const assessmentID = request.params.assessmentID
  try {
    // get data 
    const data = await ReevaluateController.getDataSingleAssessment(cohortID, assessmentID);
    const ExporterControllerX = new ExporterController(new XLSXExporterStrategy());
    const workbook = await ExporterControllerX.exportForSingleAssessment(data);
    const blob = await workbook.xlsx.writeBuffer();
    response.type("xlsx")
    return response.send(Buffer.from(blob))
  } catch (error) {
    return response.status(500).json(middleware.generateApiOutput("FAILED", { error: error.message }))
  }
})

module.exports = router