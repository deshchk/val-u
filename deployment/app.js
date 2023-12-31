import { values_split, resetRank, splitValues } from "./js/data.js"
import { id, query, getArchivePage } from "./js/utility.js"
// -------------------------------------------------
import { add, remove, clear, renderAdding } from "./js/Adding.js"
import { voting, vote, renderVoting } from "./js/Voting.js"
import { removeRanking, renderRanking } from "./js/Ranking.js"
import { removeArchive, renderArchive } from "./js/Archive.js"



// A D D I N G
	id('adding--list').addEventListener('click', e => {
		if (e.target.id.includes('remove')) {
			remove(e.target.id)
		}
	})

	id('adding--btn').addEventListener('click', () => {
		add()
	})

	id('adding').addEventListener('keypress', e => {
		if (e.key === 'Enter') {
			if (document.activeElement === id('adding--input')) {
				add()
			}
		}
	})

// D R A G   A N D   D R O P
	const touchDevice = (navigator.maxTouchPoints & 0xFF || 'ontouchstart' in document.documentElement)
	let dragging = false

	if (touchDevice) {
		id('adding--list').addEventListener('touchstart', e => {
			const draggables = id('adding--list').querySelectorAll('li > .dragger')
			if (Array.from(draggables).includes(e.target)) {
				dragging = !dragging
				e.target.parentNode.setAttribute('draggable', true)
			}
		})
	
		id('adding--list').addEventListener('touchend', e => {
			const listItems = id('adding--list').querySelectorAll('li')
			if (dragging) {
				dragging = !dragging
				listItems.forEach(item => {item.removeAttribute('draggable')})
			}
		})
	} else {
		id('adding--list').addEventListener('mousedown', e => {
			const draggables = id('adding--list').querySelectorAll('li > .dragger')
			if (Array.from(draggables).includes(e.target)) {
				dragging = !dragging
				e.target.parentNode.setAttribute('draggable', true)
			}
		})
	
		id('adding--list').addEventListener('mouseup', e => {
			const listItems = id('adding--list').querySelectorAll('li')
			if (dragging) {
				dragging = !dragging
				listItems.forEach(item => {item.removeAttribute('draggable')})
			}
		})
	}



// V O T I N G
	let votingRound = 0

		export function resetVoting() {
			votingRound = 0
			resetRank()
			splitValues()
			renderVoting(votingRound)
			if (JSON.parse(localStorage.getItem('values')).length > 3) {
				id('start-voting').disabled = false
				id('min-four').hidden = true
			} else {
				id('start-voting').disabled = true
				id('min-four').hidden = false
			}
			document.activeElement.blur()
		}

	id('start-voting').addEventListener('click', () => {
		voting('start')
	})

	id('reset-voting').addEventListener('click', () => {
		resetVoting()
	})

	id('left-vote-btn').addEventListener('click', () => {
		votingRound++
		vote('left')
		if (votingRound === values_split.at(-1).l.length) { voting('end') }
	})

	id('right-vote-btn').addEventListener('click', () => {
		votingRound++
		vote('right')
		if (votingRound === values_split.at(-1).l.length) { voting('end') }
	})



// R A N K I N G
	id('ranking').addEventListener('click', e => {
		if(e.target.id === 'ranking--remove-btn') {
			removeRanking()
		}
	})



// A R C H I V E
	let page = 1

	id('archive--prev-btn').addEventListener('click', e => {
		page = getArchivePage() - 1
		renderArchive(page-1)
	})

	id('archive--next-btn').addEventListener('click', e => {
		page = getArchivePage() + 1
		renderArchive(page-1)
	})

	id('past-ranking').addEventListener('click', e => {
		if (e.target.dataset.remover) {
			removeArchive()
		}
	})



// N A V I G A T I O N
const navItems = id('navigation').querySelectorAll('li > a')
const navAnchors = id('wrapper').querySelectorAll('.nav-anchor')

export function navigateTo(section) {
	navItems.forEach(item => {
		item.dataset.active = false
		if (item.getAttribute('href') === section) {
			item.dataset.active = true
		}
	})
	const active = query(section, id('wrapper'))
		navAnchors.forEach(anchor => {
			anchor.dataset.hidden = true
		})
		active.dataset.hidden = false
}

id('navigation').addEventListener('click', e => {
	e.preventDefault()
	const clicked = e.target.closest('a')

	if (clicked) {
			navigateTo(clicked.getAttribute('href'))
	}
})



// R E N D E R I N G
	export function render() {	
		renderAdding() //ADDING
		renderVoting(votingRound) // VOTING

		clear()
		if (votingRound === 0 && !touchDevice) {
			id('adding--input').focus()
		}
	}



// INITIALIZE
	render()

	window.addEventListener('load', () => {
		if (!localStorage.getItem('values') && !localStorage.getItem('ranking_archive')) {
			localStorage.setItem('values', JSON.stringify([]))
			localStorage.setItem('ranking_archive', JSON.stringify([]))
		} // INITIALIZE LOCALSTORAGE

		if (JSON.parse(localStorage.getItem('values')).length > 3) {
			id('start-voting').disabled = false
			id('min-four').hidden = true
		} // ABLE TO START VOTING

		renderRanking() // RANKING
		renderArchive(0) // ARCHIVE
		// NAVIGATION
		navItems.forEach((link, i) => {
			if (i === 0) {
				// sth
			} else {
				navAnchors[i].dataset.hidden = true
			}
		})
	})