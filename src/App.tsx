import { useEffect, useRef, useState } from "react";
import { init } from "./init.ts";
import { createPianoMarkers } from "./pianoMarkers.ts";
import { handleLocate, getLocBtnClassName, getButtonContent } from "./geo/geolocation.ts";
import { getVisiblePianos } from "./ui.ts";
import PianoCard from "./components/PianoCard.tsx";
import { Coord } from "./util/interfaces.ts";
import { Tag, LocStatus } from "./util/types.ts";
import SearchButton from "./components/SearchButton.tsx";
import Filter from "./components/Filter.tsx";
import DistanceSetter from "./components/DistanceSetter.tsx";
import { handleRadiusBubble } from "./radiusBubble.ts";

// ============================== REACT APP ==============================
/*
sources:
 - https://leafletjs.com/
 - https://leafletjs.com/examples/quick-start/
 - https://react.dev/reference/react/hooks
TODO:
 - Stop locating when you click the button and locStatus === "loading"
 - Make already open popups update if user turns location on/off
 - Add tags and actually verify data
 - Hovering over tags: either explains the reason behind this piano's reason for wearing that tag or
                       shows the definition of that tag
 - Add images of pianos
 - Make sidebar closeable
 - Add a default ordering
 - add the ^v

Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned
npm run dev

Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned
npm run build
firebase deploy

Tag meanings:
indoor: inside a building
outdoor: outside a building
room: in a dedicated piano room (may or may not be bookable)
public/common: in a public hallway or common area (free to any)
bookable: can be reserved in advance
id required: must give id for physical access (key)
restricted: only avalible to students enrolled in a certain course

mutually exclusive:
indoor/outdoor
room/public
*/
export default function App() {
    const mapRef = useRef<HTMLDivElement | null>(null);
    const mapInstance = useRef<L.Map | null>(null);
    const markersRef = useRef<Record<number, L.Marker>>({});

    const [userLocation, setUserLocation] = useState<Coord | null>(null);
    const userLocationRef = useRef<Coord | null>(null);
    const [locStatus, setLocStatus] = useState<LocStatus>("deactivated");
    const userMarkerRef = useRef<L.Marker | null>(null);

    const [searchText, setSearchText] = useState<string>("");

    // this runs once after the component mounts (once the div exists in the DOM)
    useEffect(() => init(mapRef, mapInstance, userLocationRef), []);

    useEffect(() => {
        if (!mapInstance.current) return;
        userLocationRef.current = userLocation;
        console.log(`User location state: ${locStatus}\nUser location updated: ${userLocation}`);
        createPianoMarkers(mapInstance.current, userLocation, markersRef);
    }, [userLocation]); // runs every time userLocation changes

    const [filteredTags, setFilteredTags] = useState<Tag[]>([]);
    const [viewFilter, setViewFilter] = useState(false);

    function handleTagToggle(tag: Tag) {
        if (filteredTags.includes(tag)) {
            setFilteredTags([...filteredTags.filter(t => t !== tag)]);
        } else {
            setFilteredTags([...filteredTags, tag]);
        }
    }

    const [radius, setRadius] = useState<number>(0); // meters
    const [viewRadius, setViewRadius] = useState(false);
    const radiusBubbleRef = useRef<L.Circle | null>(null);

    useEffect(() => {
        if (radiusBubbleRef.current) {
            radiusBubbleRef.current.remove();
            radiusBubbleRef.current = null;
        }
        if (locStatus !== "active") return;
        if (!viewRadius) return;
        handleRadiusBubble(mapInstance, userLocation, radius, radiusBubbleRef);
    }, [viewRadius, radius, userLocation]);

    const visiblePianos = getVisiblePianos(searchText, filteredTags, userLocation, radius, viewRadius);
    
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
                            <SearchButton text="Filter" toggled={viewFilter} onClick={() => setViewFilter(!viewFilter)} />
                            <SearchButton text="Distance" toggled={viewRadius} onClick={() => setViewRadius(!viewRadius)} />
                        </div>
                        {viewRadius && (<DistanceSetter radius={radius} onRadiusChange={setRadius}/>)}
                        {viewFilter && (<Filter selectedTags={filteredTags} onTagToggle={handleTagToggle} />)}
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