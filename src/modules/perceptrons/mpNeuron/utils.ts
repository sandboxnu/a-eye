export type NeuronConfig = {
  weights: number[];
  bias: number;
  output: number;
  isGreater: boolean;
  threshold: number;
};

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

// Update a neuron value in a state function to a new one!
const setNeuronAttr = (setStateFn) => (
  neuronLayerNum,
  neuronNum,
  attr,
  value
) =>
  setStateFn((neuronState) =>
    neuronState.map((neuronLayer, i) =>
      neuronLayer.map((neuronValues, j) =>
        neuronLayerNum === i && neuronNum === j
          ? {
              ...neuronValues,
              [attr]:
                typeof value === "function" ? value(neuronValues[attr]) : value,
            }
          : neuronValues
      )
    )
  );

// Make a deep copy of an object.
const deepcopy = (obj: {}) => JSON.parse(JSON.stringify(obj));

// get the intermediate and final results of neuron calculations
const getNeuronOutputs = (inputs, neuronState) => {
  const allResults: number[][][] = [deepcopy(inputs).map((num) => [num])];
  let curResults = deepcopy(inputs);
  neuronState.forEach((layer: NeuronConfig[], i: number) => {
    const layerResults: number[] = layer.map(
      ({ weights, bias, isGreater, threshold }, j: number) => {
        const thresholdFunc = isGreater
          ? (a: number) => (a > threshold ? 1 : 0)
          : (a: number) => (a < threshold ? 1 : 0);
        const result =
          weights.reduce((acc: number, weight: number) => {
            const input = curResults.splice(0, 1)[0];
            return weight * input + acc;
          }, 0) + bias;

        return thresholdFunc(result);
      }
    );
    curResults = layerResults;
    allResults.push(layerResults.map((num) => [num]));
  });
  return allResults;
};

// Remove the first element for which the predicate holds true.
const removeFirst = (arr: any[], cond): [any[], any] =>
  arr.reduce(
    ([rst, foundElem], elem) =>
      cond(elem) && !foundElem ? [rst, elem] : [rst.concat([elem]), foundElem],
    [[], null]
  );

const changeInputsAfterClick = (setInputs) => (clickedX, clickedY, color) =>
  setInputs((inp) => {
    const BOUND = 0.05;

    let [newInputs] = removeFirst(inp, ([x, y]) => {
      return (
        clickedX - BOUND <= x &&
        x <= clickedX + BOUND &&
        clickedY - BOUND <= y &&
        y <= clickedY + BOUND
      );
    });

    // If the length changed, then we removed one, so we didn't add one! Otherwise, we know we added one.
    if (newInputs.length === 0) return inp;
    return newInputs.length === inp.length
      ? newInputs.concat([[clickedX, clickedY]])
      : newInputs;
  });

export {
  zip,
  calculateThreshold,
  calculateInputSum,
  setNeuronAttr,
  deepcopy,
  getNeuronOutputs,
  changeInputsAfterClick,
};
