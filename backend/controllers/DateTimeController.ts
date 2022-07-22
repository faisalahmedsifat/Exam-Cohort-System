// @ts-nocheck

// Core Packages
const config = require('../utils/config')

// Time Ago Library
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
TimeAgo.addDefaultLocale(en)
const timeAgoLibrary = new TimeAgo('en-US')

// Models
const Models = require('../models')

class DateTimeController {

  static getTimeAgo(datetime) {
    return timeAgoLibrary.format(Date.parse(datetime))
  }

  static isAvailableAndDueDateTimeValid(availableDateTime, dueDateTime) {
    const fiveMinAgoTimeStamp = Date.parse(new Date())-1000*60*5 // Allow only 3 Min of delay
    let availableTimeStamp = Date.parse(new Date(availableDateTime))
    let dueTimeStamp = Date.parse(new Date(dueDateTime))    
    return (availableTimeStamp < dueTimeStamp) && (availableTimeStamp >= fiveMinAgoTimeStamp)
  }

}

module.exports = DateTimeController