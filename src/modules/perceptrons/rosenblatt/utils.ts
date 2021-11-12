/* eslint-disable */

const round = (x: number, length: number) => {
  return Math.round(x * 10 ** length) / 10 ** length;
};

export { round };
