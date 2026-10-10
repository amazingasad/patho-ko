/**
 * Built-in stone and mineral reference data.
 * Tuple order: name, formula, hardness min, hardness max (Mohs), crystal system,
 * colours, density (g/cm³), streak, lustre, cleavage, fracture, description.
 */
export type StoneRow = [
  name: string,
  formula: string,
  hmin: number,
  hmax: number,
  system: string,
  colour: string,
  density: string,
  streak: string,
  lustre: string,
  cleavage: string,
  fracture: string,
  description: string,
];

export const STONE_ROWS: StoneRow[] = [
  // Native elements
  ['Gold', 'Au', 2.5, 3, 'Cubic', 'Yellow, gold', '19.3', 'Golden yellow', 'Metallic', 'None', 'Hackly', 'The classic precious metal: soft, heavy, and so unreactive that it is found as nuggets, flakes and wires in quartz veins and river gravels.'],
  ['Silver', 'Ag', 2.5, 3, 'Cubic', 'Silver-white, grey, black', '10.5', 'Silver-white', 'Metallic', 'None', 'Hackly', 'A bright, ductile metal that tarnishes black. It forms wiry, branching crystals and is a by-product of lead and copper mining.'],
  ['Copper', 'Cu', 2.5, 3, 'Cubic', 'Copper-red, brown', '8.9', 'Copper-red', 'Metallic', 'None', 'Hackly', 'Native copper grows as twisted sheets and branching crystals, and slowly turns green as it weathers into malachite.'],
  ['Platinum', 'Pt', 4, 4.5, 'Cubic', 'Steel-grey, silver-white', '19', 'Steel-grey', 'Metallic', 'None', 'Hackly', 'A dense, silvery metal that is rare in nature and usually found as small grains in dark igneous rocks and river sands.'],
  ['Diamond', 'C', 10, 10, 'Cubic', 'Colorless, yellow, brown, blue, pink', '3.52', 'White', 'Adamantine', 'Perfect octahedral', 'Conchoidal', 'Carbon crystallised under extreme pressure deep in the Earth and carried up in kimberlite pipes. The hardest natural material known.'],
  ['Graphite', 'C', 1, 2, 'Hexagonal', 'Black, dark grey', '2.2', 'Black', 'Metallic to earthy', 'Perfect basal', 'Flaky', 'Soft, slippery carbon that leaves a mark on paper. It is the "lead" in pencils and the same element as diamond.'],
  ['Sulfur', 'S', 1.5, 2.5, 'Orthorhombic', 'Yellow', '2.07', 'White', 'Resinous', 'Poor', 'Conchoidal', 'Bright yellow crystals that form around volcanic vents and hot springs. It smells when heated or rubbed.'],

  // Sulfides
  ['Pyrite', 'FeS2', 6, 6.5, 'Cubic', 'Brass-yellow', '5', 'Greenish black', 'Metallic', 'Indistinct', 'Uneven', 'Known as fool\'s gold. Often grows as perfect cubes and sparks when struck against steel.'],
  ['Galena', 'PbS', 2.5, 2.5, 'Cubic', 'Lead-grey', '7.6', 'Lead-grey', 'Metallic', 'Perfect cubic', 'Subconchoidal', 'The main ore of lead. Heavy, shiny and easy to spot by its cubic cleavage.'],
  ['Sphalerite', 'ZnS', 3.5, 4, 'Cubic', 'Brown, yellow, black, green', '4', 'Pale yellow to brown', 'Resinous to adamantine', 'Perfect dodecahedral', 'Conchoidal', 'The principal ore of zinc. Colours range from honey-yellow to nearly black depending on iron content.'],
  ['Chalcopyrite', 'CuFeS2', 3.5, 4, 'Tetragonal', 'Brass-yellow', '4.2', 'Greenish black', 'Metallic', 'Poor', 'Uneven', 'The most important copper ore. Looks like pyrite but is softer and often shows a rainbow tarnish.'],
  ['Cinnabar', 'HgS', 2, 2.5, 'Trigonal', 'Red', '8.1', 'Scarlet', 'Adamantine', 'Perfect prismatic', 'Uneven', 'A vivid red mercury ore used for centuries as a pigment. Toxic, so handle with care.'],
  ['Molybdenite', 'MoS2', 1, 1.5, 'Hexagonal', 'Lead-grey', '4.7', 'Bluish grey', 'Metallic', 'Perfect basal', 'Flaky', 'Looks like graphite but is heavier. It is the main source of molybdenum used to harden steel.'],
  ['Stibnite', 'Sb2S3', 2, 2, 'Orthorhombic', 'Lead-grey, silver', '4.6', 'Lead-grey', 'Metallic', 'Perfect', 'Subconchoidal', 'Long, blade-like crystals that fan out in sprays. The chief ore of antimony.'],
  ['Bornite', 'Cu5FeS4', 3, 3, 'Orthorhombic', 'Copper-red, purple, blue', '5.1', 'Grey-black', 'Metallic', 'Poor', 'Uneven', 'Called peacock ore because the fresh copper-red surface quickly tarnishes to shimmering purple and blue.'],
  ['Arsenopyrite', 'FeAsS', 5.5, 6, 'Monoclinic', 'Silver-white, steel-grey', '6.1', 'Dark grey', 'Metallic', 'Distinct', 'Uneven', 'The main ore of arsenic. It often travels with gold in quartz veins and gives off a garlic smell when struck.'],
  ['Realgar', 'As4S4', 1.5, 2, 'Monoclinic', 'Red, orange', '3.5', 'Orange-red', 'Resinous', 'Good', 'Conchoidal', 'A bright orange-red arsenic sulfide that slowly crumbles to powder in strong light.'],

  // Oxides
  ['Hematite', 'Fe2O3', 5, 6.5, 'Trigonal', 'Black, red, grey', '5.26', 'Red-brown', 'Metallic to earthy', 'None', 'Uneven', 'The most important iron ore. Its streak is always rusty red, even when the stone itself looks silver-black.'],
  ['Magnetite', 'Fe3O4', 5.5, 6.5, 'Cubic', 'Black', '5.2', 'Black', 'Metallic', 'None', 'Uneven', 'A naturally magnetic iron ore. Small fragments cling to a magnet and lodestones were the first compasses.'],
  ['Goethite', 'FeO(OH)', 5, 5.5, 'Orthorhombic', 'Brown, yellow-brown, black', '4.3', 'Yellow-brown', 'Adamantine to dull', 'Perfect', 'Uneven', 'A rusty brown iron mineral found in soils and weathered iron deposits. It gives many rocks their yellow-brown colour.'],
  ['Chromite', 'FeCr2O4', 5.5, 5.5, 'Cubic', 'Black', '4.6', 'Dark brown', 'Submetallic', 'None', 'Uneven', 'The only ore of chromium, found in dark layered igneous rocks.'],
  ['Cassiterite', 'SnO2', 6, 7, 'Tetragonal', 'Brown, black', '7', 'White to brown', 'Adamantine', 'Imperfect', 'Subconchoidal', 'The main ore of tin. It is unusually heavy for a glassy-looking stone and collects in river gravels.'],
  ['Rutile', 'TiO2', 6, 6.5, 'Tetragonal', 'Reddish brown, black', '4.25', 'Pale brown', 'Adamantine to metallic', 'Distinct', 'Uneven', 'A titanium oxide that forms golden needles inside quartz, sometimes called rutilated quartz.'],
  ['Cuprite', 'Cu2O', 3.5, 4, 'Cubic', 'Red', '6.1', 'Brownish red', 'Adamantine to submetallic', 'Poor', 'Conchoidal', 'A ruby-red copper oxide that forms in the upper weathered zone of copper deposits.'],
  ['Uraninite', 'UO2', 5, 6, 'Cubic', 'Black', '10.9', 'Brownish black', 'Submetallic to pitchy', 'None', 'Conchoidal', 'The main ore of uranium. It is extremely dense and radioactive, so it is kept away from casual collectors.'],
  ['Spinel', 'MgAl2O4', 7.5, 8, 'Cubic', 'Red, blue, black, pink', '3.6', 'White', 'Vitreous', 'None', 'Conchoidal', 'A hard gem mineral that forms perfect octahedra. Many famous "rubies" in royal crowns turned out to be red spinel.'],
  ['Ruby', 'Al2O3', 9, 9, 'Trigonal', 'Red', '4', 'White', 'Vitreous', 'None', 'Conchoidal', 'Red corundum coloured by chromium. After diamond, it is one of the hardest natural gems.'],
  ['Sapphire', 'Al2O3', 9, 9, 'Trigonal', 'Blue, yellow, pink, green', '4', 'White', 'Vitreous', 'None', 'Conchoidal', 'Corundum in every colour except red. The deep blue stones get their colour from iron and titanium.'],

  // Quartz family and silica
  ['Quartz', 'SiO2', 7, 7, 'Trigonal', 'Colorless, white, purple, pink, brown, black', '2.65', 'White', 'Vitreous', 'None', 'Conchoidal', 'One of the most common minerals on Earth, forming six-sided crystals with pointed tips. Available in many colour varieties.'],
  ['Amethyst', 'SiO2', 7, 7, 'Trigonal', 'Purple', '2.65', 'White', 'Vitreous', 'None', 'Conchoidal', 'Purple quartz coloured by iron and natural radiation. It often lines the inside of hollow rocks called geodes.'],
  ['Agate', 'SiO2', 6.5, 7, 'Trigonal', 'White, grey, brown, red, blue', '2.6', 'White', 'Waxy to vitreous', 'None', 'Conchoidal', 'Banded, microscopically fine-grained quartz that forms in cavities of volcanic rock layer by layer.'],
  ['Opal', 'SiO2·nH2O', 5.5, 6.5, 'Amorphous', 'Colorless, white, black, multicolored', '2.1', 'White', 'Vitreous to waxy', 'None', 'Conchoidal', 'A water-bearing silica with no crystal structure. Precious opal flashes rainbow colours as light bends through tiny silica spheres.'],

  // Silicates
  ['Beryl', 'Be3Al2Si6O18', 7.5, 8, 'Hexagonal', 'Green, blue, yellow, colorless, pink', '2.75', 'White', 'Vitreous', 'Imperfect', 'Conchoidal', 'The family of emerald and aquamarine. Pegmatite crystals can grow to several metres long.'],
  ['Emerald', 'Be3Al2Si6O18', 7.5, 8, 'Hexagonal', 'Green', '2.75', 'White', 'Vitreous', 'Imperfect', 'Conchoidal', 'Green beryl coloured by chromium or vanadium. Most emeralds contain tiny fractures called the jardin.'],
  ['Aquamarine', 'Be3Al2Si6O18', 7.5, 8, 'Hexagonal', 'Blue', '2.75', 'White', 'Vitreous', 'Imperfect', 'Conchoidal', 'Sea-blue beryl that forms big, clean crystals in granite pegmatites.'],
  ['Topaz', 'Al2SiO4(F,OH)2', 8, 8, 'Orthorhombic', 'Yellow, colorless, blue, brown, pink', '3.55', 'White', 'Vitreous', 'Perfect basal', 'Subconchoidal', 'A hard fluorine-bearing silicate. Imperial topaz is a warm orange-pink, and blue topaz is usually treated.'],
  ['Garnet', 'Fe3Al2(SiO4)3', 7, 7.5, 'Cubic', 'Red, brown, green, orange', '4.3', 'White', 'Vitreous', 'None', 'Conchoidal', 'A group of hard silicates that form rounded crystals. Red almandine is the most common type.'],
  ['Zircon', 'ZrSiO4', 7.5, 7.5, 'Tetragonal', 'Brown, colorless, yellow, red', '4.65', 'White', 'Adamantine', 'Poor', 'Conchoidal', 'A durable mineral that can survive billions of years, so tiny zircon grains are used to date the oldest rocks on Earth.'],
  ['Tourmaline', 'Na(Li,Al)3Al6(BO3)3Si6O18(OH)4', 7, 7.5, 'Trigonal', 'Green, pink, blue, black', '3.1', 'White', 'Vitreous', 'None', 'Uneven', 'Striped, three-sided crystals in almost every colour. Pink and green stones are cut as gems, black schorl is common.'],
  ['Olivine', '(Mg,Fe)2SiO4', 6.5, 7, 'Orthorhombic', 'Green', '3.4', 'White', 'Vitreous', 'Poor', 'Conchoidal', 'Gem-quality olivine is called peridot. It is the main mineral of the Earth\'s upper mantle.'],
  ['Jadeite', 'NaAlSi2O6', 6.5, 7, 'Monoclinic', 'Green, white, lavender', '3.34', 'White', 'Vitreous to pearly', 'Good', 'Splintery', 'The rarer and more valuable of the two kinds of jade. Imperial green jadeite is among the most prized stones in Asia.'],
  ['Nephrite', 'Ca2(Mg,Fe)5Si8O22(OH)2', 5, 6, 'Monoclinic', 'Green, white, grey', '3', 'White', 'Greasy to waxy', 'None', 'Splintery', 'The tougher type of jade, a tightly interwoven mass of fibres. Carved for tools and ornaments for thousands of years.'],
  ['Talc', 'Mg3Si4O10(OH)2', 1, 1, 'Monoclinic', 'White, green', '2.75', 'White', 'Pearly to greasy', 'Perfect', 'Flaky', 'The softest mineral on the Mohs scale. It feels soapy and is ground into talcum powder.'],
  ['Muscovite', 'KAl2(AlSi3O10)(OH)2', 2, 2.5, 'Monoclinic', 'Colorless, silver, brown, green', '2.8', 'White', 'Vitreous to pearly', 'Perfect basal', 'Flaky', 'Common mica that peels into thin, transparent, flexible sheets.'],
  ['Biotite', 'K(Mg,Fe)3AlSi3O10(OH)2', 2.5, 3, 'Monoclinic', 'Black, brown', '3', 'Grey-brown', 'Vitreous to pearly', 'Perfect basal', 'Flaky', 'Dark, shiny mica found in granites and schists that splits into thin black flakes.'],
  ['Orthoclase', 'KAlSi3O8', 6, 6, 'Monoclinic', 'White, pink, colorless', '2.56', 'White', 'Vitreous', 'Perfect', 'Uneven', 'A potassium feldspar that gives many granites their pink colour. It defines 6 on the Mohs scale.'],
  ['Albite', 'NaAlSi3O8', 6, 6.5, 'Triclinic', 'White, colorless', '2.62', 'White', 'Vitreous', 'Perfect', 'Uneven', 'A sodium feldspar that often grows in blade-like clusters called cleavelandite.'],
  ['Labradorite', '(Ca,Na)(Al,Si)4O8', 6, 6.5, 'Triclinic', 'Grey, blue, green', '2.7', 'White', 'Vitreous to pearly', 'Perfect', 'Uneven', 'A feldspar famous for labradorescence, a flash of blue and gold that appears as the stone is turned in the light.'],
  ['Kyanite', 'Al2SiO5', 4.5, 7, 'Triclinic', 'Blue, white, green', '3.6', 'White', 'Vitreous to pearly', 'Perfect', 'Splintery', 'Blue blades with two different hardnesses in the same crystal: about 4.5 along the length and 6.5 or 7 across it.'],
  ['Lapis Lazuli', '(Na,Ca)8(AlSiO4)6(S,SO4,Cl)2', 5, 5.5, 'Cubic', 'Blue', '2.4', 'Light blue', 'Vitreous to dull', 'Poor', 'Uneven', 'A deep blue rock rich in lazurite, flecked with golden pyrite. Ground into ultramarine pigment in the Middle Ages.'],
  ['Sodalite', 'Na8Al6Si6O24Cl2', 5.5, 6, 'Cubic', 'Blue, white', '2.3', 'White', 'Vitreous to greasy', 'Poor', 'Conchoidal', 'A royal-blue stone, often with white veins, used for beads and decorative carvings.'],
  ['Tanzanite', 'Ca2Al3(SiO4)3(OH)', 6.5, 7, 'Orthorhombic', 'Blue, violet', '3.35', 'White', 'Vitreous', 'Perfect', 'Uneven', 'A violet-blue gem variety of zoisite found in only one small area of the world.'],
  ['Rhodonite', 'MnSiO3', 5.5, 6.5, 'Triclinic', 'Pink, red', '3.6', 'White', 'Vitreous', 'Perfect', 'Conchoidal', 'A rosy pink manganese silicate, often laced with black veins of manganese oxide.'],
  ['Spodumene', 'LiAlSi2O6', 6.5, 7, 'Monoclinic', 'Pink, green, yellow, colorless', '3.15', 'White', 'Vitreous', 'Perfect', 'Uneven', 'An important lithium ore. Pink kunzite and green hiddenite are the gem varieties.'],

  // Carbonates
  ['Calcite', 'CaCO3', 3, 3, 'Trigonal', 'Colorless, white, yellow, orange', '2.71', 'White', 'Vitreous', 'Perfect rhombohedral', 'Conchoidal', 'The main mineral of limestone and marble. Clear crystals split into rhombs and show double refraction.'],
  ['Dolomite', 'CaMg(CO3)2', 3.5, 4, 'Trigonal', 'White, pink, grey', '2.85', 'White', 'Vitreous to pearly', 'Perfect rhombohedral', 'Subconchoidal', 'A calcium-magnesium carbonate that builds entire mountain ranges, such as the Dolomites in Italy.'],
  ['Aragonite', 'CaCO3', 3.5, 4, 'Orthorhombic', 'White, colorless, yellow', '2.95', 'White', 'Vitreous', 'Distinct', 'Subconchoidal', 'Same chemistry as calcite but a different crystal structure. It forms pearls, coral skeletons and the inside of shells.'],
  ['Siderite', 'FeCO3', 3.5, 4, 'Trigonal', 'Brown, yellow-brown, grey', '3.96', 'White', 'Vitreous to pearly', 'Perfect rhombohedral', 'Uneven', 'An iron carbonate that has been smelted for iron ore for centuries.'],
  ['Rhodochrosite', 'MnCO3', 3.5, 4, 'Trigonal', 'Pink, red', '3.7', 'White', 'Vitreous to pearly', 'Perfect rhombohedral', 'Uneven', 'Rose-red manganese carbonate. In Argentina it forms banded stalactite slices known as the Inca rose.'],
  ['Malachite', 'Cu2CO3(OH)2', 3.5, 4, 'Monoclinic', 'Green', '3.9', 'Light green', 'Silky to dull', 'Perfect', 'Subconchoidal', 'A rich green copper carbonate, banded in concentric rings, and one of the oldest stones used for ornaments and pigment.'],
  ['Azurite', 'Cu3(CO3)2(OH)2', 3.5, 4, 'Monoclinic', 'Blue', '3.8', 'Light blue', 'Vitreous', 'Perfect', 'Conchoidal', 'Deep blue copper carbonate that often grows next to green malachite and slowly changes into it.'],
  ['Smithsonite', 'ZnCO3', 4, 4.5, 'Trigonal', 'Blue, green, white, yellow', '4.4', 'White', 'Vitreous to pearly', 'Perfect rhombohedral', 'Uneven', 'A zinc carbonate found in pastel shades, often as rounded, grape-like crusts.'],
  ['Cerussite', 'PbCO3', 3, 3.5, 'Orthorhombic', 'Colorless, white, grey', '6.5', 'White', 'Adamantine', 'Good', 'Conchoidal', 'A lead carbonate with brilliant, heavy crystals that form star-shaped twins.'],

  // Halides, sulfates, phosphates and others
  ['Fluorite', 'CaF2', 4, 4, 'Cubic', 'Purple, green, blue, yellow, colorless', '3.18', 'White', 'Vitreous', 'Perfect octahedral', 'Subconchoidal', 'Colourful cubes that glow under ultraviolet light. The word "fluorescence" comes from its name.'],
  ['Halite', 'NaCl', 2.5, 2.5, 'Cubic', 'Colorless, white, pink, blue', '2.17', 'White', 'Vitreous', 'Perfect cubic', 'Conchoidal', 'Rock salt: ordinary table salt in its natural crystalline form, found in dried-up seas and salt domes.'],
  ['Gypsum', 'CaSO4·2H2O', 2, 2, 'Monoclinic', 'Colorless, white, yellow', '2.3', 'White', 'Vitreous to silky', 'Perfect', 'Splintery', 'So soft you can scratch it with a fingernail. Used for plaster and drywall, and it grows into giant crystals in caves.'],
  ['Barite', 'BaSO4', 3, 3.5, 'Orthorhombic', 'White, colorless, blue, yellow', '4.5', 'White', 'Vitreous', 'Perfect', 'Uneven', 'Surprisingly heavy for a pale stone, which makes it easy to recognise. Used in drilling mud.'],
  ['Celestine', 'SrSO4', 3, 3.5, 'Orthorhombic', 'Blue, colorless, white', '3.96', 'White', 'Vitreous', 'Perfect', 'Uneven', 'Pale sky-blue crystals named for the Latin word for heavenly. The main source of strontium.'],
  ['Apatite', 'Ca5(PO4)3(F,Cl,OH)', 5, 5, 'Hexagonal', 'Green, blue, yellow, colorless', '3.19', 'White', 'Vitreous', 'Poor', 'Conchoidal', 'The phosphate mineral that forms teeth and bones, and the main source of fertiliser phosphate.'],
  ['Borax', 'Na2B4O5(OH)4·8H2O', 2, 2.5, 'Monoclinic', 'White, colorless', '1.7', 'White', 'Vitreous to earthy', 'Perfect', 'Conchoidal', 'A soft boron mineral that forms in dried-up salt lakes and is used in glass, soap and cleaning products.'],
  ['Wulfenite', 'PbMoO4', 2.5, 3, 'Tetragonal', 'Orange, yellow, red', '6.8', 'White', 'Adamantine to resinous', 'Distinct', 'Subconchoidal', 'Thin, glassy plates in glowing orange and yellow that grow in the weathered zone of lead deposits.'],
  ['Vanadinite', 'Pb5(VO4)3Cl', 2.5, 3, 'Hexagonal', 'Red, orange, brown', '6.9', 'White to yellow', 'Resinous to adamantine', 'None', 'Uneven', 'Bright red hexagonal crystals that form on dark rock and are a minor ore of vanadium.'],
  ['Wolframite', '(Fe,Mn)WO4', 4, 4.5, 'Monoclinic', 'Black, brown', '7.3', 'Dark brown', 'Submetallic', 'Perfect', 'Uneven', 'The major ore of tungsten, a very heavy dark mineral that comes with tin in granite veins.'],
  ['Scheelite', 'CaWO4', 4.5, 5, 'Tetragonal', 'White, yellow, colorless', '6.1', 'White', 'Vitreous to adamantine', 'Distinct', 'Uneven', 'A tungsten ore that glows bright blue-white under ultraviolet light, which helps prospectors find it.'],
  ['Turquoise', 'CuAl6(PO4)4(OH)8·4H2O', 5, 6, 'Triclinic', 'Blue, green', '2.7', 'White', 'Waxy', 'Perfect', 'Conchoidal', 'A sky-blue to green stone prized for thousands of years. Often found with dark matrix veins.'],
  ['Chrysocolla', '(Cu,Al)2H2Si2O5(OH)4·nH2O', 2, 4, 'Amorphous', 'Blue, green', '2.2', 'Light green', 'Vitreous to earthy', 'None', 'Conchoidal', 'A blue-green copper silicate that forms smooth, glassy crusts and is often polished as a cabochon.'],
];
