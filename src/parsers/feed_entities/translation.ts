import BaseMessage from '../protobuf/base_message';
import { Message } from '../protobuf/message';

export default class Translation extends BaseMessage {
    public text: string = "";     // 1
    public language: string = "";    // 2

    public getEmbeddedMessage(field_number: number): Message {
        throw new Error(`Field number ${field_number} is not message.`);
    }

    public isEmbeddedMessage(field_number: number): boolean {
        return false;
    }

    public setField(field_number: number, bytes: Buffer | bigint): void {
        if(typeof bytes === 'bigint') return;
        switch(field_number) {
            case 1: this.text = bytes.toString('utf-8'); break;
            case 2: this.language = bytes.toString('utf-8'); break;
        }
    }
}
