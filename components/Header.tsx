"use client"

import Link from 'next/link'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import { useUser } from '@clerk/nextjs'
import { useQuery } from 'convex/react'
import { api } from '../convex/_generated/api'
import { CreditCard, ShoppingCart } from 'lucide-react'

function Header() {
  const { user } = useUser();
  
  // Get user data from Convex when signed in
  const userData = useQuery(api.users.getUserById, 
    user?.id ? { userId: user.id } : "skip"
  );
  
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
              {"ScanSheet"}
            </span>
            <span className="text-xs bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded-full">{"Images & PDF"}</span>
          </Link>

          {/* Auth buttons and Credits */}
          <div className="flex items-center">
            <SignedIn>
              {/* Credits Display - Compact on mobile */}
              <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 bg-neutral-50 rounded-full border border-neutral-200 text-xs sm:text-sm">
                <CreditCard className="w-3 h-3 sm:w-4 sm:h-4 text-neutral-600" />
                <span className="text-neutral-900 whitespace-nowrap">
                  <span className={`font-bold ${userData?.credits === 0 ? 'text-red-600' : 'text-green-600'}`}>{userData?.credits ?? '-'}</span> 
                  <span className="hidden lg:inline"> crédits</span>
                </span>
              </div>
              <Link
                href="/pricing"
                className="ml-2 text-xs sm:text-sm px-2 sm:px-3 py-1.5 text-neutral-600 hover:text-neutral-900 bg-neutral-50 hover:bg-neutral-100 rounded-full border border-neutral-200 transition-colors whitespace-nowrap flex items-center gap-1"
              >
                <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 text-neutral-600" />
                <span className="hidden lg:inline">Acheter des </span>crédits
              </Link>
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-7 h-7 sm:w-8 sm:h-8 ml-2"
                  }
                }}
              />
            </SignedIn>
            <SignedOut>
              <SignInButton mode='modal'>
                <button 
                  className="px-3 py-1.5 text-xs sm:text-sm font-medium text-neutral-700 hover:text-neutral-900 transition-colors"
                  aria-label="Se connecter"
                >
                  Se connecter
                </button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header