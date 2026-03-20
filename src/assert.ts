export function assertNotNull<T>(value: T | null, message: string): void {
    if (value === null) throw new Error(message);
}

export function assert(b: boolean): void {
    if (!b) throw new Error("Assertion failed");
}