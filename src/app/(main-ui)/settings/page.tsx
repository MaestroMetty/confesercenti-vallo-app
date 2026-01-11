"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function Settings() {
    const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isIOS, setIsIOS] = useState<boolean>(false);
    const [isInstalled, setIsInstalled] = useState<boolean>(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        // Set mounted state after component mounts
        setIsMounted(true);

        // Detect iOS
        const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        setIsIOS(iOS);

        // Check if already installed
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
        const isInStandaloneMode = (window.navigator as { standalone?: boolean }).standalone === true;
        setIsInstalled(isStandalone || isInStandaloneMode);

        // Handle install prompt for Android/Desktop
        const handleBeforeInstallPrompt = (e: Event) => {
            console.log('✅ Install prompt received!');
            e.preventDefault();
            setInstallPrompt(e as BeforeInstallPromptEvent);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        // Check if user can install without prompt (desktop browsers often don't fire beforeinstallprompt)
        const checkInstallability = async () => {
            try {
                // Check if manifest is linked
                const manifestLink = document.querySelector('link[rel="manifest"]');
                
                // Check if running as standalone
                if (!isStandalone && manifestLink) {
                    // For desktop browsers, we can sometimes trigger install differently
                    // This is a fallback for when beforeinstallprompt doesn't fire
                    if (navigator.userAgent.includes('Chrome') && !navigator.userAgent.includes('Mobile')) {
                        console.log('Desktop Chrome detected - install may be available from address bar');
                        // We'll let the button be visible even without prompt
                        // The browser will handle it
                    }
                }
            } catch (error) {
                console.error('Error checking installability:', error);
            }
        };

        checkInstallability();

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (installPrompt) {
            await installPrompt.prompt();
            const { outcome } = await installPrompt.userChoice;
            console.log('User choice:', outcome);
            setInstallPrompt(null);
        } else {
            console.log('Install prompt not available');
            console.log('Browser:', navigator.userAgent);
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
                        <h1 className="text-3xl font-bold text-white mb-6">Impostazioni</h1>
                    </div>
                </div>

                {/* Main Content */}
                <div className="px-4 py-6">
                    {/* Logo Section */}
                    <div className="mb-8">
                        <div className="bg-white rounded-lg shadow-md p-6 text-center">
                            <div className="mb-4">
                                <Image
                                    src="/imgs/energy_team_logo.jpg"
                                    alt="Energy Team Logo"
                                    width={300}
                                    height={200}
                                    className="mx-auto rounded-lg"
                                    priority
                                />
                            </div>
                            <p className="text-gray-700 text-lg font-medium">
                                Accedi subito alla tua carta fedeltà installando la nostra app!
                            </p>
                        </div>
                    </div>

                    {/* Install Section */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        {!isMounted ? (
                            <div className="text-center py-6">
                                <div className="animate-pulse text-gray-400">Caricamento...</div>
                            </div>
                        ) : isInstalled ? (
                            <div className="text-center">
                                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                                    <p className="font-semibold">✅ App Installata</p>
                                    <p className="text-sm">L&apos;app è già installata sul tuo dispositivo.</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                {isIOS ? (
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
                                            Installazione su iOS
                                        </h2>
                                        <div className="space-y-3 text-gray-700">
                                            <div className="flex items-start space-x-3">
                                                <span className="font-bold text-green-600 text-lg">1.</span>
                                                <span>Apri Safari sul tuo iPhone o iPad</span>
                                            </div>
                                            <div className="flex items-start space-x-3">
                                                <span className="font-bold text-green-600 text-lg">2.</span>
                                                <span>Tocca il pulsante di condivisione (in basso al centro)</span>
                                            </div>
                                            <div className="flex items-start space-x-3">
                                                <span className="font-bold text-green-600 text-lg">3.</span>
                                                <span>Scorri verso il basso e tocca &quot;Aggiungi alla schermata Home&quot;</span>
                                            </div>
                                            <div className="flex items-start space-x-3">
                                                <span className="font-bold text-green-600 text-lg">4.</span>
                                                <span>Conferma toccando &quot;Aggiungi&quot;</span>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <h2 className="text-xl font-bold text-gray-800 mb-4">
                                            Installa l&apos;App
                                        </h2>
                                        <button
                                            onClick={handleInstallClick}
                                            disabled={!installPrompt}
                                            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
                                        >
                                            Installa Ora
                                        </button>
                                        {!installPrompt && (
                                            <div className="mt-4 text-sm text-gray-600 space-y-2">
                                                <p className="text-center">
                                                    Se non riesci a cliccare il pulsante di installazione, prova le seguenti opzioni:
                                                </p>
                                                <div className="bg-blue-50 border border-blue-200 rounded p-3 text-left">
                                                    <p className="font-semibold text-blue-800 mb-1">💡 Come installare:</p>
                                                    <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
                                                        <li>PC/Laptop: Cerca il pulsante con icona &quot;↓&quot; nella barra degli indirizzi</li>
                                                        <li>Android: Menu (⋮) → &quot;Aggiungi alla schermata Home&quot;</li>
                                                        <li>Controlla che l&apos;app non sia già installata sul tuo dispositivo</li>
                                                        <li>Assicurati che il tuo browser supporti l&apos;installazione dell&apos;app</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* RE-CHARGE Logo Section */}
                    <div className="mt-16 text-center">
                        <Image
                            src="/imgs/recharge_logo.jpg"
                            alt="RE-CHARGE energia"
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