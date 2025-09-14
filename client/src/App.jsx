import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Form from './components/Form.jsx';
import QRScanner from './components/QRScanner.jsx';
import AdminPage from './components/AdminPage.jsx';

const AnimatedBackground = () => {
    const initialShapes = [
        { id: 1, style: { left: '25%', width: '80px', height: '80px', animationDelay: '0s', animationDuration: '22s', background: '#4285F4', boxShadow: '0 0 20px 5px rgba(66, 133, 244, 0.5)' }, isPaused: false },
        { id: 2, style: { left: '10%', width: '20px', height: '20px', animationDelay: '2s', animationDuration: '12s', background: '#DB4437', boxShadow: '0 0 15px 3px rgba(219, 68, 55, 0.5)' }, isPaused: false },
        { id: 3, style: { left: '70%', width: '20px', height: '20px', animationDelay: '4s', animationDuration: '15s', background: '#F4B400', boxShadow: '0 0 15px 3px rgba(244, 180, 0, 0.5)' }, isPaused: false },
        { id: 4, style: { left: '40%', width: '60px', height: '60px', animationDelay: '0s', animationDuration: '18s', background: '#0F9D58', boxShadow: '0 0 20px 5px rgba(15, 157, 88, 0.5)' }, isPaused: false },
        { id: 5, style: { left: '65%', width: '20px', height: '20px', animationDelay: '0s', animationDuration: '10s', background: '#4285F4', boxShadow: '0 0 15px 3px rgba(66, 133, 244, 0.5)' }, isPaused: false },
        { id: 6, style: { left: '75%', width: '110px', height: '110px', animationDelay: '3s', animationDuration: '25s', background: '#DB4437', boxShadow: '0 0 25px 8px rgba(219, 68, 55, 0.4)' }, isPaused: false },
        { id: 7, style: { left: '35%', width: '150px', height: '150px', animationDelay: '7s', animationDuration: '30s', background: '#F4B400', boxShadow: '0 0 30px 10px rgba(244, 180, 0, 0.3)' }, isPaused: false },
        { id: 8, style: { left: '50%', width: '25px', height: '25px', animationDelay: '15s', animationDuration: '18s', background: '#0F9D58', boxShadow: '0 0 15px 3px rgba(15, 157, 88, 0.5)' }, isPaused: false },
        { id: 9, style: { left: '20%', width: '15px', height: '15px', animationDelay: '2s', animationDuration: '11s', background: '#F4B400', boxShadow: '0 0 12px 2px rgba(244, 180, 0, 0.6)' }, isPaused: false },
        { id: 10, style: { left: '85%', width: '150px', height: '150px', animationDelay: '0s', animationDuration: '28s', background: '#4285F4', boxShadow: '0 0 30px 10px rgba(66, 133, 244, 0.3)' }, isPaused: false },
        { id: 11, style: { left: '5%', width: '45px', height: '45px', animationDelay: '1s', animationDuration: '20s', background: '#0F9D58', boxShadow: '0 0 18px 4px rgba(15, 157, 88, 0.5)' }, isPaused: false },
        { id: 12, style: { left: '90%', width: '30px', height: '30px', animationDelay: '6s', animationDuration: '14s', background: '#DB4437', boxShadow: '0 0 16px 3px rgba(219, 68, 55, 0.5)' }, isPaused: false },
        { id: 13, style: { left: '30%', width: '90px', height: '90px', animationDelay: '8s', animationDuration: '26s', background: '#4285F4', boxShadow: '0 0 22px 6px rgba(66, 133, 244, 0.4)' }, isPaused: false },
        { id: 14, style: { left: '55%', width: '22px', height: '22px', animationDelay: '12s', animationDuration: '10s', background: '#F4B400', boxShadow: '0 0 14px 2px rgba(244, 180, 0, 0.6)' }, isPaused: false },
        { id: 15, style: { left: '0%', width: '120px', height: '120px', animationDelay: '10s', animationDuration: '29s', background: '#DB4437', boxShadow: '0 0 28px 9px rgba(219, 68, 55, 0.3)' }, isPaused: false },
    ];
    
    const [shapes, setShapes] = useState(initialShapes);

    const handleShapeClick = (id) => {
        setShapes(prevShapes =>
            prevShapes.map(shape => {
                if (shape.id === id && !shape.isPaused) {
                    const newShape = { ...shape, isPaused: true, popped: true };
                    setTimeout(() => {
                        setShapes(prev => prev.map(s => s.id === id ? {...s, popped: false} : s));
                    }, 300);
                    return newShape;
                }
                return shape;
            })
        );
    };

    return (
        <div className="background-shapes" aria-hidden="true">
            {shapes.map(shape => (
                <div
                    key={shape.id}
                    className={`shape ${shape.popped ? 'pop' : ''}`}
                    style={{
                        ...shape.style,
                        animationPlayState: shape.isPaused ? 'paused' : 'running',
                        cursor: shape.isPaused ? 'default' : 'pointer'
                    }}
                    onClick={() => handleShapeClick(shape.id)}
                />
            ))}
        </div>
    );
};

