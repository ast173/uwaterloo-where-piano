import { useEffect, useRef, useState } from "react";
import { PIANOS } from "./util.js";
import { createPianoMarkers, init } from "./init.js";
import { locateUser, handleLocate, getLocBtnClassName, getButtonContent } from "./geolocation.js";
import { updateCards } from "./ui.js";
import { getHaversineDistance, formatDistance } from "./dist.js";
import PianoCard from "./PianoCard.jsx";

// ****************************** REACT APP ******************************
/*
sources:
 - https://leafletjs.com/
 - https://leafletjs.com/examples/quick-start/
TODO:
 - Stop locating when you click the button and locStatus === "loading"
*/
export default function App() {
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