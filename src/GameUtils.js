function toMatrixCoordinate(id) {
	return [Math.floor(id / 11), id % 11]
}

function toLinearCoordinate(i, j) {
	return i * 11 + j
}

function toMatrix(board) {
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

const kingCells = [0, 10, 60, 110, 120]

const boardBackground = [
	/* eslint-disable prettier/prettier */
	'C', '.', '.', 'B', 'B', 'B', 'B', 'B', '.', '.', 'C',
	'.', '.', '.', '.', '.', 'B', '.', '.', '.', '.', '.',
	'.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.',
	'B', '.', '.', '.', '.', 'W', '.', '.', '.', '.', 'B',
	'B', '.', '.', '.', 'W', 'W', 'W', '.', '.', '.', 'B',
	'B', 'B', '.', 'W', 'W', 'C', 'W', 'W', '.', 'B', 'B',
	'B', '.', '.', '.', 'W', 'W', 'W', '.', '.', '.', 'B',
	'B', '.', '.', '.', '.', 'W', '.', '.', '.', '.', 'B',
	'.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.',
	'.', '.', '.', '.', '.', 'B', '.', '.', '.', '.', '.',
	'C', '.', '.', 'B', 'B', 'B', 'B', 'B', '.', '.', 'C',
	/* eslint-enable prettier/prettier */
]

const initialBoard = [
	/* eslint-disable prettier/prettier */
	'.', '.', '.', 'B', 'B', 'B', 'B', 'B', '.', '.', '.',
	'.', '.', '.', '.', '.', 'B', '.', '.', '.', '.', '.',
	'.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.',
	'B', '.', '.', '.', '.', 'W', '.', '.', '.', '.', 'B',
	'B', '.', '.', '.', 'W', 'W', 'W', '.', '.', '.', 'B',
	'B', 'B', '.', 'W', 'W', 'K', 'W', 'W', '.', 'B', 'B',
	'B', '.', '.', '.', 'W', 'W', 'W', '.', '.', '.', 'B',
	'B', '.', '.', '.', '.', 'W', '.', '.', '.', '.', 'B',
	'.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.',
	'.', '.', '.', '.', '.', 'B', '.', '.', '.', '.', '.',
	'.', '.', '.', 'B', 'B', 'B', 'B', 'B', '.', '.', '.',
	/* eslint-enable prettier/prettier */
]

/* 	Returns an array with valid cells where you can move from position id
 *	board is the array with positions
 *	player is who you are playing with ('B' or 'W')
 *	id is the position from which you wanna move
 */
function validTargets(board, player, id) {
	if (board[id] !== player && !(board[id] === 'K' && player === 'W'))
		return []
	const mat = toMatrix(board)

	const targets = []

	const [p, q] = toMatrixCoordinate(id)
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

	// remove forbidden king cells
	if (board[id] !== 'K') {
		kingCells.forEach((x) => {
			if (targets.includes(x)) {
				targets.splice(targets.indexOf(x), 1)
			}
		})
	}
	return targets
}

/*
	Checks if move from pos1 to pos2 is valid
	board: current configuration of the board
	player: which player you're playing with ('W' or 'B')
*/
function isMoveValid(board, player, pos1, pos2) {
	const targets = validTargets(board, player, pos1)

	return targets.includes(pos2)
}

// Swaps two position of a board and returns a new board
function swapPositionsOfBoard(board, pos1, pos2) {
	return board.map((x, i) =>
		i == pos1 ? board[pos2] : i == pos2 ? board[pos1] : x,
	)
}

module.exports = {
	isMoveValid,
	swapPositionsOfBoard,
	validTargets,
	initialBoard,
	boardBackground,
}
