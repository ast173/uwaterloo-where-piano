import { useEffect, useRef, useState } from "react";
import { createPianoMarkers, init } from "./init.js";
import { handleLocate, getLocBtnClassName, getButtonContent } from "./geolocation.js";
import { updateCards } from "./ui.js";
import PianoCard from "./PianoCard.js";
import { Coord } from "./Coord.ts";
import { LocStatus } from "./types.ts";

// ============================== REACT APP ==============================
/*
sources:
 - https://leafletjs.com/
 - https://leafletjs.com/examples/quick-start/
TODO:
 - Stop locating when you click the button and locStatus === "loading"
 - Make already open popups update if user turns location on/off
Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned
npm run dev
*/
export default function App() {
    const mapRef = useRef<HTMLDivElement | null>(null);
    const mapInstance = useRef<L.Map | null>(null);
    const markersRef = useRef<L.Marker[]>([]); // useRef<Record<number, L.Marker>>({});

    const [userLocation, setUserLocation] = useState<Coord | null>(null);
    const userLocationRef = useRef<Coord | null>(null);
    const [locStatus, setLocStatus] = useState<LocStatus>("deactivated");
    const userMarkerRef = useRef<L.Marker | null>(null);

    const [searchText, setSearchText] = useState<string>("");
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
                        <input type="text" placeholder="Search..." onChange={e => setSearchText(e.target.value)} />
                        <div className="buttonbar">
                            <button>Filter</button>
                        </div>
                    </div>
                    {visiblePianos.map(piano => (
                        <PianoCard key={piano.id} piano={piano} />
                    ))}
                </div>

                <div className="map" ref={mapRef} />
            </div>
        </>
    );
}