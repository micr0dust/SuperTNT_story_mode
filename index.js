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
	let txtEvt1, txtEvt2, txtEvt3;
	let choosing = false;
	let fog_range = 2;
	let fog_enable = false;

	let chatbar = new lib.chat_bar();
	summon(chatbar, 0, 430, "visible", false);

	let pic = new lib.blocks();
	pic.scaleX = 2.6;
	pic.scaleY = 2.6;
	summon(pic, 75, 515, "air", true);

	let speakers = new createjs.Text("<" + speaker + ">", "bold 20px Arial", "white");
	speakers.textBaseline = "alphabetic";
	summon(speakers, 150, 465, 0, false);

	//text hitArea
	var txthitArea = new createjs.Shape();
	txthitArea.graphics.beginFill("#000").drawRect(-20, -20, 200, 20);

	let line1 = new createjs.Text(line_1, "bold 20px Arial", "white");
	line1.textBaseline = "alphabetic";
	summon(line1, 150, 500, 0, false);
	line1.hitArea = txthitArea;
	line1.addEventListener('click', function () {
		if (txtEvt1) txtEvtFn(txtEvt1);
	});

	let line2 = new createjs.Text(line_2, "bold 20px Arial", "white");
	line2.textBaseline = "alphabetic";
	summon(line2, 150, 525, 0, false);
	line2.hitArea = txthitArea;
	line2.addEventListener('click', function () {
		if (txtEvt2) txtEvtFn(txtEvt2);
	});

	let line3 = new createjs.Text(line_3, "bold 20px Arial", "white");
	line3.textBaseline = "alphabetic";
	summon(line3, 150, 550, 0, false);
	line3.hitArea = txthitArea;
	line3.addEventListener('click', function () {
		if (txtEvt3) txtEvtFn(txtEvt3);
	});

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

	//jumpscare
	var jumpscare = new lib.scare();
	summon(jumpscare, 0, 0, "none", false);

	//items hitArea
	var hitArea = new createjs.Shape();
	hitArea.graphics.beginFill("#000").drawRect(0, 0, 50, 50);

	//fog
	var fog_top = new lib.fog();
	summon(fog_top, robot.x, robot.y - 50 * fog_range, "top", false);
	var fog_buttom = new lib.fog();
	summon(fog_buttom, robot.x, robot.y + 50 * fog_range, "buttom", false);
	var fog_left = new lib.fog();
	summon(fog_left, robot.x - 50 * fog_range, robot.y, "left", false);
	var fog_right = new lib.fog();
	summon(fog_right, robot.x + 50 * fog_range, robot.y, "right", false);

	var story_form = new lib.story_form();
	summon(story_form, 600, 0, "form", true);

	//items
	var library_key = new lib.item();
	item_summon(library_key, 1, 1, "key", false);
	library_key.addEventListener('click', function () { itemTxt("library_key", "key") });
	var cd = new lib.item();
	item_summon(cd, 2, 1, "cd", false);
	cd.addEventListener('click', function () { itemTxt("cd", "cd") });
	var paper1 = new lib.item();
	item_summon(paper1, 3, 1, "paper", false);
	paper1.addEventListener('click', function () { itemTxt("paper1", "paper") });
	var paper2 = new lib.item();
	item_summon(paper2, 4, 1, "paper", false);
	paper2.addEventListener('click', function () { itemTxt("paper2", "paper") });
	var paper3 = new lib.item();
	item_summon(paper3, 1, 2, "paper", false);
	paper3.addEventListener('click', function () { itemTxt("paper3", "paper") });
	var paper4 = new lib.item();
	item_summon(paper4, 2, 2, "paper", false);
	paper4.addEventListener('click', function () { itemTxt("paper4", "paper") });
	var paper5 = new lib.item();
	item_summon(paper5, 3, 2, "paper", false);
	paper5.addEventListener('click', function () { itemTxt("paper5", "paper") });
	var paper6 = new lib.item();
	item_summon(paper6, 4, 2, "paper", false);
	paper6.addEventListener('click', function () { itemTxt("paper6", "paper") });
	var paper7 = new lib.item();
	item_summon(paper7, 1, 3, "paper", false);
	paper7.addEventListener('click', function () { itemTxt("paper7", "paper") });



	var knife = new lib.item();
	item_summon(knife, 1, 6, "knife", false);
	knife.addEventListener('click', function () { itemTxt("knife", "knife") });
	var jimmy_bar = new lib.item();
	item_summon(jimmy_bar, 2, 6, "jimmy_bar", false);
	jimmy_bar.addEventListener('click', function () { itemTxt("jimmy_bar", "jimmy_bar") });

	//events
	let cd_played = false;
	let waiter_chat = false;
	let jumpscare1 = false;
	let woman_scream = false;
	let zombies = false;
	let jumpscare2 = false;
	let restaurant_cage = [];
	let soul = 0;
	let uitem = false;
	let cd_playing = false;
	let chasing = false;
	let sang = false;
	let thunder1=false;
	let thunder2=false;
	let thunder3=false;
	let wind=false;
	let diff = false;

	var title = new createjs.Text("鎮長辦公室", "bold 43px Arial", "white");
	title.x = 614;
	title.y = 60;
	title.textBaseline = "alphabetic";
	exportRoot.addChild(title);

	var loadpoint = 0;
	var sounds = [
		{ src: "./assets/bgm_story_mode.mp3", id: "bgm" },
		{ src: "./assets/ghost_chasing.mp3", id: "chasing" },
		{ src: "./assets/girl_sing.mp3", id: "sing" },
		{ src: "./assets/sound/cdplayer_end.mp3", id: "cd_end" },
		{ src: "./assets/sound/chestopen.mp3", id: "chestopen" },
		{ src: "./assets/sound/diff.mp3", id: "diff" },
		{ src: "./assets/sound/door_close.mp3", id: "door_close" },
		{ src: "./assets/sound/door_openning.mp3", id: "door_openning" },
		{ src: "./assets/sound/ladder3.mp3", id: "ladder3" },
		{ src: "./assets/sound/ladder4.mp3", id: "ladder4" },
		{ src: "./assets/sound/ladder5.mp3", id: "ladder5" },
		{ src: "./assets/sound/news1.mp3", id: "news1" },
		{ src: "./assets/sound/scream1.mp3", id: "scream1" },
		{ src: "./assets/sound/stone1.mp3", id: "stone1" },
		{ src: "./assets/sound/strange_laugh.mp3", id: "strange_laugh" },
		{ src: "./assets/sound/sud_2.mp3", id: "sud_2" },
		{ src: "./assets/sound/sud_3.mp3", id: "sud_3" },
		{ src: "./assets/sound/sud_ghost.mp3", id: "sud_ghost" },
		{ src: "./assets/sound/takeoff .mp3", id: "takeoff " },
		{ src: "./assets/sound/thunder1.mp3", id: "thunder1" },
		{ src: "./assets/sound/sud_ghost.mp3", id: "sud_ghost" },
		{ src: "./assets/sound/thunder2.mp3", id: "thunder2" },
		{ src: "./assets/sound/thunder3.mp3", id: "thunder3" },
		{ src: "./assets/sound/ware_wind.mp3", id: "ware_wind" },
		{ src: "./assets/sound/ench-table.mp3", id: "ench" },
		{ src: "./assets/sound/lock.mp3", id: "lock" },
		{ src: "./assets/sound/iron_door.mp3", id: "iron_door" },
		{ src: "./assets/sound/kill.mp3", id: "kill" },
		{ src: "./assets/sound/destory.mp3", id: "destory" },
		{ src: "./assets/sound/piano.mp3", id: "piano" },
		{ src: "./assets/sound/pot.mp3", id: "pot" },
		{ src: "./assets/sound/fire.mp3", id: "fire" },
	];
	createjs.Sound.alternateExtensions = ["mp3"];
	createjs.Sound.addEventListener("fileload", (e) => {
		loadpoint++;
		document.getElementById("reload_back").innerHTML = "載入中(" + parseInt(loadpoint / (sounds.length - 1) * 100) + "%)";
		document.getElementById("reload").innerHTML = "載入中(" + parseInt(loadpoint / (sounds.length - 1) * 100) + "%)";
		if (loadpoint === sounds.length) {
			// This is fired for each sound that is registered.
			end = true;
			document.getElementById("gamePlayBtn").style.display = "block";
			document.getElementById("reload_back").style.display = "none";
			document.getElementById("reload").style.display = "none";
		}
	})
	createjs.Sound.registerSounds(sounds);

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
		document.querySelector("#loading").style.display = 'none';
		document.querySelector(".gamePlayBtn").style.display = 'none';
		document.querySelector(".left1").addEventListener("touchstart", function () { touchdownMove(37) })
		document.querySelector(".up1").addEventListener("touchstart", function () { touchdownMove(38) })
		document.querySelector(".right1").addEventListener("touchstart", function () { touchdownMove(39) })
		document.querySelector(".down1").addEventListener("touchstart", function () { touchdownMove(40) })
		canplay = true;
		bgAudio = createjs.Sound.play("bgm", { loop: -1 });
		bgAudio.volume = 0.3;
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
			fog_enable = false;
		} else if (map === 2) {
			blocks[101] = "soul_sand"; blocks[102] = "soul_sand"; blocks[103] = "dark_prismarine"; blocks[104] = "dark_prismarine"; blocks[107] = "dark_prismarine"; blocks[108] = "soul_sand"; blocks[109] = "soul_sand"; blocks[110] = "soul_sand"; blocks[111] = "soul_sand"; blocks[112] = "soul_sand"; blocks[201] = "soul_sand"; blocks[202] = "soul_sand"; blocks[203] = "dark_prismarine"; blocks[207] = "dark_prismarine"; blocks[208] = "soul_sand"; blocks[209] = "soul_sand"; blocks[210] = "soul_sand"; blocks[211] = "soul_sand"; blocks[212] = "soul_sand"; blocks[301] = "soul_sand"; blocks[302] = "dark_prismarine"; blocks[307] = "dark_prismarine"; blocks[308] = "soul_sand"; blocks[309] = "soul_sand"; blocks[310] = "soul_sand"; blocks[311] = "soul_sand"; blocks[312] = "soul_sand"; blocks[401] = "dark_prismarine"; blocks[406] = "dark_prismarine"; blocks[407] = "soul_sand"; blocks[408] = "soul_sand"; blocks[409] = "soul_sand"; blocks[410] = "soul_sand"; blocks[411] = "soul_sand"; blocks[412] = "soul_sand"; blocks[501] = "dark_prismarine"; blocks[505] = "dark_prismarine"; blocks[506] = "soul_sand"; blocks[507] = "soul_sand"; blocks[508] = "soul_sand"; blocks[509] = "soul_sand"; blocks[510] = "dark_prismarine"; blocks[511] = "dark_prismarine"; blocks[512] = "dark_prismarine"; blocks[601] = "dark_prismarine"; blocks[605] = "dark_prismarine"; blocks[606] = "soul_sand"; blocks[607] = "soul_sand"; blocks[608] = "soul_sand"; blocks[609] = "dark_prismarine"; blocks[701] = "soul_sand"; blocks[702] = "dark_prismarine"; blocks[706] = "dark_prismarine"; blocks[707] = "soul_sand"; blocks[708] = "dark_prismarine"; blocks[712] = "dark_prismarine"; blocks[801] = "soul_sand"; blocks[802] = "dark_prismarine"; blocks[807] = "dark_prismarine"; blocks[811] = "dark_prismarine"; blocks[812] = "soul_sand"; blocks[901] = "soul_sand"; blocks[902] = "soul_sand"; blocks[903] = "dark_prismarine"; blocks[909] = "dark_prismarine"; blocks[910] = "dark_prismarine"; blocks[911] = "soul_sand"; blocks[912] = "soul_sand"; blocks[1001] = "soul_sand"; blocks[1002] = "soul_sand"; blocks[1003] = "soul_sand"; blocks[1004] = "dark_prismarine"; blocks[1008] = "dark_prismarine"; blocks[1009] = "soul_sand"; blocks[1010] = "soul_sand"; blocks[1011] = "soul_sand"; blocks[1012] = "soul_sand"; blocks[1101] = "soul_sand"; blocks[1102] = "soul_sand"; blocks[1103] = "soul_sand"; blocks[1104] = "soul_sand"; blocks[1105] = "dark_prismarine"; blocks[1106] = "dark_prismarine"; blocks[1107] = "dark_prismarine"; blocks[1108] = "soul_sand"; blocks[1109] = "soul_sand"; blocks[1110] = "soul_sand"; blocks[1111] = "soul_sand"; blocks[1112] = "soul_sand"; blocks[1201] = "soul_sand"; blocks[1202] = "soul_sand"; blocks[1203] = "soul_sand"; blocks[1204] = "soul_sand"; blocks[1205] = "soul_sand"; blocks[1206] = "soul_sand"; blocks[1207] = "soul_sand"; blocks[1208] = "soul_sand"; blocks[1209] = "soul_sand"; blocks[1210] = "soul_sand"; blocks[1211] = "soul_sand"; blocks[1212] = "soul_sand";
			floor("podzol");
			events[613] = { "map": 1, "x": 6, "y": 3 };
			events[5] = { "map": 3, "x": 13, "y": 5 };
			events[6] = { "map": 3, "x": 13, "y": 6 };
			fog_enable = true;
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
			fog_enable = true;
		} else if (map === 4) {
			blocks[101] = "cobweb"; blocks[102] = "spruce_planks"; blocks[103] = "spruce_planks"; blocks[104] = "spruce_planks"; blocks[105] = "spruce_planks"; blocks[106] = "spruce_planks"; blocks[107] = "spruce_planks"; blocks[108] = "spruce_planks"; blocks[109] = "ladder"; blocks[110] = "ladder"; blocks[112] = "cobweb"; blocks[202] = "spruce_planks"; blocks[203] = "spruce_planks"; blocks[204] = "spruce_planks"; blocks[205] = "spruce_planks"; blocks[206] = "spruce_planks"; blocks[207] = "spruce_planks"; blocks[208] = "spruce_planks"; blocks[209] = "dark_oak_planks"; blocks[210] = "dark_oak_planks"; blocks[301] = "cobweb"; blocks[302] = "spruce_planks"; blocks[303] = "spruce_planks"; blocks[304] = "spruce_planks"; blocks[305] = "spruce_planks"; blocks[306] = "spruce_planks"; blocks[307] = "spruce_planks"; blocks[308] = "spruce_planks"; blocks[309] = "dark_oak_planks"; blocks[310] = "dark_oak_planks"; blocks[312] = "cobweb"; blocks[402] = "spruce_planks"; blocks[403] = "spruce_planks"; blocks[404] = "spruce_planks"; blocks[405] = "spruce_planks"; blocks[406] = "spruce_planks"; blocks[407] = "spruce_planks"; blocks[408] = "spruce_planks"; blocks[409] = "dark_oak_planks"; blocks[410] = "dark_oak_planks"; blocks[502] = "spruce_planks"; blocks[503] = "spruce_planks"; blocks[504] = "spruce_planks"; blocks[505] = "spruce_planks"; blocks[506] = "spruce_planks"; blocks[507] = "spruce_planks"; blocks[508] = "spruce_planks"; blocks[509] = "dark_oak_planks"; blocks[510] = "dark_oak_planks"; blocks[511] = "cobweb"; blocks[602] = "spruce_planks"; blocks[603] = "spruce_planks"; blocks[604] = "oak_door"; blocks[605] = "spruce_planks"; blocks[606] = "spruce_planks"; blocks[607] = "spruce_planks"; blocks[608] = "spruce_planks"; blocks[609] = "dark_oak_planks"; blocks[610] = "dark_oak_planks"; blocks[706] = "cobweb"; blocks[707] = "cobweb"; blocks[709] = "cobweb"; blocks[811] = "cobweb"; blocks[812] = "dark_prismarine"; blocks[901] = "cobweb"; blocks[903] = "cobweb"; blocks[908] = "cobweb"; blocks[911] = "dark_prismarine"; blocks[912] = "soul_sand"; blocks[1001] = "dark_prismarine"; blocks[1002] = "iron_bars"; blocks[1006] = "dark_prismarine"; blocks[1007] = "dark_prismarine"; blocks[1008] = "dark_prismarine"; blocks[1009] = "dark_prismarine"; blocks[1010] = "dark_prismarine"; blocks[1011] = "soul_sand"; blocks[1012] = "soul_sand"; blocks[1101] = "dark_prismarine"; blocks[1104] = "iron_bars"; blocks[1105] = "dark_prismarine"; blocks[1106] = "soul_sand"; blocks[1107] = "soul_sand"; blocks[1108] = "soul_sand"; blocks[1109] = "soul_sand"; blocks[1110] = "soul_sand"; blocks[1111] = "soul_sand"; blocks[1112] = "soul_sand"; blocks[1201] = "dark_prismarine"; blocks[1205] = "dark_prismarine"; blocks[1206] = "soul_sand"; blocks[1207] = "soul_sand"; blocks[1208] = "soul_sand"; blocks[1209] = "soul_sand"; blocks[1210] = "soul_sand"; blocks[1211] = "soul_sand"; blocks[1212] = "soul_sand";
			floor("podzol");
			layer2[109] = "dark_oak_planks"; layer2[110] = "dark_oak_planks";
			events[1302] = { "map": 3, "x": 1, "y": 2 };
			events[1303] = { "map": 3, "x": 1, "y": 3 };
			events[1304] = { "map": 3, "x": 1, "y": 4 };
			events[604] = { "map": 5, "x": 11, "y": 7 };
			fog_enable = true;
		} else if (map === 5) {
			blocks[101] = "spruce_planks"; blocks[102] = "spruce_planks"; blocks[103] = "spruce_planks"; blocks[104] = "spruce_planks"; blocks[105] = "spruce_planks"; blocks[106] = "spruce_planks"; blocks[107] = "oak_door"; blocks[108] = "spruce_planks"; blocks[109] = "spruce_planks"; blocks[110] = "frosted_ice"; blocks[111] = "frosted_ice"; blocks[112] = "spruce_planks"; blocks[201] = "bookshelf"; blocks[202] = "beehive"; blocks[204] = "cartography_table"; blocks[205] = "spruce_planks"; blocks[206] = "spruce_planks"; blocks[208] = "spruce_planks"; blocks[209] = "spruce_planks"; blocks[210] = "cauldron"; blocks[211] = "cauldron"; blocks[212] = "spruce_planks"; blocks[301] = "bookshelf"; blocks[302] = "beehive"; blocks[304] = "scaffolding"; blocks[305] = "spruce_planks"; blocks[306] = "spruce_planks"; blocks[308] = "spruce_planks"; blocks[309] = "spruce_planks"; blocks[312] = "spruce_planks"; blocks[401] = "bookshelf"; blocks[402] = "beehive"; blocks[406] = "dark_oak_door"; blocks[408] = "dark_oak_door"; blocks[412] = "spruce_planks"; blocks[501] = "bookshelf"; blocks[502] = "loom"; blocks[504] = "brewing_stand"; blocks[505] = "spruce_planks"; blocks[506] = "spruce_planks"; blocks[508] = "spruce_planks"; blocks[509] = "spruce_planks"; blocks[510] = "acacia_door"; blocks[511] = "acacia_door"; blocks[512] = "spruce_planks"; blocks[601] = "spruce_planks"; blocks[602] = "spruce_planks"; blocks[603] = "spruce_planks"; blocks[604] = "spruce_planks"; blocks[605] = "spruce_planks"; blocks[606] = "spruce_planks"; blocks[608] = "spruce_planks"; blocks[609] = "spruce_planks"; blocks[610] = "barrel"; blocks[611] = "barrel_open"; blocks[612] = "spruce_planks"; blocks[701] = "spruce_planks"; blocks[702] = "spruce_planks"; blocks[703] = "spruce_planks"; blocks[704] = "spruce_planks"; blocks[705] = "spruce_planks"; blocks[706] = "spruce_planks"; blocks[708] = "spruce_planks"; blocks[709] = "spruce_planks"; blocks[710] = "ice"; blocks[711] = "frosted_ice"; blocks[712] = "spruce_planks"; blocks[801] = "bookshelf"; blocks[802] = "bookshelf"; blocks[803] = "bookshelf"; blocks[804] = "bookshelf"; blocks[805] = "spruce_planks"; blocks[806] = "spruce_planks"; blocks[808] = "spruce_planks"; blocks[809] = "spruce_planks"; blocks[810] = "cauldron"; blocks[811] = "cauldron"; blocks[812] = "spruce_planks"; blocks[901] = "bookshelf"; blocks[905] = "spruce_planks"; blocks[906] = "spruce_planks"; blocks[908] = "spruce_planks"; blocks[909] = "spruce_planks"; blocks[912] = "spruce_planks"; blocks[1001] = "bookshelf"; blocks[1003] = "enchanting_table"; blocks[1006] = "dark_oak_door"; blocks[1008] = "dark_oak_door"; blocks[1012] = "spruce_planks"; blocks[1101] = "bookshelf"; blocks[1105] = "spruce_planks"; blocks[1106] = "spruce_planks"; blocks[1108] = "spruce_planks"; blocks[1109] = "spruce_planks"; blocks[1110] = "acacia_door"; blocks[1111] = "acacia_door"; blocks[1112] = "spruce_planks"; blocks[1201] = "spruce_planks"; blocks[1202] = "spruce_planks"; blocks[1203] = "spruce_planks"; blocks[1204] = "spruce_planks"; blocks[1205] = "spruce_planks"; blocks[1206] = "spruce_planks"; blocks[1207] = "oak_door"; blocks[1208] = "spruce_planks"; blocks[1209] = "spruce_planks"; blocks[1210] = "barrel"; blocks[1211] = "barrel"; blocks[1212] = "spruce_planks";
			floor("oak_planks");
			layer2[107] = "black_wool"; layer2[409] = "pink_wool"; layer2[510] = "pink_wool"; layer2[511] = "pink_wool"; layer2[1009] = "light_blue_wool"; layer2[1110] = "light_blue_wool"; layer2[1111] = "light_blue_wool";
			events[1207] = { "map": 4, "x": 7, "y": 4 };
			events[107] = { "map": 6, "x": 11, "y": 7 };
			if (!paper1.visible) events[402] = { "item": paper1, "itemName": "paper1", "type": "paper" };
			fog_enable = true;
		} else if (map === 6) {
			blocks[101] = "spruce_planks"; blocks[102] = "spruce_planks"; blocks[103] = "spruce_planks"; blocks[104] = "spruce_planks"; blocks[105] = "spruce_planks"; blocks[106] = "spruce_planks"; blocks[108] = "spruce_planks"; blocks[109] = "spruce_planks"; blocks[110] = "spruce_planks"; blocks[111] = "spruce_planks"; blocks[112] = "spruce_planks"; blocks[201] = "ladder"; blocks[202] = "ladder"; blocks[210] = "bookshelf"; blocks[211] = "spruce_planks"; blocks[212] = "spruce_planks"; blocks[301] = "spruce_planks"; blocks[302] = "bookshelf"; blocks[304] = "bookshelf"; blocks[306] = "bookshelf"; blocks[308] = "bookshelf"; blocks[310] = "bookshelf"; blocks[311] = "spruce_planks"; blocks[312] = "spruce_planks"; blocks[401] = "spruce_planks"; blocks[402] = "bookshelf"; blocks[404] = "bookshelf"; blocks[406] = "bookshelf"; blocks[408] = "bookshelf"; blocks[410] = "bookshelf"; blocks[411] = "spruce_planks"; blocks[412] = "spruce_planks"; blocks[501] = "spruce_planks"; blocks[502] = "bookshelf"; blocks[504] = "bookshelf"; blocks[506] = "bookshelf"; blocks[508] = "bookshelf"; blocks[510] = "bookshelf"; blocks[511] = "spruce_planks"; blocks[512] = "spruce_planks"; blocks[601] = "spruce_planks"; blocks[602] = "bookshelf"; blocks[604] = "bookshelf"; blocks[606] = "bookshelf"; blocks[608] = "bookshelf"; blocks[610] = "bookshelf"; blocks[611] = "spruce_planks"; blocks[612] = "spruce_planks"; blocks[701] = "spruce_planks"; blocks[702] = "bookshelf"; blocks[704] = "bookshelf"; blocks[706] = "bookshelf"; blocks[708] = "bookshelf"; blocks[710] = "bookshelf"; blocks[711] = "spruce_planks"; blocks[712] = "spruce_planks"; blocks[801] = "spruce_planks"; blocks[802] = "bookshelf"; blocks[804] = "bookshelf"; blocks[806] = "bookshelf"; blocks[808] = "bookshelf"; blocks[810] = "bookshelf"; blocks[811] = "spruce_planks"; blocks[812] = "spruce_planks"; blocks[901] = "spruce_planks"; blocks[902] = "bookshelf"; blocks[904] = "bookshelf"; blocks[906] = "bookshelf"; blocks[908] = "bookshelf"; blocks[910] = "bookshelf"; blocks[911] = "spruce_planks"; blocks[912] = "spruce_planks"; blocks[1001] = "spruce_planks"; blocks[1002] = "bookshelf"; blocks[1004] = "bookshelf"; blocks[1006] = "bookshelf"; blocks[1008] = "bookshelf"; blocks[1010] = "bookshelf"; blocks[1011] = "spruce_planks"; blocks[1012] = "spruce_planks"; blocks[1101] = "spruce_planks"; blocks[1102] = "bookshelf"; blocks[1110] = "bookshelf"; blocks[1111] = "spruce_planks"; blocks[1112] = "spruce_planks"; blocks[1201] = "spruce_planks"; blocks[1202] = "spruce_planks"; blocks[1203] = "spruce_planks"; blocks[1204] = "spruce_planks"; blocks[1205] = "spruce_planks"; blocks[1206] = "spruce_planks"; blocks[1207] = "oak_door"; blocks[1208] = "spruce_planks"; blocks[1209] = "spruce_planks"; blocks[1210] = "spruce_planks"; blocks[1211] = "spruce_planks"; blocks[1212] = "spruce_planks";
			if (!cd.visible) blocks[107] = "iron_door";
			floor("oak_planks");
			layer2[107] = "black_wool"; layer2[201] = "spruce_planks"; layer2[202] = "bookshelf"; layer2[206] = "cobweb"; layer2[211] = "cobweb"; layer2[303] = "cobweb"; layer2[305] = "cobweb"; layer2[309] = "cobweb"; layer2[603] = "cobweb"; layer2[607] = "cobweb"; layer2[703] = "cobweb"; layer2[705] = "cobweb"; layer2[809] = "cobweb"; layer2[811] = "cobweb"; layer2[911] = "cobweb"; layer2[1009] = "cobweb"; layer2[1011] = "cobweb"; layer2[1103] = "cobweb"; layer2[1110] = "cobweb"; layer2[1111] = "cobweb";
			if (cd.visible) { blocks[107] = "spawner"; layer2[107] = "air"; }
			events[1207] = { "map": 5, "x": 2, "y": 7 };
			events[202] = { "map": 7, "x": 2, "y": 2, "way": "down" };
			if (library_key.visible && !cd.visible) events[107] = { "map": 8, "x": 12, "y": 6 };
			fog_enable = true;
		} else if (map === 7) {
			blocks[101] = "bookshelf"; blocks[102] = "bookshelf"; blocks[103] = "bookshelf"; blocks[104] = "bookshelf"; blocks[105] = "bookshelf"; blocks[106] = "bookshelf"; blocks[107] = "bookshelf"; blocks[108] = "bookshelf"; blocks[109] = "bookshelf"; blocks[110] = "bookshelf"; blocks[111] = "bookshelf"; blocks[112] = "bookshelf"; blocks[201] = "ladder"; blocks[212] = "bookshelf"; blocks[301] = "bookshelf"; blocks[303] = "piston"; blocks[304] = "piston"; blocks[305] = "piston"; blocks[306] = "piston"; blocks[307] = "piston"; blocks[308] = "piston"; blocks[309] = "piston"; blocks[310] = "piston"; blocks[312] = "bookshelf"; blocks[401] = "bookshelf"; blocks[403] = "piston"; blocks[404] = "bookshelf"; blocks[406] = "bookshelf"; blocks[408] = "bookshelf"; blocks[410] = "piston"; blocks[412] = "bookshelf"; blocks[501] = "bookshelf"; blocks[503] = "piston"; blocks[504] = "bookshelf"; blocks[506] = "bookshelf"; blocks[508] = "bookshelf"; blocks[510] = "piston"; blocks[512] = "bookshelf"; blocks[601] = "bookshelf"; blocks[603] = "piston"; blocks[604] = "bookshelf"; blocks[606] = "bookshelf"; blocks[607] = "cobweb"; blocks[608] = "bookshelf"; blocks[610] = "piston"; blocks[612] = "bookshelf"; blocks[701] = "bookshelf"; blocks[703] = "piston"; blocks[704] = "bookshelf"; blocks[705] = "cobweb"; blocks[706] = "bookshelf"; blocks[708] = "bookshelf"; blocks[710] = "piston"; blocks[712] = "bookshelf"; blocks[801] = "bookshelf"; blocks[803] = "piston"; blocks[804] = "bookshelf"; blocks[806] = "bookshelf"; blocks[808] = "bookshelf"; blocks[809] = "cobweb"; blocks[810] = "piston"; blocks[812] = "bookshelf"; blocks[901] = "bookshelf"; blocks[903] = "piston"; blocks[904] = "bookshelf"; blocks[906] = "bookshelf"; blocks[908] = "bookshelf"; blocks[910] = "piston"; blocks[912] = "bookshelf"; blocks[1001] = "bookshelf"; blocks[1003] = "piston"; blocks[1004] = "piston"; blocks[1005] = "piston"; blocks[1006] = "piston"; blocks[1007] = "piston"; blocks[1008] = "piston"; blocks[1009] = "piston"; blocks[1010] = "piston"; blocks[1012] = "bookshelf"; blocks[1101] = "bookshelf"; blocks[1112] = "bookshelf"; blocks[1201] = "bookshelf"; blocks[1202] = "bookshelf"; blocks[1203] = "bookshelf"; blocks[1204] = "bookshelf"; blocks[1205] = "bookshelf"; blocks[1206] = "enchanting_table"; blocks[1207] = "bookshelf"; blocks[1208] = "bookshelf"; blocks[1209] = "bookshelf"; blocks[1210] = "bookshelf"; blocks[1211] = "bookshelf"; blocks[1212] = "bookshelf";
			floor("oak_planks");
			layer2[201] = "spruce_planks"; layer2[405] = "spruce_planks"; layer2[407] = "spruce_planks"; layer2[409] = "spruce_planks"; layer2[505] = "spruce_planks"; layer2[507] = "spruce_planks"; layer2[509] = "spruce_planks"; layer2[605] = "spruce_planks"; layer2[607] = "spruce_planks"; layer2[609] = "spruce_planks"; layer2[705] = "spruce_planks"; layer2[707] = "spruce_planks"; layer2[709] = "spruce_planks"; layer2[805] = "spruce_planks"; layer2[807] = "spruce_planks"; layer2[809] = "spruce_planks"; layer2[905] = "spruce_planks"; layer2[907] = "spruce_planks"; layer2[909] = "spruce_planks";
			events[201] = { "map": 6, "x": 2, "y": 3, "way": "down" };
			if (!library_key.visible) events[1206] = { "item": library_key, "itemName": "library_key", "type": "key" };
			fog_enable = true;
		} else if (map === 8) {
			blocks[103] = "nether_bricks"; blocks[104] = "nether_bricks"; blocks[105] = "spawner"; blocks[107] = "spawner"; blocks[108] = "nether_bricks"; blocks[109] = "nether_bricks"; blocks[203] = "nether_bricks"; blocks[204] = "nether_bricks"; blocks[205] = "spawner"; blocks[207] = "spawner"; blocks[208] = "nether_bricks"; blocks[209] = "nether_bricks"; blocks[303] = "nether_bricks"; blocks[304] = "nether_bricks"; blocks[305] = "spawner"; blocks[307] = "spawner"; blocks[308] = "nether_bricks"; blocks[309] = "nether_bricks"; blocks[403] = "nether_bricks"; blocks[404] = "nether_bricks"; blocks[405] = "spawner"; blocks[407] = "spawner"; blocks[408] = "nether_bricks"; blocks[409] = "nether_bricks"; blocks[503] = "nether_bricks"; blocks[504] = "nether_bricks"; blocks[505] = "spawner"; blocks[507] = "spawner"; blocks[508] = "nether_bricks"; blocks[509] = "nether_bricks"; blocks[603] = "nether_bricks"; blocks[604] = "nether_bricks"; blocks[605] = "spawner"; blocks[607] = "spawner"; blocks[608] = "nether_bricks"; blocks[609] = "nether_bricks"; blocks[703] = "nether_bricks"; blocks[704] = "nether_bricks"; blocks[705] = "spawner"; blocks[707] = "spawner"; blocks[708] = "nether_bricks"; blocks[709] = "nether_bricks"; blocks[803] = "nether_bricks"; blocks[804] = "nether_bricks"; blocks[805] = "spawner"; blocks[807] = "spawner"; blocks[808] = "nether_bricks"; blocks[809] = "nether_bricks"; blocks[903] = "nether_bricks"; blocks[904] = "nether_bricks"; blocks[905] = "spawner"; blocks[907] = "spawner"; blocks[908] = "nether_bricks"; blocks[909] = "nether_bricks"; blocks[1003] = "nether_bricks"; blocks[1004] = "nether_bricks"; blocks[1005] = "spawner"; blocks[1007] = "spawner"; blocks[1008] = "nether_bricks"; blocks[1009] = "nether_bricks"; blocks[1101] = "nether_bricks"; blocks[1102] = "nether_bricks"; blocks[1103] = "nether_bricks"; blocks[1104] = "nether_bricks"; blocks[1105] = "spawner"; blocks[1107] = "spawner"; blocks[1108] = "nether_bricks"; blocks[1109] = "nether_bricks"; blocks[1110] = "nether_bricks"; blocks[1111] = "nether_bricks"; blocks[1112] = "nether_bricks"; blocks[1201] = "nether_bricks"; blocks[1202] = "nether_bricks"; blocks[1203] = "nether_bricks"; blocks[1204] = "nether_bricks"; blocks[1205] = "nether_bricks"; blocks[1207] = "nether_bricks"; blocks[1208] = "nether_bricks"; blocks[1209] = "nether_bricks"; blocks[1210] = "nether_bricks"; blocks[1211] = "nether_bricks"; blocks[1212] = "nether_bricks";
			floor("spruce_planks");
			events[1306] = { "map": 9, "x": 2, "y": 7 };
			fog_enable = true;
		} else if (map === 9) {
			blocks[101] = "dark_oak_planks"; blocks[102] = "dark_oak_planks"; blocks[103] = "dark_oak_planks"; blocks[104] = "dark_oak_planks"; blocks[105] = "dark_oak_planks"; blocks[106] = "dark_oak_planks"; blocks[107] = "iron_door"; blocks[108] = "dark_oak_planks"; blocks[109] = "dark_oak_planks"; blocks[110] = "dark_oak_planks"; blocks[111] = "dark_oak_planks"; blocks[112] = "dark_oak_planks"; blocks[201] = "dark_oak_planks"; blocks[202] = "bookshelf2"; blocks[210] = "bookshelf2"; blocks[211] = "dark_oak_planks"; blocks[212] = "dark_oak_planks"; blocks[301] = "dark_oak_planks"; blocks[302] = "bookshelf2"; blocks[304] = "bookshelf2"; blocks[306] = "bookshelf2"; blocks[308] = "bookshelf2"; blocks[310] = "bookshelf2"; blocks[311] = "dark_oak_planks"; blocks[312] = "dark_oak_planks"; blocks[401] = "dark_oak_planks"; blocks[402] = "bookshelf2"; blocks[404] = "bookshelf2"; blocks[406] = "bookshelf2"; blocks[408] = "bookshelf2"; blocks[410] = "bookshelf2"; blocks[411] = "dark_oak_planks"; blocks[412] = "dark_oak_planks"; blocks[501] = "dark_oak_planks"; blocks[502] = "bookshelf2"; blocks[504] = "bookshelf2"; blocks[506] = "bookshelf2"; blocks[508] = "bookshelf2"; blocks[510] = "bookshelf2"; blocks[511] = "dark_oak_planks"; blocks[512] = "dark_oak_planks"; blocks[601] = "dark_oak_planks"; blocks[602] = "bookshelf2"; blocks[604] = "bookshelf2"; blocks[606] = "bookshelf2"; blocks[608] = "bookshelf2"; blocks[610] = "bookshelf2"; blocks[611] = "dark_oak_planks"; blocks[612] = "dark_oak_planks"; blocks[701] = "dark_oak_planks"; blocks[702] = "bookshelf2"; blocks[704] = "bookshelf2"; blocks[706] = "bookshelf2"; blocks[708] = "bookshelf2"; blocks[710] = "bookshelf2"; blocks[711] = "dark_oak_planks"; blocks[712] = "dark_oak_planks"; blocks[801] = "dark_oak_planks"; blocks[802] = "bookshelf2"; blocks[804] = "bookshelf2"; blocks[806] = "bookshelf2"; blocks[808] = "bookshelf2"; blocks[810] = "bookshelf2"; blocks[811] = "dark_oak_planks"; blocks[812] = "dark_oak_planks"; blocks[901] = "dark_oak_planks"; blocks[902] = "bookshelf2"; blocks[904] = "bookshelf2"; blocks[906] = "bookshelf2"; blocks[908] = "bookshelf2"; blocks[910] = "bookshelf2"; blocks[911] = "dark_oak_planks"; blocks[912] = "dark_oak_planks"; blocks[1001] = "dark_oak_planks"; blocks[1002] = "bookshelf2"; blocks[1004] = "bookshelf2"; blocks[1006] = "bookshelf2"; blocks[1008] = "bookshelf2"; blocks[1010] = "bookshelf2"; blocks[1011] = "dark_oak_planks"; blocks[1012] = "dark_oak_planks"; blocks[1101] = "dark_oak_planks"; blocks[1102] = "bookshelf2"; blocks[1110] = "bookshelf2"; blocks[1111] = "dark_oak_planks"; blocks[1112] = "dark_oak_planks"; blocks[1201] = "dark_oak_planks"; blocks[1202] = "dark_oak_planks"; blocks[1203] = "dark_oak_planks"; blocks[1204] = "dark_oak_planks"; blocks[1205] = "dark_oak_planks"; blocks[1206] = "dark_oak_planks"; blocks[1207] = "oak_door"; blocks[1208] = "dark_oak_planks"; blocks[1209] = "dark_oak_planks"; blocks[1210] = "dark_oak_planks"; blocks[1211] = "dark_oak_planks"; blocks[1212] = "dark_oak_planks";
			floor("spruce_planks");
			events[1207] = { "map": 10, "x": 7, "y": 4 };
			fog_enable = true;
		} else if (map === 10) {
			blocks[102] = "oak_planks"; blocks[103] = "oak_planks"; blocks[104] = "oak_planks"; blocks[105] = "oak_planks"; blocks[106] = "oak_planks"; blocks[107] = "oak_planks"; blocks[108] = "oak_planks"; blocks[109] = "spruce_planks"; blocks[110] = "spruce_planks"; blocks[111] = "cartography_table"; blocks[112] = "prismarine_bricks"; blocks[202] = "oak_planks"; blocks[203] = "oak_planks"; blocks[204] = "oak_planks"; blocks[205] = "oak_planks"; blocks[206] = "oak_planks"; blocks[207] = "oak_planks"; blocks[208] = "oak_planks"; blocks[209] = "spruce_planks"; blocks[210] = "spruce_planks"; blocks[212] = "prismarine_bricks"; blocks[302] = "oak_planks"; blocks[303] = "oak_planks"; blocks[304] = "oak_planks"; blocks[305] = "oak_planks"; blocks[306] = "oak_planks"; blocks[307] = "oak_planks"; blocks[308] = "oak_planks"; blocks[309] = "spruce_planks"; blocks[310] = "spruce_planks"; blocks[312] = "prismarine_bricks"; blocks[402] = "oak_planks"; blocks[403] = "oak_planks"; blocks[404] = "oak_planks"; blocks[405] = "oak_planks"; blocks[406] = "oak_planks"; blocks[407] = "oak_planks"; blocks[408] = "oak_planks"; blocks[409] = "spruce_planks"; blocks[410] = "spruce_planks"; blocks[412] = "prismarine_bricks"; blocks[502] = "oak_planks"; blocks[503] = "oak_planks"; blocks[504] = "oak_planks"; blocks[505] = "oak_planks"; blocks[506] = "oak_planks"; blocks[507] = "oak_planks"; blocks[508] = "oak_planks"; blocks[509] = "spruce_planks"; blocks[510] = "spruce_planks"; blocks[512] = "prismarine_bricks"; blocks[602] = "oak_planks"; blocks[603] = "oak_planks"; blocks[604] = "oak_door"; blocks[605] = "oak_planks"; blocks[606] = "oak_planks"; blocks[607] = "oak_planks"; blocks[608] = "oak_planks"; blocks[609] = "spruce_planks"; blocks[610] = "spruce_planks"; blocks[612] = "prismarine_bricks"; blocks[712] = "prismarine_bricks"; blocks[812] = "prismarine_bricks"; blocks[911] = "prismarine_bricks"; blocks[912] = "sugar_cane"; blocks[1001] = "prismarine_bricks"; blocks[1006] = "prismarine_bricks"; blocks[1007] = "prismarine_bricks"; blocks[1008] = "prismarine_bricks"; blocks[1009] = "prismarine_bricks"; blocks[1010] = "prismarine_bricks"; blocks[1011] = "sugar_cane"; blocks[1012] = "sugar_cane"; blocks[1101] = "sugar_cane"; blocks[1102] = "prismarine_bricks"; blocks[1103] = "iron_bars"; blocks[1104] = "iron_bars"; blocks[1105] = "prismarine_bricks"; blocks[1106] = "sugar_cane"; blocks[1107] = "sugar_cane"; blocks[1108] = "sugar_cane"; blocks[1109] = "sugar_cane"; blocks[1110] = "sugar_cane"; blocks[1111] = "sugar_cane"; blocks[1112] = "sugar_cane"; blocks[1201] = "sugar_cane"; blocks[1202] = "prismarine_bricks"; blocks[1205] = "prismarine_bricks"; blocks[1206] = "sugar_cane"; blocks[1207] = "sugar_cane"; blocks[1208] = "sugar_cane"; blocks[1209] = "sugar_cane"; blocks[1210] = "sugar_cane"; blocks[1211] = "sugar_cane"; blocks[1212] = "sugar_cane";
			floor("dirt");
			blocks[904] = "libriarier";
			events[904] = { "event": "libriarier" };
			if (!cd.visible) events[111] = { "item": cd, "itemName": "cd", "type": "cd" };
			events[604] = { "map": 5, "x": 11, "y": 7 };
			fog_enable = false;
		} else if (map === 11) {
			blocks[101] = "soul_sand"; blocks[102] = "soul_sand"; blocks[103] = "soul_sand"; blocks[104] = "soul_sand"; blocks[105] = "dark_prismarine"; blocks[106] = "dark_prismarine"; blocks[107] = "dark_prismarine"; blocks[108] = "dark_prismarine"; blocks[109] = "soul_sand"; blocks[110] = "soul_sand"; blocks[111] = "soul_sand"; blocks[112] = "soul_sand"; blocks[201] = "soul_sand"; blocks[202] = "soul_sand"; blocks[203] = "soul_sand"; blocks[204] = "dark_prismarine"; blocks[209] = "dark_prismarine"; blocks[210] = "soul_sand"; blocks[211] = "soul_sand"; blocks[212] = "soul_sand"; blocks[301] = "soul_sand"; blocks[302] = "soul_sand"; blocks[303] = "dark_prismarine"; blocks[310] = "dark_prismarine"; blocks[311] = "soul_sand"; blocks[312] = "soul_sand"; blocks[401] = "soul_sand"; blocks[402] = "dark_prismarine"; blocks[411] = "dark_prismarine"; blocks[412] = "soul_sand"; blocks[501] = "dark_prismarine"; blocks[506] = "dark_prismarine"; blocks[507] = "dark_prismarine"; blocks[511] = "dark_prismarine"; blocks[512] = "soul_sand"; blocks[601] = "dark_prismarine"; blocks[605] = "dark_prismarine"; blocks[606] = "soul_sand"; blocks[607] = "soul_sand"; blocks[608] = "dark_prismarine"; blocks[611] = "dark_prismarine"; blocks[612] = "soul_sand"; blocks[701] = "dark_prismarine"; blocks[705] = "dark_prismarine"; blocks[706] = "soul_sand"; blocks[707] = "soul_sand"; blocks[708] = "dark_prismarine"; blocks[711] = "dark_prismarine"; blocks[712] = "soul_sand"; blocks[801] = "dark_prismarine"; blocks[805] = "dark_prismarine"; blocks[806] = "soul_sand"; blocks[807] = "soul_sand"; blocks[808] = "dark_prismarine"; blocks[812] = "dark_prismarine"; blocks[901] = "dark_prismarine"; blocks[904] = "dark_prismarine"; blocks[905] = "soul_sand"; blocks[906] = "soul_sand"; blocks[907] = "soul_sand"; blocks[908] = "dark_prismarine"; blocks[912] = "dark_prismarine"; blocks[1001] = "dark_prismarine"; blocks[1004] = "dark_prismarine"; blocks[1005] = "soul_sand"; blocks[1006] = "soul_sand"; blocks[1007] = "soul_sand"; blocks[1008] = "dark_prismarine"; blocks[1012] = "dark_prismarine"; blocks[1101] = "dark_prismarine"; blocks[1104] = "blood_foot_right"; blocks[1105] = "blood_foot_left"; blocks[1106] = "blood_foot_right"; blocks[1107] = "blood_foot_left"; blocks[1108] = "blood_foot_right"; blocks[1109] = "blood_foot_left"; blocks[1112] = "blood"; blocks[1201] = "dark_prismarine"; blocks[1204] = "dark_prismarine"; blocks[1205] = "soul_sand"; blocks[1206] = "soul_sand"; blocks[1207] = "soul_sand"; blocks[1208] = "soul_sand"; blocks[1209] = "dark_prismarine"; blocks[1212] = "dark_prismarine";
			floor("podzol");
			layer2[1104] = "dark_prismarine"; layer2[1105] = "soul_sand"; layer2[1106] = "soul_sand"; layer2[1107] = "soul_sand"; layer2[1108] = "soul_sand"; layer2[1109] = "dark_prismarine"; layer2[1112] = "dark_prismarine";
			events[1302] = { "map": 3, "x": 1, "y": 11 };
			events[1303] = { "map": 3, "x": 1, "y": 12 };
			events[1310] = { "map": 12, "x": 1, "y": 10 };
			events[1311] = { "map": 12, "x": 1, "y": 11 };
			fog_enable = true;
		} else if (map === 12) {
			blocks[101] = "black_wool"; blocks[102] = "black_wool"; blocks[103] = "black_wool"; blocks[104] = "black_wool"; blocks[105] = "soul_sand"; blocks[106] = "soul_sand"; blocks[107] = "soul_sand"; blocks[108] = "soul_sand"; blocks[109] = "dark_prismarine"; blocks[112] = "dark_prismarine"; blocks[201] = "black_wool"; blocks[202] = "black_wool"; blocks[203] = "black_wool"; blocks[204] = "black_wool"; blocks[205] = "soul_sand"; blocks[206] = "soul_sand"; blocks[207] = "soul_sand"; blocks[208] = "soul_sand"; blocks[209] = "dark_prismarine"; blocks[212] = "dark_prismarine"; blocks[301] = "black_wool"; blocks[302] = "black_wool"; blocks[303] = "oak_planks"; blocks[304] = "oak_planks"; blocks[305] = "spruce_planks"; blocks[306] = "spruce_planks"; blocks[307] = "spruce_planks"; blocks[308] = "dark_prismarine"; blocks[312] = "dark_prismarine"; blocks[401] = "black_wool"; blocks[402] = "black_wool"; blocks[403] = "oak_planks"; blocks[404] = "oak_planks"; blocks[405] = "spruce_planks"; blocks[406] = "spruce_planks"; blocks[407] = "spruce_planks"; blocks[409] = "sweet_berry_bush_stage2"; blocks[412] = "dark_prismarine"; blocks[501] = "black_wool"; blocks[502] = "black_wool"; blocks[503] = "oak_planks"; blocks[504] = "oak_planks"; blocks[505] = "spruce_planks"; blocks[506] = "spruce_planks"; blocks[507] = "spruce_planks"; blocks[512] = "dark_prismarine"; blocks[601] = "black_wool"; blocks[602] = "black_wool"; blocks[603] = "oak_planks"; blocks[604] = "oak_planks"; blocks[605] = "spruce_planks"; blocks[606] = "jack_o_lantern"; blocks[607] = "dead_bush"; blocks[612] = "dark_prismarine"; blocks[701] = "black_wool"; blocks[702] = "black_wool"; blocks[703] = "oak_planks"; blocks[704] = "oak_planks"; blocks[705] = "spruce_planks"; blocks[706] = "spruce_planks"; blocks[707] = "spruce_planks"; blocks[712] = "dark_prismarine"; blocks[801] = "black_wool"; blocks[802] = "black_wool"; blocks[803] = "oak_planks"; blocks[804] = "oak_planks"; blocks[805] = "spruce_planks"; blocks[806] = "spruce_planks"; blocks[807] = "oak_door"; blocks[810] = "sweet_berry_bush_stage3"; blocks[812] = "dark_prismarine"; blocks[901] = "black_wool"; blocks[902] = "black_wool"; blocks[903] = "oak_planks"; blocks[904] = "oak_planks"; blocks[905] = "spruce_planks"; blocks[906] = "spruce_planks"; blocks[907] = "spruce_planks"; blocks[912] = "dark_prismarine"; blocks[1001] = "black_wool"; blocks[1002] = "black_wool"; blocks[1003] = "oak_planks"; blocks[1004] = "oak_planks"; blocks[1005] = "spruce_planks"; blocks[1006] = "spruce_planks"; blocks[1007] = "spruce_planks"; blocks[1008] = "sweet_berry_bush_stage2"; blocks[1012] = "dark_prismarine"; blocks[1101] = "black_wool"; blocks[1102] = "black_wool"; blocks[1103] = "oak_planks"; blocks[1104] = "oak_planks"; blocks[1105] = "spruce_planks"; blocks[1106] = "spruce_planks"; blocks[1107] = "spruce_planks"; blocks[1112] = "dark_prismarine"; blocks[1201] = "black_wool"; blocks[1202] = "black_wool"; blocks[1203] = "oak_planks"; blocks[1204] = "oak_planks"; blocks[1205] = "spruce_planks"; blocks[1206] = "spruce_planks"; blocks[1207] = "spruce_planks"; blocks[1208] = "dark_prismarine"; blocks[1209] = "dark_prismarine"; blocks[1210] = "iron_bars"; blocks[1211] = "iron_bars"; blocks[1212] = "dark_prismarine";
			floor("podzol");
			layer2[101] = "black_wool"; layer2[102] = "black_wool"; layer2[103] = "black_wool"; layer2[104] = "black_wool"; layer2[201] = "black_wool"; layer2[202] = "black_wool"; layer2[203] = "black_wool"; layer2[204] = "black_wool"; layer2[301] = "black_wool"; layer2[302] = "black_wool"; layer2[309] = "sweet_berry_bush_stage1"; layer2[311] = "sweet_berry_bush_stage1"; layer2[401] = "black_wool"; layer2[402] = "black_wool"; layer2[501] = "black_wool"; layer2[502] = "black_wool"; layer2[509] = "sweet_berry_bush_stage1"; layer2[601] = "black_wool"; layer2[602] = "black_wool"; layer2[607] = "spruce_planks"; layer2[608] = "sweet_berry_bush_stage1"; layer2[701] = "black_wool"; layer2[702] = "black_wool"; layer2[711] = "sweet_berry_bush_stage1"; layer2[801] = "black_wool"; layer2[802] = "black_wool"; layer2[809] = "sweet_berry_bush_stage1"; layer2[901] = "black_wool"; layer2[902] = "black_wool"; layer2[1001] = "black_wool"; layer2[1002] = "black_wool"; layer2[1011] = "sweet_berry_bush_stage1"; layer2[1101] = "black_wool"; layer2[1102] = "black_wool"; layer2[1201] = "black_wool"; layer2[1202] = "black_wool";
			events[10] = { "map": 11, "x": 13, "y": 10 };
			events[11] = { "map": 11, "x": 13, "y": 11 };
			events[807] = { "map": 13, "x": 7, "y": 12 };
			events[1310] = { "map": 14, "x": 1, "y": 6 };
			events[1311] = { "map": 14, "x": 1, "y": 7 };
			if (jumpscare1) { blocks[1210] = "air"; blocks[1211] = "air"; }
			fog_enable = false;
		} else if (map === 13) {
			blocks[101] = "enchanting_table"; blocks[102] = "crafting_table_top"; blocks[103] = "cartography_table"; blocks[104] = "brewing_stand"; blocks[112] = "dark_oak_planks"; blocks[204] = "brewing_stand"; blocks[205] = "anvil_top"; blocks[206] = "anvil_top"; blocks[208] = "anvil_top"; blocks[209] = "anvil_top"; blocks[210] = "anvil_top"; blocks[212] = "dark_oak_planks"; blocks[304] = "barrel"; blocks[305] = "piston"; blocks[306] = "piston"; blocks[308] = "piston"; blocks[309] = "piston"; blocks[310] = "piston"; blocks[312] = "dark_oak_planks"; blocks[404] = "barrel_open"; blocks[405] = "piston"; blocks[406] = "piston"; blocks[408] = "piston"; blocks[409] = "piston"; blocks[410] = "piston"; blocks[412] = "dark_oak_planks"; blocks[504] = "barrel"; blocks[505] = "anvil_top"; blocks[506] = "anvil_top"; blocks[508] = "anvil_top"; blocks[509] = "anvil_top"; blocks[510] = "anvil_top"; blocks[512] = "dark_oak_planks"; blocks[601] = "beehive"; blocks[604] = "barrel"; blocks[612] = "dark_oak_planks"; blocks[701] = "beehive"; blocks[712] = "oak_door"; blocks[801] = "beehive"; blocks[804] = "barrel"; blocks[812] = "dark_oak_planks"; blocks[901] = "beehive"; blocks[904] = "barrel"; blocks[905] = "anvil_top"; blocks[906] = "anvil_top"; blocks[908] = "anvil_top"; blocks[909] = "anvil_top"; blocks[910] = "anvil_top"; blocks[912] = "dark_oak_planks"; blocks[1001] = "furnace"; blocks[1004] = "barrel_open"; blocks[1005] = "piston"; blocks[1006] = "piston"; blocks[1008] = "piston"; blocks[1009] = "piston"; blocks[1010] = "piston"; blocks[1012] = "dark_oak_planks"; blocks[1101] = "furnace"; blocks[1104] = "barrel_open"; blocks[1105] = "piston"; blocks[1106] = "piston"; blocks[1108] = "piston"; blocks[1109] = "piston"; blocks[1110] = "piston"; blocks[1112] = "dark_oak_planks"; blocks[1201] = "spawner"; blocks[1204] = "barrel"; blocks[1205] = "anvil_top"; blocks[1206] = "anvil_top"; blocks[1208] = "anvil_top"; blocks[1209] = "anvil_top"; blocks[1210] = "anvil_top"; blocks[1212] = "dark_oak_planks";
			if (!waiter_chat) blocks[402] = "waiter_ghost";
			events[402] = { "event": "waiter_ghost" };
			floor("spruce_planks");
			events[712] = { "map": 12, "x": 8, "y": 8 };
			events[601] = { "item": paper6, "itemName": "paper6", "type": "paper" };
			fog_enable = true;
		} else if (map === 14) {
			blocks[101] = "tv"; blocks[104] = "dark_oak_planks"; blocks[105] = "dark_oak_planks"; blocks[108] = "dark_oak_planks"; blocks[109] = "dark_oak_planks"; blocks[110] = "spawner"; blocks[201] = "loom"; blocks[204] = "dark_oak_planks"; blocks[205] = "dark_oak_planks"; blocks[208] = "dark_oak_planks"; blocks[209] = "dark_oak_planks"; blocks[301] = "beehive"; blocks[305] = "dark_oak_door"; blocks[308] = "dark_oak_door"; blocks[401] = "beehive"; blocks[404] = "dark_oak_planks"; blocks[405] = "dark_oak_planks"; blocks[408] = "dark_oak_planks"; blocks[409] = "dark_oak_planks"; blocks[501] = "dark_oak_planks"; blocks[502] = "dark_oak_planks"; blocks[503] = "dark_oak_planks"; blocks[504] = "dark_oak_planks"; blocks[505] = "dark_oak_planks"; blocks[508] = "dark_oak_planks"; blocks[509] = "dark_oak_planks"; blocks[510] = "dark_oak_planks"; blocks[511] = "dark_oak_planks"; blocks[512] = "dark_oak_planks"; blocks[601] = "brewing_stand"; blocks[604] = "dark_oak_planks"; blocks[605] = "dark_oak_planks"; blocks[608] = "dark_oak_planks"; blocks[609] = "dark_oak_planks"; blocks[701] = "beehive"; blocks[705] = "dark_oak_door"; blocks[708] = "dark_oak_door"; blocks[712] = "scaffolding"; blocks[801] = "beehive"; blocks[804] = "dark_oak_planks"; blocks[805] = "dark_oak_planks"; blocks[808] = "dark_oak_planks"; blocks[809] = "dark_oak_planks"; blocks[812] = "fletching_table"; blocks[901] = "dark_oak_planks"; blocks[902] = "dark_oak_planks"; blocks[903] = "dark_oak_planks"; blocks[904] = "dark_oak_planks"; blocks[905] = "dark_oak_planks"; blocks[908] = "dark_oak_planks"; blocks[909] = "dark_oak_planks"; blocks[910] = "dark_oak_planks"; blocks[911] = "dark_oak_door"; blocks[912] = "dark_oak_planks"; blocks[1001] = "smithing_table"; blocks[1005] = "dark_oak_door"; blocks[1008] = "dark_oak_door"; blocks[1101] = "furnace_on"; blocks[1104] = "dark_oak_planks"; blocks[1105] = "dark_oak_planks"; blocks[1108] = "dark_oak_planks"; blocks[1109] = "dark_oak_planks"; blocks[1110] = "anvil_top"; blocks[1201] = "beehive"; blocks[1204] = "dark_oak_planks"; blocks[1205] = "dark_oak_planks"; blocks[1208] = "dark_oak_planks"; blocks[1209] = "dark_oak_planks"; blocks[1210] = "piston"; blocks[1212] = "crafting_table_top";
			floor("oak_planks");
			layer2[106] = "podzol"; layer2[107] = "podzol"; layer2[110] = "wither_rose"; layer2[206] = "podzol"; layer2[207] = "podzol"; layer2[303] = "blood_foot_right"; layer2[304] = "blood_foot_left"; layer2[306] = "podzol"; layer2[307] = "podzol"; layer2[309] = "blood_foot_right"; layer2[310] = "blood_foot_left"; layer2[402] = "blood"; layer2[406] = "podzol"; layer2[407] = "podzol"; layer2[411] = "knife"; layer2[506] = "podzol"; layer2[507] = "podzol"; layer2[602] = "blood"; layer2[606] = "podzol"; layer2[607] = "podzol"; layer2[611] = "blood_foot_right"; layer2[612] = "blood"; layer2[706] = "podzol"; layer2[707] = "podzol"; layer2[709] = "blood_foot_right"; layer2[710] = "blood_foot_left"; layer2[803] = "blood"; layer2[806] = "podzol"; layer2[807] = "podzol"; layer2[906] = "podzol"; layer2[907] = "podzol"; layer2[910] = "blood"; layer2[1006] = "podzol"; layer2[1007] = "podzol"; layer2[1106] = "podzol"; layer2[1107] = "podzol"; layer2[1202] = "blood"; layer2[1203] = "blood_foot_right"; layer2[1206] = "podzol"; layer2[1207] = "podzol"; layer2[1211] = "blood";
			events[6] = { "map": 12, "x": 13, "y": 10 };
			events[7] = { "map": 12, "x": 13, "y": 11 };
			events[1306] = { "map": 15, "x": 1, "y": 6 };
			events[1307] = { "map": 15, "x": 1, "y": 7 };
			if (knife.visible) layer2[411] = "air";
			if (!paper2.visible) events[401] = { "item": paper2, "itemName": "paper2", "type": "paper" };
			if (!paper3.visible) events[701] = { "item": paper3, "itemName": "paper3", "type": "paper" };
			if (!paper4.visible) events[1201] = { "item": paper4, "itemName": "paper4", "type": "paper" };
			fog_enable = true;
		} else if (map === 15) {
			blocks[101] = "dark_oak_planks"; blocks[102] = "tv"; blocks[104] = "dark_oak_planks"; blocks[105] = "dark_oak_planks"; blocks[108] = "dark_oak_planks"; blocks[109] = "dark_oak_planks"; blocks[110] = "cartography_table"; blocks[112] = "dark_oak_planks"; blocks[201] = "dark_oak_planks"; blocks[202] = "scaffolding"; blocks[204] = "dark_oak_planks"; blocks[205] = "dark_oak_planks"; blocks[208] = "dark_oak_planks"; blocks[209] = "dark_oak_planks"; blocks[210] = "crafting_table_top"; blocks[212] = "dark_oak_planks"; blocks[301] = "dark_oak_planks"; blocks[305] = "dark_oak_door"; blocks[308] = "dark_oak_door"; blocks[312] = "dark_oak_planks"; blocks[401] = "dark_oak_planks"; blocks[402] = "dark_oak_planks"; blocks[403] = "dark_oak_planks"; blocks[404] = "dark_oak_planks"; blocks[405] = "dark_oak_planks"; blocks[408] = "dark_oak_planks"; blocks[409] = "dark_oak_planks"; blocks[410] = "dark_oak_planks"; blocks[411] = "dark_oak_planks"; blocks[412] = "dark_oak_planks"; blocks[501] = "dark_oak_planks"; blocks[502] = "cobweb"; blocks[504] = "dark_oak_planks"; blocks[505] = "dark_oak_planks"; blocks[508] = "dark_oak_planks"; blocks[509] = "dark_oak_planks"; blocks[510] = "loom"; blocks[512] = "dark_oak_planks"; blocks[601] = "dark_oak_planks"; blocks[602] = "brewing_stand"; blocks[604] = "dark_oak_planks"; blocks[605] = "dark_oak_planks"; blocks[608] = "dark_oak_planks"; blocks[609] = "dark_oak_planks"; blocks[610] = "bookshelf"; blocks[612] = "dark_oak_planks"; blocks[701] = "dark_oak_planks"; blocks[702] = "brewing_stand"; blocks[705] = "dark_oak_door"; blocks[708] = "dark_oak_door"; blocks[712] = "dark_oak_planks"; blocks[801] = "dark_oak_planks"; blocks[802] = "dark_oak_planks"; blocks[803] = "dark_oak_planks"; blocks[804] = "dark_oak_planks"; blocks[805] = "dark_oak_planks"; blocks[808] = "dark_oak_planks"; blocks[809] = "dark_oak_planks"; blocks[810] = "dark_oak_planks"; blocks[811] = "dark_oak_planks"; blocks[812] = "dark_oak_planks"; blocks[901] = "iron_bars"; blocks[1001] = "iron_bars"; blocks[1003] = "sweet_berry_bush_stage3"; blocks[1005] = "sweet_berry_bush_stage3"; blocks[1008] = "sweet_berry_bush_stage3"; blocks[1010] = "sweet_berry_bush_stage3"; blocks[1101] = "dark_oak_planks"; blocks[1103] = "dark_oak_planks"; blocks[1104] = "dark_oak_planks"; blocks[1105] = "dark_oak_planks"; blocks[1106] = "oak_door"; blocks[1107] = "oak_door"; blocks[1108] = "dark_oak_planks"; blocks[1109] = "dark_oak_planks"; blocks[1110] = "dark_oak_planks"; blocks[1111] = "dark_oak_planks"; blocks[1112] = "dark_oak_planks"; blocks[1201] = "dark_oak_planks"; blocks[1203] = "dark_oak_planks"; blocks[1204] = "dark_oak_planks"; blocks[1205] = "dark_oak_planks"; blocks[1206] = "dark_oak_planks"; blocks[1207] = "dark_oak_planks"; blocks[1208] = "dark_oak_planks"; blocks[1209] = "dark_oak_planks"; blocks[1210] = "dark_oak_planks"; blocks[1211] = "dark_oak_planks"; blocks[1212] = "dark_oak_planks";
			floor("oak_planks");
			layer2[106] = "podzol"; layer2[107] = "podzol"; layer2[206] = "podzol"; layer2[207] = "podzol"; layer2[302] = "blood"; layer2[306] = "podzol"; layer2[307] = "podzol"; layer2[309] = "blood_foot_right"; layer2[310] = "blood_foot_left"; layer2[311] = "blood_foot_right"; layer2[406] = "podzol"; layer2[407] = "podzol"; layer2[502] = "composter"; layer2[506] = "podzol"; layer2[507] = "podzol"; layer2[511] = "blood"; layer2[606] = "podzol"; layer2[607] = "podzol"; layer2[706] = "podzol"; layer2[707] = "podzol"; layer2[806] = "podzol"; layer2[807] = "podzol"; layer2[901] = "podzol"; layer2[902] = "podzol"; layer2[903] = "podzol"; layer2[904] = "podzol"; layer2[905] = "podzol"; layer2[906] = "podzol"; layer2[907] = "podzol"; layer2[908] = "podzol"; layer2[909] = "podzol"; layer2[910] = "podzol"; layer2[911] = "podzol"; layer2[912] = "podzol"; layer2[1001] = "podzol"; layer2[1002] = "podzol"; layer2[1003] = "podzol"; layer2[1004] = "podzol"; layer2[1005] = "podzol"; layer2[1006] = "podzol"; layer2[1007] = "podzol"; layer2[1008] = "podzol"; layer2[1009] = "podzol"; layer2[1010] = "podzol"; layer2[1011] = "podzol"; layer2[1012] = "podzol"; layer2[1102] = "dark_oak_planks"; layer2[1106] = "gray_wool"; layer2[1107] = "gray_wool"; layer2[1202] = "dark_oak_planks";
			events[6] = { "map": 14, "x": 13, "y": 6 };
			events[7] = { "map": 14, "x": 13, "y": 7 };
			events[1013] = { "map": 19, "x": 3, "y": 1 };
			events[913] = { "map": 19, "x": 2, "y": 1 };
			events[1106] = { "map": 16, "x": 1, "y": 6 };
			events[1107] = { "map": 16, "x": 1, "y": 7 };
			events[1302] = { "map": 17, "x": 6, "y": 7 };
			events[900] = { "map": 21, "x": 6, "y": 13 };
			events[1000] = { "map": 21, "x": 7, "y": 13 };
			if (!paper7.visible) events[110] = { "item": paper7, "itemName": "paper7", "type": "paper" };
			fog_enable = true;
		} else if (map === 16) {
			blocks[101] = "dark_oak_planks"; blocks[102] = "dark_oak_planks"; blocks[103] = "dark_oak_planks"; blocks[104] = "dark_oak_planks"; blocks[105] = "dark_oak_planks"; blocks[106] = "oak_door"; blocks[107] = "oak_door"; blocks[108] = "dark_oak_planks"; blocks[109] = "dark_oak_planks"; blocks[110] = "dark_oak_planks"; blocks[111] = "dark_oak_planks"; blocks[112] = "dark_oak_planks"; blocks[201] = "dark_oak_planks"; blocks[202] = "bookshelf"; blocks[203] = "beehive"; blocks[211] = "cauldron"; blocks[212] = "dark_oak_planks"; blocks[301] = "dark_oak_planks"; blocks[302] = "bookshelf"; blocks[303] = "beehive"; blocks[311] = "brewing_stand"; blocks[312] = "dark_oak_planks"; blocks[401] = "dark_oak_planks"; blocks[402] = "bookshelf"; blocks[403] = "loom"; blocks[411] = "brewing_stand"; blocks[412] = "dark_oak_planks"; blocks[501] = "dark_oak_planks"; blocks[502] = "bookshelf"; blocks[503] = "tv"; blocks[511] = "brewing_stand"; blocks[512] = "dark_oak_planks"; blocks[601] = "dark_oak_planks"; blocks[602] = "bookshelf"; blocks[603] = "beehive"; blocks[611] = "brewing_stand"; blocks[612] = "dark_oak_planks"; blocks[701] = "dark_oak_planks"; blocks[702] = "bookshelf"; blocks[703] = "beehive"; blocks[711] = "smithing_table"; blocks[712] = "dark_oak_planks"; blocks[801] = "dark_oak_planks"; blocks[802] = "bookshelf"; blocks[803] = "beehive"; blocks[805] = "dark_oak_planks"; blocks[806] = "crafting_table_top"; blocks[807] = "enchanting_table"; blocks[808] = "cartography_table"; blocks[809] = "dark_oak_planks"; blocks[811] = "furnace"; blocks[812] = "dark_oak_planks"; blocks[901] = "dark_oak_planks"; blocks[902] = "bookshelf"; blocks[903] = "beehive"; blocks[905] = "dark_oak_planks"; blocks[907] = "anvil_top"; blocks[909] = "dark_oak_planks"; blocks[911] = "furnace"; blocks[912] = "dark_oak_planks"; blocks[1001] = "dark_oak_planks"; blocks[1002] = "bookshelf"; blocks[1003] = "beehive"; blocks[1011] = "furnace"; blocks[1012] = "dark_oak_planks"; blocks[1101] = "dark_oak_planks"; blocks[1102] = "bookshelf"; blocks[1103] = "spawner"; blocks[1111] = "smoker"; blocks[1112] = "dark_oak_planks"; blocks[1201] = "dark_oak_planks"; blocks[1202] = "dark_oak_planks"; blocks[1203] = "dark_oak_planks"; blocks[1204] = "dark_oak_planks"; blocks[1205] = "dark_oak_planks"; blocks[1206] = "dark_oak_planks"; blocks[1207] = "dark_oak_planks"; blocks[1208] = "dark_oak_planks"; blocks[1209] = "dark_oak_planks"; blocks[1210] = "dark_oak_planks"; blocks[1211] = "dark_oak_planks"; blocks[1212] = "dark_oak_planks";
			floor("oak_planks");
			layer2[106] = "black_wool"; layer2[107] = "black_wool"; layer2[204] = "cobweb"; layer2[209] = "cobweb"; layer2[210] = "cobweb"; layer2[505] = "blood_foot_right"; layer2[506] = "blood_foot_left"; layer2[507] = "blood_foot_right"; layer2[508] = "blood_foot_left"; layer2[509] = "blood_foot_right"; layer2[710] = "blood"; layer2[1006] = "blood";
			events[106] = { "map": 15, "x": 11, "y": 6 };
			events[107] = { "map": 15, "x": 11, "y": 7 };
			if (!paper5.visible) events[903] = { "item": paper5, "itemName": "paper5", "type": "paper" };
			fog_enable = true;
		} else if (map === 17) {
			blocks[304] = "mossy_stone_bricks"; blocks[305] = "mossy_stone_bricks"; blocks[306] = "cracked_stone_bricks"; blocks[307] = "carved_pumpkin"; blocks[308] = "stone_bricks"; blocks[309] = "cracked_stone_bricks"; blocks[310] = "stone_bricks"; blocks[404] = "stone_bricks"; blocks[405] = "mossy_stone_bricks"; blocks[406] = "mossy_stone_bricks"; blocks[407] = "mossy_stone_bricks"; blocks[408] = "mossy_stone_bricks"; blocks[409] = "cracked_stone_bricks"; blocks[410] = "mossy_stone_bricks"; blocks[504] = "mossy_stone_bricks"; blocks[505] = "cracked_stone_bricks"; blocks[509] = "cracked_stone_bricks"; blocks[510] = "mossy_stone_bricks"; blocks[604] = "stone_bricks"; blocks[605] = "mossy_stone_bricks"; blocks[609] = "stone_bricks"; blocks[610] = "carved_pumpkin"; blocks[704] = "cracked_stone_bricks"; blocks[705] = "mossy_stone_bricks"; blocks[709] = "mossy_stone_bricks"; blocks[710] = "cracked_stone_bricks"; blocks[804] = "cracked_stone_bricks"; blocks[805] = "mossy_stone_bricks"; blocks[809] = "stone_bricks"; blocks[810] = "mossy_stone_bricks"; blocks[904] = "mossy_stone_bricks"; blocks[905] = "stone_bricks"; blocks[909] = "mossy_stone_bricks"; blocks[910] = "mossy_stone_bricks"; blocks[1004] = "mossy_stone_bricks"; blocks[1005] = "cracked_stone_bricks"; blocks[1009] = "stone_bricks"; blocks[1010] = "mossy_stone_bricks"; blocks[1104] = "carved_pumpkin"; blocks[1105] = "mossy_stone_bricks"; blocks[1109] = "cracked_stone_bricks"; blocks[1110] = "carved_pumpkin"; blocks[1204] = "cracked_stone_bricks"; blocks[1205] = "cracked_stone_bricks"; blocks[1209] = "mossy_stone_bricks"; blocks[1210] = "mossy_stone_bricks";
			floor("soul_sand");
			layer2[708] = "blood"; layer2[906] = "blood";
			events[1306] = { "map": 18, "x": 1, "y": 6 };
			events[1307] = { "map": 18, "x": 1, "y": 7 };
			events[1308] = { "map": 18, "x": 1, "y": 8 };
			fog_enable = true;
		} else if (map === 18) {
			blocks[101] = "chiseled_red_sandstone"; blocks[102] = "carved_pumpkin"; blocks[103] = "chiseled_red_sandstone"; blocks[104] = "chiseled_red_sandstone"; blocks[108] = "chiseled_red_sandstone"; blocks[109] = "chiseled_red_sandstone"; blocks[110] = "carved_pumpkin"; blocks[111] = "chiseled_red_sandstone"; blocks[112] = "chiseled_red_sandstone"; blocks[201] = "chiseled_red_sandstone"; blocks[202] = "carved_pumpkin"; blocks[210] = "carved_pumpkin"; blocks[211] = "chiseled_red_sandstone"; blocks[212] = "chiseled_red_sandstone"; blocks[301] = "chiseled_red_sandstone"; blocks[302] = "carved_pumpkin"; blocks[310] = "carved_pumpkin"; blocks[311] = "chiseled_red_sandstone"; blocks[312] = "chiseled_red_sandstone"; blocks[401] = "chiseled_red_sandstone"; blocks[402] = "carved_pumpkin"; blocks[410] = "carved_pumpkin"; blocks[411] = "chiseled_red_sandstone"; blocks[412] = "chiseled_red_sandstone"; blocks[501] = "chiseled_red_sandstone"; blocks[502] = "carved_pumpkin"; blocks[510] = "carved_pumpkin"; blocks[511] = "chiseled_red_sandstone"; blocks[512] = "chiseled_red_sandstone"; blocks[601] = "chiseled_red_sandstone"; blocks[602] = "carved_pumpkin"; blocks[610] = "carved_pumpkin"; blocks[611] = "chiseled_red_sandstone"; blocks[612] = "chiseled_red_sandstone"; blocks[701] = "chiseled_red_sandstone"; blocks[702] = "carved_pumpkin"; blocks[710] = "carved_pumpkin"; blocks[711] = "chiseled_red_sandstone"; blocks[712] = "chiseled_red_sandstone"; blocks[801] = "chiseled_red_sandstone"; blocks[802] = "carved_pumpkin"; blocks[806] = "beacon"; blocks[810] = "carved_pumpkin"; blocks[811] = "chiseled_red_sandstone"; blocks[812] = "chiseled_red_sandstone"; blocks[901] = "chiseled_red_sandstone"; blocks[902] = "carved_pumpkin"; blocks[910] = "carved_pumpkin"; blocks[911] = "chiseled_red_sandstone"; blocks[912] = "chiseled_red_sandstone"; blocks[1001] = "chiseled_red_sandstone"; blocks[1002] = "carved_pumpkin"; blocks[1010] = "carved_pumpkin"; blocks[1011] = "chiseled_red_sandstone"; blocks[1012] = "chiseled_red_sandstone"; blocks[1101] = "chiseled_red_sandstone"; blocks[1102] = "carved_pumpkin"; blocks[1110] = "carved_pumpkin"; blocks[1111] = "chiseled_red_sandstone"; blocks[1112] = "chiseled_red_sandstone"; blocks[1201] = "chiseled_red_sandstone"; blocks[1202] = "carved_pumpkin"; blocks[1203] = "spawner"; blocks[1204] = "spawner"; blocks[1205] = "spawner"; blocks[1206] = "spawner"; blocks[1207] = "spawner"; blocks[1208] = "spawner"; blocks[1209] = "spawner"; blocks[1210] = "carved_pumpkin"; blocks[1211] = "chiseled_red_sandstone"; blocks[1212] = "chiseled_red_sandstone";
			floor("stone");
			layer2[105] = "stone"; layer2[106] = "stone"; layer2[107] = "stone"; layer2[203] = "stone"; layer2[204] = "stone"; layer2[205] = "stone"; layer2[206] = "stone"; layer2[207] = "stone"; layer2[208] = "stone"; layer2[209] = "stone"; layer2[303] = "stone"; layer2[304] = "stone"; layer2[305] = "stone"; layer2[306] = "stone"; layer2[307] = "stone"; layer2[308] = "stone"; layer2[309] = "stone"; layer2[403] = "stone"; layer2[404] = "stone"; layer2[405] = "stone"; layer2[406] = "stone"; layer2[407] = "stone"; layer2[408] = "stone"; layer2[409] = "stone"; layer2[503] = "stone"; layer2[504] = "stone"; layer2[505] = "stone"; layer2[506] = "stone"; layer2[507] = "stone"; layer2[508] = "stone"; layer2[509] = "stone"; layer2[603] = "stone"; layer2[604] = "stone"; layer2[605] = "end_portal_frame_top"; layer2[606] = "end_portal_frame_top"; layer2[607] = "end_portal_frame_top"; layer2[608] = "stone"; layer2[609] = "stone"; layer2[703] = "stone"; layer2[704] = "end_portal_frame_top"; layer2[705] = "black_wool"; layer2[706] = "black_wool"; layer2[707] = "black_wool"; layer2[708] = "end_portal_frame_top"; layer2[709] = "stone"; layer2[803] = "stone"; layer2[804] = "end_portal_frame_top"; layer2[805] = "black_wool"; layer2[806] = "spawner"; layer2[807] = "black_wool"; layer2[808] = "end_portal_frame_top"; layer2[809] = "stone"; layer2[903] = "stone"; layer2[904] = "end_portal_frame_top"; layer2[905] = "black_wool"; layer2[906] = "black_wool"; layer2[907] = "black_wool"; layer2[908] = "end_portal_frame_top"; layer2[909] = "stone"; layer2[1003] = "stone"; layer2[1004] = "stone"; layer2[1005] = "end_portal_frame_top"; layer2[1006] = "end_portal_frame_top"; layer2[1007] = "end_portal_frame_top"; layer2[1008] = "stone"; layer2[1009] = "stone"; layer2[1103] = "stone"; layer2[1104] = "stone"; layer2[1105] = "stone"; layer2[1106] = "stone"; layer2[1107] = "stone"; layer2[1108] = "stone"; layer2[1109] = "stone";
			if (!zombies) events[806] = { "event": "blood" };
			fog_enable = true;
		} else if (map === 19) {
			blocks[101] = "dark_prismarine"; blocks[102] = "dark_prismarine"; blocks[103] = "dark_prismarine"; blocks[104] = "dark_prismarine"; blocks[105] = "dark_prismarine"; blocks[106] = "iron_bars"; blocks[107] = "iron_bars"; blocks[108] = "dark_prismarine"; blocks[109] = "dark_prismarine"; blocks[110] = "soul_sand"; blocks[111] = "soul_sand"; blocks[112] = "soul_sand"; blocks[210] = "dark_prismarine"; blocks[211] = "soul_sand"; blocks[212] = "soul_sand"; blocks[311] = "dark_prismarine"; blocks[312] = "soul_sand"; blocks[401] = "dark_prismarine"; blocks[402] = "dark_prismarine"; blocks[403] = "dark_prismarine"; blocks[404] = "dark_prismarine"; blocks[405] = "dark_prismarine"; blocks[406] = "dark_prismarine"; blocks[407] = "dark_prismarine"; blocks[412] = "dark_prismarine"; blocks[501] = "soul_sand"; blocks[502] = "soul_sand"; blocks[503] = "soul_sand"; blocks[504] = "soul_sand"; blocks[505] = "soul_sand"; blocks[506] = "soul_sand"; blocks[507] = "soul_sand"; blocks[508] = "dark_prismarine"; blocks[510] = "sweet_berry_bush_stage3"; blocks[512] = "dark_prismarine"; blocks[601] = "soul_sand"; blocks[602] = "soul_sand"; blocks[603] = "soul_sand"; blocks[604] = "soul_sand"; blocks[605] = "soul_sand"; blocks[606] = "soul_sand"; blocks[607] = "soul_sand"; blocks[608] = "dark_prismarine"; blocks[612] = "dark_prismarine"; blocks[701] = "soul_sand"; blocks[702] = "soul_sand"; blocks[703] = "soul_sand"; blocks[704] = "soul_sand"; blocks[705] = "soul_sand"; blocks[706] = "soul_sand"; blocks[707] = "dark_prismarine"; blocks[708] = "dark_prismarine"; blocks[712] = "dark_prismarine"; blocks[801] = "soul_sand"; blocks[802] = "soul_sand"; blocks[803] = "soul_sand"; blocks[804] = "soul_sand"; blocks[805] = "dark_prismarine"; blocks[806] = "dark_prismarine"; blocks[811] = "sweet_berry_bush_stage3"; blocks[812] = "dark_prismarine"; blocks[901] = "soul_sand"; blocks[902] = "soul_sand"; blocks[903] = "soul_sand"; blocks[904] = "dark_prismarine"; blocks[912] = "dark_prismarine"; blocks[1001] = "soul_sand"; blocks[1002] = "soul_sand"; blocks[1003] = "dark_prismarine"; blocks[1004] = "sweet_berry_bush_stage3"; blocks[1012] = "dark_prismarine"; blocks[1101] = "quartz_block"; blocks[1102] = "chiseled_quartz_block"; blocks[1103] = "quartz_block"; blocks[1104] = "chiseled_quartz_block"; blocks[1105] = "quartz_block"; blocks[1106] = "chiseled_quartz_block"; blocks[1107] = "oak_door"; blocks[1108] = "chiseled_quartz_block"; blocks[1109] = "quartz_block"; blocks[1110] = "chiseled_quartz_block"; blocks[1112] = "dark_prismarine"; blocks[1201] = "quartz_block"; blocks[1202] = "quartz_block"; blocks[1203] = "quartz_block"; blocks[1204] = "quartz_block"; blocks[1205] = "quartz_block"; blocks[1206] = "quartz_block"; blocks[1207] = "quartz_block"; blocks[1208] = "quartz_block"; blocks[1209] = "quartz_block"; blocks[1210] = "quartz_block"; blocks[1212] = "dark_prismarine";
			floor("podzol");
			layer2[206] = "sweet_berry_bush_stage1"; layer2[304] = "sweet_berry_bush_stage1"; layer2[309] = "sweet_berry_bush_stage1"; layer2[411] = "sweet_berry_bush_stage1"; layer2[611] = "sweet_berry_bush_stage1"; layer2[709] = "sweet_berry_bush_stage1"; layer2[808] = "sweet_berry_bush_stage1"; layer2[1010] = "sweet_berry_bush_stage1"; layer2[1211] = "sweet_berry_bush_stage1";
			events[200] = { "map": 15, "x": 9, "y": 13 };
			events[300] = { "map": 15, "x": 10, "y": 13 };
			events[1107] = { "map": 20, "x": 2, "y": 7 };
			events[6] = { "map": 23, "x": 13, "y": 6 };
			events[7] = { "map": 23, "x": 13, "y": 7 };
			fog_enable = true;
		} else if (map === 20) {
			blocks[101] = "sea_lantern"; blocks[102] = "quartz_block"; blocks[103] = "quartz_block"; blocks[104] = "quartz_block"; blocks[105] = "quartz_block"; blocks[106] = "quartz_block"; blocks[107] = "oak_door"; blocks[108] = "quartz_block"; blocks[109] = "quartz_block"; blocks[110] = "quartz_block"; blocks[111] = "quartz_block"; blocks[112] = "sea_lantern"; blocks[201] = "quartz_block"; blocks[202] = "anvil_top"; blocks[203] = "anvil_top"; blocks[204] = "anvil_top"; blocks[205] = "anvil_top"; blocks[206] = "anvil_top"; blocks[208] = "anvil_top"; blocks[209] = "anvil_top"; blocks[210] = "anvil_top"; blocks[211] = "anvil_top"; blocks[212] = "quartz_block"; blocks[301] = "quartz_block"; blocks[312] = "quartz_block"; blocks[401] = "quartz_block"; blocks[402] = "anvil_top"; blocks[403] = "anvil_top"; blocks[404] = "anvil_top"; blocks[405] = "anvil_top"; blocks[406] = "anvil_top"; blocks[408] = "anvil_top"; blocks[409] = "anvil_top"; blocks[410] = "anvil_top"; blocks[411] = "anvil_top"; blocks[412] = "quartz_block"; blocks[501] = "quartz_block"; blocks[512] = "quartz_block"; blocks[601] = "quartz_block"; blocks[602] = "anvil_top"; blocks[603] = "anvil_top"; blocks[604] = "anvil_top"; blocks[605] = "anvil_top"; blocks[606] = "anvil_top"; blocks[608] = "anvil_top"; blocks[609] = "anvil_top"; blocks[610] = "anvil_top"; blocks[611] = "anvil_top"; blocks[612] = "quartz_block"; blocks[701] = "quartz_block"; blocks[712] = "quartz_block"; blocks[801] = "quartz_block"; blocks[802] = "anvil_top"; blocks[803] = "anvil_top"; blocks[804] = "anvil_top"; blocks[805] = "anvil_top"; blocks[806] = "anvil_top"; blocks[808] = "anvil_top"; blocks[809] = "anvil_top"; blocks[810] = "anvil_top"; blocks[811] = "anvil_top"; blocks[812] = "quartz_block"; blocks[901] = "quartz_block"; blocks[912] = "quartz_block"; blocks[1001] = "quartz_block"; blocks[1002] = "loom"; blocks[1007] = "enchanting_table"; blocks[1012] = "quartz_block"; blocks[1101] = "quartz_block"; blocks[1102] = "beehive"; blocks[1112] = "quartz_block"; blocks[1201] = "sea_lantern"; blocks[1202] = "quartz_block"; blocks[1203] = "quartz_block"; blocks[1204] = "quartz_block"; blocks[1205] = "quartz_block"; blocks[1206] = "quartz_block"; blocks[1207] = "quartz_block"; blocks[1208] = "quartz_block"; blocks[1209] = "quartz_block"; blocks[1210] = "quartz_block"; blocks[1211] = "quartz_block"; blocks[1212] = "sea_lantern";
			floor("white_wool");
			blocks[1107] = "goddad";
			events[1107] = { "event": "goddad" };
			layer2[1001] = "quartz_block"; layer2[1002] = "quartz_block"; layer2[1003] = "quartz_block"; layer2[1004] = "quartz_block"; layer2[1005] = "quartz_block"; layer2[1006] = "quartz_block"; layer2[1007] = "quartz_block"; layer2[1008] = "quartz_block"; layer2[1009] = "quartz_block"; layer2[1010] = "quartz_block"; layer2[1011] = "quartz_block"; layer2[1012] = "quartz_block"; layer2[1101] = "quartz_block"; layer2[1102] = "quartz_block"; layer2[1103] = "quartz_block"; layer2[1104] = "quartz_block"; layer2[1105] = "quartz_block"; layer2[1106] = "quartz_block"; layer2[1107] = "quartz_block"; layer2[1108] = "quartz_block"; layer2[1109] = "quartz_block"; layer2[1110] = "quartz_block"; layer2[1111] = "quartz_block"; layer2[1112] = "quartz_block";
			events[107] = { "map": 19, "x": 10, "y": 7 };
			fog_enable = false;
			if (!jimmy_bar.visible) events[1102] = { "item": jimmy_bar, "itemName": "jimmy_bar", "type": "jimmy_bar" };
		} else if (map === 21) {
			blocks[101] = "soul_sand"; blocks[102] = "soul_sand"; blocks[103] = "soul_sand"; blocks[104] = "soul_sand"; blocks[105] = "soul_sand"; blocks[106] = "soul_sand"; blocks[107] = "soul_sand"; blocks[108] = "soul_sand"; blocks[109] = "soul_sand"; blocks[110] = "soul_sand"; blocks[111] = "soul_sand"; blocks[112] = "soul_sand"; blocks[201] = "soul_sand"; blocks[202] = "soul_sand"; blocks[203] = "soul_sand"; blocks[204] = "soul_sand"; blocks[205] = "soul_sand"; blocks[206] = "soul_sand"; blocks[207] = "soul_sand"; blocks[208] = "soul_sand"; blocks[209] = "soul_sand"; blocks[210] = "soul_sand"; blocks[211] = "soul_sand"; blocks[212] = "soul_sand"; blocks[301] = "soul_sand"; blocks[302] = "soul_sand"; blocks[303] = "soul_sand"; blocks[304] = "soul_sand"; blocks[305] = "soul_sand"; blocks[306] = "soul_sand"; blocks[307] = "soul_sand"; blocks[308] = "soul_sand"; blocks[309] = "soul_sand"; blocks[310] = "soul_sand"; blocks[311] = "soul_sand"; blocks[312] = "soul_sand"; blocks[401] = "soul_sand"; blocks[402] = "soul_sand"; blocks[403] = "soul_sand"; blocks[404] = "soul_sand"; blocks[405] = "soul_sand"; blocks[406] = "soul_sand"; blocks[407] = "soul_sand"; blocks[408] = "soul_sand"; blocks[409] = "soul_sand"; blocks[410] = "soul_sand"; blocks[411] = "soul_sand"; blocks[412] = "soul_sand"; blocks[501] = "dark_prismarine"; blocks[502] = "dark_prismarine"; blocks[503] = "dark_prismarine"; blocks[504] = "dark_prismarine"; blocks[505] = "dark_prismarine"; blocks[506] = "dark_prismarine"; blocks[507] = "dark_prismarine"; blocks[508] = "dark_prismarine"; blocks[509] = "dark_prismarine"; blocks[510] = "dark_prismarine"; blocks[511] = "dark_prismarine"; blocks[512] = "dark_prismarine"; blocks[801] = "dark_prismarine"; blocks[802] = "dark_prismarine"; blocks[803] = "dark_prismarine"; blocks[804] = "dark_prismarine"; blocks[805] = "dark_prismarine"; blocks[806] = "dark_prismarine"; blocks[807] = "dark_prismarine"; blocks[808] = "dark_prismarine"; blocks[809] = "dark_prismarine"; blocks[810] = "dark_prismarine"; blocks[811] = "dark_prismarine"; blocks[812] = "dark_prismarine"; blocks[901] = "soul_sand"; blocks[902] = "soul_sand"; blocks[903] = "soul_sand"; blocks[904] = "soul_sand"; blocks[905] = "soul_sand"; blocks[906] = "soul_sand"; blocks[907] = "soul_sand"; blocks[908] = "soul_sand"; blocks[909] = "soul_sand"; blocks[910] = "soul_sand"; blocks[911] = "soul_sand"; blocks[912] = "soul_sand"; blocks[1001] = "soul_sand"; blocks[1002] = "soul_sand"; blocks[1003] = "soul_sand"; blocks[1004] = "soul_sand"; blocks[1005] = "soul_sand"; blocks[1006] = "soul_sand"; blocks[1007] = "soul_sand"; blocks[1008] = "soul_sand"; blocks[1009] = "soul_sand"; blocks[1010] = "soul_sand"; blocks[1011] = "soul_sand"; blocks[1012] = "soul_sand"; blocks[1101] = "soul_sand"; blocks[1102] = "soul_sand"; blocks[1103] = "soul_sand"; blocks[1104] = "soul_sand"; blocks[1105] = "soul_sand"; blocks[1106] = "soul_sand"; blocks[1107] = "soul_sand"; blocks[1108] = "soul_sand"; blocks[1109] = "soul_sand"; blocks[1110] = "soul_sand"; blocks[1111] = "soul_sand"; blocks[1112] = "soul_sand"; blocks[1201] = "soul_sand"; blocks[1202] = "soul_sand"; blocks[1203] = "soul_sand"; blocks[1204] = "soul_sand"; blocks[1205] = "soul_sand"; blocks[1206] = "soul_sand"; blocks[1207] = "soul_sand"; blocks[1208] = "soul_sand"; blocks[1209] = "soul_sand"; blocks[1210] = "soul_sand"; blocks[1211] = "soul_sand"; blocks[1212] = "soul_sand";
			floor("podzol");
			events[613] = { "map": 22, "x": 6, "y": 3 };
			events[713] = { "map": 22, "x": 6, "y": 3 };
			events[600] = { "event": "out" };
			events[700] = { "event": "out" };
			fog_enable = true;
		} else if (map === 22) {
			blocks[101] = "stone_bricks"; blocks[102] = "mossy_stone_bricks"; blocks[103] = "mossy_stone_bricks"; blocks[104] = "stone_bricks"; blocks[105] = "cracked_stone_bricks"; blocks[106] = "stone_bricks"; blocks[107] = "cracked_stone_bricks"; blocks[108] = "stone_bricks"; blocks[109] = "stone_bricks"; blocks[110] = "stone_bricks"; blocks[111] = "mossy_stone_bricks"; blocks[112] = "mossy_stone_bricks"; blocks[201] = "stone_bricks"; blocks[202] = "bookshelf"; blocks[203] = "redstone_lamp"; blocks[211] = "redstone_lamp"; blocks[212] = "mossy_stone_bricks"; blocks[301] = "cracked_stone_bricks"; blocks[302] = "bookshelf"; blocks[312] = "stone_bricks"; blocks[401] = "cracked_stone_bricks"; blocks[402] = "bookshelf"; blocks[407] = "composter"; blocks[408] = "composter"; blocks[409] = "composter"; blocks[412] = "stone_bricks"; blocks[501] = "stone_bricks"; blocks[502] = "bookshelf"; blocks[507] = "crafting_table_top"; blocks[512] = "stone_bricks"; blocks[601] = "podzol"; blocks[602] = "oak_door"; blocks[607] = "enchanting_table"; blocks[609] = "wither_rose"; blocks[612] = "cracked_stone_bricks"; blocks[701] = "cracked_stone_bricks"; blocks[702] = "bookshelf"; blocks[707] = "cartography_table"; blocks[712] = "cracked_stone_bricks"; blocks[801] = "stone_bricks"; blocks[802] = "bookshelf"; blocks[807] = "composter"; blocks[808] = "composter"; blocks[809] = "composter"; blocks[812] = "stone_bricks"; blocks[901] = "stone_bricks"; blocks[902] = "bookshelf"; blocks[912] = "mossy_stone_bricks"; blocks[1001] = "stone_bricks"; blocks[1002] = "bookshelf"; blocks[1003] = "redstone_lamp"; blocks[1011] = "redstone_lamp"; blocks[1012] = "mossy_stone_bricks"; blocks[1101] = "mossy_stone_bricks"; blocks[1102] = "bookshelf"; blocks[1103] = "cauldron"; blocks[1104] = "jukebox"; blocks[1105] = "smithing_table"; blocks[1106] = "fletching_table"; blocks[1107] = "brewing_stand"; blocks[1108] = "brewing_stand"; blocks[1109] = "furnace"; blocks[1110] = "smoker"; blocks[1111] = "redstone_block"; blocks[1112] = "stone_bricks"; blocks[1201] = "mossy_stone_bricks"; blocks[1202] = "mossy_stone_bricks"; blocks[1203] = "stone_bricks"; blocks[1204] = "cracked_stone_bricks"; blocks[1205] = "stone_bricks"; blocks[1206] = "mossy_stone_bricks"; blocks[1207] = "mossy_stone_bricks"; blocks[1208] = "mossy_stone_bricks"; blocks[1209] = "mossy_stone_bricks"; blocks[1210] = "stone_bricks"; blocks[1211] = "stone_bricks"; blocks[1212] = "cracked_stone_bricks";
			floor("oak_planks");
			layer2[204] = "blood"; layer2[303] = "cobweb"; layer2[311] = "cobweb"; layer2[601] = "podzol"; layer2[602] = "podzol"; layer2[603] = "blood_foot_left"; layer2[604] = "blood_foot_right"; layer2[605] = "blood_foot_left"; layer2[606] = "blood_foot_right"; layer2[609] = "blood"; layer2[1008] = "blood";
			events[602] = { "event": "miss" };
			if (cd.visible) events[1104] = { "event": "diff" };
			fog_enable = true;
		} else if (map === 23) {
			blocks[101] = "iron_bars"; blocks[103] = "nether_wart_stage3"; blocks[104] = "iron_bars"; blocks[106] = "nether_wart_stage3"; blocks[109] = "sweet_berry_bush_stage3"; blocks[110] = "sweet_berry_bush_stage3"; blocks[111] = "sweet_berry_bush_stage1"; blocks[112] = "sweet_berry_bush_stage2"; blocks[201] = "iron_bars"; blocks[202] = "iron_bars"; blocks[204] = "iron_bars"; blocks[210] = "sweet_berry_bush_stage1"; blocks[211] = "sweet_berry_bush_stage2"; blocks[212] = "sweet_berry_bush_stage2"; blocks[301] = "iron_bars"; blocks[302] = "iron_bars"; blocks[304] = "iron_bars"; blocks[305] = "nether_wart_stage3"; blocks[310] = "sweet_berry_bush_stage3"; blocks[311] = "sweet_berry_bush_stage1"; blocks[312] = "sweet_berry_bush_stage1"; blocks[401] = "dark_prismarine"; blocks[402] = "dark_prismarine"; blocks[403] = "dark_prismarine"; blocks[404] = "carved_pumpkin"; blocks[409] = "sweet_berry_bush_stage1"; blocks[411] = "sweet_berry_bush_stage2"; blocks[412] = "sweet_berry_bush_stage1"; blocks[501] = "soul_sand"; blocks[502] = "soul_sand"; blocks[503] = "soul_sand"; blocks[504] = "dark_prismarine"; blocks[512] = "sweet_berry_bush_stage2"; blocks[601] = "soul_sand"; blocks[602] = "soul_sand"; blocks[603] = "soul_sand"; blocks[604] = "soul_sand"; blocks[605] = "dark_prismarine"; blocks[608] = "sweet_berry_bush_stage1"; blocks[610] = "sweet_berry_bush_stage1"; blocks[611] = "spawner"; blocks[612] = "sweet_berry_bush_stage2"; blocks[701] = "soul_sand"; blocks[702] = "soul_sand"; blocks[703] = "soul_sand"; blocks[704] = "soul_sand"; blocks[705] = "dark_prismarine"; blocks[710] = "sweet_berry_bush_stage3"; blocks[711] = "sweet_berry_bush_stage1"; blocks[712] = "sweet_berry_bush_stage1"; blocks[801] = "soul_sand"; blocks[802] = "soul_sand"; blocks[803] = "soul_sand"; blocks[804] = "soul_sand"; blocks[805] = "dark_prismarine"; blocks[811] = "sweet_berry_bush_stage2"; blocks[812] = "sweet_berry_bush_stage1"; blocks[901] = "soul_sand"; blocks[902] = "soul_sand"; blocks[903] = "soul_sand"; blocks[904] = "soul_sand"; blocks[905] = "dark_prismarine"; blocks[909] = "sweet_berry_bush_stage3"; blocks[912] = "sweet_berry_bush_stage2"; blocks[1001] = "soul_sand"; blocks[1002] = "soul_sand"; blocks[1003] = "soul_sand"; blocks[1004] = "soul_sand"; blocks[1005] = "dark_prismarine"; blocks[1010] = "sweet_berry_bush_stage3"; blocks[1011] = "sweet_berry_bush_stage1"; blocks[1012] = "sweet_berry_bush_stage1"; blocks[1101] = "soul_sand"; blocks[1102] = "soul_sand"; blocks[1103] = "soul_sand"; blocks[1104] = "soul_sand"; blocks[1105] = "dark_prismarine"; blocks[1110] = "sweet_berry_bush_stage1"; blocks[1111] = "sweet_berry_bush_stage1"; blocks[1112] = "sweet_berry_bush_stage2"; blocks[1201] = "soul_sand"; blocks[1202] = "soul_sand"; blocks[1203] = "soul_sand"; blocks[1204] = "soul_sand"; blocks[1205] = "dark_prismarine"; blocks[1209] = "sweet_berry_bush_stage3"; blocks[1210] = "sweet_berry_bush_stage1"; blocks[1211] = "sweet_berry_bush_stage1"; blocks[1212] = "sweet_berry_bush_stage2";
			floor("podzol");
			layer2[107] = "powered_rail"; layer2[201] = "blood_foot_right"; layer2[202] = "blood_foot_left"; layer2[203] = "blood_foot_right"; layer2[204] = "blood_foot_left"; layer2[207] = "powered_rail"; layer2[209] = "blood"; layer2[307] = "powered_rail"; layer2[407] = "powered_rail"; layer2[506] = "blood_foot_right"; layer2[507] = "powered_rail"; layer2[508] = "blood_foot_right"; layer2[509] = "blood_foot_left"; layer2[510] = "blood_foot_right"; layer2[511] = "blood_foot_left"; layer2[607] = "powered_rail"; layer2[707] = "powered_rail"; layer2[807] = "powered_rail"; layer2[907] = "powered_rail"; layer2[1007] = "powered_rail"; layer2[1010] = "blood"; layer2[1107] = "powered_rail"; layer2[1207] = "powered_rail";
			events[1306] = { "map": 19, "x": 1, "y": 6 };
			events[1307] = { "map": 19, "x": 1, "y": 7 };
			events[1308] = { "map": 19, "x": 1, "y": 7 };
			events[100] = { "map": 24, "x": 6, "y": 13 };
			events[200] = { "map": 24, "x": 7, "y": 13 };
			events[300] = { "map": 24, "x": 8, "y": 13 };
			fog_enable = true;
		} else if (map === 24) {
			blocks[101] = "coal_ore"; blocks[102] = "andesite"; blocks[103] = "gravel"; blocks[104] = "gravel"; blocks[105] = "gravel"; blocks[106] = "gravel"; blocks[107] = "gravel"; blocks[108] = "andesite"; blocks[109] = "andesite"; blocks[110] = "andesite"; blocks[111] = "andesite"; blocks[112] = "iron_ore"; blocks[201] = "andesite"; blocks[202] = "gravel"; blocks[207] = "gravel"; blocks[208] = "gravel"; blocks[209] = "andesite"; blocks[210] = "andesite"; blocks[211] = "andesite"; blocks[212] = "andesite"; blocks[301] = "andesite"; blocks[308] = "gravel"; blocks[309] = "gravel"; blocks[310] = "andesite"; blocks[311] = "iron_ore"; blocks[312] = "andesite"; blocks[401] = "gravel"; blocks[409] = "gravel"; blocks[410] = "gravel"; blocks[411] = "andesite"; blocks[412] = "andesite"; blocks[501] = "gravel"; blocks[511] = "gravel"; blocks[512] = "gravel"; blocks[601] = "gravel"; blocks[701] = "gravel"; blocks[702] = "gravel"; blocks[801] = "andesite"; blocks[802] = "gravel"; blocks[901] = "andesite"; blocks[902] = "andesite"; blocks[903] = "gravel"; blocks[910] = "gravel"; blocks[911] = "andesite"; blocks[912] = "andesite"; blocks[1001] = "andesite"; blocks[1002] = "coal_ore"; blocks[1003] = "gravel"; blocks[1009] = "gravel"; blocks[1010] = "andesite"; blocks[1011] = "coal_ore"; blocks[1012] = "andesite"; blocks[1101] = "andesite"; blocks[1102] = "andesite"; blocks[1103] = "andesite"; blocks[1104] = "gravel"; blocks[1108] = "gravel"; blocks[1109] = "gravel"; blocks[1110] = "andesite"; blocks[1111] = "andesite"; blocks[1112] = "coal_ore"; blocks[1201] = "coal_ore"; blocks[1202] = "andesite"; blocks[1203] = "andesite"; blocks[1204] = "gravel"; blocks[1205] = "gravel"; blocks[1206] = "gravel"; blocks[1207] = "gravel"; blocks[1208] = "gravel"; blocks[1209] = "andesite"; blocks[1210] = "andesite"; blocks[1211] = "coal_ore"; blocks[1212] = "coal_ore";
			floor("stone");
			layer2[304] = "coal_ore"; layer2[307] = "iron_ore"; layer2[404] = "coal_ore"; layer2[505] = "coal_ore"; layer2[707] = "powered_rail"; layer2[804] = "coal_ore"; layer2[807] = "powered_rail"; layer2[808] = "coal_ore"; layer2[906] = "iron_ore"; layer2[907] = "powered_rail"; layer2[1007] = "powered_rail"; layer2[1107] = "powered_rail"; layer2[1207] = "powered_rail";
			blocks[709] = "miner";
			fog_enable = false;
		} else if (map === 25) {
			blocks[101] = "black_wool"; blocks[102] = "white_wool"; blocks[103] = "black_wool"; blocks[104] = "black_wool"; blocks[105] = "black_wool"; blocks[106] = "black_wool"; blocks[107] = "black_wool"; blocks[108] = "white_wool"; blocks[109] = "black_wool"; blocks[110] = "white_wool"; blocks[201] = "black_wool"; blocks[202] = "white_wool"; blocks[203] = "black_wool"; blocks[204] = "white_wool"; blocks[205] = "black_wool"; blocks[206] = "white_wool"; blocks[207] = "black_wool"; blocks[208] = "white_wool"; blocks[209] = "black_wool"; blocks[210] = "white_wool"; blocks[301] = "black_wool"; blocks[302] = "white_wool"; blocks[303] = "black_wool"; blocks[304] = "white_wool"; blocks[305] = "black_wool"; blocks[306] = "white_wool"; blocks[307] = "black_wool"; blocks[308] = "white_wool"; blocks[309] = "black_wool"; blocks[310] = "white_wool"; blocks[401] = "black_wool"; blocks[402] = "white_wool"; blocks[403] = "white_wool"; blocks[404] = "white_wool"; blocks[405] = "white_wool"; blocks[406] = "white_wool"; blocks[407] = "white_wool"; blocks[408] = "white_wool"; blocks[409] = "black_wool"; blocks[410] = "white_wool"; blocks[501] = "black_wool"; blocks[502] = "white_wool"; blocks[503] = "black_wool"; blocks[504] = "black_wool"; blocks[505] = "black_wool"; blocks[506] = "black_wool"; blocks[507] = "black_wool"; blocks[508] = "white_wool"; blocks[509] = "black_wool"; blocks[510] = "white_wool"; blocks[601] = "black_wool"; blocks[602] = "white_wool"; blocks[603] = "white_wool"; blocks[604] = "black_wool"; blocks[605] = "white_wool"; blocks[606] = "white_wool"; blocks[607] = "white_wool"; blocks[608] = "white_wool"; blocks[609] = "black_wool"; blocks[610] = "white_wool"; blocks[701] = "black_wool"; blocks[702] = "white_wool"; blocks[703] = "white_wool"; blocks[704] = "white_wool"; blocks[705] = "black_wool"; blocks[706] = "black_wool"; blocks[707] = "white_wool"; blocks[708] = "white_wool"; blocks[709] = "black_wool"; blocks[710] = "white_wool"; blocks[801] = "black_wool"; blocks[802] = "white_wool"; blocks[803] = "black_wool"; blocks[804] = "black_wool"; blocks[805] = "black_wool"; blocks[806] = "black_wool"; blocks[807] = "black_wool"; blocks[808] = "white_wool"; blocks[809] = "black_wool"; blocks[810] = "white_wool"; blocks[901] = "black_wool"; blocks[902] = "white_wool"; blocks[903] = "white_wool"; blocks[904] = "white_wool"; blocks[905] = "white_wool"; blocks[906] = "white_wool"; blocks[907] = "white_wool"; blocks[908] = "white_wool"; blocks[909] = "black_wool"; blocks[910] = "white_wool"; blocks[1001] = "black_wool"; blocks[1002] = "white_wool"; blocks[1003] = "black_wool"; blocks[1004] = "black_wool"; blocks[1005] = "black_wool"; blocks[1006] = "black_wool"; blocks[1007] = "black_wool"; blocks[1008] = "white_wool"; blocks[1009] = "black_wool"; blocks[1010] = "white_wool"; blocks[1101] = "black_wool"; blocks[1102] = "white_wool"; blocks[1103] = "black_wool"; blocks[1104] = "white_wool"; blocks[1105] = "white_wool"; blocks[1106] = "white_wool"; blocks[1107] = "black_wool"; blocks[1108] = "white_wool"; blocks[1109] = "black_wool"; blocks[1110] = "white_wool"; blocks[1201] = "black_wool"; blocks[1202] = "white_wool"; blocks[1203] = "white_wool"; blocks[1204] = "black_wool"; blocks[1205] = "black_wool"; blocks[1206] = "black_wool"; blocks[1207] = "white_wool"; blocks[1208] = "white_wool"; blocks[1209] = "black_wool"; blocks[1210] = "white_wool";
			floor("white_wool");
			fog_enable = false;
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
		if (map === 13) return title.text = "酒店";
		if (map === 14) return title.text = "街道";
		if (map === 15) return title.text = "街道";
		if (map === 16) return title.text = "大房子";
		if (map === 17) return title.text = "地下道路";
		if (map === 18) return title.text = "祭壇";
		if (map === 19) return title.text = "教堂外";
		if (map === 20) return title.text = "教堂";
		if (map === 21) return title.text = "道路";
		if (map === 22) return title.text = "鎮長辦公室";
		if (map === 23) return title.text = "礦坑外";
		if (map === 24) return title.text = "礦坑";
		if (map === 25) return title.text = "結局";
	}

	function wall(pos) {
		if (blocks[pos] === "air") return false;
		if (blocks[pos] === "dark_oak_door") createjs.Sound.play("door_close");
		if (blocks[pos] === "dark_oak_door") return moveFn();

		return true;
	}

	function box(pos) {
		let target;
		if (direction === "up") target = pos - 1;
		if (direction === "down") target = pos + 1;
		if (direction === "left") target = pos - 100;
		if (direction === "right") target = pos + 100;
		nowblock = blocks[target];
		if (events[target] === 0) {
			autoChat(blocks[target], target);
			if (map === 8 && player1_x === 7) return monsterMove();
		} else {
			let omap = events[target].map;
			let ox = events[target].x;
			let oy = events[target].y;
			let oway = events[target].way
			let oitem = events[target].item;
			let oitemName = events[target].itemName;
			let oevent = events[target].event;
			let otype = events[target].type;
			if (blocks[target] === "oak_door" && omap) return transport(omap, ox, oy, oway, "door_close");
			if (blocks[target] === "oak_door" && oevent) return evts(oevent);
			if (blocks[target] === "ladder") return transport(omap, ox, oy, oway, "ladder");
			if (blocks[target] === "iron_door") return transport(omap, ox, oy, oway, "iron_door");
			if (blocks[target] === "enchanting_table") return item(oitem, oitemName, otype, "ench");
			if (blocks[target] === "cartography_table") return item(oitem, oitemName, otype);
			if (blocks[target] === "beehive") return item(oitem, oitemName, otype, "chestopen");
			if (blocks[target] === "jukebox") return evts(oevent);
			if (blocks[target] === "cheif") return evts(oevent);
			if (blocks[target] === "libriarier") return evts(oevent);
			if (blocks[target] === "waiter_ghost") return evts(oevent);
			if (blocks[target] === "beacon") return evts(oevent);
			if (blocks[target] === "goddad") return evts(oevent);
			if (target % 100 === 13 || target % 100 === 0 && omap) return transport(omap, ox, oy, oway);
			if (parseInt(target / 100) === 13 || parseInt(target / 100) === 0 && omap) return transport(omap, ox, oy, oway);
			if (target % 100 === 13 || target % 100 === 0 && oevent) return evts(oevent);
			if (parseInt(target / 100) === 13 || parseInt(target / 100) === 0 && oevent) return evts(oevent);
		}
	}

	function autoChat(type, target) {
		line_1 = "";
		line_2 = "";
		line_3 = "";
		if (type === "bookshelf") return autoChatData("書櫃", "除了舊書以外似乎沒有其他東西", 0, 0, "takeoff");
		if (type === "ladder") return autoChatData("樓梯", "樓梯損毀，無法使用", 0, 0, "ladder5");
		if (type === "cauldron") return autoChatData("洗手台", "水龍頭已經沒有水了", 0, 0, "pot");
		if (type === "jukebox") return autoChatData("唱片機", "需要放入唱片", 0, 0, "ladder3");
		if (type === "crafting_table_top") return autoChatData("工作台", "桌上沒有東西", 0, 0, "takeoff");
		if (type === "furnace") return autoChatData("爐子", "爐子裡沒東西", 0, 0, "stone1");
		if (type === "furnace_on") return autoChatData("爐子", "還剩一些餘火", 0, 0, "fire");
		if (type === "brewing_stand") return autoChatData("釀造台", "儀器都生鏽了", 0, 0, "pot");
		if (type === "enchanting_table") return autoChatData("精裝桌子", "好像是用來展示書本的地方", "不過找不到像樣的書", 0, "ench");
		if (type === "loom") return autoChatData("鋼琴", "鋼琴上覆著一層厚厚的灰塵", 0, 0, "piano");
		if (type === "smoker") return autoChatData("控制爐", "好像開不起來", 0, 0, "lock");
		if (type === "blast_furnace") return autoChatData("火爐", "正燒著大量的煤，似乎是供應能源的地方", 0, 0, "fire");
		if (type === "cartography_table") return autoChatData("桌子", "桌上只剩殘破的地圖", 0, 0, "takeoff");
		if (type === "fletching_table") return autoChatData("桌子", "桌上有未完成的弓箭", 0, 0, "takeoff");
		if (type === "smithing_table") return autoChatData("工作檯", "桌上沒有東西", 0, 0, "takeoff");
		if (type === "beehive") return autoChatData("抽屜", "抽屜裡沒東西", 0, 0, "chestopen");
		if (type === "iron_door") return autoChatData("鐵門", "需要鑰匙才能開啟", 0, 0, "lock");
		if (type === "spawner" && !jimmy_bar.visible) return autoChatData("鐵籠", "不知道裡面放的是甚麼東西，需要工具開啟", 0, 0, "lock");
		if (type === "iron_bars" && !jimmy_bar.visible) return autoChatData("鐵柵欄", "似乎需要工具破壞", 0, 0, "lock");
		if (type === "spawner" && jimmy_bar.visible) return replaceBlock(target, "wither_rose", "destory");
		if (type === "iron_bars" && jimmy_bar.visible) return replaceBlock(target, "air", "destory");
		if (type === "barrel") return autoChatData("儲藏箱", "無法開啟", 0, 0, "lock");
		if (type === "barrel_open") return autoChatData("儲藏箱", "空空如也", 0, 0, "chestopen");
		if (type === "scaffolding") return autoChatData("桌子", "桌上沒有東西", 0, 0, "takeoff");
		if (type === "end_portal_frame_top") return autoChatData("祭壇", "儀式用的聖桌", 0, 0, "takeoff");
		if (type === "piston") return autoChatData("桌子", "桌上沒有東西", 0, 0, "takeoff");
		if (type === "tv") return autoChatData("電視", "似乎開不起來", 0, 0, "lock");
	}

	function itemTxt(type, image) {
		if (speaking) return;
		nowblock = image;
		if (type === "library_key") return autoChatData("圖書館鑰匙", "可以開啟圖書館一樓鐵門", 0, 0);
		if (type === "cd") return autoChatData("唱片", "可以在唱片機播放", 0, 0);
		if (type === "paper1") return autoChatData("日記", "最近愈來愈少人來了", "難道礦業沒落真的影響這麼大嗎?", 0);
		if (type === "paper2") return autoChatData("日記", "隔壁昨晚到底怎麼了...", "他丈夫不是死了嗎?", "怎麼好像有兩人在對話?");
		if (type === "paper3") return autoChatData("日記", "怎麼最近都沒遇到鄰居?", "大家平時不都常出來聊天嗎?", "最近也沒人搬家啊");
		if (type === "paper4") return autoChatData("日記", "今天月亮真亮", "出門不用帶煤燈就看得見路了", 0);
		if (type === "paper5") return autoChatData("日記", "太好了!", "3號礦道疑似又有新的礦源", "我又能東山再起了!");
		if (type === "paper7") return autoChatData("日記", "今天到外縣市去", "聽說有錢人家會在家外開個密洞藏錢逃稅", "不知道是不是真的?");
		if (type === "knife") return autoChatData("匕首", "沾了點鮮血的匕首", 0, 0);
		if (type === "jimmy_bar") return autoChatData("鐵橇", "可以破壞較粗的鐵條", 0, 0);
		if (type === "paper6") return chat(11, image, true);
	}

	function chat(line, uimg, item) {
		line_1 = "";
		line_2 = "";
		line_3 = "";
		if (line) chats = line;
		if (line) chatbar_status = true;
		if (line) pic.gotoAndPlay("air");
		if (line) pic.gotoAndPlay(nowblock);
		if (uitem || item) {
			if (chats === 11) {
				uitem = true;
				speaker = "死而復生";
				line_1 = "蒐集:";
				line_2 = "野生三葉青、五味子、山茱萸、連翹";
				line_3 = "、天冬各一筲，蘄蛇一條，小米數斗";
			} else if (chats === 12) {
				line_1 = "把藥材倒進器皿，加入冷水蓋過藥材約半扠";
				line_2 = "讓藥材浸水約6個時辰，再加入水淹過藥材半扠";
				line_3 = "開始煎煮藥材，頭先用大火將水煮沸";
			} else if (chats === 13) {
				line_1 = "然後切至文火煎煮中藥";
				line_2 = "第一次煎好的是【藥頭】";
				line_3 = "再煎煮第二次是【藥尾】";
			} else if (chats === 14) {
				line_1 = "加入冷水蓋過藥材約半扠";
				line_2 = "用大火將水煮沸，然後切至文火煎煮中藥";
				line_3 = "藥水煎至小碗約8分";
			} else if (chats === 15) {
				line_1 = "藥材與死者同浸於一桶";
				line_2 = "以米覆其蓋，埋於地底";
				line_3 = "兩年之後取出";
			} else if (chats === 16) {
				line_1 = "注意:";
				line_2 = "死而復生後，死者無法自行造血";
				line_3 = "故每當月圓之時，便會嗜人血以延其性命";
			} else if (chats === 17) {
				chat_off();
				uitem = false;
			}
			if (!choosing) chats++;
			if (chatbar_status) speaking = true;
			if (chatbar_status) chat_on();
			return;
		}
		if (map === 1) {
			if (chats === 1) {
				speaker = "鎮長";
				line_1 = "最近鎮上常出現隨機殺人事件";
			} else if (chats === 2) {
				line_1 = "你去調查到底發生了什麼事";
			} else if (chats === 3) {
				line_1 = "如果你能查出來的話...";
			} else if (chats === 4) {
				line_1 = "我會給你不少的獎金";
			} else if (chats === 5) {
				chat_off();
			}
		} else if (map === 10) {
			if (chats === 1) {
				speaker = "圖書館館長";
				line_1 = "最近愈來愈少人來了";
			} else if (chats === 2) {
				line_1 = "自從上次的意外發生後...";
			} else if (chats === 3) {
				line_1 = "加上礦源枯竭";
			} else if (chats === 4) {
				line_1 = "人們都離開了這裡";
			} else if (chats === 5) {
				line_1 = "唉...";
			} else if (chats === 6) {
				line_1 = "又回到當時還沒發現礦石的時候...";
			} else if (chats === 7) {
				line_1 = "也罷";
			} else if (chats === 8) {
				line_1 = "還是種一種甘蔗、吹吹風好";
			} else if (chats === 9) {
				chat_off();
			}
		} else if (map === 13) {
			if (chats === 1) {
				speaker = "服務生";
				line_1 = "當你聽到開門聲時...";
			} else if (chats === 2) {
				line_1 = "不要動";
			} else if (chats === 3) {
				line_1 = "他會發現你...";
			} else if (chats === 4) {
				waiter_chat = true;
				createjs.Sound.play("sud_2");
				replaceBlock(402, "air");
				chat_off();
			}
		} else if (map === 18) {
			if (chats === 1) {
				speaker = "???";
				line_1 = "血耗將盡...";
			} else if (chats === 2) {
				line_1 = "爾不入地獄誰入地獄?";
			} else if (chats === 3) {
				line_1 = "一人換取百人活...";
			} else if (chats === 4) {
				line_1 = "豈不美哉?";
			} else if (chats === 5) {
				zombies = true;
				for (var i = 0; i < 13; i++) {
					for (var j = 0; j < 13; j++) {
						replaceBlock(i * 100 + j, "miner");
					}
				}
				events[806] = 0;
				chat_off();
				setTimeout((() => {
					jumpscare.gotoAndPlay("monster");
					frontOf(jumpscare);
					canplay = false;
					createjs.Sound.play("sud_3");
					setTimeout((() => {
						jumpscare.visible = false;
						jumpscare2 = true;
						canplay = true;
						final_detect(4);
					}), 600);
				}), 400);
			}
		} else if (map === 20) {
			if (chats === 1) {
				speaker = "神父";
				line_1 = "向北方走...";
			} else if (chats === 2) {
				line_1 = "不要反悔...";
			} else if (chats === 3) {
				line_1 = "如果你不留戀這一切";
			} else if (chats === 4) {
				chat_off();
			}
		} else if (map === 24) {
			canplay = false;
			pic.gotoAndPlay("air");
			pic.gotoAndPlay("miner");
			if (chats === 1) {
				speaker = "復活礦工";
				line_1 = "別擔心";
			} else if (chats === 2) {
				line_1 = "現在不是月圓之日";
			} else if (chats === 3) {
				line_1 = "我不會傷害你";
			} else if (chats === 4) {
				line_1 = "因為我是復活後的軀體";
			} else if (chats === 5) {
				line_1 = "所以我無法自行造血";
			} else if (chats === 6) {
				line_1 = "逼不得已";
			} else if (chats === 7) {
				line_1 = "我才會殺了這麼多人";
			} else if (chats === 8) {
				line_1 = "可以請你放下刀子";
			} else if (chats === 9) {
				line_1 = "並協助我到醫院治療";
			} else if (chats === 10) {
				line_1 = "讓我能恢復正常生活嗎?";
			} else if (chats === 11) {
				choosing = true;
				speaker = "--你的選擇--";
				txtEvt1 = 1;
				txtEvt2 = 2;
				line_1 = "[殺了他，永絕後患]";
				line_2 = "[放下刀子，並幫助他]";
			} else if (chats === 12) {
				chat_off();
			}
		} else if (map === 25) {
			monster.visible = false;
			pic.gotoAndPlay("black_wool");
			pic.gotoAndPlay("air");
			canplay = false;
			if (chats === 41) {
				speaker = "結局5 --- 死亡";
				line_1 = "你已成為他血液的一部分";
			} else if (chats === 42) {
				choosing = true;
				txtEvt1 = 6;
				line_1 = "[重新檢視結局]";
				txtEvt2 = 5;
				line_2 = "[重置遊戲]";
			} else if (chats === 43) {
				chats = 40;
			}
			if (chats === 11) {
				speaker = "結局1 --- 逃出";
				line_1 = "你選擇放棄繼續追查";
				line_2 = "並成功的逃出這個小鎮";
				line_3 = "到安全的地方去了";
			} else if (chats === 12) {
				choosing = true;
				txtEvt1 = 7;
				line_1 = "[重新檢視結局]";
				txtEvt2 = 5;
				line_2 = "[重置遊戲]";
			} else if (chats === 13) {
				chats = 10;
			}
			if (chats === 21) {
				speaker = "結局2 --- 迷惘";
				line_1 = "在離開中的猶豫";
				line_2 = "讓你和這個小鎮的時間一起凍結了";
			} else if (chats === 22) {
				choosing = true;
				txtEvt1 = 8;
				line_1 = "[重新檢視結局]";
				txtEvt2 = 5;
				line_2 = "[重置遊戲]";
			} else if (chats === 23) {
				chats = 20;
			}
			if (chats === 31) {
				speaker = "結局3 --- 真相之一";
				line_1 = "在2年的復活過程中";
				line_2 = "他早已喪失了靈魂...";
			} else if (chats === 32) {
				line_1 = "所謂的復活其實只是寄生蟲對屍體的控制";
			} else if (chats === 33) {
				line_1 = "他只是種肉體復活的假象";
			} else if (chats === 34) {
				line_1 = "而月圓之時只是少數案例的巧合";
			} else if (chats === 35) {
				line_1 = "而被民間寫入藥方";
			} else if (chats === 36) {
				line_1 = "其實只要時候到了";
			} else if (chats === 37) {
				line_1 = "消化完藥草的寄生蟲便會開始工作";
			} else if (chats === 38) {
				choosing = true;
				txtEvt1 = 9;
				line_1 = "[重新檢視結局]";
				txtEvt2 = 5;
				line_2 = "[重置遊戲]";
			} else if (chats === 39) {
				chats = 30;
			}
			if (chats === 51) {
				speaker = "結局4 --- 真相";
				line_1 = "在2年的復活過程中";
				line_2 = "他早已喪失了靈魂...";
			} else if (chats === 52) {
				line_1 = "所謂的復活其實只是寄生蟲對屍體的控制";
			} else if (chats === 53) {
				line_1 = "他只是種肉體復活的假象";
			} else if (chats === 54) {
				line_1 = "而月圓之時只是少數案例的巧合";
			} else if (chats === 55) {
				line_1 = "而被民間寫入藥方";
			} else if (chats === 56) {
				line_1 = "其實只要時候到了";
			} else if (chats === 57) {
				line_1 = "消化完藥草的寄生蟲便會開始工作";
			} else if (chats === 58) {
				line_1 = "這種在地下陰暗潮濕的環境";
			} else if (chats === 59) {
				line_1 = "最適合寄生蟲生長";
			} else if (chats === 60) {
				line_1 = "宿主會在寄生蟲的控制之下";
			} else if (chats === 61) {
				line_1 = "攻擊並吸取他人血液和破壞部分組織";
			} else if (chats === 62) {
				line_1 = "並提供寄生蟲新的寄生環境";
			} else if (chats === 63) {
				line_1 = "如此一來部分寄生蟲便能轉移環境來存活";
			} else if (chats === 64) {
				line_1 = "並快速繁殖";
			} else if (chats === 65) {
				line_1 = "直到一段時間都沒有新宿主能轉移時";
			} else if (chats === 66) {
				line_1 = "寄生蟲才會死亡";
			} else if (chats === 67) {
				line_1 = "不過這種寄生蟲非常少見";
			} else if (chats === 68) {
				line_1 = "要不是因為礦工的妻子特別去找來";
			} else if (chats === 69) {
				line_1 = "也不會發生感染的情形";
			} else if (chats === 70) {
				line_1 = "而那些放在籠子裡的花";
			} else if (chats === 71) {
				line_1 = "可以提供寄生蟲幼蟲基本生長環境";
			} else if (chats === 71) {
				line_1 = "並吸收寄生蟲的分泌物生長";
			} else if (chats === 72) {
				line_1 = "只要在48小時內給幼蟲血液";
			} else if (chats === 73) {
				line_1 = "牠們就能發展成成蟲";
			} else if (chats === 74) {
				line_1 = "不過";
				line_2 = "只要籠子被打開...";
			} else if (chats === 75) {
				line_1 = "脆弱的幼蟲就會因環境不適死亡";
			} else if (chats === 76) {
				line_1 = "而花朵若沒有寄生蟲能互利共生";
			} else if (chats === 77) {
				line_1 = "也會凋零";
			} else if (chats === 78) {
				choosing = true;
				txtEvt1 = 10;
				line_1 = "[重新檢視結局]";
				txtEvt2 = 5;
				line_2 = "[重置遊戲]";
			} else if (chats === 79) {
				chats = 50;
			}
		}
		if (!choosing) chats++;
		if (chatbar_status) speaking = true;
		if (chatbar_status) chat_on();
	}
	//事件觸發
	function evts(event) {
		if (event === "cd_played") {
			cd_played = true;
			autoChatData("唱片機", 0, "播放中...", 0);
			cd_playing = true;
			createjs.Sound.play("news1");
			choosing = true;
			canplay = false;
			setTimeout((() => {
				if (choosing) {
					createjs.Sound.play("cd_end");
					choosing = false;
					cd_playing = false;
					canplay = true;
				}
			}), 26000);
		}
		if (event === "diff") {
			autoChatData("唱片機", 0, "播放中...", 0);
			cd_playing = true;
			createjs.Sound.play("diff");
			choosing = true;
			canplay = false;
			setTimeout((() => {
				if (choosing) {
					createjs.Sound.play("cd_end");
					choosing = false;
					cd_playing = false;
					canplay = true;
				}
			}), 7000);
		}
		if (event === "blood") {
			if (soul < 12) return chat(1);
			if (soul === 12) return final_detect(5);
		}
		if (event === "cheif") return chat(1);
		if (event === "libriarier") return chat(1);
		if (event === "waiter_ghost") return chat(1);
		if (event === "goddad") return chat(1);
		if (event === "out") return final_detect(1);
		if (event === "miss") return final_detect(2);
	}
	function activeEvt() {
		if (cd.visible && map === 6 && !sang) {
			createjs.Sound.play("sing");
			sang = true;
		}
		if (cd.visible && map === 4 && !thunder1) {
			createjs.Sound.play("thunder1");
			thunder1 = true;
		}
		if (cd_played && map === 2 && !thunder2) {
			createjs.Sound.play("thunder2");
			thunder2 = true;
		}
		if (map === 15 && !thunder3) {
			createjs.Sound.play("thunder3");
			thunder3 = true;
		}
		if (map === 23 && !wind) {
			createjs.Sound.play("ware_wind");
			wind = true;
		}
		if (waiter_chat && !jumpscare1) {
			if (location === 104) createjs.Sound.play("door_openning");
			if (player1_y === 7) {
				jumpscare.gotoAndPlay("ghost");
				frontOf(jumpscare);
				canplay = false;
				createjs.Sound.play("sud_ghost");
				setTimeout((() => {
					jumpscare.visible = false;
					jumpscare1 = true;
					canplay = true;
				}), 400);
			}
			setTimeout((() => {
				if (!jumpscare1) {
					jumpscare1 = true;
					createjs.Sound.play("door_close");
				}
			}), 4000);
			setTimeout((() => jumpscare1 = true), 10000)
		}
		if (map === 14 && !woman_scream && location === 309) {
			replaceBlock(312, "ghost_woman");
			createjs.Sound.play("scream1");
			canplay = false;
			setTimeout((() => {
				replaceBlock(312, "air");
				woman_scream = true;
				canplay = true;
			}), 1000);
		}
		if (map === 14 && location === 411 && !knife.visible) {
			knife.visible = true;
			layer2[411] = "air";
			bg2[411].gotoAndPlay("air");
			createjs.Sound.play("stone1");
			itemTxt("knife", "knife");
		}
		if (map === 24 && player1_y < 13) {
			if (knife.visible) chat(1);
			if (!knife.visible) {
				createjs.Sound.play("sud_3");
				jumpscare.gotoAndPlay("monster");
				frontOf(jumpscare);
				canplay = false;
				setTimeout((() => {
					jumpscare.visible = false;
					jumpscare2 = true;
					canplay = true;
					final_detect(4);
				}), 400);
			}
		}
	}
	function txtEvtFn(data) {
		if (data === 1) {
			jumpscare.gotoAndPlay("kill");
			frontOf(jumpscare);
			canplay = false;
			createjs.Sound.play("kill");
			setTimeout((() => {
				jumpscare.visible = false;
				choosing = false;
				final_detect(3)
			}), 1000);
		}
		if (data === 2) {
			jumpscare.gotoAndPlay("monster");
			createjs.Sound.play("sud_3");
			frontOf(jumpscare);
			canplay = false;
			setTimeout((() => {
				jumpscare.visible = false;
				jumpscare2 = true;
				choosing = false;
				final_detect(4);
			}), 400);
		}
		if (data === 5) window.location.reload(true);
		if (data === 6) final_detect(4);
		if (data === 7) final_detect(1);
		if (data === 8) final_detect(2);
		if (data === 9) final_detect(3);
		if (data === 10) final_detect(5);
		txtEvt1 = 0;
		txtEvt2 = 0;
		txtEvt3 = 0;
	}


	//固定函數模板------------------------------------------------------
	//replace block
	function replaceBlock(pos, replaceBlock, sound) {
		blocks[pos] = replaceBlock;
		block[pos].gotoAndPlay(replaceBlock);
		restaurant_cage[map * 10000 + pos] = replaceBlock;
		if (replaceBlock === "wither_rose") soul++;
		if (sound) createjs.Sound.play(sound);
	}
	//monster move
	function monsterMove() {
		if (!chasing) {
			createjs.Sound.play("chasing");
		}
		chasing = true;
		if (map != 10) frontOf(monster);
		fogs();
		monster.x += 5;
		if (monster.visible && robot.x < monster.x + 250) final_detect(4);
		if (map != 10) setTimeout((() => monsterMove()), 100);
		if (map === 10 || map === 25) {
			createjs.Sound.stop();
			bgAudio = createjs.Sound.play("bgm", { loop: -1 });
			bgAudio.volume = 0.3;
		}
		if (map === 10 || map === 25) return monster.visible = false;
	}
	//手機版-控制
	function touchdownMove(e) {
		if (cd_playing) return;
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
		} else if (e === 32) {

		}
	}
	//電腦版-控制
	function keydownMoveFn(e) {
		//Player1
		if (cd_playing) return;
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
		} else if (e.keyCode === 32) {
			//transport(15, 1, 6);
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
				let init_block = restaurant_cage[map * 10000 + i * 100 + j];
				if (blocks[i * 100 + j] != init_block && init_block) blocks[i * 100 + j] = init_block;
				bg1[i * 100 + j].gotoAndPlay(layer1[i * 100 + j]);
				bg2[i * 100 + j].gotoAndPlay(layer2[i * 100 + j]);
				block[i * 100 + j].gotoAndPlay(blocks[i * 100 + j]);
			}
		}
		fogs();
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
	function transport(maps, x, y, way, sound) {
		if (map === 10 && !cd.visible && !monster.visible) return;
		if (map === 10 || map == 25) monster.visible = false;
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
		if (sound === "ladder") {
			setTimeout((() => createjs.Sound.play("ladder3")), 200);
			setTimeout((() => createjs.Sound.play("ladder4")), 400);
			setTimeout((() => createjs.Sound.play("ladder5")), 800);
			return;
		}
		if (sound) createjs.Sound.play(sound);
	}
	//方塊自動對話
	function autoChatData(speakor, txt1, txt2, txt3, sound) {
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
		if (sound) createjs.Sound.play(sound);
	}
	//得到物品
	function item(items, name, utype, sound) {
		items.visible = true;
		itemTxt(name, utype);
		if (sound) createjs.Sound.play(sound);
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
		chats = -1;
	}
	//放開按鈕
	function keyupMoveFn(e) {
		isKeyDown = false;
	}
	//移動-執行
	function moveFn() {
		if (!isKeyDown) return;
		if (chats > 0) return chat();
		if (udlr) {
			player1_x += step / 50
			robot.x += step;
		} else {
			player1_y += step / 50
			robot.y += step;
		}
		frontOf(robot);
		fogs();
		activeEvt();
	}
	function fogs() {
		fog_range = 2;
		if (fog_enable) {
			frontOf(fog_top);
			frontOf(fog_buttom);
			frontOf(fog_left);
			frontOf(fog_right);
			fog_top.x = robot.x + 25;
			fog_top.y = robot.y - 50 * (fog_range + 1) + 25;
			fog_buttom.x = robot.x + 25;
			fog_buttom.y = robot.y + 50 * (12 + fog_range) + 25;
			fog_left.x = robot.x - 50 * (1 + fog_range) + 25;
			fog_left.y = robot.y + 25;
			fog_right.x = robot.x + 50 * fog_range + 25;
			fog_right.y = robot.y + 25;
			fog_top.visible = true;
			fog_buttom.visible = true;
			fog_left.visible = true;
			fog_right.visible = true;
		} else {
			fog_top.visible = false;
			fog_buttom.visible = false;
			fog_left.visible = false;
			fog_right.visible = false;
		}
		formFront();
	}
	function formFront() {
		frontOf(story_form);
		frontOf(title);
		if (library_key.visible) frontOf(library_key);
		if (cd.visible) frontOf(cd);
		if (paper1.visible) frontOf(paper1);
		if (paper2.visible) frontOf(paper2);
		if (paper3.visible) frontOf(paper3);
		if (paper4.visible) frontOf(paper4);
		if (paper5.visible) frontOf(paper5);
		if (paper6.visible) frontOf(paper6);
		if (paper7.visible) frontOf(paper7);
		if (knife.visible) frontOf(knife);
		if (jimmy_bar.visible) frontOf(jimmy_bar);
	}
	//死亡偵測
	function final_detect(end_type) {
		monster.visible = false;
		transport(25, 14, 14);
		choosing = false;
		map = 25;
		if (end_type === 4) {
			chat(41);
		} else if (end_type === 1) {
			chat(11);
		} else if (end_type === 2) {
			chat(21);
		} else if (end_type === 3) {
			chat(31);
		} else if (end_type === 5) {
			chat(51);
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