import StopEventDescriptor from './stop_event_descriptor';

export default interface StopEventStorage {

    batchEnded(): void;
    store(stop_event: StopEventDescriptor): void;
}