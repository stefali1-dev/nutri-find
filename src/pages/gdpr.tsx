import Footer from '@/components/Footer';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';

// --- Componente de Navigație și Footer ---
// NOTĂ: Acestea ar trebui extrase în componente reutilizabile.
// Am actualizat Footer-ul pentru a include link-ul către această pagină.

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/">
              <span className="text-2xl font-bold text-green-600 cursor-pointer">NutriFind</span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/#how-it-works"><span className="text-gray-700 hover:text-green-600 transition-colors cursor-pointer">Cum funcționează</span></Link>
            <Link href="/#benefits"><span className="text-gray-700 hover:text-green-600 transition-colors cursor-pointer">Beneficii</span></Link>
            <Link href="/"><button className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition-all transform hover:scale-105">Găsește Nutriționist</button></Link>
            <Link href="/nutritionisti/login"><button className="cursor-pointer bg-white text-green-600 border-2 border-green-600 px-6 py-2 rounded-full hover:bg-green-50 transition-all">Login</button></Link>
          </div>
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-700 hover:text-green-600 focus:outline-none">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link href="/#how-it-works"><span className="block px-3 py-2 text-gray-700 hover:text-green-600">Cum funcționează</span></Link>
            <Link href="/#benefits"><span className="block px-3 py-2 text-gray-700 hover:text-green-600">Beneficii</span></Link>
            <Link href="/"><button className="w-full mt-2 bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition-colors">Găsește Nutriționist</button></Link>
          </div>
        </div>
      )}
    </nav>
  );
};

// Componenta SVG pentru iconițe, pentru un design mai plăcut
const CheckCircleIcon = () => (
    <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);


export default function GdprPage() {
  return (
    <>
      <Head>
        <title>Centru GDPR - Drepturile Tale | NutriFind</title>
        <meta name="description" content="Află cum NutriFind.ro îți protejează datele și cum îți poți exercita drepturile conform regulamentului GDPR." />
        <meta name="robots" content="noindex, follow" />
      </Head>

      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />

        <main className="flex-grow">
          <div className="bg-gray-50 py-12 md:py-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
                Centrul de Confidențialitate GDPR
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                Drepturile tale, explicate simplu și transparent.
              </p>
            </div>
          </div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            
            <div className="text-center bg-green-50 p-6 rounded-xl border border-green-200">
                <h2 className="text-2xl font-bold text-gray-800">Angajamentul Nostru</h2>
                <p className="mt-2 text-gray-700">
                    La NutriFind, confidențialitatea ta este fundamentală. GDPR (Regulamentul General privind Protecția Datelor) îți oferă control sporit asupra datelor tale personale. Noi ne angajăm să fim complet transparenți și să îți oferim instrumentele necesare pentru a-ți exercita aceste drepturi simplu și eficient.
                </p>
            </div>
            
            <div className="mt-16">
                <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">Drepturile Tale Conform GDPR</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Dreptul la Informare */}
                    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-600">
                        <h3 className="text-xl font-semibold mb-2">Dreptul la Informare</h3>
                        <p className="text-gray-600">Ai dreptul să știi ce date colectăm, de ce și cum le folosim. Toate aceste detalii sunt disponibile în <Link href="/confidentialitate"><span className="text-green-600 hover:underline cursor-pointer">Politica noastră de Confidențialitate</span></Link>.</p>
                    </div>

                    {/* Dreptul de Acces */}
                    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-600">
                        <h3 className="text-xl font-semibold mb-2">Dreptul de Acces la Date</h3>
                        <p className="text-gray-600">Poți solicita oricând o copie a tuturor datelor personale pe care le deținem despre tine. De obicei, le poți vedea direct în setările contului tău.</p>
                    </div>

                    {/* Dreptul la Rectificare */}
                    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-600">
                        <h3 className="text-xl font-semibold mb-2">Dreptul la Rectificare</h3>
                        <p className="text-gray-600">Dacă datele tale sunt incorecte sau incomplete, ai dreptul să le corectezi. Poți face asta direct din contul tău sau contactându-ne.</p>
                    </div>

                    {/* Dreptul la Ștergere */}
                    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-600">
                        <h3 className="text-xl font-semibold mb-2">Dreptul la Ștergere ("de a fi uitat")</h3>
                        <p className="text-gray-600">Ai dreptul să ne ceri ștergerea completă a datelor tale personale din sistemul nostru, cu excepția cazurilor în care legea ne obligă să le păstrăm.</p>
                    </div>

                    {/* Dreptul la Restricționare */}
                    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-600">
                        <h3 className="text-xl font-semibold mb-2">Dreptul la Restricționarea Prelucrării</h3>
                        <p className="text-gray-600">În anumite situații (de ex., contești acuratețea datelor), poți cere limitarea modului în care îți folosim datele.</p>
                    </div>

                    {/* Dreptul la Portabilitate */}
                    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-600">
                        <h3 className="text-xl font-semibold mb-2">Dreptul la Portabilitatea Datelor</h3>
                        <p className="text-gray-600">Ai dreptul să primești datele tale într-un format electronic structurat, pentru a le putea transfera ușor la un alt serviciu.</p>
                    </div>

                </div>
            </div>

            <div className="mt-16 text-center">
                <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Cum Îți Poți Exercita Drepturile?</h2>
                <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                    Cel mai simplu mod de a-ți gestiona datele este prin intermediul <strong>setărilor contului tău</strong> (funcționalitate ce va fi dezvoltată). Pentru orice solicitare specifică legată de drepturile tale GDPR sau pentru întrebări, te încurajăm să ne scrii.
                </p>
                <div className="mt-8">
                    <a href="mailto:contact@nutrifind.ro" className="bg-green-600 text-white px-10 py-4 rounded-full text-lg font-semibold hover:bg-green-700 transition-all transform hover:scale-105 shadow-lg inline-block">
                       Contactează Responsabilul cu Protecția Datelor
                    </a>
                </div>
            </div>
            
            <div className="mt-16 prose max-w-4xl mx-auto border-t pt-8">
                <h3 className="text-xl font-semibold">Documente Legale Complete</h3>
                <p>Acest centru este un ghid simplificat. Pentru informații complete și detaliate, care constituie baza legală a relației noastre, te rugăm să consulți documentele de mai jos:</p>
                <ul>
                    <li><Link href="/confidentialitate"><span className="text-green-600 hover:underline cursor-pointer font-semibold">Politica de Confidențialitate</span></Link> - Explică în detaliu ce date colectăm, de ce, cum le folosim și cui le partajăm.</li>
                    <li><Link href="/termeni"><span className="text-green-600 hover:underline cursor-pointer font-semibold">Termeni și Condiții</span></Link> - Definește regulile de utilizare a platformei NutriFind.</li>
                </ul>
                <h3 className="text-xl font-semibold mt-6">Autoritatea de Supraveghere</h3>
                <p>Dacă consideri că drepturile tale nu au fost respectate, ai dreptul de a depune o plângere la Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal (ANSPDCP). Website: <a href="https://www.dataprotection.ro/" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">www.dataprotection.ro</a>.</p>
            </div>

          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}