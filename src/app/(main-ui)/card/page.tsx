"use client";

import Image from 'next/image';

export default function Card() {
    return (
        <div className="min-h-screen bg-gray-100 pb-20">
            <div className="max-w-md mx-auto bg-gray-50 min-h-screen">
                {/* Header Section */}
                <div className="bg-green-800 relative overflow-hidden">
                    <div className="absolute -top-20 -left-20 w-80 h-80 bg-white rounded-full opacity-10"></div>
                    <div className="absolute -top-10 -right-10 w-60 h-60 bg-white rounded-full opacity-5"></div>
                    
                    <div className="relative z-10 px-4 py-8">
                        <h1 className="text-3xl font-bold text-white mb-6">La mia Card</h1>
                    </div>
                </div>

                {/* Main Content */}
                <div className="px-4 py-6">
                    {/* Card Display Section */}
                    <div className="mb-8">
                        <div className="bg-transparent text-center">
                            <div className="mb-6">
                                <Image
                                    src="/fidelity_card_render.png"
                                    alt="Fidelity Card"
                                    width={400}
                                    height={400}
                                    className="mx-auto"
                                    priority
                                />
                            </div>
                        </div>
                    </div>

                    {/* Instructions Section */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="text-center">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">
                                Come utilizzare la tua card
                            </h2>
                            <p className="text-green-800 text-lg leading-relaxed">
                                Mostra questa schermata nei negozi per ottenere gli sconti riservati ai soci!
                            </p>
                        </div>
                    </div>

                    {/* Benefits Section */}
                    <div className="mt-6 bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
                            Vantaggi della tua card
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <span className="text-gray-700">Sconti esclusivi sui prodotti</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <span className="text-gray-700">Promozioni riservate ai soci</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <span className="text-gray-700">Accesso prioritario alle offerte</span>
                            </div>
                        </div>
                    </div>

                    {/* Energy Team Logo Section */}
                    <div className="mt-16 text-center">
                        <Image
                            src="/imgs/energy_team_andrecharge_logo.png"
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