import L from "leaflet";
import { Coord } from "./util/interfaces.ts";
import { getHaversineDistance, formatDistance } from "./geo/distance.js";

function clickPopupHTML(latlng: Coord, userLocationRef: React.RefObject<Coord | null>) {
    console.log(latlng);
    const distHTML = userLocationRef.current
        ? `<hr><div class="popup-distance">${formatDistance(getHaversineDistance(latlng, userLocationRef.current))}</div>`
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