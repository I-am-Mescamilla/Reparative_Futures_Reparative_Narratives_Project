var initLoad = true;
var layerTypes = {
    'fill': ['fill-opacity'],
    'line': ['line-opacity'],
    'circle': ['circle-opacity', 'circle-stroke-opacity'],
    'symbol': ['icon-opacity', 'text-opacity'],
    'raster': ['raster-opacity'],
    'fill-extrusion': ['fill-extrusion-opacity'],
    'heatmap': ['heatmap-opacity']
}

var alignments = {
    'left': 'lefty',
    'center': 'centered',
    'right': 'righty',
    'full': 'fully'
}

function getLayerPaintType(layer) {
    // Check if the layer exists
    if (map.getLayer(layer)) {
        var layerType = map.getLayer(layer).type;
        return layerTypes[layerType];
    } else {
        // Add handling for when the layer is not found
        console.error('Layer not found:', layer);
        return [];
    }
}

function setLayerOpacity(layer) {
    // Check if the layer exists
    if (map.getLayer(layer.layer)) {
        var paintProps = getLayerPaintType(layer.layer);
        paintProps.forEach(function(prop) {
            var options = {};
            if (layer.duration) {
                var transitionProp = prop + "-transition";
                options = { "duration": layer.duration };
                map.setPaintProperty(layer.layer, transitionProp, options);
            }
            map.setPaintProperty(layer.layer, prop, layer.opacity, options);
        });
    } else {
        // Add handling for the case when the layer is not found
        console.error('Layer not found:', layer.layer);
    }
}

// Create pop Up
var popup = new mapboxgl.Popup({
        offset: [0, -7],
        closeButton: false,
        closeOnClick: false
      });

var popup2 = new mapboxgl.Popup({
        offset: [0, -7],
        closeButton: false,
        closeOnClick: false
      });

var popup3 = new mapboxgl.Popup({
        className: 'custom-popup3',
        offset: [0, -7],
        closeButton: false,
        closeOnClick: false
      });

var story = document.getElementById('story');
var features = document.createElement('div');
features.setAttribute('id', 'features');


var header = document.createElement('div');

if (config.title) {
    var titleText = document.createElement('h1');
    titleText.innerText = config.title;
    header.appendChild(titleText);
}

if (config.subtitle) {
    var subtitleText = document.createElement('h2');
    subtitleText.innerText = config.subtitle;
    header.appendChild(subtitleText);
}

if (config.byline) {
    var bylineText = document.createElement('p');
    bylineText.innerText = config.byline;
    header.appendChild(bylineText);
}

if (config.para1) {
    var bylineText = document.createElement('p');
    bylineText.innerText = config.para1;
    header.appendChild(bylineText);
}

if (config.para2) {
    var bylineText = document.createElement('p');
    bylineText.innerText = config.para2;
    header.appendChild(bylineText);
}

if (config.para3) {
    var bylineText = document.createElement('p');
    bylineText.innerText = config.para3;
    header.appendChild(bylineText);
}

if (header.innerText.length > 0) {
    header.classList.add(config.theme);
    header.setAttribute('id', 'header');
    story.appendChild(header);
}

// This configures the chapters content and structure

