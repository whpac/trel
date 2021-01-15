import BaseMessage from '../protobuf/base_message';
import { Message } from '../protobuf/message';

export default class Position extends BaseMessage {
    public latitude: number = 0;      // 1
    public longitude: number = 0;     // 2
    public bearing: number = 0;       // 3
    public odometer: number = 0;      // 4
    public speed: number = 0;         // 5

    public getEmbeddedMessage(field_number: number): Message {
        throw new Error(`Field number ${field_number} is not message.`);
    }

    public isEmbeddedMessage(field_number: number): boolean {
        return false;
    }

    public setField(field_number: number, bytes: Buffer | number | bigint) {
        if(typeof bytes === 'number' || typeof bytes === 'bigint') return;

        switch(field_number) {
            case 1: this.latitude = this.ToFloat(bytes); break;
            case 2: this.longitude = this.ToFloat(bytes); break;
            case 3: this.bearing = this.ToFloat(bytes); break;
            case 4: this.odometer = this.ToDouble(bytes); break;
            case 5: this.speed = this.ToFloat(bytes); break;
        }
    }
}
