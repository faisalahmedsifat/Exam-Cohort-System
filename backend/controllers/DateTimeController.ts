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

  static getTimeAgo(datetime){ 
    return timeAgoLibrary.format(Date.parse(datetime))
  } 

}

module.exports = DateTimeController