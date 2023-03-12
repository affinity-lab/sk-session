export class Session {
	public data?: { [p: string]: any } = {}
	public updated: Date = new Date()

	update(data?: { [p: string]: any }) {
		this.data = data;
		this.updated = new Date();
	}
}