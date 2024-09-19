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
            if(avg_mood >= 0.99) {
              return "darkrai";
            }
            return "honchkrow";
          } else { //E+, M-
            if(avg_energy > 2.75) {
              return "sneasel";
            }
            return "zorua";
          }
        } else {
          if (avg_mood > 0.8) { //E-, M+
            return "absol";
          } else { //E-, M-
            return "umbreon";
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
            if(avg_energy < 2.4) {
              return "azelf"
            }
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
            return "foongus";
          }
        } else {
          if (avg_mood > 0.8) { //E-, M+
            if(avg_energy < 2.2) {
              return "toxel";
            }
            return "ekans";
          } else { //E-, M-
            return "stunky";
          }
        }
      case "dragon":
        if (avg_energy > 2.1) {
          if (avg_mood > 0.8) { //E+, M+
            if (avg_energy < 2.2) {
              return "noibat"
            }
            return "latias";
          } else { //E+, M-
            if (avg_energy < 2.4) {
              return "axew"
            }
            return "latios";
          }
        } else {
          if (avg_mood > 0.8) { //E-, M+
            if(avg_energy < 2.2) {
              return "flygon";
            }
            return "dragonite";
          } else { //E-, M-
            return "kingdra";
          }
        }
      case "ghost":
        if (avg_energy > 1.6) {
          if (avg_mood > 0.8) { //E+, M+
            return "marshadow";
          } else { //E+, M-
            return "gengar";
          }
        } else {
          if (avg_mood > 0.8) { //E-, M+
            return "litwick";
          } else { //E-, M-
            if(avg_mood < 0.3) {
              return "lunala"
            }
            return "drifblim";
          }
        }
      case "ice":
        if (avg_energy > 1.6) {
          if (avg_mood > 0.8) { //E+, M+
            return "vulpix-alola"; //troubleshoot vulpix
          } else { //E+, M-
            return "articuno";
          }
        } else {
          if (avg_mood > 0.8) { //E-, M+
            return "glaceon";
          } else { //E-, M-
            return "beartic";
          }
        }
      case "fire":
        if (avg_energy > 2.5) {
          if (avg_mood > 1.15) { //E+, M+
            if(avg_mood < 1.22) {
              return "charizard"
            }
            return "charmander";
          } else { //E+, M-
            if (avg_mood > 1.08) {
              return "growlithe"
            }
            return "cyndaquil";
          }
        } else {
          if (avg_mood > 1.15) { //E-, M+
            if(avg_mood < 1.22) {
              return "tepig"
            }
            return "chimchar";
          } else { //E-, M-
            if (avg_energy < 2.39) {
              return "ponyta";
            }
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
            if(avg_mood < 1.22) {
              return "tyrogue"
            }
            return "riolu";
          } else { //E-, M-
            if(avg_mood < 1.075) {
              return "machop"
            }
            return "pancham";
          }
        }
      case "normal":
        if (avg_energy > 2.1) {
          if (avg_mood > 1.15) { //E+, M+
            if(avg_mood > 1.24) {
              return "litleo"
            }
            return "eevee";
          } else { //E+, M-
            if(avg_mood > 1.075) {
              return "aipom"
            }
            return "meowth";
          }
        } else {
          if (avg_mood > 1.15) { //E-, M+
            if(avg_mood > 1.24) {
              return "teddiursa"
            }
            return "wooloo";
          } else { //E-, M-
            if(avg_energy > 2) {
              return "smeargle";
            }
            return "komala";
          }
        }
      case "water":
        if (avg_energy > 2.1) {
          if (avg_mood > 1.15) { //E+, M+
            if(avg_mood > 1.22) {
              return "horsea"
            }
            return "squirtle";
          } else { //E+, M-
            if(avg_energy > 2.25) {
              return "psyduck";
            } else if(avg_energy <= 2.25 && avg_energy >= 2.2) {
              return "oshawott";
            }
            return "piplup";
          }
        } else {
          if (avg_mood > 1.15) { //E-, M+
            if(avg_energy < 1.9) {
              return "slowpoke"
            }
            return "lapras";
          } else { //E-, M-
            if(avg_mood - 1.25 < 0.01 && avg_mood - 1.25 > 0) {
              return "kyogre"
            }
            if(avg_mood < 1.05 && avg_energy < 1.93) {
              return "magikarp"
            }
            return "vaporeon";
          }
        }
      case "grass":
        if (avg_energy > 1.6) {
          if (avg_mood > 1.15) { //E+, M+
            if(avg_energy < 1.75) {
              return 'hoppip'
            }
            return "shaymin-sky"; //troubleshoot shaymin
          } else { //E+, M-
            if(avg_mood > 1.24) {
              return "treecko"
            }
            return "bulbasaur";
          }
        } else {
          if (avg_mood > 1.15) { //E-, M+
            if(avg_mood < 1.2) {
              return "turtwig"
            }
            return "skiddo";
          } else { //E-, M-
            if(avg_mood < 1.06) {
              return "leafeon"
            }
            return "chespin";
          }
        }
      case "steel":
        if (avg_energy > 1.6) {
          if (avg_mood > 1.15) { //E+, M+
            if(avg_mood < 1.21) {
              return "magnemite"
            }
            return "aron"; 
          } else { //E+, M-
            return "mawile";
          }
        } else {
          if (avg_mood > 1.15) { //E-, M+
            if(avg_mood < 1.2) {
              return "jirachi"
            }
            return "cufant";
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
            if(avg_mood > 1.6) {
              return "yamper"
            }
            return "shinx";
          } else { //E+, M-
            return "pikachu";
          }
        } else {
          if (avg_mood > 1.45) { //E-, M+
            if(avg_energy < 2.4) {
              return "jolteon"
            }
            return "raichu";
          } else { //E-, M-
            if (avg_energy < 2.4) {
              return "pachirisu"
            }
            return "pichu";
          }
        }
      case "flying":
        if (avg_energy > 2.5) {
          if (avg_mood > 1.45) { //E+, M+
            if(avg_mood > 1.7) {
              return "doduo"
            }
            return "staravia";
          } else { //E+, M-
            return "fletchling";
          }
        } else {
          if (avg_mood > 1.45) { //E-, M+
            if(avg_energy < 2.3) {
              return "altaria"
            }
            return "togekiss";
          } else { //E-, M-
            if(avg_mood < 1.36) {
              return "natu"
            }
            return "pidgey";
          }
        }
      case "bug":
        if (avg_energy > 2.1) {
          if (avg_mood > 1.45) { //E+, M+
            if(avg_mood > 1.5) {
              return "vivillon"
            }
            return "butterfree";
          } else { //E+, M-
            if(avg_energy > 2) {
              return "kricketot";
            }
            return "scyther";
          }
        } else {
          if (avg_mood > 1.45) { //E-, M+
            if(avg_mood > 1.5) {
              return "caterpie"
            }
            return "heracross";
          } else { //E-, M-
            if(avg_energy > 2) {
              return "weedle"
            }
            return "paras";
          }
        }
      case "fairy":
        if (avg_energy > 2.1) {
          if (avg_mood > 1.45) { //E+, M+
            if(avg_energy > 2.23) {
              return "togepi"
            }
            return "sylveon";
          } else { //E+, M-
            return "jigglypuff";
          }
        } else {
          if (avg_mood > 1.45) { //E-, M+
            if(avg_mood < 1.467 && avg_mood > 1.464) {
              return "xerneas"
            }
            return "gardevoir";
          } else { //E-, M-
            return "clefairy";
          }
        }
      case "ground":
        if (avg_energy > 1.6) {
          if (avg_mood > 1.45) { //E+, M+
            if(avg_mood < 1.55) {
              return "drilbur"
            }
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
            return "rockruff";
          } else { //E+, M-
            return "geodude";
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

  module.exports = {get_type, get_pokemon};