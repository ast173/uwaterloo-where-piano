import { Piano } from "./Piano";

export default function PianoCard({piano}: {piano: Piano}) {
    return (
        <div className="piano-card">
            <div className="card-name">{piano.name}</div>
            <div className="card-building">{piano.building}</div>
            <div className="card-room">{piano.building_code} {piano.room}</div>
            <div className="card-tags">
                {piano.tags.map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                ))}
            </div>
        </div>
    );
}