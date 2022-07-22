"use strict";
// @ts-nocheck
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Core Packages
const config = require('../utils/config');
// Time Ago Library
const javascript_time_ago_1 = __importDefault(require("javascript-time-ago"));
const en_1 = __importDefault(require("javascript-time-ago/locale/en"));
javascript_time_ago_1.default.addDefaultLocale(en_1.default);
const timeAgoLibrary = new javascript_time_ago_1.default('en-US');
// Models
const Models = require('../models');
class DateTimeController {
    static getTimeAgo(datetime) {
        return timeAgoLibrary.format(Date.parse(datetime));
    }
}
module.exports = DateTimeController;
