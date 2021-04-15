const zip = (arr1: Array<any>, arr2: Array<any>) =>
  arr1.map((e, i) => [e, arr2[i]]);

const calculateThreshold = (
  n: number,
  isGreater: boolean,
  threshold: number
) => {
  if (isGreater) {
    return n > threshold ? 1 : 0;
  } else {
    return n < threshold ? 1 : 0;
  }
};

const calculateInputSum = (inputs, weights, bias) =>
  zip(inputs, weights).reduce(
    (prev, [input, weight]) => (input && weight ? input * weight : 0) + prev,
    bias
  );

export { zip, calculateThreshold, calculateInputSum };
