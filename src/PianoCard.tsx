import { Piano } from "./interfaces";

export default function PianoCard({piano}: {piano: Piano}) {
    return (
        <button className="piano-card" onClick={() => locateMarker(piano.id)}>
                <div className="card-name">{piano.name}</div>
                <div className="card-building">{piano.building}</div>
                <div className="card-room">{piano.building_code} {piano.room}</div>
                <div className="card-tags">
                    {piano.tags.map(tag => (
                        <span key={tag} className="tag">{tag}</span>
                    ))}
                </div>
        </button>
    );
}

function locateMarker(id: number): void {
    console.log(`Clicked on piano: ${id} from sidebar`);
}