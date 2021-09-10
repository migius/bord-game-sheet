//GESTIONE SINGOLO

// Set up our HTTP request
var xhrDetail = new XMLHttpRequest();

var datiGioco = null, json_datiGioco = null;

// Setup our listener to process completed requests
xhrDetail.onload = function () {
    // Process our return data
    if (xhrDetail.status >= 200 && xhrDetail.status < 300) {
        // What do when the request is successful
        console.log("success!", xhrDetail);
        //parser = new DOMParser();
        //xmlDoc = parser.parseFromString(xhr.responseXml,"text/xml");
        updateGioco(xhrDetail.responseXML);
    } else {
        // What do when the request fails
        console.log("The request failed!");
    }

    // Code that should run regardless of the request status
    console.log("This always runs...");
};


function loadGioco(id) {

    // Create and send a GET request
    // The first argument is the post type (GET, POST, PUT, DELETE, etc.)
    // The second argument is the endpoint URL
    url = "https://api.geekdo.com/xmlapi2/thing?id=";
    //difficolta
    url += encodeURI(id);

    xhrDetail.open("GET", url);
    xhrDetail.send();
}

function infoInRiga(datiGioco)
{
    //es. Autori: Isaac Childres | Artisti: Alexandr Elichev, Josh T. McDowell, Alvaro Nebot | Giocatori: 1-4 | Durata: 60-120′ | Età: 14+ | Editore: Asmodee Italia
 
    stringa = "";

    if(datiGioco.link.filter(function(link){return link["@type"] === "boardgamedesigner";}).length > 1)
        stringa += "Autori: ";
    else
        stringa += "Autore: ";

    stringa += datiGioco.link.filter(function(link){return link["@type"] === "boardgamedesigner";}).map(function(c){return c["@value"];}).join(", ");



    stringa += " | ";

    if(datiGioco.link.filter(function(link){return link["@type"] === "boardgameartist";}).length > 1)
        stringa += "Artisti: ";
    else
        stringa += "Artista: ";

    stringa += datiGioco.link.filter(function(link){return link["@type"] === "boardgameartist";}).map(function(c){return c["@value"];}).join(", ");


    stringa += " | ";
    stringa += "Giocatori: ";
    stringa += datiGioco.minplayers["@value"];

    if(datiGioco.maxplayers["@value"] !== datiGioco.minplayers["@value"])
        stringa += "-" + datiGioco.maxplayers["@value"];


    stringa += " | ";
    stringa += "Durata: ";
    stringa += datiGioco.minplaytime["@value"] + "'";

    if(datiGioco.maxplaytime["@value"] !== datiGioco.minplaytime["@value"])
        stringa += "-" + datiGioco.maxplaytime["@value"] + "'";
    


    stringa += " | ";
    stringa += "Età: ";

    stringa += datiGioco.minage["@value"] + "+";


    stringa += " | ";

    if(datiGioco.link.filter(function(link){return link["@type"] === "boardgamepublisher";}).length > 1)
        stringa += "Editori: ";
    else
        stringa += "Editore: ";

    stringa += datiGioco.link.filter(function(link){return link["@type"] === "boardgamepublisher";}).map(function(c){return c["@value"];}).join(", ");

    return stringa;
}

function getURL(datiGioco)
{
    stringa = "<a href=https://boardgamegeek.com/boardgame/" + datiGioco["@id"] +  " targe=_blank>" + datiGioco.name["@value"] + "</a>";
 
    return stringa;
}

function getImage(datiGioco)
{
    stringa = "<img href=" + datiGioco["thumbnail"] + " />";

    stringa += "<img href=" + datiGioco["image"] + " />";
 
    return stringa;
}



