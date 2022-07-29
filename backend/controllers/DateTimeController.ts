// @ts-nocheck

// Core Packages
const config = require('../utils/config')

// Time Ago Library
const TimeAgo = require('javascript-time-ago')
const en = require('javascript-time-ago/locale/en')
TimeAgo.addDefaultLocale(en)
const timeAgoLibrary = new TimeAgo('en-US')

// Models
const Models = require('../models')

class DateTimeController {

  static getTimeAgo(datetime) {
    return timeAgoLibrary.format(Date.parse(datetime))
  }

  static isAvailableAndDueDateTimeValid(availableDateTime, dueDateTime) {
    const fiveMinAgoTimeStamp = Date.parse(new Date())-1000*60*60 // Allow only 60 Min of delay
    let availableTimeStamp = Date.parse(new Date(availableDateTime))
    let dueTimeStamp = Date.parse(new Date(dueDateTime))    
    return (availableTimeStamp < dueTimeStamp) && (availableTimeStamp >= fiveMinAgoTimeStamp)
  }

  static getQuestionMinutesRemainToAddInAssessment(availableDateTime, dueDateTime, usedMinutes){
    let minutesTotal = (Date.parse(new Date(dueDateTime))-Date.parse(new Date(availableDateTime)))/(60*1000);
    let minutesRemains = minutesTotal-usedMinutes;
    return minutesRemains
  }

}

module.exports = DateTimeController