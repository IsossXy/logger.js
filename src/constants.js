'use strict';

/**
 * All logging levels
 * @typedef {Object} Level
 * @property {number} FATAL The FATAL logging level
 * @property {number} ERROR The ERROR logging level
 * @property {number} WARN  The WARN logging level
 * @property {number} INFO  The INFO logging level
 * @property {number} DEBUG The DEBUG logging level
 * @property {number} TRACE The TRACE logging level
 */
exports.Level = {
    FATAL:  0b100000,
    ERROR:  0b010000,
    WARN:   0b001000,
    INFO:   0b000100,
    DEBUG:  0b000010,
    TRACE:  0b000001
};