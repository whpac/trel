import BaseMessage from '../protobuf/base_message';
import { Message } from '../protobuf/message';
import TripDescriptor from './trip_descriptor';

export default class EntitySelector extends BaseMessage {
    public agencyId: string = "";    // 1
    public routeId: string = "";     // 2
    public routeType: number = 0;       // 3
    public tripDescriptor: TripDescriptor | null = null;    // 4
    public stopId: string = "";      // 5

    public getEmbeddedMessage(field_number: number): Message {
        if(field_number == 4) return this.tripDescriptor ?? (this.tripDescriptor = new TripDescriptor());

        throw new Error(`Field number ${field_number} is not message.`);
    }

    public isEmbeddedMessage(field_number: number): boolean {
        return (field_number == 4);
    }

    public setField(field_number: number, bytes: Buffer | bigint): void {
        if(typeof bytes === 'bigint' && field_number == 3) this.routeType = Number(bytes);

        if(bytes instanceof Buffer) {
            switch(field_number) {
                case 1: this.agencyId = bytes.toString('utf-8'); break;
                case 2: this.routeId = bytes.toString('utf-8'); break;
                case 5: this.stopId = bytes.toString('utf-8'); break;
            }
        }
    }
}
