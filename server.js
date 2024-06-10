const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const app = express();
const path = require("path");
const fetch = require("cross-fetch");
const { response } = require('express');

require("dotenv").config({ path: path.resolve(__dirname, 'credentials/.env') });

var spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: 'https://pokemonify.onrender.com/callback'
    // redirectUri: 'http://localhost:8888/callback'
  });

// 'http://localhost:8888/callback'
// https://pokemon-spotify.herokuapp.com/callback
// https://pokemonify.onrender.com/callback

app.set("views", path.resolve(__dirname, "templates"));
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));

// home page
app.get("/", (request, response) => {
  response.render("index");
});

/*
* from app.js provided by spotify -- this is for the state
*/
var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

let scopes = ['user-read-private', 'user-read-email', 'user-top-read'];
let state = generateRandomString(16);
let url = spotifyApi.createAuthorizeURL(scopes, state);

// console.log(url);

//login path
app.get('/login', function routeHandler(req, res) {
    res.redirect(url);
});

//callback path (from spotify callback uri)
app.get('/callback', async (req, res) => {

    let code = req.query.code || null;
    let code_str = "code: " + code + "\n";
    let err = false;
    //variables is sent when there is an error
    let err_string = "This Pokémon existed 300 million years ago.\nTeam Plasma altered it and attached a cannon to its back."
    err_string += "\nUnfortunately, this Pokémon only appears if there is an error!\nPlease wait a couple minutes before reloading this site."
    let variables = {
      "mood" : 0,
      "energy" : 0,
      "acoustic" : 0,
      "name": "Genesect",
      "flavor": err_string,
      "artwork": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/649.png",
      "type" : "BUG",
      "type_color": "bug",
      "type_2": "STEEL",
      "type_2_color": "steel",
      "display_second": "",
      "dex_num": "649",
      "prename": "a",
      "second_check": "2",
      "genera": "Paleozoic Pokemon"
    };

    // console.log(code_str);

    try {
      let data = await spotifyApi.authorizationCodeGrant(code);
      // Set the access token on the API object to use it in later calls
      spotifyApi.setAccessToken(data.body['access_token']);
      spotifyApi.setRefreshToken(data.body['refresh_token']);
    } catch (e) {
      err = true
      res.render("display", variables);
    }
    if(!err) {
      res.redirect('/result');
    }
  } 
);

