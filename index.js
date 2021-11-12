let username = ""

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

// -- new external database API function --
function postToServer(activityObj) {
	const createObj = { record: activityObj, table: "activityTable", }

    fetch("https://api.m3o.com/v1/db/Create", { 
        method: 'post', 
        headers: {
            'Authorization': 'Bearer ZjVhOWQ2ODctMDE1Mi00MzVjLWFlYmQtOWU5N2Q5ODE4MzEy', 
            'Content-Type': 'application/json' 
        }, 
        body: JSON.stringify(createObj)
    })
    .then (response => response.json() )
    .then (data => {
        console.log("data.id", data.id)
		getFromServer(username)
    })
}

// -- old JSON server function --
/*
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
}   */

// -- new external database API function --
function getFromServer(user) {
	clearAllActiviesFromDom()
	const queryObj = { table: "activityTable" }

	fetch("https://api.m3o.com/v1/db/Read", {
        method: "post",
        headers: {
            'Authorization': 'Bearer ZjVhOWQ2ODctMDE1Mi00MzVjLWFlYmQtOWU5N2Q5ODE4MzEy', 
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify(queryObj)
    })
    
    .then (response => response.json() )
    .then (json => {
		console.log("json:", json)
		console.log("json.records:", json.records)
		console.log("json.records[0]", json.records[0])
		console.log("json.records[0]['name']", json["records"][0]["name"] )
		returnArrayParser( json["records"].filter( element => element.name === user ) )  // this filters the array elements by the username
	} )
}

// -- old JSON server function --
/*  function getFromServer(user) {
	clearAllActiviesFromDom()
	fetch("http://localhost:3000/activitylog")
	.then(response => response.json())
	.then(data => {
		returnArrayParser( data.filter( element => element.name === user ) )  // this filters the array elements by the username
	})
} */

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

/*  // -- old JSON server function --
function deleteOneActivityFromServer(uniqueID) {
	fetch(`http://localhost:3000/activitylog/${uniqueID}`, {
		method: "DELETE",
		headers: {
			"content-type": "application/json"
		}
	} )
	.then(response => response.json())
	.then( () => getFromServer(username) )
}  */

// -- new external database API function --
function deleteOneActivityFromServer(uniqueID) {
	const deleteObj = { table: "activityTable", id: uniqueID }
	fetch("https://api.m3o.com/v1/db/Delete", {
        method: "post",
        headers: {
            'Authorization': 'Bearer ZjVhOWQ2ODctMDE1Mi00MzVjLWFlYmQtOWU5N2Q5ODE4MzEy', 
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify(deleteObj)
    })
	.then (response => response.json() )
    .then ( () => getFromServer(username) )
}