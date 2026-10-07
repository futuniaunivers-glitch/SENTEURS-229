import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const { loginAdmin, setCurrentView } = useApp();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Veuillez entrer le mot de passe administrateur.');
      return;
    }

    setLoading(true);
    setError(null);

    const result = await loginAdmin(password);
    setLoading(false);

    if (!result.success) {
      setError(result.error || 'Mot de passe administrateur incorrect.');
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl border border-stone-200/90 shadow-xl p-6 sm:p-8 space-y-6">
        {/* Top button to go back to shop */}
        <button
          onClick={() => setCurrentView('home')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Retour à la boutique</span>
        </button>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-stone-900 text-amber-200 mx-auto flex items-center justify-center shadow-md">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-stone-900">
            Espace Propriétaire
          </h1>
          <p className="text-xs text-stone-500">
            Accès sécurisé pour la gestion du catalogue, des stocks, des prix de gros et des commandes.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1.5">
              Mot de passe propriétaire
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Entrez votre mot de passe..."
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null);
                }}
                className="w-full pl-3.5 pr-10 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600"
                aria-label={showPassword ? 'Masquer' : 'Afficher'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 disabled:opacity-50 active:scale-[0.98] text-white font-bold text-xs sm:text-sm transition-all shadow-sm"
          >
            {loading ? 'Connexion en cours...' : "Se connecter à l'administration"}
          </button>
        </form>
      </div>
    </div>
  );
};
