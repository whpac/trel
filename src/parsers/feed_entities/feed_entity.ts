import BaseMessage from '../protobuf/base_message';
import { Message } from '../protobuf/message';
import Alert from './alert';
import TripUpdate from './trip_update';
import VehiclePosition from './vehicle_position';

export default class FeedEntity extends BaseMessage {
    public id: string = "";   // 1
    public isDeleted: boolean = false;  // 2
    public tripUpdate: TripUpdate | null = null;    // 3
    public vehicle: VehiclePosition | null = null;  // 4
    public alert: Alert | null = null;  // 5

    public getEmbeddedMessage(field_number: number): Message {
        switch(field_number) {
            case 3: return this.tripUpdate ?? (this.tripUpdate = new TripUpdate());
            case 4: return this.vehicle ?? (this.vehicle = new VehiclePosition());
            case 5: return this.alert ?? (this.alert = new Alert());
        }

        throw new Error(`Field number ${field_number} is not message.`);
    }

    public isEmbeddedMessage(field_number: number): boolean {
        return (field_number >= 3 && field_number <= 5);
    }

    public setField(field_number: number, bytes: Buffer | bigint): void {
        if(typeof bytes === 'bigint') {
            if(field_number == 2) this.isDeleted = (bytes != BigInt(0));
        } else {
            if(field_number == 1) this.id = bytes.toString('utf-8');
        }
    }
}
