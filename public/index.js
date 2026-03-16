const { useEffect, useRef, useState } = React;

// ****************************** CONSTANTS ******************************
const PIANOS = [
    {
        id: 1,
        name: "Piano Room A & B",
        building: "Student Life Centre",
        building_code: "SLC",
        room: "{}, {}",
        lat: 43.4718576, lng: -80.5454194,
        tags: ["indoor"],
        bookable: true,
        hours: "Open 24 hours",
        notes: "Two private piano rooms available for booking. Call the Turnkey Desk at the SLC to reserve.",
    },
    {
        id: 2,
        name: "Music Program Pianos",
        building: "Conrad Grebel University College",
        building_code: "CGR",
        room: "1112A, 1112B, 1112C",
        lat: 43.4661278, lng: -80.5449946,
        tags: ["indoor"],
        bookable: true,
        hours: "Mon-Fri 8am-10pm, Sat 1-5pm",
        notes: "Multiple pianos available through Grebel's music program. Contact the music department for access.",
    },
    {
        id: 3,
        name: "Marker Space Piano",
        building: "Carl Pollock Hall",
        building_code: "CPH",
        room: "CPH 3062",
        lat: 43.470791, lng: -80.53908,
        tags: ["indoor"],
        bookable: true,
        hours: "No hours",
        notes: "No notes.",
    },
];
const CENTER = [43.4710, -80.5430];


// ****************************** INIT ******************************
function initMap(divElement) {
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

function addClickPopup(map) {
    map.on("click", e => {
        L.popup()
            .setLatLng(e.latlng)
            .setContent("You clicked the map at:<br>" + e.latlng.toString())
            .openOn(map);
    });
}

function buildPopupHTML(piano, userLocation = false) {
    const distHTML = userLocation
        ? `<div class="popup-distance">📍 ${1}</div>`
        : `<div class="popup-no-location">Enable location to see distance</div>`;

    return `
    <div class="popup-header">
        <span class="popup-piano-emoji">🎹</span>
        <div class="popup-name">${piano.name}</div>
        <div class="popup-building">${piano.building} (${piano.building_code})</div>
    </div>
    <hr>
    <div class="popup-body">
        <div class="popup-detail"><span class="popup-detail-icon">🕐</span> ${piano.hours}</div>
        <div class="popup-detail"><span class="popup-detail-icon">📝</span> ${piano.notes}</div>
        ${distHTML}
    </div>`;
}

function createPianoMarker(piano) {
    const icon = L.divIcon({
        html: `<div class="piano-marker"><span>🎹</span></div>`,
        className: "", // clears Leaflet's default white box styling
        iconSize: [32, 32],
        iconAnchor: [16, 32], // tip of the marker (horizontal center, bottom)
        popupAnchor: [0, -34], // where the popup appears relative to the marker
    });

    return L.marker([piano.lat, piano.lng], { icon });
}

function createPianoMarkers(map) {
    PIANOS.forEach(piano => {
        const marker = createPianoMarker(piano);
        marker.addTo(map).bindPopup(buildPopupHTML(piano));
        marker.on("click", () => console.log(piano.id));
    });
}

function init(mapRef, mapInstance) {
    const map = initMap(mapRef.current);
    addClickPopup(map);
    createPianoMarkers(map);

    mapInstance.current = map; // save map for later changes
    return () => map.remove(); // cleanup: destroy the map if the component ever unmounts
}

// ****************************** GEOLOCATION ******************************
function locateUser(setUserLocation, setLocStatus) {
    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude: lat, longitude: lng } = position.coords;
            setUserLocation({ lat, lng });
            setLocStatus("active");
        },
        error => {
            console.error("Error: Location denied or unavailable");
            setLocStatus("denied");
        }
    );
}

function handleLocate(locStatus, setLocStatus, setUserLocation) {
    if (locStatus === "deactivated" || locStatus === "denied") {
        setLocStatus("loading");
        locateUser(setUserLocation, setLocStatus);
    } else if (locStatus === "active") {
        setUserLocation(null);
        setLocStatus("deactivated");
    }
}

function getLocBtnClassName(locStatus) {
    if (locStatus === "active") return "active";
    if (locStatus === "denied") return "error";
    return "";
}

function getButtonContent(locStatus) {
    if (locStatus === "loading") return "Locating...";
    if (locStatus === "active")  return "Location on";
    if (locStatus === "denied")  return "Location denied";
    if (locStatus === "deactivated") return "Find my location";
    return "Invalid status";
}

// ****************************** DISTANCE ******************************
function haversine(lat1, lng1, lat2, lng2) {
    // hav(theta) = sin^2(theta/2)
    // hav(theta) = hav(delta lat) + cos(lat1) * cos(lat2) * (delta lng)
    return (1 - Math.cos(toRadians(lat1 - lat2)) + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * (1 - Math.cos(toRadians(lng1 - lng2)))) / 2.0;
}

function inverseHaversine(lat1, lng1, lat2, lng2) {
    // theta = 2 * arcsin(sqrt(hav(theta)))
    return 2 * Math.asin(Math.sqrt(haversine(lat1, lng1, lat2, lng2)));
}

function toRadians(theta) {
    return theta * Math.PI / 180.0;
}

function getHaversineDistance(lat1, lng1, lat2, lng2) {
    const r_earth = 6371; // km
    let theta = inverseHaversine(lat1, lng1, lat2, lng2);
    return theta * r_earth;
}

// ****************************** REACT APP ******************************
/*
sources:
 - https://leafletjs.com/
 - https://leafletjs.com/examples/quick-start/
TODO:
 - Stop locating when you click the button and locStatus === "loading"
*/
function App() {
    const mapRef = useRef(null); // reference to the <div> Leaflet will live in
    const mapInstance = useRef(null); // Leaflet map object stored to mapInstance

    const [userLocation, setUserLocation] = useState(null); // stores user location information
    const [locStatus, setLocStatus] = useState("deactivated"); // deactivated | loading | active | denied

    useEffect(() => init(mapRef, mapInstance), []); // this runs once after the component mounts (once the div exists in the DOM)

    useEffect(() => {
        console.log(`User location state: ${locStatus}\nUser location updated:`, userLocation);
    }, [userLocation]); // runs every time userLocation changes
    
    return (
        <div style={{ width: "100%", height: "100%" }}>
            <button 
                    className={`location-btn ${getLocBtnClassName(locStatus)}`}
                    onClick={() => handleLocate(locStatus, setLocStatus, setUserLocation)}>
                <span className="dot"></span>
                {getButtonContent(locStatus)}
            </button>
            <div ref={mapRef} style={{ width: "100%", height: "100%" }}></div>
        </div>
    );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);