import React, { useState, useRef, useEffect } from 'react';
import './style/main.scss';
import { GrRotateLeft, GrRotateRight, GrEdit, GrSuperscript, GrDown } from 'react-icons/gr';
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

    const [showDropdown, setShowDropdown] = useState(false);
    const toggleDropdown = () => setShowDropdown(!showDropdown);
    const [property, setProperty] = useState({ name: 'brightness', maxValue: 200 });
    const [details, setDetails] = useState(null);
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
        const storedImage = localStorage.getItem('screenshotUrl');
        if (storedImage) {
            const img = new Image();
            img.src = storedImage;
            img.onload = () => {
                setDetails(img);
                setState((prevState) => ({
                    ...prevState,
                    image: storedImage
                }));
                storeData.insert({
                    image: storedImage,
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
        }
    }, []);

    useEffect(() => {
        if (details) {
            drawImage();
        }
    }, [state, details, text]);

    const drawImage = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!details || !canvas) return;

        // Adjust the canvas size to match the image size
        canvas.width = details.naturalWidth;
        canvas.height = details.naturalHeight;

        // Clear the canvas before drawing
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Apply filters and transformations
        ctx.filter = `brightness(${state.brightness}%) sepia(${state.sepia}%) saturate(${state.saturate}%) contrast(${state.contrast}%) grayscale(${state.grayscale}%) hue-rotate(${state.hueRotate}deg)`;
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(state.rotate * Math.PI / 180);
        ctx.scale(state.vartical, state.horizental);
        ctx.drawImage(details, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
        ctx.resetTransform();

        // Draw the text if any
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

    const saveImage = () => {
        if (!details) return;

        // Create an offscreen canvas for final image processing
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Set canvas dimensions to match the original image dimensions
        canvas.width = details.naturalWidth;
        canvas.height = details.naturalHeight;

        // Apply filters and transformations
        ctx.filter = `brightness(${state.brightness}%) sepia(${state.sepia}%) saturate(${state.saturate}%) contrast(${state.contrast}%) grayscale(${state.grayscale}%) hue-rotate(${state.hueRotate}deg)`;
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(state.rotate * Math.PI / 180);
        ctx.scale(state.vartical, state.horizental);
        ctx.drawImage(details, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
        ctx.resetTransform();

        // Draw the text if any
        if (text.value) {
            ctx.font = '30px Arial';
            ctx.fillStyle = 'red';
            ctx.fillText(text.value, text.x, text.y);
        }

        // Draw the current content of the main canvas (lines, etc.)
        const mainCanvas = canvasRef.current;
        if (mainCanvas) {
            ctx.drawImage(mainCanvas, 0, 0, canvas.width, canvas.height);
        }

        // Create a link to download the image
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
            ctx.lineCap = 'round';
            ctx.stroke();
        }
    };

    const stopDrawing = () => {
        setDrawing(false);
    };

    const enableDrawing = () => {
        setDrawingEnabled(!drawingEnabled);
    };

    const textAdd = () => {
        setText({ ...text, value: 'Hello World' });
        setEditingText(true);
    };

    const handleTextChange = (e) => {
        setText({ ...text, value: e.target.value });
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
                        <input
                            type="file"
                            id="inputImage"
                            accept='image/*'
                            onChange={imageHandle}
                        />
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
                    <div className="dropdown">
                        <button className="dropdown-btn" onClick={toggleDropdown}>
                            <GrDown /> Shapes
                        </button>
                        {showDropdown && (
                            <div className="dropdown-content">
                                <button>Triangle</button>
                                <button>Circle</button>
                                <button>Quadratic</button>
                                <button>Cubic</button>
                            </div>
                        )}
                    </div>
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