//seperate endpoint so code will not show in the url
app.get('/result', async (req, res) => {
    //calculations to determine pokemon
    // console.log("access token in function: " + spotifyApi.getAccessToken());

    //variables_error is sent when there is an error
    let err_string = "This Pokémon existed 300 million years ago.\nTeam Plasma altered it and attached a cannon to its back."
    err_string += "\nUnfortunately, this Pokémon only appears if there is an error!\nPlease wait a couple minutes before reloading this site."

    let variables_error = {
      "mood" : 0,
      "energy" : 0,
      "acoustic" : 0,
      "name": "Genesect",
      "flavor": err_string,
      "artwork": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/649.png",
      "type" : "BUG",
      "type_color": "bug",
      "type_2": "STEEL",
      "type_2_color": "steel",
      "display_second": "",
      "dex_num": "649",
      "prename": "a",
      "second_check": "2",
      "genera": "Paleozoic Pokemon"
    };

    let error = false;

    let short_response = null;
    let medium_response = null;
    let long_response = null;

    let count = 0

    try {
      short_response = await spotifyApi.getMyTopTracks({time_range : "short_term", limit: 40});
      count += 1
    } catch (e) {
      console.log("ERROR GETTING SHORT RESPONSE");
      console.log(e);
    }

    try {
      medium_response = await spotifyApi.getMyTopTracks({time_range : "medium_term", limit: 50});
      count += 1
    } catch (e) {
      console.log("ERROR GETTING MEDIUM RESPONSE");
      console.log(e);
    }

    try {
      long_response = await spotifyApi.getMyTopTracks({time_range : "long_term", limit: 40});
      count += 1
    } catch (e) {
      console.log("ERROR GETTING LONG RESPONSE");
      console.log(e);
    }

    let short_arr = [];
    let medium_arr = [];
    let long_arr = [];
    let short_tracks = [];
    let medium_tracks = [];
    let long_tracks = [];

    if(short_response) {
      short_tracks = short_response.body.items;
      // console.log(short_tracks)
    }
    if (medium_response) {
      medium_tracks = medium_response.body.items;
    }
    if (long_response) {
      long_tracks = long_response.body.items;
    }

    for(const song of short_tracks) {
      short_arr.push(song["id"]);
    }

    for(const song of medium_tracks) {
      medium_arr.push(song["id"]);
    }

    for(const song of long_tracks) {
      long_arr.push(song["id"]);
    }

    let short_features_response;
    let medium_features_response;
    let long_features_response;

    try {
      if(short_arr.length) {
        // console.log("short: " + short_arr.length);
        short_features_response = await spotifyApi.getAudioFeaturesForTracks(short_arr);
      }
      if(medium_arr.length) {
        // console.log("mediu: " + medium_arr.length);
        medium_features_response = await spotifyApi.getAudioFeaturesForTracks(medium_arr);
      }
      if(long_arr.length) {
        // console.log("large: " + long_arr.length);
        long_features_response = await spotifyApi.getAudioFeaturesForTracks(long_arr);
      }
    } catch (e) {
      console.log("ERROR FETCHING AUDIO FEATURES");
      console.log(e);
      error = true;
    }

    let short_mood = 0;
    let medium_mood = 0;
    let long_mood = 0;

    let short_energy= 0;
    let medium_energy = 0;
    let long_energy = 0;

    let short_acoustic= 0;
    let medium_acoustic = 0;
    let long_acoustic = 0;

    if(short_arr.length) {
      for (const song of short_features_response.body.audio_features) {
        short_mood += song["valence"] + song["mode"];
        short_energy += song["energy"] + song["danceability"];
        short_acoustic += song["acousticness"];
        if (song["tempo"] < 108) {
          short_energy += song["tempo"] / 108;
        } else if (song["tempo"] >= 108) {
          short_energy += 1;
        }
      }
  
      short_mood /= short_features_response.body.audio_features.length;
      short_energy /= short_features_response.body.audio_features.length;
      short_acoustic /= short_features_response.body.audio_features.length;
    }

    if(medium_arr.length) {
      for (const song of medium_features_response.body.audio_features) {
        medium_mood += song["valence"] + song["mode"];
        medium_energy += song["energy"] + song["danceability"];
        medium_acoustic += song["acousticness"];
        if (song["tempo"] < 108) {
          medium_energy += song["tempo"] / 108;
        } else if (song["tempo"] >= 108) {
          medium_energy += 1;
        }
      }
  
      medium_mood /= medium_features_response.body.audio_features.length;
      medium_energy /= medium_features_response.body.audio_features.length;
      medium_acoustic /= medium_features_response.body.audio_features.length;
    }

    if(long_arr.length) {
      for (const song of long_features_response.body.audio_features) {
        long_mood += song["valence"] + song["mode"];
        long_energy += song["energy"] + song["danceability"];
        long_acoustic += song["acousticness"];
        if (song["tempo"] < 108) {
          long_energy += song["tempo"] / 108;
        } else if (song["tempo"] > 108) {
          long_energy += 1;
        }
      }
  
      long_mood /= long_features_response.body.audio_features.length;
      long_energy /= long_features_response.body.audio_features.length;
      long_acoustic /= long_features_response.body.audio_features.length;
    }

    // console.log("smth wrong here at avg");

    let avg_mood = count == 0 ? 0 : (short_mood + medium_mood + long_mood) / count;
    let avg_energy = count == 0 ? 0 : (short_energy + medium_energy + long_energy) / count;
    let avg_acoustic = count == 0 ? 0 : (short_acoustic + medium_acoustic + long_acoustic) / count;
    let type = "";
    let name = "";

    if((avg_mood + avg_energy + avg_acoustic) == 0) {
      name = "ditto"
    } else {
      type = get_type(avg_mood, avg_energy, avg_acoustic);
      name = get_pokemon(avg_energy, avg_mood, type);

      // type = get_type(medium_mood, medium_energy, medium_acoustic);
      // name = get_pokemon(medium_energy, medium_mood, type);
      // let test_name = "groudon"
      // name = test_name
    }

    // console.log("here at least");

    let prename = "a";

    vowels = ['a', 'e', 'i', 'o', 'u'];
    if(vowels.includes(name.charAt(0))) {
      prename = "an"
    }

    let species_name = name;
    let official_name = name.charAt(0).toUpperCase() + name.slice(1);
    //species link gets json with flavor text (use omega ruby flavor texts)
    //poke link gets artwork
    //species link does not work with shaymin-sky or vulpix-alola

    if (name.toLowerCase() === "shaymin-sky") {
      species_name = "shaymin";
    } else if (name.toLowerCase() === "vulpix-alola") {
      species_name = "vulpix";
      official_name = "Alolan Vulpix";
    }

    let species_link = "https://pokeapi.co/api/v2/pokemon-species/" + species_name;
    let poke_link = "https://pokeapi.co/api/v2/pokemon/" + name;

    // console.log(species_link);
    // console.log(poke_link);

    let species_call;
    let species;
    let poke_call;
    let poke;
    let flavor = "";
    let artwork = "";
    let dex_num = -1;

    let type_1 = ""
    let type_2 = ""
    let second_check = "3"

    let display = "display: none;"
    let genera = ""

    try {
      species_call = await fetch(species_link);
      species = await species_call.json();
      poke_call = await fetch(poke_link);
      poke = await poke_call.json();
    } catch (e) {
      console.log("ERROR USING POKEMON LINKS TO FETCH JSON");
      console.log(e);
      error = true;
    }

    if(!error) {
      let rand_val = Math.random() * (4096 - 1) + 1;

      if(rand_val == 151) {
        artwork = poke.sprites.other["official-artwork"].front_shiny;
      } else {
        artwork = poke.sprites.other["official-artwork"].front_default;
      }

      dex_num = species.pokedex_numbers[0].entry_number;

      type_1 = poke.types[0]["type"]["name"]
      if(Object.keys(poke.types).length == 2) {
        type_2 = poke.types[1]["type"]["name"]
        second_check = "2"
        console.log("TYPE 2: " + type_2)
        display = ""
      }
  
      if(species_name === "vulpix") {
        flavor += "In hot weather, this Pokémon makes ice shards with its six tails and sprays them around to cool itself off.";
      } else {
        //get most recent english flavor text
        for(var i = species.flavor_text_entries.length - 1; i >= 0; i--) {
          if(species.flavor_text_entries[i].language.name === "en") {
            flavor += species.flavor_text_entries[i].flavor_text;
            break;
          }
        }
      }
      console.log(genera)
      genera = species.genera[7]["genus"]
    }

    let variables = {
      "mood" : avg_mood,
      "energy" : avg_energy,
      "acoustic" : avg_acoustic,
      "name": official_name,
      "flavor": flavor,
      "artwork": artwork,
      "type" : type_1.toUpperCase(),
      "type_color": type_1,
      "type_2": type_2.toUpperCase(),
      "type_2_color": type_2,
      "display_second": display,
      "dex_num": dex_num,
      "prename": prename,
      "second_check": second_check,
      "genera": genera
    };

    if(error) {
      variables = variables_error;
    }

    res.render("display", variables);
});

