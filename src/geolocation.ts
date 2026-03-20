import L from 'leaflet';
import { LocStatus, Setter } from "./types.ts";
import { Coord } from "./interfaces.ts";

// ============================== GEOLOCATION ==============================
export function locateUser(setUserLocation: Setter<Coord | null>,
                    setLocStatus: Setter<LocStatus>,
                    mapInstance: React.RefObject<L.Map | null>,
                    userMarkerRef: React.RefObject<L.Marker | null>): void {

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

function deactivateLocation(userMarkerRef: React.RefObject<L.Marker | null>): void {
    if (!userMarkerRef.current) return;
    userMarkerRef.current.remove();
    userMarkerRef.current = null;
}

export function handleLocate(locStatus: LocStatus,
                        setLocStatus: Setter<LocStatus>,
                        setUserLocation: Setter<Coord | null>,
                        mapInstance: React.RefObject<L.Map | null>,
                        userMarkerRef: React.RefObject<L.Marker | null>): void {

    if (locStatus === "deactivated" || locStatus === "denied") {
        setLocStatus("loading");
        locateUser(setUserLocation, setLocStatus, mapInstance, userMarkerRef);
    } else if (locStatus === "active") {
        setUserLocation(null);
        setLocStatus("deactivated");
        deactivateLocation(userMarkerRef);
    }
}

export function getLocBtnClassName(locStatus: LocStatus): string {
    if (locStatus === "active") return "active";
    if (locStatus === "denied") return "error";
    return "";
}

export function getButtonContent(locStatus: LocStatus): string {
    if (locStatus === "loading") return "Locating...";
    if (locStatus === "active") return "Location on";
    if (locStatus === "denied") return "Location denied";
    return "Find my location";
}

function placeUserMarker(mapInstance: React.RefObject<L.Map | null>,
                            userMarkerRef: React.RefObject<L.Marker | null>,
                            lat: number,
                            lng: number): void {

    if (userMarkerRef.current) userMarkerRef.current.remove();
    
    const icon = L.divIcon({
        html: '<div class="user-marker"></div>',
        className: "",
        iconSize: [16, 16],
        iconAnchor: [8, 8]
    });
    userMarkerRef.current = L.marker([lat, lng], { icon })
        .addTo(mapInstance.current!)
        .bindPopup("<div class='user-popup'>You are here</div>");
}