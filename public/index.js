const { useEffect, useRef, useState } = React;

// ****************************** CONSTANTS ******************************
const PIANOS = [
    {
        id: 1,
        name: "Piano Room A",
        building: "Student Life Centre",
        building_code: "SLC",
        room: "0000",
        lat: 43.4718576, lng: -80.5454194,
        tags: ["indoor", "bookable"],
        hours: "Open 24 hours",
        notes: "A piano room available for booking. Call the Turnkey Desk at the SLC to reserve.",
    },
    {
        id: 2,
        name: "Piano Room B",
        building: "Student Life Centre",
        building_code: "SLC",
        room: "0000",
        lat: 43.4718576, lng: -80.5454194,
        tags: ["indoor", "bookable"],
        hours: "Open 24 hours",
        notes: "A piano rooms available for booking. Call the Turnkey Desk at the SLC to reserve.",
    },
    {
        id: 3,
        name: "Piano",
        building: "Science Teaching Complex",
        building_code: "STC",
        room: "0000",
        lat: 43.470726861787234, lng: -80.54329038680704,
        tags: ["indoor", "public"],
        hours: "N/A",
        notes: "N/A",
    },
    {
        id: 4,
        name: "Piano",
        building: "J.R. Coutts Engineering Lecture Hall",
        building_code: "RCH",
        room: "0000",
        lat: 43.470327732902305, lng: -80.54075567120887,
        tags: ["indoor", "public"],
        hours: "N/A",
        notes: "N/A",
    },
    {
        id: 5,
        name: "Piano",
        building: "Carl Pollock Hall",
        building_code: "CPH",
        room: "3062",
        lat: 43.470818260885274, lng: -80.53897187750974,
        tags: ["indoor"],
        hours: "N/A",
        notes: "N/A",
    },
    {
        id: 10,
        name: "The John & Helen Dick Family",
        building: "Conrad Grebel University College",
        building_code: "CGR",
        room: "1114A",
        lat: 43.46625926505543, lng: -80.54499628536715,
        tags: ["indoor", "bookable"],
        hours: "Mon-Fri 8am-10pm, Sat 1-5pm",
        notes: "For use by: current music studio students, current UW music ensemble participants, and music major/theory class practice only.",
    },
    {
        id: 11,
        name: "The Marshman Family",
        building: "Conrad Grebel University College",
        building_code: "CGR",
        room: "1114B",
        lat: 43.46622608973279, lng: -80.54495070350515,
        tags: ["indoor", "bookable"],
        hours: "Mon-Fri 8am-10pm, Sat 1-5pm",
        notes: "For use by: current music studio students, current UW music ensemble participants, and music major/theory class practice only.",
    },
    {
        id: 12,
        name: "The Dianne(Daniels) & David Conrath",
        building: "Conrad Grebel University College",
        building_code: "CGR",
        room: "1114C",
        lat: 43.46620454290088, lng: -80.54488899122555,
        tags: ["indoor", "bookable"],
        hours: "Mon-Fri 8am-10pm, Sat 1-5pm",
        notes: "For use by: current music studio students, current UW music ensemble participants, and music major/theory class practice only.",
    },
    {
        id: 13,
        name: "Music Program Pianos",
        building: "Conrad Grebel University College",
        building_code: "CGR",
        room: "0000",
        lat: 43.46614814143143, lng: -80.54502241697979,
        tags: ["indoor", "bookable"],
        hours: "Mon-Fri 8am-10pm, Sat 1-5pm",
        notes: "Multiple pianos only available through enrollment of Grebel's music programs.",
    },
    {
        id: 20,
        name: "Residence Pianos",
        building: "Claudette Miller Hall",
        building_code: "CMH",
        room: "0000",
        lat: 43.470189347621016, lng: -80.53558118019038,
        tags: ["indoor", "bookable"],
        hours: "",
        notes: "Pianos only acessable to residents.",
    },
    {
        id: 21,
        name: "Residence Pianos",
        building: "Village 1",
        building_code: "V1",
        room: "0000",
        lat: 43.47157139370661, lng: -80.54990938942693,
        tags: ["indoor", "bookable"],
        hours: "",
        notes: "Pianos only acessable to residents.",
    },
    {
        id: 22,
        name: "Residence Pianos",
        building: "Ron Eydt Village",
        building_code: "REV",
        room: "0000",
        lat: 43.47029640865832, lng: -80.55418712122255,
        tags: ["indoor", "bookable"],
        hours: "",
        notes: "Pianos only acessable to residents.",
    },
    {
        id: 23,
        name: "Residence Pianos",
        building: "Mackenzie King Village",
        building_code: "MKV",
        room: "0000",
        lat: 43.47138647387866, lng: -80.55203922120423,
        tags: ["indoor", "bookable"],
        hours: "",
        notes: "Pianos only acessable to residents.",
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

function clickPopupHTML(latlng, userLocationRef) {
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

function addClickPopup(map, userLocationRef) {
    map.on("click", e => {
        L.popup()
            .setLatLng(e.latlng)
            .setContent(clickPopupHTML(e.latlng, userLocationRef))
            .openOn(map);
    });
}

function buildPopupHTML(piano, userLocation) {
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

function createPianoMarker(piano) {
    const icon = L.divIcon({
        html: `<div class="piano-marker"><span>🎹</span></div>`,
        className: "",
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -34],
    });

    return L.marker([piano.lat, piano.lng], { icon });
}

function createPianoMarkers(map, userLocation, markersRef) {
    Object.values(markersRef.current).forEach(m => m.remove());
    markersRef.current = {};

    PIANOS.forEach(piano => {
        const marker = createPianoMarker(piano);
        marker.addTo(map).bindPopup(buildPopupHTML(piano, userLocation));
        marker.on("click", () => console.log(`Clicked on piano: ${piano.id}`));
    });
}

function init(mapRef, mapInstance, userLocationRef) {
    const map = initMap(mapRef.current);
    addClickPopup(map, userLocationRef);

    mapInstance.current = map;
    return () => map.remove();
}

// ****************************** GEOLOCATION ******************************
function locateUser(setUserLocation, setLocStatus, mapInstance, userMarkerRef) {
    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude: lat, longitude: lng } = position.coords;
            setUserLocation({ lat, lng });
            setLocStatus("active");
            placeUserMarker(mapInstance, userMarkerRef, lat, lng);
        },
        () => {
            console.error("Error: Location denied or unavailable");
            setLocStatus("denied");
        }
    );
}