//------------------------------------------------------------------

//helper functions to determine what pokemon will be assigned
function get_type(avg_mood, avg_energy, avg_acoustic) {
  if (avg_mood < 1) {
    if (avg_energy < 1.9) { //ghost and ice
      if(avg_acoustic < 0.35) { //ghost
        return "ghost";
      } else { //ice
        return "ice";
      }
    } else if (avg_energy >= 1.9 && avg_energy < 2.3) { //poison and dragon
      if(avg_acoustic < 0.35) { //poison
        return "poison";
      } else { //dragon
        return "dragon";
      }
    } else { //dark and psychic
      if(avg_acoustic < 0.35) { //dark
        return "dark";
      } else { //psychic
        return "psychic";
      }
    }
  } else if (avg_mood >= 1 && avg_mood < 1.3) {
    if (avg_energy < 1.9) { //grass and steel
      if(avg_acoustic < 0.35) { //steel
        return "steel";
      } else { //grass
        return "grass";
      }
    } else if (avg_energy >= 1.9 && avg_energy < 2.3) { //normal and water
      if(avg_acoustic < 0.35) { //water
        return "water";
      } else { //normal
        return "normal";
      }
    } else { //fire and fighting
      if(avg_acoustic < 0.35) { //fire
        return "fire";
      } else { //fighting
        return "fighting";
      }
    }
  } else {
    if (avg_energy < 1.9) { //ground and rock
      if(avg_acoustic < 0.35) { //rock
        return "rock";
      } else { //ground
        return "ground";
      }
    } else if (avg_energy >= 1.9 && avg_energy < 2.3) { //bug and fairy
      if(avg_acoustic < 0.35) { //bug
        return "bug";
      } else { //fairy
        return "fairy";
      }
    } else { //electric and flying
      if(avg_acoustic < 0.35) { //electric
        return "electric";
      } else { //flying
        return "flying";
      }
    }
  }
}

