// MOST Web Framework Codename ZeroGraviry Copyright (c) 2017-2022, THEMOST LP All rights reserved
import { MD5, SHA1, SHA256 } from 'crypto-js';
const isNode = Object.prototype.toString.call(typeof process !== 'undefined' ? process : 0) === '[object process]';

const UUID_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const HEX_CHARS = 'abcdef1234567890';
const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;


const DateTimeRegex = /^\d{4}-([0]\d|1[0-2])-([0-2]\d|3[01])(?:[T ](\d+):(\d+)(?::(\d+)(?:\.(\d+))?)?)?(?:Z(-?\d*))?$/g;
const BooleanTrueRegex = /^true$/ig;
const BooleanFalseRegex = /^false$/ig;
const NullRegex = /^null$/ig;
const UndefinedRegex = /^undefined$/ig;
const IntegerRegex =/^[-+]?\d+$/g;
const FloatRegex =/^[+-]?\d+(\.\d+)?$/g;
const GuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

declare interface PropertyIndexer {
    [key: string]: any;
}

/**
 * @class
 * @constructor
 */
class UnknownPropertyDescriptor {
    constructor(obj: any, name: string) {
        Object.defineProperty(this, 'value', {
            configurable: false,
            enumerable: true,
            get () {
                return obj[name];
            },
            set (value) {
                obj[name] = value;
            }
        });
        Object.defineProperty(this, 'name', {
            configurable: false,
            enumerable: true,
            get () {
                return name;
            }
        });
    }
}

