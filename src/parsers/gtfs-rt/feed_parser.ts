import Vehicle from '../../traffic/agency/vehicle';
import FeedMessage from '../feed_entities/feed_message';

export default class FeedParser {

    /**
     * Parses the GTFS-RT feed into [TripId, Vehicle] pairs
     * @param feed The GTFS-RT feed
     */
    public static parseFeed(feed: FeedMessage): Map<string, Vehicle> {
        let vehicles = new Map<string, Vehicle>();

        for(let entity of feed.entities) {
            if(entity.vehicle == null) continue;

            var v = entity.vehicle;
            if(v.trip?.tripId === undefined) continue;
            if(v.vehicle?.id === undefined) continue;

            vehicles.set(
                v.trip.tripId,
                new Vehicle(v.vehicle.id, v.trip.tripId, v.trip.routeId, v.currentStopSequence, v.timestamp)
            );
        }

        return vehicles;
    }
}