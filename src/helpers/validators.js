import {
    allPass,
    compose,
    equals,
    prop,
    values,
    countBy,
    identity,
    gte,
    __,
    dissoc,
    any,
    propEq,
    all,
    complement,
    either,
} from "ramda";

const getStar = prop("star");
const getTgl = prop("triangle");
const getSqr = prop("square");
const getCrcl = prop("circle");

const isFigureRed = equals("red");
const isFigureGreen = equals("green");
const isFigureWhite = equals("white");
const isFigureBlue = equals("blue");
const isFigureOrange = equals("orange");

const isRedStar = compose(isFigureRed, getStar);
const isBlueCircle = compose(isFigureBlue, getCrcl);
const isOrangeSquare = compose(isFigureOrange, getSqr);
const isGreenSquare = compose(isFigureGreen, getSqr);
const isGreenTriangle = compose(isFigureGreen, getTgl);
const isWhiteTriangle = compose(isFigureWhite, getTgl);
const isWhiteCircle = compose(isFigureWhite, getCrcl);
const countColors = compose(countBy(identity), values);
const getGreenCount = compose(prop("green"), countColors);
const colorStats = compose(countBy(identity), values);
const countColorsWithoutWhite = compose(
    dissoc("white"),
    countBy(identity),
    values
);
const hasColor3OrMore = compose(any(gte(__, 3)), values);
const hasTwoGreen = compose(propEq("green", 2), colorStats);
const hasOneRed = compose(propEq("red", 1), colorStats);
const isRedOrWhite = either(isFigureRed, isFigureWhite);
const isNotRedOrWhiteStar = compose(complement(isRedOrWhite), getStar);

const triangleEqualsSquare = obj => getTgl(obj) === getSqr(obj);
const triangleNotWhite = compose(complement(isFigureWhite), getTgl);

const atLeastTwo = gte(__, 2);

const allOrange = all(isFigureOrange);
const allGreen = all(isFigureGreen);

const sameAmount = ({ red = 0, blue = 0 }) => red === blue;

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = allPass([
    isRedStar,
    isGreenSquare,
    isWhiteTriangle,
    isWhiteCircle,
]);

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = compose(atLeastTwo, getGreenCount);

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = compose(sameAmount, colorStats);

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = (obj) =>
    isBlueCircle(obj) && isRedStar(obj) && isOrangeSquare(obj);

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = compose(
    hasColor3OrMore,
    countColorsWithoutWhite
);

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = (obj) =>
    isGreenTriangle(obj) && hasTwoGreen(obj) && hasOneRed(obj);

// 7. Все фигуры оранжевые.
export const validateFieldN7 = compose(allOrange, values);

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = isNotRedOrWhiteStar;

// 9. Все фигуры зеленые.
export const validateFieldN9 = compose(allGreen, values);

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = allPass([
  triangleEqualsSquare,
  triangleNotWhite,
]);