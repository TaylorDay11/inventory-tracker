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

// update local storage
const updateLocalStorage = () => localStorage.setItem("myList", JSON.stringify(itemListArray))

// render item list
const render = (items) => {
	const renderItemList = items.map(function(listItem, index){
		return `<div id="list-entry">
								<div id="list-item">${listItem.item}</div>
								<div id="list-quantity">${listItem.quantity} ${listItem.units}</div>
								<div id="list-edit-options">
									<label for="change-quantity-${index}">Update Quantity:</label> 
									<input id="change-quantity-${index}" type="number" name="change-quantity-${index}">
									<button id="set-btn" type="submit" onclick="updateItemQuantity(${index})">Set</button>
									<button id="delete-item-btn" ondblclick="deleteItem(${index})" type="submit">Delete</button>
									<button id="up-btn" onclick="moveUp(${index})" type="submit">↑</button>
									<button id="down-btn" onclick="moveDown(${index})" type="submit">↓</button>
								</div>
							</div><br>
							<hr><br>`
	}).join(' ')

	itemList.innerHTML = renderItemList
	updateLocalStorage()
}

// if there are already contents in local storage add it to website when it loads
if (itemsFromLocalStorage) {
	itemListArray = itemsFromLocalStorage
    render(itemListArray)
}

// clear local storage
clearBtn.addEventListener("dblclick", () => {
    localStorage.clear()
    itemListArray = []
    render(itemListArray)
})

// create an object from form fields
const createObject = (formEntries) => {
	const formData = new FormData(formEntries)
	const obj = {}

	for(const [key,value] of formData.entries()){
		obj[key] = value
	}

	return obj
}

// when form submit button is clicked
form.addEventListener("submit", (submitClicked) => {
	// prevent page reload when submit button is pressed
	submitClicked.preventDefault()

	// add form entries to array
	const formObject = createObject(form)

	itemListArray.push(formObject)

	// display list on website
	render(itemListArray)

	// clear out form
	itemField.value = ""
	quantityField.value = null
	unitsField.value = ""

})

// delete item from list
const deleteItem = item => {
	itemListArray.splice(item, 1)
	render(itemListArray)
}

// update quantity in list
const updateItemQuantity = item => {
	const newQuantityId = `change-quantity-${item}`
	const newQuantity = document.getElementById(newQuantityId).value
	itemListArray[item].quantity = newQuantity
	render(itemListArray)
}

// move list item up
const moveUp = a => {
	const b = a - 1
	if(a > 0){
		[itemListArray[b], itemListArray[a]] = [itemListArray[a], itemListArray[b]]
		render(itemListArray)
	}
}

// move list item dowm
const moveDown = a => {
	const b = a + 1
	if(a < itemListArray.length){
		[itemListArray[a], itemListArray[b]] = [itemListArray[b], itemListArray[a]]
		render(itemListArray)
	}
}

// export inventory list into csv
exportBtn.addEventListener("click", () => {
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
