
import React from 'react';
import { usePlatform } from '../hooks/usePlatform';
import { ShieldCheckIcon, TrendingDownIcon, SparklesIcon } from './icons';

const Toast: React.FC = () => {
    const { toast } = usePlatform();

    if (!toast) return null;

    const toastStyles = {
        success: {
            bg: 'bg-green-500',
            icon: <ShieldCheckIcon className="w-6 h-6 text-white" />
        },
        error: {
            bg: 'bg-red-500',
            icon: <TrendingDownIcon className="w-6 h-6 text-white" />
        },
        info: {
            bg: 'bg-blue-500',
            icon: <SparklesIcon className="w-6 h-6 text-white" />
        },
    };

    const style = toastStyles[toast.type];

    return (
        <div className="fixed top-5 right-5 z-[2000] transition-all duration-300 animate-fade-in-up">
            <div className={`flex items-center gap-4 ${style.bg} text-white font-semibold py-3 px-5 rounded-xl shadow-2xl`}>
                {style.icon}
                <span>{toast.message}</span>
            </div>
        </div>
    );
};

export default Toast;
