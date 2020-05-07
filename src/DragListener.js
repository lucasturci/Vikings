class DragListener {
	constructor() {
		this.pos1 = this.pos2 = -1
		this.recording = false
		this.callback

		// If mouse goes off the window while moving piece, stop recording
		document.querySelector('html').addEventListener('mousemove', (e) => {
			let x = e.clientX
			let y = e.clientY

			if (
				x < 0 ||
				y < 0 ||
				x >= document.body.clientWidth ||
				y >= document.body.clientHeight
			) {
				this.recording = false
				this.pos1 = this.pos2 = -1
			}
		})
	}

	startRecording(pos1) {
		this.pos1 = pos1
		this.recording = true
	}

	stopRecording(pos2) {
		if (this.recording) {
			this.pos2 = pos2
			this.emitMove()
			this.recording = false
			this.pos1 = this.pos2 = -1
		}
	}

	emitMove() {
		this.callback(this.pos1, this.pos2)
	}

	setCallback(cb) {
		this.callback = cb
	}
}

let dragListener = null
function getDragListener() {
	if (!dragListener) {
		dragListener = new DragListener()
	}

	return dragListener
}

export default getDragListener
