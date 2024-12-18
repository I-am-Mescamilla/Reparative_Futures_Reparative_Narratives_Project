var config = {
    style: 'mapbox://styles/mescamilla-arch/cm3ouwe3t00q601r2dty54ym7',
    accessToken: 'pk.eyJ1IjoibWVzY2FtaWxsYS1hcmNoIiwiYSI6ImNtMXRpMXpoNTAybzAyanB4OTFuZnJ1c24ifQ.5yAwDGHE56G-z1ZzjxhWCw',
    showMarkers: false,
    markerColor: '#000000',
    projection: 'globe',
    inset: false,
    theme: 'dark',
    use3dTerrain: true, //set true for enabling 3D maps.
    title: 'Public Schools at Jackson',
    subtitle: 'Reparative Futures Reparative Narratives',
    byline: `Jocelyn Poe
             Luisa Dantas
             Marcos Escamilla-Guerrero`,
    
    para1:`Land use policy, racial planning processes, and unjust development practices orchestrate the City of Jackson's present-day realities: a predominately Black school district burdened by the legacies of racial segregation and harassed by racial inequities embedded into the landscape of the City. The Jackson Public School District (JPS) is experiencing ongoing spatial injustice as it grapples with the histories that have led to the impending school closures and the need for facilities repurposing. Although limited in resources, the Jackson Public School district is land rich. However, land use policies, funding mechanisms, and discriminatory practices have prevented JPS from stewarding the land in ways that produce collective well-being. Meanwhile, predatory development practices have extracted value from JPS land and at the expense of JPS students.`,
    para2:'',
    para3:'',


    footer: '<br> Created using <a href="https://github.com/mapbox/storytelling" target="_blank">Mapbox Storytelling</a> template.',

    chapters:[
        {
            id: 'globe-heatmap',
            alignment: 'left',
            hidden: false,
            title: 'Title 1',
            image: 'images/Migrant_Caravan.jpg', 
            description:"Description A <br> <br>", 
            image2:  'images/mmp_graph.png',
            description2:"Description B", 
            imagecredit: 'Photo credits: Source 1',
            imagecredit2: 'Photo credits: Source 2',
            location: {
                center: [-90.18398, 32.31705],
                zoom: 12.00,
                pitch: 45.00,
                bearing: 0.00
            },
            mapAnimation: 'flyTo',
            rotateAnimation: true,
            callback:() => {
                popup.remove();
                popup2.remove();
                popup3.remove();
                document.getElementById("routes_legend").style.visibility = "hidden";
                document.getElementById("routes_dead_legend").style.visibility = "hidden";
                document.getElementById("routes_deadtype_legend").style.visibility = "hidden";
                document.getElementById("routes_insecurity_legend").style.visibility = "hidden";
                document.getElementById("routes_climate_legend").style.visibility = "hidden";
                document.getElementById("crossed_territories").style.visibility = "hidden";
                document.getElementById("routes_height").style.visibility = "hidden";
                document.getElementById("INM_legend").style.visibility = "hidden";
                document.getElementById("CNDH_legend").style.visibility = "hidden";
                document.getElementById("routes_dead_legend_z").style.visibility = "hidden";
                document.getElementById("bivariate_legend").style.visibility = "hidden";
                document.getElementById("crime_rates_legend").style.visibility = "hidden";
                document.getElementById("Drug_Cartel_legend").style.visibility = "hidden";
                document.getElementById("Cartel_Conflict").style.visibility = "hidden";
                document.getElementById("support_legend").style.visibility = "hidden";
            },
            onChapterEnter: [
                 {layer: 'mexico-weather', opacity: 0}, /*Mexico Weather*/
                 {layer: 'migration-cities-dots', opacity: 0}, /*Migration Cities*/
                 {layer: 'mexico-states', opacity: 0}, /*Mexico State*/
                 {layer: 'mexico-states-cndh', opacity: 0}, /*Mexico State Crime CNDH*/
                 {layer: 'mexico-states-inm', opacity: 0}, /*Mexico Stare Crime INM*/
                 {layer: 'simple-drugcartels', opacity: 0}, /*Drug Cartel Territorial Control*/
                 {layer: 'simple-drugcartels-conf', opacity: 0}, /*Cartel Chapiza vs CJNG*/
                 {layer: 'simple-drugcartels-index', opacity: 0}, /*Cartels Conflicts*/
                 {layer: 'mexico-heatwave', opacity: 0}, /*Mexico Heatwave*/
                 {layer: 'Train_Migration_Routes', opacity: 0}, /*Mexico Train Routes*/
                 {layer: 'migration-cities-labels', opacity: 0}, /*Migraiton Cities Label*/
                 {layer: '2024_MissingMigrants-84ch0i', opacity: 0}, /*Missing Migrants*/
                 {layer: '2024_MissingMigrants-type', opacity: 0}, /*Missing Migrants by Cause of Dead*/
                 {layer: '2024_MissingMigrants-heatmap', opacity: 0}, /*Missing Migrants Heat Map*/
                 {layer: '2024-ins-perception', opacity: 0}, /*Insecurity perception*/
                 {layer: '2020-23-migrantencounters', opacity: 0}, /*Migrants Encounters by INM*/
                 {layer: 'migration-infrastructure-5ancfj', opacity: 0}, /*Migration Support Infrastructure*/
                 {layer: 'super-municipality-height', opacity: 0}, /*Municipality Height*/
                 {layer: 'super-municipality-bivariant', opacity: 0}, /*Municiplalities BiVariant*/
                 {layer: 'super-municipality-criminal rate', opacity: 0}, /*Municipality Crime Rate 1-1000*/
                 {layer: 'super-municipality-simple', opacity: 0}, /*Crossed Municipalities*/
                 {layer: 'super-municipality-simple_h', opacity: 0}, /*Crossed Height*/
                ],
            onChapterExit: [],
        },
    ]
};

