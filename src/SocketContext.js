import { createContext } from 'react'

let SocketContext = null
export function getSocketContext() {
	if (!SocketContext) {
		SocketContext = createContext({})
		SocketContext.displayName = 'SocketContext'
	}
	return SocketContext
}
