import Link from 'next/link'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'

function Header() {
  return (
    <header className='sticky top-0 z-10 bg-white border-b border-neutral-200'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center space-x-2 group"
          >
            <span className="text-xl font-light tracking-tight text-neutral-900 group-hover:text-neutral-700 transition-colors">
              scan<span className="font-normal">sheet</span>
            </span>
          </Link>

          {/* Auth buttons */}
          <div className="flex items-center">
            <SignedOut>
              <SignInButton mode='modal'>
                <button 
                  className="px-4 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 transition-colors"
                  aria-label="Se connecter"
                >
                  Se connecter
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8"
                  }
                }}
              />
            </SignedIn>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header