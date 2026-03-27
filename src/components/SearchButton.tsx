export default function SearchButton(props: {text: string, toggled: boolean, onClick: () => void}) {
    return (
        <button className={`search-btn ${props.toggled ? "toggled" : ""}`} onClick={props.onClick}>{props.text}</button>
    );
}