(function () {
  'use strict';

  function QuadEquation(form) {
    if (!(this instanceof QuadEquation)) {
      throw new Error('Missing "new" keyword.');
    }

    this.form = form;
    this.a = form.a;
    this.b = form.b;
    this.c = form.c;
    this.output = form.out;

    this.form.addEventListener('submit', function (e) {
      e.preventDefault();
      this.solve();
    }.bind(this));
  }

  QuadEquation.prototype.solve = function () {
    var a, b, c,
        discriminant,
        roots,
        solution;

    a = parseFloat(this.a.value);
    b = parseFloat(this.b.value);
    c = parseFloat(this.c.value);

    if (isNaN(a + b + c)) {
      solution = 'Invalid input data.';
    } else if (a === 0) {
      solution = "The first coefficient can't be equal to 0.";
    } else {
      discriminant = Math.pow(b, 2) - 4 * a * c;

      if (discriminant < 0) {
        solution = 'No roots';
      }

      if (discriminant === 0) {
        roots = -b / (2 * a);
        solution = 'x<sub>1</sub> = x<sub>2</sub> = ' + roots;
      }

      if (discriminant > 0) {
        roots = [
          (-b + Math.sqrt(discriminant)) / (2 * a),
          (-b - Math.sqrt(discriminant)) / (2 * a)
        ];
        solution = 'x<sub>1</sub> = ' + roots[0] + '<br>x<sub>2</sub> = ' + roots[1];
      }
    }

    this.output.innerHTML = solution;
  };

  window.onload = function () {
    var form = document.forms.equation;
    new QuadEquation(form);
  }
})();