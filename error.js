const typeDescriptions = require('./types.js')

let err_string = "This Pokémon existed 300 million years ago.\nTeam Plasma altered it and attached a cannon to its back.\nUnfortunately, this Pokémon only appears if there is an error!\nPlease wait a couple minutes before reloading this site.";

const variables_error = {
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

  module.exports = variables_error;