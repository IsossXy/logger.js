'use strict';

const { Level } = require('./constants.js');

/**
 * The logger interface
 * @typedef {Object} ILogger
 * @property {Function} fatal Fatal logging function
 * @property {Function} error Error logging function
 * @property {Function} warn Warn logging function
 * @property {Function} info Info logging function
 * @property {Function} debug Debug logging function
 * @property {Function} trace Trace logging function
 */

/**
 * The logging level
 * @typedef {number} Level
 */

/**
 * The logging context
 * @typedef {Object} IContext
 * @property {Level} filterLevel The levels that the logger handles
 * @property {string} name The logger's name
 */

/**
 * The logging handler
 * @typedef {Function} ILogHandler
 * @param {any[]} messages The messages to handle
 * @param {string} level The key that represents the logging Level to handle
 * @param {IContext} context The context to handle
 */

/**
 * The logger's options
 * @typedef {Object} LoggerOpts
 * @property {IContext} context The logger's context
 * @property {ILogHandler} formatter The logging handler's formatter
 */

/**
 * The default logging handler's options
 * @typedef {Object} CreateDefaultHandlerOpts
 * @property {ILogHandler} formatter The default logging handler's formatter
 */

/**
 * The default context
 * The logger logs only FATAL, ERROR, INFO levels
 * @type {IContext}
 */
const defaultContext = {
    filterLevel: Level.FATAL | Level.ERROR | Level.INFO,
    name: 'Logger'
};

/**
 * All logger instancies
 * @type {Logger[]}
 */
const instances = {};

/**
 * A basic ILogger implementation
 * @implements {ILogger}
 */
class Logger {

    /**
     * @param {LoggerOpts} [options] The logger's options
     */
    constructor (options = {}) {
        /**
         * The logger's context
         * @name Logger#_context
         * @type {IContext}
         */
        Object.defineProperty(this, '_context', { value: Object.assign({}, defaultContext, options.context), writable: true });
        
        /**
         * The logger's default handler
         * @name Logger#_handler
         * @type {ILogHandler}
         */
        Object.defineProperty(this, '_handler', { value: this.constructor.createDefaultHandler(options), writable: true });
    }

    /**
     * Retrives a logger object already instantiated or creates it
     * @param {string} name The logger's name
     * @returns {Logger} The logger object
     */
    static get(name) {
        return instances[name] || (instances[name] = new Logger({ context: { name } }));
    }
    
    /**
     * Creates a default logging handler.
     * It writes to the console like
     * ```[hh:mm:ss] [Logger] [Level] Message```.
     * @param {CreateDefaultHandlerOpts} [options] The default logging handler's options
     */
    static createDefaultHandler(options = {}) {
        console.fatal = console.error; // Fatal is an alias of error

        options.formatter = options.formatter || function (messages, level, context) {
            messages.unshift(
                '[' + new Date().toLocaleTimeString() + ']',
                '[' + context.name + ']',
                '[' + level.charAt(0) + level.substring(1).toLowerCase() + ']'
            );
        };

        return (messages, level, context) => {
            options.formatter(messages, level, context);
            console[level.toLowerCase()](messages.join(' ')); // call the console method
        };
    }

    /** 
     * Logs on the `FATAL` level and crashes the program
     * @param {any[]} data The data to log
     */
    fatal(...data) {
        this._log('FATAL', ...data);
        throw new Error(data.join(' '));
    }

    /** 
     * Logs on the `ERROR` level
     * @param {any[]} data The data to log
     */
    error(...data) {
        this._log('ERROR', ...data);
    }

    /** 
     * Logs on the `WARN` level
     * @param {any[]} data The data to log
     */
    warn(...data) {
        this._log('WARN', ...data);
    }

    /** 
     * Logs on the `INFO` level
     * @param {any[]} data The data to log
     */
    info(...data) {
        this._log('INFO', ...data);
    }

    /** 
     * Logs on the `DEBUG` level
     * @param {any[]} data The data to log
     */
    debug(...data) {
        this._log('DEBUG', ...data);
    }

    /** 
     * Logs on the `TRACE` level
     * @param {any[]} data The data to log
     */
    trace(...data) {
        this._log('TRACE', ...data);
    }

    _log(level, ...data) {
        if(this._handler && this.enabledFor(Level[level])) {
            this._handler(data, level, this._context);
        }
    }

    /**
     * Sets the logger's context
     * @param {IContext} context The context to assign
     */
    setContext(context) {
        this._context = context;
    }

    /**
     * Gets the current logger's context
     * @returns {IContext} Returns the logger's context
     */
    getContext() {
        return this._context;
    }

    /**
     * Sets the logging handler. The supplied function should
     * expect two arguments, the first is an object which contains
     * the supplied log messages and the second is a IContext object
     * @param {ILogHandler} handler The logging handler
     */
    setHandler(handler) {
        this._handler = handler;
    }

    /**
     * Enables a logging level
     * @param {Level} level The level to enable
     */
    enable(level) {
        this._context.filterLevel |= level;
    }

    /**
     * Disables a logging level
     * @param {Level} level The level to disable
     */
    disable(level) {
        this._context.filterLevel &= ~level;
    }

    /**
     * Check if the logger can log a certain level
     * @param {Level} level The level to check
     * */
    enabledFor(level) {
        return this._context.filterLevel & level;
    }
    
};

module.exports = Logger;