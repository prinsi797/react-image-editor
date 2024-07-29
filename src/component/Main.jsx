// import React, { useState, useRef, useEffect } from 'react';
// import './style/main.scss';
// import ReactCrop from 'react-image-crop';
// import 'react-image-crop/dist/ReactCrop.css';
// import { GrRotateLeft, GrRotateRight, GrEdit, GrSuperscript } from 'react-icons/gr';
// import { CgMergeVertical, CgMergeHorizontal } from 'react-icons/cg';
// import { IoMdUndo, IoMdRedo, IoIosSave, IoIosImage } from 'react-icons/io';
// import storeData from './LinkedList';
// import logo from './style/logo.jpeg';

// const Main = () => {
//     const filterElement = [
//         { name: 'brightness', maxValue: 200 },
//         { name: 'grayscale', maxValue: 100 },
//         { name: 'sepia', maxValue: 100 },
//         { name: 'saturate', maxValue: 200 },
//         { name: 'contrast', maxValue: 200 },
//         { name: 'hueRotate', maxValue: 360 }
//     ];

//     const [property, setProperty] = useState({ name: 'brightness', maxValue: 200 });
//     const [details, setDetails] = useState(null);
//     const [crop, setCrop] = useState({});
//     const [drawing, setDrawing] = useState(false);
//     const [text, setText] = useState({ value: '', x: 50, y: 50 });
//     const [editingText, setEditingText] = useState(false);
//     const canvasRef = useRef(null);

//     const [state, setState] = useState({
//         image: '',
//         brightness: 100,
//         grayscale: 0,
//         sepia: 0,
//         saturate: 100,
//         contrast: 100,
//         hueRotate: 0,
//         rotate: 0,
//         vartical: 1,
//         horizental: 1
//     });

//     useEffect(() => {
//         if (details) {
//             drawImage();
//         }
//     }, [state, details, crop, text]);

//     const drawImage = () => {
//         const canvas = canvasRef.current;
//         const ctx = canvas.getContext('2d');
//         if (!details || !canvas) return;
    
//         const { width, height } = canvas;
    
//         // Adjust the canvas size to match the image size
//         canvas.width = details.naturalWidth;
//         canvas.height = details.naturalHeight;
    
//         ctx.clearRect(0, 0, width, height);
    
//         ctx.filter = `brightness(${state.brightness}%) sepia(${state.sepia}%) saturate(${state.saturate}%) contrast(${state.contrast}%) grayscale(${state.grayscale}%) hue-rotate(${state.hueRotate}deg)`;
//         ctx.translate(width / 2, height / 2);
//         ctx.rotate(state.rotate * Math.PI / 180);
//         ctx.scale(state.vartical, state.horizental);
//         ctx.drawImage(details, -width / 2, -height / 2, width, height);
//         ctx.resetTransform();
    
//         if (text.value) {
//             ctx.font = '30px Arial';
//             ctx.fillStyle = 'red';
//             ctx.fillText(text.value, text.x, text.y);
//         }
//     };
    

//     const inputHandle = (e) => {
//         setState({
//             ...state,
//             [e.target.name]: e.target.value
//         });
//     };

//     const leftRotate = () => {
//         setState(prevState => ({
//             ...prevState,
//             rotate: prevState.rotate - 90
//         }));
//         storeData.insert({ ...state, rotate: state.rotate - 90 });
//     };

//     const rightRotate = () => {
//         setState(prevState => ({
//             ...prevState,
//             rotate: prevState.rotate + 90
//         }));
//         storeData.insert({ ...state, rotate: state.rotate + 90 });
//     };

//     const varticalFlip = () => {
//         setState(prevState => ({
//             ...prevState,
//             vartical: prevState.vartical === 1 ? -1 : 1
//         }));
//         storeData.insert({ ...state, vartical: state.vartical === 1 ? -1 : 1 });
//     };

//     const horizentalFlip = () => {
//         setState(prevState => ({
//             ...prevState,
//             horizental: prevState.horizental === 1 ? -1 : 1
//         }));
//         storeData.insert({ ...state, horizental: state.horizental === 1 ? -1 : 1 });
//     };

