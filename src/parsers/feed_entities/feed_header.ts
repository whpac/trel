import BaseMessage from '../protobuf/base_message';
import { Message } from '../protobuf/message';

export default class FeedHeader extends BaseMessage {
    public gtfsRealtimeVersion: string = "";  // 1
    public incrementality: EnumIncrementality = EnumIncrementality.FULL_DATASET;     // 2
    public timestamp: bigint = BigInt(0);     // 3

    public getEmbeddedMessage(field_number: number): Message {
        throw new Error(`Field number ${field_number} is not message.`);
    }

    public isEmbeddedMessage(field_number: number): boolean {
        return false;
    }

    public setField(field_number: number, bytes: Buffer | bigint): void {
        switch(typeof bytes) {
            case 'bigint':
                if(field_number == 2) this.incrementality = Number(bytes) as EnumIncrementality;
                if(field_number == 3) this.timestamp = bytes;
                break;
            default:
                if(field_number == 1) this.gtfsRealtimeVersion = bytes.toString('utf-8');
                break;
        }
    }
}

enum EnumIncrementality {
    FULL_DATASET = 0,
    DIFFERENTIAL = 1
}