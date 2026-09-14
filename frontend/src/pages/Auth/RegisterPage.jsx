import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Loader2, ShieldCheck } from 'lucide-react';
import { getApiErrorMessage } from '../../services/errorMessage';
import useAuthStore from '../../store/authStore';

const RegisterPage = () => {
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'RECIPIENT',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    if (!['DONOR', 'RECIPIENT'].includes(formData.role)) {
      setError('Please choose a donor or recipient account.');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || null,
        role: formData.role,
      };

      const { user } = await register(payload);

      const redirectMap = {
        ADMIN: '/admin/dashboard',
        DONOR: '/donor/dashboard',
        RECIPIENT: '/recipient/dashboard',
      };

      navigate(redirectMap[user.role] || '/');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Registration failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center bg-slate-50 px-4 py-12 min-h-screen">
      <div className="bg-white shadow-[0_30px_80px_rgba(15,23,42,0.08)] p-8 border border-slate-200 rounded-3xl w-full max-w-lg">
        <div className="flex justify-center items-center gap-3 mb-8">
          <div className="flex justify-center items-center bg-red-600 shadow-sm rounded-2xl w-12 h-12 text-white">
            <Heart className="w-6 h-6" fill="currentColor" />
          </div>
          <div>
            <div className="font-black text-slate-900 text-xl">BloodConnect</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-[0.22em]">join today</div>
          </div>
        </div>

        <div className="mb-6 text-center">
          <h1 className="font-bold text-slate-900 text-3xl">Create your account</h1>
          <p className="mt-2 text-slate-600 text-sm">Register as a donor or recipient.</p>
        </div>

        {error && (
          <div className="bg-red-50 mb-5 px-4 py-3 border border-red-200 rounded-xl text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block mb-2 font-medium text-slate-700 text-sm">Full name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              className="bg-slate-50 focus:bg-white px-4 py-3 border border-slate-200 focus:border-red-300 rounded-xl outline-none focus:ring-4 focus:ring-red-100 w-full text-slate-900 transition"
            />
          </div>

          <div>
            <label htmlFor="email" className="block mb-2 font-medium text-slate-700 text-sm">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="bg-slate-50 focus:bg-white px-4 py-3 border border-slate-200 focus:border-red-300 rounded-xl outline-none focus:ring-4 focus:ring-red-100 w-full text-slate-900 transition"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block mb-2 font-medium text-slate-700 text-sm">Phone</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
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
              minLength={6}
              className="bg-slate-50 focus:bg-white px-4 py-3 border border-slate-200 focus:border-red-300 rounded-xl outline-none focus:ring-4 focus:ring-red-100 w-full text-slate-900 transition"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block mb-2 font-medium text-slate-700 text-sm">Confirm password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              minLength={6}
              className="bg-slate-50 focus:bg-white px-4 py-3 border border-slate-200 focus:border-red-300 rounded-xl outline-none focus:ring-4 focus:ring-red-100 w-full text-slate-900 transition"
            />
          </div>

          <div>
            <label htmlFor="role" className="block mb-2 font-medium text-slate-700 text-sm">Account type</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="bg-slate-50 focus:bg-white px-4 py-3 border border-slate-200 focus:border-red-300 rounded-xl outline-none focus:ring-4 focus:ring-red-100 w-full text-slate-900 transition"
            >
              <option value="RECIPIENT">Recipient</option>
              <option value="DONOR">Donor</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex justify-center items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-70 shadow-sm px-4 py-3 rounded-xl w-full font-semibold text-white text-sm transition disabled:cursor-not-allowed"
          >
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating account...</> : 'Create account'}
          </button>
        </form>

        <div className="flex justify-center items-center gap-2 mt-6 text-slate-500 text-sm">
          <ShieldCheck className="w-4 h-4 text-red-600" />
          Trusted by families, donors, and hospitals.
        </div>

        <div className="mt-6 text-slate-600 text-sm text-center">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-red-600 hover:text-red-700">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
