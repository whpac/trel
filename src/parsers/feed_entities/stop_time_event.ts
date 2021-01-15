import BaseMessage from '../protobuf/base_message';
import { Message } from '../protobuf/message';

export default class StopTimeEvent extends BaseMessage {
    public delay: number = 0;          // 1
    public time: bigint = BigInt(0);   // 2
    public uncertainty: number = 0;    // 3

    public getEmbeddedMessage(field_number: number): Message {
        throw new Error(`Field number ${field_number} is not message.`);
    }

    public isEmbeddedMessage(field_number: number): boolean {
        return false;
    }

    public setField(field_number: number, number: Buffer | number | bigint) {
        switch(field_number) {
            case 1: if(typeof number === 'number') this.delay = number; break;
            case 2: if(typeof number === 'bigint') this.time = number; break;
            case 3: if(typeof number === 'number') this.uncertainty = number; break;
        }
    }
}
