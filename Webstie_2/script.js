(function(){
    window.addEventListener('DOMContentLoaded', init);
  
    function init(){
      const C = window.APP_CONFIG || {};
      mapboxgl.accessToken = C.mapboxToken;
  
      const map = new mapboxgl.Map({
        container: 'map',
        style: C.styleUrl,
        projection: C.projection || 'globe',
        center: C.center || [-90.1847, 32.2988],
        zoom: C.zoom ?? 10.5,
        pitch: C.pitch ?? 0,
        antialias: true
      });
  
      map.addControl(new mapboxgl.NavigationControl({ visualizePitch:false }), 'top-right');
  
      const mapEl = document.getElementById('map');
      window.addEventListener('resize', () => map.resize());
      new ResizeObserver(() => map.resize()).observe(mapEl);

      // ===== Click popup with school image =====
      const clickPopup = new mapboxgl.Popup({ closeButton: true, closeOnClick: true });

      // Set this to your exact attribute name in the schools layer:
      const SCHOOL_CODE_FIELD = C.schoolCodeField || 'SchoolCode';

      function escapeHTML(s){
        return String(s)
          .replaceAll('&','&amp;')
          .replaceAll('<','&lt;')
          .replaceAll('>','&gt;')
          .replaceAll('"','&quot;')
          .replaceAll("'","&#039;");
      }
      
      function buildSchoolImagePath(code){
        const safe = String(code).trim();
        // change .jpg to .png if needed
        return `./images/${encodeURIComponent(safe)}.jpg`;
      }
      
      function buildSchoolClickPopupHTML(feature){
        const p = (feature && feature.properties) || {};
        const name = p.name || p.Name || 'Unnamed School';
        const code = p['S_Code'];
      
        const imgSrc = code ? buildSchoolImagePath(code) : null;
      
        return `
          <div>
            <strong>${escapeHTML(name)}</strong><br/>
            <span class="muted">Code: ${escapeHTML(code ?? '—')}</span>
            ${imgSrc ? `
              <img class="popup-img"
                   src="${imgSrc}"
                   alt="School image"
                   onerror="this.style.display='none'; this.insertAdjacentHTML('afterend','<div class=&quot;muted&quot; style=&quot;margin-top:.5rem&quot;>No image found for this school.</div>');" />
            ` : `
              <div class="muted" style="margin-top:.5rem">No school code available for image.</div>
            `}
          </div>
        `;
      }

      let selectedYear = 2014;
      let lastSchoolFeature = null;

      const yearSlider = document.getElementById('pie-year');
      const yearLabel  = document.getElementById('pie-year-label');

      if (yearSlider && yearLabel) {
        yearLabel.textContent = String(selectedYear);

        yearSlider.addEventListener('input', () => {
          selectedYear = Number(yearSlider.value);
          yearLabel.textContent = String(selectedYear);

          // If a school is already selected, re-render the pie for the new year
          if (lastSchoolFeature && lastSchoolFeature.properties) {
            updatePie(parseComposition(lastSchoolFeature.properties, selectedYear));
          }
        });
      }



  
      map.on('load', () => {
        map.resize();
  
        // ✅ Equivalent to your map.addSource
        (C.extraSources || []).forEach(S => {
            if (!map.getSource(S.id)) map.addSource(S.id, S.spec);
        });


        // ===== Buffer around selected school (add once) =====
        if (!map.getSource('school-buffer')) {
          map.addSource('school-buffer', {
            type: 'geojson',
            data: { type: 'FeatureCollection', features: [] }
          });
        }

        if (!map.getLayer('school-buffer-fill')) {
          map.addLayer({
            id: 'school-buffer-fill',
            type: 'fill',
            source: 'school-buffer',
            paint: {
              'fill-color': '#60a5fa',
              'fill-opacity': 0.12
            }
          });
        }

        if (!map.getLayer('school-buffer-outline')) {
          map.addLayer({
            id: 'school-buffer-outline',
            type: 'line',
            source: 'school-buffer',
            paint: {
              'line-color': '#60a5fa',
              'line-width': 2,
              'line-opacity': 0.9
            }
          });
        }







        // ✅ Equivalent to your map.addLayer
        (C.extraLayers || []).forEach(L => {
            if (!map.getLayer(L.id)) map.addLayer(L);
        });

        // After adding layers, we build toggles + hover popups
        buildLayerToggles(map, C.extraLayers || []);
        buildExistingLayerToggles(map, C.styleLayers || [], 'style-layer-toggles');
        enableHoverPopups(map, [...(C.extraLayers||[]), ...(C.styleLayers||[])]);

        // --- Existing schools layer interactions ---
        const LAYER = C.schoolsLayerId;
        map.on('mousemove', LAYER, () => map.getCanvas().style.cursor = 'pointer');
        map.on('mouseleave', LAYER, () => map.getCanvas().style.cursor = '');


        // --- Buffer clicking ---


        map.on('click', LAYER, (e) => {
          const f = pickTopFeature(e.features);
          if(!f) return;

          lastSchoolFeature = f; // ✅ store for slider re-render
        
          setSelected(map, f);
          updateDashboard(mapProps(f));
        
          // ===== Show click popup with image =====
          const html = buildSchoolClickPopupHTML(f);
          clickPopup.setLngLat(e.lngLat).setHTML(html).addTo(map);
        
          // ===== Update buffer on click =====
          const radiusMeters = 500; // <-- change buffer distance here
          const center = turf.point([e.lngLat.lng, e.lngLat.lat]); // works for point clicks
          const buffered = turf.buffer(center, radiusMeters, { units: 'meters' });
        
          map.getSource('school-buffer').setData(buffered);
        });
      });
  
      // ===== Landing / Framing modal logic =====
      const modal = document.getElementById('framing-modal');
      const btnExplore = document.getElementById('framing-explore');
      const btnClose = document.getElementById('framing-close');
      const openFraming = document.getElementById('open-framing');

      function showFraming(){
        if (!modal) return;
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // prevent background scroll
      }

      function hideFraming(){
        if (!modal) return;
        modal.classList.add('hidden');
        document.body.style.overflow = '';
        // ensure Mapbox redraws after overlay removal
        requestAnimationFrame(() => map.resize());
      }

      // Show on first load (every time)
      showFraming();

      // Close actions
      btnExplore?.addEventListener('click', hideFraming);
      btnClose?.addEventListener('click', hideFraming);

      // Click outside card to close
      modal?.addEventListener('click', (e) => {
        if (e.target === modal) hideFraming();
      });

      // Reopen from timeline "Framing" heading
      openFraming?.addEventListener('click', showFraming);

      // Escape key closes
      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) hideFraming();
      });
      
      
      
      
      // --- Selection state (existing) ---
      let selectedId = null;
      function setSelected(map, f){
        if(selectedId !== null){
          try{ map.setFeatureState({ source: f.source, id: selectedId }, { selected:false }); }catch(e){}
        }
        selectedId = f.id ?? null;
        if(selectedId !== null){
          try{ map.setFeatureState({ source: f.source, id: selectedId }, { selected:true }); }catch(e){}
        }
      }
      function pickTopFeature(features){ return (features && features[0]) || null; }
  
      // --- (B) Create checkboxes and wire visibility ---
      function buildLayerToggles(map, layers){
        const wrap = document.getElementById('layer-toggles');
        if(!wrap) return;
        wrap.innerHTML = '';
  
        layers.forEach(L => {
          // current visibility
          const vis = map.getLayoutProperty(L.id, 'visibility') || 'visible';
          const checked = vis !== 'none';
  
          const id = `toggle-${L.id}`;
          const label = document.createElement('label');
          label.setAttribute('for', id);
  
          const input = document.createElement('input');
          input.type = 'checkbox';
          input.id = id;
          input.checked = checked;
  
          input.addEventListener('change', () => {
            map.setLayoutProperty(L.id, 'visibility', input.checked ? 'visible' : 'none');
          });
  
          const span = document.createElement('span');
          span.textContent = L.label || L.id;
  
          label.appendChild(input);
          label.appendChild(span);
          wrap.appendChild(label);
        });
      }

      // --- (B.2) Create checkboxes and wire visibility ---
      function buildExistingLayerToggles(map, layers, containerId){
        const wrap = document.getElementById(containerId);
        if (!wrap || !layers.length) return;
        wrap.innerHTML = '';
      
        layers.forEach(L => {
          if (!map.getLayer(L.id)) return; // skip if not in style
      
          const vis = map.getLayoutProperty(L.id, 'visibility') || 'visible';
          const checked = vis !== 'none';
      
          const id = `toggle-style-${L.id}`;
          const label = document.createElement('label');
          label.setAttribute('for', id);
      
          const input = document.createElement('input');
          input.type = 'checkbox';
          input.id = id;
          input.checked = checked;
      
          input.addEventListener('change', () => {
            map.setLayoutProperty(L.id, 'visibility', input.checked ? 'visible' : 'none');
          });
      
          const span = document.createElement('span');
          span.textContent = L.label || L.id;
      
          label.appendChild(input);
          label.appendChild(span);
          wrap.appendChild(label);
        });
      }


  
      // --- (C) Hover popup for any configured layer ---
      function enableHoverPopups(map, layers){
        if (!layers.length) return;
      
        const popup = new mapboxgl.Popup({ closeButton:false, closeOnClick:false });
      
        layers
          .filter(L => L && L.id && L.enableHover !== false && map.getLayer(L.id))
          .forEach(L => {
            map.on('mousemove', L.id, (e) => {
              const f = e.features && e.features[0];
              if(!f) return;
              map.getCanvas().style.cursor = 'pointer';
              const html = buildPopupHTML(f.properties, L.hoverProps || []);
              popup.setLngLat(e.lngLat).setHTML(html).addTo(map);
            });
      
            map.on('mouseleave', L.id, () => {
              map.getCanvas().style.cursor = '';
              popup.remove();
            });
          });
      }
  
      function buildPopupHTML(props, hoverProps){
        if (!props) return '<div class="muted">No data</div>';
      
        // If nothing specified, show first 3 props (same behavior you have now)
        if (!hoverProps || !hoverProps.length) {
          const entries = Object.entries(props).slice(0, 3);
          return entries
            .map(([k, v]) => `<div><strong>${k}:</strong> ${v ?? '—'}</div>`)
            .join('');
        }
      
        return hoverProps.map(item => {
          // Backward compatible: allow hoverProps: ['POPULATION', 'MEMBER']
          const key = (typeof item === 'string') ? item : item.key;
          const label = (typeof item === 'string') ? item : (item.label || item.key);
      
          const val = props[key];
          if (val === undefined || val === null || val === '') return '';
          return `<div><strong>${label}:</strong> ${val}</div>`;
        }).join('');
      }
  
      // --- Dashboard + charts (your existing code) ---
      const el = {
        hint: document.querySelector('.select-hint'),
        metaRow: document.getElementById('meta-row'),
        kpiRow: document.getElementById('kpi-row'),
        level: document.getElementById('meta-level'),
        status: document.getElementById('meta-status'),
        type: document.getElementById('meta-type'),
        enr: document.getElementById('kpi-enrollment'),
        cap: document.getElementById('kpi-capacity'),
        util: document.getElementById('kpi-util'),
        rating: document.getElementById('kpi-rating'),
        notes: document.getElementById('notes'),
        clearBtn: document.getElementById('clear'),
        title: document.querySelector('#selected-school h3')
      };
  
      el.clearBtn.addEventListener('click', () => {
        if(el.hint) el.hint.style.display = '';
        el.metaRow.style.display = 'none';
        el.kpiRow.style.display = 'none';
        updatePie(null);
        updateBar(null);
        el.title.textContent = 'Selected School';
        lastSchoolFeature = null;
        selectedId = null;
        clickPopup.remove();
        const src = map.getSource('school-buffer');
        if (src) src.setData({ type: 'FeatureCollection', features: [] });
      });
  
      function updateDashboard(d){
        if(el.hint) el.hint.style.display = 'none';
        el.metaRow.style.display = 'flex';
        el.kpiRow.style.display = 'grid';
  
        el.title.textContent = d.name || 'Selected School';
        el.level.textContent = d.level ?? '—';
        el.type.textContent  = `Type: ${d.type ?? '—'}`;
        el.status.textContent= `Condition: ${d.condition ?? '—'}`;
  
        const cond = (d.condition || '').toString().toLowerCase().trim();
        let dotColor = 'var(--accent)';
        if (cond === 'active' || cond === 'good') dotColor = 'var(--good)';
        else if (cond === 'fair') dotColor = 'var(--warn)';
        else if (cond === 'innactive' || cond === 'inactive' || cond === 'bad' || cond === 'poor') dotColor = 'var(--bad)';
        document.documentElement.style.setProperty('--accent', dotColor);
  
        el.enr.textContent = d.enrollment ?? '—';
        el.cap.textContent = d.capacity ?? '—';
        el.util.textContent = d.util ?? '—';
        el.rating.textContent = d.rating ?? '—';
        el.notes.textContent = d.notes || '—';
  
        updatePie(d.composition);
        updateBar(d.facilities);
      }
  
      let pieChart, barChart;
      function updatePie(comp){
        const ctx = document.getElementById('pie-demo').getContext('2d');
      
        const empty = (!comp || !comp.values || comp.values.every(v => v === 0));
      
        const labels = empty ? ['No school selected'] : comp.labels;
        const data   = empty ? [1] : comp.values;
      
        const backgroundColor = empty
          ? [getComputedStyle(document.documentElement).getPropertyValue('--warn').trim()]
          : [
              getComputedStyle(document.documentElement).getPropertyValue('--baby').trim(),
              getComputedStyle(document.documentElement).getPropertyValue('--bad').trim()
            ];
      
        if(pieChart) pieChart.destroy();
      
        pieChart = new Chart(ctx, {
          type: 'pie',
          data: {
            labels,
            datasets: [{
              data,
              backgroundColor,
              radius: '70%',
              cutout: '55%'
            }]
          },
          options: {
            layout: {
              padding: {
                top: 10,
                bottom: 10,
                left: 10,
                right: 10
              }
            },
            plugins:{
              legend:{
                display:true,
                position: 'bottom',   // or 'right'
                labels:{
                  color: getComputedStyle(document.documentElement)
                    .getPropertyValue('--text')
                }
              },
              tooltip:{ enabled: !empty }
            },
            animation:false
          }
        });
      }


      function updateBar(fac){      
        const canvas = document.getElementById('bar-demo');      
        const ctx = canvas.getContext('2d');
        const labels = fac ? Object.keys(fac) : ['—','—','—'];
        const data = fac ? Object.values(fac) : [0,0,0];
        if(barChart) barChart.destroy();
        barChart = new Chart(ctx, {
          type: 'bar',
          data: { labels, datasets: [{ data }] },
          options:{
            scales:{
              x:{ ticks:{ color:getComputedStyle(document.documentElement).getPropertyValue('--muted') } },
              y:{ ticks:{ color:getComputedStyle(document.documentElement).getPropertyValue('--muted') }, beginAtZero:true, precision:0 }
            },
            plugins:{ legend:{ display:false } },
            animation:false
          }
        });
      }
  
      // data mappers (unchanged)
      function mapProps(f) {
        const p = (f && f.properties) || {};
        return {
          name: p.name || p.Name || 'Unnamed School',
          level: p.level || p.Address || 'Address',
          type: p.type || p.Type || 'Public',
          condition: p.condition || p.Status || 'Unknown',
          enrollment: num(p.enrollment || p.Year_Built),
          util: p.util || p.Neighborho || '—',
          capacity: p.capacity || p.Gross_Floo || '—',
          rating: p.rating || p.Annual_Car || '—',
          composition: parseComposition(p, selectedYear),
          facilities: parseFacilities(p),
          notes: p.notes || p.Notes || ''
        };
      }
      function num(x){ const n = Number(x); return Number.isFinite(n)? n : null; }

      function toNumber(v){
        if (v === null ) return 0;
        const cleaned = String(v).replace(/[$,%\s]/g, '').replace(/,/g, '');
        const n = Number(cleaned);
        return Number.isFinite(n) ? n : 0;
      }

      function parseComposition(p, year){
        // Convert 2014 → "14", 2025 → "25"
        const yy = String(year).slice(-2);
      
        // Fields like HS_G_14, HS_D_14 ... HS_G_25, HS_D_25
        const gradKey = `HS_G_${yy}`;
        const dropKey = `HS_D_${yy}`;
      
        const a = toNumber(p[gradKey]);
        const b = toNumber(p[dropKey]);
      
        const sum = a + b || 1;
      
        return {
          labels: ['Graduated', 'Dropped'],
          values: [a, b],
          percents: [a/sum*100, b/sum*100]
        };
      }
      
      function parseFacilities(p){
        return {
          '06-07': toNumber(p.Enrl_0607),
          '07-08': toNumber(p.Enrl_0708),
          '08-09': toNumber(p.Enrl_0809),
          '09-10': toNumber(p.Enrl_0910),
          '10-11': toNumber(p.Enrl_1011),
          '11-12': toNumber(p.Enrl_1112),
          '12-13': toNumber(p.Enrl_1213),
          '13-14': toNumber(p.Enrl_1314),
          '14-15': toNumber(p.Enrl_1415),
          '15-16': toNumber(p.Enrl_1516),
          '16-17': toNumber(p.Enrl_1617),
          '17-18': toNumber(p.Enrl_1718),
          '18-19': toNumber(p.Enrl_1819),
          '19-20': toNumber(p.Enrl_1920),
          '20-21': toNumber(p.Enrl_2021),
          '21-22': toNumber(p.Enrl_2122),
          '22-23': toNumber(p.Enrl_2223),
          '23-24': toNumber(p.Enrl_2324)
        };
      }
    }
  })();
  