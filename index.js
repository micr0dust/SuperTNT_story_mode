var canvas, stage, exportRoot, anim_container, dom_overlay_container, fnStartAnimation;
//載入
window.onload = function () {
	init();
}
function init() {
	canvas = document.getElementById("canvas");
	anim_container = document.getElementById("animation_container");
	dom_overlay_container = document.getElementById("dom_overlay_container");
	var comp = AdobeAn.getComposition("B3C702FB945454448F8F5D400140133E");
	var lib = comp.getLibrary();
	var loader = new createjs.LoadQueue(false);
	loader.addEventListener("fileload", function (evt) { handleFileLoad(evt, comp) });
	loader.addEventListener("complete", function (evt) { handleComplete(evt, comp) });
	var lib = comp.getLibrary();
	loader.loadManifest(lib.properties.manifest);
}
function handleFileLoad(evt, comp) {
	var images = comp.getImages();
	if (evt && (evt.item.type == "image")) { images[evt.item.id] = evt.result; }
}
function handleComplete(evt, comp) {
	//This function is always called, irrespective of the content. You can use the variable "stage" after it is created in token create_stage.
	var lib = comp.getLibrary();
	var ss = comp.getSpriteSheet();
	var queue = evt.target;
	var ssMetadata = lib.ssMetadata;
	for (i = 0; i < ssMetadata.length; i++) {
		ss[ssMetadata[i].name] = new createjs.SpriteSheet({ "images": [queue.getResult(ssMetadata[i].name)], "frames": ssMetadata[i].frames })
	}
	exportRoot = new lib.story();
	stage = new lib.Stage(canvas);

	const STEP = 50;
	let canplay = false;
	let step = 1;
	let isKeyDown = false;
	let blocks = [1213];
	let layer1 = [1213];
	let layer2 = [1213];
	let bg1 = [];
	let bg2 = [];
	let events = [101213];
	let block = [];
	let map = 1;
	let chats = 0;
	let chatbar_status = true;
	let speaking = true;
	let speaker = "自己";
	let line_1, line_2, line_3;
	let location;
	let nowblock;

	let chatbar = new lib.chat_bar();
	summon(chatbar, 0, 430, "visible", false);

	let pic = new lib.blocks();
	pic.scaleX = 2.6;
	pic.scaleY = 2.6;
	summon(pic, 75, 515, "air", true);

	let speakers = new createjs.Text("<" + speaker + ">", "bold 20px Arial", "white");
	speakers.textBaseline = "alphabetic";
	summon(speakers, 150, 465, 0, false);

	let line1 = new createjs.Text(line_1, "bold 20px Arial", "white");
	line1.textBaseline = "alphabetic";
	summon(line1, 150, 500, 0, false);

	let line2 = new createjs.Text(line_2, "bold 20px Arial", "white");
	line2.textBaseline = "alphabetic";
	summon(line2, 150, 525, 0, false);

	let line3 = new createjs.Text(line_3, "bold 20px Arial", "white");
	line3.textBaseline = "alphabetic";
	summon(line3, 150, 550, 0, false);

	//Player1
	let direction = "down";
	let p1die = false;
	let udlr = true;
	var robot = new lib.roboter();
	var player1_x = 6;
	var player1_y = 5;
	summon(robot, player1_x * 50 - 25, player1_y * 50 - 25, direction, true);

	//monster
	var monster = new lib.blocks();
	summon(monster, -100, 150, "monster", true);

	var hitArea = new createjs.Shape();
	hitArea.graphics.beginFill("#000").drawRect(0, 0, 50, 50);//items

	//items
	var library_key = new lib.item();
	item_summon(library_key, 1, 1, "key", true);
	library_key.addEventListener('click', function () { itemTxt("library_key","key") });
	var cd = new lib.item();
	item_summon(cd, 2, 1, "cd", false);
	cd.addEventListener('click', function () { itemTxt("cd","cd") });
	var paper1 = new lib.item();
	item_summon(paper1, 3, 1, "paper", false);
	paper1.addEventListener('click', function () { itemTxt("paper1","paper") });
	var paper2 = new lib.item();
	item_summon(paper2, 4, 1, "paper", false);
	paper2.addEventListener('click', function () { itemTxt("paper2","paper") });
	var paper3 = new lib.item();
	item_summon(paper3, 1, 2, "paper", false);
	paper3.addEventListener('click', function () { itemTxt("paper3","paper") });

	var knife = new lib.item();
	item_summon(knife, 1, 6, "knife", false);
	knife.addEventListener('click', function () { itemTxt("knife","knife") });
	var jimmy_bar = new lib.item();
	item_summon(jimmy_bar, 2, 6, "jimmy_bar", false);
	jimmy_bar.addEventListener('click', function () { itemTxt("jimmy_bar","jimmy_bar") });

	//events
	let cd_played = false;

	var title = new createjs.Text("鎮長辦公室", "bold 43px Arial", "white");
	title.x = 614;
	title.y = 60;
	title.textBaseline = "alphabetic";
	exportRoot.addChild(title);

	for (var i = 0; i < 13; i++) {
		for (var j = 0; j < 13; j++) {
			bg1[i * 100 + j] = new lib.blocks();
			summon(bg1[i * 100 + j], i * 50 - 25, j * 50 - 25, bg1[i * 100 + j], true);
			bg2[i * 100 + j] = new lib.blocks();
			summon(bg2[i * 100 + j], i * 50 - 25, j * 50 - 25, bg2[i * 100 + j], true);
			block[i * 100 + j] = new lib.blocks();
			summon(block[i * 100 + j], i * 50 - 25, j * 50 - 25, block[i * 100 + j], true);
		}
	}

	mapChangeFn();


	document.querySelector(".gamePlayBtn").addEventListener("click", () => {
		window.addEventListener("keydown", keydownMoveFn)
		window.addEventListener("keyup", keyupMoveFn)

		document.querySelector(".gamePlayBtn").style.display = 'none';
		document.querySelector(".left1").addEventListener("touchstart", function () { touchdownMove(37) })
		document.querySelector(".up1").addEventListener("touchstart", function () { touchdownMove(38) })
		document.querySelector(".right1").addEventListener("touchstart", function () { touchdownMove(39) })
		document.querySelector(".down1").addEventListener("touchstart", function () { touchdownMove(40) })
		canplay = true;
	})

	function mapChoose() {
		if (map === 1) {
			blocks[101] = "stone_bricks"; blocks[102] = "mossy_stone_bricks"; blocks[103] = "mossy_stone_bricks"; blocks[104] = "stone_bricks"; blocks[105] = "cracked_stone_bricks"; blocks[106] = "stone_bricks"; blocks[107] = "cracked_stone_bricks"; blocks[108] = "stone_bricks"; blocks[109] = "stone_bricks"; blocks[110] = "stone_bricks"; blocks[111] = "mossy_stone_bricks"; blocks[112] = "mossy_stone_bricks"; blocks[201] = "stone_bricks"; blocks[202] = "bookshelf"; blocks[203] = "glowstone"; blocks[211] = "glowstone"; blocks[212] = "mossy_stone_bricks"; blocks[301] = "cracked_stone_bricks"; blocks[302] = "bookshelf"; blocks[312] = "stone_bricks"; blocks[401] = "cracked_stone_bricks"; blocks[402] = "bookshelf"; blocks[407] = "composter"; blocks[408] = "composter"; blocks[409] = "composter"; blocks[412] = "stone_bricks"; blocks[501] = "stone_bricks"; blocks[502] = "bookshelf"; blocks[507] = "crafting_table_top"; blocks[512] = "stone_bricks"; blocks[602] = "oak_door"; blocks[607] = "enchanting_table"; blocks[612] = "cracked_stone_bricks"; blocks[701] = "cracked_stone_bricks"; blocks[702] = "bookshelf"; blocks[707] = "cartography_table"; blocks[712] = "cracked_stone_bricks"; blocks[801] = "stone_bricks"; blocks[802] = "bookshelf"; blocks[807] = "composter"; blocks[808] = "composter"; blocks[809] = "composter"; blocks[812] = "stone_bricks"; blocks[901] = "stone_bricks"; blocks[902] = "bookshelf"; blocks[912] = "mossy_stone_bricks"; blocks[1001] = "stone_bricks"; blocks[1002] = "bookshelf"; blocks[1003] = "glowstone"; blocks[1011] = "glowstone"; blocks[1012] = "mossy_stone_bricks"; blocks[1101] = "mossy_stone_bricks"; blocks[1102] = "bookshelf"; blocks[1103] = "cauldron"; blocks[1104] = "jukebox"; blocks[1105] = "smithing_table"; blocks[1106] = "fletching_table"; blocks[1107] = "brewing_stand"; blocks[1108] = "brewing_stand"; blocks[1109] = "blast_furnace"; blocks[1110] = "smoker"; blocks[1111] = "redstone_block"; blocks[1112] = "stone_bricks"; blocks[1201] = "mossy_stone_bricks"; blocks[1202] = "mossy_stone_bricks"; blocks[1203] = "stone_bricks"; blocks[1204] = "cracked_stone_bricks"; blocks[1205] = "stone_bricks"; blocks[1206] = "mossy_stone_bricks"; blocks[1207] = "mossy_stone_bricks"; blocks[1208] = "mossy_stone_bricks"; blocks[1209] = "mossy_stone_bricks"; blocks[1210] = "stone_bricks"; blocks[1211] = "stone_bricks"; blocks[1212] = "cracked_stone_bricks";
			floor("oak_planks");
			layer2[601] = "podzol"; layer2[602] = "podzol";
			blocks[609] = "cheif";
			events[609] = { "event": "cheif" };
			events[602] = { "map": 2, "x": 6, "y": 13 };
			if (cd.visible) events[1104] = { "event": "cd_played" };
		} else if (map === 2) {
			blocks[101] = "soul_sand"; blocks[102] = "soul_sand"; blocks[103] = "dark_prismarine"; blocks[104] = "dark_prismarine"; blocks[107] = "dark_prismarine"; blocks[108] = "soul_sand"; blocks[109] = "soul_sand"; blocks[110] = "soul_sand"; blocks[111] = "soul_sand"; blocks[112] = "soul_sand"; blocks[201] = "soul_sand"; blocks[202] = "soul_sand"; blocks[203] = "dark_prismarine"; blocks[207] = "dark_prismarine"; blocks[208] = "soul_sand"; blocks[209] = "soul_sand"; blocks[210] = "soul_sand"; blocks[211] = "soul_sand"; blocks[212] = "soul_sand"; blocks[301] = "soul_sand"; blocks[302] = "dark_prismarine"; blocks[307] = "dark_prismarine"; blocks[308] = "soul_sand"; blocks[309] = "soul_sand"; blocks[310] = "soul_sand"; blocks[311] = "soul_sand"; blocks[312] = "soul_sand"; blocks[401] = "dark_prismarine"; blocks[406] = "dark_prismarine"; blocks[407] = "soul_sand"; blocks[408] = "soul_sand"; blocks[409] = "soul_sand"; blocks[410] = "soul_sand"; blocks[411] = "soul_sand"; blocks[412] = "soul_sand"; blocks[501] = "dark_prismarine"; blocks[505] = "dark_prismarine"; blocks[506] = "soul_sand"; blocks[507] = "soul_sand"; blocks[508] = "soul_sand"; blocks[509] = "soul_sand"; blocks[510] = "dark_prismarine"; blocks[511] = "dark_prismarine"; blocks[512] = "dark_prismarine"; blocks[601] = "dark_prismarine"; blocks[605] = "dark_prismarine"; blocks[606] = "soul_sand"; blocks[607] = "soul_sand"; blocks[608] = "soul_sand"; blocks[609] = "dark_prismarine"; blocks[701] = "soul_sand"; blocks[702] = "dark_prismarine"; blocks[706] = "dark_prismarine"; blocks[707] = "soul_sand"; blocks[708] = "dark_prismarine"; blocks[712] = "dark_prismarine"; blocks[801] = "soul_sand"; blocks[802] = "dark_prismarine"; blocks[807] = "dark_prismarine"; blocks[811] = "dark_prismarine"; blocks[812] = "soul_sand"; blocks[901] = "soul_sand"; blocks[902] = "soul_sand"; blocks[903] = "dark_prismarine"; blocks[909] = "dark_prismarine"; blocks[910] = "dark_prismarine"; blocks[911] = "soul_sand"; blocks[912] = "soul_sand"; blocks[1001] = "soul_sand"; blocks[1002] = "soul_sand"; blocks[1003] = "soul_sand"; blocks[1004] = "dark_prismarine"; blocks[1008] = "dark_prismarine"; blocks[1009] = "soul_sand"; blocks[1010] = "soul_sand"; blocks[1011] = "soul_sand"; blocks[1012] = "soul_sand"; blocks[1101] = "soul_sand"; blocks[1102] = "soul_sand"; blocks[1103] = "soul_sand"; blocks[1104] = "soul_sand"; blocks[1105] = "dark_prismarine"; blocks[1106] = "dark_prismarine"; blocks[1107] = "dark_prismarine"; blocks[1108] = "soul_sand"; blocks[1109] = "soul_sand"; blocks[1110] = "soul_sand"; blocks[1111] = "soul_sand"; blocks[1112] = "soul_sand"; blocks[1201] = "soul_sand"; blocks[1202] = "soul_sand"; blocks[1203] = "soul_sand"; blocks[1204] = "soul_sand"; blocks[1205] = "soul_sand"; blocks[1206] = "soul_sand"; blocks[1207] = "soul_sand"; blocks[1208] = "soul_sand"; blocks[1209] = "soul_sand"; blocks[1210] = "soul_sand"; blocks[1211] = "soul_sand"; blocks[1212] = "soul_sand";
			floor("podzol");
			events[613] = { "map": 1, "x": 6, "y": 3 };
			events[5] = { "map": 3, "x": 13, "y": 5 };
			events[6] = { "map": 3, "x": 13, "y": 6 };
		} else if (map === 3) {
			blocks[101] = "dark_prismarine"; blocks[105] = "dark_prismarine"; blocks[106] = "soul_sand"; blocks[107] = "soul_sand"; blocks[108] = "soul_sand"; blocks[109] = "soul_sand"; blocks[110] = "dark_prismarine"; blocks[201] = "soul_sand"; blocks[202] = "dark_prismarine"; blocks[205] = "dark_prismarine"; blocks[206] = "soul_sand"; blocks[207] = "soul_sand"; blocks[208] = "soul_sand"; blocks[209] = "dark_prismarine"; blocks[301] = "soul_sand"; blocks[302] = "dark_prismarine"; blocks[305] = "dark_prismarine"; blocks[306] = "soul_sand"; blocks[307] = "soul_sand"; blocks[308] = "dark_prismarine"; blocks[312] = "dark_prismarine"; blocks[401] = "soul_sand"; blocks[402] = "dark_prismarine"; blocks[406] = "dark_prismarine"; blocks[407] = "dark_prismarine"; blocks[411] = "dark_prismarine"; blocks[412] = "soul_sand"; blocks[501] = "soul_sand"; blocks[502] = "dark_prismarine"; blocks[506] = "dark_prismarine"; blocks[510] = "dark_prismarine"; blocks[511] = "soul_sand"; blocks[512] = "soul_sand"; blocks[601] = "soul_sand"; blocks[602] = "soul_sand"; blocks[603] = "dark_prismarine"; blocks[609] = "dark_prismarine"; blocks[610] = "soul_sand"; blocks[611] = "soul_sand"; blocks[612] = "soul_sand"; blocks[701] = "soul_sand"; blocks[702] = "soul_sand"; blocks[703] = "dark_prismarine"; blocks[708] = "dark_prismarine"; blocks[709] = "soul_sand"; blocks[710] = "soul_sand"; blocks[711] = "soul_sand"; blocks[712] = "soul_sand"; blocks[801] = "soul_sand"; blocks[802] = "soul_sand"; blocks[803] = "dark_prismarine"; blocks[807] = "dark_prismarine"; blocks[808] = "soul_sand"; blocks[809] = "soul_sand"; blocks[810] = "soul_sand"; blocks[811] = "soul_sand"; blocks[812] = "soul_sand"; blocks[901] = "soul_sand"; blocks[902] = "soul_sand"; blocks[903] = "soul_sand"; blocks[904] = "dark_prismarine"; blocks[907] = "dark_prismarine"; blocks[908] = "soul_sand"; blocks[909] = "soul_sand"; blocks[910] = "soul_sand"; blocks[911] = "soul_sand"; blocks[912] = "soul_sand"; blocks[1001] = "soul_sand"; blocks[1002] = "soul_sand"; blocks[1003] = "soul_sand"; blocks[1004] = "dark_prismarine"; blocks[1007] = "dark_prismarine"; blocks[1008] = "soul_sand"; blocks[1009] = "soul_sand"; blocks[1010] = "soul_sand"; blocks[1011] = "soul_sand"; blocks[1012] = "soul_sand"; blocks[1101] = "soul_sand"; blocks[1102] = "soul_sand"; blocks[1103] = "soul_sand"; blocks[1104] = "dark_prismarine"; blocks[1107] = "dark_prismarine"; blocks[1108] = "soul_sand"; blocks[1109] = "soul_sand"; blocks[1110] = "soul_sand"; blocks[1111] = "soul_sand"; blocks[1112] = "soul_sand"; blocks[1201] = "soul_sand"; blocks[1202] = "soul_sand"; blocks[1203] = "soul_sand"; blocks[1204] = "dark_prismarine"; blocks[1207] = "dark_prismarine"; blocks[1208] = "soul_sand"; blocks[1209] = "soul_sand"; blocks[1210] = "soul_sand"; blocks[1211] = "soul_sand"; blocks[1212] = "soul_sand";
			floor("podzol");
			events[1305] = { "map": 2, "x": 1, "y": 5 };
			events[1306] = { "map": 2, "x": 1, "y": 6 };
			events[11] = { "map": 11, "x": 13, "y": 2 };
			events[12] = { "map": 11, "x": 13, "y": 3 };
			events[2] = { "map": 4, "x": 13, "y": 2 };
			events[3] = { "map": 4, "x": 13, "y": 3 };
			events[4] = { "map": 4, "x": 13, "y": 4 };
			if (!cd_played) {
				blocks[606] = "dark_prismarine"; blocks[706] = "dark_prismarine"; blocks[407] = "soul_sand"; blocks[507] = "soul_sand"; blocks[607] = "soul_sand"; blocks[707] = "soul_sand"; blocks[408] = "soul_sand"; blocks[508] = "soul_sand"; blocks[608] = "soul_sand";
			}
		} else if (map === 4) {
			blocks[101] = "cobweb"; blocks[102] = "spruce_planks"; blocks[103] = "spruce_planks"; blocks[104] = "spruce_planks"; blocks[105] = "spruce_planks"; blocks[106] = "spruce_planks"; blocks[107] = "spruce_planks"; blocks[108] = "spruce_planks"; blocks[109] = "ladder"; blocks[110] = "ladder"; blocks[112] = "cobweb"; blocks[202] = "spruce_planks"; blocks[203] = "spruce_planks"; blocks[204] = "spruce_planks"; blocks[205] = "spruce_planks"; blocks[206] = "spruce_planks"; blocks[207] = "spruce_planks"; blocks[208] = "spruce_planks"; blocks[209] = "dark_oak_planks"; blocks[210] = "dark_oak_planks"; blocks[301] = "cobweb"; blocks[302] = "spruce_planks"; blocks[303] = "spruce_planks"; blocks[304] = "spruce_planks"; blocks[305] = "spruce_planks"; blocks[306] = "spruce_planks"; blocks[307] = "spruce_planks"; blocks[308] = "spruce_planks"; blocks[309] = "dark_oak_planks"; blocks[310] = "dark_oak_planks"; blocks[312] = "cobweb"; blocks[402] = "spruce_planks"; blocks[403] = "spruce_planks"; blocks[404] = "spruce_planks"; blocks[405] = "spruce_planks"; blocks[406] = "spruce_planks"; blocks[407] = "spruce_planks"; blocks[408] = "spruce_planks"; blocks[409] = "dark_oak_planks"; blocks[410] = "dark_oak_planks"; blocks[502] = "spruce_planks"; blocks[503] = "spruce_planks"; blocks[504] = "spruce_planks"; blocks[505] = "spruce_planks"; blocks[506] = "spruce_planks"; blocks[507] = "spruce_planks"; blocks[508] = "spruce_planks"; blocks[509] = "dark_oak_planks"; blocks[510] = "dark_oak_planks"; blocks[511] = "cobweb"; blocks[602] = "spruce_planks"; blocks[603] = "spruce_planks"; blocks[604] = "oak_door"; blocks[605] = "spruce_planks"; blocks[606] = "spruce_planks"; blocks[607] = "spruce_planks"; blocks[608] = "spruce_planks"; blocks[609] = "dark_oak_planks"; blocks[610] = "dark_oak_planks"; blocks[706] = "cobweb"; blocks[707] = "cobweb"; blocks[709] = "cobweb"; blocks[811] = "cobweb"; blocks[812] = "dark_prismarine"; blocks[901] = "cobweb"; blocks[903] = "cobweb"; blocks[908] = "cobweb"; blocks[911] = "dark_prismarine"; blocks[912] = "soul_sand"; blocks[1001] = "dark_prismarine"; blocks[1002] = "iron_bars"; blocks[1006] = "dark_prismarine"; blocks[1007] = "dark_prismarine"; blocks[1008] = "dark_prismarine"; blocks[1009] = "dark_prismarine"; blocks[1010] = "dark_prismarine"; blocks[1011] = "soul_sand"; blocks[1012] = "soul_sand"; blocks[1101] = "dark_prismarine"; blocks[1104] = "iron_bars"; blocks[1105] = "dark_prismarine"; blocks[1106] = "soul_sand"; blocks[1107] = "soul_sand"; blocks[1108] = "soul_sand"; blocks[1109] = "soul_sand"; blocks[1110] = "soul_sand"; blocks[1111] = "soul_sand"; blocks[1112] = "soul_sand"; blocks[1201] = "dark_prismarine"; blocks[1205] = "dark_prismarine"; blocks[1206] = "soul_sand"; blocks[1207] = "soul_sand"; blocks[1208] = "soul_sand"; blocks[1209] = "soul_sand"; blocks[1210] = "soul_sand"; blocks[1211] = "soul_sand"; blocks[1212] = "soul_sand";
			floor("podzol");
			layer2[109] = "dark_oak_planks"; layer2[110] = "dark_oak_planks";
			events[1302] = { "map": 3, "x": 1, "y": 2 };
			events[1303] = { "map": 3, "x": 1, "y": 3 };
			events[1304] = { "map": 3, "x": 1, "y": 4 };
			events[604] = { "map": 5, "x": 11, "y": 7 };
		} else if (map === 5) {
			blocks[101] = "spruce_planks"; blocks[102] = "spruce_planks"; blocks[103] = "spruce_planks"; blocks[104] = "spruce_planks"; blocks[105] = "spruce_planks"; blocks[106] = "spruce_planks"; blocks[107] = "oak_door"; blocks[108] = "spruce_planks"; blocks[109] = "spruce_planks"; blocks[110] = "frosted_ice"; blocks[111] = "frosted_ice"; blocks[112] = "spruce_planks"; blocks[201] = "bookshelf"; blocks[202] = "beehive"; blocks[204] = "cartography_table"; blocks[205] = "spruce_planks"; blocks[206] = "spruce_planks"; blocks[208] = "spruce_planks"; blocks[209] = "spruce_planks"; blocks[210] = "cauldron"; blocks[211] = "cauldron"; blocks[212] = "spruce_planks"; blocks[301] = "bookshelf"; blocks[302] = "beehive"; blocks[304] = "scaffolding"; blocks[305] = "spruce_planks"; blocks[306] = "spruce_planks"; blocks[308] = "spruce_planks"; blocks[309] = "spruce_planks"; blocks[312] = "spruce_planks"; blocks[401] = "bookshelf"; blocks[402] = "beehive"; blocks[406] = "dark_oak_door"; blocks[408] = "dark_oak_door"; blocks[412] = "spruce_planks"; blocks[501] = "bookshelf"; blocks[502] = "loom"; blocks[504] = "brewing_stand"; blocks[505] = "spruce_planks"; blocks[506] = "spruce_planks"; blocks[508] = "spruce_planks"; blocks[509] = "spruce_planks"; blocks[510] = "acacia_door"; blocks[511] = "acacia_door"; blocks[512] = "spruce_planks"; blocks[601] = "spruce_planks"; blocks[602] = "spruce_planks"; blocks[603] = "spruce_planks"; blocks[604] = "spruce_planks"; blocks[605] = "spruce_planks"; blocks[606] = "spruce_planks"; blocks[608] = "spruce_planks"; blocks[609] = "spruce_planks"; blocks[610] = "barrel"; blocks[611] = "barrel_open"; blocks[612] = "spruce_planks"; blocks[701] = "spruce_planks"; blocks[702] = "spruce_planks"; blocks[703] = "spruce_planks"; blocks[704] = "spruce_planks"; blocks[705] = "spruce_planks"; blocks[706] = "spruce_planks"; blocks[708] = "spruce_planks"; blocks[709] = "spruce_planks"; blocks[710] = "ice"; blocks[711] = "frosted_ice"; blocks[712] = "spruce_planks"; blocks[801] = "bookshelf"; blocks[802] = "bookshelf"; blocks[803] = "bookshelf"; blocks[804] = "bookshelf"; blocks[805] = "spruce_planks"; blocks[806] = "spruce_planks"; blocks[808] = "spruce_planks"; blocks[809] = "spruce_planks"; blocks[810] = "cauldron"; blocks[811] = "cauldron"; blocks[812] = "spruce_planks"; blocks[901] = "bookshelf"; blocks[905] = "spruce_planks"; blocks[906] = "spruce_planks"; blocks[908] = "spruce_planks"; blocks[909] = "spruce_planks"; blocks[912] = "spruce_planks"; blocks[1001] = "bookshelf"; blocks[1003] = "enchanting_table"; blocks[1006] = "dark_oak_door"; blocks[1008] = "dark_oak_door"; blocks[1012] = "spruce_planks"; blocks[1101] = "bookshelf"; blocks[1105] = "spruce_planks"; blocks[1106] = "spruce_planks"; blocks[1108] = "spruce_planks"; blocks[1109] = "spruce_planks"; blocks[1110] = "acacia_door"; blocks[1111] = "acacia_door"; blocks[1112] = "spruce_planks"; blocks[1201] = "spruce_planks"; blocks[1202] = "spruce_planks"; blocks[1203] = "spruce_planks"; blocks[1204] = "spruce_planks"; blocks[1205] = "spruce_planks"; blocks[1206] = "spruce_planks"; blocks[1207] = "oak_door"; blocks[1208] = "spruce_planks"; blocks[1209] = "spruce_planks"; blocks[1210] = "barrel"; blocks[1211] = "barrel"; blocks[1212] = "spruce_planks";
			floor("oak_planks");
			layer2[107] = "black_wool"; layer2[409] = "pink_wool"; layer2[510] = "pink_wool"; layer2[511] = "pink_wool"; layer2[1009] = "light_blue_wool"; layer2[1110] = "light_blue_wool"; layer2[1111] = "light_blue_wool";
			events[1207] = { "map": 4, "x": 7, "y": 4 };
			events[107] = { "map": 6, "x": 11, "y": 7 };
			if (!paper1.visible) events[402] = { "item": paper1, "itemName": "paper1" };
		} else if (map === 6) {
			blocks[101] = "spruce_planks"; blocks[102] = "spruce_planks"; blocks[103] = "spruce_planks"; blocks[104] = "spruce_planks"; blocks[105] = "spruce_planks"; blocks[106] = "spruce_planks"; blocks[108] = "spruce_planks"; blocks[109] = "spruce_planks"; blocks[110] = "spruce_planks"; blocks[111] = "spruce_planks"; blocks[112] = "spruce_planks"; blocks[201] = "ladder"; blocks[202] = "ladder"; blocks[210] = "bookshelf"; blocks[211] = "spruce_planks"; blocks[212] = "spruce_planks"; blocks[301] = "spruce_planks"; blocks[302] = "bookshelf"; blocks[304] = "bookshelf"; blocks[306] = "bookshelf"; blocks[308] = "bookshelf"; blocks[310] = "bookshelf"; blocks[311] = "spruce_planks"; blocks[312] = "spruce_planks"; blocks[401] = "spruce_planks"; blocks[402] = "bookshelf"; blocks[404] = "bookshelf"; blocks[406] = "bookshelf"; blocks[408] = "bookshelf"; blocks[410] = "bookshelf"; blocks[411] = "spruce_planks"; blocks[412] = "spruce_planks"; blocks[501] = "spruce_planks"; blocks[502] = "bookshelf"; blocks[504] = "bookshelf"; blocks[506] = "bookshelf"; blocks[508] = "bookshelf"; blocks[510] = "bookshelf"; blocks[511] = "spruce_planks"; blocks[512] = "spruce_planks"; blocks[601] = "spruce_planks"; blocks[602] = "bookshelf"; blocks[604] = "bookshelf"; blocks[606] = "bookshelf"; blocks[608] = "bookshelf"; blocks[610] = "bookshelf"; blocks[611] = "spruce_planks"; blocks[612] = "spruce_planks"; blocks[701] = "spruce_planks"; blocks[702] = "bookshelf"; blocks[704] = "bookshelf"; blocks[706] = "bookshelf"; blocks[708] = "bookshelf"; blocks[710] = "bookshelf"; blocks[711] = "spruce_planks"; blocks[712] = "spruce_planks"; blocks[801] = "spruce_planks"; blocks[802] = "bookshelf"; blocks[804] = "bookshelf"; blocks[806] = "bookshelf"; blocks[808] = "bookshelf"; blocks[810] = "bookshelf"; blocks[811] = "spruce_planks"; blocks[812] = "spruce_planks"; blocks[901] = "spruce_planks"; blocks[902] = "bookshelf"; blocks[904] = "bookshelf"; blocks[906] = "bookshelf"; blocks[908] = "bookshelf"; blocks[910] = "bookshelf"; blocks[911] = "spruce_planks"; blocks[912] = "spruce_planks"; blocks[1001] = "spruce_planks"; blocks[1002] = "bookshelf"; blocks[1004] = "bookshelf"; blocks[1006] = "bookshelf"; blocks[1008] = "bookshelf"; blocks[1010] = "bookshelf"; blocks[1011] = "spruce_planks"; blocks[1012] = "spruce_planks"; blocks[1101] = "spruce_planks"; blocks[1102] = "bookshelf"; blocks[1110] = "bookshelf"; blocks[1111] = "spruce_planks"; blocks[1112] = "spruce_planks"; blocks[1201] = "spruce_planks"; blocks[1202] = "spruce_planks"; blocks[1203] = "spruce_planks"; blocks[1204] = "spruce_planks"; blocks[1205] = "spruce_planks"; blocks[1206] = "spruce_planks"; blocks[1207] = "oak_door"; blocks[1208] = "spruce_planks"; blocks[1209] = "spruce_planks"; blocks[1210] = "spruce_planks"; blocks[1211] = "spruce_planks"; blocks[1212] = "spruce_planks";
			if (!cd.visible) blocks[107] = "iron_door";
			if (cd.visible) blocks[107] = "spruce_planks";
			floor("oak_planks");
			layer2[107] = "black_wool"; layer2[201] = "spruce_planks"; layer2[202] = "bookshelf"; layer2[206] = "cobweb"; layer2[211] = "cobweb"; layer2[303] = "cobweb"; layer2[305] = "cobweb"; layer2[309] = "cobweb"; layer2[603] = "cobweb"; layer2[607] = "cobweb"; layer2[703] = "cobweb"; layer2[705] = "cobweb"; layer2[809] = "cobweb"; layer2[811] = "cobweb"; layer2[911] = "cobweb"; layer2[1009] = "cobweb"; layer2[1011] = "cobweb"; layer2[1103] = "cobweb"; layer2[1110] = "cobweb"; layer2[1111] = "cobweb";
			events[1207] = { "map": 5, "x": 2, "y": 7 };
			events[202] = { "map": 7, "x": 2, "y": 3, "way": "down" };
			if (library_key.visible) events[107] = { "map": 8, "x": 12, "y": 6 };
		} else if (map === 7) {
			blocks[101] = "bookshelf"; blocks[102] = "bookshelf"; blocks[103] = "bookshelf"; blocks[104] = "bookshelf"; blocks[105] = "bookshelf"; blocks[106] = "bookshelf"; blocks[107] = "bookshelf"; blocks[108] = "bookshelf"; blocks[109] = "bookshelf"; blocks[110] = "bookshelf"; blocks[111] = "bookshelf"; blocks[112] = "bookshelf"; blocks[201] = "ladder"; blocks[212] = "bookshelf"; blocks[301] = "bookshelf"; blocks[303] = "piston"; blocks[304] = "piston"; blocks[305] = "piston"; blocks[306] = "piston"; blocks[307] = "piston"; blocks[308] = "piston"; blocks[309] = "piston"; blocks[310] = "piston"; blocks[312] = "bookshelf"; blocks[401] = "bookshelf"; blocks[403] = "piston"; blocks[404] = "bookshelf"; blocks[406] = "bookshelf"; blocks[408] = "bookshelf"; blocks[410] = "piston"; blocks[412] = "bookshelf"; blocks[501] = "bookshelf"; blocks[503] = "piston"; blocks[504] = "bookshelf"; blocks[506] = "bookshelf"; blocks[508] = "bookshelf"; blocks[510] = "piston"; blocks[512] = "bookshelf"; blocks[601] = "bookshelf"; blocks[603] = "piston"; blocks[604] = "bookshelf"; blocks[606] = "bookshelf"; blocks[607] = "cobweb"; blocks[608] = "bookshelf"; blocks[610] = "piston"; blocks[612] = "bookshelf"; blocks[701] = "bookshelf"; blocks[703] = "piston"; blocks[704] = "bookshelf"; blocks[705] = "cobweb"; blocks[706] = "bookshelf"; blocks[708] = "bookshelf"; blocks[710] = "piston"; blocks[712] = "bookshelf"; blocks[801] = "bookshelf"; blocks[803] = "piston"; blocks[804] = "bookshelf"; blocks[806] = "bookshelf"; blocks[808] = "bookshelf"; blocks[809] = "cobweb"; blocks[810] = "piston"; blocks[812] = "bookshelf"; blocks[901] = "bookshelf"; blocks[903] = "piston"; blocks[904] = "bookshelf"; blocks[906] = "bookshelf"; blocks[908] = "bookshelf"; blocks[910] = "piston"; blocks[912] = "bookshelf"; blocks[1001] = "bookshelf"; blocks[1003] = "piston"; blocks[1004] = "piston"; blocks[1005] = "piston"; blocks[1006] = "piston"; blocks[1007] = "piston"; blocks[1008] = "piston"; blocks[1009] = "piston"; blocks[1010] = "piston"; blocks[1012] = "bookshelf"; blocks[1101] = "bookshelf"; blocks[1112] = "bookshelf"; blocks[1201] = "bookshelf"; blocks[1202] = "bookshelf"; blocks[1203] = "bookshelf"; blocks[1204] = "bookshelf"; blocks[1205] = "bookshelf"; blocks[1206] = "enchanting_table"; blocks[1207] = "bookshelf"; blocks[1208] = "bookshelf"; blocks[1209] = "bookshelf"; blocks[1210] = "bookshelf"; blocks[1211] = "bookshelf"; blocks[1212] = "bookshelf";
			floor("oak_planks");
			layer2[201] = "spruce_planks"; layer2[405] = "spruce_planks"; layer2[407] = "spruce_planks"; layer2[409] = "spruce_planks"; layer2[505] = "spruce_planks"; layer2[507] = "spruce_planks"; layer2[509] = "spruce_planks"; layer2[605] = "spruce_planks"; layer2[607] = "spruce_planks"; layer2[609] = "spruce_planks"; layer2[705] = "spruce_planks"; layer2[707] = "spruce_planks"; layer2[709] = "spruce_planks"; layer2[805] = "spruce_planks"; layer2[807] = "spruce_planks"; layer2[809] = "spruce_planks"; layer2[905] = "spruce_planks"; layer2[907] = "spruce_planks"; layer2[909] = "spruce_planks";
			events[201] = { "map": 6, "x": 2, "y": 3, "way": "down" };
			if (!library_key.visible) events[1206] = { "item": library_key, "itemName": "library_key" };
		} else if (map === 8) {
			blocks[103] = "nether_bricks"; blocks[104] = "nether_bricks"; blocks[105] = "spawner"; blocks[107] = "spawner"; blocks[108] = "nether_bricks"; blocks[109] = "nether_bricks"; blocks[203] = "nether_bricks"; blocks[204] = "nether_bricks"; blocks[205] = "spawner"; blocks[207] = "spawner"; blocks[208] = "nether_bricks"; blocks[209] = "nether_bricks"; blocks[303] = "nether_bricks"; blocks[304] = "nether_bricks"; blocks[305] = "spawner"; blocks[307] = "spawner"; blocks[308] = "nether_bricks"; blocks[309] = "nether_bricks"; blocks[403] = "nether_bricks"; blocks[404] = "nether_bricks"; blocks[405] = "spawner"; blocks[407] = "spawner"; blocks[408] = "nether_bricks"; blocks[409] = "nether_bricks"; blocks[503] = "nether_bricks"; blocks[504] = "nether_bricks"; blocks[505] = "spawner"; blocks[507] = "spawner"; blocks[508] = "nether_bricks"; blocks[509] = "nether_bricks"; blocks[603] = "nether_bricks"; blocks[604] = "nether_bricks"; blocks[605] = "spawner"; blocks[607] = "spawner"; blocks[608] = "nether_bricks"; blocks[609] = "nether_bricks"; blocks[703] = "nether_bricks"; blocks[704] = "nether_bricks"; blocks[705] = "spawner"; blocks[707] = "spawner"; blocks[708] = "nether_bricks"; blocks[709] = "nether_bricks"; blocks[803] = "nether_bricks"; blocks[804] = "nether_bricks"; blocks[805] = "spawner"; blocks[807] = "spawner"; blocks[808] = "nether_bricks"; blocks[809] = "nether_bricks"; blocks[903] = "nether_bricks"; blocks[904] = "nether_bricks"; blocks[905] = "spawner"; blocks[907] = "spawner"; blocks[908] = "nether_bricks"; blocks[909] = "nether_bricks"; blocks[1003] = "nether_bricks"; blocks[1004] = "nether_bricks"; blocks[1005] = "spawner"; blocks[1007] = "spawner"; blocks[1008] = "nether_bricks"; blocks[1009] = "nether_bricks"; blocks[1101] = "nether_bricks"; blocks[1102] = "nether_bricks"; blocks[1103] = "nether_bricks"; blocks[1104] = "nether_bricks"; blocks[1105] = "spawner"; blocks[1107] = "spawner"; blocks[1108] = "nether_bricks"; blocks[1109] = "nether_bricks"; blocks[1110] = "nether_bricks"; blocks[1111] = "nether_bricks"; blocks[1112] = "nether_bricks"; blocks[1201] = "nether_bricks"; blocks[1202] = "nether_bricks"; blocks[1203] = "nether_bricks"; blocks[1204] = "nether_bricks"; blocks[1205] = "nether_bricks"; blocks[1207] = "nether_bricks"; blocks[1208] = "nether_bricks"; blocks[1209] = "nether_bricks"; blocks[1210] = "nether_bricks"; blocks[1211] = "nether_bricks"; blocks[1212] = "nether_bricks";
			floor("spruce_planks");
			events[1306] = { "map": 9, "x": 2, "y": 7 };
		} else if (map === 9) {
			blocks[101] = "dark_oak_planks"; blocks[102] = "dark_oak_planks"; blocks[103] = "dark_oak_planks"; blocks[104] = "dark_oak_planks"; blocks[105] = "dark_oak_planks"; blocks[106] = "dark_oak_planks"; blocks[107] = "iron_door"; blocks[108] = "dark_oak_planks"; blocks[109] = "dark_oak_planks"; blocks[110] = "dark_oak_planks"; blocks[111] = "dark_oak_planks"; blocks[112] = "dark_oak_planks"; blocks[201] = "dark_oak_planks"; blocks[202] = "bookshelf2"; blocks[210] = "bookshelf2"; blocks[211] = "dark_oak_planks"; blocks[212] = "dark_oak_planks"; blocks[301] = "dark_oak_planks"; blocks[302] = "bookshelf2"; blocks[304] = "bookshelf2"; blocks[306] = "bookshelf2"; blocks[308] = "bookshelf2"; blocks[310] = "bookshelf2"; blocks[311] = "dark_oak_planks"; blocks[312] = "dark_oak_planks"; blocks[401] = "dark_oak_planks"; blocks[402] = "bookshelf2"; blocks[404] = "bookshelf2"; blocks[406] = "bookshelf2"; blocks[408] = "bookshelf2"; blocks[410] = "bookshelf2"; blocks[411] = "dark_oak_planks"; blocks[412] = "dark_oak_planks"; blocks[501] = "dark_oak_planks"; blocks[502] = "bookshelf2"; blocks[504] = "bookshelf2"; blocks[506] = "bookshelf2"; blocks[508] = "bookshelf2"; blocks[510] = "bookshelf2"; blocks[511] = "dark_oak_planks"; blocks[512] = "dark_oak_planks"; blocks[601] = "dark_oak_planks"; blocks[602] = "bookshelf2"; blocks[604] = "bookshelf2"; blocks[606] = "bookshelf2"; blocks[608] = "bookshelf2"; blocks[610] = "bookshelf2"; blocks[611] = "dark_oak_planks"; blocks[612] = "dark_oak_planks"; blocks[701] = "dark_oak_planks"; blocks[702] = "bookshelf2"; blocks[704] = "bookshelf2"; blocks[706] = "bookshelf2"; blocks[708] = "bookshelf2"; blocks[710] = "bookshelf2"; blocks[711] = "dark_oak_planks"; blocks[712] = "dark_oak_planks"; blocks[801] = "dark_oak_planks"; blocks[802] = "bookshelf2"; blocks[804] = "bookshelf2"; blocks[806] = "bookshelf2"; blocks[808] = "bookshelf2"; blocks[810] = "bookshelf2"; blocks[811] = "dark_oak_planks"; blocks[812] = "dark_oak_planks"; blocks[901] = "dark_oak_planks"; blocks[902] = "bookshelf2"; blocks[904] = "bookshelf2"; blocks[906] = "bookshelf2"; blocks[908] = "bookshelf2"; blocks[910] = "bookshelf2"; blocks[911] = "dark_oak_planks"; blocks[912] = "dark_oak_planks"; blocks[1001] = "dark_oak_planks"; blocks[1002] = "bookshelf2"; blocks[1004] = "bookshelf2"; blocks[1006] = "bookshelf2"; blocks[1008] = "bookshelf2"; blocks[1010] = "bookshelf2"; blocks[1011] = "dark_oak_planks"; blocks[1012] = "dark_oak_planks"; blocks[1101] = "dark_oak_planks"; blocks[1102] = "bookshelf2"; blocks[1110] = "bookshelf2"; blocks[1111] = "dark_oak_planks"; blocks[1112] = "dark_oak_planks"; blocks[1201] = "dark_oak_planks"; blocks[1202] = "dark_oak_planks"; blocks[1203] = "dark_oak_planks"; blocks[1204] = "dark_oak_planks"; blocks[1205] = "dark_oak_planks"; blocks[1206] = "dark_oak_planks"; blocks[1207] = "oak_door"; blocks[1208] = "dark_oak_planks"; blocks[1209] = "dark_oak_planks"; blocks[1210] = "dark_oak_planks"; blocks[1211] = "dark_oak_planks"; blocks[1212] = "dark_oak_planks";
			floor("spruce_planks");
			events[1207] = { "map": 10, "x": 7, "y": 4 };
		} else if (map === 10) {
			blocks[102] = "oak_planks"; blocks[103] = "oak_planks"; blocks[104] = "oak_planks"; blocks[105] = "oak_planks"; blocks[106] = "oak_planks"; blocks[107] = "oak_planks"; blocks[108] = "oak_planks"; blocks[109] = "spruce_planks"; blocks[110] = "spruce_planks"; blocks[111] = "cartography_table"; blocks[112] = "prismarine_bricks"; blocks[202] = "oak_planks"; blocks[203] = "oak_planks"; blocks[204] = "oak_planks"; blocks[205] = "oak_planks"; blocks[206] = "oak_planks"; blocks[207] = "oak_planks"; blocks[208] = "oak_planks"; blocks[209] = "spruce_planks"; blocks[210] = "spruce_planks"; blocks[212] = "prismarine_bricks"; blocks[302] = "oak_planks"; blocks[303] = "oak_planks"; blocks[304] = "oak_planks"; blocks[305] = "oak_planks"; blocks[306] = "oak_planks"; blocks[307] = "oak_planks"; blocks[308] = "oak_planks"; blocks[309] = "spruce_planks"; blocks[310] = "spruce_planks"; blocks[312] = "prismarine_bricks"; blocks[402] = "oak_planks"; blocks[403] = "oak_planks"; blocks[404] = "oak_planks"; blocks[405] = "oak_planks"; blocks[406] = "oak_planks"; blocks[407] = "oak_planks"; blocks[408] = "oak_planks"; blocks[409] = "spruce_planks"; blocks[410] = "spruce_planks"; blocks[412] = "prismarine_bricks"; blocks[502] = "oak_planks"; blocks[503] = "oak_planks"; blocks[504] = "oak_planks"; blocks[505] = "oak_planks"; blocks[506] = "oak_planks"; blocks[507] = "oak_planks"; blocks[508] = "oak_planks"; blocks[509] = "spruce_planks"; blocks[510] = "spruce_planks"; blocks[512] = "prismarine_bricks"; blocks[602] = "oak_planks"; blocks[603] = "oak_planks"; blocks[604] = "oak_door"; blocks[605] = "oak_planks"; blocks[606] = "oak_planks"; blocks[607] = "oak_planks"; blocks[608] = "oak_planks"; blocks[609] = "spruce_planks"; blocks[610] = "spruce_planks"; blocks[612] = "prismarine_bricks"; blocks[712] = "prismarine_bricks"; blocks[812] = "prismarine_bricks"; blocks[911] = "prismarine_bricks"; blocks[912] = "sugar_cane"; blocks[1001] = "prismarine_bricks"; blocks[1006] = "prismarine_bricks"; blocks[1007] = "prismarine_bricks"; blocks[1008] = "prismarine_bricks"; blocks[1009] = "prismarine_bricks"; blocks[1010] = "prismarine_bricks"; blocks[1011] = "sugar_cane"; blocks[1012] = "sugar_cane"; blocks[1101] = "sugar_cane"; blocks[1102] = "prismarine_bricks"; blocks[1103] = "iron_bars"; blocks[1104] = "iron_bars"; blocks[1105] = "prismarine_bricks"; blocks[1106] = "sugar_cane"; blocks[1107] = "sugar_cane"; blocks[1108] = "sugar_cane"; blocks[1109] = "sugar_cane"; blocks[1110] = "sugar_cane"; blocks[1111] = "sugar_cane"; blocks[1112] = "sugar_cane"; blocks[1201] = "sugar_cane"; blocks[1202] = "prismarine_bricks"; blocks[1205] = "prismarine_bricks"; blocks[1206] = "sugar_cane"; blocks[1207] = "sugar_cane"; blocks[1208] = "sugar_cane"; blocks[1209] = "sugar_cane"; blocks[1210] = "sugar_cane"; blocks[1211] = "sugar_cane"; blocks[1212] = "sugar_cane";
			floor("dirt");
			blocks[904] = "libriarier";
			if (!cd.visible) events[111] = { "item": cd, "itemName": "cd" };
			events[604] = { "map": 5, "x": 11, "y": 7 };
		} else if (map === 11) {
			blocks[101] = "soul_sand"; blocks[102] = "soul_sand"; blocks[103] = "soul_sand"; blocks[104] = "soul_sand"; blocks[105] = "dark_prismarine"; blocks[106] = "dark_prismarine"; blocks[107] = "dark_prismarine"; blocks[108] = "dark_prismarine"; blocks[109] = "soul_sand"; blocks[110] = "soul_sand"; blocks[111] = "soul_sand"; blocks[112] = "soul_sand"; blocks[201] = "soul_sand"; blocks[202] = "soul_sand"; blocks[203] = "soul_sand"; blocks[204] = "dark_prismarine"; blocks[209] = "dark_prismarine"; blocks[210] = "soul_sand"; blocks[211] = "soul_sand"; blocks[212] = "soul_sand"; blocks[301] = "soul_sand"; blocks[302] = "soul_sand"; blocks[303] = "dark_prismarine"; blocks[310] = "dark_prismarine"; blocks[311] = "soul_sand"; blocks[312] = "soul_sand"; blocks[401] = "soul_sand"; blocks[402] = "dark_prismarine"; blocks[411] = "dark_prismarine"; blocks[412] = "soul_sand"; blocks[501] = "dark_prismarine"; blocks[506] = "dark_prismarine"; blocks[507] = "dark_prismarine"; blocks[511] = "dark_prismarine"; blocks[512] = "soul_sand"; blocks[601] = "dark_prismarine"; blocks[605] = "dark_prismarine"; blocks[606] = "soul_sand"; blocks[607] = "soul_sand"; blocks[608] = "dark_prismarine"; blocks[611] = "dark_prismarine"; blocks[612] = "soul_sand"; blocks[701] = "dark_prismarine"; blocks[705] = "dark_prismarine"; blocks[706] = "soul_sand"; blocks[707] = "soul_sand"; blocks[708] = "dark_prismarine"; blocks[711] = "dark_prismarine"; blocks[712] = "soul_sand"; blocks[801] = "dark_prismarine"; blocks[805] = "dark_prismarine"; blocks[806] = "soul_sand"; blocks[807] = "soul_sand"; blocks[808] = "dark_prismarine"; blocks[812] = "dark_prismarine"; blocks[901] = "dark_prismarine"; blocks[904] = "dark_prismarine"; blocks[905] = "soul_sand"; blocks[906] = "soul_sand"; blocks[907] = "soul_sand"; blocks[908] = "dark_prismarine"; blocks[912] = "dark_prismarine"; blocks[1001] = "dark_prismarine"; blocks[1004] = "dark_prismarine"; blocks[1005] = "soul_sand"; blocks[1006] = "soul_sand"; blocks[1007] = "soul_sand"; blocks[1008] = "dark_prismarine"; blocks[1012] = "dark_prismarine"; blocks[1101] = "dark_prismarine"; blocks[1104] = "blood_foot_right"; blocks[1105] = "blood_foot_left"; blocks[1106] = "blood_foot_right"; blocks[1107] = "blood_foot_left"; blocks[1108] = "blood_foot_right"; blocks[1109] = "blood_foot_left"; blocks[1112] = "blood"; blocks[1201] = "dark_prismarine"; blocks[1204] = "dark_prismarine"; blocks[1205] = "soul_sand"; blocks[1206] = "soul_sand"; blocks[1207] = "soul_sand"; blocks[1208] = "soul_sand"; blocks[1209] = "dark_prismarine"; blocks[1212] = "dark_prismarine";
			floor("podzol");
			layer2[1104] = "dark_prismarine"; layer2[1105] = "soul_sand"; layer2[1106] = "soul_sand"; layer2[1107] = "soul_sand"; layer2[1108] = "soul_sand"; layer2[1109] = "dark_prismarine"; layer2[1112] = "dark_prismarine";
			events[1302] = { "map": 3, "x": 1, "y": 11 };
			events[1303] = { "map": 3, "x": 1, "y": 12 };
			events[1310] = { "map": 12, "x": 1, "y": 10 };
			events[1311] = { "map": 12, "x": 1, "y": 11 };
		} else if (map === 12) {
			blocks[101] = "black_wool"; blocks[102] = "black_wool"; blocks[103] = "black_wool"; blocks[104] = "black_wool"; blocks[105] = "soul_sand"; blocks[106] = "soul_sand"; blocks[107] = "soul_sand"; blocks[108] = "soul_sand"; blocks[109] = "dark_prismarine"; blocks[112] = "dark_prismarine"; blocks[201] = "black_wool"; blocks[202] = "black_wool"; blocks[203] = "black_wool"; blocks[204] = "black_wool"; blocks[205] = "soul_sand"; blocks[206] = "soul_sand"; blocks[207] = "soul_sand"; blocks[208] = "soul_sand"; blocks[209] = "dark_prismarine"; blocks[212] = "dark_prismarine"; blocks[301] = "black_wool"; blocks[302] = "black_wool"; blocks[303] = "oak_planks"; blocks[304] = "oak_planks"; blocks[305] = "spruce_planks"; blocks[306] = "spruce_planks"; blocks[307] = "spruce_planks"; blocks[308] = "dark_prismarine"; blocks[312] = "dark_prismarine"; blocks[401] = "black_wool"; blocks[402] = "black_wool"; blocks[403] = "oak_planks"; blocks[404] = "oak_planks"; blocks[405] = "spruce_planks"; blocks[406] = "spruce_planks"; blocks[407] = "spruce_planks"; blocks[409] = "sweet_berry_bush_stage2"; blocks[412] = "dark_prismarine"; blocks[501] = "black_wool"; blocks[502] = "black_wool"; blocks[503] = "oak_planks"; blocks[504] = "oak_planks"; blocks[505] = "spruce_planks"; blocks[506] = "spruce_planks"; blocks[507] = "spruce_planks"; blocks[512] = "dark_prismarine"; blocks[601] = "black_wool"; blocks[602] = "black_wool"; blocks[603] = "oak_planks"; blocks[604] = "oak_planks"; blocks[605] = "spruce_planks"; blocks[606] = "jack_o_lantern"; blocks[607] = "dead_bush"; blocks[612] = "dark_prismarine"; blocks[701] = "black_wool"; blocks[702] = "black_wool"; blocks[703] = "oak_planks"; blocks[704] = "oak_planks"; blocks[705] = "spruce_planks"; blocks[706] = "spruce_planks"; blocks[707] = "spruce_planks"; blocks[712] = "dark_prismarine"; blocks[801] = "black_wool"; blocks[802] = "black_wool"; blocks[803] = "oak_planks"; blocks[804] = "oak_planks"; blocks[805] = "spruce_planks"; blocks[806] = "spruce_planks"; blocks[807] = "oak_door"; blocks[810] = "sweet_berry_bush_stage3"; blocks[812] = "dark_prismarine"; blocks[901] = "black_wool"; blocks[902] = "black_wool"; blocks[903] = "oak_planks"; blocks[904] = "oak_planks"; blocks[905] = "spruce_planks"; blocks[906] = "spruce_planks"; blocks[907] = "spruce_planks"; blocks[912] = "dark_prismarine"; blocks[1001] = "black_wool"; blocks[1002] = "black_wool"; blocks[1003] = "oak_planks"; blocks[1004] = "oak_planks"; blocks[1005] = "spruce_planks"; blocks[1006] = "spruce_planks"; blocks[1007] = "spruce_planks"; blocks[1008] = "sweet_berry_bush_stage2"; blocks[1012] = "dark_prismarine"; blocks[1101] = "black_wool"; blocks[1102] = "black_wool"; blocks[1103] = "oak_planks"; blocks[1104] = "oak_planks"; blocks[1105] = "spruce_planks"; blocks[1106] = "spruce_planks"; blocks[1107] = "spruce_planks"; blocks[1112] = "dark_prismarine"; blocks[1201] = "black_wool"; blocks[1202] = "black_wool"; blocks[1203] = "oak_planks"; blocks[1204] = "oak_planks"; blocks[1205] = "spruce_planks"; blocks[1206] = "spruce_planks"; blocks[1207] = "spruce_planks"; blocks[1208] = "dark_prismarine"; blocks[1209] = "dark_prismarine"; blocks[1210] = "iron_bars"; blocks[1211] = "iron_bars"; blocks[1212] = "dark_prismarine";
			floor("podzol");
			layer2[101] = "black_wool"; layer2[102] = "black_wool"; layer2[103] = "black_wool"; layer2[104] = "black_wool"; layer2[201] = "black_wool"; layer2[202] = "black_wool"; layer2[203] = "black_wool"; layer2[204] = "black_wool"; layer2[301] = "black_wool"; layer2[302] = "black_wool"; layer2[309] = "sweet_berry_bush_stage1"; layer2[311] = "sweet_berry_bush_stage1"; layer2[401] = "black_wool"; layer2[402] = "black_wool"; layer2[501] = "black_wool"; layer2[502] = "black_wool"; layer2[509] = "sweet_berry_bush_stage1"; layer2[601] = "black_wool"; layer2[602] = "black_wool"; layer2[607] = "spruce_planks"; layer2[608] = "sweet_berry_bush_stage1"; layer2[701] = "black_wool"; layer2[702] = "black_wool"; layer2[711] = "sweet_berry_bush_stage1"; layer2[801] = "black_wool"; layer2[802] = "black_wool"; layer2[809] = "sweet_berry_bush_stage1"; layer2[901] = "black_wool"; layer2[902] = "black_wool"; layer2[1001] = "black_wool"; layer2[1002] = "black_wool"; layer2[1011] = "sweet_berry_bush_stage1"; layer2[1101] = "black_wool"; layer2[1102] = "black_wool"; layer2[1201] = "black_wool"; layer2[1202] = "black_wool";
			events[10] = { "map": 11, "x": 13, "y": 10 };
			events[11] = { "map": 11, "x": 13, "y": 11 };
			events[807] = { "map": 13, "x": 7, "y": 12 };
		} else if (map === 13) {
			blocks[101] = "enchanting_table"; blocks[102] = "crafting_table_top"; blocks[103] = "cartography_table"; blocks[104] = "brewing_stand"; blocks[112] = "dark_oak_planks"; blocks[204] = "brewing_stand"; blocks[205] = "anvil_top"; blocks[206] = "anvil_top"; blocks[208] = "anvil_top"; blocks[209] = "anvil_top"; blocks[210] = "anvil_top"; blocks[212] = "dark_oak_planks"; blocks[304] = "barrel"; blocks[305] = "piston"; blocks[306] = "piston"; blocks[308] = "piston"; blocks[309] = "piston"; blocks[310] = "piston"; blocks[312] = "dark_oak_planks"; blocks[404] = "barrel_open"; blocks[405] = "piston"; blocks[406] = "piston"; blocks[408] = "piston"; blocks[409] = "piston"; blocks[410] = "piston"; blocks[412] = "dark_oak_planks"; blocks[504] = "barrel"; blocks[505] = "anvil_top"; blocks[506] = "anvil_top"; blocks[508] = "anvil_top"; blocks[509] = "anvil_top"; blocks[510] = "anvil_top"; blocks[512] = "dark_oak_planks"; blocks[601] = "beehive"; blocks[604] = "barrel"; blocks[612] = "dark_oak_planks"; blocks[701] = "beehive"; blocks[712] = "oak_door"; blocks[801] = "beehive"; blocks[804] = "barrel"; blocks[812] = "dark_oak_planks"; blocks[901] = "beehive"; blocks[904] = "barrel"; blocks[905] = "anvil_top"; blocks[906] = "anvil_top"; blocks[908] = "anvil_top"; blocks[909] = "anvil_top"; blocks[910] = "anvil_top"; blocks[912] = "dark_oak_planks"; blocks[1001] = "furnace"; blocks[1004] = "barrel_open"; blocks[1005] = "piston"; blocks[1006] = "piston"; blocks[1008] = "piston"; blocks[1009] = "piston"; blocks[1010] = "piston"; blocks[1012] = "dark_oak_planks"; blocks[1101] = "furnace"; blocks[1104] = "barrel_open"; blocks[1105] = "piston"; blocks[1106] = "piston"; blocks[1108] = "piston"; blocks[1109] = "piston"; blocks[1110] = "piston"; blocks[1112] = "dark_oak_planks"; blocks[1201] = "smoker"; blocks[1204] = "barrel"; blocks[1205] = "anvil_top"; blocks[1206] = "anvil_top"; blocks[1208] = "anvil_top"; blocks[1209] = "anvil_top"; blocks[1210] = "anvil_top"; blocks[1212] = "dark_oak_planks";
			blocks[402] = "waiter_ghost";
			floor("spruce_planks");
			events[712] = { "map": 12, "x": 8, "y": 8 };
		}

		if (map === 8) {
			frontOf(monster);
		} else {
			monster.visible = false;
		}
	}

	function titleChangeFn() {
		if (map === 1) return title.text = "鎮長辦公室";
		if (map === 2) return title.text = "道路";
		if (map === 3 && !cd_played) return title.text = "道路";
		if (map === 3 && cd_played) return title.text = "分岔入口";
		if (map === 4) return title.text = "圖書館外";
		if (map === 5) return title.text = "圖書館";
		if (map === 6) return title.text = "圖書館";
		if (map === 7) return title.text = "圖書館2樓";
		if (map === 8) return title.text = "圖書館";
		if (map === 9) return title.text = "圖書館";
		if (map === 10) return title.text = "圖書館";
		if (map === 11) return title.text = "道路";
		if (map === 12) return title.text = "酒店外";
		if (map === 12) return title.text = "街道";
	}

	function wall(pos) {
		if (blocks[pos] === "air") return false;
		if (blocks[pos] === "dark_oak_door") return moveFn();

		return true;
	}

	function box(pos) {
		let target;
		if (direction === "up") target = pos - 1;
		if (direction === "down") target = pos + 1;
		if (direction === "left") target = pos - 100;
		if (direction === "right") target = pos + 100;
		nowblock=blocks[target];
		if (events[target] === 0) {
			autoChat(blocks[target]);
			if (map === 8 && player1_x === 7) return monsterMove();
		} else {
			let omap = events[target].map;
			let ox = events[target].x;
			let oy = events[target].y;
			let oway = events[target].way
			let oitem = events[target].item;
			let oitemName = events[target].itemName;
			let oevent = events[target].event;
			if (blocks[target] === "oak_door") return transport(omap, ox, oy, oway);
			if (blocks[target] === "ladder") return transport(omap, ox, oy, oway);
			if (blocks[target] === "iron_door") return transport(omap, ox, oy, oway);
			if (blocks[target] === "enchanting_table") return item(oitem, oitemName);
			if (blocks[target] === "cartography_table") return item(oitem, oitemName);
			if (blocks[target] === "beehive") return item(oitem, oitemName);
			if (blocks[target] === "jukebox") return evts(oevent);
			if (blocks[target] === "cheif") return evts(oevent);
			if (target % 100 === 13 || target % 100 === 0) return transport(omap, ox, oy, oway);
			if (parseInt(target / 100) === 13 || parseInt(target / 100) === 0) return transport(omap, ox, oy, oway);
		}
	}

	function autoChat(type) {
		line_1 = "";
		line_2 = "";
		line_3 = "";
		if (type === "bookshelf") return autoChatData("書櫃", "除了舊書以外似乎沒有其他東西", 0, 0);
		if (type === "ladder") return autoChatData("樓梯", "樓梯損毀，無法使用", 0, 0);
		if (type === "cauldron") return autoChatData("洗手台", "水龍頭已經沒有水了", 0, 0);
		if (type === "jukebox") return autoChatData("唱片機", "需要放入唱片", 0, 0);
		if (type === "crafting_table_top") return autoChatData("工作台", "桌上沒有東西", 0, 0);
		if (type === "furnace") return autoChatData("爐子", "爐子裡沒東西", 0, 0);
		if (type === "furnace_on") return autoChatData("爐子", "還剩一些餘火", 0, 0);
		if (type === "brewing_stand") return autoChatData("釀造台", "儀器都生鏽了", 0, 0);
		if (type === "enchanting_table") return autoChatData("精裝桌子", "好像是用來展示書本的地方", "不過找不到像樣的書", 0);
		if (type === "loom") return autoChatData("鋼琴", "鋼琴上覆著一層厚厚的灰塵", 0, 0);
		if (type === "smoker") return autoChatData("控制爐", "好像開不起來", 0, 0);
		if (type === "blast_furnace") return autoChatData("火爐", "正燒著大量的煤，似乎是供應能源的地方", 0, 0);
		if (type === "cartography_table") return autoChatData("桌子", "桌上只剩殘破的地圖", 0, 0);
		if (type === "fletching_table") return autoChatData("桌子", "桌上有未完成的弓箭", 0, 0);
		if (type === "smithing_table") return autoChatData("工作檯", "桌上沒有東西", 0, 0);
		if (type === "beehive") return autoChatData("抽屜", "抽屜裡沒東西", 0, 0);
		if (type === "iron_door") return autoChatData("鐵門", "需要鑰匙才能開啟", 0, 0);
		if (type === "spawner") return autoChatData("鐵籠", "不知道裡面放的是甚麼東西，需要工具開啟", 0, 0);
		if (type === "iron_bars") return autoChatData("鐵柵欄", "似乎需要工具破壞", 0, 0);
		if (type === "barrel") return autoChatData("儲藏箱", "無法開啟", 0, 0);
		if (type === "barrel_open") return autoChatData("儲藏箱", "空空如也", 0, 0);
		if (type === "scaffolding") return autoChatData("桌子", "桌上沒有東西", 0, 0);
		if (type === "end_portal_frame") return autoChatData("雕琢過的桌子", "桌上沒有東西", 0, 0);
	}

	function itemTxt(type,image) {
		nowblock=image;
		if (type === "library_key") return autoChatData("圖書館鑰匙", "可以開啟圖書館一樓鐵門", 0, 0);
		if (type === "cd") return autoChatData("唱片", "可以在唱片機播放", 0, 0,"item");
		if (type === "paper1") return autoChatData("日記 5/15", "最近愈來愈少人來了", "難道礦業沒落真的影響這麼大嗎?", 0);
		if (type === "paper2") return autoChatData("日記", "日記", 0, 0);
		if (type === "paper3") return autoChatData("日記", "日記", 0, 0);
		if (type === "knife") return autoChatData("匕首", "沾了點鮮血的匕首", 0, 0);
		if (type === "jimmy_bar") return autoChatData("鐵橇", "可以破壞鐵欄杆", 0, 0);
	}

	function chat(line) {
		line_1 = "";
		line_2 = "";
		line_3 = "";
		if(line) chats =line;
		if(line) chatbar_status =true;
		if(line) pic.gotoAndPlay("air");
		if(line) pic.gotoAndPlay(nowblock);
		if (map === 1) {
			if (chats === 1) {
				speaker = "鎮長";
				line_1 = "最近鎮上常出現隨機殺人事件";
			}else if(chats === 2){
				line_1 = "你去調查到底發生了什麼事";
			}else if(chats === 3){
				line_1 = "這小鎮已經因為礦業的沒落而沒什麼人移入了";
			}else if(chats === 4){
				line_1 = "又發生這種事真的讓我很頭痛";
			}else if(chats === 5){
				line_1 = "如果你能查出來的話...";
			}else if(chats === 6){
				line_1 = "我會給你不少的獎金";
			}else if(chats === 7){
				chat_off();
			}
		}
		chats++;
		if (chatbar_status) speaking = true;
		if (chatbar_status) chat_on();
	}
	//事件觸發
	function evts(event) {
		if (event === "cd_played") {
			cd_played = true;
			autoChatData("唱片機", 0, "播放中...", 0);
		}else if(event === "cheif"){
			chat(1);
		}
	}


	//固定函數模板------------------------------------------------------
	//monster move
	function monsterMove() {
		frontOf(monster);
		monster.x += 5;
		if (monster.visible && robot.x < monster.x + 250) p1die = true;
		die_detect();
		if (map != 10) setTimeout((() => monsterMove()), 100);
		if (map === 10 || p1die) return monster.visible = false;
	}
	//手機版-控制
	function touchdownMove(e) {
		location = (player1_x) * 100 + (player1_y);
		if (chats === 0 && chatbar_status) return chat_off();
		if (chats > 0 && chatbar_status) return chat();
		//Player1
		if (!canplay) return;
		if (e === 37) {
			control(true, -1, "left", location - 100);
		} else if (e === 38) {
			control(false, -1, "up", location - 1);
		} else if (e === 39) {
			control(true, 1, "right", location + 100);
		} else if (e === 40) {
			control(false, 1, "down", location + 1);
		} else if (e === 191) {

		}
	}
	//電腦版-控制
	function keydownMoveFn(e) {
		//Player1
		location = (player1_x) * 100 + (player1_y);
		if (chats === 0 && chatbar_status) return chat_off();
		if (chats > 0 && chatbar_status) return chat();
		if (!canplay) return;
		if (e.keyCode === 37) {
			control(true, -1, "left", location - 100);
		} else if (e.keyCode === 38) {
			control(false, -1, "up", location - 1);
		} else if (e.keyCode === 39) {
			control(true, 1, "right", location + 100);
		} else if (e.keyCode === 40) {
			control(false, 1, "down", location + 1);
		} else if (e.keyCode === 191) {

		}
		//console.log("("+player1_x+","+player1_y+")")
	}
	//改變地圖
	function mapChangeFn() {

		for (var i = 0; i < 13; i++) {
			for (var j = 0; j < 13; j++) {
				layer1[i * 100 + j] = "air";
				layer2[i * 100 + j] = "air";
				blocks[i * 100 + j] = "air";
				bg1[i * 100 + j].gotoAndPlay("none");
				bg2[i * 100 + j].gotoAndPlay("none");
				block[i * 100 + j].gotoAndPlay("none");
			}
		}
		for (var i = -1; i < 14; i++) {
			for (var j = -1; j < 14; j++) {
				events[i * 100 + j] = 0;
			}
		}
		mapChoose();
		for (var i = 0; i < 13; i++) {
			for (var j = 0; j < 13; j++) {
				bg1[i * 100 + j].gotoAndPlay(layer1[i * 100 + j]);
				bg2[i * 100 + j].gotoAndPlay(layer2[i * 100 + j]);
				block[i * 100 + j].gotoAndPlay(blocks[i * 100 + j]);
			}
		}
		frontOf(robot);
		chat_off();
	}
	//改變地圖底部樣式
	function floor(type) {
		for (var i = 0; i < 13; i++) {
			for (var j = 0; j < 13; j++) {
				layer1[i * 100 + j] = type;
			}
		}
	}
	function frontOf(object) {
		exportRoot.setChildIndex(object, exportRoot.getNumChildren() - 1)
		object.visible = true;
	}
	//傳送
	function transport(maps, x, y, way) {
		if (map === 10 && !cd.visible) return;
		map = maps;
		if (map === 9) monster.x = -350;
		player1_x = x;
		player1_y = y;
		robot.x = player1_x * 50 - 25;
		robot.y = player1_y * 50 - 25;
		location = (player1_x) * 100 + (player1_y);
		if (way) direction = way;
		mapChangeFn();
		titleChangeFn();
	}
	//方塊自動對話
	function autoChatData(speakor, txt1, txt2, txt3) {
		line_1 = "";
		line_2 = "";
		line_3 = "";
		chats = 0;
		speaker = speakor;
		pic.gotoAndPlay("air");
		pic.gotoAndPlay(nowblock);
		if (txt1) line_1 = txt1;
		if (txt2) line_2 = txt2;
		if (txt3) line_3 = txt3;
		chat_on();
	}
	//得到物品
	function item(items, name) {
		items.visible = true;
		itemTxt(name);
	}
	//生成物件初始參數設定
	function summon(object, x, y, gotoAndPlay, visible) {
		object.x = x
		object.y = y
		exportRoot.addChild(object);
		if (gotoAndPlay) object.gotoAndPlay(gotoAndPlay);
		object.visible = visible;
	}
	//生成物件(items)初始參數設定
	function item_summon(object, x, y, gotoAndPlay, visible) {
		object.x = 574 + 52 * x
		object.y = 103 + 69 * y
		exportRoot.addChild(object);
		if (gotoAndPlay) object.gotoAndPlay(gotoAndPlay);
		object.visible = visible;
		object.hitArea = hitArea;
	}
	//遊戲控制
	function control(way, steps, direct, walls) {
		udlr = way;
		step = STEP * steps;
		isKeyDown = true;
		direction = direct;
		robot.gotoAndPlay(direction);
		box(location)
		if (player1_x === 1 && direct === "left") return;
		if (player1_x === 12 && direct === "right") return;
		if (player1_y === 1 && direct === "up") return;
		if (player1_y === 12 && direct === "down") return;
		if (wall(walls)) return box(location);
		moveFn();
	}
	//對話框-開啟
	function chat_on() {
		chatbar_status = true;

		frontOf(chatbar);
		frontOf(speakers);
		frontOf(line1);
		frontOf(line2);
		frontOf(line3);
		frontOf(pic);
		speakers.text = "<" + speaker + ">";
		line1.text = line_1;
		line2.text = line_2;
		line3.text = line_3;
		speaking = true;
	}
	//對話框-關閉
	function chat_off() {
		if (!chatbar_status) return;
		chatbar.visible = false;
		speakers.visible = false;
		line1.visible = false;
		line2.visible = false;
		line3.visible = false;
		pic.visible = false;
		chatbar_status = false;
		speaking = false;
		chats=-1;
	}
	//放開按鈕
	function keyupMoveFn(e) {
		isKeyDown = false;
	}
	//移動-執行
	function moveFn() {
		if (!isKeyDown) return;
		if (chats>0) return chat();
		if (udlr) {
			player1_x += step / 50
			robot.x += step;
		} else {
			player1_y += step / 50
			robot.y += step;
		}
		frontOf(robot);
	}
	//死亡偵測
	function die_detect() {
		if (!canplay) return;
		if (p1die) {
			canplay = false;
			robot.gotoAndPlay("explore");
			end_detect();
			return;
		}
	}
	//結束偵測
	function end_detect() {
		if (!canplay) {
			document.getElementById("reload_back").classList.remove("reload_back0");
			document.getElementById("reload_back").classList.add("reload_back");
			document.getElementById("reload").classList.remove("reload0");
			document.getElementById("reload").classList.add("reload");
		}
	}

	//-----------------------------------------------------------------










	//Registers the "tick" event listener.
	fnStartAnimation = function () {
		stage.addChild(exportRoot);
		createjs.Ticker.setFPS(lib.properties.fps);
		createjs.Ticker.addEventListener("tick", stage)
		stage.addEventListener("tick", handleTick)
		function getProjectionMatrix(container, totalDepth) {
			var focalLength = 528.25;
			var projectionCenter = { x: lib.properties.width / 2, y: lib.properties.height / 2 };
			var scale = (totalDepth + focalLength) / focalLength;
			var scaleMat = new createjs.Matrix2D;
			scaleMat.a = 1 / scale;
			scaleMat.d = 1 / scale;
			var projMat = new createjs.Matrix2D;
			projMat.tx = -projectionCenter.x;
			projMat.ty = -projectionCenter.y;
			projMat = projMat.prependMatrix(scaleMat);
			projMat.tx += projectionCenter.x;
			projMat.ty += projectionCenter.y;
			return projMat;
		}
		function handleTick(event) {
			var cameraInstance = exportRoot.___camera___instance;
			if (cameraInstance !== undefined && cameraInstance.pinToObject !== undefined) {
				cameraInstance.x = cameraInstance.pinToObject.x + cameraInstance.pinToObject.pinOffsetX;
				cameraInstance.y = cameraInstance.pinToObject.y + cameraInstance.pinToObject.pinOffsetY;
				if (cameraInstance.pinToObject.parent !== undefined && cameraInstance.pinToObject.parent.depth !== undefined)
					cameraInstance.depth = cameraInstance.pinToObject.parent.depth + cameraInstance.pinToObject.pinOffsetZ;
			}
			applyLayerZDepth(exportRoot);
		}
		function applyLayerZDepth(parent) {
			var cameraInstance = parent.___camera___instance;
			var focalLength = 528.25;
			var projectionCenter = { 'x': 0, 'y': 0 };
			if (parent === exportRoot) {
				var stageCenter = { 'x': lib.properties.width / 2, 'y': lib.properties.height / 2 };
				projectionCenter.x = stageCenter.x;
				projectionCenter.y = stageCenter.y;
			}
			for (child in parent.children) {
				var layerObj = parent.children[child];
				if (layerObj == cameraInstance)
					continue;
				applyLayerZDepth(layerObj, cameraInstance);
				if (layerObj.layerDepth === undefined)
					continue;
				if (layerObj.currentFrame != layerObj.parent.currentFrame) {
					layerObj.gotoAndPlay(layerObj.parent.currentFrame);
				}
				var matToApply = new createjs.Matrix2D;
				var cameraMat = new createjs.Matrix2D;
				var totalDepth = layerObj.layerDepth ? layerObj.layerDepth : 0;
				var cameraDepth = 0;
				if (cameraInstance && !layerObj.isAttachedToCamera) {
					var mat = cameraInstance.getMatrix();
					mat.tx -= projectionCenter.x;
					mat.ty -= projectionCenter.y;
					cameraMat = mat.invert();
					cameraMat.prependTransform(projectionCenter.x, projectionCenter.y, 1, 1, 0, 0, 0, 0, 0);
					cameraMat.appendTransform(-projectionCenter.x, -projectionCenter.y, 1, 1, 0, 0, 0, 0, 0);
					if (cameraInstance.depth)
						cameraDepth = cameraInstance.depth;
				}
				if (layerObj.depth) {
					totalDepth = layerObj.depth;
				}
				//Offset by camera depth
				totalDepth -= cameraDepth;
				if (totalDepth < -focalLength) {
					matToApply.a = 0;
					matToApply.d = 0;
				}
				else {
					if (layerObj.layerDepth) {
						var sizeLockedMat = getProjectionMatrix(parent, layerObj.layerDepth);
						if (sizeLockedMat) {
							sizeLockedMat.invert();
							matToApply.prependMatrix(sizeLockedMat);
						}
					}
					matToApply.prependMatrix(cameraMat);
					var projMat = getProjectionMatrix(parent, totalDepth);
					if (projMat) {
						matToApply.prependMatrix(projMat);
					}
				}
				layerObj.transformMatrix = matToApply;
			}
		}
	}
	//Code to support hidpi screens and responsive scaling.
	function makeResponsive(isResp, respDim, isScale, scaleType) {
		var lastW, lastH, lastS = 1;
		window.addEventListener('resize', resizeCanvas);
		resizeCanvas();
		function resizeCanvas() {
			var w = lib.properties.width, h = lib.properties.height;
			var iw = window.innerWidth, ih = window.innerHeight;
			var pRatio = window.devicePixelRatio || 1, xRatio = iw / w, yRatio = ih / h, sRatio = 1;
			if (isResp) {
				if ((respDim == 'width' && lastW == iw) || (respDim == 'height' && lastH == ih)) {
					sRatio = lastS;
				}
				else if (!isScale) {
					if (iw < w || ih < h)
						sRatio = Math.min(xRatio, yRatio);
				}
				else if (scaleType == 1) {
					sRatio = Math.min(xRatio, yRatio);
				}
				else if (scaleType == 2) {
					sRatio = Math.max(xRatio, yRatio);
				}
			}
			canvas.width = w * pRatio * sRatio;
			canvas.height = h * pRatio * sRatio;
			canvas.style.width = dom_overlay_container.style.width = anim_container.style.width = w * sRatio + 'px';
			canvas.style.height = anim_container.style.height = dom_overlay_container.style.height = h * sRatio + 'px';
			stage.scaleX = pRatio * sRatio;
			stage.scaleY = pRatio * sRatio;
			lastW = iw; lastH = ih; lastS = sRatio;
			stage.tickOnUpdate = false;
			stage.update();
			stage.tickOnUpdate = true;
		}
	}
	makeResponsive(false, 'both', false, 1);
	AdobeAn.compositionLoaded(lib.properties.id);
	fnStartAnimation();
}