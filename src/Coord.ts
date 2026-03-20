export interface Coord {
    lat: number;
    lng: number;
}

function coordToArr(coord: Coord): [number, number] {
    return [coord.lat, coord.lng];
}

function arrToCoord(arr: [number, number]): Coord {
    return {
        lat: arr[0],
        lng: arr[1],
    }
}