// MOST Web Framework 2.0 Codename ZeroGraviry Copyright (c) 2017-2021, THEMOST LP All rights reserved

import { escape } from 'lodash';
import * as prettier from 'prettier';
import * as htmlParser from 'prettier/parser-html';
const HTML_START_CHAR = '<';
const HTML_END_CHAR = '>';
const HTML_FULL_END_STRING = ' />';
const HTML_SPACE_CHAR = ' ';
const HTML_ATTR_STRING = '%0="%1"';
const HTML_START_TAG_STRING = '<%0';
const HTML_END_TAG_STRING = '</%0>';

export declare interface HtmlAttributeIndexer {
    [key: string]: any;
}

class HtmlWriter {
    bufferedAttributes: any[];
    private bufferedTags: string[] = [];
    buffer: string;
    indent: boolean;

    public static readonly TagRightChar = HTML_END_CHAR;
    public static readonly TagLeftChar = HTML_START_CHAR;
    public static readonly SelfClosingChars = HTML_FULL_END_STRING;

    constructor() {
        /**
         * @private
         * @type {Array}
         */
        this.bufferedAttributes = [];
        /**
         * @private
         * @type {String}
         */
        this.buffer = '';
        /**
         * @private
         * @type {Integer}
         */
        this.indent = true;
    }
    /**
     * Writes an attribute to an array of attributes that is going to be used in writeBeginTag function
     * @param {String} name - The name of the HTML attribute
     * @param {String} value - The value of the HTML attribute
     * @returns {HtmlWriter}
     */
    writeAttribute(name: string, value: any): this {
        //write attribute='value'
        this.buffer += HTML_SPACE_CHAR;
        this.buffer += HTML_ATTR_STRING.replace(/%0/, name).replace(/%1/, escape(value));
        return this;
    }
    /**
     * Writes an array of attributes to the output buffer. This attributes are going to be rendered after writeBeginTag or WriteFullBeginTag function call.
     * @param {HtmlAttributeIndexer} attributes - An object which represents an array of attributes
     * @returns {HtmlWriter}
     */
     writeAttributes(attributes: HtmlAttributeIndexer): this {
        if (attributes === null) {
            return this;
        }
        for (let prop in attributes) {
            if (Object.prototype.hasOwnProperty.call(attributes, prop)) {
                this.writeAttribute(prop, attributes[prop]);
            }
        }
        return this;
    }
    /**
     * Writes an attribute to an array of attributes that is going to be used in writeBeginTag function
     * @param {String} name - The name of the HTML attribute
     * @param {String} value - The value of the HTML attribute
     * @returns {HtmlWriter}
     */
     addAttribute(name: string, value: any): this {
        this.bufferedAttributes.push({ name: name, value: value });
        return this;
    }
    // noinspection JSUnusedGlobalSymbols
    /**
     * Writes an array of attributes to the output buffer. This attributes are going to be rendered after writeBeginTag or WriteFullBeginTag function call.
     * @param {HtmlAttributeIndexer} attributes - An object which represents an array of attributes
     * @returns {HtmlWriter}
     */
     addAttributes(attributes: HtmlAttributeIndexer): this {
        if (attributes === null) {
            return this;
        }
        for (let prop in attributes) {
            if (Object.prototype.hasOwnProperty.call(attributes, prop)) {
                this.bufferedAttributes.push({ name: prop, value: attributes[prop] });
            }
        }
        return this;
    }
    // noinspection JSUnusedGlobalSymbols
    /**
     * @param {String} tag
     * @returns {HtmlWriter}
     */
    renderBeginTag(tag: string): this {
        this.write(HTML_START_TAG_STRING.replace(/%0/, tag));
        // write buffered attributes
        if (this.bufferedAttributes.length > 0) {
            this.bufferedAttributes.forEach((attr) => {
                this.writeAttribute(attr.name, attr.value);
            });
        }
        // clear buffered attributes
        this.bufferedAttributes.splice(0, this.bufferedAttributes.length);
        // write />
        this.write(HtmlWriter.TagRightChar);
        this.bufferedTags.push(tag);
        return this;
    }

    /**
     * @param {String} tag
     * @returns {HtmlWriter}
     */
    writeBeginTag(tag: string): this {
        this.buffer += HTML_START_TAG_STRING.replace(/%0/, tag);
        return this;
    }

    /**
     * Writes a full begin HTML tag (e.g <div/>).
     * @param {String} tag
     * @returns {HtmlWriter}
     */
    writeFullBeginTag(tag: string): this {
        this.buffer += HTML_START_TAG_STRING.replace(/%0/, tag);
        this.buffer += HTML_FULL_END_STRING;
        return this;
    }
    // noinspection JSUnusedGlobalSymbols
    /**
     * Writes an end HTML tag (e.g </div>) based on the current buffered tags.
     * @returns {HtmlWriter}
     */
    renderEndTag(): this {
        if (this.bufferedTags.length  === 0) {
            throw new Error('HtmlWriter.renderEndTag() should be called after HtmlWriter.renderBeginTag()');
        }
        this.writeEndTag(this.bufferedTags[this.bufferedTags.length - 1]);
        this.bufferedTags.splice(this.bufferedTags.length - 1, 1);
        return this;
    }
    /**
     * Writes an end HTML tag (e.g </div>) based on the current buffered tags.
     * @returns {HtmlWriter}
     */
     writeEndTag(tag: string): this {
        this.buffer += HTML_END_TAG_STRING.replace(/%0/, tag);
        return this;
    }
    // noinspection JSUnusedGlobalSymbols
    /**
     *
     * @param {String} s
     * @returns {HtmlWriter}
     */
    writeText(s: string): this {
        if (!s) {
            return this;
        }
        this.buffer += escape(s);
        return this;
    }
    /**
     *
     * @param {String} s
     * @returns {HtmlWriter}
     */
    write(s: string): this {
        this.buffer += s;
        return this;
    }
    /**
     * @returns {String}
     */
    toString(): string {
        if (this.indent) {
            return this.format(this.buffer);
        }
        return this.buffer;
    }

    private format(buffer: string) {
        return prettier.format(buffer, {
            htmlWhitespaceSensitivity: 'ignore',
            parser: 'html',
            printWidth: 140,
            useTabs: true,
            tabWidth: 2,
            plugins: [
                htmlParser
            ]
          });
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @param {function} writeFunc
     */
    writeTo(writeFunc: (s: string) => void) {
        if (typeof writeFunc === 'function') {
            //call function
            if (this.indent) {
                writeFunc(this.format(this.buffer));    
            } else {
                writeFunc(this.buffer);
            }
            //and clear buffer
            this.buffer = '';
        } else {
            throw new TypeError('Write operator must be a function');
        }
    }
}

export {
    HtmlWriter
}