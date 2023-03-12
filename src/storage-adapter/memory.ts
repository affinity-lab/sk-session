import type {IStorageAdapter} from "../storage-adapter-interface";
import type {Session} from "../session";

export class MemoryStorageAdapter implements IStorageAdapter {

	store: Map<string, Session> = new Map();

	constructor(private ttl: number = 5, private gcInterval: number = 10) {
		setInterval(() => this.cleanUp(), gcInterval * 1000);
	}

	get(key: string): Session | undefined {return this.store.get(key)}
	public read(key: string): any | undefined {return this.store.get(key)?.data }
	public has(key: string): boolean { return this.store.has(key); }
	public create(key: string, session: Session): void { this.store.set(key, session); }
	public update(key: string, data: any) { this.store.get(key)?.update(data) }
	public delete(key: string): void {this.store.delete(key);}

	private cleanUp() {
		this.store.forEach((session, key) => {
			let expire = new Date();
			expire.setSeconds(expire.getSeconds() - this.ttl);
			if (session.updated < expire) {
				this.store.delete(key);
			}
		})
	}
}