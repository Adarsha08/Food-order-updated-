import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Login() {
  const navigate = useNavigate();
  const [loginType, setLoginType] = useState('user');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const sendOTP = async () => {
    if (!phone || phone.length !== 10) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }
    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });
      const data = await res.json();
      if (data.success) {
        setOtpSent(true);
        toast.success('OTP sent successfully!');
        toast.info(`Testing OTP: ${data.otp}`);
      } else {
        toast.error(data.error || 'Failed to send OTP');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    }
    setLoading(false);
  };

  const verifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp, name })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        toast.success('Login successful!');
        navigate('/');
      } else {
        toast.error(data.error || 'Invalid OTP');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    }
    setLoading(false);
  };

  const loginWithPassword = async () => {
    if (!phone || phone.length !== 10) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }
    if (!password) {
      toast.error('Please enter your password');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/login-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        toast.success('Login successful!');
        navigate('/delivery-dashboard');
      } else {
        toast.error(data.error || 'Invalid credentials');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-100 px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl shadow-lg mb-4">
            <span className="text-4xl">🍕</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to order delicious food</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 space-y-6">
          {/* Toggle Buttons */}
          <div className="flex gap-3 p-1 bg-gray-100 rounded-xl">
            <button
              onClick={() => {
                setLoginType('user');
                setOtpSent(false);
                setOtp('');
                setPassword('');
              }}
              className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-300 ${
                loginType === 'user'
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md transform scale-105'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <span className="mr-2">👤</span>
              User
            </button>
            <button
              onClick={() => {
                setLoginType('delivery');
                setOtpSent(false);
                setOtp('');
                setName('');
              }}
              className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-300 ${
                loginType === 'delivery'
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md transform scale-105'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <span className="mr-2">🏍️</span>
              Delivery
            </button>
          </div>

          {/* User Login Form */}
          {loginType === 'user' ? (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="Enter 10-digit number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  disabled={otpSent}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all outline-none disabled:bg-gray-50 disabled:cursor-not-allowed"
                />
              </div>

              {!otpSent ? (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all outline-none"
                    />
                  </div>
                  <button
                    onClick={sendOTP}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-xl font-bold text-lg hover:from-orange-600 hover:to-red-600 transform hover:scale-[1.02] transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      'Send OTP'
                    )}
                  </button>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Enter OTP
                    </label>
                    <input
                      type="text"
                      placeholder="6-digit OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all outline-none text-center text-2xl tracking-widest font-bold"
                      maxLength="6"
                    />
                  </div>
                  <button
                    onClick={verifyOTP}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-xl font-bold text-lg hover:from-orange-600 hover:to-red-600 transform hover:scale-[1.02] transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? 'Verifying...' : 'Verify & Login'}
                  </button>
                  <button
                    onClick={() => {
                      setOtpSent(false);
                      setOtp('');
                    }}
                    className="w-full text-orange-600 font-semibold hover:text-orange-700 transition-colors"
                  >
                    ← Change Phone Number
                  </button>
                </>
              )}
            </div>
          ) : (
            // Delivery Login Form
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="Enter 10-digit number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all outline-none"
                />
              </div>
              <button
                onClick={loginWithPassword}
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-xl font-bold text-lg hover:from-orange-600 hover:to-red-600 transform hover:scale-[1.02] transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </div>
          )}

          {/* Footer Text */}
          <div className="pt-4 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600">
              {loginType === 'user' ? (
                <>
                  <span className="inline-block mr-1">✨</span>
                  New user? No worries! Just enter your details to get started.
                </>
              ) : (
                <>
                  <span className="inline-block mr-1">🔒</span>
                  Delivery staff only. Contact admin for credentials.
                </>
              )}
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            By continuing, you agree to our{' '}
            <a href="#" className="text-orange-600 hover:text-orange-700 font-semibold">
              Terms & Conditions
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;