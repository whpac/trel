import BaseMessage from '../protobuf/base_message';
import { Message } from '../protobuf/message';
import FeedEntity from './feed_entity';
import FeedHeader from './feed_header';

export default class FeedMessage extends BaseMessage {
    public header: FeedHeader = new FeedHeader();   // 1
    public entities: FeedEntity[] = [];   // 2

    public getEmbeddedMessage(field_number: number): Message {
        switch(field_number) {
            case 1: return this.header;
            case 2:
                let e = new FeedEntity();
                this.entities.push(e);
                return e;
        }

        throw new Error(`Field number ${field_number} is not message.`);
    }

    public isEmbeddedMessage(field_number: number): boolean {
        return (field_number == 1 || field_number == 2);
    }

    public setField(field_number: number, bytes: Buffer | bigint) {
    }
}
