import L from "leaflet";
import { Coord } from "./interfaces.ts";
import { getHaversineDistance, formatDistance } from "./distance.js";

function clickPopupHTML(latlng: Coord, userLocationRef: React.RefObject<Coord | null>) {
     const distHTML = userLocationRef.current
        ? `<hr><div class="popup-distance">${formatDistance(getHaversineDistance(latlng.lat, latlng.lng, userLocationRef.current.lat, userLocationRef.current.lng))}</div>`
        : `<div class="popup-no-location">Enable location to see distance</div>`;
    
    return `
    <div class="click-popup">
        <div>You clicked the map at:</div>
        <div>Lat: ${latlng.lat}</div>
        <div>Lng: ${latlng.lng}</div>
        ${distHTML}
    </div>`;
}

export function addClickPopup(map: L.Map, userLocationRef: React.RefObject<Coord | null>) {
    map.on("click", e => {
        L.popup()
            .setLatLng(e.latlng)
            .setContent(clickPopupHTML(e.latlng, userLocationRef))
            .openOn(map);
    });
}