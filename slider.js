let barElem = document.getElementsByClassName("bar")[0];                        // полоска, по которой движется бегунок и на которой остается след
let pinElem = document.getElementsByClassName("pin")[0];                        // бегунок
let hintElem = document.getElementsByClassName("pin__hint")[0];                 // выбранное значение на слайдере
let traceElem = document.getElementsByClassName("trace")[0];                    // след после бегунка
let minLimitElem = document.getElementsByClassName("limit__item--min")[0];      // минимально возможное значение на слайдере
let maxLimitElem = document.getElementsByClassName("limit__item--max")[0];      // максимально возможное значение на слайдере

/* Стартовые параметры слайдера*/
const RANGE_SETTINGS = {
  min: 0,                       // Минимальное значение
  max: 100,                     // Максимальное значение
  step: 1,                      // Шаг
  start: 0,                     // Начальное значение
};

let range = {
  value: null,                      // Выбранное значение на слайдере
  _stepPx: 0,                       // Шаг в пикселях
  widthBar: 0,                      // Ширина всей полоски (barElem)

  /* Метод расчета и установки выбранного значения слайдера */
  setValue: function (pinLeft) {
    let newValue = Math.trunc(pinLeft / this._stepPx) * RANGE_SETTINGS.step + RANGE_SETTINGS.min;
    if (this.value !== newValue) {  // Проверка изменилось ли выбранное значение на слайдере или осталось прежним
      this.value = newValue;
      return true;
    }
    return false;
  },

  /* Метод возвращает расстояние (pinLeft) от левой границы полоски (barElem) до левой границы бегунка (pinElem).
    Устанавливает:
     - ширину всей полоски (widthBar)
     - шаг в пикселях (_stepPx)
  */
  init: function (width) {
    this.widthBar = width;
    this._stepPx = this.widthBar / ((RANGE_SETTINGS.max - RANGE_SETTINGS.min) / RANGE_SETTINGS.step);  // расчет размера шага в пикселях в зависимости от ширины полоски (widthBar)
    let pinLeft = (this._stepPx * (RANGE_SETTINGS.start - RANGE_SETTINGS.min)) / RANGE_SETTINGS.step;  // расстояние (pinLeft) от левой границы полоски (barElem) до левой границы бегунка (pinElem)
    return pinLeft;
  },
};

/* Регистрируем обработчик события 'load' на объекте window
   Событие load на объекте window наступает, когда загрузилась вся страница, включая стили, картинки и другие ресурсы
*/
window.addEventListener("load", function () {
  /* Обновление положения элементов слайдера в соответсвии со стартовыми значениями */
  updateRange(range.init(barElem.offsetWidth - pinElem.offsetWidth));

  /*Вывод максимально минимально возможных значений*/
  minLimitElem.textContent = RANGE_SETTINGS.min;
  maxLimitElem.textContent = RANGE_SETTINGS.max;
});

/* Регистрируем обработчик события 'mousedown' на объекте pinElem
   mousedown - кнопка мыши нажата над элементом
*/
pinElem.addEventListener("mousedown", function (event) {
  event.preventDefault();                                   // Отмена действий браузера по умолчанию  
  hintElem.classList.toggle("pin__hint--show");             // Переключение (добавление) класса для отображения подписи с текущим значением
  pinElem.classList.toggle("pin--press");                   // Переключение (добавление) класса для добавления стилей при удерживании элемента pinElem

  let xStartMove = event.clientX - pinElem.getBoundingClientRect().left; //  Расстояние от места захавата курсором элемента pinElem до левой границы элемента pinElem

  /* Регистрируем обработчик события 'mousemove' на объекте document, передаем функцию onMouseMove
     mousemove - каждое движение мыши над элементом
  */
  document.addEventListener("mousemove", onMouseMove);

  /* Регистрируем обработчик события 'mouseup' на объекте document  передаем функцию onMouseUp
     mouseup - кнопка мыши отпущена над элементом
  */
  document.addEventListener("mouseup", onMouseUp);

  /*Функция содержит действия, которые должны выполниться при каждом движении мыши*/
  function onMouseMove(event) {
    let pinNewLeft = event.clientX - xStartMove - barElem.getBoundingClientRect().left; // Новое расстояние от левой границы полоски (bar) до левой границы бегунка (pin)
    updateRange(pinNewLeft);// Обмновление положения элементов с учетом новго pinNewLeft
  }

  /*Функция содержит действия, которые должны выполниться при отпускании мыши*/
  function onMouseUp() {
    hintElem.classList.toggle("pin__hint--show");            // Переключение (удаление) класса, который был добавлен для отображения подписи с текущим значением
    pinElem.classList.toggle("pin--press");                  // Переключение (удаление) класса который был добавлен для добавления стилей при удерживании элемента pinElem

    /* Удаление обработчиков событий */
    document.removeEventListener("mouseup", onMouseUp);
    document.removeEventListener("mousemove", onMouseMove);
  }
});

/* Обновление положения элементов слайдера*/
function updateRange(pinLeft) {
  if (pinLeft < 0) pinLeft = 0;                                 // Если курсор мыши вышел за левую границу barElem
  if (pinLeft > range.widthBar) pinLeft = range.widthBar;       // Если курсор мыши вышел за правую границу barElem

  /*Обновление положения бегунка (pin)*/
  pinElem.style.left = pinLeft + "px";

  /*Обновление ширины следа бегунка (trace) */
  traceElem.style.width = pinLeft + pinElem.offsetWidth / 2 + "px";

  /*Обновление значения над бегунком ()*/
  if (range.setValue(pinLeft)) hintElem.textContent = range.value;
}