//     const redo = () => {
//         const data = storeData.redoEdit();
//         if (data) {
//             setState(data);
//         }
//     };

//     const undo = () => {
//         const data = storeData.undoEdit();
//         if (data) {
//             setState(data);
//         }
//     };

//     const imageHandle = (e) => {
//         if (e.target.files.length !== 0) {
//             const reader = new FileReader();
//             reader.onload = () => {
//                 const img = new Image();
//                 img.src = reader.result;
//                 img.onload = () => {
//                     setDetails(img);
//                     setState({
//                         ...state,
//                         image: reader.result
//                     });
//                     storeData.insert({
//                         image: reader.result,
//                         brightness: 100,
//                         grayscale: 0,
//                         sepia: 0,
//                         saturate: 100,
//                         contrast: 100,
//                         hueRotate: 0,
//                         rotate: 0,
//                         vartical: 1,
//                         horizental: 1
//                     });
//                 };
//             };
//             reader.readAsDataURL(e.target.files[0]);
//         }
//     };

//     const imageCrop = () => {
//         if (!details || !crop || !canvasRef.current) return;

//         const canvas = document.createElement('canvas');
//         const ctx = canvas.getContext('2d');
//         const scaleX = details.naturalWidth / details.width;
//         const scaleY = details.naturalHeight / details.height;

//         canvas.width = crop.width;
//         canvas.height = crop.height;

//         ctx.drawImage(
//             details,
//             crop.x * scaleX,
//             crop.y * scaleY,
//             crop.width * scaleX,
//             crop.height * scaleY,
//             0,
//             0,
//             crop.width,
//             crop.height
//         );

//         const base64Url = canvas.toDataURL('image/jpeg');
//         setState({
//             ...state,
//             image: base64Url
//         });
//     };

//     const saveImage = () => {
//         const canvas = document.createElement('canvas');
//         const ctx = canvas.getContext('2d');

//         if (!details) return;

//         canvas.width = details.naturalWidth;
//         canvas.height = details.naturalHeight;

//         ctx.filter = `brightness(${state.brightness}%) sepia(${state.sepia}%) saturate(${state.saturate}%) contrast(${state.contrast}%) grayscale(${state.grayscale}%) hue-rotate(${state.hueRotate}deg)`;
//         ctx.translate(canvas.width / 2, canvas.height / 2);
//         ctx.rotate(state.rotate * Math.PI / 180);
//         ctx.scale(state.vartical, state.horizental);
//         ctx.drawImage(
//             details,
//             -canvas.width / 2,
//             -canvas.height / 2,
//             canvas.width,
//             canvas.height
//         );
//         ctx.resetTransform();

//         if (text.value) {
//             ctx.font = '30px Arial';
//             ctx.fillStyle = 'red';
//             ctx.fillText(text.value, text.x, text.y);
//         }

//         const link = document.createElement('a');
//         link.download = 'image_edit.jpg';
//         link.href = canvas.toDataURL();
//         link.click();
//     };

//     const startDrawing = (e) => {
//         if (drawing) {
//             const canvas = canvasRef.current;
//             const ctx = canvas.getContext('2d');
//             ctx.beginPath();
//             ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
//         }
//     };

//     const draw = (e) => {
//         if (drawing) {
//             const canvas = canvasRef.current;
//             const ctx = canvas.getContext('2d');
//             ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
//             ctx.strokeStyle = '#000000'; // Set the pencil color (black)
//             ctx.lineWidth = 2; // Set the pencil width
//             ctx.lineCap = 'round'; // Set the line cap for smoother lines
//             ctx.stroke();
//         }
//     };

//     const stopDrawing = () => {
//         if (drawing) {
//             const canvas = canvasRef.current;
//             const ctx = canvas.getContext('2d');
//             ctx.closePath();
//         }
//     };

//     const enableDrawing = () => {
//         setDrawing(!drawing);
//     };

//     const textAdd = () => {
//         setText({ value: 'Hello World', x: 50, y: 50 });
//         setEditingText(true);
//     };

//     const handleTextChange = (e) => {
//         setText({ ...text, value: e.target.value });
//     };

