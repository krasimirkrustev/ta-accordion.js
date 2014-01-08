var controls = (function() {
	"use strict";

	var hideNext = function(item) {
		var next = item.nextElementSibling;
		while (next) {
			var sublist = next.querySelector("ul");
			if (sublist) {
				sublist.style.display = "none";
			}
			next = next.nextElementSibling;
		}
	}

	var hidePrev = function(item) {
		var prev = item.previousElementSibling;
		while (prev) {
			var sublist = prev.querySelector("ul");
			if (sublist) {
				sublist.style.display = "none";
			}
			prev = prev.previousElementSibling;
		}
	}

	var Accordion = function(cssSelector) {
		var items = [];
		var accordionHolder = document.querySelector(cssSelector);
		accordionHolder.addEventListener("click", function(ev) {
			if (!ev) {
				ev = window.event;
			}

			ev.stopPropagation();
			ev.preventDefault();

			var clickedItem = ev.target;

			if (!(clickedItem instanceof HTMLAnchorElement)) {
				return;
			}

			hidePrev(clickedItem.parentNode);
			hideNext(clickedItem.parentNode);

			var sublist = clickedItem.nextElementSibling;

			if (!sublist) {
				return;
			}

			if (sublist.style.display === "none") {
				sublist.style.display = "";
			} else {
				sublist.style.display = "none";
			}

		}, false);

		var itemsList = document.createElement("ul");

		this.add = function(title) {
			var newItem = new Item(title);
			items.push(newItem);

			return newItem;
		};

		this.render = function() {

			while (accordionHolder.firstChild) {
				accordionHolder.removeChild(accordionHolder.firstChild);
			}

			while (itemsList.firstChild) {
				itemsList.removeChild(itemsList.firstChild);
			}

			for (var i = 0, len = items.length; i < len; i += 1) {
				var renderedItem = items[i].render();
				itemsList.appendChild(renderedItem);
			}

			accordionHolder.appendChild(itemsList);
			return this;
		};

		this.serialize = function () {
			var serializedItems = [];
			for (var i = 0; i < items.length; i++) {
				serializedItems.push(items[i].serialize());
			}

			return serializedItems;
		}
	}

	var Item = function(title) {
		var items = [];

		this.add = function(title) {
			var newItem = new Item(title);
			items.push(newItem);

			return newItem;
		};

		this.render = function() {
			var itemNode = document.createElement("li");
			var anchor = document.createElement("a");
			anchor.setAttribute("href", "#");
			itemNode.appendChild(anchor);
			anchor.innerHTML = title;

			if (items.length > 0) {
				var sublist = document.createElement("ul");
				sublist.style.display = "none";
				for (var i = 0, len = items.length; i < len; i += 1) {
					var subItem = items[i].render();
					sublist.appendChild(subItem);
				};

				itemNode.appendChild(sublist);
			};

			return itemNode;
		};

		this.serialize = function () {
			var thisItem = {
				title: title
			};

			if (items.length > 0) {
				var serializedItems = [];
				for (var i = 0; i < items.length; i++) {
					var serializedItem = items[i].serialize();
					serializedItems.push(serializedItem);
				}

				thisItem.items = serializedItems;
			}

			return thisItem;
		};
	}

	return {
		getAccordion: function(cssSelector) {
			return new Accordion(cssSelector);
		}
	}
})();