config.chapters.forEach((record, idx) => {
    var container = document.createElement('div');
    var chapter = document.createElement('div');

    if (record.title) {
        var title = document.createElement('h3');
        title.innerText = record.title;
        chapter.appendChild(title);
    }

    if (record.image) {
        var image = new Image();
        image.src = record.image;
        chapter.appendChild(image);
    }

    if (record.imagecredit) {
        var story3 = document.createElement('p');
        story3.className = 'p2';
        story3.innerHTML = record.imagecredit;
        chapter.appendChild(story3);
    }

    if (record.description) {
        var story = document.createElement('p');
        story.innerHTML = record.description;
        chapter.appendChild(story);
    }

    if (record.image2) {
        var image2 = new Image();
        image2.src = record.image2;
        chapter.appendChild(image2);
    }

    if (record.imagecredit2) {
        var story4 = document.createElement('p');
        story4.className = 'p2';
        story4.innerHTML = record.imagecredit2;
        chapter.appendChild(story4);
    }

    if (record.description2) {
        var story2 = document.createElement('p');
        story2.innerHTML = record.description2;
        chapter.appendChild(story2);
    }

    if (record.video) {
    var videoDiv = document.createElement('div');
    videoDiv.setAttribute('class', 'videoContainer');
    video =  document.createElement('video');
    video.controls=true;
    video.autoplay=true;
    video.loop=true;
    video.src = record.video;
    videoDiv.appendChild(video)
    chapter.appendChild(videoDiv);
    }

    container.setAttribute('id', record.id);
    container.classList.add('step');
    if (idx === 0) {
        container.classList.add('active');
    }

    chapter.classList.add(config.theme);
    container.appendChild(chapter);
    container.classList.add(alignments[record.alignment] || 'centered');
    if (record.hidden) {
        container.classList.add('hidden');
    }
    features.appendChild(container);
});

story.appendChild(features);

//This part adds the footer 

var footer = document.createElement('div');

if (config.footer) {
    var footerText = document.createElement('p');
    footerText.innerHTML = config.footer;
    footer.appendChild(footerText);
}

if (footer.innerText.length > 0) {
    footer.classList.add(config.theme);
    footer.setAttribute('id', 'footer');
    story.appendChild(footer);
}

mapboxgl.accessToken = config.accessToken;

const transformRequest = (url) => {
    const hasQuery = url.indexOf("?") !== -1;
    const suffix = hasQuery ? "&pluginName=scrollytellingV2" : "?pluginName=scrollytellingV2";
    return {
      url: url + suffix
    }
}

var map = new mapboxgl.Map({
    container: 'map',
    style: config.style,
    center: config.chapters[0].location.center,
    zoom: config.chapters[0].location.zoom,
    bearing: config.chapters[0].location.bearing,
    pitch: config.chapters[0].location.pitch,
    interactive: false,
    transformRequest: transformRequest,
    projection: config.projection
});

// Create a inset map if enabled in config.js
if (config.inset) {
 var insetMap = new mapboxgl.Map({
    container: 'mapInset', // container id
    style: 'mapbox://styles/mapbox/dark-v10', //hosted style id
    center: config.chapters[0].location.center,
    // Hardcode above center value if you want insetMap to be static.
    zoom: 3, // starting zoom
    hash: false,
    interactive: false,
    attributionControl: false,
    //Future: Once official mapbox-gl-js has globe view enabled,
    //insetmap can be a globe with the following parameter.
    //projection: 'globe'
  });
}

if (config.showMarkers) {
    var marker = new mapboxgl.Marker({ color: config.markerColor });
    marker.setLngLat(config.chapters[0].location.center).addTo(map);
}

// instantiate the scrollama
var scroller = scrollama();