//     const handleTextDrag = (e) => {
//         if (editingText) {
//             const canvas = canvasRef.current;
//             const { offsetX, offsetY } = e.nativeEvent;
            
//             // Ensure the text input remains within the canvas bounds
//             const x = Math.max(0, Math.min(offsetX, canvas.width));
//             const y = Math.max(0, Math.min(offsetY, canvas.height));
            
//             setText({ ...text, x, y });
//         }
//     };

//     const stopEditingText = () => {
//         setEditingText(false);
//     };

//     return (
//         <div className="image-editor">
//             <header className="header">
//                 {/* <img src={logo} alt="Logo" className="logo" /> */}
//                 <h2 className="logo">E D I T O R</h2>
//                 <div className="header-buttons">
//                     <button onClick={saveImage}><IoIosSave />Save</button>
//                     <button onClick={undo}><IoMdUndo />Undo</button>
//                     <button onClick={redo}><IoMdRedo />Redo</button>
//                 </div>
//             </header>
//             <div className="sidebar">
//                 <div className="sidebar-buttons">
//                     <label htmlFor="choose" className="image-upload">
//                         <IoIosImage />
//                         <span>Choose Image</span>
//                         <input type="file" accept="image/*" id="choose" onChange={imageHandle} />
//                     </label>
//                 </div>
//                 <div className="draw-text-buttons">
//                     <button onClick={enableDrawing}><GrEdit />Draw</button>
//                     <button onClick={textAdd}><GrSuperscript />Text</button>
//                 </div>
//                 <div className="adjustment-sliders">
//                     {filterElement.map((v, i) => (
//                         <button key={i} onClick={() => setProperty(v)}>{v.name}</button>
//                     ))}
//                 </div>
//                 <div className="slider">
//                     <input
//                         type="range"
//                         name={property.name}
//                         max={property.maxValue}
//                         value={state[property.name]}
//                         onChange={inputHandle}
//                     />
//                 </div>
//                 <div className="rotation-buttons">
//                     <button onClick={leftRotate}><GrRotateLeft /></button>
//                     <button onClick={rightRotate}><GrRotateRight /></button>
//                     <button onClick={varticalFlip}><CgMergeVertical /></button>
//                     <button onClick={horizentalFlip}><CgMergeHorizontal /></button>
//                 </div>
//                 <div className="history-buttons">
//                     {/* Removed from sidebar */}
//                 </div>
//             </div>
//             <div className="app-content">
//                 <div className="canvas-container">
//                     <canvas
//                         className="responsive-canvas"
//                         ref={canvasRef}
//                         onMouseDown={startDrawing}
//                         onMouseMove={draw}
//                         onMouseUp={stopDrawing}
//                         onMouseLeave={stopDrawing}
//                         onClick={handleTextDrag}
//                         onDoubleClick={stopEditingText}
//                     />
//                     {editingText && (
//                         <input
//                             type="text"
//                             value={text.value}
//                             onChange={handleTextChange}
//                             onMouseDown={(e) => e.stopPropagation()}
//                         />
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };
// export default Main;


import React, { useState, useRef, useEffect } from 'react';
import './style/main.scss';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { GrRotateLeft, GrRotateRight, GrEdit, GrSuperscript } from 'react-icons/gr';
import { CgMergeVertical, CgMergeHorizontal } from 'react-icons/cg';
import { IoMdUndo, IoMdRedo, IoIosSave, IoIosImage } from 'react-icons/io';
import storeData from './LinkedList';
import logo from './style/logo.png';

