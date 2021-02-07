
const INIT_CONFIG = { weightX: .7, weightY: -1, bias: 0 , learningRate: .1 };
const INIT_INPUTS: RblattInput[] = [
    { x: 2.101231155778894, y: 4.947319932998326, z: 0 },
    { x: 8.27, y: -3.94, z: 0 },
    { x: 0.7838107202680059, y: 4.2886097152428815, z: 0 },
    { x: 2.7711055276381822, y: 9.000921273031828, z: 0 },
    { x: 5.344112227805695, y: 5.910050251256282, z: 0 },
    { x: 5.445452261306533, y: 1.1977386934673367, z: 0 },
    { x: 4.482721943048576, y: -0.7783919597989952, z: 0 },
    { x: 7.725603015075377, y: -3.05854271356784, z: 0 },
    { x: 5.445452261306533, y: -3.210552763819096, z: 0 },
    { x: -0.28025963149078823, y: 2.0084589614740372, z: 1 },
    { x: 2.506591289782244, y: -3.6159128978224464, z: 1 },
    { x: -2.2057202680067015, y: -0.4237018425460638, z: 1 },
    { x: -3.573810720268008, y: 2.819179229480737, z: 1 },
    { x: -5.549941373534341, y: 2.211139028475712, z: 1 },
    { x: 0.5304606365159121, y: -3.109212730318259, z: 1 },
    { x: -4.485871021775546, y: -3.1598827470686774, z: 1 }
];

export type RblattInput = { x: number, y: number, z: 0 | 1 };
export type RblattConfig = { weightX: number, weightY: number, bias: number, learningRate: number };

export {INIT_CONFIG, INIT_INPUTS};