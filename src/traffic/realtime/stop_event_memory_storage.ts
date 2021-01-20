import StopEventDescriptor from './stop_event_descriptor';
import StopEventStorage from './stop_event_storage';

export default class StopEventMemoryStorage implements StopEventStorage {
    public stops: StopEventDescriptor[] = [];

    public store(stop_event: StopEventDescriptor): void {
        this.stops.push(stop_event);
    }

    public batchEnded(): void {
    }
}