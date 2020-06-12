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
	var blocks = [1213];
	var events = [101213];
	var block = [];
	var map = 1;
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
	let direction = "up";
	let p1die = false;
	let udlr = true;
	var robot = new lib.roboter();
	var player1_x = 2;
	var player1_y = 2;
	robot.x = player1_x * 50 - 25;
	robot.y = player1_y * 50 - 25;
	exportRoot.addChild(robot);
	robot.gotoAndPlay(direction);


	var title = new createjs.Text("鎮長辦公室", "bold 43px Arial", "white");
	title.x = 614;
	title.y = 60;
	title.textBaseline = "alphabetic";
	exportRoot.addChild(title);

	mapChangeFn();

	for (var i = 0; i < 11; i++) {
		for (var j = 0; j < 13; j++) {
			for (var k = 0; k < 13; k++) {
				events[i * 10000 + j * 100 + k] = 0;
			}
		}
	}

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
		mapChangeFn()
		titleChangeFn();
	}

	function mapChangeFn() {

		for (var i = 0; i < 13; i++) {
			for (var j = 0; j < 13; j++) {
				blocks[i * 100 + j] = "air";
			}
		}

		if (map === 1) {
			blocks[101] = "oak_planks"; blocks[102] = "oak_planks"; blocks[103] = "oak_planks"; blocks[104] = "oak_planks"; blocks[105] = "oak_planks"; blocks[106] = "oak_planks"; blocks[107] = "oak_planks"; blocks[108] = "mossy_cobblestone"; blocks[109] = "mossy_cobblestone"; blocks[110] = "mossy_cobblestone"; blocks[111] = "mossy_cobblestone"; blocks[112] = "mossy_cobblestone"; blocks[201] = "ladder"; blocks[208] = "iron_bars"; blocks[212] = "mossy_cobblestone"; blocks[301] = "oak_planks"; blocks[302] = "oak_planks"; blocks[303] = "oak_planks"; blocks[304] = "oak_planks"; blocks[305] = "oak_planks"; blocks[308] = "iron_bars"; blocks[310] = "spawner"; blocks[312] = "mossy_cobblestone"; blocks[401] = "oak_planks"; blocks[402] = "loom"; blocks[405] = "dark_oak_door"; blocks[408] = "iron_bars"; blocks[412] = "mossy_cobblestone"; blocks[501] = "oak_planks"; blocks[502] = "fletching_table"; blocks[504] = "cauldron"; blocks[505] = "oak_planks"; blocks[508] = "mossy_cobblestone"; blocks[509] = "mossy_cobblestone"; blocks[510] = "mossy_cobblestone"; blocks[511] = "mossy_cobblestone"; blocks[512] = "mossy_cobblestone"; blocks[601] = "oak_planks"; blocks[602] = "cartography_table"; blocks[604] = "brewing_stand"; blocks[605] = "oak_planks"; blocks[608] = "oak_planks"; blocks[609] = "oak_planks"; blocks[610] = "oak_planks"; blocks[611] = "oak_planks"; blocks[612] = "oak_planks"; blocks[701] = "oak_planks"; blocks[702] = "crafting_table"; blocks[704] = "scaffolding"; blocks[705] = "oak_planks"; blocks[708] = "oak_planks"; blocks[709] = "furnace_on"; blocks[711] = "barrel"; blocks[712] = "oak_planks"; blocks[801] = "oak_planks"; blocks[802] = "oak_planks"; blocks[803] = "oak_planks"; blocks[804] = "oak_planks"; blocks[805] = "oak_planks"; blocks[808] = "oak_planks"; blocks[809] = "furnace"; blocks[811] = "barrel"; blocks[812] = "oak_planks"; blocks[901] = "bookshelf"; blocks[905] = "oak_planks"; blocks[908] = "dark_oak_door"; blocks[911] = "barrel"; blocks[912] = "oak_planks"; blocks[1001] = "bookshelf"; blocks[1003] = "enchanting_table"; blocks[1005] = "dark_oak_door"; blocks[1008] = "oak_planks"; blocks[1009] = "smoker"; blocks[1011] = "barrel_open"; blocks[1012] = "oak_planks"; blocks[1101] = "bookshelf"; blocks[1105] = "oak_planks"; blocks[1108] = "oak_planks"; blocks[1109] = "blast_furnace"; blocks[1111] = "barrel"; blocks[1112] = "oak_planks"; blocks[1201] = "bookshelf"; blocks[1202] = "bookshelf"; blocks[1203] = "bookshelf"; blocks[1204] = "bookshelf"; blocks[1205] = "oak_planks"; blocks[1206] = "iron_door"; blocks[1207] = "iron_door"; blocks[1208] = "oak_planks"; blocks[1209] = "oak_planks"; blocks[1210] = "oak_planks"; blocks[1211] = "oak_planks"; blocks[1212] = "oak_planks";
		} else if (map === 2) {

		}

		for (var i = 0; i < 13; i++) {
			for (var j = 0; j < 13; j++) {
				block[i * 100 + j] = new lib.blocks();
				block[i * 100 + j].x = i * 50 - 25;
				block[i * 100 + j].y = j * 50 - 25;
				block[i * 100 + j].gotoAndPlay(blocks[i * 100 + j]);
				exportRoot.addChild(block[i * 100 + j]);
			}
		}
		chat_off();
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
			robot.gotoAndPlay("left");
			if (player1_x === 1) return;
			if (wall((player1_x - 1) * 100 + (player1_y))) return box(location);
			moveFn();
		} else if (e === 38) {
			udlr = false;
			step = STEP * -1;
			isKeyDown = true;
			robot.gotoAndPlay("up");
			if (player1_y === 1) return;
			if (wall((player1_x) * 100 + (player1_y - 1))) return box(location);
			moveFn();
		} else if (e === 39) {
			udlr = true;
			step = STEP;
			isKeyDown = true;
			robot.gotoAndPlay("right");
			if (player1_x === 12) return;
			if (wall((player1_x + 1) * 100 + (player1_y))) return box(location);
			moveFn();
		} else if (e === 40) {
			udlr = false;
			step = STEP;
			isKeyDown = true;
			robot.gotoAndPlay("down");
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
			if (player1_x === 1) return;
			if (wall(location - 100)) return box(location);
			moveFn();
		} else if (e.keyCode === 38) {
			udlr = false;
			step = STEP * -1;
			direction = "up";
			isKeyDown = true;
			robot.gotoAndPlay(direction);
			if (player1_y === 1) return;
			if (wall(location - 1)) return box(location);
			moveFn();
		} else if (e.keyCode === 39) {
			udlr = true;
			step = STEP;
			direction = "right";
			isKeyDown = true;
			robot.gotoAndPlay(direction);
			if (player1_x === 12) return;
			if (wall(location + 100)) return box(location);
			moveFn();
		} else if (e.keyCode === 40) {
			udlr = false;
			step = STEP;
			direction = "down";
			isKeyDown = true;
			robot.gotoAndPlay(direction);
			if (player1_y === 12) return;
			if (wall(location + 1)) return box(location);
			moveFn();
		} else if (e.keyCode === 191) {

		}
	}

	function wall(pos) {
		if (blocks[pos] === "air") return false;
		if (blocks[pos] === "dark_oak_door") moveFn();
		if (blocks[pos] === "dark_oak_door") return false;

		return true;
	}

	function box(pos) {
		let target;
		if (direction === "up") target = pos - 1;
		if (direction === "down") target = pos + 1;
		if (direction === "left") target = pos - 100;
		if (direction === "right") target = pos + 100;
		if (events[map * 10000 + target] === 0) {
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
		}
	}

	function autoChat(type) {
		line_2 = "";
		line_3 = "";
		if (type === 1) {
			chats = 0;
			speaker = "書櫃";
			line_1 = "除了舊書以外似乎沒有其他東西";
		}else if (type === 2) {
			chats = 0;
			speaker = "樓梯";
			line_1 = "樓梯損毀，無法使用";
		}else if (type === 3) {
			chats = 0;
			speaker = "鍋釜";
			line_1 = "只發現鍋底有一些殘渣";
		}else if (type === 4) {
			chats = 0;
			speaker = "唱片機";
			line_1 = "需要放入唱片";
		}else if (type === 5) {
			chats = 0;
			speaker = "工作台";
			line_1 = "好像是做木工的地方";
			line_2 = "不過桌上沒有東西";
		}else if (type === 6) {
			chats = 0;
			speaker = "爐子";
			line_1 = "爐子裡沒東西";
		}else if (type === 7) {
			chats = 0;
			speaker = "爐子";
			line_1 = "還剩一些餘火";
		}else if (type === 8) {
			chats = 0;
			speaker = "釀造台";
			line_1 = "儀器都生鏽了";
		}else if (type === 9) {
			chats = 0;
			speaker = "精裝桌子";
			line_1 = "好像是用來展示書本的地方";
			line_2 = "不過找不到像樣的書";
		}else if (type === 10) {
			chats = 0;
			speaker = "鋼琴";
			line_1 = "鋼琴上覆著一層厚厚的灰塵";
		}else if (type === 11) {
			chats = 0;
			speaker = "控制爐";
			line_1 = "好像開不起來";
		}else if (type === 12) {
			chats = 0;
			speaker = "火爐";
			line_1 = "正燒著大量的煤，似乎是供應能源的地方";
		}else if (type === 13) {
			chats = 0;
			speaker = "桌子";
			line_1 = "桌上只剩殘破的地圖";
		}else if (type === 14) {
			chats = 0;
			speaker = "桌子";
			line_1 = "桌上有未完成的弓箭";
		}else if (type === 15) {
			chats = 0;
			speaker = "工作檯";
			line_1 = "桌上沒有東西";
		}else if (type === 16) {
			chats = 0;
			speaker = "抽屜";
			line_1 = "抽屜裡沒東西";
		}else if (type === 17) {
			chats = 0;
			speaker = "鐵門";
			line_1 = "需要鑰匙才能開啟";
		}else if (type === 18) {
			chats = 0;
			speaker = "鐵籠";
			line_1 = "不知道裡面放的是甚麼東西，需要工具開啟";
		}else if (type === 19) {
			chats = 0;
			speaker = "鐵柵欄";
			line_1 = "似乎需要工具破壞";
		}else if (type === 20) {
			chats = 0;
			speaker = "儲藏箱";
			line_1 = "無法開啟";
		}else if (type === 21) {
			chats = 0;
			speaker = "儲藏箱";
			line_1 = "空空如也";
		}else if (type === 22) {
			chats = 0;
			speaker = "桌子";
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

	function titleChangeFn() {
		if (map === 1) return title.text = "鎮長辦公室";
		if (map === 2) return title.text = "道路";
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
		location = (player1_x) * 100 + (player1_y);
		box(location);
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