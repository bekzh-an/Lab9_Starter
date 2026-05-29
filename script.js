// ── Custom Error Classes ──────────────────────────────────────────────────────

class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

class DivisionError extends ValidationError {
  constructor() {
    super('Cannot divide by zero', 'second-num');
    this.name = 'DivisionError';
  }
}

// ── Global Error Handler ──────────────────────────────────────────────────────

window.onerror = function(message, source, lineno, colno, error) {
  console.log(`Global error caught: "${message}" at line ${lineno}`);
  // could POST to a logging endpoint here, e.g.:
  // fetch('/log', { method: 'POST', body: JSON.stringify({ message, source, lineno }) });
  return true;
};

// ── Calculator ────────────────────────────────────────────────────────────────

let form = document.querySelector('form');
form.addEventListener('submit', e => {
  e.preventDefault();
  let output = document.querySelector('output');
  let firstNum = document.querySelector('#first-num').value.trim();
  let secondNum = document.querySelector('#second-num').value.trim();
  let operator = document.querySelector('#operator').value;

  try {
    if (firstNum === '' || secondNum === '') {
      throw new ValidationError('Both fields must be filled in', 'inputs');
    }
    if (isNaN(firstNum) || isNaN(secondNum)) {
      throw new ValidationError('Inputs must be numbers', 'inputs');
    }
    if (operator === '/' && Number(secondNum) === 0) {
      throw new DivisionError();
    }
    output.innerHTML = eval(`${firstNum} ${operator} ${secondNum}`);
  } catch (err) {
    if (err instanceof DivisionError) {
      output.innerHTML = `DivisionError: ${err.message}`;
    } else if (err instanceof ValidationError) {
      output.innerHTML = `ValidationError [${err.field}]: ${err.message}`;
    } else {
      output.innerHTML = `Error: ${err.message}`;
    }
    console.error(err);
  } finally {
    console.log('Calculator evaluation finished (finally)');
  }
});

// ── Console Buttons ───────────────────────────────────────────────────────────

let errorBtns = Array.from(document.querySelectorAll('#error-btns > button'));

const [
  btnLog, btnError, btnCount, btnWarn, btnAssert, btnClear,
  btnDir, btnDirxml, btnGroupStart, btnGroupEnd, btnTable,
  btnTimeStart, btnTimeEnd, btnTrace, btnGlobal
] = errorBtns;

const people = [
  { name: 'Alice', age: 25, role: 'Engineer' },
  { name: 'Bob',   age: 31, role: 'Designer' },
  { name: 'Carol', age: 28, role: 'PM' },
];

btnLog.addEventListener('click', () => {
  console.log('Hello from console.log:', { lab: 9, topic: 'errors' });
});

btnError.addEventListener('click', () => {
  console.error('console.error: something went wrong!');
});

btnCount.addEventListener('click', () => {
  console.count('button clicks');
});

btnWarn.addEventListener('click', () => {
  console.warn('console.warn: this API will be deprecated soon');
});

btnAssert.addEventListener('click', () => {
  console.assert(1 === 2, 'Assertion failed: 1 does not equal 2');
  console.assert(1 === 1, 'This will NOT print — assertion passed');
});

btnClear.addEventListener('click', () => {
  console.clear();
});

btnDir.addEventListener('click', () => {
  console.dir(document.querySelector('form'));
});

btnDirxml.addEventListener('click', () => {
  console.dirxml(document.querySelector('fieldset'));
});

btnGroupStart.addEventListener('click', () => {
  console.group('My Group');
  console.log('This log is inside the group');
  console.warn('This warning is inside the group too');
});

btnGroupEnd.addEventListener('click', () => {
  console.groupEnd();
  console.log('Back outside the group');
});

btnTable.addEventListener('click', () => {
  console.table(people);
});

btnTimeStart.addEventListener('click', () => {
  console.time('my-timer');
});

btnTimeEnd.addEventListener('click', () => {
  console.timeEnd('my-timer');
});

btnTrace.addEventListener('click', () => {
  function inner() { console.trace('Trace from inner()'); }
  function outer() { inner(); }
  outer();
});

btnGlobal.addEventListener('click', () => {
  // called outside try/catch so window.onerror picks it up
  setTimeout(() => {
    thisFunctionDoesNotExist(); // ReferenceError
  }, 0);
});