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
    protected is_closed: boolean = false;

    public get position() {
        return this._position;
    }

    public newData(buffer: Buffer) {
        this.dataBuffer = Buffer.concat([this.dataBuffer, buffer]);
        this.dequeueJobs();
    }

    public close() {
        this.is_closed = true;
        this.dequeueJobs();
    }

    protected dequeueJobs() {
        while(this.readQueue.length > 0) {
            let job = this.readQueue[0];
            if(this.dataBuffer.length - this.position < job.bytes) break;

            this._position += job.read(this.dataBuffer, this.position);
            this.readQueue.shift();
        }

        if(this.is_closed) {
            while(this.readQueue.length > 0) {
                let job = this.readQueue.shift();
                job?.data_exhausted();
            }
        }
    }

    async read(buffer: Buffer, limit: number): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            if(limit <= 0) return resolve(0);

            this.readQueue.push({
                bytes: limit,
                read: (source_buffer: Buffer, position: number) => {
                    let copied = source_buffer.copy(buffer, 0, position, position + limit);
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