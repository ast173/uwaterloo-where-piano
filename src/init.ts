import L from "leaflet";
import { CENTER } from "./util.ts";
import { Coord } from "./interfaces.ts";
import { addClickPopup } from "./clickPopups.ts";

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

export function init(mapRef: React.RefObject<HTMLDivElement | null>,
                mapInstance: React.RefObject<L.Map | null>,
                userLocationRef: React.RefObject<Coord | null>): () => void {

    const map: L.Map = initMap(mapRef.current!);
    addClickPopup(map, userLocationRef);

    mapInstance.current = map;
    return () => { map.remove(); };
}