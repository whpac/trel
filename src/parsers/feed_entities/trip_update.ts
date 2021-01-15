import BaseMessage from '../protobuf/base_message';
import { Message } from '../protobuf/message';
import StopTimeUpdate from './stop_time_update';
import TripDescriptor from './trip_descriptor';
import VehicleDescriptor from './vehicle_descriptor';

export default class TripUpdate extends BaseMessage {
    public trip: TripDescriptor = new TripDescriptor();     // 1
    public stopTimeUpdates: StopTimeUpdate[] = [];   // 2
    public vehicle: VehicleDescriptor | null = null;    // 3
    public timestamp: bigint = BigInt(0);     // 4
    public delay: number = 0;   // 5

    public getEmbeddedMessage(field_number: number): Message {
        switch(field_number) {
            case 1: return this.trip;
            case 2:
                let stu = new StopTimeUpdate();
                this.stopTimeUpdates.push(stu);
                return stu;
            case 3: return this.vehicle ?? (this.vehicle = new VehicleDescriptor());
        }
        throw new Error(`Field number ${field_number} is not message.`);
    }

    public isEmbeddedMessage(field_number: number): boolean {
        return (field_number >= 1 && field_number <= 3);
    }

    public setField(field_number: number, number: Buffer | number | bigint): void {
        if(field_number == 4 && typeof number === 'bigint') this.timestamp = number;
        if(field_number == 5 && typeof number === 'number') this.delay = number;
    }
}
