(function () {
  'use strict';

  window.onload = function () {
    var form            = document.forms.contestForm,
        input           = form.K,
        output          = form.out,

        worker;

    worker = new Worker('contestWebWorker.js?' + Math.random());

    worker.onmessage = function (e) {
      if (e.data === 'done') {
        output.innerHTML = 'Done. Please see the result in the browser console (Ctrl+Shift+I).';
      } else {
        output.innerHTML = e.data + '<br>';
      }
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      output.innerHTML = 'Playing...';
      worker.postMessage(input.value);
    });
  }
})();