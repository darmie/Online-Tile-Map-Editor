(function() {
	var left = (window.innerWidth / 2) - 250;
	var top = (window.innerHeight / 2) - 300;

	// Center canvas before initializing
	$("<style>#container { top: " + top + "px; left: " + left + "px; }</style>").appendTo("head");
})();

window.onload = function() {

	window.onresize = function() {
		var left = (window.innerWidth / 2) - 250;
		var top = (window.innerHeight / 2) - 300;
		$("#container").css("left", left + "px");
		$("#container").css("top", top + "px");
	};

	$("#toolbar > div > h2").collapsible({
		// custom scrollbars fail if closed
		defaultOpen: 'section1,section2,section3',
		cssClose: 'collapsed',
		cssOpen: '',
		speed: 200
	});

	$("#container").on("mousewheel", function(e, delta) {
		var zoom = window.zoom || 1;
		zoom += delta === 1 ? 0.1 : -0.1;
		$("#container").css("-moz-transform", "scale(" + zoom + ")");
		$("#container").css("-webkit-transform", "scale(" + zoom + ")");
		$("#container").css("-ms-transform", "scale(" + zoom + ")");
		$("#container").css("-o-transform", "scale(" + zoom + ")");
		window.zoom = zoom;
	});

	$("#container *").on("dragstart", function(e) { e.preventDefault(); });
	$(':not(input,select,textarea,#container)').disableSelection();


	//include(["js/models.js", "js/views.js", "js/collections.js"], init);
	init();
}

function init() {
	$("#grid").css("width", $("#canvas").css("width"));
	$("#grid").css("height", $("#canvas").css("height"));

	var settings = new Settings;
	var settings_view = new SettingsView({ model: settings });
	//settings.on("error", function(model, error) { console.log(error); });

	var layer_collection = new LayerCollection([
		{ name: "background", active: true, index: 0 },
		{ name: "world", index: 1 }
	]);

	var layer_view = new LayerCollectionView({ collection: layer_collection });

	var tileset_collection = new TilesetCollection([
		//{ src: "img/tilesets/forest_tiles.png", tile_size: [16, 16], alpha: [255, 0, 255] },
		{ src: "img/tilesets/mage_city.png", tile_size: [32, 32] }
	]);

	var tileset_view, canvas, canvas_view;

	// Wait for default tileset to be sliced
	var preload = window.setInterval(function() {
		var ready = false;

		tileset_collection.each(function(tileset) {
			if (!tileset.get("ready")) {
				ready = false;
				return false;
			} else { ready = true; }
		}, tileset_collection);

		if (ready) {

			tileset_view = new TilesetCollectionView({ collection: tileset_collection });

			// Needed to update tile relative
			settings.set("tileset_view", tileset_view);

			canvas = new Canvas({ tileset_view: tileset_view, layer_view: layer_view });
			canvas_view = new CanvasView({ model: canvas });

			window.clearInterval(preload);
		}
	}, 1000);
}