function get_pokemon(avg_energy, avg_mood, type) {
  switch (type) {
    case "dark":
      if (avg_energy > 2.5) {
        if (avg_mood > 0.8) { //E+, M+
          return "honchkrow";
        } else { //E+, M-
          return "umbreon";
        }
      } else {
        if (avg_mood > 0.8) { //E-, M+
          return "absol";
        } else { //E-, M-
          return "zorua";
        }
      }
    case "psychic":
      if (avg_energy > 2.5) {
        if (avg_mood > 0.8) { //E+, M+
          return "wynaut";
        } else { //E+, M-
          return "espeon";
        }
      } else {
        if (avg_mood > 0.8) { //E-, M+
          return "mew";
        } else { //E-, M-
          return "abra";
        }
      }
    case "poison":
      if (avg_energy > 2.1) {
        if (avg_mood > 0.8) { //E+, M+
          return "crobat";
        } else { //E+, M-
          return "toxicroak";
        }
      } else {
        if (avg_mood > 0.8) { //E-, M+
          return "ekans";
        } else { //E-, M-
          return "stunky";
        }
      }
    case "dragon":
      if (avg_energy > 2.1) {
        if (avg_mood > 0.8) { //E+, M+
          return "latias";
        } else { //E+, M-
          return "latios";
        }
      } else {
        if (avg_mood > 0.8) { //E-, M+
          return "dragonite";
        } else { //E-, M-
          return "kingdra";
        }
      }
    case "ghost":
      if (avg_energy > 1.6) {
        if (avg_mood > 0.8) { //E+, M+
          return "phantump";
        } else { //E+, M-
          return "chandelure";
        }
      } else {
        if (avg_mood > 0.8) { //E-, M+
          return "gengar";
        } else { //E-, M-
          return "rotom";
        }
      }
    case "ice":
      if (avg_energy > 1.6) {
        if (avg_mood > 0.8) { //E+, M+
          return "vulpix-alola"; //troubleshoot vulpix
        } else { //E+, M-
          return "glaceon";
        }
      } else {
        if (avg_mood > 0.8) { //E-, M+
          return "amaura";
        } else { //E-, M-
          return "swinub";
        }
      }
    case "fire":
      if (avg_energy > 2.5) {
        if (avg_mood > 1.15) { //E+, M+
          return "charmander";
        } else { //E+, M-
          return "cyndaquil";
        }
      } else {
        if (avg_mood > 1.15) { //E-, M+
          return "chimchar";
        } else { //E-, M-
          return "torchic";
        }
      }
    case "fighting":
      if (avg_energy > 2.5) {
        if (avg_mood > 1.15) { //E+, M+
          return "mienshao";
        } else { //E+, M-
          return "lucario";
        }
      } else {
        if (avg_mood > 1.15) { //E-, M+
          return "riolu";
        } else { //E-, M-
          return "machop";
        }
      }
    case "normal":
      if (avg_energy > 2.1) {
        if (avg_mood > 1.15) { //E+, M+
          return "eevee";
        } else { //E+, M-
          return "meowth";
        }
      } else {
        if (avg_mood > 1.15) { //E-, M+
          return "bidoof";
        } else { //E-, M-
          return "snorlax";
        }
      }
    case "water":
      if (avg_energy > 2.1) {
        if (avg_mood > 1.15) { //E+, M+
          return "squirtle";
        } else { //E+, M-
          return "piplup";
        }
      } else {
        if (avg_mood > 1.15) { //E-, M+
          return "lapras";
        } else { //E-, M-
          return "vaporeon";
        }
      }
    case "grass":
      if (avg_energy > 1.6) {
        if (avg_mood > 1.15) { //E+, M+
          return "shaymin-sky"; //troubleshoot shaymin
        } else { //E+, M-
          return "bulbasaur";
        }
      } else {
        if (avg_mood > 1.15) { //E-, M+
          return "turtwig";
        } else { //E-, M-
          return "celebi";
        }
      }
    case "steel":
      if (avg_energy > 1.6) {
        if (avg_mood > 1.15) { //E+, M+
          return "magnemite"; 
        } else { //E+, M-
          return "mawile";
        }
      } else {
        if (avg_mood > 1.15) { //E-, M+
          return "jirachi";
        } else { //E-, M-
          if(avg_mood - 1.13 < 0.01 && avg_mood - 1.13 > 0) {
            return "dialga";
          }
          return "skarmory";
        }
      }
    case "electric":
      if (avg_energy > 2.5) {
        if (avg_mood > 1.45) { //E+, M+
          return "shinx";
        } else { //E+, M-
          return "pikachu";
        }
      } else {
        if (avg_mood > 1.45) { //E-, M+
          return "raichu";
        } else { //E-, M-
          return "pichu";
        }
      }
    case "flying":
      if (avg_energy > 2.5) {
        if (avg_mood > 1.45) { //E+, M+
          return "staravia";
        } else { //E+, M-
          return "fletchling";
        }
      } else {
        if (avg_mood > 1.45) { //E-, M+
          return "togekiss";
        } else { //E-, M-
          return "pidgey";
        }
      }
    case "bug":
      if (avg_energy > 2.1) {
        if (avg_mood > 1.45) { //E+, M+
          return "butterfree";
        } else { //E+, M-
          return "scyther";
        }
      } else {
        if (avg_mood > 1.45) { //E-, M+
          return "beautifly";
        } else { //E-, M-
          return "paras";
        }
      }
    case "fairy":
      if (avg_energy > 2.1) {
        if (avg_mood > 1.45) { //E+, M+
          return "sylveon";
        } else { //E+, M-
          return "jigglypuff";
        }
      } else {
        if (avg_mood > 1.45) { //E-, M+
          return "gardevoir";
        } else { //E-, M-
          return "clefairy";
        }
      }
    case "ground":
      if (avg_energy > 1.6) {
        if (avg_mood > 1.45) { //E+, M+
          return "diglett";
        } else { //E+, M-
          return "flygon";
        }
      } else {
        if (avg_mood > 1.45) { //E-, M+
          return "phanpy";
        } else { //E-, M-
          return "sandshrew";
        }
      }
    case "rock":
      if (avg_energy > 1.6) {
        if (avg_mood > 1.45) { //E+, M+
          return "geodude";
        } else { //E+, M-
          return "rockruff";
        }
      } else {
        if (avg_mood > 1.45) { //E-, M+
          return "rhyhorn";
        } else { //E-, M-
          return "onix";
        }
      }
    default: 
      return "arceus";
  }
}

// app.get('/refresh', function routeHandler(req, res) {});

console.log('Listening on 8888');
app.listen(process.env.PORT || 8888);










