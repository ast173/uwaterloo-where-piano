export interface Piano {
    id: number;
    name: string;
    building: string;
    building_code: string;
    room: string;
    lat: number; lng: number;
    tags: string[];
    hours: string;
    notes: string;
}
 
function printPiano(piano: Piano): void {
    console.log(`
        Name: ${piano.name}
        Internal ID: ${piano.id}
        Building: ${piano.building} (${piano.building_code} ${piano.room})
        Coordinates: (${piano.lat}, ${piano.lng})`);
}