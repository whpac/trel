import Stream from './stream';

type ReadQueueEntry = {
    bytes: number;
    read: (source_buffer: Buffer, position: number) => number;
    data_exhausted: () => void;
};

export default class NetworkStreamReader implements Stream {
    protected dataBuffer: Buffer = Buffer.alloc(0);
    protected _position: number = 0;
    protected readQueue: ReadQueueEntry[] = [];
    protected isClosed: boolean = false;

    public get position() {
        return this._position;
    }

    public newData(buffer: Buffer) {
        this.dataBuffer = Buffer.concat([this.dataBuffer, buffer]);
        this.dequeueJobs();
    }

    public close() {
        this.isClosed = true;
        this.dequeueJobs();
    }

    protected dequeueJobs() {
        while(this.readQueue.length > 0) {
            let job = this.readQueue[0];
            if(this.dataBuffer.length - this.position < job.bytes && (isFinite(job.bytes) || !this.isClosed)) break;

            this._position += job.read(this.dataBuffer, this.position);
            this.readQueue.shift();
        }

        if(this.isClosed) {
            while(this.readQueue.length > 0) {
                let job = this.readQueue.shift();
                job?.data_exhausted();
            }
        }
    }

    async read(buffer: Buffer | { buffer: Buffer; }, limit: number): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            if(limit <= 0) return resolve(0);

            this.readQueue.push({
                bytes: limit,
                read: (source_buffer: Buffer, position: number) => {
                    let source_end = position + limit;
                    if(!isFinite(limit)) source_end = source_buffer.length;

                    let target;
                    if(buffer instanceof Buffer) {
                        target = buffer;
                    } else {
                        target = buffer.buffer = Buffer.alloc(source_end - position);
                    }

                    let copied = source_buffer.copy(target, 0, position, source_end);
                    resolve(copied);
                    return copied;
                },
                data_exhausted: () => reject({ stream_exhausted: true })
            });
            this.dequeueJobs();
        });
    }

    async readByte(): Promise<number> {
        let buffer = Buffer.alloc(1);

        await this.read(buffer, 1);

        return buffer[0];
    }

    readLine(): string {
        throw new Error('Method not implemented.');
    }
}