import {HtmlWriter, TraceUtils} from '../src';

describe('HtmlWriter', () => {
    it('should create instance', () => {
        const writer = new HtmlWriter();
        writer.indent = true;
        writer.writeBeginTag('div');
        writer.writeAttribute('class', 'card');
        writer.write(HtmlWriter.TagRightChar);
        writer.writeEndTag('div');
        let output: string;
        writer.writeTo((result)=> {
            output = result;
        });
        TraceUtils.log('HTML', output);
        expect(output).toBeTruthy();
    });
    it('should use renderBeginTag()', () => {
        const writer = new HtmlWriter();
        writer.indent = false;
        writer.addAttribute('class', 'card');
        writer.renderBeginTag('div');
        writer.addAttributes({
            'class': 'card-body',
            'title': 'User'
        });
        writer.renderBeginTag('div');
        writer.renderEndTag();
        writer.renderEndTag();
        let output: string;
        writer.writeTo((result)=> {
            output = result;
        });
        TraceUtils.log('HTML', output);
        expect(output).toBeTruthy();
    });

    it('should use indent', () => {
        const writer = new HtmlWriter();
        writer.addAttribute('class', 'card');
        writer.renderBeginTag('div');
        writer.addAttributes({
            'class': 'card-body',
            'title': 'User'
        });
        writer.renderBeginTag('div');
        writer.renderEndTag();
        writer.renderEndTag();
        let output: string = writer.toString();
        TraceUtils.log('HTML', output);
        expect(output).toBeTruthy();
    });
});