import StopEventDescriptor from './stop_event_descriptor';

export default interface StopEventStorage {

    store(stop_event: StopEventDescriptor): void;
}