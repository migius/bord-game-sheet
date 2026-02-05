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
        main.updateGioco(xhrDetail.responseXML);
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
    url = "https://geekpizza.altervista.org/@PizzaMeepleBot/Functions/dettaglio.php?id=";
    //difficolta
    url += encodeURI(id);

    xhrDetail.open("GET", url);
    xhrDetail.send();
}


function getImage(datiGioco)
{
    stringa = "<img src='" + datiGioco["thumbnail"] + "' />";

    stringa += "<img src='" + datiGioco["image"] + "' />";
 
    return stringa;
}
 

function GiocoSelezionato()
{        
    var selectGioco = document.getElementById('selectGioco');
    main.id = selectGioco.value;
    loadGioco(selectGioco.value);
}



var main = new Vue({
    el: '#main',
    data: {
        id: 0,
        gameName: "Nome gioco",
        designer: ["designer"],
        designerJoin: "designer",
        artist: ["artist"],
        artistJoin: "artist",
        publisher: ["publisher"],
        publisherJoin: "publisher",
        minplayers: 0,
        maxplayers: 100,
        minplaytime: 0,
        maxplaytime: 360,
        minage: 0,
        price: "",
        thumbnail: "",
        thumbnail_static: "",
        image: ""
    },
    computed: {
        infoInRiga: function(){                    
            //es. Autori: Isaac Childres | Artisti: Alexandr Elichev, Josh T. McDowell, Alvaro Nebot | Giocatori: 1-4 | Durata: 60-120′ | Età: 14+ | Editore: Asmodee Italia
         
            let components = [];

            if(this.designer.length > 0)
            {
                let stringa = "";

                if(this.designer.length > 1)
                    stringa += "Autori: ";
                else
                    stringa += "Autore: ";

                stringa += this.designerJoin;

                components.push(stringa)
            }

            if(this.artist.length > 0)
            {
                let stringa = "";

                if(this.artist.length > 1)
                    stringa += "Artisti: ";
                else
                    stringa += "Artista: ";

                stringa += this.artistJoin;      
                components.push(stringa)          
            }

            components.push("Giocatori: " + this.players);

            components.push("Durata: " + this.playtime);

            components.push("Età: " + this.minage + "+");

            if(this.publisher.length > 0)
            {
                let stringa = "";

                if(this.publisher.length > 1)
                    stringa += "Editori: ";
                else
                    stringa += "Editore: ";

                stringa += this.publisherJoin;      
                components.push(stringa)          
            }

            return components.join(" | ");      
        },
        players: function(){
            return this.minplayers + (this.minplayers !== this.maxplayers ? "-" + this.maxplayers : "");
        },
        playtime: function(){
            return this.minplaytime + (this.minplaytime !== this.maxplaytime ? "-" + this.maxplaytime : "")
        },
        sheetImage: function(){
            return "https://geekpizza.altervista.org/@PizzaMeepleBot/Images/schedagioco/?" + 
                "t=" + encodeURIComponent(this.gameName) + 
                "&a=" + encodeURIComponent(this.designerJoin) + 
                "&i=" + encodeURIComponent(this.artistJoin) + 
                "&e=" + encodeURIComponent(this.publisherJoin) + 
                "&m=" + this.players + 
                "&n=" + this.playtime +
                "&l=" + this.minage + 
                "&p=" + this.price + 
                "&j=" + this.thumbnail; 
        }
    },
    methods: { 
        loadDummy: function(){
            //todo

        },
        updateGioco: function(gameData)
        {
            try {
                // Convert XML to JSON with better error handling
                json_datiGioco = xml2json(gameData);
                
                // Remove "undefined" strings at the beginning
                json_datiGioco = json_datiGioco.replace(/^undefined/g, '');
                
                // Remove undefined in the middle of the JSON
                json_datiGioco = json_datiGioco.replace(/"undefined"/g, '""');
                
                // Also handle potential trailing commas that break JSON
                json_datiGioco = json_datiGioco.replace(/,(\s*[}\]])/g, '$1');
                
                console.log("JSON string:", json_datiGioco);
                
                datiGioco = JSON.parse(json_datiGioco).items.item;
                
                // Handle game name - check if it's an array or object
                if (Array.isArray(datiGioco.name)) {
                    // If it's an array, find the primary name
                    var primaryName = datiGioco.name.find(function(n){ return n["@type"] == "primary"; });
                    this.gameName = primaryName ? primaryName["@value"] : datiGioco.name[0]["@value"];
                } else if (datiGioco.name && datiGioco.name["@value"]) {
                    // If it's a single object with @value
                    this.gameName = datiGioco.name["@value"];
                } else {
                    this.gameName = "Nome non disponibile";
                }

                // Handle links - ensure it's always an array
                var links = Array.isArray(datiGioco.link) ? datiGioco.link : [datiGioco.link];
                
                this.designer = links.filter(function(link){return link && link["@type"] === "boardgamedesigner";}).map(function(c){return c["@value"];});            
                this.designerJoin = this.designer.join(", ");
                
                this.artist = links.filter(function(link){return link && link["@type"] === "boardgameartist";}).map(function(c){return c["@value"];});
                this.artistJoin = this.artist.join(", ");
                
                this.publisher = links.filter(function(link){return link && link["@type"] === "boardgamepublisher";}).map(function(c){return c["@value"];});
                this.publisherJoin = this.publisher.join(", ");

                this.minplayers = datiGioco.minplayers ? datiGioco.minplayers["@value"] : 0;
                this.maxplayers = datiGioco.maxplayers ? datiGioco.maxplayers["@value"] : 0;

                this.minplaytime = datiGioco.minplaytime ? datiGioco.minplaytime["@value"] : 0;
                this.maxplaytime = datiGioco.maxplaytime ? datiGioco.maxplaytime["@value"] : 0;

                this.minage = datiGioco.minage ? datiGioco.minage["@value"] : 0;

                this.thumbnail = datiGioco["thumbnail"] || "";
                this.thumbnail_static = datiGioco["thumbnail"] || "";
                this.image = datiGioco["image"] || "";

                ValorizzaCode();
                
            } catch (error) {
                console.error("Errore nel parsing dei dati del gioco:", error);
                console.error("JSON problematico:", json_datiGioco);
                alert("Errore nel caricamento dei dati del gioco. Controlla la console per dettagli.");
            }
        }   
    },
    beforeCreate: function(){
        console.log("beforeCreate");
    },
    created: function(){
        console.log("created");
        console.log("end created");
    },
    mounted: function(){
        console.log("mounted");
        //after all loaded
        this.$nextTick(function() {
            console.log("nextTick");
            console.log("end nextTick");
        });
    }
});

Vue.directive('visible', (el, bind) => {
    el.style.visibility=(!!bind.value) ? 'visible' : 'hidden';});







































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

    url = "https://geekpizza.altervista.org/@PizzaMeepleBot/Functions/search.php?query=";
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
