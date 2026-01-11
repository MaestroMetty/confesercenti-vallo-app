"use client";

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  MdErrorOutline, 
  MdWarning, 
  MdRefresh, 
  MdHome, 
  MdArrowBack, 
  MdWifi, 
  MdAccessTime, 
  MdEmail 
} from 'react-icons/md';

interface ErrorPageProps {
  errorType?: '404' | '500' | 'generic';
  title?: string;
  message?: string;
  showHomeButton?: boolean;
  showBackButton?: boolean;
  onReset?: () => void;
  showResetButton?: boolean;
}

export default function ErrorPageComponent({ 
  errorType = 'generic',
  title,
  message,
  showHomeButton = true,
  showBackButton = true,
  onReset,
  showResetButton = false
}: ErrorPageProps) {
  const router = useRouter();

  const getErrorContent = () => {
    switch (errorType) {
      case '404':
        return {
          title: title || 'Pagina Non Trovata',
          message: message || 'La pagina che stai cercando non esiste o è stata spostata.',
          icon: <MdErrorOutline className="w-20 h-20 text-gray-400" />
        };
      case '500':
        return {
          title: title || 'Errore del Server',
          message: message || 'Si è verificato un errore interno. Riprova più tardi.',
          icon: <MdWarning className="w-20 h-20 text-gray-400" />
        };
      default:
        return {
          title: title || 'Ops! Qualcosa è andato storto',
          message: message || 'Si è verificato un errore imprevisto. Riprova più tardi.',
          icon: <MdWarning className="w-20 h-20 text-gray-400" />
        };
    }
  };

  const errorContent = getErrorContent();

  const handleGoHome = () => {
    router.push('/');
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleReset = () => {
    if (onReset) {
      onReset();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      <div className="max-w-md mx-auto bg-gray-50 min-h-screen">
        {/* Header Section */}
        <div className="bg-green-800 relative overflow-hidden">
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-white rounded-full opacity-10"></div>
          <div className="absolute -top-10 -right-10 w-60 h-60 bg-white rounded-full opacity-5"></div>
          
          <div className="relative z-10 px-4 py-8">
            <h1 className="text-3xl font-bold text-white mb-6">Errore</h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-4 py-6">
          {/* Error Icon Section */}
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="mb-6 flex justify-center">
                {errorContent.icon}
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {errorContent.title}
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                {errorContent.message}
              </p>
            </div>
          </div>

          {/* Action Buttons Section */}
          <div className="space-y-4">
            {showResetButton && onReset && (
              <button
                onClick={handleReset}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
              >
                <div className="flex items-center justify-center space-x-2">
                  <MdRefresh className="w-5 h-5" />
                  <span>Riprova</span>
                </div>
              </button>
            )}

            {showHomeButton && (
              <button
                onClick={handleGoHome}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
              >
                <div className="flex items-center justify-center space-x-2">
                  <MdHome className="w-5 h-5" />
                  <span>Torna alla Home</span>
                </div>
              </button>
            )}

            {showBackButton && (
              <button
                onClick={handleGoBack}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition duration-200"
              >
                <div className="flex items-center justify-center space-x-2">
                  <MdArrowBack className="w-5 h-5" />
                  <span>Torna Indietro</span>
                </div>
              </button>
            )}
          </div>

          {/* Help Section */}
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
              Hai bisogno di aiuto?
            </h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MdWifi className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-gray-700">Controlla la tua connessione internet</span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MdAccessTime className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-gray-700">Riprova tra qualche minuto</span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MdEmail className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-gray-700">Se il problema persiste, contatta il supporto</span>
              </div>
            </div>
          </div>

          {/* Energy Team Logo Section */}
          <div className="mt-16 text-center">
            <Image
              src="/imgs/energy_team_logo.jpg"
              alt="Energy Team Logo"
              width={200}
              height={80}
              className="mx-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
