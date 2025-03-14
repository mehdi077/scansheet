import { SignInButton } from '@clerk/nextjs';
import { useUser } from '@clerk/nextjs';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const { isLoaded, user } = useUser();

  if (!isLoaded) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
        <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="fixed inset-0 bg-white flex flex-col items-center justify-center gap-6 z-50">
        <h1 className="text-2xl font-semibold text-gray-800">Connexion requise</h1>
        <p className="text-gray-600">Veuillez vous connecter pour continuer</p>
        <SignInButton mode="modal">
          <button className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl">
            Se connecter
          </button>
        </SignInButton>
      </div>
    );
  }

  return <>{children}</>;
} 