class LangUtils {
    constructor() {
        //
    }
    /**
     * Inherit the prototype methods from one constructor into another.
     * @deprecated This function is deprecated and is going to be removed at next version. Use ES2015 class syntax and extends keyword instead.
     * @param {Function} ctor
     * @param {Function|*} superCtor
     */
    static inherits(ctor: any, superCtor: any): void {

        if (typeof superCtor !== 'function' && superCtor !== null) {
            throw new TypeError('Super expression must either be null or a function, not ' + typeof superCtor);
        }

        ctor.prototype = Object.create(superCtor && superCtor.prototype, {
            constructor: {
                value: ctor,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        if (superCtor) {
            /**
             * @function setPrototypeOf
             * @param {*} obj
             * @param {*} prototype
             * @memberOf Object
             * @static
             */
            if (typeof Object.setPrototypeOf === 'function') {
                Object.setPrototypeOf(ctor, superCtor);
            }
            else {
                ctor.__proto__ = superCtor;
            }
        }
        //node.js As an additional convenience, superConstructor will be accessible through the constructor.super_ property.
        ctor.super_ = ctor.__proto__;
    }
    /**
     * Returns an array of strings which represents the arguments' names of the given function
     * @param {Function} fn
     * @returns {Array}
     */
    static getFunctionParams(fn: any): any[] | RegExpMatchArray {
        if (typeof fn !== 'function'){
            return [];
        }
        const fnStr = fn.toString().replace(STRIP_COMMENTS, '');
        let result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(/([^\s,]+)/g);
        if (result === null)
            result = [];
        return result;
    }
    /**
     * @param {*} value
     */
    static convert(value: any): any {
        let result;
        if ((typeof value === 'string')) {
            if (value.length === 0) {
                result = value;
            }
            if (value.match(BooleanTrueRegex)) {
                result = true;
            }
            else if (value.match(BooleanFalseRegex)) {
                result = false;
            }
            else if (value.match(NullRegex) || value.match(UndefinedRegex)) {
                result = null;
            }
            else if (value.match(IntegerRegex)) {
                result = parseInt(value, 10);
            }
            else if (value.match(FloatRegex)) {
                result = parseFloat(value);
            }
            else if (value.match(DateTimeRegex)) {
                result = new Date(Date.parse(value));
            }
            else {
                result = value;
            }
        }
        else {
            result = value;
        }
        return result;
    }
    /**
     *
     * @param {*} origin
     * @param {string} expr
     * @param {string} value
     * @param {*=} options
     * @returns {*}
     */
    static extend(origin: any, expr: string, value: string, options?: any): any {

        options = options || { convertValues: false };
        //find base notation
        let match = /(^\w+)\[/.exec(expr);
        let name;
        let descriptor;
        let expr1;
        if (match) {
            //get property name
            name = match[1];
            //validate array property
            if (/^\d+$/g.test(name)) {
                //property is an array
                if (!Array.isArray(origin.value))
                    origin.value = [];
                // get new expression
                expr1 = expr.substr(match.index + match[1].length);
                LangUtils.extend(origin, expr1, value, options);
            }
            else {
                //set property value (unknown)
                origin[name] = origin[name] || new LangUtils();
                descriptor = new UnknownPropertyDescriptor(origin, name);
                // get new expression
                expr1 = expr.substr(match.index + match[1].length);
                LangUtils.extend(descriptor, expr1, value, options);
            }
        }
        else if (expr.indexOf('[') === 0) {
            //get property
            const re = /\[(.*?)]/g;
            match = re.exec(expr);
            if (match) {
                name = match[1];
                // get new expression
                expr1 = expr.substr(match.index + match[0].length);
                if (/^\d+$/g.test(name)) {
                    //property is an array
                    if (!Array.isArray(origin.value))
                        origin.value = [];
                }
                if (expr1.length === 0) {
                    if (origin.value instanceof LangUtils) {
                        origin.value = {};
                    }
                    let typedValue;
                    //convert string value
                    if ((typeof value === 'string') && options.convertValues) {
                        typedValue = LangUtils.convert(value);
                    }
                    else {
                        typedValue = value;
                    }
                    if (Array.isArray(origin.value))
                        origin.value.push(typedValue);

                    else
                        origin.value[name] = typedValue;
                }
                else {
                    if (origin.value instanceof LangUtils) {
                        origin.value = {};
                    }
                    origin.value[name] = origin.value[name] || new LangUtils();
                    descriptor = new UnknownPropertyDescriptor(origin.value, name);
                    LangUtils.extend(descriptor, expr1, value, options);
                }
            }
            else {
                throw new Error('Invalid object property notation. Expected [name]');
            }
        }
        else if (/^\w+$/.test(expr)) {
            if (options.convertValues)
                origin[expr] = LangUtils.convert(value);

            else
                origin[expr] = value;
        }
        else {
            throw new Error('Invalid object property notation. Expected property[name] or [name]');
        }
        return origin;
    }
    /**
     *
     * @param {*} form
     * @param {*=} options
     * @returns {*}
     */
    static parseForm(form: any, options?:  any): any {
        const result = {};
        if (typeof form === 'undefined' || form === null)
            return result;
        const keys = Object.keys(form);
        keys.forEach((key) => {
            if (Object.prototype.hasOwnProperty.call(form, key)) {
                LangUtils.extend(result, key, form[key], options);
            }
        });
        return result;
    }
    /**
     * Parses value or string and returns the resulted object.
     * @param {*} value
     * @returns {*}
     */
    static parseValue(value: any): any {
        return LangUtils.convert(value);
    }
    /**
     * Parses value value and returns the equivalent integer.
     * @param {*} value
     * @returns {*}
     */
    static parseInt(value: any): number {
        return parseInt(value, 10) || 0;
    }
    /**
     * Parses value value and returns the equivalent float number.
     * @param {*} value
     * @returns {*}
     */
    static parseFloat(value: any): number {
        return parseFloat(value) || 0;
    }
    /**
     * Parses value and returns the equivalent boolean.
     * @param {*} value
     * @returns {*}
     */
    static parseBoolean(value: any): boolean {
        if (typeof value === 'undefined' || value === null)
            return false;
        else if (typeof value === 'number')
            return value !== 0;
        else if (typeof value === 'string') {
            if (value.match(IntegerRegex) || value.match(FloatRegex)) {
                return parseInt(value, 10) !== 0;
            }
            else if (value.match(BooleanTrueRegex))
                return true;
            else if (value.match(BooleanFalseRegex))
                return false;
            else if (/^yes$|^on$|^y$|^valid$/i.test(value))
                return true;
            else if (/^no$|^off$|^n$|^invalid$/i.test(value))
                return false;

            else
                return false;
        }
        else if (typeof value === 'boolean')
            return value;
        else {
            return (parseInt(value, 10) || 0) !== 0;
        }
    }
    /**
     * @static
     * Checks if the given value is a valid date
     * @param {*} value
     * @returns {boolean}
     */
    static isDate(value: any): boolean {
        if (value instanceof Date) {
            return true;
        }
        return DateTimeRegex.test(value);
    }
}

/**
 * @function captureStackTrace
 * @memberOf Error
 * @param {Error} thisArg
 * @param {string} name
 * @static
 */

class Args {
    constructor() {
        //
    }
    /**
     * Checks the expression and throws an exception if the condition is not met.
     * @param {*} expr
     * @param {string|Error} err
     */
    static check(expr: any, err: string | Error): void {
        Args.notNull(expr, 'Expression');
        let res;
        if (typeof expr === 'function') {
            res = !(expr.call());
        }
        else {
            res = (!expr);
        }
        if (res) {
            if (err instanceof Error) {
                throw err;
            }
            throw new ArgumentError(err, 'ECHECK');
        }
    }
    /**
     *
     * @param {*} arg
     * @param {string} name
     */
    static notNull(arg: any, name: string): void {
        if (typeof arg === 'undefined' || arg === null) {
            throw new ArgumentError(name + ' may not be null or undefined', 'ENULL');
        }
    }
    /**
     * @param {*} arg
     * @param {string} name
     */
    static notString(arg: any, name: string): void {
        if (typeof arg !== 'string') {
            throw new ArgumentError(name + ' must be a string', 'EARG');
        }
    }
    /**
     * @param {*} arg
     * @param {string} name
     */
    static notFunction(arg: any, name: string): void {
        if (typeof arg !== 'function') {
            throw new ArgumentError(name + ' must be a function', 'EARG');
        }
    }
    /**
     * @param {*} arg
     * @param {string} name
     */
    static notNumber(arg: any, name: string): void {
        if ((typeof arg !== 'number') || isNaN(arg)) {
            throw new ArgumentError(name + ' must be number', 'EARG');
        }
    }
    /**
     * @param {string|*} arg
     * @param {string} name
     */
    static notEmpty(arg: any, name: any): void {
        Args.notNull(arg, name);
        if ((Object.prototype.toString.bind(arg)() === '[object Array]') && (arg.length === 0)) {
            throw new ArgumentError(name + ' may not be empty', 'EEMPTY');
        }
        else if ((typeof arg === 'string') && (arg.length === 0)) {
            throw new ArgumentError(name + ' may not be empty', 'EEMPTY');
        }
    }
    /**
     * @param {number|*} arg
     * @param {string} name
     */
    static notNegative(arg: any, name: any): void {
        Args.notNumber(arg, name);
        if (arg < 0) {
            throw new ArgumentError(name + ' may not be negative', 'ENEG');
        }
    }
    /**
     * @param {number|*} arg
     * @param {string} name
     */
    static notPositive(arg: any, name: any): void {
        Args.notNumber(arg, name);
        if (arg <= 0) {
            throw new ArgumentError(name + ' may not be negative or zero', 'EPOS');
        }
    }
}

class TextUtils {
    // tslint:disable-next-line:no-empty
    constructor() {
    }
    /**
     * Converts the given parameter to MD5 hex string
     * @static
     * @param {*} value
     * @returns {string|undefined}
     */
    static toMD5(value: any): string {
        if (value == null) {
            return;
        }
        if (typeof value === 'string') {
            return MD5(value).toString();
        }
        return MD5(JSON.stringify(value)).toString();
    }
    /**
     * Converts the given parameter to SHA1 hex string
     * @static
     * @param {*} value
     * @returns {string|undefined}
     */
    static toSHA1(value: any): string {
        if (value == null) {
            return;
        }
        if (typeof value === 'string') {
            return SHA1(value).toString();
        }
        return SHA1(JSON.stringify(value)).toString();
    }
    /**
     * Converts the given parameter to SHA256 hex string
     * @static
     * @param {*} value
     * @returns {string|undefined}
     */
    static toSHA256(value: any): string {
        if (value == null) {
            return;
        }
        if (typeof value === 'string') {
            return SHA256(value).toString();
        }
        return SHA256(JSON.stringify(value)).toString();
    }
    /**
     * Returns a random GUID/UUID string
     * @static
     * @returns {string}
     */
    static newUUID(): string {
        const chars = UUID_CHARS;
        const uuid = [];
        // rfc4122, version 4 form
        let r: any = void 0;
        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';

        // Fill in random data.  At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (let i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random() * 16;
                uuid[i] = chars[i === 19 ? r & 0x3 | 0x8 : r];
            }
        }
        return uuid.join('');
    }
}

/**
 * @class
 * @constructor
 */
class TraceUtils {
    private static _logger: TraceLogger;
    // tslint:disable-next-line:no-empty
    constructor() {
    }
    static useLogger(logger: TraceLogger) {
        TraceUtils._logger = logger;
    }
    static level(level: string)  {
        TraceUtils._logger.level(level);
    }
    static format(format: string)  {
        TraceUtils._logger.options.format = format;
    }
    /**
     * @static
     * @param {...*} args
     */
    // eslint-disable-next-line no-unused-vars
    static log(...args: any) {
        TraceUtils._logger.log.apply(TraceUtils._logger, args);
    }
    /**
     * @static
     * @param {...*} args
     */
    // eslint-disable-next-line no-unused-vars
    static error(...args: any) {
        TraceUtils._logger.error.apply(TraceUtils._logger, args);
    }
    /**
     *
     * @static
     * @param {...*} args
     */
    // eslint-disable-next-line no-unused-vars
    static info(...args: any) {
        TraceUtils._logger.info.apply(TraceUtils._logger, args);
    }
    /**
     *
     * @static
     * @param {*} args
     */
    // eslint-disable-next-line no-unused-vars
    static warn(...args: any) {
        TraceUtils._logger.warn.apply(TraceUtils._logger, args);
    }
    /**
     *
     * @static
     * @param {*} args
     */
    // eslint-disable-next-line no-unused-vars
    static verbose(...args: any) {
        TraceUtils._logger.verbose.apply(TraceUtils._logger, args);
    }
    /**
     *
     * @static
     * @param {...*} args
     */
    // eslint-disable-next-line no-unused-vars
    static debug(...args: any) {
        TraceUtils._logger.debug.apply(TraceUtils._logger, args);
    }
}

class RandomUtils {
    constructor() {
        //
    }
    /**
     * Returns a random string based on the length specified
     * @param {Number} length
     */
    static randomChars(length?: number) {
        length = length || 8;
        const chars = 'abcdefghkmnopqursuvwxz2456789ABCDEFHJKLMNPQURSTUVWXYZ';
        let str = '';
        for (let i = 0; i < length; i++) {
            str += chars.substr(this.randomInt(0, chars.length - 1), 1);
        }
        return str;
    }
    /**
     * Returns a random integer between a minimum and a maximum value
     * @param {number} min
     * @param {number} max
     */
    static randomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    /**
     * Returns a random string based on the length specified
     * @static
     * @param {number} length
     * @returns {string}
     */
    static randomHex(length?: number): string {
        length = (length || 8) * 2;
        let str = '';
        for (let i = 0; i < length; i++) {
            str += HEX_CHARS.substr(this.randomInt(0, HEX_CHARS.length - 1), 1);
        }
        return str;
    }
}

class NumberUtils {
    constructor() {
        //
    }
    /**
     * Converts a base-26 formatted string to the equivalent integer
     * @static
     * @param {string} s A base-26 formatted string e.g. aaaaaaaa for 0, baaaaaaa for 1 etc
     * @return {number} The equivalent integer value
     */
    static fromBase26(s: string): number {
        let num = 0;
        if (!/[a-z]{8}/.test(s)) {
            throw new Error('Invalid base-26 format.');
        }
        const a = 'a'.charCodeAt(0);
        for (let i = 7; i >= 0; i--) {
            num = (num * 26) + (s[i].charCodeAt(0) - a);
        }
        return num;
    }
    /**
     * Converts an integer to the equivalent base-26 formatted string
     * @static
     * @param {number} x The integer to be converted
     * @return {string} The equivalent string value
     */
    static toBase26(x: any): string {
        //noinspection ES6ConvertVarToLetConst
        let num = parseInt(x, 10);
        if (num < 0) {
            throw new Error('A non-positive integer cannot be converted to base-26 format.');
        }
        if (num > 208827064575) {
            throw new Error('A positive integer bigger than 208827064575 cannot be converted to base-26 format.');
        }
        let out = '';
        let length = 1;
        const a = 'a'.charCodeAt(0);
        while (length <= 8) {
            out += String.fromCharCode(a + (num % 26));
            num = Math.floor(num / 26);
            length += 1;
        }
        return out;
    }
}

class PathUtils {
    constructor() {
        //
    }
    /**
     *
     * @param {...string} part
     * @returns {string}
     */
    // eslint-disable-next-line no-unused-vars
    static join(...part: string[]): string {
        // Split the inputs into a list of path commands.
        let parts: string[] = [];
        let i;
        let l;
        for (i = 0, l = arguments.length; i < l; i++) {
            parts = parts.concat(arguments[i].split('/'));
        }
        // Interpret the path commands to get the new resolved path.
        const newParts = [];
        for (i = 0, l = parts.length; i < l; i++) {
            const part1 = parts[i];
            // Remove leading and trailing slashes
            // Also remove "." segments
            if (!part1 || part1 === '.')
                continue;
            // Interpret ".." to pop the last segment
            if (part1 === '..')
                newParts.pop();

            // Push new path segments.
            else
                newParts.push(part1);
        }
        // Preserve the initial slash if there was one.
        if (parts[0] === '')
            newParts.unshift('');
        // Turn back into a single string path.
        return newParts.join('/') || (newParts.length ? '/' : '.');
    }
}

const Reset = '\x1b[0m';
const FgBlack = '\x1b[30m';
const FgRed = '\x1b[31m';
const FgGreen = '\x1b[32m';
// eslint-disable-next-line no-unused-vars
const FgYellow = '\x1b[33m';
const FgBlue = '\x1b[34m';
const FgMagenta = '\x1b[35m';
// eslint-disable-next-line no-unused-vars
const FgCyan = '\x1b[36m';
// eslint-disable-next-line no-unused-vars
const FgWhite = '\x1b[37m';

const Bold = '\x1b[1m';

declare interface LogLevelIndexer {
    [key: string]: number;
    error: number;
    warn: number;
    info: number;
    verbose: number;
    debug: number;
}

const LogLevels: LogLevelIndexer = {
    error: 0,
    warn: 1,
    info: 2,
    verbose: 3,
    debug: 4
};

const LogLevelColors = {
    error: FgRed,
    warn: FgMagenta,
    info: FgBlack,
    verbose: FgBlue,
    debug: Bold + FgGreen
};

function zeroPad(value: number, length: number) {
    value = value || 0;
    let res = value.toString();
    while (res.length < length) {
        res = '0' + res;
    }
    return res;
}

/**
 * @private
 * @returns {string}
 */
function timestamp(): string {
    const val = new Date();
    const yyyy = val.getFullYear();
    const MM = zeroPad(val.getMonth() + 1, 2);
    const DD = zeroPad(val.getDate(), 2);
    const HH = zeroPad(val.getHours(), 2);
    const mm = zeroPad(val.getMinutes(), 2);
    const ss = zeroPad(val.getSeconds(), 2);
    //format timezone
    const offset = val.getTimezoneOffset()
    const Z = (offset <= 0 ? '+' : '-') + zeroPad(-Math.floor(offset / 60), 2) + ':' + zeroPad(offset % 60, 2);
    return `${yyyy}-${MM}-${DD}T${HH}:${mm}:${ss}${Z}`;
}

class TraceLogger {
    options: { colors: boolean; level: string; format?: string; } | any;
    constructor(options?: { colors: boolean, level: string, format?: string } | any) {
        this.options = Object.assign({
            colors: false,
            level: 'info',
            format: 'raw'
        }, options);
        if (isNode && process.env.NODE_ENV === 'development') {
            this.options.level = 'debug';
        }
        Args.check(Object.prototype.hasOwnProperty.call(LogLevels, this.options.level), 'Invalid logging level. Expected error, warn, info, verbose or debug.');
    }
    /**
     * @param {string} level
     * @returns {*}
     */
    level(level: string): this {
        Args.check(Object.prototype.hasOwnProperty.call(LogLevels, level), 'Invalid logging level. Expected error, warn, info, verbose or debug.');
        this.options.level = level;
        return this;
    }
    /**
     * @param {...*} args
     */
    log(...args: any) {
        return this.write.apply(this, ['info'].concat(args));
    }
    /**
     * @param {...*} args
     */
    info(...args: any) {
        return this.write.apply(this, ['info'].concat(args));
    }
    /**
     * @param {...*} args
     */
    error(...args: any) {
        return this.write.apply(this, ['error'].concat(args));
    }
    /**
     * @param {...*} args
     */
    warn(...args: any) {
        return this.write.apply(this, ['warn'].concat(args));
    }
    /**
     * @param {...*} args
     */
    verbose(...args: any) {
        return this.write.apply(this, ['verbose'].concat(args));
    }
    /**
     * @param {...*} args
     */
    debug(...args: any) {
        return this.write.apply(this, ['debug'].concat(args));
    }
    write(level: string, ...args: any) {
        if (LogLevels[level] > LogLevels[this.options.level]) {
            return;
        }
        // tslint:disable-next-line:no-console
        const log = (level === 'error') ? console.error : console.log
        if (this.options.format === 'json') {
            return log.call(console, JSON.stringify([
                timestamp(),
                level.toUpperCase()
            ].concat(args), (key, value: any) => {
                if (value instanceof Error) {
                    const error = (value as PropertyIndexer);
                    const result = Object.keys(error).reduce((obj, key1) => {
                        Object.defineProperty(obj, key1, {
                            enumerable: true,
                            configurable: true,
                            writable: true,
                            value: error[key1]
                        });
                        return obj;
                    }, {
                        message: value.message,
                        type: value.constructor.name,
                    });
                    Object.assign(result, {
                        stack: value.stack
                    });
                    return result;
                }
                return value;
            }));
        }
        log.apply(console, [
            timestamp(),
            '[' + level.toUpperCase() + ']'
        ].concat(args).map((arg0: any) => {
            // log error stacktrace
            if (level === 'error' && arg0 instanceof Error && Object.prototype.hasOwnProperty.call(arg0, 'stack')) {
                return arg0.stack;
            }
            return String(arg0);
        }));
    }
}

TraceUtils.useLogger(new TraceLogger());

class Base26Number {
    constructor(value: any) {
        const thisValue = value;
        this.toString = () => {
            return Base26Number.toBase26(thisValue);
        };
    }
    /**
     *
     * @param {number} x
     * @returns {string}
     */
    static toBase26(x: number): string {
        let num = Math.floor(x | 0);
        if (num < 0) {
            throw new Error('A non-positive integer cannot be converted to base-26 format.');
        }
        if (num > 208827064575) {
            throw new Error('A positive integer bigger than 208827064575 cannot be converted to base-26 format.');
        }
        let out = '';
        let length = 1;
        const a = 'a'.charCodeAt(0);
        while (length <= 8) {
            out += String.fromCharCode(a + (num % 26));
            num = Math.floor(num / 26);
            length += 1;
        }
        return out;
    }
    /**
     *
     * @param {string} s
     * @returns {number}
     */
    static fromBase26(s: string): number {
        let num = 0;
        if (!/[a-z]{8}/.test(s)) {
            throw new Error('Invalid base-26 format.');
        }
        const a = 'a'.charCodeAt(0);
        for (let i = 7; i >= 0; i--) {
            num = (num * 26) + (s[i].charCodeAt(0) - a);
        }
        return num;
    }
}

class Guid {
    private readonly _value: string;
    constructor(value?: string) {
        if (typeof value === 'string') {
            const test = value.replace(/^{/, '').replace(/{$/, '');
            Args.check(GuidRegex.test(test), 'Value must be a valid UUID');
            this._value = test;
            return;
        }
        this._value = TextUtils.newUUID();
    }
    toJSON() {
        return this._value;
    }
    valueOf() {
        return this._value;
    }
    toString() {
        return this._value;
    }
    /**
     * @param {string|*} s
     * @returns {boolean}
     */
    static isGuid(s: any): boolean {
        if (s instanceof Guid) {
            return true;
        }
        if (typeof s !== 'string') {
            return false;
        }
        return GuidRegex.test(s);
    }
    /**
     * @returns {Guid}
     */
    static newGuid(): Guid {
        return new Guid();
    }
}

/**
 * @param {string} msg
 * @param {string} code
 * @constructor
 * @extends TypeError
 */
class ArgumentError extends TypeError {
    code: string;
    constructor(msg: string, code?: string) {
        super(msg);
        this.message = msg;
        this.code = code || 'EARG';
        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export {
    ArgumentError,
    Args,
    UnknownPropertyDescriptor,
    LangUtils,
    NumberUtils,
    RandomUtils,
    TraceUtils,
    TextUtils,
    PathUtils,
    Base26Number,
    Guid
}
