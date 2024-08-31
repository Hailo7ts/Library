/*
	Editorial by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/





(function ($) {

	var $window = $(window),
		$head = $('head'),
		$body = $('body');

	// Breakpoints.
	breakpoints({
		xlarge: ['1281px', '1680px'],
		large: ['981px', '1280px'],
		medium: ['737px', '980px'],
		small: ['481px', '736px'],
		xsmall: ['361px', '480px'],
		xxsmall: [null, '360px'],
		'xlarge-to-max': '(min-width: 1681px)',
		'small-to-xlarge': '(min-width: 481px) and (max-width: 1680px)'
	});

	// Stops animations/transitions until the page has ...

	// ... loaded.
	$window.on('load', function () {
		window.setTimeout(function () {
			$body.removeClass('is-preload');
		}, 100);
	});

	// ... stopped resizing.
	var resizeTimeout;

	$window.on('resize', function () {

		// Mark as resizing.
		$body.addClass('is-resizing');

		// Unmark after delay.
		clearTimeout(resizeTimeout);

		resizeTimeout = setTimeout(function () {
			$body.removeClass('is-resizing');
		}, 100);

	});

	// Fixes.

	// Object fit images.
	if (!browser.canUse('object-fit')
		|| browser.name == 'safari')
		$('.image.object').each(function () {

			var $this = $(this),
				$img = $this.children('img');

			// Hide original image.
			$img.css('opacity', '0');

			// Set background.
			$this
				.css('background-image', 'url("' + $img.attr('src') + '")')
				.css('background-size', $img.css('object-fit') ? $img.css('object-fit') : 'cover')
				.css('background-position', $img.css('object-position') ? $img.css('object-position') : 'center');

		});

	// Sidebar.
	var $sidebar = $('#sidebar'),
		$sidebar_inner = $sidebar.children('.inner');

	// Inactive by default on <= large.
	breakpoints.on('<=large', function () {
		$sidebar.addClass('inactive');
	});

	breakpoints.on('>large', function () {
		$sidebar.removeClass('inactive');
	});

	// Hack: Workaround for Chrome/Android scrollbar position bug.
	if (browser.os == 'android'
		&& browser.name == 'chrome')
		$('<style>#sidebar .inner::-webkit-scrollbar { display: none; }</style>')
			.appendTo($head);

	// Toggle.
	$('<a href="#sidebar" class="toggle">Toggle</a>')
		.appendTo($sidebar)
		.on('click', function (event) {

			// Prevent default.
			event.preventDefault();
			event.stopPropagation();

			// Toggle.
			$sidebar.toggleClass('inactive');

		});

	// Events.

	// Link clicks.
	$sidebar.on('click', 'a', function (event) {

		// >large? Bail.
		if (breakpoints.active('>large'))
			return;

		// Vars.
		var $a = $(this),
			href = $a.attr('href'),
			target = $a.attr('target');

		// Prevent default.
		event.preventDefault();
		event.stopPropagation();

		// Check URL.
		if (!href || href == '#' || href == '')
			return;

		// Hide sidebar.
		$sidebar.addClass('inactive');

		// Redirect to href.
		setTimeout(function () {

			if (target == '_blank')
				window.open(href);
			else
				window.location.href = href;

		}, 500);

	});

	// Prevent certain events inside the panel from bubbling.
	$sidebar.on('click touchend touchstart touchmove', function (event) {

		// >large? Bail.
		if (breakpoints.active('>large'))
			return;

		// Prevent propagation.
		event.stopPropagation();

	});

	// Hide panel on body click/tap.
	$body.on('click touchend', function (event) {

		// >large? Bail.
		if (breakpoints.active('>large'))
			return;

		// Deactivate.
		$sidebar.addClass('inactive');

	});

	// Scroll lock.
	// Note: If you do anything to change the height of the sidebar's content, be sure to
	// trigger 'resize.sidebar-lock' on $window so stuff doesn't get out of sync.

	$window.on('load.sidebar-lock', function () {

		var sh, wh, st;

		// Reset scroll position to 0 if it's 1.
		if ($window.scrollTop() == 1)
			$window.scrollTop(0);

		$window
			.on('scroll.sidebar-lock', function () {

				var x, y;

				// <=large? Bail.
				if (breakpoints.active('<=large')) {

					$sidebar_inner
						.data('locked', 0)
						.css('position', '')
						.css('top', '');

					return;

				}

				// Calculate positions.
				x = Math.max(sh - wh, 0);
				y = Math.max(0, $window.scrollTop() - x);

				// Lock/unlock.
				if ($sidebar_inner.data('locked') == 1) {

					if (y <= 0)
						$sidebar_inner
							.data('locked', 0)
							.css('position', '')
							.css('top', '');
					else
						$sidebar_inner
							.css('top', -1 * x);

				}
				else {

					if (y > 0)
						$sidebar_inner
							.data('locked', 1)
							.css('position', 'fixed')
							.css('top', -1 * x);

				}

			})
			.on('resize.sidebar-lock', function () {

				// Calculate heights.
				wh = $window.height();
				sh = $sidebar_inner.outerHeight() + 30;

				// Trigger scroll.
				$window.trigger('scroll.sidebar-lock');

			})
			.trigger('resize.sidebar-lock');

	});

	// Menu.
	var $menu = $('#menu'),
		$menu_openers = $menu.children('ul').find('.opener');

	// Openers.
	$menu_openers.each(function () {

		var $this = $(this);

		$this.on('click', function (event) {

			// Prevent default.
			event.preventDefault();

			// Toggle.
			$menu_openers.not($this).removeClass('active');
			$this.toggleClass('active');

			// Trigger resize (sidebar lock).
			$window.triggerHandler('resize.sidebar-lock');

		});

	});

})(jQuery);


/*=============================  API =====================================*/


