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

const middleCell = 60
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

// Returns if position is inside bounds
function valid(pos) {
	return pos >= 0 && pos < 121
}

/*
	Returns if a and b (which can be 'W', 'K', or 'B') are of the opposite side
*/
function opposite(a, b) {
	return (a === 'B') !== (b === 'B')
}

/*
	Checks if enemy arriving at 'enemy' position caused the piece in 'pos' position to be taken
*/
function checksEaten(board, pos, enemy) {
	if (!valid(pos) || board[pos] === '.') return false

	if (board[pos] === 'K') {
		// calculate differently, checks if there is '.' or 'W' on the four sides
		// since enemy is definitely one of occupied sides of the king, it doesn't depend on it.
		const dirs = [+1, -1, +11, -11]

		const numberOfBlacks = board.reduce((cur, x) => {
			return cur + (x === 'B' ? 1 : 0)
		}, 0)
		let flag = true
		dirs.forEach((dir) => {
			// If there are only 3 black pieces you can capture in the edges otherwise not
			if (numberOfBlacks === 3) {
				if (valid(pos + dir) && ['.', 'W'].includes(board[pos + dir]))
					flag = false
			} else {
				if (!valid(pos + dir) || ['.', 'W'].includes(board[pos + dir]))
					flag = false
			}
		})
		return flag
	} else if (opposite(board[pos], board[enemy])) {
		const dirs = [+1, -1, +11, -11]

		const hostileSquares = kingCells.slice()
		if (board[pos] === 'W' && board[middleCell] == 'K')
			hostileSquares.splice(2, 1) // remove that, because it is not hostile to white

		let flag = false
		dirs.forEach((dir) => {
			if (
				enemy === pos + dir &&
				valid(pos - dir) &&
				((board[pos - dir] !== '.' &&
					opposite(board[pos - dir], board[pos])) ||
					hostileSquares.includes(pos - dir))
			)
				flag = true
		})
		return flag
	}
	return false
}

/*
	Checks if:
	- King has reached target cells
	- King was trapped
	- There are no black pieces

	// Returns 0 if game is ot over
	// Returns 1 if white has won
	// Returns 2 if black has won
*/
function checkGameOver(board) {
	const kingPos = board.indexOf('K')
	// Checks if king has reached target cell
	if (kingCells.filter((x) => x !== middleCell).includes(kingPos)) {
		// white won
		return 1
	}

	// Checks if there are no black pieces
	if (
		board.reduce((cur, x) => {
			return cur + (x === 'B' ? 1 : 0)
		}, 0) === 0
	) {
		// white won
		return 1
	}

	// Checks if king is trapped
	if (checksEaten(board, kingPos)) {
		// black won
		return 2
	}

	return 0
}

module.exports = {
	isMoveValid,
	swapPositionsOfBoard,
	validTargets,
	initialBoard,
	boardBackground,
	checksEaten,
	checkGameOver,
}
