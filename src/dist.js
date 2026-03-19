export { getHaversineDistance, formatDistance };

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