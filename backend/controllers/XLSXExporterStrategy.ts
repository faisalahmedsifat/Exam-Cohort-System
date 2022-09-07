// @ts-nocheck

// Interfaces
import { ExportStrategy } from "./interfaces/ExportStrategy";

// Dependencies
const ExcelJS = require('exceljs');

export class XLSXExporterStrategy implements ExportStrategy {
  constructor() { }
  async exportForSingleAssessment(data){
    const workbook = new ExcelJS.Workbook();

    // workbook settings
    workbook.creator = 'Exam Cohort App System';
    workbook.lastModifiedBy = 'Exam Cohort App System';
    workbook.created = new Date();
    workbook.modified = new Date();
    workbook.lastPrinted = new Date();
    workbook.views = [
      {
        x: 0, y: 0, width: 10000, height: 20000,
        firstSheet: 0, activeTab: 1, visibility: 'visible'
      }
    ]

    // create a worksheet
    const assessment1 = workbook.addWorksheet(data.assessmentStats.assessmentName, {
      pageSetup: { paperSize: 9, orientation: 'landscape' }
    });

    // create header
    let headerNames = ["Candidate Name"]
    let cnt = 0;
    for (const questionID of data.assessmentStats.questionIDs) {
      cnt++;
      headerNames.push("Q"+cnt);
    }
    assessment1.addRow(headerNames);

    // add all rows
    for (const candidate of data.assessmentResponses) {
      let rowVals = []
      rowVals.push(candidate.CandidateName)
      for (const questionIDOriginalOrder of data.assessmentStats.questionIDs) {
        for (const candidateResponse of candidate.candidateResponses) {
          if(candidateResponse.questionID === questionIDOriginalOrder){
            rowVals.push(candidateResponse.score)
          }
        }
      }
      assessment1.addRow(rowVals);
    }

    return workbook;
  }
}