const App = () => {
    return (
        <div className="min-h-screen bg-black text-gray-200 flex items-center justify-center p-4 font-mono selection:bg-blue-800 selection:text-white relative overflow-hidden">
            <AnimatedBackground />
            <style>
                {`
                @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@700&display=swap');
                
                body, .form-input, .form-select, .submit-btn, p, label, option, span {
                    font-family: 'Courier New', Courier, monospace;
                }

                .heading-font {
                    font-family: 'Roboto', sans-serif;
                }

                .form-container {
                    z-index: 10;
                    position: relative;
                    background: rgba(10, 10, 20, 0.85);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 1.25rem;
                    box-shadow: 0 0 25px rgba(66, 133, 244, 0.1); /* Subtle default glow */
                    transition: all 0.4s ease-in-out, box-shadow 0.4s ease-in-out;
                }

                .form-container:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 0 40px rgba(66, 133, 244, 0.3); /* More intense glow on hover */
                }
                
                .form-input, .form-select {
                    background: rgba(0, 0, 0, 0.3);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    color: #fff;
                    transition: all 0.3s ease-in-out;
                }

                .form-input:focus, .form-select:focus {
                    background: rgba(0, 0, 0, 0.5);
                    border-color: #4285F4;
                    box-shadow: 0 0 15px 2px rgba(66, 133, 244, 0.4);
                }

                .submit-btn {
                    background-color: #4285F4;
                    transition: all 0.3s ease-in-out;
                    font-weight: bold;
                    box-shadow: 0 0 10px rgba(66, 133, 244, 0.5);
                }

                .submit-btn:hover {
                    background-color: #5c9bff;
                    transform: translateY(-2px);
                    box-shadow: 0 0 20px rgba(66, 133, 244, 0.8);
                }
                
                .submit-btn:disabled {
                    background-color: #555;
                    cursor: not-allowed;
                    box-shadow: none;
                }

                .message-box { animation: slideIn 0.5s ease-out; }
                @keyframes slideIn { from { opacity: 0; transform: translateY(-15px); } to { opacity: 1; transform: translateY(0); } }

                .loader {
                  border: 4px solid rgba(255,255,255,0.2);
                  border-top: 4px solid #4285F4;
                  border-radius: 50%;
                  width: 24px;
                  height: 24px;
                  animation: spin 1s linear infinite;
                }
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

                /* --- Animated Background Styles --- */
                .background-shapes { position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; z-index: 0; }
                .shape { position: absolute; display: block; list-style: none; animation: float-up 25s linear infinite; bottom: -150px; border-radius: 8px; transition: transform 0.3s ease; }
                .shape.pop { animation: pop-animation 0.3s ease-out forwards; }
                @keyframes pop-animation { 0% { transform: scale(1); } 50% { transform: scale(1.2); } 100% { transform: scale(1); } }
                @keyframes float-up { 0% { transform: translateY(0) rotate(0deg); opacity: 1; border-radius: 8px; } 100% { transform: translateY(-1000px) rotate(720deg); opacity: 0; border-radius: 50%; } }
                `}
            </style>
            
            <Router>
                <Routes>
                    <Route path="/" element={<Form />} />
                    <Route path="/GenAiGamingCafeScannerVerifier" element={<AdminPage />} />
                </Routes>
            </Router>
        </div>
    );
};

export default App;