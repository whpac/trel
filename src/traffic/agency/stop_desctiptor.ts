export default class StopDescriptor {

    public constructor(
        public stopSequence: number,
        public stopId: string,
        public stopTime: number,         // In seconds from midnight
        public tripId: string
    ) { }
}