// Get the API key from the query string
if (document.querySelector('.add-book') != null)
	document.querySelector('.add-book').addEventListener('click', fetchData)

/*FETCH*/
async function fetchData() {
	//store input book values
	let bookTitleInput = document.querySelector('.book-title').value
	let bookAuthorInput = document.querySelector('.book-author').value

	try {
		let url = `https://openlibrary.org/search.json?title=${bookTitleInput}&author=${bookAuthorInput}`
		let response = await fetch(url)
		let data = await response.json()
		console.log(data)

		//create book obj from returned JSON
		let book = new Book(data.docs[0].title, data.docs[0].author_name[0], data.docs[0].isbn[0])

		//add book to library object
		addBookToLibrary(book)
		
		//display added book below form
		document.querySelector('.display-added-book').innerText = book.displayInfo()

	}
	catch (err) {
		console.log(`error: ${err}`)
	}
}

/*=============================  CLASSES =====================================*/


//BOOK OBJECT
class Book{
	constructor(title, author, isbn) {
		this.title = title;
		this.author = author;
		this.isbn = isbn;
		this.available = true;
	}

	// Getter for availability
	isAvailable() {
		return this.available;
	}

	// Setter for availability
	setAvailability(status) {
		this.available = status;
	}

	// Method to display book information
	displayInfo() {
		console.log(`${this.title} by ${this.author} (ISBN: ${this.isbn})`);
		return(`${this.title} by ${this.author} (ISBN: ${this.isbn})`);
	}
}


//LIBRARY OBJECT
class Library {
	constructor(name, books) {
		this.name = name;
		if (books == null)
			this.books = [];
		else
			this.books = books;
	}

	// Method to add a new book
	addBook(title, author, isbn) {
		const newBook = new Book(title, author, isbn);

		//check if book already is in the library if it is not then add to library
		if ((myLibrary.searchBook(newBook.title.toLowerCase()) === `No books found matching "${newBook.title.toLowerCase()}".`) && 
		(myLibrary.searchBook(newBook.author.toLowerCase()) === `No books found matching "${newBook.author.toLowerCase()}".`)) {
			this.books.push(newBook);
			console.log(`${newBook.title} by ${newBook.author} has been added to ${this.name}.`);
		}


	}

