import React from 'react';
import { BarChart, Users, DollarSign, Activity } from 'lucide-react';

const AdminLoadingState: React.FC = () => {
    return (
        <div className="space-y-8">
            {/* Header Skeleton */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="h-8 bg-gray-300 rounded w-64 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-48"></div>
            </div>

            {/* Métricas Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { icon: Users, color: 'bg-blue-500' },
                    { icon: Activity, color: 'bg-green-500' },
                    { icon: DollarSign, color: 'bg-purple-500' },
                    { icon: BarChart, color: 'bg-orange-500' }
                ].map((item, index) => (
                    <div key={index} className={`${item.color} rounded-lg p-6 text-white border border-opacity-20 border-white`}>
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <div className="h-4 bg-white/20 rounded w-24 mb-2"></div>
                                <div className="h-8 bg-white/30 rounded w-16"></div>
                            </div>
                            <item.icon className="w-8 h-8 text-white/60" />
                        </div>
                        <div className="mt-4 flex items-center">
                            <div className="h-3 bg-white/20 rounded w-20"></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Menu de Ações Skeleton */}
            <div>
                <div className="h-6 bg-gray-300 rounded w-32 mb-4"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                                <div className="flex-1">
                                    <div className="h-5 bg-gray-300 rounded w-32 mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-48"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Loading Indicator */}
            <div className="flex items-center justify-center py-8">
                <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-200 border-t-[#0f43aa]"></div>
                    <span className="text-gray-600">Carregando dados...</span>
                </div>
            </div>
        </div>
    );
};

export default AdminLoadingState;
