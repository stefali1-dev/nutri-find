import Footer from '@/components/Footer';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';

// Această componentă este o reprezentare a structurii tale de Navigație și Footer.
// Ideal, acestea ar fi componente separate (ex: components/Navbar.tsx, components/Footer.tsx)
// și importate aici pentru a evita duplicarea codului.
// Am inclus o versiune simplificată direct aici pentru a face codul funcțional "out-of-the-box".

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
            <Link href="/">
              <button className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition-all transform hover:scale-105">
                Găsește Nutriționist
              </button>
            </Link>
            <Link href="/nutritionists/login">
              <button className="cursor-pointer bg-white text-green-600 border-2 border-green-600 px-6 py-2 rounded-full hover:bg-green-50 transition-all">
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
            <Link href="/">
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

export default function TermsAndConditionsPage() {
  return (
    <>
      <Head>
        <title>Termeni și Condiții - NutriFind</title>
        <meta name="description" content="Consultați termenii și condițiile de utilizare a platformei NutriFind.ro." />
        <meta name="robots" content="noindex, follow" /> {/* Recomandat pentru a nu indexa paginile legale */}
      </Head>

      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />

        <main className="flex-grow">
          <div className="bg-gray-50 py-12 md:py-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
                Termeni și Condiții
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                Ultima actualizare: 8 Iunie 2025
              </p>
            </div>
          </div>

          <div className="prose prose-lg max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            
            <p>
                Bine ați venit pe NutriFind.ro! Vă rugăm să citiți cu atenție acești Termeni și Condiții ("Termeni") înainte de a utiliza platforma noastră. Accesarea, navigarea sau utilizarea în orice mod a site-ului web NutriFind.ro ("Platforma") constituie un acord legal și reprezintă acceptarea dumneavoastră necondiționată a acestor Termeni.
            </p>

            <h2 id="definitii">1. Definiții</h2>
            <p>
                În cuprinsul acestui document, următorii termeni vor avea înțelesul specificat mai jos:
            </p>
            <ul>
                <li><strong>Platforma/NutriFind:</strong> Reprezintă site-ul web nutrifind.ro și toate serviciile conexe.</li>
                <li><strong>Utilizator:</strong> Orice persoană fizică care își creează un cont și/sau utilizează Platforma pentru a căuta și a intra în contact cu un Nutriționist.</li>
                <li><strong>Nutriționist:</strong> Specialistul independent (dietetician, nutriționist, tehnician nutriționist etc.) care își creează un profil pe Platformă pentru a-și promova și oferi serviciile profesionale.</li>
                <li><strong>Servicii:</strong> Consultațiile, planurile de nutriție, recomandările și orice alte servicii profesionale oferite de către Nutriționiști Utilizatorilor prin intermediul Platformei.</li>
                <li><strong>Conținut:</strong> Orice text, imagine, video, informație sau alt material publicat pe Platformă de către NutriFind, Utilizatori sau Nutriționiști.</li>
            </ul>

            <h2 id="rolul-platformei">2. Rolul Platformei NutriFind</h2>
            <p>
                NutriFind este o platformă tehnologică ce acționează ca un <strong className="text-green-600">intermediar neutru</strong>. Rolul nostru este de a facilita legătura directă între Utilizatorii care caută servicii de nutriție și Nutriționiștii freelanceri care le oferă.
            </p>
            <ul>
                <li>NutriFind <strong>nu</strong> este un furnizor de servicii medicale, de nutriție sau de wellness.</li>
                <li>NutriFind <strong>nu</strong> angajează Nutriționiștii. Relația contractuală pentru prestarea Serviciilor se stabilește <strong>direct și exclusiv</strong> între Utilizator și Nutriționist.</li>
                <li>Noi nu controlăm, nu garantăm și nu suntem responsabili pentru calitatea, legalitatea, siguranța sau acuratețea Serviciilor oferite de Nutriționiști.</li>
            </ul>
            
            <h2 id="disclaimer-medical">3. Disclaimer Medical și de Sănătate – EXTREM DE IMPORTANT</h2>
            <p className="border-l-4 border-red-500 pl-4 bg-red-50 py-2">
                <strong>INFORMAȚIILE ȘI SERVICIILE PREZENTE PE ACEASTĂ PLATFORMĂ NU ÎNLOCUIESC ȘI NU TREBUIE SĂ ÎNLOCUIASCĂ NICIODATĂ CONSULTUL MEDICAL DE SPECIALITATE, DIAGNOSTICUL SAU TRATAMENTUL PROFESIONIST.</strong>
            </p>
            <p>
                Utilizatorii trebuie să consulte întotdeauna un medic sau un alt furnizor de servicii medicale calificat pentru orice întrebări legate de o afecțiune medicală. Nu ignorați niciodată sfatul medical profesionist și nu amânați solicitarea acestuia din cauza a ceva ce ați citit sau ați obținut prin intermediul Platformei NutriFind.
            </p>
            <p>
                Deciziile luate pe baza informațiilor primite de la Nutriționiști prin intermediul platformei sunt responsabilitatea exclusivă a Utilizatorului. NutriFind nu își asumă nicio responsabilitate pentru acuratețea sfaturilor, consecințele acestora sau pentru orice prejudiciu de sănătate rezultat din utilizarea Serviciilor.
            </p>

            <h2 id="conturi">4. Crearea și Administrarea Conturilor</h2>
            <p>Pentru a utiliza anumite funcționalități, este necesară crearea unui cont. Garantați că toate informațiile furnizate la înregistrare sunt corecte, complete și actuale. Sunteți unicul responsabil pentru securitatea parolei și pentru orice activitate desfășurată în contul dumneavoastră.</p>
            <p><strong>Pentru Nutriționiști:</strong> La crearea unui profil, sunteți de acord să furnizați dovezi ale calificărilor și certificărilor dumneavoastră, dacă acestea sunt solicitate. NutriFind își rezervă dreptul de a efectua un proces de verificare (onboarding), dar nu garantează autenticitatea absolută a fiecărui detaliu declarat de Nutriționist. Prezentarea de informații false poate duce la suspendarea imediată și permanentă a contului.</p>

            <h2 id="obligatii">5. Obligațiile Părților</h2>
            <p><strong>Utilizatorii se obligă:</strong></p>
            <ul>
                <li>Să utilizeze Platforma în mod legal și etic.</li>
                <li>Să furnizeze Nutriționistului informații complete și corecte despre starea de sănătate, obiective și stil de viață.</li>
                <li>Să achite contravaloarea Serviciilor conform înțelegerii cu Nutriționistul (când funcționalitatea va fi disponibilă).</li>
                <li>Să trateze Nutriționistii cu respect și profesionalism.</li>
            </ul>
            <p><strong>Nutriționiștii se obligă:</strong></p>
            <ul>
                <li>Să dețină toate calificările și autorizațiile legale necesare pentru a practica în România.</li>
                <li>Să mențină informațiile din profilul public corecte și actualizate.</li>
                <li>Să presteze Serviciile la un standard înalt de profesionalism și etică.</li>
                <li>Să respecte confidențialitatea datelor Utilizatorilor conform legii și Politicii de Confidențialitate.</li>
            </ul>
             
            <h2 id="monetizare">6. Plăți și Comisioane (Funcționalități Viitoare)</h2>
            <p>Platforma NutriFind intenționează să introducă sisteme de plată pentru a facilita tranzacțiile. La momentul implementării, se vor aplica termeni specifici privind plățile, comisioanele (per tranzacție sau listare promovată) și politica de rambursare. Acestea vor fi comunicate și integrate în acești Termeni.</p>
            <p>Plățile vor fi procesate printr-un furnizor terț securizat (ex: Stripe). NutriFind nu va stoca datele cardului dumneavoastră bancar.</p>

            <h2 id="proprietate-intelectuala">7. Proprietate Intelectuală</h2>
            <p>Conținutul original al Platformei (design, text, logo-uri, cod sursă) este proprietatea exclusivă a NutriFind și este protejat de legile dreptului de autor.</p>
            <p>Conținutul generat de Nutriționiști și Utilizatori (poze de profil, articole, recenzii) rămâne proprietatea acestora. Prin publicarea pe Platformă, acordați NutriFind o licență neexclusivă, globală, gratuită de a utiliza, afișa și distribui acest conținut în scopul operării și promovării Platformei.</p>
            
            <h2 id="limitare-raspundere">8. Limitarea Răspunderii</h2>
            <p>În măsura maximă permisă de lege, NutriFind nu va fi răspunzătoare pentru niciun fel de daune directe, indirecte, incidentale sau punitive care rezultă din:</p>
            <ul>
                <li>Utilizarea sau incapacitatea de a utiliza Platforma.</li>
                <li>Calitatea sau rezultatele Serviciilor prestate de Nutriționiști.</li>
                <li>Orice dispută, conflict sau neînțelegere între un Utilizator și un Nutriționist.</li>
                <li>Accesul neautorizat sau alterarea datelor dumneavoastră.</li>
            </ul>
            <p>Platforma este furnizată "așa cum este" și "așa cum este disponibilă", fără garanții de orice fel.</p>
            
            <h2 id="confidentialitate">9. Protecția Datelor cu Caracter Personal</h2>
            <p>Ne angajăm să protejăm confidențialitatea datelor dumneavoastră. Colectarea și prelucrarea datelor cu caracter personal sunt guvernate de <Link href="/privacy"><span className="text-green-600 hover:underline cursor-pointer">Politica de Confidențialitate</span></Link>, care este parte integrantă a acestor Termeni. Vă rugăm să o consultați pentru a înțelege cum colectăm, folosim și protejăm datele dumneavoastră.</p>

            <h2 id="incetare">10. Încetarea utilizării</h2>
            <p>Puteți înceta utilizarea Platformei și șterge contul în orice moment. NutriFind își rezervă dreptul de a suspenda sau de a înceta accesul dumneavoastră la Platformă, fără notificare prealabilă, în cazul încălcării acestor Termeni, a legii sau a conduitei neadecvate.</p>

            <h2 id="modificari">11. Modificarea Termenilor</h2>
            <p>NutriFind își rezervă dreptul de a modifica acești Termeni în orice moment. Orice modificare va intra în vigoare imediat după publicarea pe această pagină. Vom notifica Utilizatorii cu privire la schimbările semnificative. Continuarea utilizării Platformei după o astfel de modificare constituie acceptul dumneavoastră față de noii Termeni.</p>

            <h2 id="legea-aplicabila">12. Legea Aplicabilă și Jurisdicția</h2>
            <p>Acești Termeni sunt guvernați și interpretați în conformitate cu legislația din România. Orice litigiu care decurge din sau în legătură cu acești Termeni va fi supus spre soluționare instanțelor judecătorești competente din București, România.</p>
            
            <h2 id="contact">13. Contact</h2>
            <p>Pentru orice întrebări sau nelămuriri legate de acești Termeni, vă rugăm să ne contactați la adresa de e-mail: <strong className="text-green-600">contact@nutrifind.ro</strong>.</p>

          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}