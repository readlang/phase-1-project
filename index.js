let username = "anonymous-user"

//username button listener, assigns to "username" variable, displays on page, call funct to grab JSON data
document.querySelector("#nameEntryButton").addEventListener("click", function(event) {
	event.preventDefault()
	username = document.querySelector("#nameEntry").value
	document.querySelector("#helloName").textContent = `Hello, ${username}`
	getFromServer(username)  // loads pre-existing server data matching user name
})

createAddButtonListener();

function createAddButtonListener() { 
    const target = document.querySelector("#submit-button");
	target.addEventListener("click", grabInputs);
}

function grabInputs() {
	let date = document.querySelector("#activity-date").value;
	const activity = document.querySelector("#activity-selector").value;
	const length = document.querySelector("#activity-length").value;
	const effort = document.querySelector("#effort-range").value;
	const feeling = document.querySelector("#feeling-dropdown").value;
	//this enters today's date if user leaves date field blank
	if (date === "") {
		date = new Date().toISOString().substring(0, 10);
	}
	const activityObj = {
		name: username,
		date: date,
		activity: activity,
		length: length,
		effort: effort,
		feeling: feeling
	}
	postToServer(activityObj)
}

function postToServer(activityObj) {
	fetch("http://localhost:3000/activitylog", {
		method: "POST",
		headers: {
			"content-type": "application/json"
		},
		body: JSON.stringify(activityObj)
	})
	.then (response => response.json())
	.then (data => getFromServer(username))
}

function getFromServer(user) {
	clearAllActiviesFromDom()
	fetch("http://localhost:3000/activitylog")
	.then(response => response.json())
	.then(data => {
		returnArrayParser( data.filter( element => element.name === user ) )  // this filters the array elements by the username
	})
}

function clearAllActiviesFromDom() {
	const array = ["date", "activity", "length", "effort", "feeling", "button"]
	array.forEach(element => {
		const targetLocation = document.querySelector(`#column-${element}`)
		targetLocation.textContent = ""
	})
}

function returnArrayParser(array) {
	for (const iterator of array) {
		addItemToDOM(iterator)
	}
}

function addItemToDOM(activityObj) {
	const array = ["date", "activity", "length", "effort", "feeling"]
	const uniqueID = activityObj.id
	array.forEach(element => {
		const targetLocation = document.querySelector(`#column-${element}`)
		const newElement = document.createElement("div")
		newElement.textContent = activityObj[element]
		newElement.className = uniqueID
		targetLocation.append(newElement)
	});
	const targetLocation = document.querySelector("#column-button")
	const newElement = document.createElement("button")
	newElement.textContent = "remove"
	newElement.className = uniqueID
	newElement.style = "width: 200px"
	targetLocation.append(newElement)
	createRemoveButtonListener(uniqueID)
}

function createRemoveButtonListener(uniqueID) {
	const targetButton = document.getElementsByClassName(uniqueID)[5] 
	targetButton.addEventListener("click", function () {
		console.log(`Remove uniqueID: ${uniqueID}`)
		deleteOneActivityFromServer(uniqueID)
	})
}

function deleteOneActivityFromServer(uniqueID) {
	fetch(`http://localhost:3000/activitylog/${uniqueID}`, {
		method: "DELETE",
		headers: {
			"content-type": "application/json"
		}
	} )
	.then(response => response.json())
	.then( () => getFromServer(username) )
}