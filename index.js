const form = document.getElementById("add-item-form")
const itemList = document.getElementById("item-list")
const clearBtn = document.getElementById("clear-btn")
const exportBtn = document.getElementById("export-btn")
const itemsFromLocalStorage = JSON.parse( localStorage.getItem("myList") )

let itemListArray = []

// form fields
let itemField = document.getElementById("item")
let quantityField = document.getElementById("quantity")
let unitsField = document.getElementById("units")

// if there are already contents in local storage add it to website when it loads
if (itemsFromLocalStorage) {
	itemListArray = itemsFromLocalStorage
    render(itemListArray)
}

// when form submit button is clicked
form.addEventListener("submit", (e) => {
	// prevent page reload when submit button is pressed
	e.preventDefault()

	// add form entries to array
	const formObject = createObject(form)
	console.log(formObject)
	itemListArray.push(formObject)
	console.log(itemListArray)

	// display list on website
	render(itemListArray)

	// clear out form
	itemField.value = ""
	quantityField.value = null
	unitsField.value = ""

})

// render item list
function render(e){
	let renderItemList = ""

	for (i = 0; i < e.length; i++){
		renderItemList += `<div id="list-entry">
								<div id="list-item">${e[i].item}</div>
								<div id="list-quantity">${e[i].quantity} ${e[i].units}</div>
								<div id="list-edit-options">
									<label for="change-quantity-${[i]}">Update Quantity:</label> 
									<input id="change-quantity-${[i]}" type="number" name="change-quantity-${[i]}">
									<button id="set-btn" type="submit" onclick="updateItemQuantity(${[i]})">Set</button>
									<button id="delete-item-btn" ondblclick="deleteItem(${[i]})" type="submit">Delete</button>
									<button id="up-btn" onclick="moveUp(${[i]})" type="submit">↑</button>
									<button id="down-btn" onclick="moveDown(${[i]})" type="submit">↓</button>
								</div>
							</div><br>
							<hr><br>`
	}

	itemList.innerHTML = renderItemList
	updateLocalStorage()
}

// create an object from form fields
function createObject(formEntries){
	const formData = new FormData(formEntries)
	const obj = {}

	for(const [key,value] of formData.entries()){
		obj[key] = value
	}

	return obj
}

// delete item from list
function deleteItem(item){
	itemListArray.splice(item, 1)
	render(itemListArray)
}

// update quantity in list
function updateItemQuantity(item){
	const newQuantityId = `change-quantity-${item}`
	const newQuantity = document.getElementById(newQuantityId).value
	console.log(newQuantity)
	itemListArray[item].quantity = newQuantity
	render(itemListArray)
}

// move list item up
function moveUp(a){
	const b = a - 1
	if(a > 0){
		[itemListArray[b], itemListArray[a]] = [itemListArray[a], itemListArray[b]]
		render(itemListArray)
	}
}

// move list item dowm
function moveDown(a){
	const b = a + 1
	if(a < itemListArray.length){
		[itemListArray[a], itemListArray[b]] = [itemListArray[b], itemListArray[a]]
		console.log(itemListArray)
		render(itemListArray)
	}
}

// update local storage
function updateLocalStorage() {
	localStorage.setItem("myList", JSON.stringify(itemListArray))
}

// clear local storage
clearBtn.addEventListener("dblclick", function() {
    localStorage.clear()
    itemListArray = []
    render(itemListArray)
})

// export inventory list into csv
exportBtn.addEventListener("click", function(){
	// Convert objects to CSV rows
  const csvRows = itemListArray.map(row => {
    const values = Object.values(row).map(value => {
      // Handle values that contain commas or quotes
      if (typeof value === 'string') {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    });
    return values.join(',');
  });

  // Add header row
  if (itemListArray.length > 0) {
    const header = Object.keys(itemListArray[0]).join(',');
    csvRows.unshift(header);
  }

  // Create CSV string
  const csvString = csvRows.join('\n');

  // Create a Blob and download link
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', 'InventoryList.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
})
