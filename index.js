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
	let line_1;
	let line_2;
	let line_3; chats
	let location;
	let chatbar = new lib.chat_bar();
	chatbar.x = 0;
	chatbar.y = 430;
	exportRoot.addChild(chatbar);
	chatbar.gotoAndPlay("visible");

	let speakers = new createjs.Text("<" + speaker + ">", "bold 20px Arial", "white");
	speakers.x = 150;
	speakers.y = 465;
	speakers.textBaseline = "alphabetic";
	exportRoot.addChild(speakers);

	let line1 = new createjs.Text(line_1, "bold 20px Arial", "white");
	line1.x = 150;
	line1.y = 500;
	line1.textBaseline = "alphabetic";
	exportRoot.addChild(line1);

	let line2 = new createjs.Text(line_2, "bold 20px Arial", "white");
	line2.x = 150;
	line2.y = 525;
	line2.textBaseline = "alphabetic";
	exportRoot.addChild(line2);

	let line3 = new createjs.Text(line_3, "bold 20px Arial", "white");
	line3.x = 150;
	line3.y = 550;
	line3.textBaseline = "alphabetic";
	exportRoot.addChild(line3);

	//Player1
	let direction = "down";
	let p1die = false;
	let udlr = true;
	var robot = new lib.roboter();
	var player1_x = 6;
	var player1_y = 5;
	robot.x = player1_x * 50 - 25;
	robot.y = player1_y * 50 - 25;
	exportRoot.addChild(robot);
	robot.gotoAndPlay(direction);


	var title = new createjs.Text("鎮長辦公室", "bold 43px Arial", "white");
	title.x = 614;
	title.y = 60;
	title.textBaseline = "alphabetic";
	exportRoot.addChild(title);

	for (var i = 0; i < 13; i++) {
		for (var j = 0; j < 13; j++) {
			bg1[i * 100 + j] = new lib.blocks();
			bg1[i * 100 + j].x = i * 50 - 25;
			bg1[i * 100 + j].y = j * 50 - 25;
			exportRoot.addChild(bg1[i * 100 + j]);
			bg2[i * 100 + j] = new lib.blocks();
			bg2[i * 100 + j].x = i * 50 - 25;
			bg2[i * 100 + j].y = j * 50 - 25;
			exportRoot.addChild(bg2[i * 100 + j]);
			block[i * 100 + j] = new lib.blocks();
			block[i * 100 + j].x = i * 50 - 25;
			block[i * 100 + j].y = j * 50 - 25;
			exportRoot.addChild(block[i * 100 + j]);
		}
	}

	mapChangeFn();


	document.querySelector(".gamePlayBtn").addEventListener("click", () => {
		window.addEventListener("keydown", keydownMoveFn)
		window.addEventListener("keyup", keyupMoveFn)

		document.querySelector(".gamePlayBtn").style.display = 'none';
		document.querySelector(".left1").addEventListener("click", function () { touchdownMove(37) })
		document.querySelector(".up1").addEventListener("click", function () { touchdownMove(38) })
		document.querySelector(".right1").addEventListener("click", function () { touchdownMove(39) })
		document.querySelector(".down1").addEventListener("click", function () { touchdownMove(40) })
		canplay = true;
	})

	function transport(maps, x, y) {
		map = maps;
		player1_x = x
		player1_y = y
		robot.x = player1_x * 50 - 25;
		robot.y = player1_y * 50 - 25;
		location = (player1_x) * 100 + (player1_y);
		mapChangeFn()
		titleChangeFn();
	}

	function item(item) {
		item = true;
	}

	//items
	let library_key = false;

	//events
	let library_ghost = true;

	function mapChoose() {
		if (map === 1) {
			blocks[101] = "stone_bricks"; blocks[102] = "mossy_stone_bricks"; blocks[103] = "mossy_stone_bricks"; blocks[104] = "stone_bricks"; blocks[105] = "cracked_stone_bricks"; blocks[106] = "stone_bricks"; blocks[107] = "cracked_stone_bricks"; blocks[108] = "stone_bricks"; blocks[109] = "stone_bricks"; blocks[110] = "stone_bricks"; blocks[111] = "mossy_stone_bricks"; blocks[112] = "mossy_stone_bricks"; blocks[201] = "stone_bricks"; blocks[202] = "bookshelf"; blocks[203] = "glowstone"; blocks[211] = "glowstone"; blocks[212] = "mossy_stone_bricks"; blocks[301] = "cracked_stone_bricks"; blocks[302] = "bookshelf"; blocks[312] = "stone_bricks"; blocks[401] = "cracked_stone_bricks"; blocks[402] = "bookshelf"; blocks[407] = "composter"; blocks[408] = "composter"; blocks[409] = "composter"; blocks[412] = "stone_bricks"; blocks[501] = "stone_bricks"; blocks[502] = "bookshelf"; blocks[507] = "crafting_table"; blocks[512] = "stone_bricks"; blocks[602] = "oak_door"; blocks[607] = "enchanting_table"; blocks[612] = "cracked_stone_bricks"; blocks[701] = "cracked_stone_bricks"; blocks[702] = "bookshelf"; blocks[707] = "cartography_table"; blocks[712] = "cracked_stone_bricks"; blocks[801] = "stone_bricks"; blocks[802] = "bookshelf"; blocks[807] = "composter"; blocks[808] = "composter"; blocks[809] = "composter"; blocks[812] = "stone_bricks"; blocks[901] = "stone_bricks"; blocks[902] = "bookshelf"; blocks[912] = "mossy_stone_bricks"; blocks[1001] = "stone_bricks"; blocks[1002] = "bookshelf"; blocks[1003] = "glowstone"; blocks[1011] = "glowstone"; blocks[1012] = "mossy_stone_bricks"; blocks[1101] = "mossy_stone_bricks"; blocks[1102] = "bookshelf"; blocks[1103] = "cauldron"; blocks[1104] = "jukebox"; blocks[1105] = "smithing_table"; blocks[1106] = "fletching_table"; blocks[1107] = "brewing_stand"; blocks[1108] = "brewing_stand"; blocks[1109] = "blast_furnace"; blocks[1110] = "smoker"; blocks[1111] = "redstone_block"; blocks[1112] = "stone_bricks"; blocks[1201] = "mossy_stone_bricks"; blocks[1202] = "mossy_stone_bricks"; blocks[1203] = "stone_bricks"; blocks[1204] = "cracked_stone_bricks"; blocks[1205] = "stone_bricks"; blocks[1206] = "mossy_stone_bricks"; blocks[1207] = "mossy_stone_bricks"; blocks[1208] = "mossy_stone_bricks"; blocks[1209] = "mossy_stone_bricks"; blocks[1210] = "stone_bricks"; blocks[1211] = "stone_bricks"; blocks[1212] = "cracked_stone_bricks";
			floor("oak_planks");
			layer2[601] = "podzol"; layer2[602] = "podzol";
			events[602] = { "map": 2, "x": 6, "y": 13 };
		} else if (map === 2) {
			blocks[101] = "soul_sand"; blocks[102] = "soul_sand"; blocks[103] = "dark_prismarine"; blocks[104] = "dark_prismarine"; blocks[107] = "dark_prismarine"; blocks[108] = "soul_sand"; blocks[109] = "soul_sand"; blocks[110] = "soul_sand"; blocks[111] = "soul_sand"; blocks[112] = "soul_sand"; blocks[201] = "soul_sand"; blocks[202] = "soul_sand"; blocks[203] = "dark_prismarine"; blocks[207] = "dark_prismarine"; blocks[208] = "soul_sand"; blocks[209] = "soul_sand"; blocks[210] = "soul_sand"; blocks[211] = "soul_sand"; blocks[212] = "soul_sand"; blocks[301] = "soul_sand"; blocks[302] = "dark_prismarine"; blocks[307] = "dark_prismarine"; blocks[308] = "soul_sand"; blocks[309] = "soul_sand"; blocks[310] = "soul_sand"; blocks[311] = "soul_sand"; blocks[312] = "soul_sand"; blocks[401] = "dark_prismarine"; blocks[406] = "dark_prismarine"; blocks[407] = "soul_sand"; blocks[408] = "soul_sand"; blocks[409] = "soul_sand"; blocks[410] = "soul_sand"; blocks[411] = "soul_sand"; blocks[412] = "soul_sand"; blocks[501] = "dark_prismarine"; blocks[505] = "dark_prismarine"; blocks[506] = "soul_sand"; blocks[507] = "soul_sand"; blocks[508] = "soul_sand"; blocks[509] = "soul_sand"; blocks[510] = "dark_prismarine"; blocks[511] = "dark_prismarine"; blocks[512] = "dark_prismarine"; blocks[601] = "dark_prismarine"; blocks[605] = "dark_prismarine"; blocks[606] = "soul_sand"; blocks[607] = "soul_sand"; blocks[608] = "soul_sand"; blocks[609] = "dark_prismarine"; blocks[701] = "soul_sand"; blocks[702] = "dark_prismarine"; blocks[706] = "dark_prismarine"; blocks[707] = "soul_sand"; blocks[708] = "dark_prismarine"; blocks[712] = "dark_prismarine"; blocks[801] = "soul_sand"; blocks[802] = "dark_prismarine"; blocks[807] = "dark_prismarine"; blocks[811] = "dark_prismarine"; blocks[812] = "soul_sand"; blocks[901] = "soul_sand"; blocks[902] = "soul_sand"; blocks[903] = "dark_prismarine"; blocks[909] = "dark_prismarine"; blocks[910] = "dark_prismarine"; blocks[911] = "soul_sand"; blocks[912] = "soul_sand"; blocks[1001] = "soul_sand"; blocks[1002] = "soul_sand"; blocks[1003] = "soul_sand"; blocks[1004] = "dark_prismarine"; blocks[1008] = "dark_prismarine"; blocks[1009] = "soul_sand"; blocks[1010] = "soul_sand"; blocks[1011] = "soul_sand"; blocks[1012] = "soul_sand"; blocks[1101] = "soul_sand"; blocks[1102] = "soul_sand"; blocks[1103] = "soul_sand"; blocks[1104] = "soul_sand"; blocks[1105] = "dark_prismarine"; blocks[1106] = "dark_prismarine"; blocks[1107] = "dark_prismarine"; blocks[1108] = "soul_sand"; blocks[1109] = "soul_sand"; blocks[1110] = "soul_sand"; blocks[1111] = "soul_sand"; blocks[1112] = "soul_sand"; blocks[1201] = "soul_sand"; blocks[1202] = "soul_sand"; blocks[1203] = "soul_sand"; blocks[1204] = "soul_sand"; blocks[1205] = "soul_sand"; blocks[1206] = "soul_sand"; blocks[1207] = "soul_sand"; blocks[1208] = "soul_sand"; blocks[1209] = "soul_sand"; blocks[1210] = "soul_sand"; blocks[1211] = "soul_sand"; blocks[1212] = "soul_sand";
			floor("podzol");
			events[613] = { "map": 1, "x": 6, "y": 2 };
			events[5] = { "map": 3, "x": 13, "y": 5 };
			events[6] = { "map": 3, "x": 13, "y": 6 };
		} else if (map === 3) {
			blocks[101]="dark_prismarine";blocks[105]="dark_prismarine";blocks[106]="soul_sand";blocks[107]="soul_sand";blocks[108]="soul_sand";blocks[109]="soul_sand";blocks[110]="dark_prismarine";blocks[201]="soul_sand";blocks[202]="dark_prismarine";blocks[205]="dark_prismarine";blocks[206]="soul_sand";blocks[207]="soul_sand";blocks[208]="soul_sand";blocks[209]="dark_prismarine";blocks[301]="soul_sand";blocks[302]="dark_prismarine";blocks[305]="dark_prismarine";blocks[306]="soul_sand";blocks[307]="soul_sand";blocks[308]="dark_prismarine";blocks[312]="dark_prismarine";blocks[401]="soul_sand";blocks[402]="dark_prismarine";blocks[406]="dark_prismarine";blocks[407]="dark_prismarine";blocks[411]="dark_prismarine";blocks[412]="soul_sand";blocks[501]="soul_sand";blocks[502]="dark_prismarine";blocks[506]="dark_prismarine";blocks[510]="dark_prismarine";blocks[511]="soul_sand";blocks[512]="soul_sand";blocks[601]="soul_sand";blocks[602]="soul_sand";blocks[603]="dark_prismarine";blocks[609]="dark_prismarine";blocks[610]="soul_sand";blocks[611]="soul_sand";blocks[612]="soul_sand";blocks[701]="soul_sand";blocks[702]="soul_sand";blocks[703]="dark_prismarine";blocks[708]="dark_prismarine";blocks[709]="soul_sand";blocks[710]="soul_sand";blocks[711]="soul_sand";blocks[712]="soul_sand";blocks[801]="soul_sand";blocks[802]="soul_sand";blocks[803]="dark_prismarine";blocks[807]="dark_prismarine";blocks[808]="soul_sand";blocks[809]="soul_sand";blocks[810]="soul_sand";blocks[811]="soul_sand";blocks[812]="soul_sand";blocks[901]="soul_sand";blocks[902]="soul_sand";blocks[903]="soul_sand";blocks[904]="dark_prismarine";blocks[907]="dark_prismarine";blocks[908]="soul_sand";blocks[909]="soul_sand";blocks[910]="soul_sand";blocks[911]="soul_sand";blocks[912]="soul_sand";blocks[1001]="soul_sand";blocks[1002]="soul_sand";blocks[1003]="soul_sand";blocks[1004]="dark_prismarine";blocks[1007]="dark_prismarine";blocks[1008]="soul_sand";blocks[1009]="soul_sand";blocks[1010]="soul_sand";blocks[1011]="soul_sand";blocks[1012]="soul_sand";blocks[1101]="soul_sand";blocks[1102]="soul_sand";blocks[1103]="soul_sand";blocks[1104]="dark_prismarine";blocks[1107]="dark_prismarine";blocks[1108]="soul_sand";blocks[1109]="soul_sand";blocks[1110]="soul_sand";blocks[1111]="soul_sand";blocks[1112]="soul_sand";blocks[1201]="soul_sand";blocks[1202]="soul_sand";blocks[1203]="soul_sand";blocks[1204]="dark_prismarine";blocks[1207]="dark_prismarine";blocks[1208]="soul_sand";blocks[1209]="soul_sand";blocks[1210]="soul_sand";blocks[1211]="soul_sand";blocks[1212]="soul_sand";
			floor("podzol");
			events[1305] = { "map": 2, "x": 0, "y": 5 };
			events[1306] = { "map": 2, "x": 0, "y": 6 };
			events[2] = { "map": 4, "x": 13, "y": 2 };
			events[3] = { "map": 4, "x": 13, "y": 3 };
			events[4] = { "map": 4, "x": 13, "y": 4 };
		} else if (map === 4) {
			blocks[101]="cobweb";blocks[102]="spruce_planks";blocks[103]="spruce_planks";blocks[104]="spruce_planks";blocks[105]="spruce_planks";blocks[106]="spruce_planks";blocks[107]="spruce_planks";blocks[108]="spruce_planks";blocks[109]="ladder";blocks[110]="ladder";blocks[112]="cobweb";blocks[202]="spruce_planks";blocks[203]="spruce_planks";blocks[204]="spruce_planks";blocks[205]="spruce_planks";blocks[206]="spruce_planks";blocks[207]="spruce_planks";blocks[208]="spruce_planks";blocks[209]="dark_oak_planks";blocks[210]="dark_oak_planks";blocks[301]="cobweb";blocks[302]="spruce_planks";blocks[303]="spruce_planks";blocks[304]="spruce_planks";blocks[305]="spruce_planks";blocks[306]="spruce_planks";blocks[307]="spruce_planks";blocks[308]="spruce_planks";blocks[309]="dark_oak_planks";blocks[310]="dark_oak_planks";blocks[312]="cobweb";blocks[402]="spruce_planks";blocks[403]="spruce_planks";blocks[404]="spruce_planks";blocks[405]="spruce_planks";blocks[406]="spruce_planks";blocks[407]="spruce_planks";blocks[408]="spruce_planks";blocks[409]="dark_oak_planks";blocks[410]="dark_oak_planks";blocks[502]="spruce_planks";blocks[503]="spruce_planks";blocks[504]="spruce_planks";blocks[505]="spruce_planks";blocks[506]="spruce_planks";blocks[507]="spruce_planks";blocks[508]="spruce_planks";blocks[509]="dark_oak_planks";blocks[510]="dark_oak_planks";blocks[511]="cobweb";blocks[602]="spruce_planks";blocks[603]="spruce_planks";blocks[604]="oak_door";blocks[605]="spruce_planks";blocks[606]="spruce_planks";blocks[607]="spruce_planks";blocks[608]="spruce_planks";blocks[609]="dark_oak_planks";blocks[610]="dark_oak_planks";blocks[706]="cobweb";blocks[707]="cobweb";blocks[709]="cobweb";blocks[811]="cobweb";blocks[812]="dark_prismarine";blocks[901]="cobweb";blocks[903]="cobweb";blocks[908]="cobweb";blocks[911]="dark_prismarine";blocks[912]="soul_sand";blocks[1001]="dark_prismarine";blocks[1002]="iron_bars";blocks[1006]="dark_prismarine";blocks[1007]="dark_prismarine";blocks[1008]="dark_prismarine";blocks[1009]="dark_prismarine";blocks[1010]="dark_prismarine";blocks[1011]="soul_sand";blocks[1012]="soul_sand";blocks[1101]="dark_prismarine";blocks[1104]="iron_bars";blocks[1105]="dark_prismarine";blocks[1106]="soul_sand";blocks[1107]="soul_sand";blocks[1108]="soul_sand";blocks[1109]="soul_sand";blocks[1110]="soul_sand";blocks[1111]="soul_sand";blocks[1112]="soul_sand";blocks[1201]="dark_prismarine";blocks[1205]="dark_prismarine";blocks[1206]="soul_sand";blocks[1207]="soul_sand";blocks[1208]="soul_sand";blocks[1209]="soul_sand";blocks[1210]="soul_sand";blocks[1211]="soul_sand";blocks[1212]="soul_sand";
			floor("podzol");
			layer2[109]="dark_oak_planks";layer2[110]="dark_oak_planks";
			events[1302] = { "map": 3, "x": 0, "y": 2 };
			events[1303] = { "map": 3, "x": 0, "y": 3 };
			events[1304] = { "map": 3, "x": 0, "y": 4 };
			events[604] = { "map": 5, "x": 12, "y": 7 };
		} else if (map === 5) {
			blocks[101]="spruce_planks";blocks[102]="spruce_planks";blocks[103]="spruce_planks";blocks[104]="spruce_planks";blocks[105]="spruce_planks";blocks[106]="spruce_planks";blocks[107]="oak_door";blocks[108]="spruce_planks";blocks[109]="spruce_planks";blocks[110]="frosted_ice";blocks[111]="frosted_ice";blocks[112]="spruce_planks";blocks[201]="bookshelf";blocks[202]="beehive";blocks[204]="cartography_table";blocks[205]="spruce_planks";blocks[206]="spruce_planks";blocks[208]="spruce_planks";blocks[209]="spruce_planks";blocks[210]="cauldron";blocks[211]="cauldron";blocks[212]="spruce_planks";blocks[301]="bookshelf";blocks[302]="beehive";blocks[304]="scaffolding";blocks[305]="spruce_planks";blocks[306]="spruce_planks";blocks[308]="spruce_planks";blocks[309]="spruce_planks";blocks[312]="spruce_planks";blocks[401]="bookshelf";blocks[402]="beehive";blocks[406]="dark_oak_door";blocks[408]="dark_oak_door";blocks[412]="spruce_planks";blocks[501]="bookshelf";blocks[502]="loom";blocks[504]="brewing_stand";blocks[505]="spruce_planks";blocks[506]="spruce_planks";blocks[508]="spruce_planks";blocks[509]="spruce_planks";blocks[510]="acacia_door";blocks[511]="acacia_door";blocks[512]="spruce_planks";blocks[601]="spruce_planks";blocks[602]="spruce_planks";blocks[603]="spruce_planks";blocks[604]="spruce_planks";blocks[605]="spruce_planks";blocks[606]="spruce_planks";blocks[608]="spruce_planks";blocks[609]="spruce_planks";blocks[610]="barrel";blocks[611]="barrel_open";blocks[612]="spruce_planks";blocks[701]="spruce_planks";blocks[702]="spruce_planks";blocks[703]="spruce_planks";blocks[704]="spruce_planks";blocks[705]="spruce_planks";blocks[706]="spruce_planks";blocks[708]="spruce_planks";blocks[709]="spruce_planks";blocks[710]="ice";blocks[711]="frosted_ice";blocks[712]="spruce_planks";blocks[801]="bookshelf";blocks[802]="bookshelf";blocks[803]="bookshelf";blocks[804]="bookshelf";blocks[805]="spruce_planks";blocks[806]="spruce_planks";blocks[808]="spruce_planks";blocks[809]="spruce_planks";blocks[810]="cauldron";blocks[811]="cauldron";blocks[812]="spruce_planks";blocks[901]="bookshelf";blocks[905]="spruce_planks";blocks[906]="spruce_planks";blocks[908]="spruce_planks";blocks[909]="spruce_planks";blocks[912]="spruce_planks";blocks[1001]="bookshelf";blocks[1003]="enchanting_table";blocks[1006]="dark_oak_door";blocks[1008]="dark_oak_door";blocks[1012]="spruce_planks";blocks[1101]="bookshelf";blocks[1105]="spruce_planks";blocks[1106]="spruce_planks";blocks[1108]="spruce_planks";blocks[1109]="spruce_planks";blocks[1110]="acacia_door";blocks[1111]="acacia_door";blocks[1112]="spruce_planks";blocks[1201]="spruce_planks";blocks[1202]="spruce_planks";blocks[1203]="spruce_planks";blocks[1204]="spruce_planks";blocks[1205]="spruce_planks";blocks[1206]="spruce_planks";blocks[1207]="oak_door";blocks[1208]="spruce_planks";blocks[1209]="spruce_planks";blocks[1210]="barrel";blocks[1211]="barrel";blocks[1212]="spruce_planks";
			floor("oak_planks");
			layer2[107]="black_wool";layer2[409]="pink_wool";layer2[510]="pink_wool";layer2[511]="pink_wool";layer2[1009]="light_blue_wool";layer2[1110]="light_blue_wool";layer2[1111]="light_blue_wool";
			events[1207] = { "map": 4, "x": 6, "y": 4 };
			events[107] = { "map": 6, "x": 12, "y": 7 };
		} else if (map === 6) {
			blocks[101]="spruce_planks";blocks[102]="spruce_planks";blocks[103]="spruce_planks";blocks[104]="spruce_planks";blocks[105]="spruce_planks";blocks[106]="spruce_planks";blocks[107]="iron_door";blocks[108]="spruce_planks";blocks[109]="spruce_planks";blocks[110]="spruce_planks";blocks[111]="spruce_planks";blocks[112]="spruce_planks";blocks[201]="ladder";blocks[202]="ladder";blocks[210]="bookshelf";blocks[211]="spruce_planks";blocks[212]="spruce_planks";blocks[301]="spruce_planks";blocks[302]="bookshelf";blocks[304]="bookshelf";blocks[306]="bookshelf";blocks[308]="bookshelf";blocks[310]="bookshelf";blocks[311]="spruce_planks";blocks[312]="spruce_planks";blocks[401]="spruce_planks";blocks[402]="bookshelf";blocks[404]="bookshelf";blocks[406]="bookshelf";blocks[408]="bookshelf";blocks[410]="bookshelf";blocks[411]="spruce_planks";blocks[412]="spruce_planks";blocks[501]="spruce_planks";blocks[502]="bookshelf";blocks[504]="bookshelf";blocks[506]="bookshelf";blocks[508]="bookshelf";blocks[510]="bookshelf";blocks[511]="spruce_planks";blocks[512]="spruce_planks";blocks[601]="spruce_planks";blocks[602]="bookshelf";blocks[604]="bookshelf";blocks[606]="bookshelf";blocks[608]="bookshelf";blocks[610]="bookshelf";blocks[611]="spruce_planks";blocks[612]="spruce_planks";blocks[701]="spruce_planks";blocks[702]="bookshelf";blocks[704]="bookshelf";blocks[706]="bookshelf";blocks[708]="bookshelf";blocks[710]="bookshelf";blocks[711]="spruce_planks";blocks[712]="spruce_planks";blocks[801]="spruce_planks";blocks[802]="bookshelf";blocks[804]="bookshelf";blocks[806]="bookshelf";blocks[808]="bookshelf";blocks[810]="bookshelf";blocks[811]="spruce_planks";blocks[812]="spruce_planks";blocks[901]="spruce_planks";blocks[902]="bookshelf";blocks[904]="bookshelf";blocks[906]="bookshelf";blocks[908]="bookshelf";blocks[910]="bookshelf";blocks[911]="spruce_planks";blocks[912]="spruce_planks";blocks[1001]="spruce_planks";blocks[1002]="bookshelf";blocks[1004]="bookshelf";blocks[1006]="bookshelf";blocks[1008]="bookshelf";blocks[1010]="bookshelf";blocks[1011]="spruce_planks";blocks[1012]="spruce_planks";blocks[1101]="spruce_planks";blocks[1102]="bookshelf";blocks[1110]="bookshelf";blocks[1111]="spruce_planks";blocks[1112]="spruce_planks";blocks[1201]="spruce_planks";blocks[1202]="spruce_planks";blocks[1203]="spruce_planks";blocks[1204]="spruce_planks";blocks[1205]="spruce_planks";blocks[1206]="spruce_planks";blocks[1207]="oak_door";blocks[1208]="spruce_planks";blocks[1209]="spruce_planks";blocks[1210]="spruce_planks";blocks[1211]="spruce_planks";blocks[1212]="spruce_planks";
			floor("oak_planks");
			layer2[107]="black_wool";layer2[201]="spruce_planks";layer2[202]="bookshelf";layer2[206]="cobweb";layer2[211]="cobweb";layer2[303]="cobweb";layer2[305]="cobweb";layer2[309]="cobweb";layer2[603]="cobweb";layer2[607]="cobweb";layer2[703]="cobweb";layer2[705]="cobweb";layer2[809]="cobweb";layer2[811]="cobweb";layer2[911]="cobweb";layer2[1009]="cobweb";layer2[1011]="cobweb";layer2[1103]="cobweb";layer2[1110]="cobweb";layer2[1111]="cobweb";
			events[1207] = { "map": 5, "x": 1, "y": 7 };
			events[202] = { "map": 7, "x": 2, "y": 3 };
		} else if (map === 7) {
			blocks[101]="bookshelf";blocks[102]="bookshelf";blocks[103]="bookshelf";blocks[104]="bookshelf";blocks[105]="bookshelf";blocks[106]="bookshelf";blocks[107]="bookshelf";blocks[108]="bookshelf";blocks[109]="bookshelf";blocks[110]="bookshelf";blocks[111]="bookshelf";blocks[112]="bookshelf";blocks[201]="ladder";blocks[212]="bookshelf";blocks[301]="bookshelf";blocks[303]="piston";blocks[304]="piston";blocks[305]="piston";blocks[306]="piston";blocks[307]="piston";blocks[308]="piston";blocks[309]="piston";blocks[310]="piston";blocks[312]="bookshelf";blocks[401]="bookshelf";blocks[403]="piston";blocks[404]="bookshelf";blocks[406]="bookshelf";blocks[408]="bookshelf";blocks[410]="piston";blocks[412]="bookshelf";blocks[501]="bookshelf";blocks[503]="piston";blocks[504]="bookshelf";blocks[506]="bookshelf";blocks[508]="bookshelf";blocks[510]="piston";blocks[512]="bookshelf";blocks[601]="bookshelf";blocks[603]="piston";blocks[604]="bookshelf";blocks[606]="bookshelf";blocks[607]="cobweb";blocks[608]="bookshelf";blocks[610]="piston";blocks[612]="bookshelf";blocks[701]="bookshelf";blocks[703]="piston";blocks[704]="bookshelf";blocks[705]="cobweb";blocks[706]="bookshelf";blocks[708]="bookshelf";blocks[710]="piston";blocks[712]="bookshelf";blocks[801]="bookshelf";blocks[803]="piston";blocks[804]="bookshelf";blocks[806]="bookshelf";blocks[808]="bookshelf";blocks[809]="cobweb";blocks[810]="piston";blocks[812]="bookshelf";blocks[901]="bookshelf";blocks[903]="piston";blocks[904]="bookshelf";blocks[906]="bookshelf";blocks[908]="bookshelf";blocks[910]="piston";blocks[912]="bookshelf";blocks[1001]="bookshelf";blocks[1003]="piston";blocks[1004]="piston";blocks[1005]="piston";blocks[1006]="piston";blocks[1007]="piston";blocks[1008]="piston";blocks[1009]="piston";blocks[1010]="piston";blocks[1012]="bookshelf";blocks[1101]="bookshelf";blocks[1112]="bookshelf";blocks[1201]="bookshelf";blocks[1202]="bookshelf";blocks[1203]="bookshelf";blocks[1204]="bookshelf";blocks[1205]="bookshelf";blocks[1206]="enchanting_table";blocks[1207]="bookshelf";blocks[1208]="bookshelf";blocks[1209]="bookshelf";blocks[1210]="bookshelf";blocks[1211]="bookshelf";blocks[1212]="bookshelf";
			floor("oak_planks");
			layer2[201]="spruce_planks";layer2[405]="spruce_planks";layer2[407]="spruce_planks";layer2[409]="spruce_planks";layer2[505]="spruce_planks";layer2[507]="spruce_planks";layer2[509]="spruce_planks";layer2[605]="spruce_planks";layer2[607]="spruce_planks";layer2[609]="spruce_planks";layer2[705]="spruce_planks";layer2[707]="spruce_planks";layer2[709]="spruce_planks";layer2[805]="spruce_planks";layer2[807]="spruce_planks";layer2[809]="spruce_planks";layer2[905]="spruce_planks";layer2[907]="spruce_planks";layer2[909]="spruce_planks";
			events[201] = { "map": 6, "x": 2, "y": 4 };
			events[1207] = { "item": library_key };
		} else if (map === 8) {
			blocks[101]="bookshelf";blocks[102]="bookshelf";blocks[103]="bookshelf";blocks[104]="bookshelf";blocks[105]="bookshelf";blocks[106]="bookshelf";blocks[107]="bookshelf";blocks[108]="bookshelf";blocks[109]="bookshelf";blocks[110]="bookshelf";blocks[111]="bookshelf";blocks[112]="bookshelf";blocks[201]="ladder";blocks[212]="bookshelf";blocks[301]="bookshelf";blocks[303]="piston";blocks[304]="piston";blocks[305]="piston";blocks[306]="piston";blocks[307]="piston";blocks[308]="piston";blocks[309]="piston";blocks[310]="piston";blocks[312]="bookshelf";blocks[401]="bookshelf";blocks[403]="piston";blocks[404]="bookshelf";blocks[406]="bookshelf";blocks[408]="bookshelf";blocks[410]="piston";blocks[412]="bookshelf";blocks[501]="bookshelf";blocks[503]="piston";blocks[504]="bookshelf";blocks[506]="bookshelf";blocks[508]="bookshelf";blocks[510]="piston";blocks[512]="bookshelf";blocks[601]="bookshelf";blocks[603]="piston";blocks[604]="bookshelf";blocks[606]="bookshelf";blocks[607]="cobweb";blocks[608]="bookshelf";blocks[610]="piston";blocks[612]="bookshelf";blocks[701]="bookshelf";blocks[703]="piston";blocks[704]="bookshelf";blocks[705]="cobweb";blocks[706]="bookshelf";blocks[708]="bookshelf";blocks[710]="piston";blocks[712]="bookshelf";blocks[801]="bookshelf";blocks[803]="piston";blocks[804]="bookshelf";blocks[806]="bookshelf";blocks[808]="bookshelf";blocks[809]="cobweb";blocks[810]="piston";blocks[812]="bookshelf";blocks[901]="bookshelf";blocks[903]="piston";blocks[904]="bookshelf";blocks[906]="bookshelf";blocks[908]="bookshelf";blocks[910]="piston";blocks[912]="bookshelf";blocks[1001]="bookshelf";blocks[1003]="piston";blocks[1004]="piston";blocks[1005]="piston";blocks[1006]="piston";blocks[1007]="piston";blocks[1008]="piston";blocks[1009]="piston";blocks[1010]="piston";blocks[1012]="bookshelf";blocks[1101]="bookshelf";blocks[1112]="bookshelf";blocks[1201]="bookshelf";blocks[1202]="bookshelf";blocks[1203]="bookshelf";blocks[1204]="bookshelf";blocks[1205]="bookshelf";blocks[1206]="enchanting_table";blocks[1207]="bookshelf";blocks[1208]="bookshelf";blocks[1209]="bookshelf";blocks[1210]="bookshelf";blocks[1211]="bookshelf";blocks[1212]="bookshelf";
			floor("oak_planks");
			layer2[201]="spruce_planks";layer2[405]="spruce_planks";layer2[407]="spruce_planks";layer2[409]="spruce_planks";layer2[505]="spruce_planks";layer2[507]="spruce_planks";layer2[509]="spruce_planks";layer2[605]="spruce_planks";layer2[607]="spruce_planks";layer2[609]="spruce_planks";layer2[705]="spruce_planks";layer2[707]="spruce_planks";layer2[709]="spruce_planks";layer2[805]="spruce_planks";layer2[807]="spruce_planks";layer2[809]="spruce_planks";layer2[905]="spruce_planks";layer2[907]="spruce_planks";layer2[909]="spruce_planks";
			events[201] = { "map": 6, "x": 2, "y": 4 };
		} else if (map === 9) {
			blocks[101]="dark_oak_planks";blocks[102]="dark_oak_planks";blocks[103]="dark_oak_planks";blocks[104]="dark_oak_planks";blocks[105]="dark_oak_planks";blocks[106]="dark_oak_planks";blocks[107]="iron_door";blocks[108]="dark_oak_planks";blocks[109]="dark_oak_planks";blocks[110]="dark_oak_planks";blocks[111]="dark_oak_planks";blocks[112]="dark_oak_planks";blocks[201]="ladder";blocks[202]="ladder";blocks[206]="cobweb";blocks[210]="bookshelf2";blocks[211]="dark_oak_planks";blocks[212]="dark_oak_planks";blocks[301]="dark_oak_planks";blocks[302]="bookshelf2";blocks[303]="cobweb";blocks[304]="bookshelf2";blocks[305]="cobweb";blocks[306]="bookshelf2";blocks[308]="bookshelf2";blocks[309]="cobweb";blocks[310]="bookshelf2";blocks[311]="dark_oak_planks";blocks[312]="dark_oak_planks";blocks[401]="dark_oak_planks";blocks[402]="bookshelf2";blocks[404]="bookshelf2";blocks[406]="bookshelf2";blocks[408]="bookshelf2";blocks[410]="bookshelf2";blocks[411]="dark_oak_planks";blocks[412]="dark_oak_planks";blocks[501]="dark_oak_planks";blocks[502]="bookshelf2";blocks[504]="bookshelf2";blocks[506]="bookshelf2";blocks[508]="bookshelf2";blocks[510]="bookshelf2";blocks[511]="dark_oak_planks";blocks[512]="dark_oak_planks";blocks[601]="dark_oak_planks";blocks[602]="bookshelf2";blocks[603]="cobweb";blocks[604]="bookshelf2";blocks[605]="cobweb";blocks[606]="bookshelf2";blocks[608]="bookshelf2";blocks[610]="bookshelf2";blocks[611]="dark_oak_planks";blocks[612]="dark_oak_planks";blocks[701]="dark_oak_planks";blocks[702]="bookshelf2";blocks[703]="cobweb";blocks[704]="bookshelf2";blocks[706]="bookshelf2";blocks[708]="bookshelf2";blocks[710]="bookshelf2";blocks[711]="dark_oak_planks";blocks[712]="dark_oak_planks";blocks[801]="dark_oak_planks";blocks[802]="bookshelf2";blocks[804]="bookshelf2";blocks[806]="bookshelf2";blocks[808]="bookshelf2";blocks[809]="cobweb";blocks[810]="bookshelf2";blocks[811]="dark_oak_planks";blocks[812]="dark_oak_planks";blocks[901]="dark_oak_planks";blocks[902]="bookshelf2";blocks[904]="bookshelf2";blocks[906]="bookshelf2";blocks[908]="bookshelf2";blocks[910]="bookshelf2";blocks[911]="dark_oak_planks";blocks[912]="dark_oak_planks";blocks[1001]="dark_oak_planks";blocks[1002]="bookshelf2";blocks[1004]="bookshelf2";blocks[1006]="bookshelf2";blocks[1008]="bookshelf2";blocks[1009]="cobweb";blocks[1010]="bookshelf2";blocks[1011]="dark_oak_planks";blocks[1012]="dark_oak_planks";blocks[1101]="dark_oak_planks";blocks[1102]="bookshelf2";blocks[1103]="cobweb";blocks[1110]="bookshelf2";blocks[1111]="dark_oak_planks";blocks[1112]="dark_oak_planks";blocks[1201]="dark_oak_planks";blocks[1202]="dark_oak_planks";blocks[1203]="dark_oak_planks";blocks[1204]="dark_oak_planks";blocks[1205]="dark_oak_planks";blocks[1206]="dark_oak_planks";blocks[1207]="oak_door";blocks[1208]="dark_oak_planks";blocks[1209]="dark_oak_planks";blocks[1210]="dark_oak_planks";blocks[1211]="dark_oak_planks";blocks[1212]="dark_oak_planks";
			floor("oak_planks");
			layer2[201]="spruce_planks";layer2[405]="spruce_planks";layer2[407]="spruce_planks";layer2[409]="spruce_planks";layer2[505]="spruce_planks";layer2[507]="spruce_planks";layer2[509]="spruce_planks";layer2[605]="spruce_planks";layer2[607]="spruce_planks";layer2[609]="spruce_planks";layer2[705]="spruce_planks";layer2[707]="spruce_planks";layer2[709]="spruce_planks";layer2[805]="spruce_planks";layer2[807]="spruce_planks";layer2[809]="spruce_planks";layer2[905]="spruce_planks";layer2[907]="spruce_planks";layer2[909]="spruce_planks";
			events[201] = { "map": 6, "x": 2, "y": 4 };
		}
	}

	function titleChangeFn() {
		if (map === 1) return title.text = "鎮長辦公室";
		if (map === 2) return title.text = "道路";
		if (map === 3) return title.text = "分岔入口";
		if (map === 4) return title.text = "圖書館外";
		if (map === 5) return title.text = "圖書館";
		if (map === 6) return title.text = "圖書館";
		if (map === 7) return title.text = "圖書館2樓";
		if (map === 8) return title.text = "圖書館";
		if (map === 9) return title.text = "圖書館";
	}

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
		exportRoot.setChildIndex(robot, exportRoot.getNumChildren() - 1)
		chat_off();
	}

	function floor(type) {
		for (var i = 0; i < 13; i++) {
			for (var j = 0; j < 13; j++) {
				layer1[i * 100 + j] = type;
			}
		}
	}

	//手機板
	function touchdownMove(e) {
		location = (player1_x) * 100 + (player1_y);
		if (chats === 0 && chatbar_status) return chat_off();
		//Player1

		if (!canplay) return;

		if (e === 37) {
			udlr = true;
			step = STEP * -1;
			isKeyDown = true;
			direction = "left";
			robot.gotoAndPlay(direction);
			box(location)
			if (player1_x === 1) return;
			if (wall((player1_x - 1) * 100 + (player1_y))) return box(location);
			moveFn();
		} else if (e === 38) {
			udlr = false;
			step = STEP * -1;
			isKeyDown = true;
			direction = "up";
			robot.gotoAndPlay(direction);
			box(location)
			if (player1_y === 1) return;
			if (wall((player1_x) * 100 + (player1_y - 1))) return box(location);
			moveFn();
		} else if (e === 39) {
			udlr = true;
			step = STEP;
			isKeyDown = true;
			direction = "right";
			robot.gotoAndPlay(direction);
			box(location)
			if (player1_x === 12) return;
			if (wall((player1_x + 1) * 100 + (player1_y))) return box(location);
			moveFn();
		} else if (e === 40) {
			udlr = false;
			step = STEP;
			isKeyDown = true;
			direction = "down";
			robot.gotoAndPlay(direction);
			box(location)
			if (player1_y === 12) return;
			if (wall((player1_x) * 100 + (player1_y + 1))) return box(location);
			moveFn();
		} else if (e === 191) {

		}
	}


	//左上右下37~40
	function keydownMoveFn(e) {
		//Player1
		location = (player1_x) * 100 + (player1_y);
		if (chats === 0 && chatbar_status) return chat_off();

		if (!canplay) return;

		if (e.keyCode === 37) {
			udlr = true;
			step = STEP * -1;
			direction = "left";
			isKeyDown = true;
			robot.gotoAndPlay(direction);
			box(location)
			if (player1_x === 1) return;
			if (wall(location - 100)) return box(location);
			moveFn();
		} else if (e.keyCode === 38) {
			udlr = false;
			step = STEP * -1;
			direction = "up";
			isKeyDown = true;
			robot.gotoAndPlay(direction);
			box(location)
			if (player1_y === 1) return;
			if (wall(location - 1)) return box(location);
			moveFn();
		} else if (e.keyCode === 39) {
			udlr = true;
			step = STEP;
			direction = "right";
			isKeyDown = true;
			robot.gotoAndPlay(direction);
			box(location)
			if (player1_x === 12) return;
			if (wall(location + 100)) return box(location);
			moveFn();
		} else if (e.keyCode === 40) {
			udlr = false;
			step = STEP;
			direction = "down";
			isKeyDown = true;
			robot.gotoAndPlay(direction);
			box(location)
			if (player1_y === 12) return;
			if (wall(location + 1)) return box(location);
			moveFn();
		} else if (e.keyCode === 191) {

		}
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
		if (events[target] === 0) {
			if (blocks[target] === "bookshelf") return autoChat(1);
			if (blocks[target] === "ladder") return autoChat(2);
			if (blocks[target] === "cauldron") return autoChat(3);
			if (blocks[target] === "jukebox") return autoChat(4);
			if (blocks[target] === "crafting_table") return autoChat(5);
			if (blocks[target] === "furnace") return autoChat(6);
			if (blocks[target] === "furnace_on") return autoChat(7);
			if (blocks[target] === "brewing_stand") return autoChat(8);
			if (blocks[target] === "enchanting_table") return autoChat(9);
			if (blocks[target] === "loom") return autoChat(10);
			if (blocks[target] === "smoker") return autoChat(11);
			if (blocks[target] === "blast_furnace") return autoChat(12);
			if (blocks[target] === "cartography_table") return autoChat(13);
			if (blocks[target] === "fletching_table") return autoChat(14);
			if (blocks[target] === "smithing_table") return autoChat(15);
			if (blocks[target] === "beehive") return autoChat(16);
			if (blocks[target] === "iron_door") return autoChat(17);
			if (blocks[target] === "spawner") return autoChat(18);
			if (blocks[target] === "iron_bars") return autoChat(19);
			if (blocks[target] === "barrel") return autoChat(20);
			if (blocks[target] === "barrel_open") return autoChat(21);
			if (blocks[target] === "scaffolding") return autoChat(22);
			if (blocks[target] === "end_portal_frame") return autoChat(23);
		} else {
			let omap = events[target].map;
			let ox = events[target].x;
			let oy = events[target].y;
			let oitem = events[target].item;
			if (blocks[target] === "oak_door") return transport(omap, ox, oy);
			if (blocks[target] === "ladder") return transport(omap, ox, oy);
			if (blocks[target] === "enchanting_table") return item(oitem);
			if (target%100===13||target%100===0) return transport(omap, ox, oy);
			if (parseInt(target/100)===13||parseInt(target/100)===0) return transport(omap, ox, oy);
		}
	}

	function autoChat(type) {
		line_2 = "";
		line_3 = "";
		if (type === 1) {
			chats = 0;
			speaker = "書櫃";
			line_1 = "除了舊書以外似乎沒有其他東西";
		} else if (type === 2) {
			chats = 0;
			speaker = "樓梯";
			line_1 = "樓梯損毀，無法使用";
		} else if (type === 3) {
			chats = 0;
			speaker = "洗手台";
			line_1 = "水龍頭已經沒有水了";
		} else if (type === 4) {
			chats = 0;
			speaker = "唱片機";
			line_1 = "需要放入唱片";
		} else if (type === 5) {
			chats = 0;
			speaker = "工作台";
			line_1 = "好像是做木工的地方";
			line_2 = "不過桌上沒有東西";
		} else if (type === 6) {
			chats = 0;
			speaker = "爐子";
			line_1 = "爐子裡沒東西";
		} else if (type === 7) {
			chats = 0;
			speaker = "爐子";
			line_1 = "還剩一些餘火";
		} else if (type === 8) {
			chats = 0;
			speaker = "釀造台";
			line_1 = "儀器都生鏽了";
		} else if (type === 9) {
			chats = 0;
			speaker = "精裝桌子";
			line_1 = "好像是用來展示書本的地方";
			line_2 = "不過找不到像樣的書";
		} else if (type === 10) {
			chats = 0;
			speaker = "鋼琴";
			line_1 = "鋼琴上覆著一層厚厚的灰塵";
		} else if (type === 11) {
			chats = 0;
			speaker = "控制爐";
			line_1 = "好像開不起來";
		} else if (type === 12) {
			chats = 0;
			speaker = "火爐";
			line_1 = "正燒著大量的煤，似乎是供應能源的地方";
		} else if (type === 13) {
			chats = 0;
			speaker = "桌子";
			line_1 = "桌上只剩殘破的地圖";
		} else if (type === 14) {
			chats = 0;
			speaker = "桌子";
			line_1 = "桌上有未完成的弓箭";
		} else if (type === 15) {
			chats = 0;
			speaker = "工作檯";
			line_1 = "桌上沒有東西";
		} else if (type === 16) {
			chats = 0;
			speaker = "抽屜";
			line_1 = "抽屜裡沒東西";
		} else if (type === 17) {
			chats = 0;
			speaker = "鐵門";
			line_1 = "需要鑰匙才能開啟";
		} else if (type === 18) {
			chats = 0;
			speaker = "鐵籠";
			line_1 = "不知道裡面放的是甚麼東西，需要工具開啟";
		} else if (type === 19) {
			chats = 0;
			speaker = "鐵柵欄";
			line_1 = "似乎需要工具破壞";
		} else if (type === 20) {
			chats = 0;
			speaker = "儲藏箱";
			line_1 = "無法開啟";
		} else if (type === 21) {
			chats = 0;
			speaker = "儲藏箱";
			line_1 = "空空如也";
		} else if (type === 22) {
			chats = 0;
			speaker = "桌子";
			line_1 = "桌上沒有東西";
		} else if (type === 23) {
			chats = 0;
			speaker = "雕琢過的桌子";
			line_1 = "桌上沒有東西";
		}

		chat_on();
	}

	function chat() {
		line_1 = "";
		line_2 = "";
		line_3 = "";
		if (map === 1) {
			if (chats === 1) {
				speaker = "喃喃自語";
				line_1 = "這裡似乎沒有東西";
			}
		}
		chats++;
		if (chatbar_status) speaking = true;
		if (chatbar_status) chat_on();
	}

	function chat_on() {
		chatbar_status = true;

		exportRoot.setChildIndex(chatbar, exportRoot.getNumChildren() - 1)
		exportRoot.setChildIndex(speakers, exportRoot.getNumChildren() - 1)
		exportRoot.setChildIndex(line1, exportRoot.getNumChildren() - 1)
		exportRoot.setChildIndex(line2, exportRoot.getNumChildren() - 1)
		exportRoot.setChildIndex(line3, exportRoot.getNumChildren() - 1)
		chatbar.visible = true;
		speakers.visible = true;
		line1.visible = true;
		line2.visible = true;
		line3.visible = true;
		speakers.text = "<" + speaker + ">";
		line1.text = line_1;
		line2.text = line_2;
		line3.text = line_3;
		speaking = true;
	}

	function chat_off() {
		if (!chatbar_status) return;
		chatbar.visible = false;
		speakers.visible = false;
		line1.visible = false;
		line2.visible = false;
		line3.visible = false;
		chatbar_status = false;
		speaking = false;
	}

	

	function keyupMoveFn(e) {
		isKeyDown = false;
	}

	//createjs.Ticker.addEventListener("tick", tickFn)
	function moveFn() {

		if (!isKeyDown) return;
		if (speaking) return chat();
		if (udlr) {
			player1_x += step / 50
			robot.x += step;
		} else {
			player1_y += step / 50
			robot.y += step;
		}
		exportRoot.setChildIndex(robot, exportRoot.getNumChildren() - 1)
	}


	function die_detect() {
		if (!canplay) return;
		if (p1die) {
			canplay = false;
			robot.gotoAndPlay("explore");
			document.getElementById("win").classList.remove("win");
			document.getElementById("win").classList.add("p2win");
			end_detect();
			return;
		}
	}


	function end_detect() {
		if (!canplay) {
			document.getElementById("reload_back").classList.remove("reload_back0");
			document.getElementById("reload_back").classList.add("reload_back");
			document.getElementById("reload").classList.remove("reload0");
			document.getElementById("reload").classList.add("reload");
		}
	}












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