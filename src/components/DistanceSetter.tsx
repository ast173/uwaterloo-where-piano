import Slider from "./Slider";

export default function DistanceSetter(props: {radius: number, onRadiusChange: (value: number) => void}) {
    return (
        <div className="radius-menu">
            <div className="radius-menu-title">Distance</div>
            <div className="radius-menu-row">
                <div className="radius-menu-text">0m</div>
                <Slider value={props.radius} onChange={props.onRadiusChange} min={0} max={2000}/>
                <div className="radius-menu-text">2km</div>
            </div>
            <div className="radius-menu-text">{props.radius}m</div>
        </div>
    );
}

// function formatRadius(radius: number) {
//     if (radius < 1000) {
//         return `${radius}m`
//     }
//     return `${(radius / 1000.0).toFixed(1)}km`
// }