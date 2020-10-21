declare module '@isoss/logger.js' {
    export const version: string;

    //#region Classes
    
    export class Logger implements ILogger {
        constructor(options?: LoggerOpts);
        private _context: IContext;
        private _handler: ILogHandler;
        private _log(...data: any[]): void;
        
        public static get(name: string): Logger;
        public static createDefaultHandler(options?: CreateDefaultHandlerOpts): ILogHandler;

        fatal(...data: any[]): void;
        error(...data: any[]): void;
        warn(...data: any[]): void;
        info(...data: any[]): void;
        debug(...data: any[]): void;
        trace(...data: any[]): void;
        setContext(context: IContext): void;
        getContext(): IContext;
        setHandler(logHandler: ILogHandler): void;
        enable(level: Level): void;
        disable(level: Level): void;
        enabledFor(level: Level): boolean;
    }

    //#endregion

    //#region Interfaces

    export interface ILogger {
        fatal(...data: any[]): void;
        error(...data: any[]): void;
        warn(...data: any[]): void;
        info(...data: any[]): void;
        debug(...data: any[]): void;
        trace(...data: any[]): void;
        setContext(context: IContext): void;
        getContext(): IContext;
        setHandler(logHandler: ILogHandler): void;
        enable(level: Level): void;
        disable(level: Level): void;
        enabledFor(level: Level);
    }

    export interface IContext {
        filterLevel: number;
        name: string;
    }

    export interface ILogHandler {
        (messages: any[], level: Level, context: IContext): void;
    }

    export interface LoggerOpts {
        context?: IContext;
        formatter?: ILogHandler;
    }

    export interface CreateDefaultHandlerOpts {
        formatter?: ILogHandler;
    }

    //#endregion

    //#region Enums

    export enum Level {
        FATAL = 0b100000,
        ERROR = 0b010000,
        WARN  = 0b001000,
        INFO  = 0b000100,
        DEBUG = 0b000010,
        TRACE = 0b000001
    }

    //#endregion
}