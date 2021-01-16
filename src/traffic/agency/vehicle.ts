export default class Vehicle {

    public constructor(
        public readonly id: string,
        public readonly tripId: string,
        public readonly routeId: string,
        public readonly nextStopSeq: number,
        public readonly time: bigint
    ) { }

    public equals(v: Vehicle) {
        if(this.id != v.id) return false;
        if(this.tripId != v.tripId) return false;
        if(this.routeId != v.routeId) return false;
        if(this.nextStopSeq != v.nextStopSeq) return false;

        return true;
    }
}