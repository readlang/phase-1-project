let username = ""
document.querySelector("#nameForm").addEventListener("submit", nameSubmitButton )

function nameSubmitButton(event) {
	event.preventDefault()
	username = document.querySelector("#nameEntry").value
	document.getElementById("nameForm").reset()
	document.querySelector("#helloName").textContent = `Hello, ${username}`
	clearAllActiviesFromDom()
	getAllFromServer(username)  
}

function clearAllActiviesFromDom() {
	const array = ["date", "activity", "length", "effort", "feeling", "button"]
	array.forEach(element => {
		const targetLocation = document.querySelector(`#column-${element}`)
		targetLocation.textContent = ""
	})
}

function getAllFromServer(user) {
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
		returnArrayLooper( json["records"].filter( element => element.name === user ) ) 
	} )
}

function returnArrayLooper(array) {
	for (const element of array) {
		addItemToDOM(element)
	}
}


document.querySelector("#add-activity").addEventListener("click", collectInputsIntoObject);

function collectInputsIntoObject() {
	let date = document.querySelector("#activity-date").value;
	if (date === "") {
		date = new Date().toISOString().substring(0, 10);
	}
	const activityObj = {
		activity: document.querySelector("#activity-selector").value,
		date: date,
		effort: document.querySelector("#effort-range").value,
		feeling: document.querySelector("#feeling-dropdown").value,
		length: document.querySelector("#activity-length").value,
		name: username,
	}
	// this resets values after click
	document.getElementById("activity-date").value = "";
	document.getElementById("activity-selector").value = "no-activity";
	document.getElementById("activity-length").value = 0;
	document.getElementById("effort-range").value = 3;
	document.getElementById("feeling-dropdown").value = "😐 okaaay";
	postToServer(activityObj)
}

function postToServer(activityObj) {
	const createServerObj = { record: activityObj, table: "activityTable", }
    fetch("https://api.m3o.com/v1/db/Create", { 
        method: 'post', 
        headers: {
            'Authorization': 'Bearer ZjVhOWQ2ODctMDE1Mi00MzVjLWFlYmQtOWU5N2Q5ODE4MzEy', 
            'Content-Type': 'application/json' 
        }, 
        body: JSON.stringify(createServerObj)
    })
    .then (response => response.json() )
    .then (data => {
        activityObj.id = data.id
		console.log("Post to Server:", activityObj)
		addItemToDOM(activityObj)
    })
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
		deleteOneActivityFromDOM(uniqueID)
	})
}

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
}

function deleteOneActivityFromDOM(uniqueID) {
	const collection = document.getElementsByClassName(uniqueID)
	while (collection.length != 0) {
		collection[0].remove()
	}
}