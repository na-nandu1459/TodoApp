let allTodos, allChecked, allActive, numberOfUnchecked, allHidden, listArray, theme;
const list = document.querySelector("ul");
//handle local Storage

listArray = JSON.parse(localStorage.getItem("todoList"));
theme = JSON.parse(localStorage.getItem("light-theme"));

if (!listArray) {
  listArray = [];
  localStorage.setItem("todoList", JSON.stringify(listArray));
}

if (!theme) {
  localStorage.setItem("light-theme", false);
} else {
  document.querySelector("html").classList.toggle("light-theme");
}

//change theme
const changeTheme = () => {
  const lightTheme = JSON.parse(localStorage.getItem("light-theme"));
  localStorage.setItem("light-theme", JSON.stringify(!lightTheme));
  document.querySelector("html").classList.toggle("light-theme");
  document.querySelector(".theme-icon").src = document.querySelector("html").classList.contains("light-theme")? "./images/icon-moon.svg" : "./images/icon-sun.svg";
};

document.querySelector(".theme-button").addEventListener("click", changeTheme);

// update counter function
const updateNumberOfUnchecked = () => {
  numberOfUnchecked = listArray.filter((el) => !el.checked).length;
  document.querySelector("#numberOfUnchecked").innerHTML = `${numberOfUnchecked}`;
};

// add new todo list item
const handleSubmitForm = (e) => {
//   e.preventDefault();
  let listItemId = Date.now();
  let input = document.querySelector("input");

  if (input.value) {
    addToStorage(listItemId, input.value, false);
    addToDOM(listItemId, input.value);
  }
  input.value = "";
  listItemId = "";
};

//adding items
const addToStorage = (id, value, checked) => {
  listArray.push({ id, value, checked });
  localStorage.setItem("todoList", JSON.stringify(listArray));
};

const addToDOM = (id, value, checked) => {
  const li = document.createElement("li");
  li.innerHTML = `
    <label class="list-item">
        <input aria-label="tick item" class="checkbox ${
          checked ? "checkbox-tick" : ""
        }" type="checkbox"/>
	    <span class="todo-text">${value}</span>
      <img class="cross" src="./images/icon-cross.svg" alt="cross"/>
    </label>
    `;

  li.setAttribute("draggable", true);
  li.setAttribute("id", id);
  li.classList.add("todo-list-item");
  if (checked) {
    li.classList.add("checkedItem");
  }
  //item Click event lister
  li.querySelector("input").addEventListener("change", handleItemClick);

  li.querySelector("span").addEventListener("click", handleItemClick);

  //cross click event listener
  li.querySelector("img").addEventListener("click", handleCrossClick);

  //event listener for drag and drop
  li.addEventListener("dragstart", dragStart);
  li.addEventListener("dragend", dragEnd);
  list.appendChild(li);
  updateNumberOfUnchecked();
};

//removing items
const removeFromStorage = (id) => {
  const newListArray = listArray.filter((el) => el.id != id);
  listArray = newListArray;
  localStorage.setItem("todoList", JSON.stringify(listArray));
};

const removeFromDOM = (node) => {
  list.removeChild(node);
};

//changing checked status
const changeInStorage = (nodeId) => {
  const newListArray = listArray.map((el) =>
    el.id == nodeId ? { ...el, checked: !el.checked } : el );
  listArray = newListArray;
  localStorage.setItem("todoList", JSON.stringify(listArray));
};

const changeInDOM = (node) => {
  node.querySelector("input").classList.toggle("checkbox-tick");
  node.classList.toggle("checkedItem");
};

// toggles list items checked status
const handleItemClick = (e) => {
//   e.preventDefault();
  const container = e.target.parentNode.parentNode;
  const liNodeId = container.id;
  changeInDOM(container);
  changeInStorage(liNodeId);
  updateNumberOfUnchecked();
};

// removes list items
const handleCrossClick = (e) => {
//   e.preventDefault();
  const liNode = e.target.parentNode.parentNode;
  const liNodeId = liNode.id;
  removeFromDOM(liNode);
  removeFromStorage(liNodeId);
  updateNumberOfUnchecked();
};

const handleModalSelection = (e) => {
  const allSelectors = e.target.parentNode.querySelectorAll("a");
  const selector = e.target;
  allSelectors.forEach((el) => el.classList.remove("active-selection"));
  if (selector.parentNode.classList.contains("filter-group")) {
    selector.classList.add("active-selection");
  }
};

//reset
const reset = () => {
  allHidden = document.querySelectorAll(".element-hidden");
  allHidden.forEach((el) => el.classList.remove("element-hidden"));
};

// hide all checked items
const hideChecked = (e) => {
  reset();
  allChecked = document.querySelectorAll(".checkedItem");
  allChecked.forEach((el) => el.classList.add("element-hidden"));
  handleModalSelection(e);
};

// hide all unchecked items
const hideActive = (e) => {
  reset();
  allElements = document.querySelectorAll("li");
  allElements.forEach((el) => {
    if (!el.classList.contains("checkedItem")) {
      el.classList.add("element-hidden");
    }
  });
  handleModalSelection(e);
};

// show all items
const showAll = (e) => {
  reset();
  handleModalSelection(e);
};

const removeChecked = (e) => {
  let allCompleted = document.querySelectorAll(".checkedItem");
  let list = document.querySelector("ul");
  allCompleted.forEach((el) => list.removeChild(el));
  showAll(e);
};
//drag and drop
const container = document.querySelector("ul");
const dragStart = (e) => {
  const item = e.target;
  item.classList.add("dragging");
};

const dragEnd = (e) => {
  e.target.classList.remove("dragging");
};

const dragOver = (e) => {
//   e.preventDefault();
  const afterElement = getDragAfterElement(container, e.clientY);
  const draggable = document.querySelector(".dragging");
  if (afterElement == null) {
    container.appendChild(draggable);
  } else {
    container.insertBefore(draggable, afterElement);
  }
};
//handle local Storage
listArray.map((el) => addToDOM(el.id, el.value, el.checked));

//add event listeners
document.querySelector("form").addEventListener("submit", handleSubmitForm);
document.querySelector(".show-all").addEventListener("click", showAll);
document.querySelector(".hide-checked").addEventListener("click", hideChecked);
document.querySelector(".hide-active").addEventListener("click", hideActive);
document.querySelector(".clear-completed").addEventListener("click", removeChecked);
container.addEventListener("dragover", dragOver);
