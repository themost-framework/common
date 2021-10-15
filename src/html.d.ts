// MOST Web Framework 2.0 Codename ZeroGraviry Copyright (c) 2017-2021, THEMOST LP All rights reserved
export declare class HtmlWriter {
    /**
     * @private
     * @type {Array}
     */
    public bufferedAttributes: any[];

    /**
     * @private
     * @type {Array}
     */
    public bufferedTags: string[];

    /**
     * and clear buffer
     */
    public buffer: string;
    /**
     * Writes an attribute to an array of attributes that is going to be used in writeBeginTag function
     * @param {String} name - The name of the HTML attribute
     * @param {String} value - The value of the HTML attribute
     * @returns {HtmlWriter}
     * @param name
     * @param value
     * @return
     */
    public writeAttribute(name: string, value: string): this;

    /**
     * Writes an array of attributes to the output buffer. This attributes are going to be rendered after writeBeginTag or WriteFullBeginTag function call.
     * @param {Array|Object} obj - An array of attributes or an object that represents an array of attributes
     * @returns {HtmlWriter}
     * @param obj
     * @return
     */
    public writeAttributes(obj: any[] | {}): this;

    /**
     * @param {String} tag
     * @returns {HtmlWriter}
     * @param tag
     * @return
     */
    public writeBeginTag(tag: string): this;

    /**
     * Writes a full begin HTML tag (e.g <div/>).
     * @param {String} tag
     * @returns {HtmlWriter}
     * @param tag
     * @return
     */
    public writeFullBeginTag(tag: string): this;

    /**
     * Writes an end HTML tag (e.g </div>) based on the current buffered tags.
     * @returns {HtmlWriter}
     * @return
     */
    public writeEndTag(): this;

    /**
     * @param {String} s
     * @returns {HtmlWriter}
     * @param s
     * @return
     */
    public writeText(s: string): this;

    /**
     * @param {String} s
     * @returns {HtmlWriter}
     * @param s
     * @return
     */
    public write(s: string): this;

    /**
     * @param {function} fn
     * @param fn
     */
    public writeTo(writeFunc: (s: string) => void): void;

}
