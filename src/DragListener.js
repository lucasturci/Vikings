class DragListener {
	constructor() {
		this.pos1 = this.pos2 = -1
		this.recording = false
		this.callback = null
		this.updateSprite = null
		this.snap = null

		const mouseMoveEvt = (e) => {
			let x = e.clientX
			let y = e.clientY

			if (
				x < 0 ||
				y < 0 ||
				x >= document.body.clientWidth ||
				y >= document.body.clientHeight
			) {
				this.cancelRecording()
			} else {
				if (this.recording) {
					this.spriteUpdate(x, y)
				}
			}
		}
		// If mouse goes off the window while moving piece, stop recording
		document
			.querySelector('html')
			.addEventListener('mousemove', mouseMoveEvt)
		document
			.querySelector('html')
			.addEventListener('touchmove', mouseMoveEvt)
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
			if (this.snap) this.snap()
		}
	}

	cancelRecording() {
		this.recording = false
		this.pos1 = this.pos2 = -1
		if (this.snap) this.snap()
	}

	emitMove() {
		this.callback(this.pos1, this.pos2)
	}

	setCallback(cb) {
		this.callback = cb
	}

	setSpriteUpdate(spriteUpdateCallback, snapCallback) {
		this.spriteUpdate = spriteUpdateCallback
		this.snap = snapCallback
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
