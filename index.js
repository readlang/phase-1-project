let username = "anonymous-user"

//listens to the name entry button, assigns to "username" variable, displays on page, call funct to grab JSON data
document.querySelector("#nameEntryButton").addEventListener("click", function(event) {
	event.preventDefault()
	username = document.querySelector("#nameEntry").value
	document.querySelector("#helloName").textContent = `Hello, ${username}`
	//console.log(username)
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
	console.log(date, activity, length, effort, feeling)
	const activityObj = {
		name: username,
		date: date,
		activity: activity,
		length: length,
		effort: effort,
		feeling: feeling
	}
	console.log(activityObj)
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
		console.log(data)
		console.log(data.filter( element => element.name === user ))
		//console.log( data.filter( element => element.name === user ) )
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
	//const uniqueID = parseInt(Math.random() * 1000)   // <-- this assigns a unique identifier to the activity line
	console.log(activityObj)
	console.log(activityObj.id)
	const uniqueID = activityObj.id
	console.log(`The uniqueID is: ${uniqueID}`)
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
	console.log(uniqueID)
	createRemoveButtonListener(uniqueID)
}

function createRemoveButtonListener(uniqueID) {
	const targetButton = document.getElementsByClassName(uniqueID)[5] 
	console.log(targetButton)
	targetButton.addEventListener("click", function () {
		console.log(uniqueID)
		deleteOneActivityFromServer(uniqueID)
		setTimeout( () => getFromServer(username), 50)  ////////////////////// this is kinda cheater.  There should be something that waits
		//waits for the last function to complete before executing
		
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
	.then((x) => console.log(x))
}

//I think this is obsolete and can be deleted...
function clearOneActivityLineFromDOM(uniqueID) {
	const collection = document.getElementsByClassName(uniqueID)
	//console.log(collection)

	/* As elements in the collection are removed, the collection gets shorter, 
	so we end up removing the "first" item 6 times.  All 6 items end up being removed. */
	for (let i = 0; i < 6; i++) {
		const element = collection[0];
		element.remove()
	}
}