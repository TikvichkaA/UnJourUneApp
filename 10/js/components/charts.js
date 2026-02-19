/**
 * SubTracker - Wrapper Chart.js
 */
var ChartsComponent = (function() {
  'use strict';

  var instances = {};

  function destroy(canvasId) {
    if (instances[canvasId]) {
      instances[canvasId].destroy();
      delete instances[canvasId];
    }
  }

  function createCanvas(container, id, height) {
    var wrapper = document.createElement('div');
    wrapper.style.position = 'relative';
    wrapper.style.height = (height || 250) + 'px';
    var canvas = document.createElement('canvas');
    canvas.id = id;
    wrapper.appendChild(canvas);
    container.appendChild(wrapper);
    return canvas;
  }

  function bar(container, id, labels, datasets, opts) {
    destroy(id);
    var canvas = createCanvas(container, id, opts && opts.height);
    instances[id] = new Chart(canvas, {
      type: 'bar',
      data: { labels: labels, datasets: datasets },
      options: mergeOpts({
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: datasets.length > 1 } },
        scales: {
          y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
          x: { grid: { display: false } }
        }
      }, opts)
    });
    return instances[id];
  }

  function horizontalBar(container, id, labels, datasets, opts) {
    destroy(id);
    var canvas = createCanvas(container, id, opts && opts.height);
    instances[id] = new Chart(canvas, {
      type: 'bar',
      data: { labels: labels, datasets: datasets },
      options: mergeOpts({
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { beginAtZero: true, max: 100, grid: { color: 'rgba(0,0,0,0.05)' } },
          y: { grid: { display: false } }
        }
      }, opts)
    });
    return instances[id];
  }

  function pie(container, id, labels, data, colors, opts) {
    destroy(id);
    var canvas = createCanvas(container, id, opts && opts.height);
    instances[id] = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{ data: data, backgroundColor: colors, borderWidth: 2, borderColor: '#fff' }]
      },
      options: mergeOpts({
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom', labels: { font: { size: 11 } } } }
      }, opts)
    });
    return instances[id];
  }

  function line(container, id, labels, datasets, opts) {
    destroy(id);
    var canvas = createCanvas(container, id, opts && opts.height);
    instances[id] = new Chart(canvas, {
      type: 'line',
      data: { labels: labels, datasets: datasets },
      options: mergeOpts({
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: datasets.length > 1 } },
        scales: {
          y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
          x: { grid: { display: false } }
        },
        elements: { line: { tension: 0.3 }, point: { radius: 3 } }
      }, opts)
    });
    return instances[id];
  }

  function mergeOpts(defaults, custom) {
    if (!custom || !custom.chartOptions) return defaults;
    return Object.assign({}, defaults, custom.chartOptions);
  }

  function destroyAll() {
    for (var key in instances) {
      if (instances.hasOwnProperty(key)) {
        instances[key].destroy();
      }
    }
    instances = {};
  }

  return {
    bar: bar,
    horizontalBar: horizontalBar,
    pie: pie,
    line: line,
    destroy: destroy,
    destroyAll: destroyAll
  };
})();
