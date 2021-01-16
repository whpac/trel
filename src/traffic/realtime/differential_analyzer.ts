import Vehicle from '../agency/vehicle';
import StopTimesRegistry from './stop_times_registry';

export default class DifferentialAnalyzer {
    protected currentState = new Map<string, Vehicle>();

    public analyzeNewData(data: Map<string, Vehicle>, registry: StopTimesRegistry): void {
        for(let data_row of data) {
            let v_id = data_row[0];
            let new_v = data_row[1];

            if(!this.currentState.has(v_id)) {
                this.currentState.set(v_id, new_v);
                continue;
            }

            var old_v = this.currentState.get(v_id) as Vehicle;
            if(!old_v.equals(new_v)) {
                let stop_time = (new_v.time + old_v.time) / BigInt(2);
                registry.addStopTime(old_v.tripId, old_v.routeId, old_v.nextStopSeq, stop_time);
            }
            this.currentState.set(v_id, new_v);
        }
    }
}