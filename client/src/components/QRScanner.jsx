import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const QRScanner = () => {
    const [isScanning, setIsScanning] = useState(false);
    const [scannedData, setScannedData] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [debugInfo, setDebugInfo] = useState('');
    const [manualCode, setManualCode] = useState('');
    const [validationResult, setValidationResult] = useState(null);
    
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);
    const scanIntervalRef = useRef(null);
    const jsQRLoaded = useRef(false);

    const addDebugInfo = (info) => {
        console.log(info);
        setDebugInfo(prev => prev + '\n' + new Date().toLocaleTimeString() + ': ' + info);
    };

    useEffect(() => {
        // Simple script loading
        if (!window.jsQR && !jsQRLoaded.current) {
            addDebugInfo('Loading jsQR library...');
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js';
            script.onload = () => {
                jsQRLoaded.current = true;
                addDebugInfo('jsQR library loaded successfully');
            };
            script.onerror = () => {
                setError('Failed to load QR scanner library');
                addDebugInfo('Failed to load jsQR library');
            };
            document.head.appendChild(script);
        }
    }, []);

    const startScanning = async () => {
        setIsLoading(true);
        setError('');
        setScannedData('');
        setDebugInfo('Starting scanner...');

        try {
            addDebugInfo('Checking browser support...');
            
            if (!navigator.mediaDevices?.getUserMedia) {
                throw new Error('getUserMedia not supported');
            }

            addDebugInfo('Requesting camera access...');
            
            // Simple camera request
            const constraints = {
                video: {
                    width: { ideal: 640 },
                    height: { ideal: 480 },
                    facingMode: { ideal: 'environment' }
                }
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            addDebugInfo('Camera stream obtained');

            if (!videoRef.current) {
                throw new Error('Video element not found');
            }

            streamRef.current = stream;
            videoRef.current.srcObject = stream;
            
            addDebugInfo('Setting up video element...');

            // Simple video setup
            videoRef.current.onloadedmetadata = () => {
                addDebugInfo(`Video loaded: ${videoRef.current.videoWidth}x${videoRef.current.videoHeight}`);
                videoRef.current.play().then(() => {
                    addDebugInfo('Video playing');
                    setIsScanning(true);
                    setIsLoading(false);
                    
                    // Start scanning after a short delay
                    setTimeout(() => {
                        startQRDetection();
                    }, 1000);
                }).catch(err => {
                    addDebugInfo('Video play failed: ' + err.message);
                    setError('Failed to start video');
                    setIsLoading(false);
                });
            };

            videoRef.current.onerror = (e) => {
                addDebugInfo('Video error: ' + e.toString());
                setError('Video loading error');
                setIsLoading(false);
            };

        } catch (err) {
            addDebugInfo('Error: ' + err.message);
            setError(err.message);
            setIsLoading(false);
        }
    };

    const startQRDetection = () => {
        if (!window.jsQR) {
            addDebugInfo('jsQR not loaded yet, retrying in 1 second...');
            setTimeout(startQRDetection, 1000);
            return;
        }

        addDebugInfo('Starting QR detection...');
        scanIntervalRef.current = setInterval(() => {
            scanForQR();
        }, 300); // Scan every 300ms for better performance
    };

    const scanForQR = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (!video || !canvas || !window.jsQR) {
            return;
        }

        if (video.readyState !== 4 || video.videoWidth === 0) {
            return;
        }

        try {
            const context = canvas.getContext('2d');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

            const code = window.jsQR(imageData.data, imageData.width, imageData.height);

            if (code?.data) {
                addDebugInfo('QR Code found: ' + code.data.substring(0, 50) + '...');
                setScannedData(code.data);
                stopScanning();
            }
        } catch (error) {
            addDebugInfo('Scan error: ' + error.message);
        }
    };

    const stopScanning = () => {
        addDebugInfo('Stopping scanner...');
        
        if (scanIntervalRef.current) {
            clearInterval(scanIntervalRef.current);
            scanIntervalRef.current = null;
        }

        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }

        setIsScanning(false);
        setIsLoading(false);
    };

    const validateCoupon = async (code) => {
        setIsLoading(true);
        setError('');
        setValidationResult(null);

        try {
            const response = await axios.post('/api/students/validate-coupon', {
                couponCode: code
            });

            setValidationResult(response.data);
            if (!response.data.success) {
                setError(response.data.msg);
            }
        } catch (err) {
            setError(err.response?.data?.msg || 'Failed to validate coupon');
            setValidationResult({
                success: false,
                msg: err.response?.data?.msg || 'Failed to validate coupon'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const validateManualCode = () => {
        if (manualCode) {
            validateCoupon(manualCode);
            setManualCode('');
        }
    };

    const resetScanner = () => {
        setScannedData('');
        setError('');
        setDebugInfo('');
        setValidationResult(null);
        setManualCode('');
    };

    useEffect(() => {
        return () => {
            stopScanning();
        };
    }, []);

    useEffect(() => {
        if (scannedData) {
            validateCoupon(scannedData);
        }
    }, [scannedData]);

    return (
        <div className="w-full max-w-lg mx-auto p-6 bg-gray-900 rounded-lg border border-gray-700 shadow-lg relative z-20 form-container">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">QR Code Scanner</h2>
                <p className="text-gray-400 text-sm">Debug version with detailed logging</p>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-4 p-3 bg-red-900 bg-opacity-50 border border-red-700 rounded text-red-300 text-sm">
                    <strong>Error:</strong> {error}
                </div>
            )}

          

            {/* Manual Code Entry */}
            <div className="mb-4">
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={manualCode}
                        onChange={(e) => setManualCode(e.target.value)}
                        placeholder="Enter coupon code manually"
                        className="flex-1 p-2 bg-gray-800 border border-gray-700 rounded text-white"
                    />
                    <button
                        onClick={validateManualCode}
                        disabled={isLoading || !manualCode}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded font-medium transition-colors"
                    >
                        Validate
                    </button>
                </div>
            </div>

            {/* Validation Result Display */}
            {validationResult && (
                <div className={`mb-4 p-4 ${validationResult.success ? 'bg-green-900 bg-opacity-50 border-green-700' : 'bg-red-900 bg-opacity-50 border-red-700'} border rounded`}>
                    <h3 className={`${validationResult.success ? 'text-green-300' : 'text-red-300'} font-semibold mb-2`}>
                        {validationResult.success ? 'Coupon Validated!' : 'Validation Failed'}
                    </h3>
                    <div className="bg-gray-800 p-3 rounded text-white text-sm">
                        <p>{validationResult.msg}</p>
                        {validationResult.success && (
                            <div className="mt-2 space-y-1">
                                <p><strong>Name:</strong> {validationResult.data.name}</p>
                                <p><strong>College ID:</strong> {validationResult.data.collegeId}</p>
                                <p><strong>Coupon Type:</strong> {validationResult.data.couponType}</p>
                                <p className={validationResult.data.isInFirstFifty ? 'text-green-400' : 'text-yellow-400'}>
                                    {validationResult.data.firstFiftyMessage}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Scanned Data Display */}
            {scannedData && !validationResult && (
                <div className="mb-4 p-4 bg-green-900 bg-opacity-50 border border-green-700 rounded">
                    <h3 className="text-green-300 font-semibold mb-2">Scanned Code:</h3>
                    <div className="bg-gray-800 p-3 rounded text-white text-sm break-all max-h-32 overflow-y-auto">
                        {scannedData}
                    </div>
                    <button
                        onClick={() => validateCoupon(scannedData)}
                        className="mt-2 w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded font-medium transition-colors"
                    >
                        Validate Scanned Code
                    </button>
                </div>
            )}

            {/* Scanner Interface */}
            {isScanning ? (
                <div className="space-y-4">
                    <div className="relative bg-black rounded-lg overflow-hidden">
                        <video
                            ref={videoRef}
                            className="w-full h-64 object-cover"
                            autoPlay
                            playsInline
                            muted
                            style={{ display: 'block' }}
                        />
                        <canvas ref={canvasRef} className="hidden" />
                        
                        {/* Simple overlay */}
                        <div className="absolute inset-4 border-2 border-blue-500 border-dashed rounded-lg pointer-events-none">
                            <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs">
                                📱 Point at QR code
                            </div>
                        </div>
                    </div>
                    
                    <button
                        onClick={stopScanning}
                        className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                    >
                        Stop Scanner
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Always render video element but hidden when not scanning */}
                    <div style={{ display: 'none' }}>
                        <video ref={videoRef} />
                        <canvas ref={canvasRef} />
                    </div>
                    
                    <button
                        onClick={startScanning}
                        disabled={isLoading}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                Starting Camera...
                            </>
                        ) : (
                            'Start QR Scanner'
                        )}
                    </button>
                    
                    {scannedData && (
                        <button
                            onClick={resetScanner}
                            className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                        >
                            Scan Another Code
                        </button>
                    )}
                </div>
            )}

            {/* Simple Instructions */}
            <div className="mt-4 text-xs text-gray-500 text-center space-y-1">
                <p>📋 Make sure you're using HTTPS</p>
                <p>📱 Allow camera permissions when prompted</p>
                <p>🔍 Point camera directly at QR code</p>
            </div>
        </div>
    );
};

export default QRScanner;