function updateGioco(data)
{
    json_datiGioco = xml2json(data).replace("undefined","");    
    datiGioco = JSON.parse(json_datiGioco).items.item;

    if(datiGioco.name["@value"] !== undefined)
        document.getElementsByClassName("name")[0].innerText = datiGioco.name["@value"];
    else
        document.getElementsByClassName("name")[0].innerText = datiGioco.name.filter(function(n){ return n["@type"] == "primary"; })[0]["@value"];
/*
    if(datiGioco.link.filter(function(link){return link["@type"] === "boardgamedesigner";}).length > 1)
        document.getElementsByClassName("designer")[0].innerText = "Autori: ";
    else
        document.getElementsByClassName("designer")[0].innerText = "Autore: ";*/

    document.getElementsByClassName("designer")[0].innerText = " " + datiGioco.link.filter(function(link){return link["@type"] === "boardgamedesigner";}).map(function(c){return c["@value"];}).join(", ");
/*
    if(datiGioco.link.filter(function(link){return link["@type"] === "boardgameartist";}).length > 1)
        document.getElementsByClassName("artist")[0].innerText = "Illustratori: ";
    else
        document.getElementsByClassName("artist")[0].innerText = "Illustratore: ";*/

    document.getElementsByClassName("artist")[0].innerText = " " + datiGioco.link.filter(function(link){return link["@type"] === "boardgameartist";}).map(function(c){return c["@value"];}).join(", ");
/*
    if(datiGioco.link.filter(function(link){return link["@type"] === "boardgamepublisher";}).length > 1)
        document.getElementsByClassName("publisher")[0].innerText = "Editori: ";
    else
        document.getElementsByClassName("publisher")[0].innerText = "Editore: ";*/

    document.getElementsByClassName("publisher")[0].innerText = " " + datiGioco.link.filter(function(link){return link["@type"] === "boardgamepublisher";}).map(function(c){return c["@value"];}).join(", ");

    document.getElementsByClassName("player-count")[0].innerText = datiGioco.minplayers["@value"];

    if(datiGioco.maxplayers["@value"] !== datiGioco.minplayers["@value"])
        document.getElementsByClassName("player-count")[0].innerText += "-" + datiGioco.maxplayers["@value"];

    document.getElementsByClassName("player-count")[0].innerText += " giocatori";

    document.getElementsByClassName("length")[0].innerText = datiGioco.minplaytime["@value"];

    if(datiGioco.maxplaytime["@value"] !== datiGioco.minplaytime["@value"])
        document.getElementsByClassName("length")[0].innerText += "-" + datiGioco.maxplaytime["@value"];

    document.getElementsByClassName("length")[0].innerText += " minuti";

    document.getElementsByClassName("age")[0].innerText = datiGioco.minage["@value"] + "+";


    document.getElementsByClassName("info-text")[0].innerText = infoInRiga(datiGioco);
    
    document.getElementsByClassName("game-url")[0].innerHTML = getURL(datiGioco);
    document.getElementsByClassName("game-img")[0].innerHTML = getImage(datiGioco);


/*
    <h3 id=name>Nome gioco</h3>
    <p>Autore: <span id=designer>Xxxxx Yyyyy</span></p>
    <p>Illustratore: <span id=artist>Xxxxx Yyyyy</span></p>
    <p>Editore: <span id=publisher>Zzzzzzz</span></p>
    <p>Numero di giocatori: <span id=player-count>2-4</span></p>
    <p>Durata: <span durata=length>30-60 min</span></p>
    <p>Età: <span id=age>10+</span></p>
    <p>Prezzo: <span id=price>9,99 €</span></p>*/
    ValorizzaCode();
}    

function GiocoSelezionato()
{        
    var selectGioco = document.getElementById('selectGioco');
    loadGioco(selectGioco.value);
}







































//GESTIONE LISTA




// Set up our HTTP request
var xhr = new XMLHttpRequest();

// Setup our listener to process completed requests
xhr.onload = function () {
    // Process our return data
    if (xhr.status >= 200 && xhr.status < 300) {
        // What do when the request is successful
        console.log("success!", xhr);
        //parser = new DOMParser();
        //xmlDoc = parser.parseFromString(xhr.responseXml,"text/xml");
        updateGiochi(xhr.responseXML);
    } else {
        // What do when the request fails
        console.log("The request failed!");
    }

    // Code that should run regardless of the request status
    console.log("This always runs...");
};

function loadGiochi() {

    var stringaGioco =  document.getElementById("giocoColl").value;
    
    if(stringaGioco.length < 3) return;

    // Create and send a GET request
    // The first argument is the post type (GET, POST, PUT, DELETE, etc.)
    // The second argument is the endpoint URL
    url = "https://api.geekdo.com/xmlapi2/search?type=boardgame&query=";
    //difficolta
    url += encodeURI(stringaGioco);

    xhr.open("GET", url);
    xhr.send();
}

function updateGiochi(data)
{
    var giochi =  Array.from(data.documentElement.children);
    
    var selectGioco = document.getElementById('selectGioco');
    
    //svuoto
    var length = selectGioco.options.length;
    for (i = length-1; i >= 0; i--) {
      selectGioco.options[i] = null;
    }
    
    //aggiungo
    for(var i = 0, l = giochi.length; i < l; i++){
      selectGioco.options.add( new Option(giochi[i].children[0]?.attributes["value"]?.value + " (" + giochi[i].children[1]?.attributes["value"]?.value + ")" , giochi[i].id, false) );
    }
    GiocoSelezionato();
}














//UTILITY EXPORT

function nodeToString ( node ) {
   var tmpNode = document.createElement( "div" );
   tmpNode.appendChild( node.cloneNode( true ) );
   var str = tmpNode.innerHTML;
   tmpNode = node = null; // prevent memory leaks in IE
   return str;
}

function ValorizzaCode() {
    var escapedStr = nodeToString(document.getElementsByClassName("game-box")[0]);//.replace( "<" , "&lt;" ).replace( ">" , "&gt;");
    document.getElementById("code").value = escapedStr;
}








