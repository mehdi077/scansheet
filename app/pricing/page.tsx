import React from 'react'
import { Check, Zap, CreditCard, RefreshCcw, ChevronRight, Shield, MessageCircle } from 'lucide-react'

const createWhatsAppUrl = (message: string) => {
  const phoneNumber = "213792107513"
  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`
}

function Pricing() {
  return (
    <div className="min-h-screen bg-neutral-50 pb-24">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl font-light tracking-tight text-neutral-900 sm:text-5xl md:text-6xl mb-8">
              Plans <span className="font-normal">simples</span>, tarification <span className="font-normal">transparente</span>
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-neutral-600 mb-8">
              {"Choisissez le forfait qui correspond le mieux à vos besoins et commencez à transformer vos images et PDF en données exploitables dès aujourd'hui."}
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Cards - MAIN FOCUS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-1">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 transition-transform duration-300">
            <div className="p-8">
              <h3 className="text-2xl font-medium text-neutral-900 mb-2">Débutant</h3>
              <p className="text-neutral-600 mb-6">Idéal pour les petits projets occasionnels</p>
              <div className="flex items-baseline mb-6">
                <span className="text-5xl font-light tracking-tight text-neutral-900">2500</span>
                <span className="ml-2 text-2xl text-neutral-600">DA</span>
              </div>
              <p className="text-neutral-600 mb-8 text-sm">Pour 300 crédits</p>
              <a 
                href={createWhatsAppUrl("Je suis intéressé par le forfait Débutant à 2500 DA pour 300 crédits")}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-6 bg-neutral-900 hover:bg-neutral-800 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm flex items-center justify-center">
                Sélectionner <ChevronRight className="w-4 h-4 ml-2" />
              </a>
            </div>
            <div className="bg-neutral-50 px-8 py-6">
              <h4 className="text-sm font-medium text-neutral-900 mb-4">Ce qui est inclus :</h4>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-neutral-900 flex-shrink-0 mr-3" />
                  <span className="text-neutral-600 text-sm">300 crédits d'extraction</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-neutral-900 flex-shrink-0 mr-3" />
                  <span className="text-neutral-600 text-sm">Validité de 3 mois</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-neutral-900 flex-shrink-0 mr-3" />
                  <span className="text-neutral-600 text-sm">Support par email</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Card 2 - Featured */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-neutral-900 hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 transition-transform duration-300">
            <div className="bg-neutral-900 text-white py-2 px-4 text-center text-sm font-medium">
              Le plus populaire
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-medium text-neutral-900 mb-2">Standard</h3>
              <p className="text-neutral-600 mb-6">Parfait pour les utilisateurs réguliers</p>
              <div className="flex items-baseline mb-6">
                <span className="text-5xl font-light tracking-tight text-neutral-900">5000</span>
                <span className="ml-2 text-2xl text-neutral-600">DA</span>
              </div>
              <p className="text-neutral-600 mb-8 text-sm">Pour 1000 crédits</p>
              <a 
                href={createWhatsAppUrl("Je suis intéressé par le forfait Standard à 5000 DA pour 1000 crédits")}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-6 bg-neutral-900 hover:bg-neutral-800 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm flex items-center justify-center">
                Sélectionner <ChevronRight className="w-4 h-4 ml-2" />
              </a>
            </div>
            <div className="bg-neutral-50 px-8 py-6">
              <h4 className="text-sm font-medium text-neutral-900 mb-4">Ce qui est inclus :</h4>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-neutral-900 flex-shrink-0 mr-3" />
                  <span className="text-neutral-600 text-sm">1000 crédits d'extraction</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-neutral-900 flex-shrink-0 mr-3" />
                  <span className="text-neutral-600 text-sm">Validité de 6 mois</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-neutral-900 flex-shrink-0 mr-3" />
                  <span className="text-neutral-600 text-sm">Support prioritaire</span>
                </li>
            
              </ul>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 transition-transform duration-300">
            <div className="p-8">
              <h3 className="text-2xl font-medium text-neutral-900 mb-2">Personnalisé</h3>
              <p className="text-neutral-600 mb-6">Pour les besoins professionnels sur mesure</p>
              <div className="flex items-baseline mb-6">
                <span className="text-2xl text-neutral-600">Contactez-nous</span>
              </div>
              <p className="text-neutral-600 mb-8 text-sm">Pour un forfait adapté à vos besoins</p>
              <a 
                href={createWhatsAppUrl("Je suis intéressé par le forfait Personnalisé. J'aimerais discuter des options disponibles.")}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-6 bg-neutral-900 hover:bg-neutral-800 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm flex items-center justify-center">
                Contacter les ventes <MessageCircle className="w-4 h-4 ml-2" />
              </a>
            </div>
            <div className="bg-neutral-50 px-8 py-6">
              <h4 className="text-sm font-medium text-neutral-900 mb-4">Ce qui est inclus :</h4>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-neutral-900 flex-shrink-0 mr-3" />
                  <span className="text-neutral-600 text-sm">Crédits illimités</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-neutral-900 flex-shrink-0 mr-3" />
                  <span className="text-neutral-600 text-sm">Support dédié 24/7</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-neutral-900 flex-shrink-0 mr-3" />
                  <span className="text-neutral-600 text-sm">Solutions personnalisées</span>
                </li>
                
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-light text-neutral-900 mb-4">Tous les forfaits incluent</h2>
          <p className="max-w-2xl mx-auto text-lg text-neutral-600">
            Découvrez les fonctionnalités premium disponibles pour tous nos utilisateurs
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Feature 1 */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center mb-6">
              <Zap className="w-6 h-6 text-neutral-900" />
            </div>
            <h3 className="text-lg font-medium text-neutral-900 mb-3">Extraction rapide</h3>
            <p className="text-neutral-600">Récupérez vos données en quelques secondes seulement</p>
          </div>
          {/* Feature 2 */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center mb-6">
              <Shield className="w-6 h-6 text-neutral-900" />
            </div>
            <h3 className="text-lg font-medium text-neutral-900 mb-3">Sécurité maximale</h3>
            <p className="text-neutral-600">Vos données sont chiffrées et sécurisées à tout moment</p>
          </div>
          {/* Feature 3 */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center mb-6">
              <CreditCard className="w-6 h-6 text-neutral-900" />
            </div>
            <h3 className="text-lg font-medium text-neutral-900 mb-3">Paiement sécurisé</h3>
            <p className="text-neutral-600">Transactions sécurisées et options de paiement flexibles</p>
          </div>
          {/* Feature 4 */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center mb-6">
              <RefreshCcw className="w-6 h-6 text-neutral-900" />
            </div>
            <h3 className="text-lg font-medium text-neutral-900 mb-3">Mises à jour régulières</h3>
            <p className="text-neutral-600">Notre technologie s'améliore constamment pour vous</p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-light text-neutral-900 mb-4">Questions fréquentes</h2>
          <p className="max-w-2xl mx-auto text-lg text-neutral-600">
            Tout ce que vous devez savoir sur nos forfaits et services
          </p>
        </div>
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-medium text-neutral-900 mb-3">{"Qu'est-ce qu'un crédit ?"}</h3>
            <p className="text-neutral-600">Un crédit correspond à une image ou une page PDF traitée, quelle que soit sa taille ou sa complexité. Pour chaque image ou page que vous téléchargez et traitez, un crédit est déduit de votre compte.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-medium text-neutral-900 mb-3">{"Quelle est la durée de validité de mes crédits ?"}</h3>
            <p className="text-neutral-600">La validité de vos crédits dépend du forfait choisi : 3 mois pour le forfait Débutant, 6 mois pour le forfait Standard et 12 mois pour le forfait Professionnel.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-medium text-neutral-900 mb-3">{"Puis-je changer de forfait à tout moment ?"}</h3>
            <p className="text-neutral-600">Oui, vous pouvez passer à un forfait supérieur à tout moment. Les crédits restants de votre forfait actuel seront automatiquement transférés vers votre nouveau forfait.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-medium text-neutral-900 mb-3">{"Comment fonctionne le support client ?"}</h3>
            <p className="text-neutral-600">Tous nos forfaits incluent un support par email. Les forfaits Standard et Professionnel bénéficient d'un support prioritaire, et le forfait Professionnel offre en plus un accès au support 24/7.</p>
          </div>
        </div>
      </div>

      {/* Contact/CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-neutral-900 rounded-2xl overflow-hidden shadow-xl">
          <div className="px-8 py-16 sm:p-16">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-light text-white mb-6">Besoin d'un forfait personnalisé ?</h2>
              <p className="text-xl text-neutral-300 mb-8">
                Contactez notre équipe commerciale pour créer un forfait adapté à vos besoins spécifiques
              </p>
              <a 
                href={createWhatsAppUrl("Bonjour, j'aimerais en savoir plus sur vos forfaits personnalisés.")}
                target="_blank"
                rel="noopener noreferrer" 
                className="inline-flex items-center px-8 py-3 bg-white hover:bg-neutral-100 text-neutral-900 text-lg font-medium rounded-lg transition-colors duration-200 shadow-lg">
                <MessageCircle className="w-5 h-5 mr-2" />
                Nous contacter
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Pricing