import { useState, useEffect, useRef } from 'react';
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
  const [isLoadingRequest, setIsLoadingRequest] = useState(false); // For initial request
  const [isLoadingSetPassword, setIsLoadingSetPassword] = useState(false); // For setting new password
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Timer state
  const [countdown, setCountdown] = useState(0);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const { type } = router.query;
    if (type === 'recovery') {
      setShowPasswordFields(true);
      setMessage('Setează o nouă parolă pentru contul tău.');
      // Clear any previous error/message related to the request form
      setError('');
    } else {
      setShowPasswordFields(false); // Ensure it's false when not in recovery mode
    }

    // Clean up interval on component unmount
    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, [router.query]);

  // Handle countdown logic
  useEffect(() => {
    if (countdown > 0) {
      countdownIntervalRef.current = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0 && countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, [countdown]);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingRequest(true);
    setError('');
    setMessage('');

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Te rugăm să introduci o adresă de email validă.');
      setIsLoadingRequest(false);
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://nutrifind.ro/reset-password?type=recovery',
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage('Am trimis un link de resetare a parolei la adresa ta de email. Verifică și folderul de spam.');
      setEmail(''); // Clear email field after sending
      setCountdown(60); // Start 60-second countdown
    }
    setIsLoadingRequest(false);
  };

  const handleSetNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingSetPassword(true);
    setError('');
    setMessage('');

    if (!password || !confirmPassword) {
      setError('Parola și confirmarea parolei sunt obligatorii.');
      setIsLoadingSetPassword(false);
      return;
    }

    if (password.length < 6) {
      setError('Parola trebuie să aibă minim 6 caractere.');
      setIsLoadingSetPassword(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Parolele nu se potrivesc.');
      setIsLoadingSetPassword(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
    } else {
      setMessage('Parola a fost resetată cu succes! Te poți autentifica acum.');
      setPassword('');
      setConfirmPassword('');
      // Redirect to login after a short delay
      setTimeout(() => {
        router.push('/nutritionisti/login');
      }, 3000);
    }
    setIsLoadingSetPassword(false);
  };

  const isRequestButtonDisabled = isLoadingRequest || countdown > 0;
  const setPasswordButtonDisabled = isLoadingSetPassword;

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
                <Link href="/nutritionisti/login" legacyBehavior>
                  <button className="text-green-600 hover:text-green-700 font-medium transition-colors py-2 px-3 rounded-md">
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
                    ? 'Introdu și confirmă noua ta parolă. Asigură-te că este una sigură.'
                    : 'Introdu adresa de email asociată contului tău și îți vom trimite un link securizat pentru resetarea parolei.'}
                </p>
              </div>

              <form className="mt-8 space-y-6" onSubmit={showPasswordFields ? handleSetNewPassword : handleRequestReset}>
                {(error || message) && (
                  <div className={`rounded-md p-4 ${error ? 'bg-red-50 border-l-4 border-red-400' : 'bg-green-50 border-l-4 border-green-400'}`}>
                    <div className="flex">
                      <div className="flex-shrink-0">
                        {error ? (
                          <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.293-3.293a1 1 0 001.414 0L13 12.414l1.879 1.879a1 1 0 101.414-1.414L14.414 11l1.879-1.879a1 1 0 10-1.414-1.414L13 9.586l-1.879-1.879a1 1 0 00-1.414 1.414L11.586 11l-1.879 1.879a1 1 0 000 1.414z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div className="ml-3">
                        <p className={`text-sm ${error ? 'text-red-700' : 'text-green-700'}`}>{error || message}</p>
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
                      disabled={isLoadingRequest || countdown > 0} // Disable during loading or countdown
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
                          placeholder="Introduceți parola nouă"
                          disabled={isLoadingSetPassword}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500 hover:text-gray-700 focus:outline-none"
                          aria-label={showPassword ? "Ascunde parola" : "Arată parola"}
                          disabled={isLoadingSetPassword}
                        >
                          {showPassword ? (
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12c1.292 4.338 5.31 7.5 10.066 7.5.993 0 1.953-.138 2.863-.395m-4.004-3.568L15.75 21m-3.65-3.65a2.25 2.25 0 01-3.182 0M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.572M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21" />
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
                          placeholder="Confirmați parola nouă"
                          disabled={isLoadingSetPassword}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500 hover:text-gray-700 focus:outline-none"
                          aria-label={showConfirmPassword ? "Ascunde parola" : "Arată parola"}
                          disabled={isLoadingSetPassword}
                        >
                          {showConfirmPassword ? (
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12c1.292 4.338 5.31 7.5 10.066 7.5.993 0 1.953-.138 2.863-.395m-4.004-3.568L15.75 21m-3.65-3.65a2.25 2.25 0 01-3.182 0M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.572M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21" />
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
                    disabled={showPasswordFields ? setPasswordButtonDisabled : isRequestButtonDisabled}
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-150 ease-in-out disabled:opacity-75 disabled:cursor-not-allowed"
                  >
                    {showPasswordFields ? (
                      // Loader for setting new password
                      isLoadingSetPassword ? (
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
                      )
                    ) : (
                      // Loader for request reset email
                      isLoadingRequest ? (
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
                      )
                    )}
                    {showPasswordFields ? (isLoadingSetPassword ? 'Setează...' : 'Setează Parola') : (countdown > 0 ? `Re-trimite în ${countdown}s` : (isLoadingRequest ? 'Se trimite...' : 'Trimite Link de Resetare'))}
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