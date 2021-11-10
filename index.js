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
	addItemToDOM(activityObj)
}

function sendToJSON(params) {
	//add this later
}

function addItemToDOM(activityObj) {
	const array = ["date", "activity", "length", "effort", "feeling"]
	const uniqueID = parseInt(Math.random() * 1000)   // <-- this assigns a unique identifier to the activity
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
	const targetButton = document.getElementsByClassName(uniqueID)[5] //this grabs the remove button in the DOM
	console.log(targetButton)  // <---this logs the correct DOM element to the console
	targetButton.addEventListener("click", removeItemFromDOM(uniqueID) )  // <--- this line has the bug
	/* If I comment out the above line, the program will work (except for the remove button eventListener).  I can then invoke the function below manually in the console, and it also works.
	If I don't comment out the above line, the program runs, but the callback function is invoked immediately, and the "remove" feature deletes the activity line.
	So my main problem is figuring out why the "click" is registering when I have not clicked the target button.
	*/
}

function removeItemFromDOM(uniqueID) {   // <-- this function works correctly
	console.log(" -- REMOVE BUTTON CLICKED -- ")
	const collection = document.getElementsByClassName(uniqueID)
	console.log(collection)

	for (let i = 0; i < 6; i++) {
		const element = collection[0];
		
		console.log(element)
		element.remove()
	}

}