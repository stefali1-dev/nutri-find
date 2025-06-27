import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';

export default function ResetPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    // Check for a `type` query parameter to determine if it's a password reset confirmation
    const { type } = router.query;
    if (type === 'recovery') {
      setShowPasswordFields(true);
      setMessage('Setează o nouă parolă pentru contul tău.');
    }
  }, [router.query]);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Te rugăm să introduci o adresă de email validă.');
      setIsLoading(false);
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://nutrifind.ro/reset-password?type=recovery', // Ensure this matches your Supabase redirect URL
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage('Am trimis un link de resetare a parolei la adresa ta de email. Verifică și folderul de spam.');
      setEmail(''); // Clear email field after sending
    }
    setIsLoading(false);
  };

  const handleSetNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    if (!password || !confirmPassword) {
      setError('Parola și confirmarea parolei sunt obligatorii.');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Parola trebuie să aibă minim 6 caractere.');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Parolele nu se potrivesc.');
      setIsLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
    } else {
      setMessage('Parola a fost resetată cu succes! Te poți autentifica acum.');
      setPassword('');
      setConfirmPassword('');
      // Optionally redirect to login after a short delay
      setTimeout(() => {
        router.push('/nutritionisti/login');
      }, 3000);
    }
    setIsLoading(false);
  };

  return (
    <>
      <Head>
        <title>Resetare Parolă - NutriFind</title>
        <meta name="description" content="Resetează-ți parola contului NutriFind." />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex flex-col">
        {/* Header */}
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/">
                <span className="text-2xl font-bold text-green-600 cursor-pointer">NutriFind</span>
              </Link>
              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-2">Înapoi la login?</span>
                <Link href="/nutritionisti/login">
                  <button className="text-green-600 hover:text-green-700 font-medium transition-colors">
                    Login
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Reset Password Form Section */}
        <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div className="bg-white shadow-xl rounded-2xl p-8 md:p-10">
              <div className="text-center">
                <svg className="mx-auto h-12 w-auto text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
                <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
                  {showPasswordFields ? 'Setează o nouă parolă' : 'Resetează-ți parola'}
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  {showPasswordFields
                    ? 'Introdu și confirmă noua ta parolă.'
                    : 'Introdu adresa de email asociată contului tău și îți vom trimite un link pentru resetarea parolei.'}
                </p>
              </div>

              <form className="mt-8 space-y-6" onSubmit={showPasswordFields ? handleSetNewPassword : handleRequestReset}>
                {error && (
                  <div className="bg-red-50 border-l-4 border-red-400 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.293-3.293a1 1 0 001.414 0L13 12.414l1.879 1.879a1 1 0 101.414-1.414L14.414 11l1.879-1.879a1 1 0 10-1.414-1.414L13 9.586l-1.879-1.879a1 1 0 00-1.414 1.414L11.586 11l-1.879 1.879a1 1 0 000 1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                {message && (
                  <div className="bg-green-50 border-l-4 border-green-400 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-green-700">{message}</p>
                      </div>
                    </div>
                  </div>
                )}

                {!showPasswordFields ? (
                  <div>
                    <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1">
                      Adresă de email
                    </label>
                    <input
                      id="email-address"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm transition-colors"
                      placeholder="exemplu@domeniu.ro"
                    />
                  </div>
                ) : (
                  <>
                    <div>
                      <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
                        Parolă nouă
                      </label>
                      <div className="relative">
                        <input
                          id="new-password"
                          name="new-password"
                          type={showPassword ? 'text' : 'password'}
                          autoComplete="new-password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm transition-colors"
                          placeholder="Parola nouă"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500 hover:text-gray-700"
                          aria-label={showPassword ? "Ascunde parola" : "Arată parola"}
                        >
                          {showPassword ? (
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.572M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                            </svg>
                          ) : (
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="pt-4">
                      <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                        Confirmă parola nouă
                      </label>
                      <div className="relative">
                        <input
                          id="confirm-password"
                          name="confirm-password"
                          type={showConfirmPassword ? 'text' : 'password'}
                          autoComplete="new-password"
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm transition-colors"
                          placeholder="Confirmă parola nouă"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500 hover:text-gray-700"
                          aria-label={showConfirmPassword ? "Ascunde parola" : "Arată parola"}
                        >
                          {showConfirmPassword ? (
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.572M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                            </svg>
                          ) : (
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-150 ease-in-out disabled:opacity-75 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                        <svg className="h-5 w-5 text-green-500 group-hover:text-green-400 transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                        </svg>
                      </span>
                    )}
                    {isLoading ? (showPasswordFields ? 'Setează...' : 'Se trimite...') : (showPasswordFields ? 'Setează Parola' : 'Trimite Link de Resetare')}
                  </button>
                </div>
              </form>
            </div>
            <p className="mt-8 text-center text-sm text-gray-600">
              Ești client și cauți un nutriționist?{' '}
              <Link href="/" className="font-medium text-green-600 hover:text-green-500 transition-colors">
                Găsește aici
              </Link>
            </p>
          </div>
        </main>

        {/* Footer Minimal */}
        <footer className="bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} NutriFind. Toate drepturile rezervate.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}