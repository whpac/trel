import StopSchedule from '../agency/stop_schedule';
import StopEventDescriptor from './stop_event_descriptor';
import StopEventStorage from './stop_event_storage';

export default class StopTimesRegistry {
    protected stopSchedule: StopSchedule;
    protected stopsStorage: StopEventStorage;

    private readonly TIMEZONE_OFFSET = BigInt(3600);

    public constructor(schedule: StopSchedule, storage: StopEventStorage) {
        this.stopSchedule = schedule;
        this.stopsStorage = storage;
    }

    public setStorage(storage: StopEventStorage) {
        this.stopsStorage = storage;
    }

    public addStopTime(trip_id: string, route_id: string, stop_seq: number, stop_timestamp: bigint) {
        let actual_stop_time = Number((stop_timestamp + this.TIMEZONE_OFFSET) % BigInt(86400));
        try {
            var stop = this.stopSchedule.getStop(trip_id, stop_seq);

            this.stopsStorage.store(new StopEventDescriptor(route_id, stop.stopId, actual_stop_time, stop.stopTime));
        } catch(e) { }
    }

    public batchEnded() {
        this.stopsStorage.batchEnded();
    }
}