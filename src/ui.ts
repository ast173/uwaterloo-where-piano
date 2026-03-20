export { updateCards };

import { PIANOS } from "./util.ts";
import { Piano } from "./Piano.ts";

// ============================== UI ==============================
function isMatch(s: string, text: string): boolean {
    return s.toLowerCase().trim().includes(text);
}

function updateCards(searchText: string): Piano[] {
    let visiblePianos = PIANOS.filter(piano => {
        const text: string = searchText.toLowerCase().trim();

        return isMatch(piano.name, text)
            || isMatch(piano.building, text)
            || isMatch(piano.building_code, text)
            || isMatch(piano.room, text)
            || piano.tags.some(tag => isMatch(tag, text));
    });
    
    return visiblePianos;
}