'use client';

import { useState } from 'react';
import AuthWrapper from '@/components/AuthWrapper';
import ImageProcessing from '@/components/ImageProcessing';
import History from '@/components/History';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'image' | 'pdf'>('image');

  return (
    <AuthWrapper>
      <main className="min-h-screen bg-neutral-50">
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-light text-neutral-800 mb-2">Convertisseur d'Images en Excel</h1>
            <p className="text-neutral-500">Transformez vos images en fichiers Excel téléchargeables en quelques clics</p>
          </div>

          {/* Tab switcher */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex rounded-lg bg-white p-1 shadow-sm">
              <button
                onClick={() => setActiveTab('image')}
                className={`px-6 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  activeTab === 'image'
                    ? 'bg-neutral-900 text-white'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Images
              </button>
              <button
                onClick={() => setActiveTab('pdf')}
                disabled
                className={`px-6 py-2 text-sm font-medium rounded-md transition-all duration-200 flex items-center gap-2 cursor-not-allowed opacity-50 ${
                  activeTab === 'pdf'
                    ? 'bg-neutral-900 text-white'
                    : 'text-neutral-600'
                }`}
              >
                PDF
                <span className="text-xs bg-neutral-200 text-neutral-600 px-2 py-0.5 rounded-full">Bientôt</span>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            {activeTab === 'image' ? <ImageProcessing /> : <span>PDF</span>}
          </div>
          <div className="bg-white rounded-xl shadow-sm p-8">
            <History />
          </div>
        </div>
      </main>
    </AuthWrapper>
  );
}
