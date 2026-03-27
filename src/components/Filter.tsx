import { Tag, TAGS } from "../util/types.ts";

export default function Filter(props: {selectedTags: Tag[], onTagToggle: (tag: Tag) => void}) {
    return (
        <div className="filter-menu">
            <div className="filter-menu-title">Filter</div>
            {TAGS.map(tag => (
                <div key={tag} className="filter-row">
                    <div className="filter-text">{tag}</div>
                    <input type="checkbox" checked={props.selectedTags.includes(tag)} onChange={() => props.onTagToggle(tag)} />
                </div>
            ))}
        </div>
    );
}