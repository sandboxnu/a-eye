import React, { useEffect } from 'react';
import './ImageSelector.css';

const ImageSelector = (props: { currImg: string, onSelect: (img: string, imgUrl: string) => any }) => {
    useEffect(() => props.onSelect(props.currImg, ALL_IMGS[props.currImg]),
        []);

    const makeImg = (key: string) => (
        <img key={key}
            className={key === props.currImg ? 'selected' : ''}
            src={ALL_IMGS[key]}
            onClick={() => props.onSelect(key, ALL_IMGS[key])}
        />
    );

    return (
        <div className='image-selector'>
            Select Image
            <div className='selection-window'>
                {Object.keys(ALL_IMGS).map(key => {
                    return ALL_IMGS[key] && makeImg(key);
                }
                )}
            </div>
        </div>
    );
}



const ALL_IMGS: { [name: string]: any } = {
    'three.png': require('./imageLibrary/three.png'),
    'diamond.png': require('./imageLibrary/diamond.png'),
    'square.png': require('./imageLibrary/square.png'),
    'circles.jpg': require('./imageLibrary/circles.jpg'),
    'dogSilhouette.jpg': require('./imageLibrary/dogSilhouette.jpg'),
    'purpleFlowers.jpeg': require('./imageLibrary/purpleFlowers.jpeg'),
    'steps.png': require('./imageLibrary/steps.png'),
    'tabbyCat.jpg': require('./imageLibrary/tabbyCat.jpg'),
    'teddyBear.jpg': require('./imageLibrary/teddyBear.jpg'),
    'zebra.jpg': require('./imageLibrary/zebra.jpg'),
    'bwWoman.jpg': require('./imageLibrary/bwWoman.jpg'),
    'bwMan.jpg': require('./imageLibrary/bwMan.jpg')
}

export default ImageSelector;
