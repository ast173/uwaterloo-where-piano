import { PIANOS } from "./util/util.ts";
import { Coord, Piano } from "./util/interfaces.ts";
import { Tag } from "./util/types.ts";
import { getHaversineDistance } from "./geo/distance.ts";

// ============================== UI ==============================
export function getVisiblePianos(searchText: string, filteredTags: Tag[], userLocation: Coord | null, radius: number, viewRadius: boolean) {
    return PIANOS.filter(piano => (
        pianoMatchesSearchText(piano, searchText)
            && pianoMatchesTags(piano, filteredTags)
            && pianoInRadius(piano, userLocation, radius, viewRadius)
    ));
}

function isMatch(string: string, text: string): boolean {
    return string.toLowerCase().trim().includes(text);
}

function pianoMatchesSearchText(piano: Piano, searchText: string) {
    const text = searchText.toLowerCase().trim();
    return isMatch(piano.name, text)
            || isMatch(piano.building, text)
            || isMatch(piano.building_code, text)
            || isMatch(piano.room, text)
            || piano.tags.some(tag => isMatch(tag, text));
}

function pianoMatchesTags(piano: Piano, filteredTags: Tag[]) {
    return filteredTags.every(tag => piano.tags.includes(tag));
}

function pianoInRadius(piano: Piano, userLocation: Coord | null, radius: number, viewRadius: boolean) {
    if (!viewRadius) return true;
    if (!userLocation) return true;
    return getHaversineDistance(piano, userLocation) * 1000 <= radius;
}