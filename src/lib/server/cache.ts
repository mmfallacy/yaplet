interface MemoryCache<T> {
	get(key: string): T | undefined;
	set(key: string, value: T): void;
}
export function createMemoryCache<T>(): MemoryCache<T> {
	return new Map<string, T>();
}
