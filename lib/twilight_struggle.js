module.exports = {
  roles: [
    { id: "US",   name: "USA",   },
    { id: "USSR", name: "USSR", },
  ],
  objects: [
    {
      faces: ["twilight_struggle/NewTSmap7.jpg"],
      locked: true,
      x: 8,
      y: 100,
      width: 1290,
      height: 840,
    },

    {
      id: "US Die",
      x: 370,
      y: 425,
      width: 50,
      height: 50,
      faces: [
        "twilight_struggle/dice/us_d6_1.png",
        "twilight_struggle/dice/us_d6_2.png",
        "twilight_struggle/dice/us_d6_3.png",
        "twilight_struggle/dice/us_d6_4.png",
        "twilight_struggle/dice/us_d6_5.png",
        "twilight_struggle/dice/us_d6_6.png",
      ],
    },

    {
      id: "USSR Die",
      x: 370,
      y: 485,
      width: 50,
      height: 50,
      faces: [
        "twilight_struggle/dice/ussr_d6_1.png",
        "twilight_struggle/dice/ussr_d6_2.png",
        "twilight_struggle/dice/ussr_d6_3.png",
        "twilight_struggle/dice/ussr_d6_4.png",
        "twilight_struggle/dice/ussr_d6_5.png",
        "twilight_struggle/dice/ussr_d6_6.png",
      ],
    },

    {
      id: "actionCard",
      prototype: true,
      width: 50,
      height: 70,
      back: "twilight_struggle/card_back.png",
    },
    {
      id: "earlyWar",
      prototype: true,
      prototypes: ["actionCard"],
      x: 775,
      y: 150,
    },
    {
      id: "midWar",
      prototype: true,
      prototypes: ["actionCard"],
      x: 50,
      y: 565,
    },
    {
      id: "lateWar",
      prototype: true,
      prototypes: ["actionCard"],
      x: 50,
      y: 640,
    },

    { id: "The China Card", prototypes: ["actionCard"], front: "twilight_struggle/early/the-china-card.jpg", x: 1210, y: 955},

    { id: "Arab Israeli War", prototypes: ["earlyWar"], front: "twilight_struggle/early/arab-israeli-war.jpg"},
    { id: "Asia Scoring", prototypes: ["earlyWar"], front: "twilight_struggle/early/asia-scoring.jpg"},
    { id: "Blockade", prototypes: ["earlyWar"], front: "twilight_struggle/early/blockade.jpg"},
    { id: "Captured Nazi Scientist", prototypes: ["earlyWar"], front: "twilight_struggle/early/captured-nazi-scientist.jpg"},
    { id: "CIA Created", prototypes: ["earlyWar"], front: "twilight_struggle/early/cia-created.jpg"},
    { id: "Comecon", prototypes: ["earlyWar"], front: "twilight_struggle/early/comecon.jpg"},
    { id: "Containment", prototypes: ["earlyWar"], front: "twilight_struggle/early/containment.jpg"},
    { id: "Decolonization", prototypes: ["earlyWar"], front: "twilight_struggle/early/decolonization.jpg"},
    { id: "Defectors", prototypes: ["earlyWar"], front: "twilight_struggle/early/defectors.jpg"},
    { id: "De Gaulle Leads France", prototypes: ["earlyWar"], front: "twilight_struggle/early/de-gaulle-leads-france.jpg"},
    { id: "De-Stalinization", prototypes: ["earlyWar"], front: "twilight_struggle/early/de-stalinization.jpg"},
    { id: "Duck and Cover", prototypes: ["earlyWar"], front: "twilight_struggle/early/duck-and-cover.jpg"},
    { id: "East European Unrest", prototypes: ["earlyWar"], front: "twilight_struggle/early/east-european-unrest.jpg"},
    { id: "Europe Scoring", prototypes: ["earlyWar"], front: "twilight_struggle/early/europe-scoring.jpg"},
    { id: "Fidel", prototypes: ["earlyWar"], front: "twilight_struggle/early/fidel.jpg"},
    { id: "Five Year Plan", prototypes: ["earlyWar"], front: "twilight_struggle/early/five-year-plan.jpg"},
    { id: "Formosan Resolution", prototypes: ["earlyWar"], front: "twilight_struggle/early/formosan-resolution.jpg"},
    { id: "Independent Reds", prototypes: ["earlyWar"], front: "twilight_struggle/early/independent-reds.jpg"},
    { id: "Indo-Pakistani War", prototypes: ["earlyWar"], front: "twilight_struggle/early/indo-pakistani-war.jpg"},
    { id: "Korean War", prototypes: ["earlyWar"], front: "twilight_struggle/early/korean-war.jpg"},
    { id: "Marshall Plan", prototypes: ["earlyWar"], front: "twilight_struggle/early/marshall-plan.jpg"},
    { id: "Middle East Scoring", prototypes: ["earlyWar"], front: "twilight_struggle/early/middle-east-scoring.jpg"},
    { id: "Nasser", prototypes: ["earlyWar"], front: "twilight_struggle/early/nasser.jpg"},
    { id: "NATO", prototypes: ["earlyWar"], front: "twilight_struggle/early/nato.jpg"},
    { id: "NORAD", prototypes: ["earlyWar"], front: "twilight_struggle/early/norad.jpg"},
    { id: "Nuclear Test Ban", prototypes: ["earlyWar"], front: "twilight_struggle/early/nuclear-test-ban.jpg"},
    { id: "Olympic Games", prototypes: ["earlyWar"], front: "twilight_struggle/early/olympic-games.jpg"},
    { id: "Red Scare/Purge", prototypes: ["earlyWar"], front: "twilight_struggle/early/red-scare-purge.jpg"},
    { id: "Romanian Abdication", prototypes: ["earlyWar"], front: "twilight_struggle/early/romanian-abdication.jpg"},
    { id: "Socialist Governments", prototypes: ["earlyWar"], front: "twilight_struggle/early/socialist-governments.jpg"},
    { id: "Special Relationship", prototypes: ["earlyWar"], front: "twilight_struggle/early/special-relationship.jpg"},
    { id: "Suez Crisis", prototypes: ["earlyWar"], front: "twilight_struggle/early/suez-crisis.jpg"},
    { id: "The Cambridge Five", prototypes: ["earlyWar"], front: "twilight_struggle/early/the-cambridge-five.jpg"},
    { id: "Truman Doctrine", prototypes: ["earlyWar"], front: "twilight_struggle/early/truman-doctrine.jpg"},
    { id: "UN Intervention", prototypes: ["earlyWar"], front: "twilight_struggle/early/un-intervention.jpg"},
    { id: "US-Japan Mutual Defense Pact", prototypes: ["earlyWar"], front: "twilight_struggle/early/us-japan-mutual-defense-pact.jpg"},
    { id: "Vietnam Revolts", prototypes: ["earlyWar"], front: "twilight_struggle/early/vietnam-revolts.jpg"},
    { id: "Warsaw Pact Formed", prototypes: ["earlyWar"], front: "twilight_struggle/early/warsaw-pact-formed.jpg"},

    { id: "ABM Treaty", prototypes: ["midWar"], front: "twilight_struggle/mid/abm-treaty.jpg"},
    { id: "Africa Scoring", prototypes: ["midWar"], front: "twilight_struggle/mid/africa-scoring.jpg"},
    { id: "Allende", prototypes: ["midWar"], front: "twilight_struggle/mid/allende.jpg"},
    { id: "Alliance for Progress", prototypes: ["midWar"], front: "twilight_struggle/mid/alliance-for-progress.jpg"},
    { id: "Arms Race", prototypes: ["midWar"], front: "twilight_struggle/mid/arms-race.jpg"},
    { id: "Ask Not What Your Country Can Do For You", prototypes: ["midWar"], front: "twilight_struggle/mid/ask-not-what-your-country.jpg"},
    { id: "Bear Trap", prototypes: ["midWar"], front: "twilight_struggle/mid/bear-trap.jpg"},
    { id: "Brezhnev Doctrine", prototypes: ["midWar"], front: "twilight_struggle/mid/brezhnev-doctrine.jpg"},
    { id: "Brush War", prototypes: ["midWar"], front: "twilight_struggle/mid/brush-war.jpg"},
    { id: "Camp David Accords", prototypes: ["midWar"], front: "twilight_struggle/mid/camp-david-accords.jpg"},
    { id: "Central America Scoring", prototypes: ["midWar"], front: "twilight_struggle/mid/central-america-scoring.jpg"},
    { id: "Che", prototypes: ["midWar"], front: "twilight_struggle/mid/che.jpg"},
    { id: "Colonial Rear Guards", prototypes: ["midWar"], front: "twilight_struggle/mid/colonial-rear-guards.jpg"},
    { id: "Cuban Missile Crisis", prototypes: ["midWar"], front: "twilight_struggle/mid/cuban-missile-crisis.jpg"},
    { id: "Cultural Revolution", prototypes: ["midWar"], front: "twilight_struggle/mid/cultural-revolution.jpg"},
    { id: "Flower Power", prototypes: ["midWar"], front: "twilight_struggle/mid/flower-power.jpg"},
    { id: "Grain Sales to Soviets", prototypes: ["midWar"], front: "twilight_struggle/mid/grain-sales-to-soviets.jpg"},
    { id: "How I Learned to Stop Worrying", prototypes: ["midWar"], front: "twilight_struggle/mid/how-i-learned-to-stop-worrying.jpg"},
    { id: "John Paul II Elected Pope", prototypes: ["midWar"], front: "twilight_struggle/mid/john-paul-ii-elected-pope.jpg"},
    { id: "Junta", prototypes: ["midWar"], front: "twilight_struggle/mid/junta.jpg"},
    { id: "Kitchen Debates", prototypes: ["midWar"], front: "twilight_struggle/mid/kitchen-debates.jpg"},
    { id: "Latin American Death Squads", prototypes: ["midWar"], front: "twilight_struggle/mid/latin-american-death-squads.jpg"},
    { id: "Liberation Theology", prototypes: ["midWar"], front: "twilight_struggle/mid/liberation-theology.jpg"},
    { id: "Long Gunman", prototypes: ["midWar"], front: "twilight_struggle/mid/lone-gunman.jpg"},
    { id: "Missile Envy", prototypes: ["midWar"], front: "twilight_struggle/mid/missile-envy.jpg"},
    { id: "Muslim Revolution", prototypes: ["midWar"], front: "twilight_struggle/mid/muslim-revolution.jpg"},
    { id: "Nixon Plays the China Card", prototypes: ["midWar"], front: "twilight_struggle/mid/nixon-plays-the-china-card.jpg"},
    { id: "Nuclear Subs", prototypes: ["midWar"], front: "twilight_struggle/mid/nuclear-subs.jpg"},
    { id: "OAS Founded", prototypes: ["midWar"], front: "twilight_struggle/mid/oas-founded.jpg"},
    { id: "One Small Step", prototypes: ["midWar"], front: "twilight_struggle/mid/one-small-step.jpg"},
    { id: "OPEC", prototypes: ["midWar"], front: "twilight_struggle/mid/opec.jpg"},
    { id: "Our Man in Tehran", prototypes: ["midWar"], front: "twilight_struggle/mid/our-man-in-tehran.jpg"},
    { id: "Panama Canal Returned", prototypes: ["midWar"], front: "twilight_struggle/mid/panama-canal-returned.jpg"},
    { id: "Portugese Empire Crumbles", prototypes: ["midWar"], front: "twilight_struggle/mid/portuguese-empire-crumbles.jpg"},
    { id: "Puppet Governments", prototypes: ["midWar"], front: "twilight_struggle/mid/puppet-governments.jpg"},
    { id: "Quagmire", prototypes: ["midWar"], front: "twilight_struggle/mid/quagmire.jpg"},
    { id: "Sadat Expels Soviets", prototypes: ["midWar"], front: "twilight_struggle/mid/sadat-expels-soviets.jpg"},
    { id: "SALT Negotiations", prototypes: ["midWar"], front: "twilight_struggle/mid/salt-negotiations.jpg"},
    { id: "Shuttle Diplomacy", prototypes: ["midWar"], front: "twilight_struggle/mid/shuttle-diplomacy.jpg"},
    { id: "South African Unrest", prototypes: ["midWar"], front: "twilight_struggle/mid/south-african-unrest.jpg"},
    { id: "South America Scoring", prototypes: ["midWar"], front: "twilight_struggle/mid/south-america-scoring.jpg"},
    { id: "Southeast Asia Scoring", prototypes: ["midWar"], front: "twilight_struggle/mid/southeast-asia-scoring.jpg"},
    { id: "Summit", prototypes: ["midWar"], front: "twilight_struggle/mid/summit.jpg"},
    { id: "The Voice of America", prototypes: ["midWar"], front: "twilight_struggle/mid/the-voice-of-america.jpg"},
    { id: "U2 Incident", prototypes: ["midWar"], front: "twilight_struggle/mid/u2-incident.jpg"},
    { id: "Ussuri River Skirmish", prototypes: ["midWar"], front: "twilight_struggle/mid/ussuri-river-skirmish.jpg"},
    { id: "We Will Bury You", prototypes: ["midWar"], front: "twilight_struggle/mid/we-will-bury-you.jpg"},
    { id: "Willy Brandt", prototypes: ["midWar"], front: "twilight_struggle/mid/willy-brandt.jpg"},

    { id: "Aldritch Ames Remix", prototypes: ["lateWar"], front: "twilight_struggle/late/aldrich-ames-remix.jpg"},
    { id: "An Evil Empire", prototypes: ["lateWar"], front: "twilight_struggle/late/an-evil-empire.jpg"},
    { id: "AWACS Sale to Saudis", prototypes: ["lateWar"], front: "twilight_struggle/late/awacs-sale-to-saudis.jpg"},
    { id: "Chernobyl", prototypes: ["lateWar"], front: "twilight_struggle/late/chernobyl.jpg"},
    { id: "Glasnost", prototypes: ["lateWar"], front: "twilight_struggle/late/glasnost.jpg"},
    { id: "Iran-Contra Scandal", prototypes: ["lateWar"], front: "twilight_struggle/late/iran-contra-scandal.jpg"},
    { id: "Iranian Hostage Crisis", prototypes: ["lateWar"], front: "twilight_struggle/late/iranian-hostage-crisis.jpg"},
    { id: "Iran-Iraq War", prototypes: ["lateWar"], front: "twilight_struggle/late/iran-iraq-war.jpg"},
    { id: "Latin American Debt Crisis", prototypes: ["lateWar"], front: "twilight_struggle/late/latin-american-debt-crisis.jpg"},
    { id: "Marine Barracks Bombing", prototypes: ["lateWar"], front: "twilight_struggle/late/marine-barracks-bombing.jpg"},
    { id: "North Sea Oil", prototypes: ["lateWar"], front: "twilight_struggle/late/north-sea-oil.jpg"},
    { id: "Ortega Elected in Nicaragua", prototypes: ["lateWar"], front: "twilight_struggle/late/ortega-elected-in-nicaragua.jpg"},
    { id: "Pershing II Deployed", prototypes: ["lateWar"], front: "twilight_struggle/late/pershing-ii-deployed.jpg"},
    { id: "Regan Bombs Libya", prototypes: ["lateWar"], front: "twilight_struggle/late/reagan-bombs-libya.jpg"},
    { id: "Solidarity", prototypes: ["lateWar"], front: "twilight_struggle/late/solidarity.jpg"},
    { id: "Soviets Shoot Down KAL-7", prototypes: ["lateWar"], front: "twilight_struggle/late/soviets-shoot-down-kal-7.jpg"},
    { id: "Star Wars", prototypes: ["lateWar"], front: "twilight_struggle/late/star-wars.jpg"},
    { id: "Tear Down This Wall", prototypes: ["lateWar"], front: "twilight_struggle/late/tear-down-this-wall.jpg"},
    { id: "Terrorism", prototypes: ["lateWar"], front: "twilight_struggle/late/terrorism.jpg"},
    { id: "The Iron Lady", prototypes: ["lateWar"], front: "twilight_struggle/late/the-iron-lady.jpg"},
    { id: "The Reformer", prototypes: ["lateWar"], front: "twilight_struggle/late/the-reformer.jpg"},
    { id: "Wargames", prototypes: ["lateWar"], front: "twilight_struggle/late/wargames.jpg"},
    { id: "Yuri and Samantha", prototypes: ["lateWar"], front: "twilight_struggle/late/yuri-and-samantha.jpg"},

    {
      id: "marker",
      prototype: true,
      width: 25,
      height: 25,
    },

    { id: "VP", prototypes: ["marker"], x: 641, y: 886, front: "twilight_struggle/markers/vp.png"},
    { id: "Turn", prototypes: ["marker"], x: 931, y: 150, front: "twilight_struggle/markers/turn.png"},
    { id: "US Space Race", prototypes: ["marker"], x: 722, y: 783, front: "twilight_struggle/markers/us_space.png"},
    { id: "USSR Space Race", prototypes: ["marker"], x: 738, y: 799, front: "twilight_struggle/markers/ussr_space.png"},
    { id: "DEFCON", prototypes: ["marker"], x: 36, y: 737, front: "twilight_struggle/markers/defcon.png"},
    { id: "US MilOps", prototypes: ["marker"], x: 29, y: 796, front: "twilight_struggle/markers/us_milops.png"},
    { id: "USSR MilOps", prototypes: ["marker"], x: 45, y: 812, front: "twilight_struggle/markers/ussr_milops.png"},

    {
      id: "inf_us",
      prototype: true,
      prototypes: ["marker"],
      immobile: true,
      faces: [
        "twilight_struggle/markers/transparent.png",
        "twilight_struggle/markers/inf_neutral.png",
        "twilight_struggle/markers/inf_us.png",
      ],
      hasLabel: true,
      labelColor: ["#000000", "#067dc1", "#ffffff"],
    },

    {
      id: "inf_ussr",
      prototype: true,
      prototypes: ["marker"],
      immobile: true,
      faces: [
        "twilight_struggle/markers/transparent.png",
        "twilight_struggle/markers/inf_neutral.png",
        "twilight_struggle/markers/inf_ussr.png",
      ],
      hasLabel: true,
      labelColor: ["#000000", "#d31d29", "#fed722"],
    },

    {id: "Canada_US", prototypes: ["inf_us"], x: 217, y: 288, label: 2, faceIndex: 1},
    {id: "Canada_USSR", prototypes: ["inf_ussr"], x: 242, y: 288},
    {id: "UK_US", prototypes: ["inf_us"], x: 433, y: 242, label: 5, faceIndex: 2},
    {id: "UK_USSR", prototypes: ["inf_ussr"], x: 458, y: 242},
    {id: "Norway_US", prototypes: ["inf_us"], x: 495, y: 167},
    {id: "Norway_USSR", prototypes: ["inf_ussr"], x: 520, y: 167},
    {id: "Denmark_US", prototypes: ["inf_us"], x: 507, y: 206},
    {id: "Denmark_USSR", prototypes: ["inf_ussr"], x: 532, y: 206},
    {id: "Sweden_US", prototypes: ["inf_us"], x: 571, y: 200},
    {id: "Sweden_USSR", prototypes: ["inf_ussr"], x: 596, y: 200},
    {id: "Finland_US", prototypes: ["inf_us"], x: 645, y: 169},
    {id: "Finland_USSR", prototypes: ["inf_ussr"], x: 670, y: 169, label: 1, faceIndex: 1},
    {id: "EastGermany_US", prototypes: ["inf_us"], x: 552, y: 243},
    {id: "EastGermany_USSR", prototypes: ["inf_ussr"], x: 577, y: 243, label: 3, faceIndex: 2},
    {id: "Poland_US", prototypes: ["inf_us"], x: 610, y: 243},
    {id: "Poland_USSR", prototypes: ["inf_ussr"], x: 635, y: 243},
    {id: "Benelux_US", prototypes: ["inf_us"], x: 476, y: 281},
    {id: "Benelux_USSR", prototypes: ["inf_ussr"], x: 501, y: 281},
    {id: "WestGermany_US", prototypes: ["inf_us"], x: 532, y: 281},
    {id: "WestGermany_USSR", prototypes: ["inf_ussr"], x: 557, y: 281},
    {id: "Czechoslovakia_US", prototypes: ["inf_us"], x: 600, y: 281},
    {id: "Czechoslovakia_USSR", prototypes: ["inf_ussr"], x: 625, y: 281},
    {id: "France_US", prototypes: ["inf_us"], x: 466, y: 327},
    {id: "France_USSR", prototypes: ["inf_ussr"], x: 491, y: 327},
    {id: "Austria_US", prototypes: ["inf_us"], x: 556, y: 321},
    {id: "Austria_USSR", prototypes: ["inf_ussr"], x: 581, y: 321},
    {id: "Hungary_US", prototypes: ["inf_us"], x: 612, y: 320},
    {id: "Hungary_USSR", prototypes: ["inf_ussr"], x: 637, y: 320},
    {id: "Romania_US", prototypes: ["inf_us"], x: 668, y: 320},
    {id: "Romania_USSR", prototypes: ["inf_ussr"], x: 693, y: 320},
    {id: "Spain/Portugal_US", prototypes: ["inf_us"], x: 426, y: 381},
    {id: "Spain/Portugal_USSR", prototypes: ["inf_ussr"], x: 451, y: 381},
    {id: "Italy_US", prototypes: ["inf_us"], x: 541, y: 360},
    {id: "Italy_USSR", prototypes: ["inf_ussr"], x: 566, y: 360},
    {id: "Yugoslavia_US", prototypes: ["inf_us"], x: 599, y: 360},
    {id: "Yugoslavia_USSR", prototypes: ["inf_ussr"], x: 624, y: 360},
    {id: "Bulgaria_US", prototypes: ["inf_us"], x: 657, y: 360},
    {id: "Bulgaria_USSR", prototypes: ["inf_ussr"], x: 682, y: 360},
    {id: "Turkey_US", prototypes: ["inf_us"], x: 713, y: 365},
    {id: "Turkey_USSR", prototypes: ["inf_ussr"], x: 738, y: 365},
    {id: "Greece_US", prototypes: ["inf_us"], x: 612, y: 402},
    {id: "Greece_USSR", prototypes: ["inf_ussr"], x: 637, y: 402},

    {id: "Lebanon_US", prototypes: ["inf_us"], x: 680, y: 404},
    {id: "Lebanon_USSR", prototypes: ["inf_ussr"], x: 705, y: 404},
    {id: "Syria_US", prototypes: ["inf_us"], x: 736, y: 402},
    {id: "Syria_USSR", prototypes: ["inf_ussr"], x: 761, y: 402, label: 1, faceIndex:1},
    {id: "Israel_US", prototypes: ["inf_us"], x: 671, y: 441, label: 1, faceIndex: 1},
    {id: "Israel_USSR", prototypes: ["inf_ussr"], x: 696, y: 441},
    {id: "Iraq_US", prototypes: ["inf_us"], x: 735, y: 441},
    {id: "Iraq_USSR", prototypes: ["inf_ussr"], x: 760, y: 441, label: 1, faceIndex: 1},
    {id: "Iran_US", prototypes: ["inf_us"], x: 790, y: 441, label: 1, faceIndex: 1},
    {id: "Iran_USSR", prototypes: ["inf_ussr"], x: 815, y: 441},
    {id: "Libya_US", prototypes: ["inf_us"], x: 587, y: 475},
    {id: "Libya_USSR", prototypes: ["inf_ussr"], x: 612, y: 475},
    {id: "Egypt_US", prototypes: ["inf_us"], x: 644, y: 480},
    {id: "Egypt_USSR", prototypes: ["inf_ussr"], x: 669, y: 480},
    {id: "Jordan_US", prototypes: ["inf_us"], x: 707, y: 480},
    {id: "Jordan_USSR", prototypes: ["inf_ussr"], x: 732, y: 480},
    {id: "GulfStates_US", prototypes: ["inf_us"], x: 771, y: 479},
    {id: "GulfStates_USSR", prototypes: ["inf_ussr"], x: 796, y: 479},
    {id: "SaudiArabia_US", prototypes: ["inf_us"], x: 755, y: 517},
    {id: "SaudiArabia_USSR", prototypes: ["inf_ussr"], x: 780, y: 517},

    {id: "Afghanistan_US", prototypes: ["inf_us"], x: 856, y: 416},
    {id: "Afghanistan_USSR", prototypes: ["inf_ussr"], x: 881, y: 416},
    {id: "Pakistan_US", prototypes: ["inf_us"], x: 857, y: 465},
    {id: "Pakistan_USSR", prototypes: ["inf_ussr"], x: 882, y: 465},
    {id: "India_US", prototypes: ["inf_us"], x: 918, y: 492},
    {id: "India_USSR", prototypes: ["inf_ussr"], x: 943, y: 492},
    {id: "Burma_US", prototypes: ["inf_us"], x: 987, y: 499},
    {id: "Burma_USSR", prototypes: ["inf_ussr"], x: 1012, y: 499},
    {id: "Laos/Cambodia_US", prototypes: ["inf_us"], x: 1042, y: 505},
    {id: "Laos/Cambodia_USSR", prototypes: ["inf_ussr"], x: 1067, y: 505},
    {id: "Thailand_US", prototypes: ["inf_us"], x: 1018, y: 544},
    {id: "Thailand_USSR", prototypes: ["inf_ussr"], x: 1043, y: 544},
    {id: "Vietnam_US", prototypes: ["inf_us"], x: 1074, y: 545},
    {id: "Vietnam_USSR", prototypes: ["inf_ussr"], x: 1099, y: 545},
    {id: "Malaysia_US", prototypes: ["inf_us"], x: 1044, y: 604},
    {id: "Malaysia_USSR", prototypes: ["inf_ussr"], x: 1069, y: 604},
    {id: "Australia_US", prototypes: ["inf_us"], x: 1137, y: 718, label: 4, faceIndex: 2},
    {id: "Australia_USSR", prototypes: ["inf_ussr"], x: 1162, y: 718},
    {id: "Indonesia_US", prototypes: ["inf_us"], x: 1136, y: 651},
    {id: "Indonesia_USSR", prototypes: ["inf_ussr"], x: 1161, y: 651},
    {id: "Phillipines_US", prototypes: ["inf_us"], x: 1157, y: 543, label: 1, faceIndex: 1},
    {id: "Phillipines_USSR", prototypes: ["inf_ussr"], x: 1182, y: 543},
    {id: "Taiwan_US", prototypes: ["inf_us"], x: 1133, y: 485},
    {id: "Taiwan_USSR", prototypes: ["inf_ussr"], x: 1158, y: 485},
    {id: "Japan_US", prototypes: ["inf_us"], x: 1202, y: 439, label: 1, faceIndex: 1},
    {id: "Japan_USSR", prototypes: ["inf_ussr"], x: 1227, y: 439},
    {id: "S.Korea_US", prototypes: ["inf_us"], x: 1157, y: 403, label: 1, faceIndex: 1},
    {id: "S.Korea_USSR", prototypes: ["inf_ussr"], x: 1182, y: 403},
    {id: "N.Korea_US", prototypes: ["inf_us"], x: 1146, y: 364},
    {id: "N.Korea_USSR", prototypes: ["inf_ussr"], x: 1171, y: 364, label: 3, faceIndex: 2},

    {id: "Morocco_US", prototypes: ["inf_us"], x: 440, y: 453},
    {id: "Morocco_USSR", prototypes: ["inf_ussr"], x: 465, y: 453},
    {id: "Algeria_US", prototypes: ["inf_us"], x: 496, y: 435},
    {id: "Algeria_USSR", prototypes: ["inf_ussr"], x: 521, y: 435},
    {id: "Tunisia_US", prototypes: ["inf_us"], x: 554, y: 431},
    {id: "Tunisia_USSR", prototypes: ["inf_ussr"], x: 579, y: 431},
    {id: "WestAfricanStates_US", prototypes: ["inf_us"], x: 435, y: 503},
    {id: "WestAfricanStates_USSR", prototypes: ["inf_ussr"], x: 460, y: 503},
    {id: "SaharanStates_US", prototypes: ["inf_us"], x: 520, y: 516},
    {id: "SaharanStates_USSR", prototypes: ["inf_ussr"], x: 545, y: 516},
    {id: "IvoryCoast_US", prototypes: ["inf_us"], x: 471, y: 577},
    {id: "IvoryCoast_USSR", prototypes: ["inf_ussr"], x: 496, y: 577},
    {id: "Nigeria_US", prototypes: ["inf_us"], x: 541, y: 571},
    {id: "Nigeria_USSR", prototypes: ["inf_ussr"], x: 566, y: 571},
    {id: "Cameroon_US", prototypes: ["inf_us"], x: 566, y: 615},
    {id: "Cameroon_USSR", prototypes: ["inf_ussr"], x: 591, y: 615},
    {id: "Zaire_US", prototypes: ["inf_us"], x: 633, y: 633},
    {id: "Zaire_USSR", prototypes: ["inf_ussr"], x: 658, y: 633},
    {id: "Angola_US", prototypes: ["inf_us"], x: 584, y: 679},
    {id: "Angola_USSR", prototypes: ["inf_ussr"], x: 609, y: 679},
    {id: "SouthAfrica_US", prototypes: ["inf_us"], x: 607, y: 781, label: 1, faceIndex: 1},
    {id: "SouthAfrica_USSR", prototypes: ["inf_ussr"], x: 632, y: 781},
    {id: "Botswana_US", prototypes: ["inf_us"], x: 634, y: 739},
    {id: "Botswana_USSR", prototypes: ["inf_ussr"], x: 659, y: 739},
    {id: "Zimbabwe_US", prototypes: ["inf_us"], x: 652, y: 698},
    {id: "Zimbabwe_USSR", prototypes: ["inf_ussr"], x: 677, y: 698},
    {id: "SEAfricanSates_US", prototypes: ["inf_us"], x: 708, y: 670},
    {id: "SEAfricanSates_USSR", prototypes: ["inf_ussr"], x: 733, y: 670},
    {id: "Kenya_US", prototypes: ["inf_us"], x: 700, y: 617},
    {id: "Kenya_USSR", prototypes: ["inf_ussr"], x: 725, y: 617},
    {id: "Somalia_US", prototypes: ["inf_us"], x: 756, y: 584},
    {id: "Somalia_USSR", prototypes: ["inf_ussr"], x: 781, y: 584},
    {id: "Ethiopia_US", prototypes: ["inf_us"], x: 694, y: 567},
    {id: "Ethiopia_USSR", prototypes: ["inf_ussr"], x: 719, y: 567},
    {id: "Sudan_US", prototypes: ["inf_us"], x: 654, y: 527},
    {id: "Sudan_USSR", prototypes: ["inf_ussr"], x: 679, y: 527},

    {id: "Mexico_US", prototypes: ["inf_us"], x: 48, y: 446},
    {id: "Mexico_USSR", prototypes: ["inf_ussr"], x: 73, y: 446},
    {id: "Columbia_US", prototypes: ["inf_us"], x: 96, y: 485},
    {id: "Columbia_USSR", prototypes: ["inf_ussr"], x: 121, y: 485},
    {id: "ElSalvador_US", prototypes: ["inf_us"], x: 78, y: 526},
    {id: "ElSalvador_USSR", prototypes: ["inf_ussr"], x: 103, y: 526},
    {id: "Honduras_US", prototypes: ["inf_us"], x: 135, y: 523},
    {id: "Honduras_USSR", prototypes: ["inf_ussr"], x: 160, y: 523},
    {id: "CostaRica_US", prototypes: ["inf_us"], x: 129, y: 563},
    {id: "CostaRica_USSR", prototypes: ["inf_ussr"], x: 154, y: 563},
    {id: "Panama_US", prototypes: ["inf_us"], x: 192, y: 562, label: 1, faceIndex: 1},
    {id: "Panama_USSR", prototypes: ["inf_ussr"], x: 217, y: 562},
    {id: "Nicaragua_US", prototypes: ["inf_us"], x: 191, y: 524},
    {id: "Nicaragua_USSR", prototypes: ["inf_ussr"], x: 216, y: 524},
    {id: "Cuba_US", prototypes: ["inf_us"], x: 195, y: 474},
    {id: "Cuba_USSR", prototypes: ["inf_ussr"], x: 220, y: 474},
    {id: "Haiti_US", prototypes: ["inf_us"], x: 250, y: 509},
    {id: "Haiti_USSR", prototypes: ["inf_ussr"], x: 275, y: 509},
    {id: "DominicanRep_US", prototypes: ["inf_us"], x: 304, y: 509},
    {id: "DominicanRep_USSR", prototypes: ["inf_ussr"], x: 329, y: 509},

    {id: "Colombia_US", prototypes: ["inf_us"], x: 228, y: 609},
    {id: "Colombia_USSR", prototypes: ["inf_ussr"], x: 253, y: 609},
    {id: "Equador_US", prototypes: ["inf_us"], x: 169, y: 626},
    {id: "Equador_USSR", prototypes: ["inf_ussr"], x: 194, y: 626},
    {id: "Peru_US", prototypes: ["inf_us"], x: 201, y: 669},
    {id: "Peru_USSR", prototypes: ["inf_ussr"], x: 226, y: 669},
    {id: "Bolivia_US", prototypes: ["inf_us"], x: 259, y: 704},
    {id: "Bolivia_USSR", prototypes: ["inf_ussr"], x: 284, y: 704},
    {id: "Chile_US", prototypes: ["inf_us"], x: 229, y: 751},
    {id: "Chile_USSR", prototypes: ["inf_ussr"], x: 254, y: 751},
    {id: "Argentina_US", prototypes: ["inf_us"], x: 248, y: 825},
    {id: "Argentina_USSR", prototypes: ["inf_ussr"], x: 273, y: 825},
    {id: "Uruguay_US", prototypes: ["inf_us"], x: 310, y: 795},
    {id: "Uruguay_USSR", prototypes: ["inf_ussr"], x: 335, y: 795},
    {id: "Paraguay_US", prototypes: ["inf_us"], x: 292, y: 746},
    {id: "Paraguay_USSR", prototypes: ["inf_ussr"], x: 317, y: 746},
    {id: "Brazil_US", prototypes: ["inf_us"], x: 357, y: 665},
    {id: "Brazil_USSR", prototypes: ["inf_ussr"], x: 382, y: 665},
    {id: "Venezuala_US", prototypes: ["inf_us"], x: 259, y: 568},
    {id: "Venezuala_USSR", prototypes: ["inf_ussr"], x: 284, y: 568},

    {
      id: "handScreen",
      prototype: true,
      locked: true,
      x: 108,
      width:  1090,
      height: 100,
      hideFaces: ["front"],
      snapZones: [{}],
    },
    { prototypes: ["handScreen"], y:   0, visionWhitelist: ["US"  ], backgroundColor: "rgba(6,125,193,alpha)", labelPlayerName: "US",   },
    { prototypes: ["handScreen"], y: 940, visionWhitelist: ["USSR"], backgroundColor: "rgba(211,29,41,alpha)",   labelPlayerName: "USSR", },

  ],
};