map.on("load", function() {
    if (config.use3dTerrain) {
        map.addSource('mapbox-dem', {
            'type': 'raster-dem',
            'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
            'tileSize': 512,
            'maxzoom': 14
        });
        // add the DEM source as a terrain layer with exaggerated height
        map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });

        // add a sky layer that will show when the map is highly pitched
        map.addLayer({
            'id': 'sky',
            'type': 'sky',
            'paint': {
                'sky-type': 'atmosphere',
                'sky-atmosphere-sun': [0.0, 0.0],
                'sky-atmosphere-sun-intensity': 15
            }
        });
    };

    // As the map moves, grab and update bounds in inset map.
    if (config.inset) {
    map.on('move', getInsetBounds);
    }

    /*Hover Popup

    map.on('mouseenter', '2024_MissingMigrants-type', function(e) {
        var coordinates = e.features[0].geometry.coordinates.slice();
      // Here's that function that does the transformation
      function emptyToYesNo(val){
        if (val.length > 1){
            return "Yes"} else {return "No"};
      }
      const Incident_Y = e.features[0].properties.Incident_Y;
      //const Cause of D = e.features[0].properties.Cause of D;
      //const Total Numb = e.features[0].properties.Total Numb;
      //const P_2050_1 =emptyToYesNo(e.features[0].properties.P_2050_1); // We apply this function to our value.
      var description = '<h4> ' +Incident_Y+ '</h4>'
      popup.setLngLat(coordinates).setHTML(description).addTo(map);
    });
    map.on('mouseleave', '2024_MissingMigrants-type', function() {
      map.getCanvas().style.cursor = '';
      popup.remove();
    });
    */

    // PopUp first - Dead per type

    let isLayerVisible = false; // Track layer visibility status
    // Function to check if the layer is visible based on its circle-opacity paint property
    function checkLayerVisibility() {
        const opacity = map.getPaintProperty('2024_MissingMigrants-type', 'circle-opacity'); // Get circle-opacity paint property
        isLayerVisible = opacity !== 0; // Layer is visible if opacity is not 0 (fully visible)
    }
    // Check layer visibility whenever the style data is updated
    map.on('styledata', () => {
        checkLayerVisibility();
    });
    // Mouseenter event to show popup
    map.on('mouseenter', '2024_MissingMigrants-type', function (e) {
        if (!isLayerVisible) return; // Exit if the layer is not visible
        var coordinates = e.features[0].geometry.coordinates.slice();
        // Function to transform value from empty to Yes/No
        function emptyToYesNo(val) {
            return val.length > 1 ? "Yes" : "No"; // Return 'Yes' if length > 1, otherwise 'No'
        }
        const Incident_Y = e.features[0].properties.Incident_Y;
        const C_Origin = e.features[0].properties.C_Origin;
        const N_Dead = e.features[0].properties.N_Dead;
        const N_Missing = e.features[0].properties.N_Missing;
        const Cause_D = e.features[0].properties.Cause_D;
        var description = '<h4>' + 'Year of Incident: '+ Incident_Y+ '<br>'+
                           '</h4>'+ 
                          '<p> Country of Origin: '+C_Origin+'</p>'+
                          '<p> Number of Dead Migrants: '+N_Dead +'<br>'+
                          'Number of Missing Migrants: '+N_Missing +'<br>'+
                          'Cause of Dead: '+Cause_D +'</p>'



        popup.setLngLat(coordinates).setHTML(description).addTo(map);
    });
    // Mouseleave event to remove popup
    map.on('mouseleave', '2024_MissingMigrants-type', function () {
        if (!isLayerVisible) return; // Exit if the layer is not visible
        map.getCanvas().style.cursor = ''; // Reset cursor
        popup.remove(); // Remove the popup
    });

    //PopUp second - Encounters

    let isLayerVisible2 = false; // Track layer visibility status
    // Function to check if the layer is visible based on its circle-opacity paint property
    function checkLayerVisibility2() {
        const opacity = map.getPaintProperty('2020-23-migrantencounters', 'circle-opacity'); // Get circle-opacity paint property
        isLayerVisible2 = opacity !== 0; // Layer is visible if opacity is not 0 (fully visible)
    }
    // Check layer visibility whenever the style data is updated
    map.on('styledata', () => {
        checkLayerVisibility2();
    });
    // Mouseenter event to show popup
    map.on('mouseenter', '2020-23-migrantencounters', function (e) {
        if (!isLayerVisible2) return; // Exit if the layer is not visible
        var coordinates = e.features[0].geometry.coordinates.slice();
        // Function to transform value from empty to Yes/No
        function emptyToYesNo(val) {
            return val.length > 1 ? "Yes" : "No"; // Return 'Yes' if length > 1, otherwise 'No'
        }
        const Encounters = e.features[0].properties.Encounters;
        const Encounte_4 = e.features[0].properties.Encounte_4;
        const Encounte_3 = e.features[0].properties.Encounte_3;
        const Encounte_2 = e.features[0].properties.Encounte_2;
        const Encounte_1 = e.features[0].properties.Encounte_1;
        const NOMGEO = e.features[0].properties.NOMGEO;
        var description = '<h4>' + 'Total Encounters from 2020 to 2023 in ' +NOMGEO+ ': ' + Encounte_4+ '<br>'+
                           '</h4>'+ 
                          '<p> Encounters 2020: '+Encounters +'<br>'+
                          'Encounters 2021: '+Encounte_1 +'<br>'+
                          'Encounters 2022: '+Encounte_2 +'<br>'+
                          'Encounters 2023: '+Encounte_3 +'</p>'


        popup.setLngLat(coordinates).setHTML(description).addTo(map);
    });
    // Mouseleave event to remove popup
    map.on('mouseleave', '2020-23-migrantencounters', function () {
        if (!isLayerVisible2) return; // Exit if the layer is not visible
        map.getCanvas().style.cursor = ''; // Reset cursor
        popup.remove(); // Remove the popup
    });

    //PopUp third - Insecurity Rates

    let isLayerVisible3 = false; // Track layer visibility status
    // Function to check if the layer is visible based on its circle-opacity paint property
    function checkLayerVisibility3() {
        const opacity = map.getPaintProperty('2024-ins-perception', 'circle-opacity'); // Get circle-opacity paint property
        isLayerVisible3 = opacity !== 0; // Layer is visible if opacity is not 0 (fully visible)
    }
    // Check layer visibility whenever the style data is updated
    map.on('styledata', () => {
        checkLayerVisibility3();
    });
    // Mouseenter event to show popup
    map.on('mouseenter', '2024-ins-perception', function (e) {
        if (!isLayerVisible3) return; // Exit if the layer is not visible
        var coordinates = e.features[0].geometry.coordinates.slice();
        // Function to transform value from empty to Yes/No
        function emptyToYesNo(val) {
            return val.length > 1 ? "Yes" : "No"; // Return 'Yes' if length > 1, otherwise 'No'
        }
        const PER_INSE = e.features[0].properties.PER_INSE;
        const NOM_LOC = e.features[0].properties.NOM_LOC;
        const POB_TOTAL = e.features[0].properties.POB_TOTAL;
        var description = '<h4>' + 'Insecurity Perception in ' +NOM_LOC+ ': ' + PER_INSE+ '%' + '<br>'+
                           '</h4>'+ 
                          '<p> Population: '+POB_TOTAL +'<br></p>'


        popup.setLngLat(coordinates).setHTML(description).addTo(map);
    });
    // Mouseleave event to remove popup
    map.on('mouseleave', '2024-ins-perception', function () {
        if (!isLayerVisible3) return; // Exit if the layer is not visible
        map.getCanvas().style.cursor = ''; // Reset cursor
        popup.remove(); // Remove the popup
    });



    //PopUp fourth - Insecurity Rates

    let isLayerVisible4 = true; // Track layer visibility status
    // Function to check if the layer is visible based on its circle-opacity paint property
    function checkLayerVisibility4() {
        const opacity = map.getPaintProperty('super-municipality-bivariant', 'fill-opacity'); // Get circle-opacity paint property
        isLayerVisible4 = opacity && opacity !== 0; // Layer is visible if opacity is not 0 (fully visible)
    }
    // Check layer visibility whenever the style data is updated
    map.on('styledata', () => {
        checkLayerVisibility4();
    });
    // Mouseenter event to show popup
    map.on('mousemove', 'super-municipality-bivariant', function (e) {
        if (!isLayerVisible4) return; // Exit if the layer is not visible
        var coordinates = e.lngLat;
        // Function to transform value from empty to Yes/No
        function emptyToYesNo(val) {
            return val.length > 1 ? "Yes" : "No"; // Return 'Yes' if length > 1, otherwise 'No'
        }
        const NOMGEO = e.features[0].properties.NOMGEO;
        const Population = e.features[0].properties.Population;
        const Poverty_pe = e.features[0].properties.Poverty_pe;
        const Mx_Mun_Cri = e.features[0].properties.Mx_Mun_Cri;

        // Format Mx_Mun_Cri to 2 decimal places
        const formattedPoverty_pe = parseFloat(Poverty_pe).toFixed(2);
        const formattedMx_Mun_Cri = parseFloat(Mx_Mun_Cri).toFixed(2);

        var description = '<h4>' + 'Conditions in Municipality: ' +NOMGEO+'<br>'+
                           '</h4>'+ 
                          '<p> Population: '+Population +'<br>'+
                          'Poverty Percentage: '+formattedPoverty_pe +'%'+'<br>'+
                          'Crimes per 1,000 habitants: '+formattedMx_Mun_Cri +'</p>'

        popup2.setLngLat(coordinates).setHTML(description).addTo(map);
    });
    // Mouseleave event to remove popup
    map.on('mouseleave', 'super-municipality-bivariant', function () {
        if (!isLayerVisible4) return; // Exit if the layer is not visible
        map.getCanvas().style.cursor = ''; // Reset cursor
        popup2.remove(); // Remove the popup
    });


    //PopUp fifth - Insecurity Rates

    let isLayerVisible5 = true; // Track layer visibility status
    // Function to check if the layer is visible based on its circle-opacity paint property
    function checkLayerVisibility5() {
        const opacity = map.getPaintProperty('super-municipality-criminal rate', 'fill-opacity'); // Get circle-opacity paint property
        isLayerVisible5 = opacity && opacity !== 0; // Layer is visible if opacity is not 0 (fully visible)
    }
    // Check layer visibility whenever the style data is updated
    map.on('styledata', () => {
        checkLayerVisibility5();
    });
    // Mouseenter event to show popup
    map.on('mousemove', 'super-municipality-criminal rate', function (e) {
        if (!isLayerVisible5) return; // Exit if the layer is not visible
        var coordinates = e.lngLat;
        // Function to transform value from empty to Yes/No
        function emptyToYesNo(val) {
            return val.length > 1 ? "Yes" : "No"; // Return 'Yes' if length > 1, otherwise 'No'
        }
        const NOMGEO = e.features[0].properties.NOMGEO;
        const Population = e.features[0].properties.Population;
        const Year_tot_1 = e.features[0].properties.Year_tot_1;
        const Year_tot_2 = e.features[0].properties.Year_tot_2;
        const Year_tot_3 = e.features[0].properties.Year_tot_3;
        const Year_tot_4 = e.features[0].properties.Year_tot_4;
        const Year_tot_5 = e.features[0].properties.Year_tot_5;
        const Year_tot_6 = e.features[0].properties.Year_tot_6;
        const Mx_Mun_Cri = e.features[0].properties.Mx_Mun_Cri;

        // Format Mx_Mun_Cri to 2 decimal places
        const formattedMx_Mun_Cri = parseFloat(Mx_Mun_Cri).toFixed(2);

        var description = '<h4>' + 'Conditions in Municipality: ' +NOMGEO+'<br>'+
                           '</h4>'+
                           '<h4>' + 'Crimes per 1,000 habitants: ' +formattedMx_Mun_Cri+
                           '</h4>'+ 
                          '<p> Population: '+Population +'<br>'+
                          'Yearly Murders: '+Year_tot_1 +'<br>'+
                          'Yearly Injury: '+Year_tot_2 +'<br>'+
                          'Yearly Kidnap: '+Year_tot_3 +'<br>'+
                          'Yearly Robery: '+Year_tot_4 +'<br>'+
                          'Yearly Human Trafficking: '+Year_tot_5 +'<br>'+
                          'Yearly Drug Dealing: '+Year_tot_6 +'</p>'
                          
        popup2.setLngLat(coordinates).setHTML(description).addTo(map);
    });
    // Mouseleave event to remove popup
    map.on('mouseleave', 'super-municipality-criminal rate', function () {
        if (!isLayerVisible5) return; // Exit if the layer is not visible
        map.getCanvas().style.cursor = ''; // Reset cursor
        popup2.remove(); // Remove the popup
    });


    //PopUp sixth - Drug Cartels

    let isLayerVisible6 = true; // Track layer visibility status
    // Function to check if the layer is visible based on its circle-opacity paint property
    function checkLayerVisibility6() {
        const opacity = map.getPaintProperty('simple-drugcartels', 'fill-opacity'); // Get circle-opacity paint property
        isLayerVisible6 = opacity && opacity !== 0; // Layer is visible if opacity is not 0 (fully visible)
    }
    // Check layer visibility whenever the style data is updated
    map.on('styledata', () => {
        checkLayerVisibility6();
    });
    // Mouseenter event to show popup
    map.on('mousemove', 'simple-drugcartels', function (e) {
        if (!isLayerVisible6) return; // Exit if the layer is not visible
        var coordinates = e.lngLat;

        // Function to transform value from empty to Yes/No
        function emptyToYesNo(val) {
            return val.length > 1 ? "Yes" : "No"; // Return 'Yes' if length > 1, otherwise 'No'
        }
        const BaseCartel = e.features[0].properties.BaseCartel;
        
        // Format Mx_Mun_Cri to 2 decimal places

        var description = '<h4>' + 'Cartel: ' +BaseCartel+'<br>'+
                           '</h4>'           

        popup3.setLngLat(coordinates).setHTML(description).addTo(map);
    });
    // Mouseleave event to remove popup
    map.on('mouseleave', 'simple-drugcartels', function () {
        if (!isLayerVisible6) return; // Exit if the layer is not visible
        map.getCanvas().style.cursor = ''; // Reset cursor
        popup3.remove(); // Remove the popup
    });
    

    // PopUp seventh - Dead per type

    let isLayerVisible7 = false; // Track layer visibility status
    // Function to check if the layer is visible based on its circle-opacity paint property
    function checkLayerVisibility7() {
        const opacity = map.getPaintProperty('migration-infrastructure-5ancfj', 'circle-opacity'); // Get circle-opacity paint property
        isLayerVisible7 = opacity !== 0; // Layer is visible if opacity is not 0 (fully visible)
    }
    // Check layer visibility whenever the style data is updated
    map.on('styledata', () => {
        checkLayerVisibility7();
    });
    // Mouseenter event to show popup
    map.on('mouseenter', 'migration-infrastructure-5ancfj', function (e) {
        if (!isLayerVisible7) return; // Exit if the layer is not visible
        var coordinates = e.features[0].geometry.coordinates.slice();
        // Function to transform value from empty to Yes/No
        function emptyToYesNo(val) {
            return val.length > 1 ? "Yes" : "No"; // Return 'Yes' if length > 1, otherwise 'No'
        }
        const Estado = e.features[0].properties.Estado;
        const Estado_2 = e.features[0].properties.Estado_2;
        const Clave = e.features[0].properties.Clave;
        const Nombre = e.features[0].properties.Nombre +'. '+ e.features[0].properties.Domicilio;
        const Nombre2 = e.features[0].properties['Nombre y d'];

        
        var description = '<h4>' + 'State of Location: '+Estado+Estado_2+'<br>'+'</h4>'+
                          '<p>Name and Adress: '+'<br>'+Nombre2+Nombre+'</p>'
                          
        popup.setLngLat(coordinates).setHTML(description).addTo(map);
    });
    // Mouseleave event to remove popup
    map.on('mouseleave', 'migration-infrastructure-5ancfj', function () {
        if (!isLayerVisible7) return; // Exit if the layer is not visible
        map.getCanvas().style.cursor = ''; // Reset cursor
        popup.remove(); // Remove the popup
    });




    
        
    // setup the instance, pass callback functions
    scroller
    .setup({
        step: '.step',
        offset: 0.5,
        progress: true
    })
    .onStepEnter(async response => {
        var chapter = config.chapters.find(chap => chap.id === response.element.id);
        response.element.classList.add('active');
        map[chapter.mapAnimation || 'flyTo'](chapter.location);
        // Incase you do not want to have a dynamic inset map,
        // rather want to keep it a static view but still change the
        // bbox as main map move: comment out the below if section.
        if (config.inset) {
          if (chapter.location.zoom < 5) {
            insetMap.flyTo({center: chapter.location.center, zoom: 0});
          }
          else {
            insetMap.flyTo({center: chapter.location.center, zoom: 3});
          }
        }
        if (config.showMarkers) {
            marker.setLngLat(chapter.location.center);
        }
        if (chapter.onChapterEnter.length > 0) {
            chapter.onChapterEnter.forEach(setLayerOpacity);
        }
        if (chapter.callback) {
            chapter.callback();
        }
        if (chapter.rotateAnimation) {
            map.once('moveend', () => {
                const rotateNumber = map.getBearing();
                map.rotateTo(rotateNumber + 180, {
                    duration: 30000, easing: function (t) {
                        return t;
                    }
                });
            });
        }

    })
    .onStepExit(response => {
        var chapter = config.chapters.find(chap => chap.id === response.element.id);
        response.element.classList.remove('active');
        if (chapter.onChapterExit.length > 0) {
            chapter.onChapterExit.forEach(setLayerOpacity);
        }
    });
});


