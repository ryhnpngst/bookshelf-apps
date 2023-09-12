const books = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOKSHELF_APPS";

function isStorageExist() {
    if (typeof Storage === undefined) {
        alert("Browser kamu tidak mendukung local storage");
        return false;
    }
    return true;
};

document.addEventListener("DOMContentLoaded", function () {
    const submitBook = document.getElementById("inputBook");
    submitBook.addEventListener("submit", function (event) {
        event.preventDefault();
        addBook();
    });
    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

function addBook() {
    const idBook = +new Date();
    const titleBook = document.getElementById("inputBookTitle").value;
    const authorBook = document.getElementById("inputBookAuthor").value;
    const yearBook = document.getElementById("inputBookYear").value;
    const isCompleteBook = document.getElementById("inputBookIsComplete").checked;

    const bookObject = generateBookObject(idBook, titleBook, authorBook, yearBook, isCompleteBook);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();

    document.getElementById('inputBookTitle').value="";
    document.getElementById('inputBookAuthor').value="";
    document.getElementById('inputBookYear').value="";
    document.getElementById('inputBookIsComplete').checked=false;
};

function generateBookObject(id, title, author, year, isComplete) {
    return {
        id,
        title,
        author,
        year,
        isComplete,
    };
};

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event("SAVED_EVENT"));
    }
};

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
    
    if (data !== null) {
        for (const book of data) {
            books.push(book);
        }
    }
    
    document.dispatchEvent(new Event(RENDER_EVENT));
};

document.addEventListener(RENDER_EVENT, function () {
    const uncompleteBookList = document.getElementById("incompleteBookshelfList");
    uncompleteBookList.innerHTML = "";
    
    const completeBookList = document.getElementById("completeBookshelfList");
    completeBookList.innerHTML = "";
    
    for (const bookItem of books) {
        const bookElement = makeBook(bookItem);
        if (bookItem.isComplete) {
            completeBookList.append(bookElement);
        } else {
            uncompleteBookList.append(bookElement);
        }
    }
});

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
});

function makeBook(bookObject) {
    const textTitle = document.createElement("h3");
    textTitle.innerText = bookObject.title;

    const textAuthor = document.createElement("p");
    textAuthor.innerText = bookObject.author;

    const textYear = document.createElement("p");
    textYear.innerText = bookObject.year;

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("action");

    const container = document.createElement("article");
    container.classList.add("book_item");
    container.append(textTitle, textAuthor, textYear, buttonContainer);
    container.setAttribute("id", `book-${bookObject.id}`);

    if (bookObject.isComplete) {
        const uncompleteButton = document.createElement("button");
        uncompleteButton.innerText = "Belum Selesai Dibaca";
        uncompleteButton.classList.add("green");

        uncompleteButton.addEventListener("click", function () {
            addBookToUncomplete(bookObject.id);
        });

        const deleteButton = document.createElement("button");
        deleteButton.innerText = "Hapus Buku";
        deleteButton.classList.add("red");

        deleteButton.addEventListener("click", function () {
            const confirmation = confirm("Apakah Anda yakin ingin menghapus buku ini?");
            if (confirmation) {
                removeBookFromCompleted(bookObject.id);
            }
        });

        buttonContainer.append(uncompleteButton, deleteButton);
    } else {
        const completeButton = document.createElement("button");
        completeButton.innerText = "Selesai Dibaca";
        completeButton.classList.add("green");

        completeButton.addEventListener("click", function () {
            addBookToCompleted(bookObject.id);
        });

        const deleteButton = document.createElement("button");
        deleteButton.innerText = "Hapus Buku";
        deleteButton.classList.add("red");

        deleteButton.addEventListener("click", function () {
            const confirmation = confirm("Apakah Anda yakin ingin menghapus buku ini?");
            if (confirmation) {
                removeBookFromUncompleted(bookObject.id);
            }
        });

        buttonContainer.append(completeButton, deleteButton);
    }

    return container;
};

function findBook(bookId){
    for (const bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }
    return null;
};

function findBookIndex (bookId){
    for (const index in books) {
        if (books[index].id === bookId) {
            return index;
        }
    }

    return -1;
};

function addBookToUncomplete(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
};

function addBookToCompleted(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
};

function removeBookFromCompleted(todoId) {
    const bookTarget = findBookIndex(todoId);

    if (bookTarget == null) return;

    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
};

function removeBookFromUncompleted(todoId) {
    const bookTarget = findBookIndex(todoId);

    if (bookTarget == null) return;

    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
};

document.getElementById("searchBook").addEventListener("submit", function (event) {
    event.preventDefault();
    const searchBook = document.getElementById("searchBookTitle").value;
    const listBook = document.querySelectorAll(".book_item > h3");
    for (const book of listBook) {
        if (book.innerText.toLowerCase().includes(searchBook.toLowerCase())) {
            book.parentElement.style.display = "block";
        } else {
            book.parentElement.style.display = "none";
        }
    }
});

document.getElementById("clearSearch").addEventListener("click", function () {
    document.getElementById("searchBookTitle").value = "";
});