import L from "leaflet";
import { CENTER, PIANOS } from "./util.js";
import { getHaversineDistance, formatDistance } from "./distance.js";
import { Coord } from "./Coord.ts";
import { Piano } from "./Piano.ts";

export { createPianoMarkers, init };

// ============================== INIT ==============================
function initMap(divElement: HTMLDivElement): L.Map {
    const map = L.map(divElement, {
        center: CENTER,
        zoom: 16,
        zoomControl: true
    });
    // or
    // const map = L.map(divElement.current)
    // map.setView([43.4710, -80.5430], 16, true);
    
    // adds the OpenStreetMap tile layer (the actual map visuals)
    // returns one specific 256×256px image of that part of the map
    // {z} - zoom level
    // {x} - column position of the tile
    // {y} - row position of the tile
    // {s} - subdomain (a, b, or c), spreads the image requests across multiple servers to load faster
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    return map;
}

function clickPopupHTML(latlng: Coord, userLocationRef: React.RefObject<Coord | null>) {
    let distHTML = "";
    if (userLocationRef.current) {
        distHTML = `<hr><div class="popup-distance">📍 ${formatDistance(getHaversineDistance(latlng.lat, latlng.lng, userLocationRef.current.lat, userLocationRef.current.lng))}</div>`;
    }
    
    return `
    <div class="click-popup">
        <div>You clicked the map at:</div>
        <div>Lat: ${latlng.lat}</div>
        <div>Lng: ${latlng.lng}</div>
        ${distHTML}
    </div>`;
}

function addClickPopup(map: L.Map, userLocationRef: React.RefObject<Coord | null>) {
    map.on("click", e => {
        L.popup()
            .setLatLng(e.latlng)
            .setContent(clickPopupHTML(e.latlng, userLocationRef))
            .openOn(map);
    });
}

function buildPopupHTML(piano: Piano, userLocation: Coord | null) {
    const distHTML = userLocation
        ? `<div class="popup-distance">📍 ${formatDistance(getHaversineDistance(piano.lat, piano.lng, userLocation.lat, userLocation.lng))}</div>`
        : `<div class="popup-no-location">Enable location to see distance</div>`;

    return `
    <div class="popup">
        <div class="popup-header">
            <span class="popup-piano-emoji">🎹</span>
            <div class="popup-name">${piano.name}</div>
            <div class="popup-building">${piano.building} (${piano.building_code})</div>
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

function createPianoMarkers(map: L.Map,
                            userLocation: Coord | null,
                            markersRef: React.RefObject<L.Marker[]>) {

    Object.values(markersRef.current).forEach(m => m.remove());
    markersRef.current.length = 0;

    PIANOS.forEach(piano => {
        const marker = createPianoMarker(piano);
        marker.addTo(map).bindPopup(buildPopupHTML(piano, userLocation));
        marker.on("click", () => console.log(`Clicked on piano: ${piano.id}`));
    });
}

function init(mapRef: React.RefObject<HTMLDivElement | null>,
                mapInstance: React.RefObject<L.Map | null>,
                userLocationRef: React.RefObject<Coord | null>): () => void {

    const map: L.Map = initMap(mapRef.current!);
    addClickPopup(map, userLocationRef);

    mapInstance.current = map;
    return () => { map.remove(); };
}