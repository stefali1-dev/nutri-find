import Link from "next/link";

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-2xl font-bold mb-4 text-green-400">NutriFind</h3>
                        <p className="text-gray-400">Platforma care te conectează cu nutriționiști verificați.</p>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Platformă</h4>
                        <ul className="space-y-2">
                            <li><Link href="/#how-it-works"><span className="text-gray-400 hover:text-green-400 transition-colors cursor-pointer">Cum funcționează</span></Link></li>
                            <li><Link href="/nutritionists/find"><span className="text-gray-400 hover:text-green-400 transition-colors cursor-pointer">Găsește nutriționiști</span></Link></li>
                            <li><Link href="/nutritionists/benefits"><span className="text-gray-400 hover:text-green-400 transition-colors cursor-pointer">Pentru nutriționiști</span></Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Companie</h4>
                        <ul className="space-y-2">
                             <li><Link href="/contact"><span className="text-gray-400 hover:text-green-400 transition-colors cursor-pointer">Contact</span></Link></li>
                             <li><Link href="/about"><span className="text-gray-400 hover:text-green-400 transition-colors cursor-pointer">Despre noi</span></Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Legal</h4>
                        <ul className="space-y-2">
                            <li><Link href="/terms"><span className="text-gray-400 hover:text-green-400 transition-colors cursor-pointer">Termeni și condiții</span></Link></li>
                            <li><Link href="/privacy"><span className="text-gray-400 hover:text-green-400 transition-colors cursor-pointer">Politica de confidențialitate</span></Link></li>
                            <li><Link href="/gdpr"><span className="text-gray-400 hover:text-green-400 transition-colors cursor-pointer">Centru GDPR</span></Link></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 pt-8 border-t border-gray-800 text-center">
                    <p className="text-gray-400">
                        © {new Date().getFullYear()} NutriFind. Toate drepturile rezervate.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