	// Method to remove a book
	removeBook(isbn) {
		this.books = this.books.filter(book => book.isbn !== isbn);
		console.log(`Book with ISBN ${isbn} has been removed from ${this.name}.`);
	}

	// Method to display all available books
	displayAvailableBooks() {
		console.log(`Available books in ${this.name}:`);
		this.books.forEach(book => {
			if (book.isAvailable()) {
				book.displayInfo();
			}
		});
	}

	// Method to search for a book by title or author
	searchBook(query) {
		const results = this.books.filter(book => {
			return book.title.toLowerCase().includes(query.toLowerCase()) ||
				book.author.toLowerCase().includes(query.toLowerCase());
		});

		if (results.length === 0) {
			return (`No books found matching "${query}".`);
			console.log(`No books found matching "${query}".`);
		} else {
			console.log(`Search results for "${query}":`);
			results.forEach(book => book.displayInfo());
		}
	}
}


/*================View Books======================*/



// TESTING

let myLibrary = new Library("My Library", null);

function addBookToLibrary(newBook) {
	myLibrary.addBook(newBook.title, newBook.author, newBook.isbn)
	localStorage.setItem("library", JSON.stringify(myLibrary));
	console.log(myLibrary.books)
}


if (localStorage.getItem('library')) {
	myLibrary = JSON.parse(localStorage.getItem('library'));
	myLibrary = new Library(myLibrary.name, myLibrary.books);
	console.log("local " + myLibrary.books[0].title)
}
else {
	localStorage.setItem("library", JSON.stringify(myLibrary));
}

if (document.querySelector('.books') != null) {
	const divAvailable = document.querySelector('.books')
	const divUnavailable = document.querySelector('.unavailable')

	//Populate books in View Library
	for (let b of myLibrary.books) {
		const art = document.createElement('article');
		const titleHeading = document.createElement('h3');
		const author = document.createElement('p');
		const isbn = document.createElement('p');
		const btnRemove = document.createElement('button');
		const btnMove = document.createElement('button');
		btnRemove.innerText = "REMOVE";
		btnMove.addEventListener('click', availability(b));
		btnRemove.addEventListener('click', removeFunc(b));
		btnMove.classList.add("view-btn");
		btnRemove.classList.add("view-btn");
		titleHeading.innerText = b.title;
		author.innerText = b.author;
		isbn.innerText = b.isbn;
		art.appendChild(titleHeading);
		art.appendChild(author);
		art.appendChild(isbn);
		art.appendChild(btnRemove);
		if (b.available) {
			btnMove.innerText = "MOVE 🡣";
			art.appendChild(btnMove);
			divAvailable.appendChild(art);
		}
		else {
			btnMove.innerText = "MOVE 🡡";
			art.appendChild(btnMove);
			divUnavailable.appendChild(art);
		}

	}
}

if (document.querySelector('.homeView') != null) {
	const homeView = document.querySelector('.homeView')
	for (let b of myLibrary.books) {
		const art = document.createElement('article');
		const titleHeading = document.createElement('h3');
		const author = document.createElement('p');
		const isbn = document.createElement('p');
		titleHeading.innerText = b.title;
		author.innerText = b.author;
		isbn.innerText = b.isbn;
		art.appendChild(titleHeading);
		art.appendChild(author);
		art.appendChild(isbn);
		homeView.appendChild(art);
	}
}

//Move Button
function availability(b) {
	return function () {
		b.available = !b.available;
		localStorage.setItem("library", JSON.stringify(myLibrary));
		location.reload();
		console.log("changed")
	}
}

function removeFunc(b) {
	return function () {
		myLibrary.removeBook(b.isbn);
		localStorage.setItem("library", JSON.stringify(myLibrary));
		location.reload();
		console.log("changed")
	}
}


/*================================================================*/