//Helper functions for insetmap
function getInsetBounds() {
            let bounds = map.getBounds();

            let boundsJson = {
                "type": "FeatureCollection",
                "features": [{
                    "type": "Feature",
                    "properties": {},
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [
                            [
                                [
                                    bounds._sw.lng,
                                    bounds._sw.lat
                                ],
                                [
                                    bounds._ne.lng,
                                    bounds._sw.lat
                                ],
                                [
                                    bounds._ne.lng,
                                    bounds._ne.lat
                                ],
                                [
                                    bounds._sw.lng,
                                    bounds._ne.lat
                                ],
                                [
                                    bounds._sw.lng,
                                    bounds._sw.lat
                                ]
                            ]
                        ]
                    }
                }]
            }

            if (initLoad) {
                addInsetLayer(boundsJson);
                initLoad = false;
            } else {
                updateInsetLayer(boundsJson);
            }

        }

function addInsetLayer(bounds) {
    insetMap.addSource('boundsSource', {
        'type': 'geojson',
        'data': bounds
    });

    insetMap.addLayer({
        'id': 'boundsLayer',
        'type': 'fill',
        'source': 'boundsSource', // reference the data source
        'layout': {},
        'paint': {
            'fill-color': '#fff', // blue color fill
            'fill-opacity': 0.2
        }
    });
    // // Add a black outline around the polygon.
    insetMap.addLayer({
        'id': 'outlineLayer',
        'type': 'line',
        'source': 'boundsSource',
        'layout': {},
        'paint': {
            'line-color': '#000',
            'line-width': 1
        }
    });
}

