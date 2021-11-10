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
		date: date,
		activity: activity,
		length: length,
		effort: effort,
		feeling: feeling
	}
	//console.log(activityObj)
	// I will change this to send to JSON instead of add to DOM
	addItemToDOM(activityObj)
}

function sendToJSON(params) {
	//add this later
	
}

function addItemToDOM(activityObj) {
	const array = ["date", "activity", "length", "effort", "feeling"]
	const uniqueID = parseInt(Math.random() * 1000)   // <-- this assigns a unique identifier to the activity line
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
		console.log(" -- REMOVE BUTTON CLICKED -- ")
		console.log(uniqueID)
		const collection = document.getElementsByClassName(uniqueID)
		console.log(collection)
	
		// As elements in the collection are removed, the collection gets shorter, so we end up removing the "first" item 6 times.  All 6 items end up being removed.
		for (let i = 0; i < 6; i++) {
			const element = collection[0];
			element.remove()
		}
	})
}
