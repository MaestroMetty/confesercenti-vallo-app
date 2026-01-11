'use server';

import { join } from "path";
import { statfs } from "fs/promises";

export async function getDiskUsage(): Promise<{total: number, free: number, used: number, usagePercentage: number}> {
    const uploadPath = join(process.cwd(), 'uploads');
    const stats = await statfs(uploadPath);
    
    const total = stats.blocks * stats.bsize;
    const free = stats.bfree * stats.bsize;
    const used = total - free;
    const usagePercentage = (used / total) * 100;
  
    return {
      total,
      free,
      used,
      usagePercentage
    };
}