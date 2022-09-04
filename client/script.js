const socket = io('http://localhost:3001');
const roomID = window.location.search.slice(-1)
const area = document.getElementById('editing')


function send(arg) {
	socket.emit('send_text', arg)
}

function makeid(length) {
	let result = ''
	let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
	let charactersLength = characters.length
	for (var i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() *
			charactersLength))
	}
	return result
}

const usersList = {
	user: makeid(8),
	roomID: roomID
}

const newList = []

socket.on('connect', () => {
	console.log('socket connected')
})

socket.on('join', (clients) => {
	const asideUsers = document.getElementById('asideUsers')
	asideUsers.innerHTML = null
	clients.filter(client => client.roomID === roomID).forEach(item => {
		const asideUser = document.createElement('div')
		asideUser.classList.add('aside__user')

		const asideUsername = document.createElement('p')
		asideUsername.classList.add('aside__user-name')
		asideUsername.textContent = item.user

		asideUser.append(asideUsername)
		asideUsers.append(asideUser)
	});
})

socket.emit('join', { name: usersList.user, roomID: usersList.roomID })

socket.on('send_text', ({ data }) => {
	area.value = data
	update(area.value)
})
