import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Loader2, ShieldCheck } from 'lucide-react';
import { getApiErrorMessage } from '../../services/errorMessage';
import useAuthStore from '../../store/authStore';

const LoginPage = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { user } = await login(formData);

      const redirectMap = {
        ADMIN: '/admin/dashboard',
        DONOR: '/donor/dashboard',
        RECIPIENT: '/recipient/dashboard',
      };

      navigate(redirectMap[user.role] || '/');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Login failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center bg-slate-50 px-4 py-12 min-h-screen">
      <div className="bg-white shadow-[0_30px_80px_rgba(15,23,42,0.08)] p-8 border border-slate-200 rounded-3xl w-full max-w-md">
        <div className="flex justify-center items-center gap-3 mb-8">
          <div className="flex justify-center items-center bg-red-600 shadow-sm rounded-2xl w-12 h-12 text-white">
            <Heart className="w-6 h-6" fill="currentColor" />
          </div>
          <div>
            <div className="font-black text-slate-900 text-xl">BloodConnect</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-[0.22em]">sign in</div>
          </div>
        </div>

        <div className="mb-6 text-center">
          <h1 className="font-bold text-slate-900 text-3xl">Welcome back</h1>
          <p className="mt-2 text-slate-600 text-sm">Access your donor, recipient, or admin account.</p>
        </div>

        {error && (
          <div className="bg-red-50 mb-5 px-4 py-3 border border-red-200 rounded-xl text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block mb-2 font-medium text-slate-700 text-sm">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              className="bg-slate-50 focus:bg-white px-4 py-3 border border-slate-200 focus:border-red-300 rounded-xl outline-none focus:ring-4 focus:ring-red-100 w-full text-slate-900 transition"
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-2 font-medium text-slate-700 text-sm">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              className="bg-slate-50 focus:bg-white px-4 py-3 border border-slate-200 focus:border-red-300 rounded-xl outline-none focus:ring-4 focus:ring-red-100 w-full text-slate-900 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex justify-center items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-70 shadow-sm px-4 py-3 rounded-xl w-full font-semibold text-white text-sm transition disabled:cursor-not-allowed"
          >
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</> : 'Sign in'}
          </button>
        </form>

        <div className="flex justify-center items-center gap-2 mt-6 text-slate-500 text-sm">
          <ShieldCheck className="w-4 h-4 text-red-600" />
          Secure access for verified users
        </div>

        <div className="mt-6 text-slate-600 text-sm text-center">
          Need an account?{' '}
          <Link to="/register" className="font-semibold text-red-600 hover:text-red-700">
            Create one
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
