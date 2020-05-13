// Some can subscribe to a message with a tag and call a function everytime it is emitted and others can emit
class Subscriber {
	constructor() {
		// eslint-disable-next-line no-undef
		this.tags = new Map()
	}

	emit(tag) {
		if (this.tags.has(tag)) {
			this.tags.get(tag).forEach((cb) => cb())
		}
	}

	subscribe(tag, fn) {
		if (!this.tags.has(tag)) this.tags.set(tag, [fn])
		else this.tags.get(tag).push(fn)
	}
}

const sub = new Subscriber()
export default sub
