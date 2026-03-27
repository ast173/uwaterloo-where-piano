export default function Slider(props: {value: number, onChange: (value: number) => void, min: number, max: number}) {
    return (
        <input
            className="slider"
            type="range"
            min={props.min}
            max={props.max}
            value={props.value}
            onChange={e => props.onChange(parseInt(e.target.value))}
        />
    );
}