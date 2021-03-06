/*
Portions Copyright (c) 2014-2020 Philip Bergqvist
Portions Copyright (c) 2014 Reece Selwood

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

function sparklines(selector, opts) {
  opts = opts || {};

  function makeChart(values, parent) {
    parent.innerHTML = '';

    var width, height;
    if (opts.inline) {
      width = opts.width || parent.offsetWidth || 50;
      height = opts.height || parent.offsetHeight || getDefaultFontSize(parent);
    } else {
      width = 100; //opts.width || parent.offsetWidth || 50;
      height = 100; //opts.height || parent.offsetHeight || 12;
    }

    var max = Math.max.apply(null, values);
    var min = Math.min.apply(null, values);

    function c(x) {
      var s = height / (max - min);
      return height - (s * (x - min));
    }

    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('transform', 'translate(0,1)');
    if (opts.inline) {
      svg.setAttribute('width', width);
      svg.setAttribute('height', height);
    } else {
      svg.setAttribute('viewBox', '0,0,'+width+','+height);
      svg.setAttribute('preserveAspectRatio', 'none');
    }

    var offset = width / (values.length - 1);
    var path = 'M0 ' + c(values[0]).toFixed(2);
    for (var i = 0; i < values.length; i++) {
      path += ' L ' + (i * offset) + ' ' + (c(values[i]).toFixed(2));
    }

    var pathElm = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathElm.setAttribute('d', path);
    pathElm.setAttribute('fill', 'none');
    pathElm.setAttribute('vector-effect', 'non-scaling-stroke');
    svg.appendChild(pathElm);

    if (opts.filled) {
      path += ' V ' + height;
      path += ' L 0 ' + height + ' Z';
      var e = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      e.setAttribute('d', path);
      e.setAttribute('stroke', 'none');
      svg.appendChild(e);
    }

    parent.appendChild(svg);
  }

  function getDefaultFontSize(pa) {
    pa= pa || document.body;
    var who= document.createElement('div');

    who.style.cssText='display:inline-block; padding:0; line-height:1; position:absolute; visibility:hidden; font-size:1em';

    who.appendChild(document.createTextNode('M'));
    pa.appendChild(who);
    var lineHeight = who.offsetHeight;
    pa.removeChild(who);
    return lineHeight;
  }

  var elms = document.querySelectorAll(selector);
  for (var i = 0; i < elms.length; i++) {
    var e = elms[i];
    if (e.dataset.values) {
      var values = e.dataset.values.split(',').map(function(d) { return parseFloat(d); });
      makeChart(values, e);
    }
  }
}