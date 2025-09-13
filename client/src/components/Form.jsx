import React, { useState } from 'react';
import axios from 'axios';

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
            const res = await axios.post('/api/students', formData);
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
        <div className="w-full max-w-2xl form-container m-4 p-8 md:p-12 space-y-6">
            <div className="text-center">
                <img src="https://res.cloudinary.com/dfkyivvyj/image/upload/v1757760973/Screenshot_2025-09-13_162410_gpzggm.png" alt="Logo" className="w-16 h-16 mx-auto mb-4"/>
                <h1 className="text-3xl md:text-4xl font-bold text-white heading-font">Gaming Cafe.</h1>
                <p className="mt-2 text-gray-400">Register Now for discount</p>
            </div>
            
            {message && <div className="p-4 text-center bg-green-900 bg-opacity-50 text-green-300 border border-green-700 rounded-lg message-box transition-all">{message}</div>}
            {error && <div className="p-4 text-center bg-red-900 bg-opacity-50 text-red-300 border border-red-700 rounded-lg message-box transition-all">{error}</div>}
            
            {generatedCoupon && (
                <div className="p-6 text-center bg-blue-900 bg-opacity-50 border border-blue-700 rounded-lg">
                    <h3 className="text-xl font-semibold text-blue-300 mb-2">Your Coupon Code</h3>
                    <div className="bg-gray-900 p-4 rounded-lg">
                        <code className="text-2xl font-mono text-blue-300 tracking-wider">{generatedCoupon}</code>
                    </div>
                    <p className="mt-2 text-gray-400 text-sm">Please save this code in case you don't receive the email</p>
                </div>
            )}

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
                    {/* <div>
                        <label htmlFor="couponCode" className="block text-sm font-medium text-gray-400 mb-2">Coupon Code (Optional)</label>
                        <input type="text" name="couponCode" value={couponCode} onChange={onChange} className="w-full px-4 py-2 rounded-lg form-input focus:outline-none" placeholder="e.g., SUMMER24" />
                    </div> */}
                </div>
                <div>
                    <button type="submit" disabled={loading} className="w-full py-3 px-4 text-white rounded-lg submit-btn focus:outline-none focus:ring-4 focus:ring-blue-300 flex items-center justify-center">
                        {loading ? <div className="loader"></div> : 'Register Now'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Form;