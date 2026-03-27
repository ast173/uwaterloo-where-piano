import { Coord, coordToArray } from "./util/interfaces";
import L from "leaflet";

export function handleRadiusBubble(
        mapInstance: React.RefObject<L.Map | null>,
        userLocation: Coord | null,
        radius: number,
        radiusBubbleRef: React.RefObject<L.Circle | null>) {

    radiusBubbleRef.current = L.circle(coordToArray(userLocation!), {
        color: "#c9a84c",
        fillColor: "#f0d080",
        fillOpacity: 0.2,
        radius: radius
    }).addTo(mapInstance.current!);
}