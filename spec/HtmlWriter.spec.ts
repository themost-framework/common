import {HtmlWriter} from '../src';

describe('HtmlWriter', () => {
    it('should create instance', () => {
        const writer = new HtmlWriter();
        writer.indent = true;
        writer.writeBeginTag('div');
        writer.writeAttribute('class', 'card');
        writer.writeBeginTag('div')
        writer.writeAttribute('class', 'card-body')
        writer.writeEndTag('div');
        writer.writeEndTag('div');
        let output: string;
        writer.writeTo((result)=> {
            output = result;
        });
        console.log(output);
        expect(output).toBe('<div class="card"></div>');
    });
});