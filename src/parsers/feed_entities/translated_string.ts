import BaseMessage from '../protobuf/base_message';
import { Message } from '../protobuf/message';
import Translation from './translation';

export default class TranslatedString extends BaseMessage {
    public translations: Translation[] = [];    // 1

    public getEmbeddedMessage(field_number: number): Message {
        if(field_number == 1) {
            let tr = new Translation();
            this.translations.push(tr);
            return tr;
        }
        throw new Error(`Field number ${field_number} is not message.`);
    }

    public isEmbeddedMessage(field_number: number): boolean {
        return (field_number == 1);
    }

    public setField(field_number: number, bytes: Buffer | number | bigint): void {
    }
}
