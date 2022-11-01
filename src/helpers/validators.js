/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

import {
    __,
    all,
    allPass,
    any,
    compose,
    converge,
    count,
    countBy,
    equals,
    gte,
    identity,
    lte,
    not,
    prop,
    values
} from 'ramda'

// геттеры для цветов
const getArrayFromElements = (...params) => [...params];
const getStarColor = prop('star');
const getSquareColor = prop('square');
const getTriangleColor = prop('triangle');
const getCircleColor = prop('circle');
const getAllFiguresColor = converge(getArrayFromElements, [getStarColor, getSquareColor, getTriangleColor, getCircleColor])

// предикаты для цветов
const isWhiteColor = equals('white');
const isRedColor = equals('red');
const isGreenColor = equals('green');
const isOrangeColor = equals('orange');
const isBlueColor = equals('blue');
const isNotWhiteColor = compose(not, isWhiteColor);
const isNotOrangeColor = compose(not, isOrangeColor);
const isNotGreenColor = compose(not, isGreenColor);

// предикаты для фигур по цветам
const isRedStar = compose(isRedColor, getStarColor);
const isWhiteStar = compose(isWhiteColor, getStarColor);
const isGreenTriangle = compose(isGreenColor, getTriangleColor);
const isGreenSquare = compose(isGreenColor, getSquareColor);
const isOrangeSquare = compose(isOrangeColor, getSquareColor);
const isBlueCircle = compose(isBlueColor, getCircleColor);
const isAllWhiteFigures = compose(all(isWhiteColor), getArrayFromElements)
const isWhiteTriangleAndCircle = converge(isAllWhiteFigures, [getTriangleColor, getCircleColor])

// геттеры количества фигур по цветам
const groupFiguresByColor = countBy(identity)
const getFiguresColorsCount = compose(groupFiguresByColor, getAllFiguresColor)
const getRedFigures = prop("red")
const getGreenFigures = prop("green")
const getBlueFigures = prop("blue")

const getGreenFiguresCount = compose(getGreenFigures, getFiguresColorsCount)
const getBlueFiguresCount = compose(getBlueFigures, getFiguresColorsCount)
const getRedFiguresCount = compose(getRedFigures, getFiguresColorsCount)
const getWhiteFiguresCount = compose(count(isWhiteColor), getAllFiguresColor)
const getNotOrangeFiguresCount = compose(count(isNotOrangeColor), getAllFiguresColor)
const getNotGreenFiguresCount = compose(count(isNotGreenColor), getAllFiguresColor)

// предикаты количества фигур по цветам
const moreThen3 = gte(__, 3)
const isMoreThen3EqualColor = compose(any(moreThen3), values, getFiguresColorsCount)
const isLessThen1WhiteColor = compose(lte(__, 1), getWhiteFiguresCount)

const isTwoGreenFigures = compose(equals(2), getGreenFiguresCount)
const isOneRedFigure = compose(equals(1), getRedFiguresCount)


// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = allPass([
    isWhiteTriangleAndCircle,
    isRedStar,
    isGreenSquare
])

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = compose(lte(2), getGreenFiguresCount)

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = converge(equals, [getRedFiguresCount, getBlueFiguresCount]);

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = allPass([
    isBlueCircle,
    isRedStar,
    isOrangeSquare
]);

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = allPass([
    isMoreThen3EqualColor,
    isLessThen1WhiteColor
]);

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = allPass([
    isGreenTriangle,
    isTwoGreenFigures,
    isOneRedFigure
])

// 7. Все фигуры оранжевые.
export const validateFieldN7 = compose(equals(0), getNotOrangeFiguresCount)

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = allPass([
    compose(not, isWhiteStar),
    compose(not, isRedStar)
])

// 9. Все фигуры зеленые.
export const validateFieldN9 = compose(equals(0), getNotGreenFiguresCount)

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = allPass([
    converge(equals, [getSquareColor, getTriangleColor]),
    compose(isNotWhiteColor, getSquareColor),
    compose(isNotWhiteColor, getTriangleColor)
]);