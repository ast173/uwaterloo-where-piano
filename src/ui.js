export { updateCards };

import { PIANOS } from "./util.js";

// ****************************** UI ******************************
function isMatch(s, text) {
    return s.toLowerCase().trim().includes(text);
}

function updateCards(searchText) {
    let visiblePianos = PIANOS.filter(piano => {
        const text = searchText.toLowerCase().trim();

        return isMatch(piano.name, text)
            || isMatch(piano.building, text)
            || isMatch(piano.building_code, text)
            || isMatch(piano.room, text)
            || piano.tags.some(tag => isMatch(tag, text));
    });
    return visiblePianos;
}