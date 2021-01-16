export default class StopEventDescriptor {
    public readonly delay: number;

    public constructor(
        public readonly routeId: string,
        public readonly stopId: string,
        public readonly actualStopTime: number,
        public readonly scheduledStopTime: number) {

        this.delay = this.actualStopTime - this.scheduledStopTime;

        // Tweak in order to represent the shorter of the two distances
        if(this.delay > 43200) {
            this.delay -= 86400;
        }
        if(this.delay < -43200) {
            this.delay += 86400;
        }
    }
}