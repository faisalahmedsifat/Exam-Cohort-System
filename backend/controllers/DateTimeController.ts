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

  static isAfterCurrentTime(dateTime) {
    const currentTime = new Date()
    return currentTime <= dateTime
  }
  static isAfterAvailableDateTime(dueDateTime, availableDateTime) {
    return availableDateTime < dueDateTime
  }

  static isAvailableDateTimeValid(availableDateTime) {
    return DateTimeController.isAfterCurrentTime(availableDateTime)
  }

  static isDueDateTimeValid(dueDateTime, availableDateTime) {
    return (DateTimeController.isAfterCurrentTime(dueDateTime) && DateTimeController.isAfterAvailableDateTime(dueDateTime, availableDateTime))
  }

  static getDateTimeFromISOString(dateTime) {
    return new Date(dateTime).getTime()
  }

  static getISOStringFromDate(dateTime) {
    return new Date(dateTime).toISOString()
  }

  static getAvailableAndDueDateTime(availableDateTime, dueDateTime) {
    const available = DateTimeController.getDateTimeFromISOString(availableDateTime)
    const due = DateTimeController.getDateTimeFromISOString(dueDateTime)
    return { available, due }
  }

  static isDateTimeValid(availableDateTime, dueDateTime) {
    const { available, due } = DateTimeController.getAvailableAndDueDateTime(availableDateTime, dueDateTime)
    const isAvailableDateTimeValid = DateTimeController.isAvailableDateTimeValid(available)
    const isDueDateTimeValid = DateTimeController.isDueDateTimeValid(due, available)
    return isAvailableDateTimeValid && isDueDateTimeValid
  }

}

module.exports = DateTimeController