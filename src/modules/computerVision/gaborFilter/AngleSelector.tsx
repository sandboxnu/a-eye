import React, { useState } from 'react';
import './AngleSelector.css';
import mainCircle from './main-circle.svg';

/**
 *
 * @param props
 * @param props.diameter {String}  any valid css string for the height/width of the circle
 * @param props.initAngle {number} initial angle for the selector, in radians
 * @param props.onAngleChange {function} callback for when the angle changes
 */
const AngleSelector = ({ diameter, initAngle = 0, onAngleChange }:
{ diameter: string, initAngle?: number, onAngleChange: (angle :number) => any }) => {
  const [moving, setMoving] = useState(false);
  const [angle, setAngle] = useState<number | string>(initAngle); // in radians

  const dragHandle = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!moving) return;

    const circle = document.getElementById('main-circle');
    if (!circle) return;
    const circleBounds = circle.getBoundingClientRect();
    const radius = (circleBounds.right - circleBounds.left) / 2;
    const x = e.clientX - circleBounds.left - radius;
    const y = -e.clientY + circleBounds.top + radius;
    let newAngle = Math.atan(y / x);
    if (x < 0) newAngle += Math.PI;
    newAngle %= (Math.PI * 2);
    setAngle(newAngle);
    onAngleChange(newAngle);
  };

  // todo normalize angles to unit circle
  return (
    <div className="angle-selector">
      <div
        className="main-circle"
        id="main-circle"
        style={{
          height: diameter,
          width: diameter,
          backgroundImage: `url(${mainCircle})`,
        }}
      >
        <div
          className="handle-base"
          style={{
            transform: `rotate(${-angle}rad)`,
            height: diameter,
            width: diameter,
          }}
        >
          <div
            className="handle-hitbox"
            onMouseDown={() => setMoving(true)}
            onMouseUp={() => setMoving(false)}
            onMouseMove={dragHandle}
          >
            <div className="knob" />
            <div className="handle" />
          </div>
        </div>
      </div>
      <label className="angle-textbox">
        <input
          className="angle-textbox-input number-input"
          value={angle}
          onChange={(e) => {
            setAngle(e.target.value);
            const val = parseFloat(e.target.value);
            if (!isNaN(val)) onAngleChange(val);
          }}
        />
        radians
      </label>
    </div>
  );
};

export default AngleSelector;
