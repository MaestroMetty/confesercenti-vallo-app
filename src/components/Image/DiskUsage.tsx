'use client';

import { getDiskUsage } from "@/lib/GetDiskUsage";
import { useState, useEffect } from "react";

export default function DiskUsage() {
    const [diskUsage, setDiskUsage] = useState<{total: number, free: number, used: number, usagePercentage: number} | null>(null);
    useEffect(() => {
        getDiskUsage().then((diskUsage) => {
            setDiskUsage(diskUsage);
        });
    }, []);
    
    return (
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">Uso del disco</h3>
            <div className="space-y-2">
              <div className="relative w-full h-4 bg-gray-200 rounded">
                {diskUsage ? (
                  <div
                    className={`absolute left-0 top-0 h-full rounded transition-all duration-300 ${
                      diskUsage.usagePercentage > 90 ? 'bg-red-500' : 
                      diskUsage.usagePercentage > 70 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${diskUsage.usagePercentage}%` }}
                  />
                ) : (
                  <div className="absolute left-0 top-0 h-full w-full rounded bg-gray-300 animate-pulse" />
                )}
              </div>
              <div className="text-sm text-gray-600 flex flex-row gap-2">
                {diskUsage ? (
                  <>
                    <p>In uso: {formatBytes(diskUsage.used)} ({diskUsage.usagePercentage.toFixed(1)}%)</p>
                    <p>Libero: {formatBytes(diskUsage.free)}</p>
                    <p>Totale: {formatBytes(diskUsage.total)}</p>
                  </>
                ) : (
                  <p className="animate-pulse">Caricamento...</p>
                )}
              </div>
            </div>
        </div>
        </div>
    )
}


export function formatBytes(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${Math.round(bytes / Math.pow(1024, i))} ${sizes[i]}`;
};