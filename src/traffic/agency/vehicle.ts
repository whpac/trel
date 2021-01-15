export default class Vehicle {

    public constructor(
        public readonly id: string,
        public readonly tripId: string,
        public readonly routeId: string,
        public readonly nextStopSeq: number,
        public readonly time: bigint
    ) { }
}