function updateInsetLayer(bounds) {
    insetMap.getSource('boundsSource').setData(bounds);
}

//Buttons

map.on('load', function () {
    // Ensure the button is added after the chapter loads
    document.addEventListener('click', function (e) {
        if (e.target && e.target.id === 'ChiapasButton') {
            // Find the target chapter
            const targetChapter = config.chapters.find(chapter => chapter.id === 'Chiapas');
            
            if (targetChapter) {
                // Simulate scrolling to the chapter (or implement custom logic)
                document.getElementById(targetChapter.id).scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});

map.on('load', function () {
    // Ensure the button is added after the chapter loads
    document.addEventListener('click', function (e) {
        if (e.target && e.target.id === 'MexicoButton') {
            // Find the target chapter
            const targetChapter = config.chapters.find(chapter => chapter.id === 'MexicoCity');
            
            if (targetChapter) {
                // Simulate scrolling to the chapter (or implement custom logic)
                document.getElementById(targetChapter.id).scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});

map.on('load', function () {
    // Ensure the button is added after the chapter loads
    document.addEventListener('click', function (e) {
        if (e.target && e.target.id === 'MonterreyButton') {
            // Find the target chapter
            const targetChapter = config.chapters.find(chapter => chapter.id === 'Monterrey');
            
            if (targetChapter) {
                // Simulate scrolling to the chapter (or implement custom logic)
                document.getElementById(targetChapter.id).scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});

map.on('load', function () {
    // Ensure the button is added after the chapter loads
    document.addEventListener('click', function (e) {
        if (e.target && e.target.id === 'HermosilloButton') {
            // Find the target chapter
            const targetChapter = config.chapters.find(chapter => chapter.id === 'Hermosillo');
            
            if (targetChapter) {
                // Simulate scrolling to the chapter (or implement custom logic)
                document.getElementById(targetChapter.id).scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});







// setup resize event
window.addEventListener('resize', scroller.resize);