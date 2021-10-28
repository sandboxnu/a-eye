import React, { useState } from 'react';

// dir is the direction of the filter
// true -> up down (even?)
// false -> left right (odd?)
function createSobel(
    dir: boolean
) {
    const Gx = [[-1, 0, 1],
                [-2, 0, 2],
                [-1, 0, 1]];
    const Gy = [[-1, -2, -1],
                [0, 0, 0],
                [1, 2, 1]];

    return dir ? Gx : Gy;
}