import type {RequestEvent} from "@sveltejs/kit";
import {Session} from "./session";
import type {IStorageAdapter} from "./storage-adapter-interface";

export class SessionManager {
	constructor(
		private store:IStorageAdapter,
		private cookie: string = "sid",
	) {}

	handleRequest(event: RequestEvent) {
		let sid = this.getSid(event, true);
		if (sid !== undefined) event.locals.session = this.store.read(sid);
	}

	getSid(event: RequestEvent, create: boolean = false): string | undefined {
		let sid = event.cookies.get(this.cookie)
		if (sid === undefined && !create) return undefined;
		if (sid === undefined) {
			sid = crypto.randomUUID();
			event.cookies.set(this.cookie, sid, {path:"/"});
		}
		if (!this.store.has(sid)) this.store.create(sid, new Session());
		return sid;
	}

	update(event: RequestEvent) {
		let sid = this.getSid(event);
		if (sid !== undefined) this.store.get(sid)?.update(event.locals.session)
	}

	destroy(event: RequestEvent) {
		event.cookies.delete(this.cookie, {path:"/"})
		let sid = this.getSid(event);
		if (sid !== undefined) this.store.delete(sid);
	}
}