const Main = () => {
    const filterElement = [
        { name: 'brightness', maxValue: 200 },
        { name: 'grayscale', maxValue: 100 },
        { name: 'sepia', maxValue: 100 },
        { name: 'saturate', maxValue: 200 },
        { name: 'contrast', maxValue: 200 },
        { name: 'hueRotate', maxValue: 360 }
    ];

    const [property, setProperty] = useState({ name: 'brightness', maxValue: 200 });
    const [details, setDetails] = useState(null);
    const [crop, setCrop] = useState({});
    const [drawing, setDrawing] = useState(false);
    const [drawingEnabled, setDrawingEnabled] = useState(false);
    const [text, setText] = useState({ value: '', x: 50, y: 50 });
    const [editingText, setEditingText] = useState(false);
    const canvasRef = useRef(null);

    const [state, setState] = useState({
        image: '',
        brightness: 100,
        grayscale: 0,
        sepia: 0,
        saturate: 100,
        contrast: 100,
        hueRotate: 0,
        rotate: 0,
        vartical: 1,
        horizental: 1
    });

    useEffect(() => {
        if (details) {
            drawImage();
        }
    }, [state, details, crop, text]);

    const drawImage = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!details || !canvas) return;

        const { width, height } = canvas;

        // Adjust the canvas size to match the image size
        canvas.width = details.naturalWidth;
        canvas.height = details.naturalHeight;

        ctx.clearRect(0, 0, width, height);

        ctx.filter = `brightness(${state.brightness}%) sepia(${state.sepia}%) saturate(${state.saturate}%) contrast(${state.contrast}%) grayscale(${state.grayscale}%) hue-rotate(${state.hueRotate}deg)`;
        ctx.translate(width / 2, height / 2);
        ctx.rotate(state.rotate * Math.PI / 180);
        ctx.scale(state.vartical, state.horizental);
        ctx.drawImage(details, -width / 2, -height / 2, width, height);
        ctx.resetTransform();

        if (text.value) {
            ctx.font = '30px Arial';
            ctx.fillStyle = 'red';
            ctx.fillText(text.value, text.x, text.y);
        }
    };

    const inputHandle = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        });
    };

    const leftRotate = () => {
        setState(prevState => ({
            ...prevState,
            rotate: prevState.rotate - 90
        }));
        storeData.insert({ ...state, rotate: state.rotate - 90 });
    };

    const rightRotate = () => {
        setState(prevState => ({
            ...prevState,
            rotate: prevState.rotate + 90
        }));
        storeData.insert({ ...state, rotate: state.rotate + 90 });
    };

    const varticalFlip = () => {
        setState(prevState => ({
            ...prevState,
            vartical: prevState.vartical === 1 ? -1 : 1
        }));
        storeData.insert({ ...state, vartical: state.vartical === 1 ? -1 : 1 });
    };

    const horizentalFlip = () => {
        setState(prevState => ({
            ...prevState,
            horizental: prevState.horizental === 1 ? -1 : 1
        }));
        storeData.insert({ ...state, horizental: state.horizental === 1 ? -1 : 1 });
    };

    const redo = () => {
        const data = storeData.redoEdit();
        if (data) {
            setState(data);
        }
    };

    const undo = () => {
        const data = storeData.undoEdit();
        if (data) {
            setState(data);
        }
    };

    const imageHandle = (e) => {
        if (e.target.files.length !== 0) {
            const reader = new FileReader();
            reader.onload = () => {
                const img = new Image();
                img.src = reader.result;
                img.onload = () => {
                    setDetails(img);
                    setState({
                        ...state,
                        image: reader.result
                    });
                    storeData.insert({
                        image: reader.result,
                        brightness: 100,
                        grayscale: 0,
                        sepia: 0,
                        saturate: 100,
                        contrast: 100,
                        hueRotate: 0,
                        rotate: 0,
                        vartical: 1,
                        horizental: 1
                    });
                };
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const imageCrop = () => {
        if (!details || !crop || !canvasRef.current) return;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const scaleX = details.naturalWidth / details.width;
        const scaleY = details.naturalHeight / details.height;

        canvas.width = crop.width;
        canvas.height = crop.height;

        ctx.drawImage(
            details,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        );

        const base64Url = canvas.toDataURL('image/jpeg');
        setState({
            ...state,
            image: base64Url
        });
    };

    const saveImage = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!details) return;

        canvas.width = details.naturalWidth;
        canvas.height = details.naturalHeight;

        ctx.filter = `brightness(${state.brightness}%) sepia(${state.sepia}%) saturate(${state.saturate}%) contrast(${state.contrast}%) grayscale(${state.grayscale}%) hue-rotate(${state.hueRotate}deg)`;
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(state.rotate * Math.PI / 180);
        ctx.scale(state.vartical, state.horizental);
        ctx.drawImage(
            details,
            -canvas.width / 2,
            -canvas.height / 2,
            canvas.width,
            canvas.height
        );
        ctx.resetTransform();

        // Draw the text
        if (text.value) {
            ctx.font = '30px Arial';
            ctx.fillStyle = 'red';
            ctx.fillText(text.value, text.x, text.y);
        }

        // Draw the current content of the canvas (including lines)
        const currentCanvas = canvasRef.current;
        if (currentCanvas) {
            ctx.drawImage(currentCanvas, 0, 0);
        }

        const link = document.createElement('a');
        link.download = 'image_edit.jpg';
        link.href = canvas.toDataURL();
        link.click();
    };

    const startDrawing = (e) => {
        if (drawingEnabled) {
            setDrawing(true);
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            ctx.beginPath();
            ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        }
    };

    const draw = (e) => {
        if (drawing && drawingEnabled) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
            ctx.strokeStyle = '#000000'; // Set the pencil color (black)
            ctx.lineWidth = 2; // Set the pencil width
            ctx.lineCap = 'round'; // Set the line cap for smoother lines
            ctx.stroke();
        }
    };

    const stopDrawing = () => {
        if (drawing) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            ctx.closePath();
            setDrawing(false);
            // Save the current drawing state
            storeData.insert({ ...state });
        }
    };

    const enableDrawing = () => {
        setDrawingEnabled(!drawingEnabled);
    };

    const textAdd = () => {
        setText({ value: 'Hello World', x: 50, y: 50 });
        setEditingText(true);
    };

    const handleTextChange = (e) => {
        setText({ ...text, value: e.target.value });
    };

    const handleTextDrag = (e) => {
        if (editingText) {
            const canvas = canvasRef.current;
            const { offsetX, offsetY } = e.nativeEvent;
            setText({
                ...text,
                x: offsetX,
                y: offsetY
            });
        }
    };

    const disableEditingText = () => {
        setEditingText(false);
    };

    return (
        <div className='container'>
            <div className="header">
                <div className="logo">
                    <img src={logo} alt="Logo" />
                </div>
                <div className="nav">
                    <div className="inputImage">
                        <label htmlFor="inputImage">
                            <IoIosImage />
                        </label>
                        <input type="file" id="inputImage" accept='image/*' onChange={imageHandle} />
                    </div>
                    <button onClick={saveImage}><IoIosSave /></button>
                </div>
            </div>
            <div className="app">
                <div className="app-sidebar">
                    {filterElement.map((v, i) =>
                        <button key={i} onClick={() => setProperty(v)}>{v.name}</button>
                    )}
                    <div className="slider">
                        <input
                            type="range"
                            name={property.name}
                            max={property.maxValue}
                            value={state[property.name]}
                            onChange={inputHandle}
                        />
                    </div>
                    <button onClick={leftRotate}><GrRotateLeft /></button>
                    <button onClick={rightRotate}><GrRotateRight /></button>
                    <button onClick={varticalFlip}><CgMergeVertical /></button>
                    <button onClick={horizentalFlip}><CgMergeHorizontal /></button>
                    <button onClick={undo}><IoMdUndo /></button>
                    <button onClick={redo}><IoMdRedo /></button>
                    <button onClick={enableDrawing}><GrEdit />Draw</button>
                    <button onClick={textAdd}><GrSuperscript />Text</button>
                </div>

                <div className="app-content">
                    <div className="canvas-container">
                        <canvas
                            ref={canvasRef}
                            width="800"
                            height="500"
                            onMouseDown={startDrawing}
                            onMouseMove={draw}
                            onMouseUp={stopDrawing}
                            onMouseOut={stopDrawing}
                        ></canvas>
                        {editingText && (
                            <input
                                type="text"
                                value={text.value}
                                onChange={handleTextChange}
                                onBlur={disableEditingText}
                                onMouseDown={handleTextDrag}
                                style={{
                                    position: 'absolute',
                                    left: `${text.x}px`,
                                    top: `${text.y}px`,
                                    color: 'red',
                                    fontSize: '30px'
                                }}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Main;