export { locateUser, handleLocate, getLocBtnClassName, getButtonContent };

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