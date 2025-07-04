const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const app = express();
const path = require("path");
const fetch = require("cross-fetch");
const { response } = require('express');
const typeDescriptions = require('./types.js')
const { get_type, get_pokemon } = require('./assign');

// import firebase shtuff
const { initializeApp } = require('firebase/app');
const { collection, addDoc, increment, getFirestore, doc, updateDoc, setDoc, getDoc } = require('firebase/firestore');

require("dotenv").config({ path: path.resolve(__dirname, 'credentials/.env') });

// firebase initialization and firestore reference
const firebase_app = initializeApp(firebaseConfig);
const db = getFirestore(firebase_app);

var spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: 'https://pokemonify.onrender.com/callback'
    // redirectUri: 'http://localhost:8888/callback'
  });

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
    err_string += "\nUnfortunately, this Pokémon only appears if there is an error!\nPlease go back to the home page and log in again."
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
      "genera": "Paleozoic Pokemon",
      "type_category": "bug",
      "type_category_color": "BUG",
      "first_insight": typeDescriptions["bug"][0],
      "second_insight": typeDescriptions["bug"][1]
    };

    // console.log(code_str);

    try {
      let data = await spotifyApi.authorizationCodeGrant(code);
      // Set the access token on the API object to use it in later calls
      spotifyApi.setAccessToken(data.body['access_token']);
      // console.log(data.body['access_token'])
      spotifyApi.setRefreshToken(data.body['refresh_token']);
    } catch (e) {
      err = true
      res.render("display", variables);
    }
    if(!err) {
      let strings = `${spotifyApi.getAccessToken()}${spotifyApi.getRefreshToken()}`
      res.redirect(`/result/${strings}`)
      // res.redirect('/result');
    }
  } 
);

//seperate endpoint so code will not show in the url
app.get('/result/:id', async (req, res) => {
    //calculations to determine pokemon
    // console.log("access token in function: " + spotifyApi.getAccessToken());

    try {
      let x = spotifyApi.getAccessToken()
      let y = spotifyApi.getRefreshToken()
    } catch (e) {
      console.log(e)
    }

    //if these are undefined, just log in again.
    if(!spotifyApi.getAccessToken() || !spotifyApi.getAccessToken()) {
      res.redirect("/login")
      return;
    }

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
      "genera": "Paleozoic Pokemon",
      "type_category": "bug",
      "type_category_color": "BUG",
      "first_insight": typeDescriptions["bug"][0],
      "second_insight": typeDescriptions["bug"][1]
    };

    let error = false;

    let short_response = null;
    let medium_response = null;
    let long_response = null;

    let count = 0

    //any random uncaught errors will be caught by this overarching try catch block
    try {
      try {
        short_response = await spotifyApi.getMyTopTracks({time_range : "short_term", limit: 50});
        count += 1
      } catch (e) {
        console.log("ERROR GETTING SHORT RESPONSE");
        console.log(e);
      }
  
      try {
        medium_response = await spotifyApi.getMyTopTracks({time_range : "medium_term", limit: 40});
        count += 1
      } catch (e) {
        console.log("ERROR GETTING MEDIUM RESPONSE");
        console.log(e);
      }
  
      try {
        long_response = await spotifyApi.getMyTopTracks({time_range : "long_term", limit: 30});
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

      //THIS IS FOR TESTING (CHECKING SHORT RESULTS)
      // avg_mood = long_mood;
      // avg_energy = long_energy;
      // avg_acoustic = long_acoustic;

      //THIS IS SOLELY FOR RANDOM RESULTS (TESTING DIFF POKEMON)
      // avg_mood = (Math.random() * 2)
      // avg_energy = (Math.random() * 1.7)
      // avg_acoustic = (Math.random() * 0.7)

      // avg_mood = 2.4;
      // avg_energy = 1.3;
      // avg_acoustic = 0.7;

  
      if((avg_mood + avg_energy + avg_acoustic) == 0) {
        name = "ditto"
      } else {
        type = get_type(avg_mood, avg_energy, avg_acoustic);
        name = get_pokemon(avg_energy, avg_mood, type);
  
        // type = get_type(medium_mood, medium_energy, medium_acoustic);
        // name = get_pokemon(medium_energy, medium_mood, type);
        let rand_val = Math.floor(Math.random() * (8096 - 1)) + 1;
        if(rand_val == 493) {
          name = "arceus"
        }
  
        if(specialDay()) {
          if(rand_val < 200) {
            name = "oddish"
          } else if(rand_val > 200 && rand_val < 250) {
            name = "koffing"
          } else if(rand_val == 420) {
            name = "blaziken"
          }
        }
  
        // let test_name = "mudkip"
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
        prename = "an";
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
        let rand_val = Math.floor(Math.random() * (2000 - 1)) + 1;
  
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
          // console.log("TYPE 2: " + type_2)
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
        
        genera = species.genera[7]["genus"]

        // record result

        // try {
        //   const docRef = doc(db, "pokedatabase", species_name);
        //   const docSnapshot = await getDoc(docRef);
        //   if (!docSnapshot.exists()) {
        //       await setDoc(docRef, {
        //         count: 1,
        //         access: "valid"
        //       });
        //   } else {
        //       await updateDoc(docRef, {
        //         count: increment(1),
        //         access: "valid"
        //       });
        //   }
        // } catch (e) {
        //   console.error("firebase error: ", e)
        // }

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
        "genera": genera,
        "type_category": type,
        "type_category_color": type.toUpperCase(),
        "first_insight": typeDescriptions[type][0],
        "second_insight": typeDescriptions[type][1]
      };
  
      if(error) {
        variables = variables_error;
      }
  
      res.render("display", variables);
    } catch (e) {
      res.render("display", variables_error);
    }
});

function specialDay() {
  let today = new Date();
  let month = today.getMonth(); 
  let day = today.getDate();
  return month === 3 && day === 20; 
}

// app.get('/refresh', function routeHandler(req, res) {});

const port = parseInt(process.env.PORT, 10) || 8888;

console.log(`Listening on ${port}`);

app.listen(process.env.PORT || 8888);
