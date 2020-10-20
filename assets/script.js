function formatDate(date) {
	date = new Date(date)
	return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', dayPeriod: 'short' }).format(date)
		+ " on "
		+ date.getDate() + "<sup>" + (date.getDate() > 0 ? ['th', 'st', 'nd', 'rd'][(date.getDate() > 3 && date.getDate() < 21) || date.getDate() % 10 > 3 ? 0 : date.getDate() % 10] : '')
		+ "</sup> "
		+ new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date)
		+ " ("
		+ new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date)
		+ ")"
}

function init(json) {
	visibleDiv()
	var xhttp = new XMLHttpRequest()
	xhttp.onload = function () {
		if (this.readyState == 4 && this.status == 200) {
			let files = JSON.parse(this.responseText)

			// Sorting descending on date
			files.sort(function (a, b) {
				return (new Date(b.date)) - (new Date(a.date))
			})

			addArticles(files)

			setTimeout(function () { document.getElementsByClassName("loading")[0].style.opacity = "0" }, 1000)
			setTimeout(function () { document.getElementsByClassName("loading")[0].remove() }, 2000)
		} else {
			showError(this.status, this.statusText)
		}
	}
	xhttp.onerror = function () {
		showError(this.status, this.statusText)
	}
	xhttp.open("GET", json, true)
	xhttp.send()
}

function addArticles(files) {
	let art, img, div
	files.forEach(article => {
		art = document.createElement("article")
		art.setAttribute("id", "article" + article.id)
		art.setAttribute("data-info", JSON.stringify({ "auth": article.auth, "date": article.date, "tags": article.tags }))

		img = document.createElement("img")
		img.setAttribute("src", "SVGs/" + article.src)
		img.setAttribute("onclick", "openImg(this)")

		a = document.createElement("a")
		a.innerHTML = article.auth

		art.append(img)
		art.append(a)

		document.getElementById("articles").append(art)
	})
}

function showError(statusCode, statusText) {
	document.getElementsByTagName("section")[0].style.opacity = "0"
	setTimeout(function () {
		let temp = "<main>\n\t<h1>ERROR " + statusCode + "</h1>\n\t<p>( " + statusText + " )</p>\n</main>"
		document.getElementsByTagName("body")[0].innerHTML = temp
	}, 1000)
}

window.onscroll = function () { visibleDiv() }

function openImg(img) {
	document.getElementsByTagName('body')[0].style.overflow = "hidden"
	document.getElementsByClassName('maGallery')[0].style.display = "block"

	let obj = JSON.parse(img.parentNode.getAttribute("data-info"))
	document.querySelector(".date").innerHTML = formatDate(obj.date)
	document.querySelector(".auth").innerHTML = obj.auth
	document.querySelector(".image>img").src = img.src

	let tagList = ""
	obj.tags.forEach(tag => {
		tagList += "<span>" + tag + "</span>"
	})
	document.getElementsByClassName('tags')[0].innerHTML = tagList
}

function closeImg(img) {
	img.parentNode.style.display = 'none';
	document.getElementsByTagName('body')[0].style.overflow = 'initial'
}

isInViewport = (faisal, x) => {
	var bounding = faisal.getBoundingClientRect();
	return (bounding.top <= 100 && bounding.bottom > 100)
};

function visibleDiv() {
	let menuItem = document.querySelector("menu").children
	menuItem[0].classList.remove("selected")
	menuItem[1].classList.remove("selected")
	menuItem[2].classList.remove("selected")
	if (isInViewport(document.getElementById('home'))) {
		menuItem[0].classList.add("selected")
	}
	else if (isInViewport(document.getElementById('illustrations'))) {
		menuItem[1].classList.add("selected")
	}
	else if (isInViewport(document.getElementById('contact'))) {
		menuItem[2].classList.add("selected")
	}
}

function toggleMenu() {
	document.querySelector('.smallMenuBars').classList.toggle('open')
	document.querySelector('.smallMenu').classList.toggle('open')
}

window.onload = function () { init("assets/files.json") }
