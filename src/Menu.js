import React from 'react'
import './style.css'
const Menu = () => {
	return (
		<div className="column center-vertically">
			<button className="up20"> NEW GAME </button>
			<p className="up20 mt2"> Or enter existing: </p>
			<input className="up20 ph2" type="text" placeholder="Game ID" />
		</div>
	)
}

export default Menu
