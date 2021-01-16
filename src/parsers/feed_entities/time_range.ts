import BaseMessage from '../protobuf/base_message';
import { Message } from '../protobuf/message';

export default class TimeRange extends BaseMessage {
    public start: bigint = BigInt(0);     // 1
    public end: bigint = BigInt(0);       // 2

    public getEmbeddedMessage(field_number: number): Message {
        throw new Error(`Field number ${field_number} is not message.`);
    }

    public isEmbeddedMessage(field_number: number): boolean {
        return false;
    }

    public setField(field_number: number, number: Buffer | bigint) {
        if(number instanceof Buffer) return;
        switch(field_number) {
            case 1: this.start = number; break;
            case 2: this.end = number; break;
        }
    }
}
