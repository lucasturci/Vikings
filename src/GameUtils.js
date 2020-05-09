function toMatrixCoordinate(id) {
	return [Math.floor(id / 11), id % 11]
}

function toLinearCoordinate(i, j) {
	return i * 11 + j
}

export function toMatrix(board) {
	let mat = new Array(11)

	let cur = 0
	for (let i = 0; i < 11; ++i) {
		mat[i] = new Array(11)
		for (let j = 0; j < 11; ++j) {
			mat[i][j] = board[cur++]
		}
	}
	return mat
}

export function validTargets(board, id) {
	const mat = toMatrix(board)

	console.log(mat[4][8])
	const targets = []

	const [p, q] = toMatrixCoordinate(id)
	console.log(p, q)
	for (let j = q + 1; j < 11 && mat[p][j] == '.'; j++) {
		targets.push(toLinearCoordinate(p, j))
	}

	for (let j = q - 1; j >= 0 && mat[p][j] == '.'; j--) {
		targets.push(toLinearCoordinate(p, j))
	}

	for (let i = p + 1; i < 11 && mat[i][q] == '.'; i++) {
		targets.push(toLinearCoordinate(i, q))
	}

	for (let i = p - 1; i >= 0 && mat[i][q] == '.'; i--) {
		targets.push(toLinearCoordinate(i, q))
	}

	console.log(targets)
	return targets
}
