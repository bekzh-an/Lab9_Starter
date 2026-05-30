// ── Step 4: Custom Error class extending Error ────────────────────────────────

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

// ── Step 5: Global error handler (window.onerror) ─────────────────────────────

window.onerror = function(message, source, lineno, colno, error) {
  console.log(`Global error caught: "${message}" at line ${lineno}`);
  // In a real app you would POST this to a server; TrackJS captures it automatically
  return true;
};

// ── Step 3: Calculator with try/catch/finally ─────────────────────────────────

let form = document.querySelector('form');
form.addEventListener('submit', e => {
  e.preventDefault();
  let output = document.querySelector('output');
  let firstNum = document.querySelector('#first-num').value.trim();
  let secondNum = document.querySelector('#second-num').value.trim();
  let operator = document.querySelector('#operator').value;

  try {
    if (firstNum === '' || secondNum === '') {
      throw new ValidationError('Both fields must be filled in.');
    }
    if (isNaN(firstNum) || isNaN(secondNum)) {
      throw new ValidationError('Inputs must be valid numbers.');
    }
    if (operator === '/' && Number(secondNum) === 0) {
      throw new ValidationError('Cannot divide by zero.');
    }
    output.innerHTML = eval(`${firstNum} ${operator} ${secondNum}`);
  } catch (err) {
    output.innerHTML = `${err.name}: ${err.message}`;
    console.error(err);
  } finally {
    console.log('Calculator evaluation finished (finally)');
  }
});

// ── Step 2: Console API buttons ───────────────────────────────────────────────

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
  console.log('console.log demo:', { lab: 9, topic: 'errors' });
});

btnError.addEventListener('click', () => {
  console.error('console.error demo: simulated failure');
});

btnCount.addEventListener('click', () => {
  console.count('clicked');
});

btnWarn.addEventListener('click', () => {
  console.warn('console.warn demo: this API is deprecated');
});

btnAssert.addEventListener('click', () => {
  console.assert(1 === 2, 'Assertion failed: 1 !== 2');
  console.assert(1 === 1, 'This will NOT print');
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
  console.group('Error Report');
  console.log('inside the group');
  console.warn('warning inside the group');
});

btnGroupEnd.addEventListener('click', () => {
  console.groupEnd();
  console.log('back outside the group');
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
  function inner() { console.trace('trace from inner()'); }
  function outer() { inner(); }
  outer();
});

// Fires outside try/catch so it bubbles up to window.onerror
btnGlobal.addEventListener('click', () => {
  setTimeout(() => {
    thisFunctionDoesNotExist(); // ReferenceError
  }, 0);
});