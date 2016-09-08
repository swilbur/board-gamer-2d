var roomCode = null;
var myUser;

var SCREEN_MODE_DISCONNECTED = 0;
var SCREEN_MODE_LOGIN = 1;
var SCREEN_MODE_JOIN_ROOM = 2;
var SCREEN_MODE_WAITING_FOR_SERVER_CONNECT = 3;
var SCREEN_MODE_WAITING_FOR_CREATE_ROOM = 4;
var SCREEN_MODE_WAITING_FOR_ROOM_CODE_CONFIRMATION = 5;
var SCREEN_MODE_PLAY = 6;
var screenMode = SCREEN_MODE_LOGIN;

String.prototype.hashCode = function() {
  var hash = 0, i, chr, len;
  if (this.length === 0) return hash;
  for (i = 0, len = this.length; i < len; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

document.getElementById("createRoomButton").addEventListener("click", function() {
  roomCode = null;
  startGame();
});
document.getElementById("roomCodeTextbox").addEventListener("keydown", function(event) {
  event.stopPropagation();
  if (event.keyCode === 13) {
    setTimeout(submitRoomCode, 0);
  } else {
    setTimeout(function() {
      var textbox = document.getElementById("roomCodeTextbox");
      var value = textbox.value;
      var canonicalValue = value.toUpperCase();
      if (value === canonicalValue) return;
      var selectionStart = textbox.selectionStart;
      var selectionEnd = textbox.selectionEnd;
      textbox.value = canonicalValue;
      textbox.selectionStart = selectionStart;
      textbox.selectionEnd = selectionEnd;
    }, 0);
  }
});
document.getElementById("joinRoomButton").addEventListener("click", submitRoomCode);
function submitRoomCode() {
  roomCode = document.getElementById("roomCodeTextbox").value;
  startGame();
}
document.getElementById("userNameTextbox").addEventListener("keydown", function(event) {
  event.stopPropagation();
  if (event.keyCode === 13) {
    document.getElementById("passwordTextbox").focus()
  }
});
document.getElementById("passwordTextbox").addEventListener("keydown", function(event) {
  event.stopPropagation();
  if (event.keyCode === 13) {
    setTimeout(sendLogin(false), 0);
  }
});
document.getElementById("loginButton").addEventListener("click", function(event) {sendLogin(false)});
document.getElementById("createAccountButton").addEventListener("click", function(event) {sendLogin(true)});
var username="";
var password="";
function sendLogin(create) {
  username = document.getElementById("userNameTextbox").value;
  password = document.getElementById("passwordTextbox").value.hashCode();
  if(username=="" || password == 0){
    document.getElementById("errorMessageDiv").innerHTML = "Enter a username and password.";
    return;
  }
  var confirmCode = ""
  if(create) confirmCode = prompt("Ask Scott for the code to create an account:", "code")
  sendMessage({cmd: "login", args: {username: username, password: password, create: create, code: confirmCode}});
}

function setScreenMode(newMode) {
  screenMode = newMode;
  var loadingMessage = null;
  document.getElementById("errorMessageDiv").innerHTML = "";
  var activeDivId = (function() {
    switch (screenMode) {
      case SCREEN_MODE_PLAY: return "roomDiv";
      case SCREEN_MODE_LOGIN: return "loginDiv";
      case SCREEN_MODE_JOIN_ROOM: return "joinRoomDiv";
      case SCREEN_MODE_DISCONNECTED:
        loadingMessage = "Disconnected...";
        return "loadingDiv";
      case SCREEN_MODE_WAITING_FOR_SERVER_CONNECT:
        loadingMessage = "Trying to reach the server...";
        return "loadingDiv";
      case SCREEN_MODE_WAITING_FOR_CREATE_ROOM:
        loadingMessage = "Waiting for a new room...";
        return "loadingDiv";
      case SCREEN_MODE_WAITING_FOR_ROOM_CODE_CONFIRMATION:
        loadingMessage = "Checking room code...";
        return "loadingDiv";
      default: throw asdf;
    }
  })();
  ["roomDiv", "joinRoomDiv", "loadingDiv", "loginDiv"].forEach(function(divId) {
    setDivVisible(document.getElementById(divId), divId === activeDivId);
  });
  if (activeDivId === "joinRoomDiv"){
    document.getElementById("roomCodeTextbox").focus();
    document.getElementById("roomCodeTextbox").select();
  }
  if (activeDivId === "loginDiv"){
    document.getElementById("userNameTextbox").focus();
    document.getElementById("userNameTextbox").select();
  }
  document.getElementById("loadingMessageDiv").textContent = loadingMessage != null ? loadingMessage : "Please wait...";
}

var tableDiv = document.getElementById("tableDiv");

var usersById = {};

var facePathToUrlUrl = {
  //"face1.png": "", // loading...
  //"face2.png": 'url("face2.png")',
  //"face3.png#0,0,32,32": 'url("data://...")',
};

var gameDefinition;
var objectDefinitionsById;
var objectIndexesById;
var objectsById;
var objectsWithSnapZones; // cache
var hiderContainers; // cache
//var changeHistory;
//var futureChanges;
var gameLog;
function initGame(game, history) {
  gameDefinition = game;
  objectDefinitionsById = {};
  objectIndexesById = {};
  objectsById = {};
  objectsWithSnapZones = [];
  hiderContainers = [];
  //changeHistory = [];
  //futureChanges = [];
  gameLog = "";
  document.getElementById("logContentsDiv").innerHTML = gameLog;
  for (var i = 0; i < gameDefinition.objects.length; i++) {
    var rawDefinition = gameDefinition.objects[i];
    var id = rawDefinition.id;
    if (id == null) id = autogenerateId(i);
    objectDefinitionsById[id] = rawDefinition;
    objectIndexesById[id] = i;
    if (rawDefinition.prototype) continue;

    var objectDefinition = getObjectDefinition(id);
    if (objectDefinition.faces != null) objectDefinition.faces.forEach(preloadImagePath);
    var object = {
      id: id,
      x: objectDefinition.x,
      y: objectDefinition.y,
      z: objectDefinition.z || i,
      width:  objectDefinition.width,
      height: objectDefinition.height,
      faces: objectDefinition.faces,
      snapZones: objectDefinition.snapZones || [],
      locked: !!objectDefinition.locked,
      immobile: !!objectDefinition.immobile,
      faceIndex: objectDefinition.faceIndex || 0,
      hasLabel: objectDefinition.hasLabel ? true : false,
      label: objectDefinition.label || 0,
      labelColor: objectDefinition.labelColor || [],
      floating: !!objectDefinition.floating,
      angle: objectDefinition.angle || 0,
    };
    objectsById[id] = object;
    if (object.snapZones.length > 0) objectsWithSnapZones.push(object);
    if (objectDefinition.visionWhitelist != null) hiderContainers.push(object);

    tableDiv.insertAdjacentHTML("beforeend",
      '<div id="object-'+id+'" data-id="'+id+'" class="gameObject" style="display:none;">' +
        '<div id="stackHeight-'+id+'" class="stackHeight" style="display:none;"></div>' +
      '</div>'
    );
    var objectDiv = getObjectDiv(object.id);
    objectDiv.addEventListener("mousedown", onObjectMouseDown);
    objectDiv.addEventListener("mousemove", onObjectMouseMove);
    objectDiv.addEventListener("mouseout",  onObjectMouseOut);
    if (objectDefinition.backgroundColor != null) {
      // add a background div
      tableDiv.insertAdjacentHTML("beforeend",
        '<div id="background-'+id+'" class="backgroundObject" style="display:none;"></div>'
      );
    }
  }
  // reassign all the z's to be unique
  var objects = getObjects();
  objects.sort(compareZ);
  objects.forEach(function(object, i) {
    object.z = i;
  });
  fixFloatingThingZ();

  // replay history
  history.forEach(function(move) {
    makeAMove(move, false);
  });

  document.getElementById("roomCodeSpan").textContent = roomCode;

  checkForDoneLoading();
}
function getObjectDefinition(id) {
  // resolve prototypes
  var result = {};
  recurse(id, 0);
  return result;

  function recurse(id, depth) {
    var definition = objectDefinitionsById[id];
    for (var property in definition) {
      if (property === "prototypes") continue; // special handling
      if (property === "prototype" && depth !== 0) continue;  // don't inherit this property
      if (property in result) continue; // shadowed
      var value = definition[property];
      if (property === "front") {
        if (result.faces == null) result.faces = [];
        result.faces[0] = value;
      } else if (property === "back") {
        if (result.faces == null) result.faces = [];
        result.faces[1] = value;
      } else {
        result[property] = value;
      }
    }
    if (definition.prototypes != null) {
      definition.prototypes.forEach(function(id) {
        recurse(id, depth + 1);
      });
    }
  }
}
function resolveFace(face) {
  if (face === "front") return 0;
  if (face === "back") return 1;
  return face;
}
function preloadImagePath(path) {
  var url = facePathToUrlUrl[path];
  if (url != null) return; // already loaded or loading
  facePathToUrlUrl[path] = ""; // loading...
  var img = new Image();
  var hashIndex = path.indexOf("#");
  if (hashIndex !== -1) {
    var cropInfo = path.substring(hashIndex + 1).split(",");
    if (cropInfo.length !== 4) throw new Error("malformed url: " + path);
    img.src = path.substring(0, hashIndex);
  } else {
    img.src = path;
  }
  img.addEventListener("load", function() {
    if (cropInfo != null) {
      var x = parseInt(cropInfo[0], 10);
      var y = parseInt(cropInfo[1], 10);
      var width = parseInt(cropInfo[2], 10);
      var height = parseInt(cropInfo[3], 10);
      var canvas = document.createElement('canvas');
      canvas.width  = width;
      canvas.height = height;
      var context = canvas.getContext("2d");
      context.drawImage(img, x, y, width, height, 0, 0, width, height);
      facePathToUrlUrl[path] = 'url("'+canvas.toDataURL()+'")';
    } else {
      facePathToUrlUrl[path] = 'url("'+path+'")';
    }
    checkForDoneLoading();
  });
  img.addEventListener("error", function() {
    facePathToUrlUrl[path] = "url(\"placeholder.png\")";
    checkForDoneLoading();
  });
}
function checkForDoneLoading() {
  for (var key in facePathToUrlUrl) {
    if (facePathToUrlUrl[key] === "") return; // not done yet
  }
  // all done loading
  getObjects().forEach(render);
  renderOrder();
  resizeTableToFitEverything();
  fixFloatingThingZ();
}
function autogenerateId(i) {
  return "object-" + i;
}
function getIdFromIndex(i) {
  var id = gameDefinition.objects[i].id;
  if (id == null) id = autogenerateId(i);
  return id;
}

function deleteTableAndEverything() {
  closeDialog();
  tableDiv.innerHTML = "";
  gameDefinition = null;
  objectDefinitionsById = null;
  objectIndexesById = null;
  objectsById = null;
  usersById = {};
  selectedObjectIdToNewProps = {};
  consumeNumberModifier();
  // leave the image cache alone
}
function findMaxZ(excludingSelection) {
  var maxZ = null;
  getObjects().forEach(function(object) {
    if (excludingSelection != null && object.id in excludingSelection) return;
    var newProps = selectedObjectIdToNewProps[object.id];
    if (newProps == null) newProps = object;
    if (maxZ == null || newProps.z > maxZ) maxZ = newProps.z;
  });
  return maxZ;
}
function fixFloatingThingZ() {
  renderExaminingObjects();
  var z = findMaxZ(examiningObjectsById) + Object.keys(examiningObjectsById).length;
  z++;
  hiderContainers.forEach(function(object) {
    var objectDefinition = getObjectDefinition(object.id);
    var objectDiv = getObjectDiv(object.id);
    if (objectDefinition.visionWhitelist.indexOf(myUser.role) === -1) {
      // blocked
      objectDiv.style.zIndex = z++;
    } else {
      // see it
      objectDiv.style.zIndex = object.z;
    }
  });
  document.getElementById("roomInfoDiv").style.zIndex = z++;
  document.getElementById("logDiv").style.zIndex = z++;
  document.getElementById("helpDiv").style.zIndex = z++;
  modalMaskDiv.style.zIndex = z++;
  editUserDiv.style.zIndex = z++;
}

var DRAG_NONE = 0;
var DRAG_RECTANGLE_SELECT = 1;
var DRAG_MOVE_SELECTION = 2;
var draggingMode = DRAG_NONE;

var rectangleSelectStartX;
var rectangleSelectStartY;
var rectangleSelectEndX;
var rectangleSelectEndY;
var selectedObjectIdToNewProps = {};

var EXAMINE_NONE = 0;
var EXAMINE_SINGLE = 1;
var EXAMINE_MULTI = 2;
var examiningMode = EXAMINE_NONE;
var examiningObjectsById = {};

var hoverObject;
var lastMouseDragX;
var lastMouseDragY;

var accordionMouseStartX = null;
var accordionObjectStartX = null;
var isGKeyDown = false;

function onObjectMouseDown(event) {
  if (event.button !== 0) return;
  if (examiningMode !== EXAMINE_NONE) return;
  var objectDiv = this;
  var object = objectsById[objectDiv.dataset.id];
  if (object.locked || object.immobile) return; // click thee behind me, satan
  if (isHidden(object.x + object.width/2, object.y + object.height/2, true)) return;
  event.preventDefault();
  event.stopPropagation();

  // select
  if (selectedObjectIdToNewProps[object.id] == null) {
    // make a selection
    var numberModifier = consumeNumberModifier();
    if (numberModifier == null) numberModifier = 1;
    if (numberModifier === 1) {
      setSelectedObjects([object]);
    } else {
      var stackId = getStackId(object, object);
      var stackOfObjects = getObjects().filter(function(object) { return getStackId(object, object) === stackId; });
      stackOfObjects.sort(compareZ);
      // we can be pretty sure the object we're clicking is the top.
      if (numberModifier < stackOfObjects.length) {
        stackOfObjects.splice(0, stackOfObjects.length - numberModifier);
      }
      setSelectedObjects(stackOfObjects);
    }
  }

  // begin drag
  draggingMode = DRAG_MOVE_SELECTION;
  lastMouseDragX = eventToMouseX(event, tableDiv);
  lastMouseDragY = eventToMouseY(event, tableDiv);
  if (isGKeyDown) startAccordion();

  // bring selection to top
  // effectively do a stable sort.
  var selection = selectedObjectIdToNewProps;
  var newPropses = [];
  for (var id in selection) {
    newPropses.push(selection[id]);
  }
  newPropses.sort(compareZ);
  var z = findMaxZ(selection);
  newPropses.forEach(function(newProps, i) {
    newProps.z = z + i + 1;
  });
  renderAndMaybeCommitSelection(selection, "move");
  fixFloatingThingZ();
}
function onObjectMouseMove(event) {
  if (draggingMode != DRAG_NONE) return;
  var objectDiv = this;
  var object = objectsById[objectDiv.dataset.id];
  if (object.locked) return;
  if (isHidden(object.x + object.width/2, object.y + object.height/2, true)) return;
  setHoverObject(object);
}
function onObjectMouseOut(event) {
  if (draggingMode != DRAG_NONE) return;
  var objectDiv = this;
  var object = objectsById[objectDiv.dataset.id];
  if (hoverObject === object) {
    setHoverObject(null);
  }
}

tableDiv.addEventListener("mousedown", function(event) {
  if (event.button !== 0) return;
  // clicking the table
  event.preventDefault();
  if (examiningMode !== EXAMINE_NONE) return;
  draggingMode = DRAG_RECTANGLE_SELECT;
  rectangleSelectStartX = eventToMouseX(event, tableDiv);
  rectangleSelectStartY = eventToMouseY(event, tableDiv);
  setSelectedObjects([]);
});

document.addEventListener("mousemove", function(event) {
  var x = eventToMouseX(event, tableDiv);
  var y = eventToMouseY(event, tableDiv);
  if (draggingMode === DRAG_RECTANGLE_SELECT) {
    rectangleSelectEndX = x;
    rectangleSelectEndY = y;
    renderSelectionRectangle();
    (function() {
      var minX = rectangleSelectStartX;
      var minY = rectangleSelectStartY;
      var maxX = rectangleSelectEndX;
      var maxY = rectangleSelectEndY;
      if (minX > maxX) { var tmp = maxX; maxX = minX; minX = tmp; }
      if (minY > maxY) { var tmp = maxY; maxY = minY; minY = tmp; }
      var newSelectedObjects = [];
      getObjects().forEach(function(object) {
        if (object.locked || object.immobile) return;
        if (isHidden(object.x + object.width/2, object.y + object.height/2, true)) return;
        if (object.x > maxX) return;
        if (object.y > maxY) return;
        if (object.x + object.width  < minX) return;
        if (object.y + object.height < minY) return;
        newSelectedObjects.push(object);
      });
      setSelectedObjects(newSelectedObjects);
    })();
  } else if (draggingMode === DRAG_MOVE_SELECTION) {
    if (accordionMouseStartX != null) {
      // accordion drag
      var dx = x - accordionMouseStartX;
      var objects = [];
      for (var id in selectedObjectIdToNewProps) {
        objects.push(objectsById[id]);
      }
      objects.sort(compareZ);
      objects.forEach(function(object, i) {
        var newProps = selectedObjectIdToNewProps[object.id];
        var factor = i === objects.length - 1 ? 1 : i / (objects.length - 1);
        newProps.x = Math.round(accordionObjectStartX + dx * factor);
        render(object);
      });
    } else {
      // normal drag
      var dx = x - lastMouseDragX;
      var dy = y - lastMouseDragY;
      Object.keys(selectedObjectIdToNewProps).forEach(function(id) {
        var object = objectsById[id];
        var newProps = selectedObjectIdToNewProps[id];
        newProps.x = Math.round(newProps.x + dx);
        newProps.y = Math.round(newProps.y + dy);
        render(object);
      });
    }
    renderOrder();
    resizeTableToFitEverything();
    lastMouseDragX = x;
    lastMouseDragY = y;
  }
});
document.addEventListener("mouseup", function(event) {
  if (draggingMode === DRAG_RECTANGLE_SELECT) {
    draggingMode = DRAG_NONE;
    renderSelectionRectangle();
  } else if (draggingMode === DRAG_MOVE_SELECTION) {
    draggingMode = DRAG_NONE;
    // snap everything really quick
    for (var id in selectedObjectIdToNewProps) {
      var object = objectsById[id];
      var newProps = selectedObjectIdToNewProps[id];
      if (snapToSnapZones(object, newProps)) {
        render(object, true);
      }
    }
    commitSelection(selectedObjectIdToNewProps, "move");
    resizeTableToFitEverything();
    renderOrder();
    setSelectedObjects([]);
  }
});

function setHoverObject(object) {
  if (hoverObject == object) return;
  if (hoverObject != null) {
    getObjectDiv(hoverObject.id).classList.remove("hoverSelect");
  }
  hoverObject = object;
  if (hoverObject != null) {
    getObjectDiv(hoverObject.id).classList.add("hoverSelect");
  }
}
function setSelectedObjects(objects) {
  for (var id in selectedObjectIdToNewProps) {
    var objectDiv = getObjectDiv(id);
    objectDiv.classList.remove("selected");
  }
  selectedObjectIdToNewProps = {};
  objects.forEach(function(object) {
    selectedObjectIdToNewProps[object.id] = newPropsForObject(object);
  });
  for (var id in selectedObjectIdToNewProps) {
    var objectDiv = getObjectDiv(id);
    objectDiv.classList.add("selected");
  }

  if (hoverObject != null) {
    if (hoverObject.id in selectedObjectIdToNewProps) {
      // better than hovering
      getObjectDiv(hoverObject.id).classList.remove("hoverSelect");
    } else {
      // back to just hovering
      getObjectDiv(hoverObject.id).classList.add("hoverSelect");
    }
  }
}
function newPropsForObject(object) {
  return {
    x: object.x,
    y: object.y,
    z: object.z,
    faceIndex: object.faceIndex,
    label: object.label,
    angle: object.angle,
  };
}
function getEffectiveSelection(objects) {
  // if you make changes, call renderAndMaybeCommitSelection
  if (Object.keys(selectedObjectIdToNewProps).length > 0) return selectedObjectIdToNewProps;
  if (hoverObject != null) {
    var effectiveSelection = {};
    effectiveSelection[hoverObject.id] = newPropsForObject(hoverObject);
    return effectiveSelection;
  }
  return {};
}
function renderAndMaybeCommitSelection(selection, type="move") {
  var objectsToRender = [];
  // render
  for (var id in selection) {
    var object = objectsById[id];
    var newProps = selection[id];
    if (!(object.x === newProps.x &&
          object.y === newProps.y &&
          object.z === newProps.z &&
          object.faceIndex === newProps.faceIndex &&
          object.label === newProps.label &&
          object.angle === newProps.angle)) {
      objectsToRender.push(object);
    }
  }
  if (draggingMode === DRAG_NONE || type != "move") {
    // if we're dragging, don't commit yet
    commitSelection(selection, type);
  }
  // now that we've possibly committed a temporary selection, we can render.
  objectsToRender.forEach(render);
  renderOrder();
  resizeTableToFitEverything();

  // it's too late to use this
  consumeNumberModifier();
}
function commitSelection(selection, type="move") {
  var move = [];
  move.push(myUser.id);
  move.push(type);
  for (var id in selection) {
    var object = objectsById[id];
    var newProps = selection[id];
    if (!(object.x === newProps.x &&
          object.y === newProps.y &&
          object.z === newProps.z &&
          object.faceIndex === newProps.faceIndex &&
          object.label === newProps.label &&
          object.angle === newProps.angle)) {
      move.push(
        objectIndexesById[object.id],
        /*object.x,
        object.y,
        object.z,
        object.faceIndex,
        object.label,*/
        newProps.x,
        newProps.y,
        newProps.z,
        newProps.faceIndex,
        newProps.label,
        newProps.angle);
      // anticipate
      /*object.x = newProps.x;
      object.y = newProps.y;
      object.z = newProps.z;
      object.faceIndex = newProps.faceIndex;
      object.label = newProps.label;*/
    }
  }
  if (move.length <= 1) return;
  var message = {
    cmd: "makeAMove",
    args: move,
  };
  sendMessage(message);
  makeAMove(move, true);
}

var SHIFT = 1;
var CTRL = 2;
var ALT = 4;
function getModifierMask(event) {
  return (
    (event.shiftKey ? SHIFT : 0) |
    (event.ctrlKey ? CTRL : 0) |
    (event.altKey ? ALT : 0)
  );
}
document.addEventListener("keydown", function(event) {
  if (screenMode != SCREEN_MODE_PLAY) return;
  if (dialogIsOpen) {
    if (event.keyCode === 27) closeDialog();
    return;
  }
  var modifierMask = getModifierMask(event);
  switch (event.keyCode) {
    case "R".charCodeAt(0):
      if (modifierMask === 0) { rollSelection(); break; }
      return;
    case "S".charCodeAt(0):
      if (modifierMask === 0) { shuffleSelection(); break; }
      return; 
    case "F".charCodeAt(0):
      if (modifierMask === 0) { flipOverSelection(); break; }
      return;
    case "G".charCodeAt(0):
      if (modifierMask === 0 && accordionMouseStartX == null) { groupSelection(); /*startAccordion(); isGKeyDown = true;*/ break; }
      return;
    case "T".charCodeAt(0):
      if (modifierMask === 0) { turnSelection(1); break; }
      if (modifierMask === SHIFT) { turnSelection(-1); break; }
      return;
    case 27: // Escape
      if (modifierMask === 0 && numberTypingBuffer.length > 0) { consumeNumberModifier(); break; }
      if (modifierMask === 0 && draggingMode === DRAG_MOVE_SELECTION) { cancelMove(); break; }
      if (modifierMask === 0 && draggingMode === DRAG_NONE)           { setSelectedObjects([]); break; }
      return;
    case "Z".charCodeAt(0):
      //if (draggingMode === DRAG_NONE && modifierMask === CTRL)         { undo(); break; }
      //if (draggingMode === DRAG_NONE && modifierMask === (CTRL|SHIFT)) { redo(); break; }
      if (modifierMask === 0)     { examineSingle(); break; }
      if (modifierMask === SHIFT) { examineMulti(); break; }
      return;
    case "Y".charCodeAt(0):
      if (modifierMask === CTRL) { redo(); break; }
      return;
    case 191: // slash/question mark?
      if (modifierMask === SHIFT) { toggleHelp(); break; }
      return;

    case 48: case 49: case 50: case 51: case 52:  case 53:  case 54:  case 55:  case 56:  case 57:  // number keys
    case 96: case 97: case 98: case 99: case 100: case 101: case 102: case 103: case 104: case 105: // numpad
      var numberValue = event.keyCode < 96 ? event.keyCode - 48 : event.keyCode - 96;
      if (modifierMask === 0) { typeNumber(numberValue); break; }
      return;

    case 61: case 187: // equals
      if(modifierMask != SHIFT) return;
    case 107: // plus
      incrementLabel();
      break;
    case 109: case 173: case 189: // minus
      decrementLabel();
      break;

    case "L".charCodeAt(0):
      setLabel();
      break;

    case 32: // space
      toggleLog();
      break;

    case 13: // enter
      var message = prompt("Enter a message:", "");
      if (message === null) break;
      message = "<b>" + myUser.username + "(" + myUser.role + "): " + message + "</b><br>";
      sendMessage({cmd: "logMessage", args: message});
      document.getElementById("logContentsDiv").innerHTML += message;
      break;

    default: return;
  }
  event.preventDefault();
});
document.addEventListener("keyup", function(event) {
  var modifierMask = getModifierMask(event);
  switch (event.keyCode) {
    case "Z".charCodeAt(0):
      unexamine();
      break;
    /*case "G".charCodeAt(0):
      if (modifierMask === 0) { stopAccordion(); isGKeyDown = false; break; }
      return;*/
    default: return;
  }
  event.preventDefault();
});

function startAccordion() {
  if (draggingMode !== DRAG_MOVE_SELECTION) return;
  accordionMouseStartX = lastMouseDragX;
  for (var id in selectedObjectIdToNewProps) {
    // they're all the same
    accordionObjectStartX = selectedObjectIdToNewProps[id].x;
    break;
  }
}
function stopAccordion() {
  accordionMouseStartX = null;
  accordionObjectStartX = null;
}

function flipOverSelection() {
  var selection;
  if (Object.keys(selectedObjectIdToNewProps).length > 0) {
    // real selection
    selection = selectedObjectIdToNewProps;
  } else if (hoverObject != null){ 
    // select all objects we're hovering over in this stack
    var stackId = getStackId(hoverObject, hoverObject);
    selection = {};
    getObjects().forEach(function(object) {
      if (stackId !== getStackId(object, object)) return;
      selection[object.id] = newPropsForObject(object);
    });
  }
  for (var id in selection) {
    var object = objectsById[id];
    var newProps = selection[id];
    newProps.faceIndex += 1;
    if (object.faces.length === newProps.faceIndex) {
      newProps.faceIndex = 0;
    }
  }
  renderAndMaybeCommitSelection(selection, "flip");
  renderOrder();
}
function rollSelection() {
  var selection = getEffectiveSelection();
  for (var id in selection) {
    var object = objectsById[id];
    var newProps = selection[id];
    newProps.faceIndex = Math.floor(Math.random() * object.faces.length);
    if (object.faces.length > 1) object.faceIndex = -1; //be sure to commit the roll even if it lands on the same number it was on previously

    /*var objectDiv = getObjectDiv(id);
    objectDiv.classList.remove("spinning");
    void objectDiv.offsetWidth; // trigger a reflow so it shows again
    objectDiv.classList.add("spinning");*/
  }
  renderAndMaybeCommitSelection(selection, "roll");
  renderOrder();
}
function turnSelection(direction) {
  var selection;
  if (Object.keys(selectedObjectIdToNewProps).length > 0) {
    // real selection
    selection = selectedObjectIdToNewProps;
  } else if (hoverObject != null){ 
    // select all objects we're hovering over in this stack
    var stackId = getStackId(hoverObject, hoverObject);
    selection = {};
    getObjects().forEach(function(object) {
      if (stackId !== getStackId(object, object)) return;
      selection[object.id] = newPropsForObject(object);
    });
  }
  for (var id in selection) {
    var newProps = selection[id];
    newProps.angle += 90 * direction;
    if(newProps.angle >= 360) newProps.angle -= 360;
    if(newProps.angle < 0) newProps.angle += 360;
  }
  renderAndMaybeCommitSelection(selection, "turn");
  renderOrder();
}
function cancelMove() {
  var selection = selectedObjectIdToNewProps;
  for (var id in selection) {
    var object = objectsById[id];
    var newProps = selection[id];
    newProps.x = object.x;
    newProps.y = object.y;
    newProps.z = object.z;
    newProps.faceIndex = object.faceIndex;
    render(object, true);
  }
  draggingMode = DRAG_NONE;
  renderOrder();
  resizeTableToFitEverything();
  fixFloatingThingZ();
}
function shuffleSelection() {
  var selection;
  if (Object.keys(selectedObjectIdToNewProps).length > 0) {
    // real selection
    selection = selectedObjectIdToNewProps;
  } else if (hoverObject != null) {
    // select all objects we're hovering over in this stack
    var stackId = getStackId(hoverObject, hoverObject);
    selection = {};
    getObjects().forEach(function(object) {
      if (stackId !== getStackId(object, object)) return;
      selection[object.id] = newPropsForObject(object);
    });
  } else {
    // no selection
    return;
  }

  var newPropsArray = [];
  for (var id in selection) {
    newPropsArray.push(selection[id]);
  }
  for (var i = 0; i < newPropsArray.length; i++) {
    var otherIndex = Math.floor(Math.random() * (newPropsArray.length - i)) + i;
    var tempX = newPropsArray[i].x;
    var tempY = newPropsArray[i].y;
    var tempZ = newPropsArray[i].z;
    newPropsArray[i].x = newPropsArray[otherIndex].x;
    newPropsArray[i].y = newPropsArray[otherIndex].y;
    newPropsArray[i].z = newPropsArray[otherIndex].z;
    newPropsArray[otherIndex].x = tempX;
    newPropsArray[otherIndex].y = tempY;
    newPropsArray[otherIndex].z = tempZ;
  }
  for(var id in selection){
    var o = objectsById[id];
    /*if(o.x == selection[id].x && o.y == selection[id].y && o.z != selection[id].z){
      var objectDiv = getObjectDiv(id);
      objectDiv.classList.remove("spinning");
      void objectDiv.offsetWidth; // trigger a reflow so it shows again
      objectDiv.classList.add("spinning");
    }*/
  }
  renderAndMaybeCommitSelection(selection, "shuffle");
  renderOrder();
  resizeTableToFitEverything();
}
function groupSelection() {
  var selection = getEffectiveSelection();
  var selectionLength = Object.keys(selection).length;
  if (selectionLength <= 1) return;
  // find the weighted center (average location)
  var totalX = 0;
  var totalY = 0;
  for (var id in selection) {
    var newProps = selection[id];
    totalX += newProps.x;
    totalY += newProps.y;
  }
  // who is closest to the weighted center?
  var averageX = totalX / selectionLength;
  var averageY = totalY / selectionLength;
  var medianNewProps = null;
  var shortestDistanceSquared = Infinity;
  for (var id in selection) {
    var newProps = selection[id];
    var dx = newProps.x - averageX;
    var dy = newProps.y - averageY;
    var distanceSquared = dx * dx + dy * dy;
    if (distanceSquared < shortestDistanceSquared) {
      shortestDistanceSquared = distanceSquared;
      medianNewProps = newProps;
    }
  }
  // everybody move to the center
  for (var id in selection) {
    var newProps = selection[id];
    newProps.x = medianNewProps.x;
    newProps.y = medianNewProps.y;
  }
  renderAndMaybeCommitSelection(selection, "group");
  renderOrder();
  resizeTableToFitEverything();
}
function examineSingle() {
  if (examiningMode === EXAMINE_SINGLE) return; // ignore key repeat
  unexamine();
  examiningMode = EXAMINE_SINGLE;
  examiningObjectsById = {};
  if (hoverObject == null) return;
  // ignore the newProps in selectedObjectIdToNewProps, because it doesn't really matter
  examiningObjectsById[hoverObject.id] = newPropsForObject(hoverObject);
  renderExaminingObjects();
}
function examineMulti() {
  if (examiningMode === EXAMINE_MULTI) return;
  unexamine();
  examiningMode = EXAMINE_MULTI;

  var selection;
  if (Object.keys(selectedObjectIdToNewProps).length > 0) {
    // real selection
    selection = selectedObjectIdToNewProps;
  } else if (hoverObject != null) {
    // choose all objects overlapping the hover object
    var hoverX = hoverObject.x;
    var hoverY = hoverObject.y;
    var hoverWidth  = hoverObject.width;
    var hoverHeight = hoverObject.height;
    selection = {};
    getObjects().forEach(function(object) {
      if (object.locked) return; // don't look at me
      if (object.x >= hoverX   + hoverWidth)    return;
      if (object.y >= hoverY   + hoverHeight)   return;
      if (hoverX   >= object.x + object.width)  return;
      if (hoverY   >= object.y + object.height) return;
      selection[object.id] = newPropsForObject(object);
    });
  } else {
    // no selection
    return;
  }

  examiningObjectsById = selection;
  renderExaminingObjects();
}
function unexamine() {
  if (examiningMode === EXAMINE_NONE) return;
  examiningMode = EXAMINE_NONE;
  var selection = examiningObjectsById;
  examiningObjectsById = {};
  for (var id in selection) {
    render(objectsById[id], true);
  }
  renderOrder();
}

var numberTypingBuffer = "";
function typeNumber(numberValue) {
  numberTypingBuffer += numberValue;
  renderNumberBuffer();
}
function consumeNumberModifier() {
  if (numberTypingBuffer.length === 0) return null;
  var result = parseInt(numberTypingBuffer, 10);
  numberTypingBuffer = "";
  renderNumberBuffer();
  return result;
}
function clearNumberBuffer() {
  numberTypingBuffer = "";
  renderNumberBuffer();
}

var isHelpShown = true;
var isHelpMouseIn = false;

var isLogShown = false;
var isLogMouseIn = false;

function toggleHelp() {
  isHelpShown = !isHelpShown;
  renderHelp();
}

function toggleLog() {
  isLogShown = !isLogShown;
  renderLog();
  document.getElementById("logContentsDiv").scrollTop += 99999;
}

document.getElementById("helpDiv").addEventListener("mousemove", function() {
  if (draggingMode !== DRAG_NONE) return;
  isHelpMouseIn = true;
  renderHelp();
});
document.getElementById("helpDiv").addEventListener("mouseout", function() {
  isHelpMouseIn = false;
  renderHelp();
});

document.getElementById("logDiv").addEventListener("mousemove", function() {
  if (draggingMode !== DRAG_NONE) return;
  isLogMouseIn = true;
  renderLog();
});
document.getElementById("logDiv").addEventListener("mouseout", function() {
  isLogMouseIn = false;
  renderLog();
});

function renderHelp() {
  if (isHelpShown || isHelpMouseIn) {
    document.getElementById("helpDiv").classList.add("helpExpanded");
  } else {
    document.getElementById("helpDiv").classList.remove("helpExpanded");
  }
}

function renderLog() {
  if (isLogShown || isLogMouseIn) {
    document.getElementById("logDiv").classList.add("logExpanded");
  } else {
    document.getElementById("logDiv").classList.remove("logExpanded");
  }
}

function incrementLabel() {
  var selection = getEffectiveSelection();
  for (var id in selection) {
    var object = objectsById[id];
    if (!object.hasLabel) continue;
    var newProps = selection[id];
    if(typeof(newProps.label) != "number") newProps.label = 0;
    newProps.label++;
  }
  renderAndMaybeCommitSelection(selection, "label");
  renderOrder();
}

function decrementLabel() {
  var selection = getEffectiveSelection();
  for (var id in selection) {
    var object = objectsById[id];
    if (!object.hasLabel) continue;
    var newProps = selection[id];
    if(typeof(newProps.label) != "number") newProps.label = 0;
    newProps.label--;
  }
  renderAndMaybeCommitSelection(selection, "label");
  renderOrder();
}

function setLabel(){
  var selection = getEffectiveSelection();
  var promptForLabel = false
  for (var id in selection) {
    var object = objectsById[id];
    if (object.hasLabel) promptForLabel=true;
  }
  if (!promptForLabel) return;
  var newLabel = prompt("Enter new label:", "");
  var numericalLabel = parseInt(newLabel);
  if(numericalLabel.toString() == newLabel) newLabel = numericalLabel;
  for (var id in selection) {
    var newProps = selection[id];
    newProps.label = newLabel;
  }
  renderAndMaybeCommitSelection(selection, "label");
  renderOrder();
}

/*
function undo() { undoOrRedo(changeHistory, futureChanges); }
function redo() { undoOrRedo(futureChanges, changeHistory); }
function undoOrRedo(thePast, theFuture) {
  consumeNumberModifier();
  if (thePast.length === 0) return;
  var newMove = reverseChange(thePast.pop());
  sendMessage({cmd:"makeAMove", args:newMove});
  theFuture.push(newMove);
}
function reverseChange(move) {
  var newMove = [myUser.id];
  var i = 0;
  move[i++]; // userId
  while (i < move.length) {
    var object = objectsById[getIdFromIndex(move[i++])];
    var fromX         =      move[i++];
    var fromY         =      move[i++];
    var fromZ         =      move[i++];
    var fromFaceIndex =      move[i++];
    var   toX         =      move[i++];
    var   toY         =      move[i++];
    var   toZ         =      move[i++];
    var   toFaceIndex =      move[i++];
    object.x         = fromX;
    object.y         = fromY;
    object.z         = fromZ;
    object.faceIndex = fromFaceIndex;
    var newProps = selectedObjectIdToNewProps[object.id];
    if (newProps != null) {
      newProps.x         = object.x;
      newProps.y         = object.y;
      newProps.z         = object.z;
      newProps.faceIndex = object.faceIndex;
    }
    newMove.push(
      objectIndexesById[object.id],
      toX,
      toY,
      toZ,
      toFaceIndex,
      fromX,
      fromY,
      fromZ,
      fromFaceIndex);
    render(object, true);
  }
  renderOrder();
  resizeTableToFitEverything();

  return newMove;
}*/
/*function pushChangeToHistory(change) {
  changeHistory.push(change);
  document.getElementById("logContentsDiv").innerHTML += moveToString(change);
  //futureChanges = [];
}*/

function eventToMouseX(event, div) { return event.clientX - div.getBoundingClientRect().left; }
function eventToMouseY(event, div) { return event.clientY - div.getBoundingClientRect().top; }

function renderUserList() {
  var userListUl = document.getElementById("userListUl");
  var userIds = Object.keys(usersById);
  userIds.sort();
  /*userListUl.innerHTML = userIds.map(function(userId) {
    return (
      '<li'+(userId === myUser.id ? ' id="myUserNameLi" title="Click to edit your name/role"' : '')+'>' +
        sanitizeHtml(usersById[userId].username) +
      '</li>');
  }).join("");*/
  userListUl.innerHTML = "";
  for (var u in usersById){
    userListUl.innerHTML += '<li'+(usersById[u].id === myUser.id ? ' id="myUserNameLi" title="Click to edit your role" ' : ' ') +
        (usersById[u].loggedIn ? '' : 'style="color:grey"') + '>' +
        sanitizeHtml(usersById[u].username) +
      '</li>'
  }

  getObjects().forEach(function(object) {
    var objectDefinition = getObjectDefinition(object.id);
    if (objectDefinition.labelPlayerName == null) return;
    var username = null;
    if (objectDefinition.labelPlayerName === myUser.role) {
      username = "You";
    } else {
      for (var i = 0; i < userIds.length; i++) {
        if (usersById[userIds[i]].role === objectDefinition.labelPlayerName) {
          username = usersById[userIds[i]].username;
          break;
        }
      }
    }
    var roleName = null;
    for (var i = 0; i < gameDefinition.roles.length; i++) {
      if (gameDefinition.roles[i].id === objectDefinition.labelPlayerName) {
        roleName = gameDefinition.roles[i].name;
        break;
      }
    }
    var labelText;
    if (username != null) {
      labelText = username + " ("+roleName+")";
    } else {
      labelText = roleName;
    }
    var stackHeightDiv = getStackHeightDiv(object.id);
    stackHeightDiv.textContent = labelText;
    stackHeightDiv.classList.add("userLabel");
    stackHeightDiv.style.display = "block";
  });
  document.getElementById("myUserNameLi").addEventListener("click", showEditUserDialog);
}
var dialogIsOpen = false;
var modalMaskDiv = document.getElementById("modalMaskDiv");
modalMaskDiv.addEventListener("mousedown", closeDialog);
var editUserDiv = document.getElementById("editUserDiv");
function showEditUserDialog() {
  modalMaskDiv.style.display = "block";
  editUserDiv.style.display = "block";

  //yourNameTextbox.value = myUser.username;
  yourRoleDropdown.innerHTML = '<option value="">Spectator</option>' + gameDefinition.roles.map(function(role) {
    return '<option value="'+role.id+'">' + sanitizeHtml(role.name) + '</option>';
  }).join("");
  yourRoleDropdown.value = myUser.role;

  dialogIsOpen = true;
  //yourNameTextbox.focus();
  //yourNameTextbox.select();
}
function closeDialog() {
  modalMaskDiv.style.display = "none";
  editUserDiv.style.display = "none";
  if (document.activeElement != null) {
    document.activeElement.blur();
  }
  dialogIsOpen = false;
}
//var yourNameTextbox = document.getElementById("yourNameTextbox");
/*yourNameTextbox.addEventListener("keydown", function(event) {
  event.stopPropagation();
  if (event.keyCode === 13) {
    setTimeout(function() {
      submitYourName();
      closeDialog();
    }, 0);
  } else if (event.keyCode === 27) {
    setTimeout(closeDialog, 0);
  }
});
var submitYourNameButton = document.getElementById("submitYourNameButton");
submitYourNameButton.addEventListener("click", submitYourName);
function submitYourName() {
  var newName = yourNameTextbox.value;
  if (newName && newName !== myUser.role) {
    sendMessage({
      cmd: "changeMyName",
      args: newName,
    });
    // anticipate
    myUser.username = newName;
    renderUserList();
  }
}*/
var yourRoleDropdown = document.getElementById("yourRoleDropdown");
var submitYourRoleButton = document.getElementById("submitYourRoleButton");
submitYourRoleButton.addEventListener("click", submitYourRole);
//var yourRolePasswordTextBox = document.getElementById("yourRolePassword");
/*yourRolePasswordTextBox.addEventListener("keydown", function(event) {
  event.stopPropagation();
  if (event.keyCode === 13) {
    setTimeout(function() {
      submitYourRole();
      closeDialog();
    }, 0);
  } else if (event.keyCode === 27) {
    setTimeout(closeDialog, 0);
  }
});*/

function submitYourRole() {
  var newRole = yourRoleDropdown.value;
  if (newRole !== myUser.role) {
    sendMessage({
      cmd: "changeMyRole",
      args: {
        newRole: newRole,
      }
    });
  }
}

/*yourRoleDropdown.addEventListener("change", function() {
  setTimeout(function() {
    var role = yourRoleDropdown.value;
    sendMessage({
      cmd: "changeMyRole",
      args: role,
    });
    // anticipate
    myUser.role = role;
    renderUserList();
    // hide/show objects
    getObjects().forEach(render);
    fixFloatingThingZ();
  }, 0);
});*/
document.getElementById("closeEditUserButton").addEventListener("click", closeDialog);

function render(object, isAnimated) {
  if (object.id in examiningObjectsById) return; // different handling for this
  var objectDefinition = getObjectDefinition(object.id);
  var x = object.x;
  var y = object.y;
  var z = object.z;
  var faceIndex = object.faceIndex;
  var angle = object.angle;
  var newProps = selectedObjectIdToNewProps[object.id];
  if (newProps != null) {
    x = newProps.x;
    y = newProps.y;
    z = newProps.z;
    faceIndex = newProps.faceIndex;
    angle = newProps.angle;
  }
  if (objectDefinition.locked) {
    z = 0;
  } else { //can I reduce this using isHidden()?
    for (var i = 0; i < hiderContainers.length; i++) {
      var hiderContainer = hiderContainers[i];
      if (hiderContainer.x <= x+object.width /2 && x+object.width /2 <= hiderContainer.x + hiderContainer.width &&
          hiderContainer.y <= y+object.height/2 && y+object.height/2 <= hiderContainer.y + hiderContainer.height) {
        var hiderContainerDefinition = getObjectDefinition(hiderContainer.id);
        if (hiderContainerDefinition.visionWhitelist.indexOf(myUser.role) === -1) {
          // blocked
          var forbiddenFaces = hiderContainerDefinition.hideFaces.map(resolveFace);
          var betterFaceIndex = -1;
          for (var j = 0; j < object.faces.length; j++) {
            var tryThisIndex = (faceIndex + j) % object.faces.length;
            if (forbiddenFaces.indexOf(tryThisIndex) === -1) {
              betterFaceIndex = tryThisIndex;
              break;
            }
          }
          faceIndex = betterFaceIndex;
        }
        break;
      }
    }
  }
  var objectDiv = getObjectDiv(object.id);
  if (isAnimated) {
    objectDiv.classList.add("animatedMovement");
  } else {
    objectDiv.classList.remove("animatedMovement");
  }
  objectDiv.style.left = x + "px";
  objectDiv.style.top  = y + "px";
  objectDiv.style.width  = object.width;
  objectDiv.style.height = object.height;
  objectDiv.style.zIndex = z;
  objectDiv.style.transform="rotate(" + angle + "deg)";
  if (object.faces != null) {
    var facePath = object.faces[faceIndex];
    var imageUrlUrl;
    if (!facePath) imageUrlUrl = "url(\"placeholder.png\")";
    else imageUrlUrl = facePathToUrlUrl[facePath];
    if ( objectDiv.dataset.facePath !== facePath) {
      objectDiv.dataset.facePath = facePath;
      objectDiv.style.backgroundImage = imageUrlUrl;
    }
  } else if (objectDefinition.backgroundColor != null) {
    objectDiv.style.backgroundColor = objectDefinition.backgroundColor.replace(/alpha/, "0.4");
    objectDiv.style.borderColor = "rgba(255,255,255,0.8)";
    objectDiv.style.borderWidth = "3px";
    objectDiv.style.borderStyle = "solid";
    objectDiv.style.pointerEvents = "none";
    // adjust rectangle, because the border screws up everything
    objectDiv.style.left = (x - 3) + "px";
    objectDiv.style.top  = (y - 3) + "px";
  } else {
    throw new Error("don't know how to render object");
  }
  objectDiv.style.display = "block";

  if (objectDefinition.backgroundColor != null) {
    var backgroundDiv = getBackgroundDiv(object.id);
    if (isAnimated) {
      backgroundDiv.classList.add("animatedMovement");
    } else {
      backgroundDiv.classList.remove("animatedMovement");
    }
    backgroundDiv.style.left = x + "px";
    backgroundDiv.style.top = y + "px";
    backgroundDiv.style.width  = object.width;
    backgroundDiv.style.height = object.height;
    backgroundDiv.style.zIndex = 0;
    backgroundDiv.style.display = "block";
    backgroundDiv.style.backgroundColor = objectDefinition.backgroundColor.replace(/alpha/, "1.0");
  }
}
function renderExaminingObjects() {
  // sort by z order. bottom-to-top is left-to-right.
  var objects = [];
  for (var id in examiningObjectsById) {
    objects.push(objectsById[id]);
  }
  objects.sort(function(a, b) {
    return compareZ(examiningObjectsById[a.id], examiningObjectsById[b.id]);
  });

  // how far in can we zoom?
  var totalWidth = 0;
  var maxHeight = 0;
  objects.forEach(function(object) {
    totalWidth += object.width;
    if (object.height > maxHeight) maxHeight = object.height;
  });

  var windowWidth  = window.innerWidth;
  var windowHeight = window.innerHeight;
  var windowAspectRatio = windowWidth / windowHeight;
  var objectsAspectRatio = totalWidth / maxHeight;

  var bigHeight;
  if (windowAspectRatio < objectsAspectRatio) {
    bigHeight = windowWidth  / objectsAspectRatio;
  } else {
    bigHeight = windowHeight;
  }
  var zoomFactor = bigHeight / maxHeight;
  if (zoomFactor < 1.0) {
    // don't ever zoom out with this function. prefer overlapping objects.
    zoomFactor = 1.0;
    totalWidth = windowWidth;
  }
  var averageWidth = totalWidth / objects.length;

  var maxZ = findMaxZ();
  for (var i = 0; i < objects.length; i++) {
    var object = objects[i];
    var renderWidth  = object.width  * zoomFactor;
    var renderHeight = object.height * zoomFactor;
    var renderX = averageWidth * i * zoomFactor;
    var renderY = (windowHeight - renderHeight) / 2;
    var objectDiv = getObjectDiv(object.id);
    objectDiv.classList.add("animatedMovement");
    objectDiv.style.left = renderX + window.scrollX;
    objectDiv.style.top  = renderY + window.scrollY;
    objectDiv.style.width  = renderWidth;
    objectDiv.style.height = renderHeight;
    objectDiv.style.zIndex = maxZ + i + 3;
    var stackHeightDiv = getStackHeightDiv(object.id);
    stackHeightDiv.style.display = "none";
  }
}
function renderOrder() {
  var sizeAndLocationToIdAndZList = {};
  getObjects().forEach(function(object) {
    var newProps = selectedObjectIdToNewProps[object.id];
    if (newProps == null) newProps = object;
    var objectDefinition = getObjectDefinition(object.id);
    if (objectDefinition.labelPlayerName != null) {
      // not really a stack height
      return;
    }
    var key = getStackId(newProps, object);
    var idAndZList = sizeAndLocationToIdAndZList[key];
    if (idAndZList == null) idAndZList = sizeAndLocationToIdAndZList[key] = [];
    idAndZList.push({id:object.id, z:newProps.z});
  });
  for (var key in sizeAndLocationToIdAndZList) {
    var idAndZList = sizeAndLocationToIdAndZList[key];
    idAndZList.sort(compareZ);
    idAndZList.forEach(function(idAndZ, i) {
      if (idAndZ.id in examiningObjectsById) return;
      var stackHeightDiv = getStackHeightDiv(idAndZ.id);
      var object = objectsById[idAndZ.id];
      if (i > 0) {
        stackHeightDiv.textContent = (i + 1).toString();
        stackHeightDiv.style.display = "block";
        stackHeightDiv.className = "stackHeight";
        stackHeightDiv.style.color = "#000000";
      } else if (object.hasLabel && object.label != 0) {
        stackHeightDiv.textContent = (object.label).toString();
        stackHeightDiv.style.display = "block";
        stackHeightDiv.className = "itemLabel";
        if (object.labelColor.length > object.faceIndex){
          stackHeightDiv.style.color = object.labelColor[object.faceIndex];
        } else {
         stackHeightDiv.style.color = "#000000"; 
        }
      } else {
        stackHeightDiv.style.display = "none";
      }
    });
  }
}
function getStackId(newProps, object) {
  return [newProps.x, newProps.y, object.width, object.height].join(",");
}
function renderSelectionRectangle() {
  var selectionRectangleDiv = document.getElementById("selectionRectangleDiv");
  if (draggingMode === DRAG_RECTANGLE_SELECT) {
    var x = rectangleSelectStartX;
    var y = rectangleSelectStartY;
    var width  = rectangleSelectEndX - rectangleSelectStartX;
    var height = rectangleSelectEndY - rectangleSelectStartY;
    var borderWidth = parseInt(selectionRectangleDiv.style.borderWidth);
    if (width >= 0) {
      width -= 2 * borderWidth;
    } else {
      width *= -1;
      x -= width;
    }
    if (height >= 0) {
      height -= 2 * borderWidth;
    } else {
      height *= -1;
      y -= height;
    }
    if (height <= 0) height = 1;
    if (width  <= 0) width  = 1;
    selectionRectangleDiv.style.left = (tableDiv.offsetLeft + x) + "px";
    selectionRectangleDiv.style.top  = (tableDiv.offsetTop  + y) + "px";
    selectionRectangleDiv.style.width  = width  + "px";
    selectionRectangleDiv.style.height = height + "px";
    selectionRectangleDiv.style.display = "block";
  } else {
    selectionRectangleDiv.style.display = "none";
  }
}
function renderNumberBuffer() {
  var numberBufferDiv = document.getElementById("numberBufferDiv");
  if (numberTypingBuffer.length !== 0) {
    numberBufferDiv.textContent = numberTypingBuffer;
    numberBufferDiv.style.display = "block";
  } else {
    numberBufferDiv.style.display = "none";
  }
}
function resizeTableToFitEverything() {
  // don't shrink the scrollable area while we're holding the thing that causes it to shrink
  if (draggingMode === DRAG_MOVE_SELECTION) return;
  // at least this minimum size
  var maxX = 800;
  var maxY = 800;
  var padding = 8;
  for (var id in objectsById) {
    var object = objectsById[id];
    var x = object.x + object.width  + padding;
    var y = object.y + object.height + padding;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  }
  tableDiv.style.width  = maxX + "px";
  tableDiv.style.height = maxY + "px";
}

function snapToSnapZones(object, newProps) {
  if (object.floating) return false;
  var snapped = false;
  objectsWithSnapZones.sort(compareZ);
  for (var i = objectsWithSnapZones.length - 1; i >= 0; i--) {
    var containerObject = objectsWithSnapZones[i];
    var containerObjectDefinition = getObjectDefinition(containerObject.id);
    for (var j = 0; j < containerObjectDefinition.snapZones.length; j++) {
      var snapZoneDefinition = containerObjectDefinition.snapZones[j];
      var snapZoneX      = snapZoneDefinition.x          != null ? snapZoneDefinition.x          : 0;
      var snapZoneY      = snapZoneDefinition.y          != null ? snapZoneDefinition.y          : 0;
      var snapZoneWidth  = snapZoneDefinition.width      != null ? snapZoneDefinition.width      : containerObjectDefinition.width;
      var snapZoneHeight = snapZoneDefinition.height     != null ? snapZoneDefinition.height     : containerObjectDefinition.height;
      var cellWidth      = snapZoneDefinition.cellWidth  != null ? snapZoneDefinition.cellWidth  : snapZoneWidth;
      var cellHeight     = snapZoneDefinition.cellHeight != null ? snapZoneDefinition.cellHeight : snapZoneHeight;
      if (cellWidth  < object.width)  continue; // doesn't fit in the zone
      if (cellHeight < object.height) continue; // doesn't fit in the zone
      if (newProps.x >= containerObject.x + snapZoneX + snapZoneWidth)  continue; // way off right
      if (newProps.y >= containerObject.y + snapZoneY + snapZoneHeight) continue; // way off bottom
      if (newProps.x + object.width  <= containerObject.x + snapZoneX)  continue; // way off left
      if (newProps.y + object.height <= containerObject.y + snapZoneY)  continue; // way off top
      // this is the zone for us
      var relativeCenterX = newProps.x + object.width /2 - (containerObject.x + snapZoneX);
      var relativeCenterY = newProps.y + object.height/2 - (containerObject.y + snapZoneY);
      var modX = euclideanMod(relativeCenterX, cellWidth);
      var modY = euclideanMod(relativeCenterY, cellHeight);
      var divX = Math.floor(relativeCenterX / cellWidth);
      var divY = Math.floor(relativeCenterY / cellHeight);
      var newModX = clamp(modX, object.width /2, cellWidth  - object.width /2);
      var newModY = clamp(modY, object.height/2, cellHeight - object.height/2);

      var inBoundsX = 0 <= relativeCenterX && relativeCenterX < snapZoneWidth;
      var inBoundsY = 0 <= relativeCenterY && relativeCenterY < snapZoneHeight;
      if (!inBoundsX && !inBoundsY) {
        // on an outside corner. we need to pick an edge to rub.
        if (Math.abs(modX - newModX) > Math.abs(modY - newModY)) {
          // x is further off
          inBoundsX = true;
        } else {
          // y is further off
          inBoundsY = true;
        }
      }
      if (inBoundsY) newProps.x = divX * cellWidth  + newModX - object.width /2 + containerObject.x + snapZoneX;
      if (inBoundsX) newProps.y = divY * cellHeight + newModY - object.height/2 + containerObject.y + snapZoneY;
      //return true;
      snapped = true;
    }
  }
  return snapped;
}

function getObjects() {
  var objects = [];
  for (var objectId in objectsById) {
    objects.push(objectsById[objectId]);
  }
  return objects;
}
function getObjectsInZOrder() {
  var objects = [];
  objects.sort(compareZ);
  return objects;
}
function compareZ(a, b) {
  return operatorCompare(a.z, b.z);
}
function operatorCompare(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

function makeWebSocket() {
  //var host = location.host; // deployment
  var host = "127.0.0.1"; // local testing
  var pathname = location.pathname;
  var isHttps = location.protocol === "https:";
  var match = host.match(/^(.+):(\d+)$/);
  var defaultPort = isHttps ? 443 : 80;
  //var port = match ? parseInt(match[2], 10) : defaultPort; // deployment
  var port = "25407"; // local testing
  var hostName = match ? match[1] : host;
  var wsProto = isHttps ? "wss:" : "ws:";
  var wsUrl = wsProto + "//" + hostName + ":" + port + pathname;
  console.log(wsUrl);
  return new WebSocket(wsUrl);
}

function startGame() {
  var roomCodeToSend = roomCode;
  var gameName = ""
  if (roomCode != null) {
    roomCodeToSend = roomCode;
    setScreenMode(SCREEN_MODE_WAITING_FOR_ROOM_CODE_CONFIRMATION);
  } else {
    roomCodeToSend = "new";
    gameName = document.getElementById("selectGame").value;
    setScreenMode(SCREEN_MODE_WAITING_FOR_CREATE_ROOM);
  }
  sendMessage({
    cmd: "joinRoom",
    args: {
      roomCode: roomCodeToSend,
      gameName: gameName
    },
  });
}


var socket;
var isConnected = false;
function connectToServer() {
  setScreenMode(SCREEN_MODE_WAITING_FOR_SERVER_CONNECT);

  socket = makeWebSocket();
  socket.addEventListener('open', onOpen, false);
  socket.addEventListener('message', onMessage, false);
  socket.addEventListener('error', timeoutThenCreateNew, false);
  socket.addEventListener('close', timeoutThenCreateNew, false);

  function onOpen() {
    isConnected = true;
    console.log("connected");
    setScreenMode(SCREEN_MODE_LOGIN);
  }
  function onMessage(event) {
    var msg = event.data;
    if (msg === "keepAlive") return;
    console.log(msg);
    var message = JSON.parse(msg);
    if (screenMode === SCREEN_MODE_WAITING_FOR_ROOM_CODE_CONFIRMATION && message.cmd === "badRoomCode") {
      // nice try
      // disconnect();
      setScreenMode(SCREEN_MODE_JOIN_ROOM);
      // TODO: show message that says we tried
      return;
    }
    switch (screenMode) {
      case SCREEN_MODE_WAITING_FOR_CREATE_ROOM:
      case SCREEN_MODE_WAITING_FOR_ROOM_CODE_CONFIRMATION:
        if (message.cmd === "joinRoom") {
          setScreenMode(SCREEN_MODE_PLAY);
          roomCode = message.args.roomCode;
          myUser = {
            id: message.args.userId,
            username: message.args.username,
            role: message.args.role,
            loggedIn: true,
          };
          usersById[myUser.id] = myUser;
          message.args.users.forEach(function(otherUser) {
            usersById[otherUser.id] = otherUser;
          });
          initGame(message.args.game, message.args.history);
          renderUserList();
        } else throw asdf;
        break;
      case SCREEN_MODE_PLAY:
        if (message.cmd === "makeAMove" || message.cmd === "logMessage") {
          makeAMove(message.args, true);
        } else if (message.cmd === "userJoined") {
          if(usersById[message.args.id]) usersById[message.args.id].loggedIn = true;
          else usersById[message.args.id] = {
            id: message.args.id,
            username: message.args.username,
            role: message.args.role,
            loggedIn: message.args.loggedIn,
          };
          renderUserList();
        } else if (message.cmd === "userLeft") {
          usersById[message.args.id].loggedIn = false;
          renderUserList();
        } /*else if (message.cmd === "changeMyName") {
          usersById[message.args.id].username = message.args.username;
          renderUserList();
        }*/ else if (message.cmd === "changeMyRole") {
          if (message.args.id === ""){ //failed
            window.alert("That role has already been chosen and a different password set.");
            break;
          }
          usersById[message.args.id].role = message.args.role;
          renderUserList();
        }
        break;
      case SCREEN_MODE_LOGIN:
        if (message.cmd === "login") {
          document.getElementById("usernameReminder").innerHTML = "Logged in as " + message.args.username;
          var gameList = "<ul>";
          for (var i in message.args.gameList){
            var game = message.args.gameList[i];
            gameList += "<li> <input id=\"gameList"+game.id+"\"type=\"button\" class=\"largeTextButton\" value=\""+game.id+"\" onclick=\"roomCode='"+game.id+"'; startGame();\"> "+game.gameName+"<ul>";
            for (var p in game.players) gameList += "<li>" + p + ": " + (game.players[p] == "" ? "Spectator" : game.players[p]) + "</li>";
            gameList += "</ul></li>";
          }
          gameList += "</ul>";
          document.getElementById("gameList").innerHTML = gameList;
          setScreenMode(SCREEN_MODE_JOIN_ROOM);
        }
        if (message.cmd === "loginFailed") {
          document.getElementById("errorMessageDiv").innerHTML = message.args;
        }
        break;
      default: throw asdf;
    }
  }
  function timeoutThenCreateNew() {
    removeListeners();
    if (isConnected) {
      isConnected = false;
      console.log("disconnected");
      deleteTableAndEverything();
      setScreenMode(SCREEN_MODE_DISCONNECTED);
    }
    setTimeout(connectToServer, 1000);
  }
  function disconnect() {
    console.log("disconnect");
    removeListeners();
    socket.close();
    isConnected = false;
  }
  function removeListeners() {
    socket.removeEventListener('open', onOpen, false);
    socket.removeEventListener('message', onMessage, false);
    socket.removeEventListener('error', timeoutThenCreateNew, false);
    socket.removeEventListener('close', timeoutThenCreateNew, false);
  }
}

function sendMessage(message) {
  socket.send(JSON.stringify(message));
}
function backupServer(){
  sendMessage({cmd:"backup", args:""})
}

function makeAMove(move, shouldRender) {
  if(typeof move === "string"){ // it's just a log message
    document.getElementById("logContentsDiv").innerHTML += move;
    return;
  }

  addToLog(move);
  var objectsToRender = shouldRender ? [] : null;
  var i = 0;
  var userId = move[i++];
  var type = move[i++];
  //if (userId === myUser.id) return;
  while (i < move.length) {
    var object = objectsById[getIdFromIndex(move[i++])];
    /*var fromX         =      move[i++];
    var fromY         =      move[i++];
    var fromZ         =      move[i++];
    var fromFaceIndex =      move[i++];
    var fromLabel     =      move[i++];*/
    var   toX         =      move[i++];
    var   toY         =      move[i++];
    var   toZ         =      move[i++];
    var   toFaceIndex =      move[i++];
    var   toLabel     =      move[i++];
    var   toAngle     =      move[i++];

    if (shouldRender){
      var objectDiv = getObjectDiv(object.id);
      objectDiv.classList.remove("spinning");
      if(type == "roll" || (type=="shuffle" && object.x == toX && object.y == toY)){
        void objectDiv.offsetWidth; // trigger a reflow so it shows again
        objectDiv.classList.add("spinning");
      }
      objectsToRender.push(object);
    }

    object.x = toX;
    object.y = toY;
    object.z = toZ;
    object.faceIndex = toFaceIndex;
    object.label = toLabel;
    object.angle = toAngle;
    var newProps = selectedObjectIdToNewProps[object.id];
    if (newProps != null) {
      newProps.x = toX;
      newProps.y = toY;
      newProps.z = toZ;
      newProps.faceIndex = toFaceIndex;
      newProps.label = toLabel;
      newProps.angle = toAngle;
    }
  }

  if (shouldRender) {
    objectsToRender.forEach(function(object) {
      render(object, true);
    });
    renderOrder();
    resizeTableToFitEverything();
    fixFloatingThingZ();
  }
}

function addToLog(move){
  var i = 0;
  var userId = move[i++];
  var type = move[i++];

  // userID -> userRole is now handled by the server for other players
  var username = (userId === myUser.id) ? myUser.username + "(" + myUser.role + ")" : userId;

  var object = [];
  var fromX = [];
  var fromY = [];
  var fromZ = [];
  var fromFaceIndex = [];
  var fromLabel = [];
  var fromAngle = [];
  var toX = [];
  var toY = [];
  var toZ = [];
  var toFaceIndex = [];
  var toLabel = [];
  var toAngle = [];

  while(i<move.length){
    object.push(objectsById[getIdFromIndex(move[i++])]);
    fromX.push(object[object.length-1].x);
    fromY.push(object[object.length-1].y);
    fromZ.push(object[object.length-1].z);
    fromFaceIndex.push(object[object.length-1].faceIndex);
    fromLabel.push(object[object.length-1].label);
    fromAngle.push(object[object.length-1].angle);
    toX.push(move[i++]);
    toY.push(move[i++]);
    toZ.push(move[i++]);
    toFaceIndex.push(move[i++]);
    toLabel.push(move[i++]);
    toAngle.push(move[i++]);
  }

  if(object.length == 0) return;

  var output = "";
  switch (type) { // calculate change type:  Move (change x,y), Flip (change faceIndex), Roll (fromFaceIndex == -1), Shuffle (change z), Group (move all to same x,y), Label (change label)
    case "move":
      var prevX = -99999;
      var prevY = -99999;
      var num = 0;
      for(var i=0; i<=object.length; i++){ // if you have a group of objects at the same place, don't report them individually
        if(i == object.length || fromX[i] != prevX || fromY[i] != prevY){ // end of a group of colocated objects
          if(!isHidden(prevX, prevY) || (num > 0 && isHidden(prevX, prevY) != isHidden(toX[i-1], toY[i-1]))){ // report if it wasn't hidden or if it moved between two hidden zones
            if(num > 0) output += username + " moves ";
            if(num == 1) output += (object[i-1].faces.length == 2 && fromFaceIndex[i-1] == 1 ? "*****" : object[i-1].id);
            if(num > 1) output += num + " objects";
            if(num > 0) output += " from (" + prevX + ", " + prevY + ") to (" + toX[i-1] + ", " + toY[i-1] + ")<br>";
          }
          num = 0;
        }
        num ++;
        prevX = fromX[i];
        prevY = fromY[i];
      }
      break;
    case "flip":
      var prevX = -99999;
      var prevY = -99999;
      var num = 0;
      for(var i=0; i<=object.length; i++){ // if you have a group of objects at the same place, don't report them individually
        if(i == object.length || toX[i] != prevX || toY[i] != prevY){ // end of a group of colocated objects
          if(!isHidden(prevX, prevY)){
            if(num == 1){
              output += username + " flips " + object[i-1].id;
              if(object[i-1].faces.length > 2) output += " to " + (toFaceIndex[i-1]+1);
              output += "<br>";
            }
            if(num > 1){
              output += username + " flips " + num + " objects at (" + prevX + ", " + prevY + ")<br>";
            }
          }
          num = 0;
        }
        num ++;
        prevX = toX[i];
        prevY = toY[i];
      }
      break;
    case "roll":
      output += username + " rolls " + possiblyHiddenName(object[0]);
      for(var i=1; i<object.length; i++) output += ", " + possiblyHiddenName(object[i]);
      output += ":";
      for(var i=0; i<object.length; i++){
        output += " " + (isHidden(toX[0] + object[0].width/2, toY[0] + object[0].height/2) ? "?" : toFaceIndex[i]+1);
      }
      output += "<br>";
      break;
    case "shuffle":
      var minX = 99999;
      var maxX = -99999;
      var minY = 99999;
      var maxY = -99999;
      for(var i=0; i<object.length; i++){
        if (toX[i] < minX) minX = toX[i];
        if (toX[i] > maxX) maxX = toX[i];
        if (toY[i] < minY) minY = toY[i];
        if (toY[i] > maxY) maxY = toY[i];
      }
      output += username + " shuffles " + object.length + " objects ";
      if(minX == maxX && minY == maxY) output += "at (" + minX + ", " + minY + ")<br>";
      else output += "in (" + minX + " - " + maxX + ", " + minY + " - " + maxY + ")<br>";
      break;
    case "group":
      var tell=false;
      if(!isHidden(toX[0] + object[0].width/2, toY[0] + object[0].height/2) ) tell = true;
      for(var i=0; i<object.length; i++) if(!isHidden(fromX[i] + object[i].width/2, fromY[i] + object[i].height/2) ) tell = true;
      if(tell) output += username + " groups " + object.length + " objects at (" + toX[0] + ", " + toY[0] + ")<br>";
      break;
    case "label":
      for(var i=0; i<object.length; i++){
        if(isHidden(toX[i] + object[i].width/2, toY[i] + object[i].height/2) ) continue;
        output += username + " changes the label of " + object[i].id + " from " + fromLabel[i] + " to " + toLabel[i] + "<br>";
      }
      break;
    case "turn":
      var prevX = -99999;
      var prevY = -99999;
      var num = 0;
      for(var i=0; i<=object.length; i++){ // if you have a group of objects at the same place, don't report them individually
        if(i == object.length || toX[i] != prevX || toY[i] != prevY){ // end of a group of colocated objects
          if(!isHidden(prevX, prevY)){
            if(num == 1){
              output += username + " turns " + object[i-1].id + " from " + fromAngle[i-1] + " to " + toAngle[i-1] + "<br>";
            }
            if(num > 1){
              output += username + " turns " + num + " objects at (" + prevX + ", " + prevY + ")<br>";
            }
          }
          num = 0;
        }
        num ++;
        prevX = toX[i];
        prevY = toY[i];
      }
      break;
  }
  document.getElementById("logContentsDiv").innerHTML += output;
  document.getElementById("logContentsDiv").scrollTop += 20;
}

function isHidden(x, y, showMine = false){
  for (var i = 0; i < hiderContainers.length; i++) {
    var hiderContainer = hiderContainers[i];
    if (hiderContainer.x <= x && x <= hiderContainer.x + hiderContainer.width &&
        hiderContainer.y <= y && y <= hiderContainer.y + hiderContainer.height &&
        (!showMine || getObjectDefinition(hiderContainer.id).visionWhitelist.indexOf(myUser.role) === -1)) {
      return hiderContainer.id;
    }
  }
  return false;
}

/*function listGames(userId){
  if (!userId) userId = "";
  sendMessage({cmd: "listGames", args: userId});
}*/

function possiblyHiddenName(object){
  if (isHidden(object.x + object.width/2, object.y + object.height/2)) return "*****";
  return object.id;
}

function generateRandomId() {
  var result = "";
  for (var i = 0; i < 16; i++) {
    var n = Math.floor(Math.random() * 16);
    var c = n.toString(16);
    result += c;
  }
  return result;
}
function getObjectDiv(id) {
  return document.getElementById("object-" + id);
}
function getStackHeightDiv(id) {
  return document.getElementById("stackHeight-" + id);
}
function getBackgroundDiv(id) {
  return document.getElementById("background-" + id);
}
function setDivVisible(div, visible) {
  div.style.display = visible ? "block" : "none";
}

function sanitizeHtml(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;");
}
function euclideanMod(numerator, denominator) {
  return (numerator % denominator + denominator) % denominator;
}
function clamp(n, min, max) {
  if (n < min) return min;
  if (n > max) return max;
  return n;
}

connectToServer();
