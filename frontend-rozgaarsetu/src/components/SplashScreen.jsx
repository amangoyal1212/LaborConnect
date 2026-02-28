import React from 'react';

const SplashScreen = () => {
    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#FDFBF7] transition-opacity duration-1000">
            <div className="flex flex-col items-center gap-4 cursor-default">
                <div className="h-24 w-24 md:h-32 md:w-32 bg-orange-600 text-white rounded-full flex items-center justify-center text-5xl md:text-7xl font-extrabold shadow-lg">
                    R
                </div>
                <span className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">
                    रोजगार<span className="text-orange-600">-Setu</span>
                </span>
            </div>
        </div>
    );
};

export default SplashScreen;
