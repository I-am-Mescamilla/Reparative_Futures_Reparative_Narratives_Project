window.APP_CONFIG = {
  // your map basics
  mapboxToken: 'pk.eyJ1IjoibWVzY2FtaWxsYS1hcmNoIiwiYSI6ImNtMXRpMXpoNTAybzAyanB4OTFuZnJ1c24ifQ.5yAwDGHE56G-z1ZzjxhWCw',
  styleUrl: 'mapbox://styles/mescamilla-arch/cmfby113e000h01s40060h9iy',
  center: [-90.1847, 32.2988],
  zoom: 10.5,
  pitch: 5,
  projection: 'globe',
  schoolsLayerId: 'j-ms-publicschools',

  //  corresponds to your `addSource`
  extraSources: [
    {
      id: 'city_limits',
      spec: {
        type: 'vector',
        url: 'mapbox://mescamilla-arch.75l28uxy'
      }
    }
  ],

  //  corresponds to your `addLayer`
  extraLayers: [
    {
      id: 'CityLimits',
      type: 'line',
      source: 'city_limits',
      'source-layer': 'J_MS_CityLimits-51cgsj',
      paint: {
        'line-color': '#ffffff',
        'line-opacity': 1,
      },
      layout: { visibility: 'visible' }, // start hidden for checkbox control
      label: 'Jackson City Limits',         // used in the dashboard toggle
      hoverProps: [''], // used in hover popup
      enableHover: false,  
    }
  ],

  // Layers that are ALREADY in the style
  styleLayers: [
    { 
      id: 'road-primary',
      label: 'Primary Roads',
      enableHover: false
    },
  
    {
      id: 'j-ms-wards',
      label: 'City Wards',
      enableHover: true,
      hoverProps: [
        { key: 'POPULATION', label: 'Population' },
        { key: 'MEMBER',     label: 'Representative' },
        { key: 'MEMBER_em',  label: 'Email' }
      ]
    },
  
    {
      id: 'choropleth-fill',
      label: 'Block Groups',
      enableHover: true,
      hoverProps: [
        { key: 'HH_Total', label: 'Total Households' }
      ]
    }
  ],



};
