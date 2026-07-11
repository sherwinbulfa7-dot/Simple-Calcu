const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');
let expression = '';

const formatDisplay = (value) => {
  if (value === '') return '0';
  return value;
};

const updateDisplay = () => {
  display.textContent = formatDisplay(expression);
};

const safeEvaluate = (expr) => {
  try {
    const sanitized = expr.replace(/[^0-9.+\-*/()%]/g, '');
    const result = Function(`"use strict"; return (${sanitized})`)();
    return Number.isFinite(result) ? String(result) : 'Error';
  } catch {
    return 'Error';
  }
};

const appendValue = (value) => {
  if (expression === 'Error') {
    expression = '';
  }

  if (value === '.' && /\.[0-9]*$/.test(expression)) {
    return;
  }

  if (/^[+\-*/%]$/.test(value) && expression === '') {
    return;
  }

  const lastChar = expression.slice(-1);
  if (/^[+\-*/%]$/.test(value) && /^[+\-*/%]$/.test(lastChar)) {
    expression = expression.slice(0, -1) + value;
  } else {
    expression += value;
  }
};

const clearExpression = () => {
  expression = '';
};

const deleteLast = () => {
  if (expression === 'Error') {
    expression = '';
  } else {
    expression = expression.slice(0, -1);
  }
};

const calculateResult = () => {
  if (expression === '' || expression === 'Error') {
    return;
  }
  const result = safeEvaluate(expression);
  expression = result;
};

buttons.forEach((button) => {
  button.addEventListener('click', () => {
    const value = button.dataset.value;
    const action = button.dataset.action;

    if (action === 'clear') {
      clearExpression();
    } else if (action === 'delete') {
      deleteLast();
    } else if (action === 'calculate') {
      calculateResult();
    } else if (value) {
      appendValue(value);
    }

    updateDisplay();
  });
});

window.addEventListener('keydown', (event) => {
  const { key } = event;
  if (/^[0-9]$/.test(key) || key === '.' || ['+', '-', '*', '/', '%'].includes(key)) {
    event.preventDefault();
    appendValue(key);
    updateDisplay();
  }

  if (key === 'Enter' || key === '=') {
    event.preventDefault();
    calculateResult();
    updateDisplay();
  }

  if (key === 'Backspace') {
    event.preventDefault();
    deleteLast();
    updateDisplay();
  }

  if (key.toLowerCase() === 'c') {
    event.preventDefault();
    clearExpression();
    updateDisplay();
  }
});

updateDisplay();
