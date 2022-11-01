/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
import Api from '../tools/api';
import {__, allPass, compose, gt, ifElse, lt, prop, tap, test} from "ramda";

const api = new Api();
// геттеры
const getLength = prop('length');
const getResultFromObject = prop("result")
const getNumberFromApi = num => api.get('https://api.tech/numbers/base', {from: 10, to: 2, number: num})
const getAnimalFromApiById = id => api.get(`https://animals.tech/${id}`, {})

// предикаты
const isNumberSymbols = test(/^[1-9][\d.]+$/i);
const isValueLess10 = lt(__, 10);
const isValueMore2 = gt(__, 2);
const isValueValidNumber = allPass([
  compose(isValueLess10, getLength),
  compose(isValueMore2, getLength),
  isNumberSymbols
])

// вспомогательные функции
const stringToNumber = str => Number(str)
const roundNumber = num => Math.round(num)
const numberPowBy2 = num => Math.pow(num, 2)
const numberMod3 = num => num % 3

const processSequence = ({value, writeLog, handleSuccess, handleError}) => {
  // tap для логирования
  const tapLog = tap(writeLog)
  // вывод ошибки
  const setError = () => handleError(`ValidationError`)

  const getAnimalFromApi = id => {
    getNumberFromApi(id)
       .then(getResultFromObject)
       .then(tapLog)
       .then(getLength)
       .then(tapLog)
       .then(numberPowBy2)
       .then(tapLog)
       .then(numberMod3)
       .then(tapLog)
       .then(getAnimalFromApiById)
       .then(getResultFromObject)
       .then(handleSuccess)
       .catch(handleError)
       .catch(() => {})
  }

  const getAnimal = compose(
     getAnimalFromApi,
     tapLog,
     roundNumber,
     stringToNumber
  )

  const validateNumber = ifElse(
     isValueValidNumber,
     getAnimal,
     setError
  )

  const start = compose(validateNumber, tapLog)
  start(value)
}

export default processSequence;