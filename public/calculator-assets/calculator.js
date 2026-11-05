// states: first -> operator -> second
const debug = false;

let state;
let display;

let first;
let second;
let operator = "?";
let lastSecond = null;

const init = () => {
  state = "first";
  display = "0";
  first = "0";
  second = "0";
  operator = "?";
  lastSecond = null;
};

const render = () => {
  document.getElementById("screen").innerHTML = display;

  if (debug) {
    console.log(
      `[${state}] first:${first}, second:${second}, operator:${operator}, display:${display}`,
    );
  }
};

const numberClick = (num) => {
  switch (state) {
    case "first":
      if (display === "0") {
        display = String(num);
      } else {
        display += String(num);
      }

      break;

    case "operator":
      display += String(num);
      state = "second";

      break;

    case "second":
      display += String(num);

      break;
  }

  render();
};

const decimalClick = () => {
  if (state === "operator") {
    display += "0.";
    state = "second";
  } else {
    // เอาเฉพาะตัวเลขหลังเครื่องหมาย
    const parts = display.split(" ");

    if (!parts[parts.length - 1].includes(".")) {
      display += ".";
    }
  }

  render();
};

const operatorClick = (op) => {
  console.log(op);

  if (state === "first") {
    first = Number(display);

    operator = op;

    display = `${first} ${operator} `;

    state = "operator";

    render();

    return;
  }

  // ถ้ากด operator ซ้ำ
  if (state === "operator") {
    operator = op;

    display = `${first} ${operator} `;

    render();

    return;
  }

  if (state === "second") {
    const parts = display.split(" ");

    second = Number(parts[parts.length - 1]);

    const result = calculate(first, operator, second);

    first = result;

    operator = op;

    display = `${first} ${operator} `;

    state = "operator";

    render();
  }
};

const calculate = (a, op, b) => {
  a = Number(a);
  b = Number(b);

  switch (op) {
    case "+":
      return a + b;

    case "-":
      return a - b;

    case "*":
      return a * b;

    case "/":
      if (b === 0) {
        return "Error";
      }

      return a / b;

    default:
      return b;
  }
};

const equalClick = () => {
  console.log("=");

  if (state === "second") {
    const parts = display.split(" ");

    second = Number(parts[parts.length - 1]);

    const result = calculate(first, operator, second);

    display = String(result);

    first = result;

    lastSecond = second;

    state = "first";

    render();

    return;
  }

  // กด = ซ้ำ

  if (state === "first" && operator !== "?" && lastSecond !== null) {
    const result = calculate(first, operator, lastSecond);

    display = String(result);

    first = result;

    render();
  }
};

const ceClick = () => {
  console.log("CE");

  init();

  render();
};

const signClick = () => {
  if (display === "0") {
    return;
  }

  const parts = display.split(" ");

  let last = parts[parts.length - 1];

  if (last.startsWith("-")) {
    last = last.substring(1);
  } else {
    last = "-" + last;
  }

  parts[parts.length - 1] = last;

  display = parts.join(" ");

  render();
};

const sqrtClick = () => {
  const parts = display.split(" ");

  const value = Number(parts[parts.length - 1]);

  if (value < 0) {
    display = "Error";
  } else {
    display = String(Math.sqrt(value));
  }

  state = "first";
  first = Number(display);

  render();
};

const reciprocalClick = () => {
  const parts = display.split(" ");

  const value = Number(parts[parts.length - 1]);

  if (value === 0) {
    display = "Error";
  } else {
    display = String(1 / value);
  }

  state = "first";
  first = Number(display);

  render();
};

const percentClick = () => {
  const parts = display.split(" ");

  const value = Number(parts[parts.length - 1]);

  display = String(value / 100);

  state = "first";
  first = Number(display);

  render();
};

document.addEventListener("keydown", (e) => {
  if (e.key >= "0" && e.key <= "9") {
    numberClick(e.key);

    return;
  }

  if (e.key === "+") {
    operatorClick("+");

    return;
  }

  if (e.key === "-") {
    operatorClick("-");

    return;
  }

  if (e.key === "*") {
    operatorClick("*");

    return;
  }

  if (e.key === "/") {
    operatorClick("/");

    return;
  }

  if (e.key === ".") {
    decimalClick();

    return;
  }

  if (e.key === "=" || e.key === "Enter") {
    equalClick();

    return;
  }

  if (e.key === "Backspace" || e.key === "Escape") {
    ceClick();

    return;
  }

  if (e.key === "%") {
    percentClick();

    return;
  }

  if (e.key === "r" || e.key === "R") {
    sqrtClick();

    return;
  }

  if (e.key === "i" || e.key === "I") {
    reciprocalClick();

    return;
  }

  if (e.key === "n" || e.key === "N") {
    signClick();

    return;
  }
});

document.addEventListener("DOMContentLoaded", () => {
  init();

  render();
});
