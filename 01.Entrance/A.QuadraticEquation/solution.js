(function () {
  'use strict';

  function QuadraticEquation(a, b, c) {
    if (!(this instanceof QuadraticEquation)) {
      throw new Error('Missing "new" keyword.');
    }

    if (arguments.length < 3) {
      throw new TypeError('Not enough arguments to QuadraticEquation');
    }

    this.a = parseFloat(a);
    this.b = parseFloat(b);
    this.c = parseFloat(c);

    if (isNaN(a + b + c)) {
      throw new TypeError('Invalid input data.');
    } else if (a == 0) {
      throw new TypeError("The first coefficient can't be equal to 0.");
    }

    this.equation = '';
    if (this.a != 1) this.equation += this.a;
    this.equation +=  'x<sup>2</sup>';
    if (this.b) {
      this.equation += ' + ';
      if (this.b != 1) this.equation += this.b;
      this.equation += 'x';
    }
    if (this.c) this.equation += ' + ' + this.c;
    this.equation += ' = 0';
  }

  QuadraticEquation.prototype.solve = function () {
    var discriminant,
        roots,
        solution;

    discriminant = Math.pow(this.b, 2) - 4 * this.a * this.c;

    if (discriminant < 0) {
      solution = 'No roots';
    }

    if (discriminant === 0) {
      roots = -this.b / (2 * this.a);
      solution = 'x<sub>1</sub> = x<sub>2</sub> = ' + roots;
    }

    if (discriminant > 0) {
      roots = [
        (-this.b + Math.sqrt(discriminant)) / (2 * this.a),
        (-this.b - Math.sqrt(discriminant)) / (2 * this.a)
      ];
      solution = 'x<sub>1</sub> = ' + roots[0] + '<br>x<sub>2</sub> = ' + roots[1];
    }

    return solution;
  };

  window.onload = function () {
    var form   = document.forms.equation,
        inputA = form.a,
        inputB = form.b,
        inputC = form.c,
        output = form.out;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!inputA.value) inputA.value = 0;
      if (!inputB.value) inputB.value = 0;
      if (!inputC.value) inputC.value = 0;

      output.innerHTML = '';

      try {
        var solver = new QuadraticEquation(inputA.value, inputB.value, inputC.value);
        output.innerHTML += 'The equation: ' + solver.equation + '<br>';
        output.innerHTML += solver.solve();
      } catch (e) {
        output.innerHTML = e.message;
      }
    });
  }
})();