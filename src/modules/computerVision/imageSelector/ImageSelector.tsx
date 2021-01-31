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
    'three.png': require('../../../media/modules/computerVision/imageLibrary/three.png'),
    'diamond.png': require('../../../media/modules/computerVision/imageLibrary/diamond.png'),
    'square.png': require('../../../media/modules/computerVision/imageLibrary/square.png'),
    'circles.jpg': require('../../../media/modules/computerVision/imageLibrary/circles.jpg'),
    'dogSilhouette.jpg': require('../../../media/modules/computerVision/imageLibrary/dogSilhouette.jpg'),
    'purpleFlowers.jpeg': require('../../../media/modules/computerVision/imageLibrary/purpleFlowers.jpeg'),
    'steps.png': require('../../../media/modules/computerVision/imageLibrary/steps.png'),
    'tabbyCat.jpg': require('../../../media/modules/computerVision/imageLibrary/tabbyCat.jpg'),
    'teddyBear.jpg': require('../../../media/modules/computerVision/imageLibrary/teddyBear.jpg'),
    'zebra.jpg': require('../../../media/modules/computerVision/imageLibrary/zebra.jpg'),
    'bwWoman.jpg': require('../../../media/modules/computerVision/imageLibrary/bwWoman.jpg'),
    'bwMan.jpg': require('../../../media/modules/computerVision/imageLibrary/bwMan.jpg')
}

export default ImageSelector;
