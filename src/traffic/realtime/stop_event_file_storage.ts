import { appendFileSync } from 'fs';
import StopEventDescriptor from './stop_event_descriptor';
import StopEventStorage from './stop_event_storage';

export default class StopEventFileStorage implements StopEventStorage {
    protected stops: StopEventDescriptor[] = [];
    protected path: string;

    public constructor(path: string) {
        this.path = path;
    }

    public store(stop_event: StopEventDescriptor): void {
        this.stops.push(stop_event);
    }

    public batchEnded(): void {
        let file_text = '';
        let date = new Date().toISOString();
        for(let stop of this.stops) {
            file_text += `${date},${stop.scheduledStopTime},${stop.routeId},${stop.stopId},${stop.delay}\r\n`;
        }

        try {
            appendFileSync(this.path, file_text);
            this.stops = [];
        } catch(e) {
            console.error(`Nie udało się zapisać zatrzymań do pliku: ${e}.`);
        }
    }
}