import type {Session} from "./session";

export interface IStorageAdapter {
	get(key: string): Session | undefined
	create(key: string, session: Session): void
	read(key: string): any
	has(key: string): boolean
	update(key: string, data: any): void
	delete(key: string): void
}