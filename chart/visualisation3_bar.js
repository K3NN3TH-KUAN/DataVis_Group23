// Horizontal bar chart for Visualisation 3 info panel (jurisdiction rates)
(function(){
  var containerId = 'chart3-bars';
  var csvPath = 'data/visualisation3.csv';
  var state = { data: null, svg: null, g: null, margin: { top: 48, right: 40, bottom: 36, left: 90 }, width: 0, height: 0 };

  function getContainer(){ return document.getElementById(containerId); }
  function currentYear(){
    var sel = document.getElementById('year3-select');
    var v = sel && sel.value ? +sel.value : null;
    if (v) return v;
    // fallback to latest year in data
    if (state.data){ return d3.max(state.data, function(d){ return d.YEAR; }); }
    return 2024;
  }

  function ensureSvg(){
    var host = getContainer();
    if (!host) return;
    var totalW = host.clientWidth || 600;
    var totalH = host.clientHeight || 280;
    state.width = totalW - state.margin.left - state.margin.right;
    state.height = totalH - state.margin.top - state.margin.bottom;
    if (!state.svg){
      state.svg = d3.select(host)
        .append('svg')
        .attr('width', totalW)
        .attr('height', totalH)
        .attr('preserveAspectRatio','none')
        .style('font-family','Segoe UI, Arial, sans-serif');
      state.g = state.svg.append('g').attr('transform','translate(' + state.margin.left + ',' + state.margin.top + ')');
    } else {
      state.svg.attr('width', totalW).attr('height', totalH);
    }
  }

  function loadData(cb){
    if (state.data) { cb(); return; }
    d3.csv(csvPath).then(function(rows){
      state.data = rows.map(function(r){
        return {
          YEAR: +r['YEAR'],
          JURISDICTION: r['JURISDICTION'],
          RATE: +r['LICENCES_PER_10,000']
        };
      });
      cb();
    });
  }

  function renderBars(year){
    ensureSvg();
    if (!state.g || !state.data) return;

    var rows = state.data.filter(function(d){ return d.YEAR === year; });
    rows.sort(function(a,b){ return d3.descending(a.RATE, b.RATE); });

    var y = d3.scaleBand().domain(rows.map(function(d){ return d.JURISDICTION; })).range([0, state.height]).padding(0.2);
    var xMax = d3.max(rows, function(d){ return d.RATE; }) || 0;
    var x = d3.scaleLinear().domain([0, xMax * 1.05]).nice().range([0, state.width]);

    // Color scale similar to the map (trimmed YlGnBu)
    function trimSequential(interp, start, end) { return function(t){ return interp(start + (end - start) * t); }; }
    var cmin = d3.min(rows, function(d){ return d.RATE; }) || 0;
    var cmax = d3.max(rows, function(d){ return d.RATE; }) || 1;
    if (!isFinite(cmin) || !isFinite(cmax) || cmin === cmax) { cmin = Math.max(0, cmin || 0); cmax = cmin + 1; }
    var color = d3.scaleSequential(trimSequential(d3.interpolateYlGnBu, 0.15, 0.75)).domain([cmin, cmax]);

    // Clear
    state.g.selectAll('*').remove();

    // Title
    state.svg.selectAll('.chart-title').remove();
    state.svg.append('text')
      .attr('class','chart-title')
      .attr('x', state.margin.left)
      .attr('y', 22)
      .style('font-size','15px')
      .style('font-weight','700')
      .style('fill','#000000')
      .text('Fines per 10,000 by Jurisdiction');

    // Gridlines (vertical dotted)
    var grid = d3.axisBottom(x).ticks(6).tickSize(state.height).tickFormat('');
    state.g.append('g')
      .attr('class','grid')
      .attr('transform','translate(0,0)')
      .call(grid)
      .selectAll('line')
      .attr('stroke','#d9dde6')
      .attr('stroke-dasharray','3,3');
    state.g.selectAll('.grid path').remove();

    // Bars
    var barColor = null;
    state.g.selectAll('.bar')
      .data(rows)
      .enter()
      .append('rect')
      .attr('class','bar')
      .attr('x', 0)
      .attr('y', function(d){ return y(d.JURISDICTION); })
      .attr('width', function(d){ return x(d.RATE); })
      .attr('height', y.bandwidth())
      .attr('rx', 3)
      .attr('fill', function(d){ return color(d.RATE); });

    // Left labels (jurisdictions)
    state.g.append('g')
      .attr('class','y-axis')
      .call(d3.axisLeft(y))
      .selectAll('text')
      .style('fill','#0f172a')
      .style('font-size','12px');

    // Values on bar ends
    state.g.selectAll('.val')
      .data(rows)
      .enter()
      .append('text')
      .attr('class','val')
      .attr('x', function(d){ return x(d.RATE) + 6; })
      .attr('y', function(d){ return (y(d.JURISDICTION) || 0) + y.bandwidth()/2 + 4; })
      .style('font-size','12px')
      .style('fill','#0f172a')
      .text(function(d){ return Math.round(d.RATE); });

    // Bottom x-axis (optional; subtle)
    var ax = state.g.append('g')
      .attr('transform','translate(0,' + state.height + ')')
      .call(d3.axisBottom(x).ticks(6));
    ax.selectAll('text').style('fill','#0f172a').style('font-size','11px');
    ax.selectAll('path, line').attr('stroke','#cbd5e1');

    // Axis label
    state.svg.selectAll('.x-axis-title').remove();
    state.svg.append('text')
      .attr('class','x-axis-title')
      .attr('x', state.margin.left + state.width / 2)
      .attr('y', state.margin.top + state.height + state.margin.bottom - 6)
      .attr('text-anchor','middle')
      .style('fill','#0f172a')
      .style('font-size','12px')
      .text('Rate per 10,000');
  }

  function draw(){ loadData(function(){ renderBars(currentYear()); }); }

  // Toggle behavior
  function setupToggle(){
    var dotDesc = document.getElementById('btn-desc');
    var dotBars = document.getElementById('btn-bars');
    var viewDesc = document.getElementById('info3-desc');
    var viewBars = document.getElementById('info3-bars');
    var actions = document.querySelector('#blank3-section .section-actions');
    if (!dotDesc || !dotBars || !viewDesc || !viewBars) return;
    function activateDesc(){
      dotDesc.classList.add('active'); dotBars.classList.remove('active');
      dotDesc.setAttribute('aria-selected','true'); dotBars.setAttribute('aria-selected','false');
      viewDesc.removeAttribute('hidden'); viewDesc.classList.add('active');
      viewBars.setAttribute('hidden',''); viewBars.classList.remove('active');
      if (actions) { actions.style.display = 'flex'; }
    }
    function activateBars(){
      dotBars.classList.add('active'); dotDesc.classList.remove('active');
      dotBars.setAttribute('aria-selected','true'); dotDesc.setAttribute('aria-selected','false');
      viewBars.removeAttribute('hidden'); viewBars.classList.add('active');
      viewDesc.setAttribute('hidden',''); viewDesc.classList.remove('active');
      if (actions) { actions.style.display = 'none'; }
      draw();
    }
    dotDesc.addEventListener('click', activateDesc);
    dotBars.addEventListener('click', activateBars);
  }

  // Update chart when year changes (if bars are visible)
  function hookYearSelect(){
    var sel = document.getElementById('year3-select');
    if (!sel) return;
    sel.addEventListener('change', function(){
      var viewBars = document.getElementById('info3-bars');
      if (viewBars && !viewBars.hasAttribute('hidden')) { draw(); }
    });
  }

  // Resize handling when bars are visible
  window.addEventListener('resize', function(){
    var viewBars = document.getElementById('info3-bars');
    if (viewBars && !viewBars.hasAttribute('hidden')) { draw(); }
  });

  // Init
  document.addEventListener('DOMContentLoaded', function(){ setupToggle(); hookYearSelect(); });
})();