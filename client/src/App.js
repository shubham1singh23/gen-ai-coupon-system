import React, { useState } from 'react';
import axios from 'axios';

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
    const [formData, setFormData] = useState({
        collegeId: '',
        name: '',
        email: '',
        phone: '',
        couponType: 'Individual',
        couponCode: ''
    });

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { collegeId, name, email, phone, couponType, couponCode } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);
        try {
            const res = await axios.post('/api/students', formData);
            setMessage(res.data.msg);
            setFormData({
                collegeId: '',
                name: '',
                email: '',
                phone: '',
                couponType: 'Individual',
                couponCode: ''
            });
            setTimeout(() => setMessage(''), 5000);
        } catch (err) {
            const errorMsg = err.response?.data?.msg || 'An unexpected error occurred.';
            setError(errorMsg);
            setTimeout(() => setError(''), 5000);
        } finally {
            setLoading(false);
        }
    };

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
            
            <div className="w-full max-w-2xl form-container m-4 p-8 md:p-12 space-y-6">
                <div className="text-center">
                    <img src="https://res.cloudinary.com/dfkyivvyj/image/upload/v1757760973/Screenshot_2025-09-13_162410_gpzggm.png" alt="Logo" className="w-16 h-16 mx-auto mb-4"/>
                    <h1 className="text-3xl md:text-4xl font-bold text-white heading-font">Join the Innovators.</h1>
                    <p className="mt-2 text-gray-400">Fill out the form to get started.</p>
                </div>
                
                {message && <div className="p-4 text-center bg-green-900 bg-opacity-50 text-green-300 border border-green-700 rounded-lg message-box transition-all">{message}</div>}
                {error && <div className="p-4 text-center bg-red-900 bg-opacity-50 text-red-300 border border-red-700 rounded-lg message-box transition-all">{error}</div>}

                <form onSubmit={onSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="collegeId" className="block text-sm font-medium text-gray-400 mb-2">College ID</label>
                            <input type="text" name="collegeId" value={collegeId} onChange={onChange} required className="w-full px-4 py-2 rounded-lg form-input focus:outline-none" placeholder="e.g., 21ABC1234" />
                        </div>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                            <input type="text" name="name" value={name} onChange={onChange} required className="w-full px-4 py-2 rounded-lg form-input focus:outline-none" placeholder="John Doe" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                        <input type="email" name="email" value={email} onChange={onChange} required className="w-full px-4 py-2 rounded-lg form-input focus:outline-none" placeholder="you@example.com"/>
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-400 mb-2">Phone Number</label>
                        <input type="tel" name="phone" value={phone} onChange={onChange} required className="w-full px-4 py-2 rounded-lg form-input focus:outline-none" placeholder="+91 1234567890" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="couponType" className="block text-sm font-medium text-gray-400 mb-2">Coupon Type</label>
                            <select name="couponType" value={couponType} onChange={onChange} className="w-full px-4 py-2 rounded-lg form-select focus:outline-none appearance-none">
                                <option>Individual</option>
                                <option>Team</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="couponCode" className="block text-sm font-medium text-gray-400 mb-2">Coupon Code (Optional)</label>
                            <input type="text" name="couponCode" value={couponCode} onChange={onChange} className="w-full px-4 py-2 rounded-lg form-input focus:outline-none" placeholder="e.g., SUMMER24" />
                        </div>
                    </div>
                    <div>
                        <button type="submit" disabled={loading} className="w-full py-3 px-4 text-white rounded-lg submit-btn focus:outline-none focus:ring-4 focus:ring-blue-300 flex items-center justify-center">
                            {loading ? <div className="loader"></div> : 'Register Now'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default App;

