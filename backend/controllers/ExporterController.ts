// @ts-nocheck

import { ExportStrategy } from "./interfaces/ExportStrategy";

const middleware = require('../utils/middleware')

// Other Controllers
export class ExporterController {
  private exporterStrategy: ExportStrategy;
  constructor(exporterStrategy: ExportStrategy){
    this.exporterStrategy = exporterStrategy;
  }
  public async exportForSingleAssessment(data){
    return await this.exporterStrategy.exportForSingleAssessment(data);
  }
  
}
