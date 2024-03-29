import React, { useLayoutEffect, useRef, useState } from 'react';

// http://dev.theomader.com/gaussian-kernel-calculator/
// https://blog.cloudboost.io/using-html5-canvas-with-react-ff7d93f5dc76

/**
 *
 * @param props
 * @param props.filter  function that writes a filtered image to `outCanvas`,
 *                      given the original image on `inCanvas`
 * @param props.imgUrl  url to the image to display
 * @param props.disabled  whether or not the "apply filter" button should be disabled
 */
type InteractiveFilterType = {
  filter: (inCanvas: HTMLCanvasElement, outCanvas: HTMLCanvasElement) => any;
  imgUrl: string;
  disabled: boolean;
};
const InteractiveFilter: React.FC<InteractiveFilterType> = ({
  filter,
  imgUrl,
  disabled,
}) => {
  const [isFiltered, setIsFiltered] = useState(false);
  const [imgWidth, setImgWidth] = useState<number | undefined>(undefined);
  const [imgHeight, setImgHeight] = useState<number | undefined>(undefined);
  const inputCanvas = useRef<HTMLCanvasElement>(null);
  const outputCanvas = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useLayoutEffect(() => {
    const inputElem = inputCanvas.current; // get the DOM element for the canvas
    const outputElem = outputCanvas.current;
    const imgElem = imgRef.current;
    if (!(inputElem && outputElem && imgElem)) return;

    imgElem.onload = () => {
      setImgHeight(imgElem.height);
      setImgWidth(imgElem.width);
      inputElem.getContext('2d')?.drawImage(imgElem, 0, 0);
      outputElem.getContext('2d')?.drawImage(imgElem, 0, 0);
    };
  }, []);

  const applyFilter = () => {
    const inputElem = inputCanvas.current; // get the DOM element for the canvas
    const outputElem = outputCanvas.current;
    if (!(inputElem && outputElem)) return;
    filter(inputElem, outputElem);
    setIsFiltered(true);
  };

  const resetImage = () => {
    const outputElem = outputCanvas.current;
    const imgElem = imgRef.current;
    if (!(outputElem && imgElem)) return;
    const ctxt = outputElem.getContext('2d');
    ctxt?.clearRect(0, 0, ctxt.canvas.width, ctxt.canvas.height);
    ctxt?.drawImage(imgElem, 0, 0);
    setIsFiltered(false);
  };

  return (
    <div>
      <div>
        <img ref={imgRef} src={imgUrl} alt="input" className="hidden" />
        <canvas
          className="inline m-2 crisp-pixels responsive-img-width "
          ref={inputCanvas}
          width={imgWidth}
          height={imgHeight}
        />
        <canvas
          className="inline m-2 crisp-pixels responsive-img-width"
          ref={outputCanvas}
          width={imgRef.current?.width}
          height={imgRef.current?.height}
        />
      </div>
      <button
        type="button"
        className="basic-button"
        disabled={disabled}
        onClick={() => (isFiltered ? resetImage() : applyFilter())}
      >
        {isFiltered ? 'Reset Image' : 'Apply Filter'}
      </button>
    </div>
  );
};

export default InteractiveFilter;
