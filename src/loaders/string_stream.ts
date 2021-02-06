import Stream from './stream';

export default class StringStream implements Stream {
    position: number = 0;
    protected lines: string[];

    public constructor(s: string) {
        this.lines = s.split('\r\n');
    }

    read(buffer: Buffer, limit: number): Promise<number> {
        throw new Error('Method not implemented.');
    }

    readByte(): Promise<number> {
        throw new Error('Method not implemented.');
    }

    readLine(): string {
        if(this.position >= this.lines.length) {
            let e = { stream_exhausted: true };
            throw e;
        }
        return this.lines[this.position++];
    }

}