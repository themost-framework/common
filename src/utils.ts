// MOST Web Framework 2.0 Codename ZeroGraviry Copyright (c) 2017-2021, THEMOST LP All rights reserved

const isNode = Object.prototype.toString.call(typeof process !== 'undefined' ? process : 0) === '[object process]';
import { sprintf } from 'sprintf';

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

/**
 * @class
 * @constructor
 */
class UnknownPropertyDescriptor {
    constructor(obj: any, name: string) {
        Object.defineProperty(this, 'value', { 
            configurable: false,
            enumerable: true,
            get: function () {
                return obj[name];
            },
            set: function (value) {
                obj[name] = value;
            }
        });
        Object.defineProperty(this, 'name', {
            configurable: false,
            enumerable: true,
            get: function () {
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
     * @param {Function} ctor
     * @param {Function|*} superCtor
     * @example
    function Animal() {
        //
    }
    
    function Dog() {
        Dog.super_.bind(this)();
    }
    LangUtils.inherits(Dog,Animal);
     */
    static inherits(ctor: any, superCtor: any): void {

        if (typeof superCtor !== 'function' && superCtor !== null) {
            throw new TypeError('Super expression must either be null or a function, not ' + typeof superCtor);
        }

        //if process is running under node js
        if (isNode) {
            let utilModule = 'util';
            let util = require(utilModule);
            //call util.inherits() function
            return util.inherits(ctor, superCtor);
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
        let fnStr = fn.toString().replace(STRIP_COMMENTS, '');
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
                result = parseInt(value);
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
        let match = /(^\w+)\[/.exec(expr), name, descriptor, expr1;
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
            let re = /\[(.*?)\]/g;
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
        let result = {};
        if (typeof form === 'undefined' || form === null)
            return result;
        let keys = Object.keys(form);
        keys.forEach(function (key) {
            if (Object.prototype.hasOwnProperty.call(form, key)) {
                LangUtils.extend(result, key, form[key], options);
            }
        });
        return result;
    }
    /**
     * Parses any value or string and returns the resulted object.
     * @param {*} any
     * @returns {*}
     */
    static parseValue(any: any): any {
        return LangUtils.convert(any);
    }
    /**
     * Parses any value and returns the equivalent integer.
     * @param {*} any
     * @returns {*}
     */
    static parseInt(any: any): number {
        return parseInt(any) || 0;
    }
    /**
     * Parses any value and returns the equivalent float number.
     * @param {*} any
     * @returns {*}
     */
    static parseFloat(any: any): number {
        return parseFloat(any) || 0;
    }
    /**
     * Parses any value and returns the equivalent boolean.
     * @param {*} any
     * @returns {*}
     */
    static parseBoolean(any: any): boolean {
        if (typeof any === 'undefined' || any === null)
            return false;
        else if (typeof any === 'number')
            return any !== 0;
        else if (typeof any === 'string') {
            if (any.match(IntegerRegex) || any.match(FloatRegex)) {
                return parseInt(any, 10) !== 0;
            }
            else if (any.match(BooleanTrueRegex))
                return true;
            else if (any.match(BooleanFalseRegex))
                return false;
            else if (/^yes$|^on$|^y$|^valid$/i.test(any))
                return true;
            else if (/^no$|^off$|^n$|^invalid$/i.test(any))
                return false;

            else
                return false;
        }
        else if (typeof any === 'boolean')
            return any;
        else {
            return (parseInt(any) || 0) !== 0;
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
    constructor() {
    }
    /**
         * Converts the given parameter to MD5 hex string
         * @static
         * @param {*} value
         * @returns {string|undefined}
         */
    static toMD5(value: any): string {

        if (typeof value === 'undefined' || value === null) {
            return;
        }
        //browser implementation
        let md5, md5module;
        if (typeof window !== 'undefined') {
            md5module = 'blueimp-md5';
            md5 = require(md5module);
            if (typeof value === 'string') {
                return md5(value);
            }
            else if (value instanceof Date) {
                return md5(value.toUTCString());
            }
            else {
                return md5(JSON.stringify(value));
            }
        }
        //node.js implementation
        md5module = 'crypto';
        let crypto = require(md5module);
        md5 = crypto.createHash('md5');
        if (typeof value === 'string') {
            md5.update(value);
        }
        else if (value instanceof Date) {
            md5.update(value.toUTCString());
        }
        else {
            md5.update(JSON.stringify(value));
        }
        return md5.digest('hex');
    }
    /**
         * Converts the given parameter to SHA1 hex string
         * @static
         * @param {*} value
         * @returns {string|undefined}
         */
    static toSHA1(value: any): string {

        let cryptoModule = 'crypto';
        if (typeof window !== 'undefined') {
            throw new Error('This method is not implemented for this environment');
        }

        let crypto = require(cryptoModule);
        if (typeof value === 'undefined' || value === null) {
            return;
        }
        let sha1 = crypto.createHash('sha1');
        if (typeof value === 'string') {
            sha1.update(value);
        }
        else if (value instanceof Date) {
            sha1.update(value.toUTCString());
        }
        else {
            sha1.update(JSON.stringify(value));
        }
        return sha1.digest('hex');
    }
    /**
         * Converts the given parameter to SHA256 hex string
         * @static
         * @param {*} value
         * @returns {string|undefined}
         */
    static toSHA256(value: any): string {

        let cryptoModule = 'crypto';
        if (typeof window !== 'undefined') {
            throw new Error('This method is not implemented for this environment');
        }

        let crypto = require(cryptoModule);
        if (typeof value === 'undefined' || value === null) {
            return;
        }
        let sha256 = crypto.createHash('sha256');
        if (typeof value === 'string') {
            sha256.update(value);
        }
        else if (value instanceof Date) {
            sha256.update(value.toUTCString());
        }
        else {
            sha256.update(JSON.stringify(value));
        }
        return sha256.digest('hex');
    }
    /**
         * Returns a random GUID/UUID string
         * @static
         * @returns {string}
         */
    static newUUID(): string {
        let chars = UUID_CHARS;
        let uuid = [];
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
    constructor() {
    }
    static useLogger(logger: TraceLogger) {
        TraceUtils._logger = logger;
    }
    static level(level: string)  {
        TraceUtils._logger.level(level);
    }
    /**
         * @static
         * @param {...*} data
         */
    // eslint-disable-next-line no-unused-vars
    static log(...data: any[]) {
        TraceUtils._logger.log.apply(TraceUtils._logger, Array.prototype.slice.call(arguments));
    }
    /**
         * @static
         * @param {...*} data
         */
    // eslint-disable-next-line no-unused-vars
    static error(...data: any[]) {
        TraceUtils._logger.error.apply(TraceUtils._logger, Array.prototype.slice.call(arguments));
    }
    /**
         *
         * @static
         * @param {...*} data
         */
    // eslint-disable-next-line no-unused-vars
    static info(...data: any[]) {
        TraceUtils._logger.info.apply(TraceUtils._logger, Array.prototype.slice.call(arguments));
    }
    /**
         *
         * @static
         * @param {*} data
         */
    // eslint-disable-next-line no-unused-vars
    static warn(...data: any[]) {
        TraceUtils._logger.warn.apply(TraceUtils._logger, Array.prototype.slice.call(arguments));
    }
    /**
         *
         * @static
         * @param {*} data
         */
    // eslint-disable-next-line no-unused-vars
    static verbose(...data: any[]) {
        TraceUtils._logger.verbose.apply(TraceUtils._logger, Array.prototype.slice.call(arguments));
    }
    /**
         *
         * @static
         * @param {...*} data
         */
    // eslint-disable-next-line no-unused-vars
    static debug(...data: any[]) {
        TraceUtils._logger.debug.apply(TraceUtils._logger, Array.prototype.slice.call(arguments));
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
        let chars = 'abcdefghkmnopqursuvwxz2456789ABCDEFHJKLMNPQURSTUVWXYZ';
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
        let a = 'a'.charCodeAt(0);
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
        let num = parseInt(x);
        if (num < 0) {
            throw new Error('A non-positive integer cannot be converted to base-26 format.');
        }
        if (num > 208827064575) {
            throw new Error('A positive integer bigger than 208827064575 cannot be converted to base-26 format.');
        }
        let out = '';
        let length = 1;
        let a = 'a'.charCodeAt(0);
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
    static join(...part: string[]) {
        let pathModule = 'path';
        if (isNode) {
            let path = require(pathModule);
            return path.join.apply(null, Array.prototype.slice.call(arguments));
        }
        // Split the inputs into a list of path commands.
        let parts: string[] = [], i, l;
        for (i = 0, l = arguments.length; i < l; i++) {
            parts = parts.concat(arguments[i].split('/'));
        }
        // Interpret the path commands to get the new resolved path.
        let newParts = [];
        for (i = 0, l = parts.length; i < l; i++) {
            let part1 = parts[i];
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

let Reset = '\x1b[0m';
let FgBlack = '\x1b[30m';
let FgRed = '\x1b[31m';
let FgGreen = '\x1b[32m';
// eslint-disable-next-line no-unused-vars
let FgYellow = '\x1b[33m';
let FgBlue = '\x1b[34m';
let FgMagenta = '\x1b[35m';
// eslint-disable-next-line no-unused-vars
let FgCyan = '\x1b[36m';
// eslint-disable-next-line no-unused-vars
let FgWhite = '\x1b[37m';

let Bold = '\x1b[1m';

declare interface LogLevelIndexer {
    [key: string]: number;
    error: number;
    warn: number;
    info: number;
    verbose: number;
    debug: number;
}

let LogLevels: LogLevelIndexer = {
    error: 0,
    warn: 1,
    info: 2,
    verbose: 3,
    debug: 4
};

let LogLevelColors = {
    error: FgRed,
    warn: FgMagenta,
    info: FgBlack,
    verbose: FgBlue,
    debug: Bold + FgGreen
};

/**
 * @private
 * @returns {string}
 */
function timestamp() {
    return (new Date()).toUTCString();
}

/**
 * @private
 * @this TraceLogger
 * @param level
 * @param err
 */
function writeError(level: string, err: any) {

    let keys = Object.keys(err).filter(function(x) {
        return Object.prototype.hasOwnProperty.call(err, x) && x!=='message' && typeof err[x] !== 'undefined' && err[x] != null;
    });
    if (err instanceof Error) {
        if (Object.prototype.hasOwnProperty.call(err, 'stack')) {
            this.write(level, err.stack);
        }
        else {
            this.write(level, err.toString());
        }
    }
    else {
        this.write(level, err.toString());
    }
    if (keys.length>0) {
        this.write(level, 'Error: ' + keys.map(function(x) {
            return '[' + x + ']=' + err[x].toString()
        }).join(', '));
    }
}

class TraceLogger {
    options: { colors: boolean; level: string; };
    constructor(options?: { colors: boolean, level: string }) {
        this.options = {
            colors: false,
            level: 'info'
        };
        if (typeof options === 'undefined' && options !== null && isNode) {
            if (isNode && process.env.NODE_ENV === 'development') {
                this.options.level = 'debug';
            }
        }
        if (typeof options !== 'undefined' && options !== null) {
            this.options = options;
            //validate logging level
            Args.check(Object.prototype.hasOwnProperty.call(LogLevels, this.options.level), 'Invalid logging level. Expected error, warn, info, verbose or debug.');
        }
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
     * @param {...*} data
     */
    // eslint-disable-next-line no-unused-vars
    log(...data: any[]) {
        let args = Array.prototype.slice.call(arguments);
        if (typeof data === 'undefined' || data === null) {
            return;
        }
        if (data instanceof Error) {
            return writeError.bind(this)('info', data);
        }
        if (typeof data !== 'string') {
            return this.write('info', data.toString());
        }
        if (args.length > 1) {
            return this.write('info', sprintf.apply(null, args));
        }
        this.write('info', data);
    }
    /**
     * @param {...*} data
     */
    // eslint-disable-next-line no-unused-vars
    info(...data: any[]) {
        let args = Array.prototype.slice.call(arguments);
        if (typeof data === 'undefined' || data === null) {
            return;
        }
        if (data instanceof Error) {
            return writeError.bind(this)('info', data);
        }
        if (typeof data !== 'string') {
            return this.write('info', data.toString());
        }
        if (args.length > 1) {
            return this.write('info', sprintf.apply(null, args));
        }
        this.write('info', data);
    }
    /**
     * @param {...*} data
     */
    // eslint-disable-next-line no-unused-vars
    error(...data: any[]) {
        let args = Array.prototype.slice.call(arguments);
        if (typeof data === 'undefined' || data === null) {
            return;
        }
        if (data instanceof Error) {
            return writeError.bind(this)('error', data);
        }
        if (typeof data !== 'string') {
            return this.write('error', data.toString());
        }
        if (args.length > 1) {
            return this.write('error', sprintf.apply(null, args));
        }
        this.write('error', data);
    }
    /**
     * @param {...*} data
     */
    // eslint-disable-next-line no-unused-vars
    warn(...data: any[]) {
        let args = Array.prototype.slice.call(arguments);
        if (typeof data === 'undefined' || data === null) {
            return;
        }
        if (data instanceof Error) {
            return writeError.bind(this)('warn', data);
        }
        if (typeof data !== 'string') {
            return this.write('warn', data.toString());
        }
        if (args.length > 1) {
            return this.write('warn', sprintf.apply(null, args));
        }
        this.write('warn', data);
    }
    /**
     * @param {...*} data
     */
    // eslint-disable-next-line no-unused-vars
    verbose(...data: any[]) {
        let args = Array.prototype.slice.call(arguments);
        if (typeof data === 'undefined' || data === null) {
            return;
        }
        if (data instanceof Error) {
            return writeError.bind(this)('verbose', data);
        }
        if (typeof data !== 'string') {
            return this.write('verbose', data.toString());
        }
        if (args.length > 1) {
            return this.write('verbose', sprintf.apply(null, args));
        }
        this.write('verbose', data);
    }
    /**
     * @param {...*} data
     */
    // eslint-disable-next-line no-unused-vars
    debug(...data: any[]) {
        let args = Array.prototype.slice.call(arguments);
        if (typeof data === 'undefined' || data === null) {
            return;
        }
        if (data instanceof Error) {
            return writeError.bind(this)('debug', data);
        }
        if (typeof data !== 'string') {
            return this.write('debug', data.toString());
        }
        if (args.length > 1) {
            return this.write('debug', sprintf.apply(null, args));
        }
        this.write('debug', data);

    }
    write(level: string, text: string) {
        if (LogLevels[level] > LogLevels[this.options.level]) {
            return;
        }
        if (this.options.colors) {
            // eslint-disable-next-line no-console
            console.log(LogLevels[level] + timestamp() + ' [' + level.toUpperCase() + '] ' + text, Reset);
        } else {
            // eslint-disable-next-line no-console
            console.log(timestamp() + ' [' + level.toUpperCase() + '] ' + text);
        }
    }
}

TraceUtils.useLogger(new TraceLogger());

class Base26Number {
    constructor(value: any) {
        let thisValue = value;
        this.toString = function () {
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
        let a = 'a'.charCodeAt(0);
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
        let a = 'a'.charCodeAt(0);
        for (let i = 7; i >= 0; i--) {
            num = (num * 26) + (s[i].charCodeAt(0) - a);
        }
        return num;
    }
}

class Guid {
    private _value: string;
    constructor(value?: string) {
        if (typeof value === 'string') {
            let test = value.replace(/^{/, '').replace(/{$/, '');
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
