import L from "leaflet";
import { PIANOS } from "./util.js";
import { getHaversineDistance, formatDistance } from "./distance.js";
import { Coord, Piano } from "./interfaces.ts";

function buildPopupHTML(piano: Piano, userLocation: Coord | null) {
    const distHTML = userLocation
        ? `<div class="popup-distance">${formatDistance(getHaversineDistance(piano.lat, piano.lng, userLocation.lat, userLocation.lng))}</div>`
        : `<div class="popup-no-location">Enable location to see distance</div>`;

    return `
    <div class="popup">
        <div class="popup-header">
            <div class="popup-name">${piano.name}</div>
            <div class="popup-building">${piano.building}</div>
            <div class="popup-building">${piano.building_code} ${piano.room}</div>
        </div>
        <hr>
        <div class="popup-body">
            <div class="popup-detail">Time: ${piano.hours}</div>
            <div class="popup-detail">Notes: ${piano.notes}</div>
            ${distHTML}
        </div>
    </div>`;
}

function createPianoMarker(piano: Piano) {
    const icon = L.divIcon({
        html: `<div class="piano-marker"><span>🎹</span></div>`,
        className: "",
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -34],
    });

    return L.marker([piano.lat, piano.lng], { icon });
}

export function createPianoMarkers(map: L.Map,
                            userLocation: Coord | null,
                            markersRef: React.RefObject<Record<number, L.Marker>>) {

    Object.values(markersRef.current).forEach(m => m.remove());
    markersRef.current = {};

    PIANOS.forEach(piano => {
        const marker = createPianoMarker(piano);
        marker.addTo(map).bindPopup(buildPopupHTML(piano, userLocation));
        marker.on("click", () => console.log(`Clicked on piano: ${piano.id}`));
    });
}