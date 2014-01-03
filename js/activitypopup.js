

// Popup menu of the activity
enyo.kind({
	name: "Sugar.Desktop.ActivityPopup",
	kind: "enyo.Control",
	classes: "home-activity-popup",
	published: { icon: null, header: null, items: null, footer: null },
	components: [
		{classes: "popup-title", onclick: "runHeaderAction", components: [
			{name: "icon", showing: false, kind: "Sugar.ActivityIcon", x: 5, y: 5, size: constant.iconSizeList},
			{name: "name", classes: "popup-name-text"},
			{name: "title", classes: "popup-title-text"},
		]},
		{name: "items", classes: "popup-items", showing: false, components: [
			{name: "itemslist", kind: "Sugar.Desktop.PopupListView"}
		]},
		{name: "footer", classes: "popup-items", showing: false, components: [
			{name: "footerlist", kind: "Sugar.Desktop.PopupListView"}			
		]}
	],
	
	// Constructor
	create: function() {
		this.inherited(arguments);	
		this.iconChanged();	
		this.headerChanged();
		this.itemsChanged();
		this.footerChanged();
		this.timer = null;
	},
	
	// Property changed
	iconChanged: function() {
		if (this.icon != null) {
			this.applyStyle("margin-left", (app.position.x+constant.popupMarginLeft)+"px");
			this.applyStyle("margin-top", (app.position.y+constant.popupMarginTop)+"px");		
		}
	},
	headerChanged: function() {
		if (this.header != null) {
			this.$.icon.setShowing(this.header.icon != null);
			if (this.header.icon != null) {
				this.$.icon.setActivity(this.header.icon.activity);
				this.$.icon.setColorized(this.header.colorized);
				this.$.icon.render();
			}
			this.$.name.setContent(this.header.name);
			if (this.header.title != null) {
				this.$.name.removeClass("popup-name-text-bottom");
				this.$.title.setContent(this.header.title);
			} else {
				this.$.title.setContent("");
				this.$.name.addClass("popup-name-text-bottom");
			}
		}
	},
	itemsChanged: function() {
		if (this.items != null) {
			this.$.itemslist.setItems(this.items);
		}
	},
	footerChanged: function() {
		if (this.footer != null) {
			this.$.footerlist.setItems(this.footer);
		}
	},
	
	// Control popup visibility
	showPopup: function() {
		this.show();
		this.timer = window.setInterval(enyo.bind(this, "showContent"), constant.timerPopupDuration);
	},
	
	hidePopup: function() {
		this.hide();
		this.$.items.hide();
		this.$.itemslist.setItems(null);
		this.$.footer.hide();
		this.$.footerlist.setItems(null);		
	},
	
	showContent: function() {
		window.clearInterval(this.timer);
		this.timer = null;
		if (this.showing) {
			if (this.items != null && this.items.length > 0)
				this.$.items.show();
			if (this.footer != null && this.footer.length > 0)
				this.$.footer.show();
		}
	},
	
	// Click on the header icon, launch last activity
	runHeaderAction: function() {
		if (this.header.action != null) this.header.action(this.header.data[0], this.header.data[1]);
	},
	
	// Test is cursor is inside the popup
	cursorIsInside: function() {
		var obj = document.getElementById(this.getAttribute("id"));
		var p = {};
		p.x = obj.offsetLeft;
		p.y = obj.offsetTop;
		p.dx = obj.clientWidth;
		p.dy = obj.clientHeight;
		while (obj.offsetParent) {
			p.x = p.x + obj.offsetParent.offsetLeft;
			p.y = p.y + obj.offsetParent.offsetTop;
			if (obj == document.getElementsByTagName("body")[0]) {
				break;
			} else {
				obj = obj.offsetParent;
			}
		}
        var isInside = (
			app.position.x >= p.x && app.position.x <= p.x + p.dx 
			&& app.position.y >= p.y && app.position.y <= p.y + p.dy
		);
		return isInside;
	}
});




// Items popup ListView
enyo.kind({
	name: "Sugar.Desktop.PopupListView",
	kind: "Scroller",
	published: { items: null },
	classes: "popup-item-listview",
	components: [
		{name: "itemList", classes: "item-list", kind: "Repeater", onSetupItem: "setupItem", components: [
			{name: "item", classes: "item-list-item", onclick: "runItemAction", components: [
				{name: "icon", kind: "Sugar.ActivityIcon", x: 5, y: 4, size: constant.iconSizeFavorite},	
				{name: "name", classes: "item-name"}
			]}
		]}
	],
  
	// Constructor: init list
	create: function() {
		this.inherited(arguments);
		this.itemsChanged();
	},
	
	// Items changed
	itemsChanged: function() {
		if (this.items != null)
			this.$.itemList.setCount(this.items.length);
		else
			this.$.itemList.setCount(0);
	},

	// Init setup for a line
	setupItem: function(inSender, inEvent) {
		// Set item in the template
		inEvent.item.$.icon.setActivity(this.items[inEvent.index].icon.activity);
		inEvent.item.$.name.setContent(this.items[inEvent.index].name);		
		inEvent.item.$.icon.setColorized(this.items[inEvent.index].colorized);		
	},
	
	// Run action on item
	runItemAction: function(inSender, inEvent) {
		var action = this.items[inEvent.index].action;
		if (action != null) 
			action.apply(this, this.items[inEvent.index].data);
	}
});