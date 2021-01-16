import BaseMessage from '../protobuf/base_message';
import { Message } from '../protobuf/message';
import Position from './position';
import TripDescriptor from './trip_descriptor';
import VehicleDescriptor from './vehicle_descriptor';

export default class VehiclePosition extends BaseMessage {
    public trip: TripDescriptor | null = null;  // 1
    public position: Position | null = null;     // 2
    public currentStopSequence: number = 0;    // 3
    public currentStatus: EnumVehicleStopStatus = EnumVehicleStopStatus.IN_TRANSIT_TO;   // 4
    public timestamp: bigint = BigInt(0);     // 5
    public congestionLevel: EnumCongestionLevel = EnumCongestionLevel.UNKNOWN_CONGESTION_LEVEL;  // 6
    public stopId: string = "";  // 7
    public vehicle: VehicleDescriptor | null = null;    // 8
    public occupancyStatus: EnumOccupancyStatus = EnumOccupancyStatus.EMPTY;     // 9

    public getEmbeddedMessage(field_number: number): Message {
        switch(field_number) {
            case 1: return this.trip ?? (this.trip = new TripDescriptor());
            case 2: return this.position ?? (this.position = new Position());
            case 8: return this.vehicle ?? (this.vehicle = new VehicleDescriptor());
        }
        throw new Error(`Field number ${field_number} is not message.`);
    }

    public isEmbeddedMessage(field_number: number): boolean {
        return (field_number == 1 || field_number == 2 || field_number == 8);
    }

    public setField(field_number: number, number: Buffer | number | bigint): void {
        if(field_number == 5 && typeof number === 'bigint') this.timestamp = number;
        if(field_number == 7 && number instanceof Buffer) this.stopId = number.toString('utf-8');

        if(typeof number === 'bigint') {
            switch(field_number) {
                case 3: this.currentStopSequence = Number(number); break;
                case 4: this.currentStatus = Number(number); break;
                case 6: this.congestionLevel = Number(number); break;
                case 9: this.occupancyStatus = Number(number); break;
            }
        }
    }
}

enum EnumVehicleStopStatus {
    INCOMING_AT = 0,
    STOPPED_AT = 1,
    IN_TRANSIT_TO = 2
}

enum EnumCongestionLevel {
    UNKNOWN_CONGESTION_LEVEL = 0,
    RUNNING_SMOOTHLY = 1,
    STOP_AND_GO = 2,
    CONGESTION = 3,
    SEVERE_CONGESTION = 4
}

enum EnumOccupancyStatus {
    EMPTY = 0,
    MANY_SEATS_AVAILABLE = 1,
    FEW_SEATS_AVAILABLE = 2,
    STANDING_ROOM_ONLY = 3,
    CRUSHED_STANDING_ROOM_ONLY = 4,
    FULL = 5,
    NOT_ACCEPTING_PASSENGERS = 6
}
