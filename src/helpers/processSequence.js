import Api from '../tools/api';
import {
  allPass,
  gt,
  lt,
  length,
  test,
  pipe,
  __,
  prop,
  mathMod,
  andThen,
  otherwise,
} from 'ramda';

const api = new Api();

const API_NUMBERS = 'https://api.tech/numbers/base';
const API_ANIMALS = 'https://animals.tech/';

const isLengthOk = str => gt(length(str), 2) && lt(length(str), 10);
const isNumeric = test(/^[0-9]+\.?[0-9]*$/);
const isPositive = x => Number(x) > 0;

const round = x => Math.round(Number(x));
const toBinaryParams = number => ({ from: 10, to: 2, number });
const square = x => x ** 2;
const mod3 = x => mathMod(x, 3);
const getResult = prop('result');

const processSequence = ({ value, writeLog, handleSuccess, handleError }) => {
  const validate = allPass([isLengthOk, isNumeric, isPositive]);

  const fail = () => handleError('ValidationError');

  const handle = pipe(
    Number,
    round,
    n => {
      writeLog(n);
      return api.get(API_NUMBERS, toBinaryParams(n));
    },
    andThen(res => {
      const binary = getResult(res);
      writeLog(binary);
      const len = binary.length;
      writeLog(len);
      const sq = square(len);
      writeLog(sq);
      const mod = mod3(sq);
      writeLog(mod);
      return api.get(`${API_ANIMALS}/${mod}`);
    }),
    andThen(res => handleSuccess(getResult(res))),
    otherwise(handleError)
  );

  writeLog(value);
  validate(value) ? handle(value) : fail();
};

export default processSequence;