function deactivateLocation(userMarkerRef) {
    if (userMarkerRef.current) return;
    userMarkerRef.current.remove();
    userMarkerRef.current = null;
}

function handleLocate(locStatus, setLocStatus, setUserLocation, mapInstance, userMarkerRef) {
    if (locStatus === "deactivated" || locStatus === "denied") {
        setLocStatus("loading");
        locateUser(setUserLocation, setLocStatus, mapInstance, userMarkerRef);
    } else if (locStatus === "active") {
        setUserLocation(null);
        setLocStatus("deactivated");
        deactivateLocation(userMarkerRef);
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

function placeUserMarker(mapInstance, userMarkerRef, lat, lng) {
    if (userMarkerRef.current) userMarkerRef.current.remove();
    
    const icon = L.divIcon({
        html: '<div class="user-marker"></div>',
        className: "",
        iconSize: [16, 16],
        iconAnchor: [8, 8]
    });
    userMarkerRef.current = L.marker([lat, lng], { icon })
        .addTo(mapInstance.current)
        .bindPopup("<div class='user-popup'>You are here</div>");
}

// ****************************** DISTANCE ******************************
// https://en.wikipedia.org/wiki/Haversine_formula
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

function formatDistance(km) {
    if (km < 1) {
        return `${Math.round(km * 1000)}m away`;
    }
    return `${km.toFixed(1)}km away`;
}

// ****************************** UI ******************************
function PianoCard({piano}) {
    return (
        <div className="piano-card">
            <div className="card-name">{piano.name}</div>
            <div className="card-building">{piano.building}</div>
            <div className="card-room">{piano.building_code} {piano.room}</div>
            <div className="card-tags">
                {piano.tags.map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                ))}
                {piano.bookable && <span className="tag tag-bookable">bookable</span>}
            </div>
        </div>
    );
}

function isMatch(s, text) {
    return s.toLowerCase().trim().includes(text);
}

function updateCards(searchText) {
    let visiblePianos = PIANOS.filter(piano => {
        const text = searchText.toLowerCase().trim();

        return isMatch(piano.name, text)
            || isMatch(piano.building, text)
            || isMatch(piano.building_code, text)
            || isMatch(piano.room, text)
            || piano.tags.some(tag => isMatch(tag, text));
    });
    return visiblePianos;
}

// ****************************** REACT APP ******************************
/*
sources:
 - https://leafletjs.com/
 - https://leafletjs.com/examples/quick-start/
TODO:
 - Stop locating when you click the button and locStatus === "loading"
 - add a filter function
*/
function App() {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const markersRef = useRef({});

    const [userLocation, setUserLocation] = useState(null);
    const userLocationRef = useRef(null);
    const [locStatus, setLocStatus] = useState("deactivated"); // deactivated | loading | active | denied
    const userMarkerRef = useRef(null);

    const [searchText, setSearchText] = useState("");
    const visiblePianos = updateCards(searchText);

    useEffect(() => init(mapRef, mapInstance, userLocationRef), []); // this runs once after the component mounts (once the div exists in the DOM)

    useEffect(() => {
        if (!mapInstance.current) return;
        userLocationRef.current = userLocation;
        console.log(`User location state: ${locStatus}\nUser location updated:`, userLocation);
        createPianoMarkers(mapInstance.current, userLocation, markersRef);
    }, [userLocation]); // runs every time userLocation changes
    
    return (
        <>
            <header className="header">
                <div className="title">uWaterloo Where Piano</div>
                <button 
                        className={`location-btn ${getLocBtnClassName(locStatus)}`}
                        onClick={() => handleLocate(locStatus, setLocStatus, setUserLocation, mapInstance, userMarkerRef)}>
                    <span className="dot"></span>
                    {getButtonContent(locStatus)}
                </button>
            </header>

            <div className="main">
                <div className="sidebar">
                    <div className="searchbar">
                        <input type="text" placeholder="Search..." onChange={e => setSearchText(e.target.value)}/>
                        <div className="buttonbar">
                            <button>Filter</button>
                        </div>
                    </div>
                    {visiblePianos.map(piano => (
                        <PianoCard key={piano.id} piano={piano}/>
                    ))}
                </div>

                <div className="map" ref={mapRef}/>
            </div>
        </>
    );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);