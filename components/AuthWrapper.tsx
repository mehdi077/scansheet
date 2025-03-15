import { SignInButton } from '@clerk/nextjs';
import { useUser } from '@clerk/nextjs';
import { FileSpreadsheet, Image, Zap, Clock, Lock, BarChart } from 'lucide-react';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const { isLoaded, user } = useUser();

  if (!isLoaded) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
        <div className="w-12 h-12 border-4 border-neutral-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-neutral-50">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center">
              <h1 className="text-4xl font-light tracking-tight text-neutral-900 sm:text-5xl md:text-6xl mb-8">
                Transformez vos <span className="font-normal">images</span> en <span className="font-normal">données</span>
              </h1>
              <p className="max-w-2xl mx-auto text-xl text-neutral-600 mb-8">
                Extrayez automatiquement le texte de vos images et convertissez-le en fichiers Excel exploitables en quelques secondes.
              </p>
              <SignInButton mode="modal">
                <button className="inline-flex items-center px-8 py-3 bg-neutral-900 hover:bg-neutral-800 text-white text-lg font-medium rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl">
                  Commencer gratuitement
                </button>
              </SignInButton>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="bg-white py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-light text-neutral-900">Comment ça fonctionne</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {/* Feature 1 */}
              <div className="flex flex-col items-center text-center p-6">
                <div className="w-16 h-16 bg-neutral-100 rounded-2xl flex items-center justify-center mb-6">
                  <Image className="w-8 h-8 text-neutral-900" />
                </div>
                <h3 className="text-xl font-medium text-neutral-900 mb-3">Importez vos images</h3>
                <p className="text-neutral-600">Téléchargez vos images contenant du texte par simple glisser-déposer</p>
              </div>
              {/* Feature 2 */}
              <div className="flex flex-col items-center text-center p-6">
                <div className="w-16 h-16 bg-neutral-100 rounded-2xl flex items-center justify-center mb-6">
                  <Zap className="w-8 h-8 text-neutral-900" />
                </div>
                <h3 className="text-xl font-medium text-neutral-900 mb-3">Extraction automatique</h3>
                <p className="text-neutral-600">Notre technologie OCR extrait automatiquement tout le texte de vos images</p>
              </div>
              {/* Feature 3 */}
              <div className="flex flex-col items-center text-center p-6">
                <div className="w-16 h-16 bg-neutral-100 rounded-2xl flex items-center justify-center mb-6">
                  <FileSpreadsheet className="w-8 h-8 text-neutral-900" />
                </div>
                <h3 className="text-xl font-medium text-neutral-900 mb-3">Fichiers Excel</h3>
                <p className="text-neutral-600">Téléchargez instantanément vos données au format Excel</p>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-neutral-50 py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-light text-neutral-900">Pourquoi choisir ScanSheet ?</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Benefit 1 */}
              <div className="flex items-start p-6 bg-white rounded-xl shadow-sm">
                <div className="flex-shrink-0 mr-4">
                  <Clock className="w-6 h-6 text-neutral-900" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-neutral-900 mb-2">Gain de temps considérable</h3>
                  <p className="text-neutral-600">Fini la saisie manuelle fastidieuse. Automatisez l'extraction de vos données en quelques clics.</p>
                </div>
              </div>
              {/* Benefit 2 */}
              <div className="flex items-start p-6 bg-white rounded-xl shadow-sm">
                <div className="flex-shrink-0 mr-4">
                  <Lock className="w-6 h-6 text-neutral-900" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-neutral-900 mb-2">Sécurité garantie</h3>
                  <p className="text-neutral-600">Vos données sont traitées de manière sécurisée et supprimées après traitement.</p>
                </div>
              </div>
              {/* Benefit 3 */}
              <div className="flex items-start p-6 bg-white rounded-xl shadow-sm">
                <div className="flex-shrink-0 mr-4">
                  <BarChart className="w-6 h-6 text-neutral-900" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-neutral-900 mb-2">Précision optimale</h3>
                  <p className="text-neutral-600">Notre technologie de reconnaissance optique assure une extraction précise de vos données.</p>
                </div>
              </div>
              {/* CTA */}
              <div className="flex items-center justify-center p-6 bg-neutral-900 rounded-xl shadow-sm">
                <div className="text-center">
                  <h3 className="text-xl font-medium text-white mb-4">Prêt à commencer ?</h3>
                  <SignInButton mode="modal">
                    <button className="inline-flex items-center px-6 py-2.5 bg-white hover:bg-neutral-100 text-neutral-900 text-sm font-medium rounded-lg transition-colors duration-200">
                      Créer un compte gratuit
                    </button>
                  </SignInButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
} 