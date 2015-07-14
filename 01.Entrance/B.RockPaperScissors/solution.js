(function () {
  'use strict';

  window.onload = function () {
    var form      = document.forms.contestForm,
        input     = form.K,
        output    = form.out,

        indicator = document.getElementById('indicator'),

        worker;

    worker = new Worker('contestWebWorker.js?' + Math.random());

    worker.onmessage = function (e) {
      if (e.data === 'done') {
        indicator.hidden = true;
        output.innerHTML += 'Done. Please see the result in the browser console (Ctrl+Shift+I).';
      } else {
        console.log(e.data);
      }
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      output.innerHTML = '';
      indicator.hidden = false;
      console.clear();
      worker.postMessage(input.value);
    });
  }
})();