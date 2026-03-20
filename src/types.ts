export type Setter<T> = React.Dispatch<React.SetStateAction<T>>;
export type LocStatus = "deactivated" | "loading" | "active" | "denied";
export type Tag = "indoor" | "outdoor" | "room" | "public" | "bookable";