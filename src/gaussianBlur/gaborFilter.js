
import React from 'react';


// np.meshgrid
function makeMeshgrid(sz) {
   
   var radius = [Math.floor(sz[0]/2.0), Math.floor(sz[1]/2.0)]
   console.log(radius)
   // return a 2d array 
   var result_x = [];
   var result_y = [];

   // console.log( Math.round(7 / 2))
   for (let i = 0; i < (2 * Math.floor(sz[1] / 2)) + 1; i++) {
      let x_row = []
      for(let j = -radius[0]; j < radius[0] + 1; j++) {
         x_row.push(j)
      }
      result_x.push(x_row)
   }

   // console.log(result_x)
   for (let i = -Math.floor(sz[1] / 2); i < Math.floor(sz[1] / 2) + 1; i++) {
      let y_row = []
      for(let j = 0; j < sz[0] + 1; j++) {
         y_row.push(i)
      }
      result_y.push(y_row)
   }
   // console.log(result_y)


   return [result_x, result_y]
}

//http://vision.psych.umn.edu/users/kersten/kersten-lab/courses/Psy5036W2017/Lectures/17_PythonForVision/Demos/html/2b.Gabor.html
function gaborFilter(sz,
                     omega,
                     theta,
                     func = Math.cos,
                     K = Math.PI) {

   // EXAMPLE INPUTS 

   // let sz = [4,4]
   // let omega = 0.3
   // let theta = Math.PI/4
   // let func = Math.cos
   // let K = Math.PI

   let xy = makeMeshgrid(sz)
   let x = xy[0]
   let y = xy[1]

   let x1 = x.map((inner, i) => inner.map((v, j) => (v * Math.cos(theta)) + (y[i][j] * Math.sin(theta))));
   let y1 = x.map((inner, i) => inner.map((v, j) => (-v * Math.sin(theta)) + (y[i][j] * Math.cos(theta))));
   
   let p = Math.pow(omega, 2) / (4* Math.PI * Math.pow(K, 2))
   let gaussian = x1.map((inner, i) => inner.map((v, j) => p * Math.exp(-Math.pow(omega, 2) / (8*Math.pow(K, 2)) * ( 4 * Math.pow(v, 2) + Math.pow(y1[i][j], 2)) )));
   let sinusoid = x1.map((inner, i) => inner.map((v, j) => (func(omega * v) * Math.exp(Math.pow(K, 2) / 2))));
   let gabor = sinusoid.map((inner, i) => inner.map((v, j) => (v * gaussian[i][j])));

   console.log(gabor);
   console.log(gabor.flat());
   return gabor.flat();
}
gaborFilter([4,4], 0.3, Math.PI/4)

const somediv = () => {
   return(
      <div>

      </div>
   )
}

export default somediv;