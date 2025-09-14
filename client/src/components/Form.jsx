import React, { useState } from 'react';
import api from '../config/axios';

const Form = () => {
    const [formData, setFormData] = useState({
        collegeId: '',
        name: '',
        email: '',
        phone: '',
        couponType: 'Individual'
    });

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [generatedCoupon, setGeneratedCoupon] = useState('');

    const { collegeId, name, email, phone, couponType } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);
        try {
            const res = await api.post('/api/students', formData);
            setMessage(res.data.msg);
            setGeneratedCoupon(res.data.student.couponCode);
            setFormData({
                collegeId: '',
                name: '',
                email: '',
                phone: '',
                couponType: 'Individual'
            });
        } catch (err) {
            const errorMsg = err.response?.data?.msg || 'An unexpected error occurred.';
            setError(errorMsg);
            setGeneratedCoupon('');
            setTimeout(() => setError(''), 5000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-4 justify-center items-start p-2">
            <div className="w-full lg:w-2/3 max-w-3xl form-container p-6 md:p-8 space-y-4">
                <div className="text-center">
                    <img src="https://res.cloudinary.com/dfkyivvyj/image/upload/v1757760973/Screenshot_2025-09-13_162410_gpzggm.png" alt="Logo" className="w-12 h-12 mx-auto mb-2"/>
                    <h1 className="text-2xl md:text-3xl font-bold text-white heading-font">Gaming Cafe.</h1>
                    <p className="mt-1 text-sm text-gray-400">Register Now for discount</p>
                </div>            {message && <div className="p-4 text-center bg-green-900 bg-opacity-50 text-green-300 border border-green-700 rounded-lg message-box transition-all">{message}</div>}
            {error && <div className="p-4 text-center bg-red-900 bg-opacity-50 text-red-300 border border-red-700 rounded-lg message-box transition-all">{error}</div>}
            
            {generatedCoupon && (
                <div className="p-6 text-center bg-blue-900 bg-opacity-50 border border-blue-700 rounded-lg">
                    <h3 className="text-xl font-semibold text-blue-300 mb-2">Your Coupon Code</h3>
                    <div className="bg-gray-900 p-4 rounded-lg">
                        <code className="text-2xl font-mono text-blue-300 tracking-wider">{generatedCoupon}</code>
                    </div>
                    <p className="mt-2 text-gray-400 text-sm">If couldn't find email check in spam section</p>
                    <p className="mt-2 text-gray-400 text-sm">Please save this code in case you don't receive the email</p>
                </div>
            )}

            <form onSubmit={onSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                        <label htmlFor="collegeId" className="block text-xs font-medium text-gray-400 mb-1">College ID</label>
                        <input type="text" name="collegeId" value={collegeId} onChange={onChange} required className="w-full px-3 py-1.5 text-sm rounded-lg form-input focus:outline-none" placeholder="e.g., 21ABC1234" />
                    </div>
                    <div>
                        <label htmlFor="name" className="block text-xs font-medium text-gray-400 mb-1">Full Name</label>
                        <input type="text" name="name" value={name} onChange={onChange} required className="w-full px-3 py-1.5 text-sm rounded-lg form-input focus:outline-none" placeholder="John Doe" />
                    </div>
                </div>
                <div>
                    <label htmlFor="email" className="block text-xs font-medium text-gray-400 mb-1">Email Address</label>
                    <input type="email" name="email" value={email} onChange={onChange} required className="w-full px-3 py-1.5 text-sm rounded-lg form-input focus:outline-none" placeholder="you@example.com"/>
                </div>
                <div>
                    <label htmlFor="phone" className="block text-xs font-medium text-gray-400 mb-1">Phone Number</label>
                    <input type="tel" name="phone" value={phone} onChange={onChange} required className="w-full px-3 py-1.5 text-sm rounded-lg form-input focus:outline-none" placeholder="+91 1234567890" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-2">Select Coupon Type</label>
                        <div className="grid grid-cols-1 gap-3">
                            <div
                                onClick={() => setFormData({ ...formData, couponType: 'Individual' })}
                                className={`cursor-pointer p-3 rounded-lg border-2 transition-all ${
                                    couponType === 'Individual'
                                        ? 'border-blue-500 bg-blue-900 bg-opacity-20'
                                        : 'border-gray-700 hover:border-blue-400'
                                }`}
                            >
                                <div className="flex items-center mb-1">
                                    <div className={`w-4 h-4 rounded-full border-2 mr-2 flex items-center justify-center ${
                                        couponType === 'Individual' ? 'border-blue-500' : 'border-gray-600'
                                    }`}>
                                        {couponType === 'Individual' && (
                                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        )}
                                    </div>
                                    <h3 className="text-sm font-semibold text-white">Individual Offer</h3>
                                </div>
                                <div className="space-y-0.5 text-gray-300 pl-6 text-xs">
                                    <p className="text-blue-300">Base Offer:</p>
                                    <p>🎮 30% off on all gaming sessions</p>
                                    <div className="mt-2 p-1.5 bg-green-900 bg-opacity-30 rounded border border-green-500">
                                        <p className="text-green-400">🎁 First 50 Registrations Special:</p>
                                        <p className="text-green-300 font-medium">1 Hour FREE Gaming Session!</p>
                                        <p className="text-xs text-green-400 mt-1">*Exclusive to Individual registrations</p>
                                    </div>
                                </div>
                            </div>

                            <div
                                onClick={() => setFormData({ ...formData, couponType: 'Team' })}
                                className={`cursor-pointer p-3 rounded-lg border-2 transition-all ${
                                    couponType === 'Team'
                                        ? 'border-blue-500 bg-blue-900 bg-opacity-20'
                                        : 'border-gray-700 hover:border-blue-400'
                                }`}
                            >
                                <div className="flex items-center mb-1">
                                    <div className={`w-4 h-4 rounded-full border-2 mr-2 flex items-center justify-center ${
                                        couponType === 'Team' ? 'border-blue-500' : 'border-gray-600'
                                    }`}>
                                        {couponType === 'Team' && (
                                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        )}
                                    </div>
                                    <h3 className="text-sm font-semibold text-white">Team Offer</h3>
                                </div>
                                <div className="space-y-0.5 text-gray-300 pl-6 text-xs">
                                    <p className="text-blue-300">Squad Special:</p>
                                    <p>👥 Pay for 3 Players</p>
                                    <p className="text-blue-400 font-medium">Play as a Team of 4!</p>
                                    <p className="text-xs text-blue-400 mt-1">Perfect for squad games</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <button type="submit" disabled={loading} className="w-full py-3 px-4 text-white rounded-lg submit-btn focus:outline-none focus:ring-4 focus:ring-blue-300 flex items-center justify-center">
                        {loading ? <div className="loader"></div> : 'Register Now'}
                    </button>
                </div>
            </form>
            </div>
            
            {/* Team Section */}
            <div className="w-full lg:w-1/3 bg-gray-900 bg-opacity-50 p-6 rounded-lg shadow-lg relative z-10">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">Special Thanks To Our Team</h2>
                <div className="space-y-4">
                    <TeamMember
                        name="Shubham Singh"
                        link="https://www.linkedin.com/in/shubham-singh-9765b9287"
                    />
                    <TeamMember
                        name="Ashish Parab"
                        link="https://www.linkedin.com/in/ashishparab03"
                    />
                    <TeamMember
                        name="Namrata Thale"
                        link="https://www.linkedin.com/in/namrata-thale-a5687028b"
                    />
                    <TeamMember
                        name="Vishal Harmankar"
                        link="https://www.linkedin.com/in/vishal-haramkar"
                    />
                    <div className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold">G</span>
                        </div>
                        <div className="text-gray-300 font-medium">
                            <span>Gargi Shelar</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Team Member Component
const TeamMember = ({ name, link }) => (
    <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="block relative z-20"
    >
        <div className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold">{name.charAt(0)}</span>
            </div>
            <div className="text-blue-400 hover:text-blue-300 font-medium flex items-center space-x-2">
                <span>{name}</span>
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"></path>
                </svg>
            </div>
        </div>
    </a>
);

export default Form;