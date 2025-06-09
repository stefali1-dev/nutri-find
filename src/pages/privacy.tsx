import Footer from '@/components/Footer';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';

// Pentru consistență, folosim aceleași componente/structuri de Navbar și Footer
// ca în celelalte pagini. Ideal, acestea ar fi componente reutilizabile.

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
            <Link href="/#how-it-works">
              <span className="text-gray-700 hover:text-green-600 transition-colors cursor-pointer">Cum funcționează</span>
            </Link>
            <Link href="/#benefits">
              <span className="text-gray-700 hover:text-green-600 transition-colors cursor-pointer">Beneficii</span>
            </Link>
            <Link href="/coming-soon?for=client">
              <button className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition-all transform hover:scale-105">
                Găsește Nutriționist
              </button>
            </Link>
            <Link href="/nutritionists/login">
              <button className="bg-white text-green-600 border-2 border-green-600 px-6 py-2 rounded-full hover:bg-green-50 transition-all">
                Login
              </button>
            </Link>
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
            <Link href="/coming-soon?for=client">
              <button className="w-full mt-2 bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition-colors">
                Găsește Nutriționist
              </button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Head>
        <title>Politica de Confidențialitate - NutriFind</title>
        <meta name="description" content="Află cum colectăm, folosim și protejăm datele tale personale pe platforma NutriFind.ro." />
        <meta name="robots" content="noindex, follow" />
      </Head>

      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />

        <main className="flex-grow">
          <div className="bg-gray-50 py-12 md:py-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
                Politica de Confidențialitate
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                Ultima actualizare: 8 Iunie 2025
              </p>
            </div>
          </div>

          <div className="prose prose-lg max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            
            <h2>1. Cine suntem?</h2>
            <p>
                Confidențialitatea datelor dumneavoastră este o prioritate pentru noi.
                Platforma web <strong>NutriFind.ro</strong> ("Platforma") acționează în calitate de operator de date cu caracter personal.
            </p>
            <p>
                Această politică explică ce date colectăm, de ce le colectăm și cum le folosim, în conformitate cu Regulamentul (UE) 2016/679 (Regulamentul General privind Protecția Datelor - GDPR).
            </p>

            <h2>2. Ce fel de date personale colectăm?</h2>
            <p>Colectăm diferite tipuri de date, în funcție de modul în care interacționați cu platforma noastră:</p>
            
            <h4>a) Pentru Utilizatorii-Clienți:</h4>
            <ul>
                <li><strong>Date de cont:</strong> Nume, prenume, adresă de e-mail și o parolă securizată (stocată în format hash).</li>
                <li><strong>Date despre sănătate (categorie specială):</strong> Informații pe care le oferiți voluntar pentru a primi servicii personalizate, cum ar fi vârstă, greutate, înălțime, obiective (slăbit, îngrășat), preferințe alimentare, alergii sau condiții medicale relevante. <strong>Aceste date sunt colectate doar pe baza consimțământului dumneavoastră explicit.</strong></li>
                <li><strong>Date de comunicare:</strong> Conținutul mesajelor schimbate cu Nutriționiștii prin intermediul sistemului de mesagerie al platformei (funcționalitate viitoare).</li>
            </ul>

            <h4>b) Pentru Nutriționiști:</h4>
            <ul>
                <li><strong>Date de cont și profil public:</strong> Nume, prenume, e-mail, parolă (hash), fotografie de profil, descriere profesională, specializări, listă de prețuri, locație.</li>
                <li><strong>Date de verificare:</strong> Documente care atestă calificările (diplome, certificări), pe care le solicităm pentru a asigura un standard de calitate și încredere pe platformă. Acestea sunt stocate securizat și nu sunt publice.</li>
            </ul>

            <h4>c) Pentru toți vizitatorii:</h4>
            <ul>
                <li><strong>Date tehnice și de navigare:</strong> Adresa IP, tipul de browser, sistemul de operare, paginile vizitate, durata vizitei. Acestea sunt colectate automat prin cookie-uri și tehnologii similare.</li>
            </ul>
            
            <h2>3. Temeiul Legal și Scopul Prelucrării</h2>
            <p>Prelucrăm datele dumneavoastră în mod legal, în următoarele scopuri:</p>
            <ul>
                <li><strong>Pentru executarea contractului dintre noi (Art. 6(1)(b) GDPR):</strong>
                    <ul>
                        <li>Crearea, administrarea și securizarea contului dumneavoastră.</li>
                        <li>Facilitarea conexiunii și comunicării între Utilizatori și Nutriționiști.</li>
                        <li>(Funcționalitate viitoare) Procesarea rezervărilor și a plăților pentru serviciile contractate.</li>
                    </ul>
                </li>
                <li><strong>Pe baza consimțământului dumneavoastră (Art. 6(1)(a) și Art. 9(2)(a) GDPR):</strong>
                    <ul>
                        <li>Prelucrarea datelor sensibile privind sănătatea pentru a vă oferi recomandări de nutriționiști și pentru a permite acestora să vă ofere servicii personalizate.</li>
                        <li>Trimiterea de newslettere și comunicări de marketing prin e-mail (via SendGrid), de la care vă puteți dezabona oricând.</li>
                        <li>Utilizarea cookie-urilor de analiză și marketing.</li>
                    </ul>
                </li>
                <li><strong>În baza interesului nostru legitim (Art. 6(1)(f) GDPR):</strong>
                    <ul>
                        <li>Pentru a îmbunătăți și optimiza platforma, asigurându-ne că funcționează corect.</li>
                        <li>Pentru a preveni frauda și a asigura securitatea rețelei și a informațiilor.</li>
                        <li>Pentru a verifica calificările Nutriționiștilor, în interesul menținerii unui marketplace de încredere.</li>
                    </ul>
                </li>
            </ul>

            <h2>4. Cui dezvăluim datele dumneavoastră?</h2>
            <p>Nu vindem și nu închiriem datele dumneavoastră personale. Le putem dezvălui doar către parteneri de încredere (împuterniciți), care ne ajută să operăm platforma:</p>
            <ul>
                <li><strong>Supabase (Irlanda):</strong> Furnizorul nostru pentru infrastructura de backend, inclusiv baza de date (PostgreSQL), autentificare și stocarea securizată a fișierelor (ex: diplome).</li>
                <li><strong>Vercel (SUA):</strong> Serviciul de hosting pentru site-ul nostru web. Transferul de date este protejat prin Clauze Contractuale Standard.</li>
                <li><strong>Cloudflare (SUA):</strong> Serviciul pe care îl folosim pentru securitate (firewall, protecție DDoS) și performanță (CDN). Transferul de date este protejat prin Clauze Contractuale Standard.</li>
                <li><strong>SendGrid (SUA):</strong> Serviciul folosit pentru a trimite e-mailuri tranzacționale (ex: resetarea parolei) și de marketing. Transferul de date este protejat prin Clauze Contractuale Standard.</li>
                <li><strong>Nutriționiștii de pe platformă:</strong> Atunci când un Utilizator contactează un Nutriționist, datele relevante (nume, conținutul mesajelor) sunt partajate cu acel Nutriționist pentru a putea presta serviciul solicitat.</li>
            </ul>
            <p>De asemenea, putem dezvălui datele către autoritățile publice, dacă legea ne impune acest lucru.</p>

            <h2>5. Cât timp stocăm datele?</h2>
            <p>Păstrăm datele dumneavoastră doar atât timp cât este necesar pentru a îndeplini scopurile pentru care au fost colectate:</p>
            <ul>
                <li><strong>Datele contului:</strong> pe toată durata existenței acestuia. La ștergerea contului, datele vor fi anonimizate sau șterse în termen de 90 de zile, cu excepția cazului în care o obligație legală impune o perioadă de retenție mai lungă (ex: date de facturare).</li>
                <li><strong>Documentele de verificare ale Nutriționiștilor:</strong> pe durata colaborării și șterse la scurt timp după încetarea acesteia.</li>
                <li><strong>Cookie-urile:</strong> au o durată de viață variabilă, specificată în Politica de Cookie-uri.</li>
            </ul>

            <h2>6. Drepturile Dumneavoastră conform GDPR</h2>
            <p>Aveți următoarele drepturi cu privire la datele dumneavoastră personale:</p>
            <ul>
                <li><strong>Dreptul de acces:</strong> Puteți solicita o copie a datelor pe care le deținem despre dumneavoastră.</li>
                <li><strong>Dreptul la rectificare:</strong> Puteți solicita corectarea datelor inexacte.</li>
                <li><strong>Dreptul la ștergere ("Dreptul de a fi uitat"):</strong> Puteți solicita ștergerea datelor, în anumite condiții.</li>
                <li><strong>Dreptul la restricționarea prelucrării.</strong></li>
                <li><strong>Dreptul la portabilitatea datelor:</strong> Puteți solicita transferul datelor către un alt operator.</li>
                <li><strong>Dreptul la opoziție:</strong> Vă puteți opune prelucrării în scop de marketing direct.</li>
                <li><strong>Dreptul de a retrage consimțământul:</strong> Puteți retrage oricând consimțământul acordat, fără a afecta legalitatea prelucrării efectuate anterior.</li>
                <li><strong>Dreptul de a depune o plângere:</strong> Puteți depune o plângere la Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal (<a href="https://www.dataprotection.ro/" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">www.dataprotection.ro</a>).</li>
            </ul>
            <p>Pentru a vă exercita aceste drepturi, ne puteți contacta la adresa de e-mail de mai jos.</p>

            <h2>7. Securitatea Datelor</h2>
            <p>Luăm măsuri tehnice și organizatorice adecvate pentru a proteja datele dumneavoastră. Acestea includ folosirea conexiunilor securizate (SSL/TLS), stocarea parolelor în format hash, controlul accesului la date și parteneriate cu furnizori care respectă standardele de securitate.</p>
            
            <h2>8. Modificări ale Politicii</h2>
            <p>Ne rezervăm dreptul de a actualiza această politică. Orice modificare va fi publicată pe această pagină și, în cazul unor schimbări majore, veți fi notificat prin e-mail sau printr-o notificare pe platformă.</p>

            <h2>9. Contact</h2>
            <p>Dacă aveți întrebări despre această politică de confidențialitate sau despre cum prelucrăm datele, vă rugăm să ne scrieți la: <strong className="text-green-600">contact@nutrifind.ro</strong>.</p>
            
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}