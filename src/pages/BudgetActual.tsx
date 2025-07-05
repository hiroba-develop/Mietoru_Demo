import React, { useState, useEffect, useCallback } from "react";
import { Download, Save } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface Sale {
  userId: string;
  year: number;
  month: number;
  saleTarget: number;
  saleResult: number;
}

interface Profit {
  userId: string;
  year: number;
  month: number;
  profitTarget: number;
  profitResult: number;
}

interface NetAsset {
  userId: string;
  year: number;
  netAssetTarget: number;
  netAssetResult: number;
}

interface MonthlyData {
  id: number;
  month: string;
  target: number;
  actual: number;
  profit: number;
  profitTarget: number;
}

// デモ用のユーザー設定
const demoUserSetup = {
  fiscalYearStartMonth: 4, // 4月開始
  fiscalYearStartYear: 2020,
};

// デモ用の売上データ（10年分）
const demoSales: Sale[] = [
  // 2020年度（2020年4月～2021年3月）
  {
    userId: "demo",
    year: 2020,
    month: 4,
    saleTarget: 3000000,
    saleResult: 2800000,
  },
  {
    userId: "demo",
    year: 2020,
    month: 5,
    saleTarget: 3200000,
    saleResult: 3100000,
  },
  {
    userId: "demo",
    year: 2020,
    month: 6,
    saleTarget: 3500000,
    saleResult: 3300000,
  },
  {
    userId: "demo",
    year: 2020,
    month: 7,
    saleTarget: 3800000,
    saleResult: 3600000,
  },
  {
    userId: "demo",
    year: 2020,
    month: 8,
    saleTarget: 3600000,
    saleResult: 3800000,
  },
  {
    userId: "demo",
    year: 2020,
    month: 9,
    saleTarget: 3300000,
    saleResult: 3100000,
  },
  {
    userId: "demo",
    year: 2020,
    month: 10,
    saleTarget: 3400000,
    saleResult: 3500000,
  },
  {
    userId: "demo",
    year: 2020,
    month: 11,
    saleTarget: 3700000,
    saleResult: 3900000,
  },
  {
    userId: "demo",
    year: 2020,
    month: 12,
    saleTarget: 4200000,
    saleResult: 4400000,
  },
  {
    userId: "demo",
    year: 2021,
    month: 1,
    saleTarget: 3900000,
    saleResult: 3700000,
  },
  {
    userId: "demo",
    year: 2021,
    month: 2,
    saleTarget: 3500000,
    saleResult: 3400000,
  },
  {
    userId: "demo",
    year: 2021,
    month: 3,
    saleTarget: 3600000,
    saleResult: 3700000,
  },

  // 2021年度（2021年4月～2022年3月）
  {
    userId: "demo",
    year: 2021,
    month: 4,
    saleTarget: 3500000,
    saleResult: 3300000,
  },
  {
    userId: "demo",
    year: 2021,
    month: 5,
    saleTarget: 3700000,
    saleResult: 3800000,
  },
  {
    userId: "demo",
    year: 2021,
    month: 6,
    saleTarget: 4000000,
    saleResult: 3900000,
  },
  {
    userId: "demo",
    year: 2021,
    month: 7,
    saleTarget: 4300000,
    saleResult: 4100000,
  },
  {
    userId: "demo",
    year: 2021,
    month: 8,
    saleTarget: 4100000,
    saleResult: 4300000,
  },
  {
    userId: "demo",
    year: 2021,
    month: 9,
    saleTarget: 3800000,
    saleResult: 3600000,
  },
  {
    userId: "demo",
    year: 2021,
    month: 10,
    saleTarget: 3900000,
    saleResult: 4000000,
  },
  {
    userId: "demo",
    year: 2021,
    month: 11,
    saleTarget: 4200000,
    saleResult: 4400000,
  },
  {
    userId: "demo",
    year: 2021,
    month: 12,
    saleTarget: 4700000,
    saleResult: 4900000,
  },
  {
    userId: "demo",
    year: 2022,
    month: 1,
    saleTarget: 4400000,
    saleResult: 4200000,
  },
  {
    userId: "demo",
    year: 2022,
    month: 2,
    saleTarget: 4000000,
    saleResult: 3900000,
  },
  {
    userId: "demo",
    year: 2022,
    month: 3,
    saleTarget: 4100000,
    saleResult: 4200000,
  },

  // 2022年度（2022年4月～2023年3月）
  {
    userId: "demo",
    year: 2022,
    month: 4,
    saleTarget: 4000000,
    saleResult: 3800000,
  },
  {
    userId: "demo",
    year: 2022,
    month: 5,
    saleTarget: 4200000,
    saleResult: 4300000,
  },
  {
    userId: "demo",
    year: 2022,
    month: 6,
    saleTarget: 4500000,
    saleResult: 4400000,
  },
  {
    userId: "demo",
    year: 2022,
    month: 7,
    saleTarget: 4800000,
    saleResult: 4600000,
  },
  {
    userId: "demo",
    year: 2022,
    month: 8,
    saleTarget: 4600000,
    saleResult: 4800000,
  },
  {
    userId: "demo",
    year: 2022,
    month: 9,
    saleTarget: 4300000,
    saleResult: 4100000,
  },
  {
    userId: "demo",
    year: 2022,
    month: 10,
    saleTarget: 4400000,
    saleResult: 4500000,
  },
  {
    userId: "demo",
    year: 2022,
    month: 11,
    saleTarget: 4700000,
    saleResult: 4900000,
  },
  {
    userId: "demo",
    year: 2022,
    month: 12,
    saleTarget: 5200000,
    saleResult: 5400000,
  },
  {
    userId: "demo",
    year: 2023,
    month: 1,
    saleTarget: 4900000,
    saleResult: 4700000,
  },
  {
    userId: "demo",
    year: 2023,
    month: 2,
    saleTarget: 4500000,
    saleResult: 4400000,
  },
  {
    userId: "demo",
    year: 2023,
    month: 3,
    saleTarget: 4600000,
    saleResult: 4700000,
  },

  // 2023年度（2023年4月～2024年3月）
  {
    userId: "demo",
    year: 2023,
    month: 4,
    saleTarget: 5000000,
    saleResult: 4800000,
  },
  {
    userId: "demo",
    year: 2023,
    month: 5,
    saleTarget: 5200000,
    saleResult: 5100000,
  },
  {
    userId: "demo",
    year: 2023,
    month: 6,
    saleTarget: 5500000,
    saleResult: 5300000,
  },
  {
    userId: "demo",
    year: 2023,
    month: 7,
    saleTarget: 6000000,
    saleResult: 5800000,
  },
  {
    userId: "demo",
    year: 2023,
    month: 8,
    saleTarget: 5800000,
    saleResult: 6200000,
  },
  {
    userId: "demo",
    year: 2023,
    month: 9,
    saleTarget: 5300000,
    saleResult: 5100000,
  },
  {
    userId: "demo",
    year: 2023,
    month: 10,
    saleTarget: 5600000,
    saleResult: 5900000,
  },
  {
    userId: "demo",
    year: 2023,
    month: 11,
    saleTarget: 6200000,
    saleResult: 6500000,
  },
  {
    userId: "demo",
    year: 2023,
    month: 12,
    saleTarget: 7000000,
    saleResult: 7200000,
  },
  {
    userId: "demo",
    year: 2024,
    month: 1,
    saleTarget: 6500000,
    saleResult: 6300000,
  },
  {
    userId: "demo",
    year: 2024,
    month: 2,
    saleTarget: 5800000,
    saleResult: 5600000,
  },
  {
    userId: "demo",
    year: 2024,
    month: 3,
    saleTarget: 6000000,
    saleResult: 6100000,
  },

  // 2024年度（2024年4月～2025年3月）
  {
    userId: "demo",
    year: 2024,
    month: 4,
    saleTarget: 5500000,
    saleResult: 5200000,
  },
  {
    userId: "demo",
    year: 2024,
    month: 5,
    saleTarget: 5800000,
    saleResult: 5900000,
  },
  {
    userId: "demo",
    year: 2024,
    month: 6,
    saleTarget: 6200000,
    saleResult: 6000000,
  },
  {
    userId: "demo",
    year: 2024,
    month: 7,
    saleTarget: 6500000,
    saleResult: 6800000,
  },
  {
    userId: "demo",
    year: 2024,
    month: 8,
    saleTarget: 6000000,
    saleResult: 6200000,
  },
  {
    userId: "demo",
    year: 2024,
    month: 9,
    saleTarget: 5700000,
    saleResult: 5500000,
  },
  {
    userId: "demo",
    year: 2024,
    month: 10,
    saleTarget: 6100000,
    saleResult: 6300000,
  },
  {
    userId: "demo",
    year: 2024,
    month: 11,
    saleTarget: 6800000,
    saleResult: 7000000,
  },
  {
    userId: "demo",
    year: 2024,
    month: 12,
    saleTarget: 7500000,
    saleResult: 7800000,
  },
  {
    userId: "demo",
    year: 2025,
    month: 1,
    saleTarget: 7000000,
    saleResult: 6800000,
  },
  {
    userId: "demo",
    year: 2025,
    month: 2,
    saleTarget: 6200000,
    saleResult: 6100000,
  },
  {
    userId: "demo",
    year: 2025,
    month: 3,
    saleTarget: 6500000,
    saleResult: 6400000,
  },

  // 2025年度（2025年4月～2026年3月）
  {
    userId: "demo",
    year: 2025,
    month: 4,
    saleTarget: 6000000,
    saleResult: 5900000,
  },
  {
    userId: "demo",
    year: 2025,
    month: 5,
    saleTarget: 6300000,
    saleResult: 6200000,
  },
  {
    userId: "demo",
    year: 2025,
    month: 6,
    saleTarget: 6700000,
    saleResult: 6500000,
  },
  {
    userId: "demo",
    year: 2025,
    month: 7,
    saleTarget: 7000000,
    saleResult: 6900000,
  },
  { userId: "demo", year: 2025, month: 8, saleTarget: 6500000, saleResult: 0 },
  { userId: "demo", year: 2025, month: 9, saleTarget: 6200000, saleResult: 0 },
  { userId: "demo", year: 2025, month: 10, saleTarget: 6600000, saleResult: 0 },
  { userId: "demo", year: 2025, month: 11, saleTarget: 7300000, saleResult: 0 },
  { userId: "demo", year: 2025, month: 12, saleTarget: 8000000, saleResult: 0 },
  { userId: "demo", year: 2026, month: 1, saleTarget: 7500000, saleResult: 0 },
  { userId: "demo", year: 2026, month: 2, saleTarget: 6800000, saleResult: 0 },
  { userId: "demo", year: 2026, month: 3, saleTarget: 7000000, saleResult: 0 },

  // 2026年度（2026年4月～2027年3月）
  { userId: "demo", year: 2026, month: 4, saleTarget: 6500000, saleResult: 0 },
  { userId: "demo", year: 2026, month: 5, saleTarget: 6800000, saleResult: 0 },
  { userId: "demo", year: 2026, month: 6, saleTarget: 7200000, saleResult: 0 },
  { userId: "demo", year: 2026, month: 7, saleTarget: 7500000, saleResult: 0 },
  { userId: "demo", year: 2026, month: 8, saleTarget: 7000000, saleResult: 0 },
  { userId: "demo", year: 2026, month: 9, saleTarget: 6700000, saleResult: 0 },
  { userId: "demo", year: 2026, month: 10, saleTarget: 7100000, saleResult: 0 },
  { userId: "demo", year: 2026, month: 11, saleTarget: 7800000, saleResult: 0 },
  { userId: "demo", year: 2026, month: 12, saleTarget: 8500000, saleResult: 0 },
  { userId: "demo", year: 2027, month: 1, saleTarget: 8000000, saleResult: 0 },
  { userId: "demo", year: 2027, month: 2, saleTarget: 7300000, saleResult: 0 },
  { userId: "demo", year: 2027, month: 3, saleTarget: 7500000, saleResult: 0 },

  // 2027年度（2027年4月～2028年3月）
  { userId: "demo", year: 2027, month: 4, saleTarget: 7000000, saleResult: 0 },
  { userId: "demo", year: 2027, month: 5, saleTarget: 7300000, saleResult: 0 },
  { userId: "demo", year: 2027, month: 6, saleTarget: 7700000, saleResult: 0 },
  { userId: "demo", year: 2027, month: 7, saleTarget: 8000000, saleResult: 0 },
  { userId: "demo", year: 2027, month: 8, saleTarget: 7500000, saleResult: 0 },
  { userId: "demo", year: 2027, month: 9, saleTarget: 7200000, saleResult: 0 },
  { userId: "demo", year: 2027, month: 10, saleTarget: 7600000, saleResult: 0 },
  { userId: "demo", year: 2027, month: 11, saleTarget: 8300000, saleResult: 0 },
  { userId: "demo", year: 2027, month: 12, saleTarget: 9000000, saleResult: 0 },
  { userId: "demo", year: 2028, month: 1, saleTarget: 8500000, saleResult: 0 },
  { userId: "demo", year: 2028, month: 2, saleTarget: 7800000, saleResult: 0 },
  { userId: "demo", year: 2028, month: 3, saleTarget: 8000000, saleResult: 0 },

  // 2028年度（2028年4月～2029年3月）
  { userId: "demo", year: 2028, month: 4, saleTarget: 7500000, saleResult: 0 },
  { userId: "demo", year: 2028, month: 5, saleTarget: 7800000, saleResult: 0 },
  { userId: "demo", year: 2028, month: 6, saleTarget: 8200000, saleResult: 0 },
  { userId: "demo", year: 2028, month: 7, saleTarget: 8500000, saleResult: 0 },
  { userId: "demo", year: 2028, month: 8, saleTarget: 8000000, saleResult: 0 },
  { userId: "demo", year: 2028, month: 9, saleTarget: 7700000, saleResult: 0 },
  { userId: "demo", year: 2028, month: 10, saleTarget: 8100000, saleResult: 0 },
  { userId: "demo", year: 2028, month: 11, saleTarget: 8800000, saleResult: 0 },
  { userId: "demo", year: 2028, month: 12, saleTarget: 9500000, saleResult: 0 },
  { userId: "demo", year: 2029, month: 1, saleTarget: 9000000, saleResult: 0 },
  { userId: "demo", year: 2029, month: 2, saleTarget: 8300000, saleResult: 0 },
  { userId: "demo", year: 2029, month: 3, saleTarget: 8500000, saleResult: 0 },

  // 2029年度（2029年4月～2030年3月）
  { userId: "demo", year: 2029, month: 4, saleTarget: 8000000, saleResult: 0 },
  { userId: "demo", year: 2029, month: 5, saleTarget: 8300000, saleResult: 0 },
  { userId: "demo", year: 2029, month: 6, saleTarget: 8700000, saleResult: 0 },
  { userId: "demo", year: 2029, month: 7, saleTarget: 9000000, saleResult: 0 },
  { userId: "demo", year: 2029, month: 8, saleTarget: 8500000, saleResult: 0 },
  { userId: "demo", year: 2029, month: 9, saleTarget: 8200000, saleResult: 0 },
  { userId: "demo", year: 2029, month: 10, saleTarget: 8600000, saleResult: 0 },
  { userId: "demo", year: 2029, month: 11, saleTarget: 9300000, saleResult: 0 },
  {
    userId: "demo",
    year: 2029,
    month: 12,
    saleTarget: 10000000,
    saleResult: 0,
  },
  { userId: "demo", year: 2030, month: 1, saleTarget: 9500000, saleResult: 0 },
  { userId: "demo", year: 2030, month: 2, saleTarget: 8800000, saleResult: 0 },
  { userId: "demo", year: 2030, month: 3, saleTarget: 9000000, saleResult: 0 },
];

// デモ用の利益データ（10年分）
const demoProfits: Profit[] = [
  // 2020年度（2020年4月～2021年3月）
  {
    userId: "demo",
    year: 2020,
    month: 4,
    profitTarget: 450000,
    profitResult: 420000,
  },
  {
    userId: "demo",
    year: 2020,
    month: 5,
    profitTarget: 480000,
    profitResult: 470000,
  },
  {
    userId: "demo",
    year: 2020,
    month: 6,
    profitTarget: 520000,
    profitResult: 500000,
  },
  {
    userId: "demo",
    year: 2020,
    month: 7,
    profitTarget: 570000,
    profitResult: 540000,
  },
  {
    userId: "demo",
    year: 2020,
    month: 8,
    profitTarget: 540000,
    profitResult: 570000,
  },
  {
    userId: "demo",
    year: 2020,
    month: 9,
    profitTarget: 500000,
    profitResult: 470000,
  },
  {
    userId: "demo",
    year: 2020,
    month: 10,
    profitTarget: 510000,
    profitResult: 530000,
  },
  {
    userId: "demo",
    year: 2020,
    month: 11,
    profitTarget: 560000,
    profitResult: 590000,
  },
  {
    userId: "demo",
    year: 2020,
    month: 12,
    profitTarget: 630000,
    profitResult: 660000,
  },
  {
    userId: "demo",
    year: 2021,
    month: 1,
    profitTarget: 590000,
    profitResult: 560000,
  },
  {
    userId: "demo",
    year: 2021,
    month: 2,
    profitTarget: 530000,
    profitResult: 510000,
  },
  {
    userId: "demo",
    year: 2021,
    month: 3,
    profitTarget: 540000,
    profitResult: 560000,
  },

  // 2021年度（2021年4月～2022年3月）
  {
    userId: "demo",
    year: 2021,
    month: 4,
    profitTarget: 520000,
    profitResult: 500000,
  },
  {
    userId: "demo",
    year: 2021,
    month: 5,
    profitTarget: 560000,
    profitResult: 570000,
  },
  {
    userId: "demo",
    year: 2021,
    month: 6,
    profitTarget: 600000,
    profitResult: 590000,
  },
  {
    userId: "demo",
    year: 2021,
    month: 7,
    profitTarget: 640000,
    profitResult: 620000,
  },
  {
    userId: "demo",
    year: 2021,
    month: 8,
    profitTarget: 620000,
    profitResult: 650000,
  },
  {
    userId: "demo",
    year: 2021,
    month: 9,
    profitTarget: 570000,
    profitResult: 540000,
  },
  {
    userId: "demo",
    year: 2021,
    month: 10,
    profitTarget: 590000,
    profitResult: 600000,
  },
  {
    userId: "demo",
    year: 2021,
    month: 11,
    profitTarget: 630000,
    profitResult: 660000,
  },
  {
    userId: "demo",
    year: 2021,
    month: 12,
    profitTarget: 710000,
    profitResult: 740000,
  },
  {
    userId: "demo",
    year: 2022,
    month: 1,
    profitTarget: 660000,
    profitResult: 630000,
  },
  {
    userId: "demo",
    year: 2022,
    month: 2,
    profitTarget: 600000,
    profitResult: 590000,
  },
  {
    userId: "demo",
    year: 2022,
    month: 3,
    profitTarget: 620000,
    profitResult: 630000,
  },

  // 2022年度（2022年4月～2023年3月）
  {
    userId: "demo",
    year: 2022,
    month: 4,
    profitTarget: 600000,
    profitResult: 580000,
  },
  {
    userId: "demo",
    year: 2022,
    month: 5,
    profitTarget: 630000,
    profitResult: 650000,
  },
  {
    userId: "demo",
    year: 2022,
    month: 6,
    profitTarget: 680000,
    profitResult: 660000,
  },
  {
    userId: "demo",
    year: 2022,
    month: 7,
    profitTarget: 720000,
    profitResult: 690000,
  },
  {
    userId: "demo",
    year: 2022,
    month: 8,
    profitTarget: 690000,
    profitResult: 720000,
  },
  {
    userId: "demo",
    year: 2022,
    month: 9,
    profitTarget: 650000,
    profitResult: 620000,
  },
  {
    userId: "demo",
    year: 2022,
    month: 10,
    profitTarget: 660000,
    profitResult: 680000,
  },
  {
    userId: "demo",
    year: 2022,
    month: 11,
    profitTarget: 710000,
    profitResult: 740000,
  },
  {
    userId: "demo",
    year: 2022,
    month: 12,
    profitTarget: 780000,
    profitResult: 810000,
  },
  {
    userId: "demo",
    year: 2023,
    month: 1,
    profitTarget: 740000,
    profitResult: 710000,
  },
  {
    userId: "demo",
    year: 2023,
    month: 2,
    profitTarget: 680000,
    profitResult: 660000,
  },
  {
    userId: "demo",
    year: 2023,
    month: 3,
    profitTarget: 690000,
    profitResult: 710000,
  },

  // 2023年度（2023年4月～2024年3月）
  {
    userId: "demo",
    year: 2023,
    month: 4,
    profitTarget: 800000,
    profitResult: 750000,
  },
  {
    userId: "demo",
    year: 2023,
    month: 5,
    profitTarget: 850000,
    profitResult: 820000,
  },
  {
    userId: "demo",
    year: 2023,
    month: 6,
    profitTarget: 900000,
    profitResult: 880000,
  },
  {
    userId: "demo",
    year: 2023,
    month: 7,
    profitTarget: 1000000,
    profitResult: 950000,
  },
  {
    userId: "demo",
    year: 2023,
    month: 8,
    profitTarget: 950000,
    profitResult: 1020000,
  },
  {
    userId: "demo",
    year: 2023,
    month: 9,
    profitTarget: 850000,
    profitResult: 800000,
  },
  {
    userId: "demo",
    year: 2023,
    month: 10,
    profitTarget: 900000,
    profitResult: 950000,
  },
  {
    userId: "demo",
    year: 2023,
    month: 11,
    profitTarget: 1050000,
    profitResult: 1100000,
  },
  {
    userId: "demo",
    year: 2023,
    month: 12,
    profitTarget: 1200000,
    profitResult: 1250000,
  },
  {
    userId: "demo",
    year: 2024,
    month: 1,
    profitTarget: 1100000,
    profitResult: 1050000,
  },
  {
    userId: "demo",
    year: 2024,
    month: 2,
    profitTarget: 950000,
    profitResult: 900000,
  },
  {
    userId: "demo",
    year: 2024,
    month: 3,
    profitTarget: 1000000,
    profitResult: 1020000,
  },

  // 2024年度（2024年4月～2025年3月）
  {
    userId: "demo",
    year: 2024,
    month: 4,
    profitTarget: 900000,
    profitResult: 850000,
  },
  {
    userId: "demo",
    year: 2024,
    month: 5,
    profitTarget: 950000,
    profitResult: 980000,
  },
  {
    userId: "demo",
    year: 2024,
    month: 6,
    profitTarget: 1020000,
    profitResult: 1000000,
  },
  {
    userId: "demo",
    year: 2024,
    month: 7,
    profitTarget: 1100000,
    profitResult: 1150000,
  },
  {
    userId: "demo",
    year: 2024,
    month: 8,
    profitTarget: 1000000,
    profitResult: 1050000,
  },
  {
    userId: "demo",
    year: 2024,
    month: 9,
    profitTarget: 950000,
    profitResult: 920000,
  },
  {
    userId: "demo",
    year: 2024,
    month: 10,
    profitTarget: 1020000,
    profitResult: 1070000,
  },
  {
    userId: "demo",
    year: 2024,
    month: 11,
    profitTarget: 1150000,
    profitResult: 1200000,
  },
  {
    userId: "demo",
    year: 2024,
    month: 12,
    profitTarget: 1300000,
    profitResult: 1350000,
  },
  {
    userId: "demo",
    year: 2025,
    month: 1,
    profitTarget: 1200000,
    profitResult: 1150000,
  },
  {
    userId: "demo",
    year: 2025,
    month: 2,
    profitTarget: 1050000,
    profitResult: 1030000,
  },
  {
    userId: "demo",
    year: 2025,
    month: 3,
    profitTarget: 1100000,
    profitResult: 1080000,
  },

  // 2025年度（2025年4月～2026年3月）
  {
    userId: "demo",
    year: 2025,
    month: 4,
    profitTarget: 1000000,
    profitResult: 980000,
  },
  {
    userId: "demo",
    year: 2025,
    month: 5,
    profitTarget: 1050000,
    profitResult: 1030000,
  },
  {
    userId: "demo",
    year: 2025,
    month: 6,
    profitTarget: 1120000,
    profitResult: 1100000,
  },
  {
    userId: "demo",
    year: 2025,
    month: 7,
    profitTarget: 1200000,
    profitResult: 1180000,
  },
  {
    userId: "demo",
    year: 2025,
    month: 8,
    profitTarget: 1100000,
    profitResult: 0,
  },
  {
    userId: "demo",
    year: 2025,
    month: 9,
    profitTarget: 1050000,
    profitResult: 0,
  },
  {
    userId: "demo",
    year: 2025,
    month: 10,
    profitTarget: 1120000,
    profitResult: 0,
  },
  {
    userId: "demo",
    year: 2025,
    month: 11,
    profitTarget: 1250000,
    profitResult: 0,
  },
  {
    userId: "demo",
    year: 2025,
    month: 12,
    profitTarget: 1400000,
    profitResult: 0,
  },
  {
    userId: "demo",
    year: 2026,
    month: 1,
    profitTarget: 1300000,
    profitResult: 0,
  },
  {
    userId: "demo",
    year: 2026,
    month: 2,
    profitTarget: 1150000,
    profitResult: 0,
  },
  {
    userId: "demo",
    year: 2026,
    month: 3,
    profitTarget: 1200000,
    profitResult: 0,
  },

  // 2026年度（2026年4月～2027年3月）
  {
    userId: "demo",
    year: 2026,
    month: 4,
    profitTarget: 1100000,
    profitResult: 0,
  },
  {
    userId: "demo",
    year: 2026,
    month: 5,
    profitTarget: 1150000,
    profitResult: 0,
  },
  {
    userId: "demo",
    year: 2026,
    month: 6,
    profitTarget: 1220000,
    profitResult: 0,
  },
  {
    userId: "demo",
    year: 2026,
    month: 7,
    profitTarget: 1300000,
    profitResult: 0,
  },
  {
    userId: "demo",
    year: 2026,
    month: 8,
    profitTarget: 1200000,
    profitResult: 0,
  },
  {
    userId: "demo",
    year: 2026,
    month: 9,
    profitTarget: 1150000,
    profitResult: 0,
  },
  {
    userId: "demo",
    year: 2026,
    month: 10,
    profitTarget: 1220000,
    profitResult: 0,
  },
  {
    userId: "demo",
    year: 2026,
    month: 11,
    profitTarget: 1350000,
    profitResult: 0,
  },
  {
    userId: "demo",
    year: 2026,
    month: 12,
    profitTarget: 1500000,
    profitResult: 0,
  },
  {
    userId: "demo",
    year: 2027,
    month: 1,
    profitTarget: 1400000,
    profitResult: 0,
  },
  {
    userId: "demo",
    year: 2027,
    month: 2,
    profitTarget: 1250000,
    profitResult: 0,
  },
  {
    userId: "demo",
    year: 2027,
    month: 3,
    profitTarget: 1300000,
    profitResult: 0,
  },

  // 2027年度（2027年4月～2028年3月）
  {
    userId: "demo",
    year: 2027,
    month: 4,
    profitTarget: 1200000,
    profitResult: 0,
  },
  {
    userId: "demo",
    year: 2027,
    month: 5,
    profitTarget: 1250000,
    profitResult: 0,
  },
  {
    userId: "demo",
    year: 2027,
    month: 6,
    profitTarget: 1320000,
    profitResult: 0,
  },
  {
    userId: "demo",
    year: 2027,
    month: 7,
    profitTarget: 1400000,
    profitResult: 0,
  },
  {
    userId: "demo",
    year: 2027,
    month: 8,
    profitTarget: 1300000,
    profitResult: 0,
  },
  {
    userId: "demo",
    year: 2027,
    month: 9,
    profitTarget: 1250000,
    profitResult: 0,
  },
  {
    userId: "demo",
    year: 2027,
    month: 10,
    profitTarget: 1320000,
    profitResult: 0,
  },
  {
    userId: "demo",
    year: 2027,
    month: 11,
    profitTarget: 1450000,
    profitResult: 0,
  },
  {
    userId: "demo",
    year: 2027,
    month: 12,
    profitTarget: 1600000,
    profitResult: 0,
  },
  {
    userId: "demo",
    year: 2028,
    month: 1,
    profitTarget: 1500000,
    profitResult: 0,
  },
  {
    userId: "demo",
    year: 2028,
    month: 2,
    profitTarget: 1350000,
    profitResult: 0,
  },
  {
    userId: "demo",
    year: 2028,
    month: 3,
    profitTarget: 1400000,
    profitResult: 0,
  },

  // 2028年度（2028年4月～2029年3月）
  {
    userId: "demo",
    year: 2028,
    month: 4,
    profitTarget: 1300000,
    profitResult: 0,
  },
  {
    userId: "demo",
    year: 2028,
    month: 5,
    profitTarget: 1350000,
    profitResult: 0,
  },
  {
    userId: "demo",
    year: 2028,
    month: 6,
    profitTarget: 1420000,
    profitResult: 0,
  },
  {
    userId: "demo",
    year: 2028,
    month: 7,
    profitTarget: 1500000,
    profitResult: 0,
  },
  {
    userId: "demo",
    year: 2028,
    month: 8,
    profitTarget: 1400000,
    profitResult: 0,
  },
  {
    userId: "demo",
    year: 2028,
    month: 9,
    profitTarget: 1350000,
    profitResult: 0,
  },
  {
    userId: "demo",
    year: 2028,
    month: 10,
    profitTarget: 1420000,
    profitResult: 0,
  },
  {
    userId: "demo",
    year: 2028,
    month: 11,
    profitTarget: 1550000,
    profitResult: 0,
  },
  {
    userId: "demo",
    year: 2028,
    month: 12,
    profitTarget: 1700000,
    profitResult: 0,
  },
  {
    userId: "demo",
    year: 2029,
    month: 1,
    profitTarget: 1600000,
    profitResult: 0,
  },
  {
    userId: "demo",
    year: 2029,
    month: 2,
    profitTarget: 1450000,
    profitResult: 0,
  },
  {
    userId: "demo",
    year: 2029,
    month: 3,
    profitTarget: 1500000,
    profitResult: 0,
  },

  // 2029年度（2029年4月～2030年3月）
  {
    userId: "demo",
    year: 2029,
    month: 4,
    profitTarget: 1400000,
    profitResult: 0,
  },
  {
    userId: "demo",
    year: 2029,
    month: 5,
    profitTarget: 1450000,
    profitResult: 0,
  },
  {
    userId: "demo",
    year: 2029,
    month: 6,
    profitTarget: 1520000,
    profitResult: 0,
  },
  {
    userId: "demo",
    year: 2029,
    month: 7,
    profitTarget: 1600000,
    profitResult: 0,
  },
  {
    userId: "demo",
    year: 2029,
    month: 8,
    profitTarget: 1500000,
    profitResult: 0,
  },
  {
    userId: "demo",
    year: 2029,
    month: 9,
    profitTarget: 1450000,
    profitResult: 0,
  },
  {
    userId: "demo",
    year: 2029,
    month: 10,
    profitTarget: 1520000,
    profitResult: 0,
  },
  {
    userId: "demo",
    year: 2029,
    month: 11,
    profitTarget: 1650000,
    profitResult: 0,
  },
  {
    userId: "demo",
    year: 2029,
    month: 12,
    profitTarget: 1800000,
    profitResult: 0,
  },
  {
    userId: "demo",
    year: 2030,
    month: 1,
    profitTarget: 1700000,
    profitResult: 0,
  },
  {
    userId: "demo",
    year: 2030,
    month: 2,
    profitTarget: 1550000,
    profitResult: 0,
  },
  {
    userId: "demo",
    year: 2030,
    month: 3,
    profitTarget: 1600000,
    profitResult: 0,
  },
];

// デモ用の純利益データ（10年分）
const demoNetAssets: NetAsset[] = [
  {
    userId: "demo",
    year: 2020,
    netAssetTarget: 5000000,
    netAssetResult: 5200000,
  },
  {
    userId: "demo",
    year: 2021,
    netAssetTarget: 5500000,
    netAssetResult: 5800000,
  },
  {
    userId: "demo",
    year: 2022,
    netAssetTarget: 6000000,
    netAssetResult: 6300000,
  },
  {
    userId: "demo",
    year: 2023,
    netAssetTarget: 8000000,
    netAssetResult: 8200000,
  },
  {
    userId: "demo",
    year: 2024,
    netAssetTarget: 9000000,
    netAssetResult: 9100000,
  },
  {
    userId: "demo",
    year: 2025,
    netAssetTarget: 10000000,
    netAssetResult: 9500000,
  },
  { userId: "demo", year: 2026, netAssetTarget: 11000000, netAssetResult: 0 },
  { userId: "demo", year: 2027, netAssetTarget: 12000000, netAssetResult: 0 },
  { userId: "demo", year: 2028, netAssetTarget: 13000000, netAssetResult: 0 },
  { userId: "demo", year: 2029, netAssetTarget: 14000000, netAssetResult: 0 },
];

const BudgetActual: React.FC = () => {
  // デモデータを状態として管理
  const [sales, setSales] = useState<Sale[]>(demoSales);
  const [profits, setProfits] = useState<Profit[]>(demoProfits);
  const [netAssets, setNetAssets] = useState<NetAsset[]>(demoNetAssets);
  const [userSettings] = useState(demoUserSetup);

  // 事業年度開始年月（デモデータから取得）
  const fiscalYearStart = userSettings.fiscalYearStartMonth;
  const fiscalYearStartYear = userSettings.fiscalYearStartYear;

  // 現在の事業年度を計算
  const currentDate = new Date();
  const currentCalendarYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const currentFiscalYear =
    currentMonth >= fiscalYearStart
      ? currentCalendarYear
      : currentCalendarYear - 1;

  const [selectedYear, setSelectedYear] = useState(currentFiscalYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  // グラフ用の年と期間を別に管理
  const [graphYear, setGraphYear] = useState(currentFiscalYear);
  const [viewPeriod, setViewPeriod] = useState<"12" | "6H1" | "6H2">("12");

  // 年が変更されたときに、選択可能な月の範囲内で月を調整
  const handleYearChange = (newYear: number) => {
    setSelectedYear(newYear);
    const availableMonths = getAvailableMonthsForYear(newYear);
    if (
      availableMonths.length > 0 &&
      !availableMonths.includes(selectedMonth)
    ) {
      setSelectedMonth(availableMonths[0]);
    }
  };

  const [actualRevenue, setActualRevenue] = useState(0);
  const [actualProfit, setActualProfit] = useState(0);
  const [actualNetIncome, setActualNetIncome] = useState(0);
  const [selectedPeriodYear, setSelectedPeriodYear] =
    useState(currentFiscalYear);
  const [activeChart, setActiveChart] = useState<"revenue" | "profit">(
    "revenue"
  );
  const [editingCell, setEditingCell] = useState<string | null>(null);

  // 編集された項目を追跡する状態を追加
  const [editedItems, setEditedItems] = useState<Set<string>>(new Set());

  // 詳細比較表用の独立した状態
  const [tableYear, setTableYear] = useState(currentFiscalYear);
  const [tableViewPeriod, setTableViewPeriod] = useState<"12" | "6H1" | "6H2">(
    "12"
  );

  // 今月の売上・利益データを取得
  const getCurrentMonthSale = () => {
    return sales.find(
      (sale) => sale.year === currentCalendarYear && sale.month === currentMonth
    );
  };

  const getCurrentMonthProfit = () => {
    return profits.find(
      (profit) =>
        profit.year === currentCalendarYear && profit.month === currentMonth
    );
  };

  // 昨年同月の利益データを取得
  const getLastYearSameMonthProfit = () => {
    return profits.find(
      (profit) =>
        profit.year === currentCalendarYear - 1 && profit.month === currentMonth
    );
  };

  // KPIデータを計算
  const calculateKPIData = () => {
    const currentSale = getCurrentMonthSale();
    const currentProfit = getCurrentMonthProfit();
    const lastYearProfit = getLastYearSameMonthProfit();

    // 売上達成率
    const revenueAchievementRate =
      currentSale?.saleTarget && currentSale.saleTarget > 0
        ? (
            ((currentSale.saleResult || 0) / currentSale.saleTarget) *
            100
          ).toFixed(1)
        : "0.0";

    // 利益達成率
    const profitAchievementRate =
      currentProfit?.profitTarget && currentProfit.profitTarget > 0
        ? (
            ((currentProfit.profitResult || 0) / currentProfit.profitTarget) *
            100
          ).toFixed(1)
        : "0.0";

    // 前年同月比
    const yearOverYearRate =
      lastYearProfit?.profitResult && lastYearProfit.profitResult > 0
        ? (
            ((currentProfit?.profitResult || 0) / lastYearProfit.profitResult) *
            100
          ).toFixed(1)
        : "0.0";

    return [
      {
        title: "売上達成率",
        value: `${revenueAchievementRate}%`,
        status:
          Number(revenueAchievementRate) >= 100
            ? "success"
            : Number(revenueAchievementRate) >= 90
            ? "warning"
            : "error",
      },
      {
        title: "利益達成率",
        value: `${profitAchievementRate}%`,
        status:
          Number(profitAchievementRate) >= 100
            ? "success"
            : Number(profitAchievementRate) >= 90
            ? "warning"
            : "error",
      },
      {
        title: "前年同月比(利益)",
        value: `${yearOverYearRate}%`,
        status:
          Number(yearOverYearRate) >= 100
            ? "success"
            : Number(yearOverYearRate) >= 90
            ? "warning"
            : "error",
      },
    ];
  };

  // 月次データを動的に生成する関数（デモデータベース）
  const generateMonthlyDataFromDemo = useCallback(
    (year: number) => {
      const months = [];
      const monthNames = [
        "1月",
        "2月",
        "3月",
        "4月",
        "5月",
        "6月",
        "7月",
        "8月",
        "9月",
        "10月",
        "11月",
        "12月",
      ];

      for (let i = 0; i < 12; i++) {
        const monthIndex = (fiscalYearStart - 1 + i) % 12;
        const month = monthIndex + 1;

        // 事業年度を考慮した実際の年を計算
        // 事業年度開始月より前の月は翌年になる
        let actualYear = year;
        if (month < fiscalYearStart) {
          actualYear = year + 1;
        }

        // 該当年月の売上データを取得
        const saleData = sales.find(
          (sale) => sale.year === actualYear && sale.month === month
        );
        // 該当年月の利益データを取得
        const profitData = profits.find(
          (profit) => profit.year === actualYear && profit.month === month
        );

        months.push({
          id: i,
          month: monthNames[monthIndex],
          target: saleData?.saleTarget || 0,
          actual: saleData?.saleResult || 0,
          profit: profitData?.profitResult || 0,
          profitTarget: profitData?.profitTarget || 0,
        });
      }
      return months;
    },
    [fiscalYearStart, sales, profits]
  );

  // 事業年度表示用の関数
  const getFiscalYearDisplay = useCallback(
    (year: number) => {
      const yearOffset = year - fiscalYearStartYear;
      const startYear = fiscalYearStartYear + yearOffset;
      const endYear = fiscalYearStart === 1 ? startYear : startYear + 1;
      const endMonth = fiscalYearStart === 1 ? 12 : fiscalYearStart - 1;

      if (fiscalYearStart === 1) {
        return `${year}年度（${startYear}年1月～${startYear}年12月）`;
      } else {
        return `${year}年度（${startYear}年${fiscalYearStart}月～${endYear}年${endMonth}月）`;
      }
    },
    [fiscalYearStart, fiscalYearStartYear]
  );

  // 年度選択肢を生成（事業年度開始年から10年分）
  const generateYearOptions = useCallback(() => {
    const years = [];
    for (let i = 0; i < 10; i++) {
      years.push(fiscalYearStartYear + i);
    }
    return years;
  }, [fiscalYearStartYear]);

  // 月次実績入力で選択可能な年月を計算
  const getAvailableYearsForInput = useCallback(() => {
    const startYear = fiscalYearStartYear;
    const years = [];

    // 事業年度開始年から10年分（未来も含む）
    for (let year = startYear; year < startYear + 10; year++) {
      years.push(year);
    }

    // 年が一つも選択できない場合は、現在の年を追加
    if (years.length === 0) {
      years.push(currentCalendarYear);
    }

    return years;
  }, [fiscalYearStartYear, currentCalendarYear]);

  // 指定した年で選択可能な月を計算
  const getAvailableMonthsForYear = useCallback(
    (year: number) => {
      const startYear = fiscalYearStartYear;
      const startMonth = fiscalYearStart;
      const endYear = startYear + 9; // 10年分なので開始年+9年まで

      const months = [];

      if (year === startYear) {
        // 事業年度開始年の場合、開始月から12月まで
        for (let month = startMonth; month <= 12; month++) {
          months.push(month);
        }
      } else if (year === endYear) {
        // 最終年の場合、1月から事業年度終了月まで
        const endMonth = startMonth - 1 === 0 ? 12 : startMonth - 1;
        for (let month = 1; month <= endMonth; month++) {
          months.push(month);
        }
      } else if (year > startYear && year < endYear) {
        // 中間年の場合、1月から12月まで
        for (let month = 1; month <= 12; month++) {
          months.push(month);
        }
      }

      // 月が一つも選択できない場合は、現在の月を追加
      if (months.length === 0) {
        months.push(currentMonth);
      }

      return months;
    },
    [fiscalYearStart, fiscalYearStartYear, currentMonth]
  );

  // 詳細比較表用のデータも年度変更時に更新
  const [tableData, setTableData] = useState<MonthlyData[]>([]);

  useEffect(() => {
    setTableData(generateMonthlyDataFromDemo(tableYear));
  }, [generateMonthlyDataFromDemo, tableYear, sales, profits]);

  // 表示期間に応じてデータをフィルタリング（グラフ用）
  const getDisplayData = () => {
    // graphYearを使用
    const graphData = generateMonthlyDataFromDemo(graphYear);

    switch (viewPeriod) {
      case "12":
        return graphData.slice(0, 12);
      case "6H1":
        return graphData.slice(0, 6);
      case "6H2":
        return graphData.slice(6, 12);
      default:
        return graphData.slice(0, 12);
    }
  };

  // 詳細比較表用のデータフィルタリング
  const getTableDisplayData = () => {
    switch (tableViewPeriod) {
      case "12":
        return tableData.slice(0, 12);
      case "6H1":
        return tableData.slice(0, 6);
      case "6H2":
        return tableData.slice(6, 12);
      default:
        return tableData.slice(0, 12);
    }
  };

  // セルの値を更新
  const handleCellUpdate = (
    id: number,
    field: "target" | "profitTarget",
    value: number
  ) => {
    setTableData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
    setEditingCell(null);
    // 編集された項目を追跡
    setEditedItems((prev) => new Set([...prev, `${id}-${field}`]));
  };

  // セルのダブルクリック処理
  const handleCellDoubleClick = (
    id: number,
    field: "target" | "profitTarget"
  ) => {
    setEditingCell(`${id}-${field}`);
  };

  const kpiData = calculateKPIData();

  // デモ版の保存処理（ローカル状態のみ更新）
  const handleManualSave = () => {
    // 売上データの更新
    setSales((prev) => {
      const newSales = [...prev];
      const existingIndex = newSales.findIndex(
        (s) => s.year === selectedYear && s.month === selectedMonth
      );

      if (existingIndex >= 0) {
        newSales[existingIndex] = {
          ...newSales[existingIndex],
          saleResult: actualRevenue,
        };
      } else {
        newSales.push({
          userId: "demo",
          year: selectedYear,
          month: selectedMonth,
          saleResult: actualRevenue,
          saleTarget: 0,
        });
      }
      return newSales;
    });

    // 利益データの更新
    setProfits((prev) => {
      const newProfits = [...prev];
      const existingIndex = newProfits.findIndex(
        (p) => p.year === selectedYear && p.month === selectedMonth
      );

      if (existingIndex >= 0) {
        newProfits[existingIndex] = {
          ...newProfits[existingIndex],
          profitResult: actualProfit,
        };
      } else {
        newProfits.push({
          userId: "demo",
          year: selectedYear,
          month: selectedMonth,
          profitResult: actualProfit,
          profitTarget: 0,
        });
      }
      return newProfits;
    });

    alert("実績データを保存しました。（デモ版）");
  };

  // 純利益実績の保存（デモ版）
  const handleNetIncomeSave = () => {
    setNetAssets((prev) => {
      const newNetAssets = [...prev];
      const existingIndex = newNetAssets.findIndex(
        (n) => n.year === selectedPeriodYear
      );

      if (existingIndex >= 0) {
        newNetAssets[existingIndex] = {
          ...newNetAssets[existingIndex],
          netAssetResult: actualNetIncome,
        };
      } else {
        newNetAssets.push({
          userId: "demo",
          year: selectedPeriodYear,
          netAssetResult: actualNetIncome,
          netAssetTarget: 0,
        });
      }
      return newNetAssets;
    });

    alert("純利益実績を保存しました。（デモ版）");
  };

  // 編集された目標データの保存（デモ版）
  const handleTargetSave = () => {
    // 編集された項目を処理
    editedItems.forEach((itemKey) => {
      const [idStr, field] = itemKey.split("-");
      const id = parseInt(idStr);
      const dataItem = tableData.find((item) => item.id === id);

      if (!dataItem) return;

      // 月のインデックスから実際の月を計算
      const monthIndex = (fiscalYearStart - 1 + id) % 12;
      const month = monthIndex + 1;

      // 事業年度を考慮した実際の年を計算
      let actualYear = tableYear;
      if (month < fiscalYearStart) {
        actualYear = tableYear + 1;
      }

      if (field === "target") {
        // 売上目標の更新
        setSales((prev) => {
          const newSales = [...prev];
          const existingIndex = newSales.findIndex(
            (s) => s.year === actualYear && s.month === month
          );

          if (existingIndex >= 0) {
            newSales[existingIndex] = {
              ...newSales[existingIndex],
              saleTarget: dataItem.target,
            };
          } else {
            newSales.push({
              userId: "demo",
              year: actualYear,
              month: month,
              saleTarget: dataItem.target,
              saleResult: 0,
            });
          }
          return newSales;
        });
      } else if (field === "profitTarget") {
        // 利益目標の更新
        setProfits((prev) => {
          const newProfits = [...prev];
          const existingIndex = newProfits.findIndex(
            (p) => p.year === actualYear && p.month === month
          );

          if (existingIndex >= 0) {
            newProfits[existingIndex] = {
              ...newProfits[existingIndex],
              profitTarget: dataItem.profitTarget,
            };
          } else {
            newProfits.push({
              userId: "demo",
              year: actualYear,
              month: month,
              profitTarget: dataItem.profitTarget,
              profitResult: 0,
            });
          }
          return newProfits;
        });
      }
    });

    // 編集状態をリセット
    setEditedItems(new Set());
    alert("目標データを保存しました。（デモ版）");
  };

  // CSV出力機能
  const handleDataExport = () => {
    try {
      // 10年分のデータを生成
      interface ExportData {
        年: number;
        月: number;
        売上目標: number;
        売上実績: number;
        売上達成率: string;
        利益目標: number;
        利益実績: number;
        利益達成率: string;
      }

      const allYearsData: ExportData[] = [];
      const yearOptions = generateYearOptions();

      yearOptions.forEach((year) => {
        const yearData = generateMonthlyDataFromDemo(year);
        yearData.forEach((monthData) => {
          // 月のインデックスから実際の月を計算
          const monthIndex = (fiscalYearStart - 1 + monthData.id) % 12;
          const month = monthIndex + 1;

          // 事業年度を考慮した実際の年を計算
          let actualYear = year;
          if (month < fiscalYearStart) {
            actualYear = year + 1;
          }

          // 達成率を計算
          const revenueRate =
            monthData.target > 0
              ? ((monthData.actual / monthData.target) * 100).toFixed(1)
              : "0.0";
          const profitRate =
            monthData.profitTarget > 0
              ? ((monthData.profit / monthData.profitTarget) * 100).toFixed(1)
              : "0.0";

          allYearsData.push({
            年: actualYear,
            月: month,
            売上目標: monthData.target,
            売上実績: monthData.actual,
            売上達成率: `${revenueRate}%`,
            利益目標: monthData.profitTarget,
            利益実績: monthData.profit,
            利益達成率: `${profitRate}%`,
          });
        });
      });

      // CSVヘッダー
      const headers = [
        "年",
        "月",
        "売上目標",
        "売上実績",
        "売上達成率",
        "利益目標",
        "利益実績",
        "利益達成率",
      ];

      // CSVデータを作成
      const csvContent = [
        headers.join(","),
        ...allYearsData.map((row) =>
          [
            row.年,
            row.月,
            row.売上目標,
            row.売上実績,
            row.売上達成率,
            row.利益目標,
            row.利益実績,
            row.利益達成率,
          ].join(",")
        ),
      ].join("\n");

      // BOMを追加してUTF-8で保存（Excelで正しく表示されるように）
      const bom = "\uFEFF";
      const blob = new Blob([bom + csvContent], {
        type: "text/csv;charset=utf-8;",
      });

      // ダウンロード処理
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `予実管理データ_${new Date().toISOString().split("T")[0]}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("データ出力に失敗しました:", error);
      alert("データ出力中にエラーが発生しました。");
    }
  };

  // 初期値を設定（現在月のデータがある場合）
  useEffect(() => {
    const currentSale = sales.find(
      (sale) => sale.year === currentCalendarYear && sale.month === currentMonth
    );
    const currentProfit = profits.find(
      (profit) =>
        profit.year === currentCalendarYear && profit.month === currentMonth
    );
    const currentNetAsset = netAssets.find(
      (asset) => asset.year === currentCalendarYear
    );

    if (currentSale && currentSale.saleResult !== undefined) {
      setActualRevenue(currentSale.saleResult);
    }
    if (currentProfit && currentProfit.profitResult !== undefined) {
      setActualProfit(currentProfit.profitResult);
    }
    if (currentNetAsset && currentNetAsset.netAssetResult !== undefined) {
      setActualNetIncome(currentNetAsset.netAssetResult);
    }
  }, [sales, profits, netAssets, currentCalendarYear, currentMonth]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-text">
          予実管理（デモ版）
        </h1>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button
            onClick={handleDataExport}
            className="btn-secondary flex items-center justify-center space-x-2 text-sm"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">データ出力</span>
          </button>
        </div>
      </div>

      {/* KPI達成状況 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpiData.map((kpi, index) => (
          <div key={index} className="card">
            <div className="text-center">
              <p className="text-sm text-text/70">{kpi.title}</p>
              <p className="text-2xl font-bold text-text mt-1">{kpi.value}</p>
              <div
                className={`inline-flex px-2 py-1 rounded-full text-xs mt-2 ${
                  kpi.status === "success"
                    ? "bg-success/10 text-success"
                    : kpi.status === "warning"
                    ? "bg-warning/10 text-warning"
                    : "bg-error/10 text-error"
                }`}
              >
                {kpi.status === "success"
                  ? "目標達成"
                  : kpi.status === "warning"
                  ? "要注意"
                  : "未達成"}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 実績入力フォーム - 2列配置 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* 月次実績入力フォーム */}
        <div className="card">
          <h3 className="text-base sm:text-lg font-semibold text-text mb-4">
            月次実績入力
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="block text-sm text-text/70 mb-1">年</label>
                <select
                  value={selectedYear}
                  onChange={(e) => handleYearChange(Number(e.target.value))}
                  className="input-field w-full"
                >
                  {getAvailableYearsForInput().map((year) => (
                    <option key={year} value={year}>
                      {year}年
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-1">
                <label className="block text-sm text-text/70 mb-1">月</label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  className="input-field w-full"
                >
                  {getAvailableMonthsForYear(selectedYear).map((month) => (
                    <option key={month} value={month}>
                      {month}月
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm text-text/70 mb-1">
                売上（円）
              </label>
              <input
                type="number"
                value={actualRevenue}
                onChange={(e) => setActualRevenue(Number(e.target.value))}
                className="input-field w-full"
                placeholder="実際の売上を入力"
              />
            </div>

            <div>
              <label className="block text-sm text-text/70 mb-1">
                事業の利益（円）
              </label>
              <input
                type="number"
                value={actualProfit}
                onChange={(e) => setActualProfit(Number(e.target.value))}
                className="input-field w-full"
                placeholder="実際の利益を入力"
              />
            </div>

            <button
              onClick={handleManualSave}
              className="btn-primary w-full flex items-center justify-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>実績を保存</span>
            </button>
          </div>
        </div>

        {/* 純利益実績入力フォーム */}
        <div className="card">
          <h3 className="text-base sm:text-lg font-semibold text-text mb-4">
            純利益実績入力
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-text/70 mb-1">年度</label>
              <select
                value={selectedPeriodYear}
                onChange={(e) => setSelectedPeriodYear(Number(e.target.value))}
                className="input-field w-full"
              >
                {generateYearOptions().map((year) => (
                  <option key={year} value={year}>
                    {getFiscalYearDisplay(year)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-text/70 mb-1">
                当期純利益（円）
              </label>
              <input
                type="number"
                value={actualNetIncome}
                onChange={(e) => setActualNetIncome(Number(e.target.value))}
                className="input-field w-full"
                placeholder="実際の当期純利益を入力"
              />
            </div>

            <button
              onClick={handleNetIncomeSave}
              className="btn-primary w-full flex items-center justify-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>純利益を保存</span>
            </button>
          </div>
        </div>
      </div>

      {/* 予実比較グラフ */}
      <div className="card">
        {/* グラフ切り替えボタンと年度・期間選択を2列表示 */}
        <div className="space-y-3 mb-4">
          {/* 1行目：グラフ切り替えボタン */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setActiveChart("revenue")}
              className={`px-4 py-2 rounded transition-colors ${
                activeChart === "revenue"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              売上実績推移
            </button>
            <button
              onClick={() => setActiveChart("profit")}
              className={`px-4 py-2 rounded transition-colors ${
                activeChart === "profit"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              月次利益推移
            </button>
          </div>

          {/* 2行目：年度と期間選択 */}
          <div className="grid grid-cols-2 gap-2">
            <select
              value={graphYear}
              onChange={(e) => setGraphYear(Number(e.target.value))}
              className="text-sm border border-border rounded px-2 py-1 pr-8 appearance-none bg-white"
              style={{
                backgroundImage:
                  'url(\'data:image/svg+xml;utf8,<svg fill="black" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>\')',
                backgroundRepeat: "no-repeat",
                backgroundPosition: "calc(100% - 4px) center",
                backgroundSize: "16px",
              }}
            >
              {generateYearOptions().map((year) => (
                <option key={year} value={year}>
                  {getFiscalYearDisplay(year)}
                </option>
              ))}
            </select>
            <select
              value={viewPeriod}
              onChange={(e) =>
                setViewPeriod(e.target.value as "12" | "6H1" | "6H2")
              }
              className="text-sm border border-border rounded px-2 py-1 pr-8 appearance-none bg-white"
              style={{
                backgroundImage:
                  'url(\'data:image/svg+xml;utf8,<svg fill="black" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>\')',
                backgroundRepeat: "no-repeat",
                backgroundPosition: "calc(100% - 4px) center",
                backgroundSize: "16px",
              }}
            >
              <option value="12">12ヶ月</option>
              <option value="6H1">上半期</option>
              <option value="6H2">下半期</option>
            </select>
          </div>
        </div>

        {/* 売上実績推移グラフ */}
        {activeChart === "revenue" && (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getDisplayData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
              <XAxis dataKey="month" stroke="#333333" />
              <YAxis
                stroke="#333333"
                tickFormatter={(value) => `${(value / 10000).toFixed(0)}万`}
              />
              <Tooltip
                formatter={(value: number, name: string) => [
                  `${value.toLocaleString()}円`,
                  name === "target"
                    ? "目標"
                    : name === "actual"
                    ? "実績"
                    : name,
                ]}
                labelStyle={{ color: "#333333" }}
              />
              <Legend />
              <Bar dataKey="target" fill="#B3DBC0" name="目標" />
              <Bar dataKey="actual" fill="#67BACA" name="実績" />
            </BarChart>
          </ResponsiveContainer>
        )}

        {/* 月次利益推移グラフ */}
        {activeChart === "profit" && (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getDisplayData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
              <XAxis dataKey="month" stroke="#333333" />
              <YAxis
                stroke="#333333"
                tickFormatter={(value) => `${(value / 10000).toFixed(0)}万`}
              />
              <Tooltip
                formatter={(value: number, name: string) => [
                  `${value.toLocaleString()}円`,
                  name === "profitTarget"
                    ? "目標"
                    : name === "profit"
                    ? "実績"
                    : name,
                ]}
                labelStyle={{ color: "#333333" }}
              />
              <Legend />
              <Bar dataKey="profitTarget" fill="#B3DBC0" name="目標" />
              <Bar dataKey="profit" fill="#67BACA" name="実績" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* 詳細比較表 */}
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <h3 className="text-base sm:text-lg font-semibold text-text">
              詳細比較表
            </h3>
            <div className="text-xs sm:text-sm text-text/70">
              💡 売上目標・利益目標をダブルクリックで編集できます
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <select
              value={tableYear}
              onChange={(e) => setTableYear(Number(e.target.value))}
              className="text-sm border border-border rounded px-2 py-1 pr-8 appearance-none bg-white"
              style={{
                backgroundImage:
                  'url(\'data:image/svg+xml;utf8,<svg fill="black" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>\')',
                backgroundRepeat: "no-repeat",
                backgroundPosition: "calc(100% - 4px) center",
                backgroundSize: "16px",
              }}
            >
              {generateYearOptions().map((year) => (
                <option key={year} value={year}>
                  {getFiscalYearDisplay(year)}
                </option>
              ))}
            </select>
            <select
              value={tableViewPeriod}
              onChange={(e) =>
                setTableViewPeriod(e.target.value as "12" | "6H1" | "6H2")
              }
              className="text-sm border border-border rounded px-2 py-1 pr-8 appearance-none bg-white"
              style={{
                backgroundImage:
                  'url(\'data:image/svg+xml;utf8,<svg fill="black" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>\')',
                backgroundRepeat: "no-repeat",
                backgroundPosition: "calc(100% - 4px) center",
                backgroundSize: "16px",
              }}
            >
              <option value="12">12ヶ月</option>
              <option value="6H1">上半期</option>
              <option value="6H2">下半期</option>
            </select>
          </div>
        </div>
        {editedItems.size > 0 && (
          <div className="mt-4 text-center">
            <button
              onClick={handleTargetSave}
              className="btn-primary flex items-center space-x-2 text-sm px-4 py-2"
            >
              <Save className="h-4 w-4" />
              <span>目標を保存</span>
            </button>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 sm:py-3 px-1 sm:px-2">月</th>
                <th className="text-right py-2 sm:py-3 px-1 sm:px-2 whitespace-nowrap">
                  売上目標
                </th>
                <th className="text-right py-2 sm:py-3 px-1 sm:px-2 whitespace-nowrap">
                  売上実績
                </th>
                <th className="text-right py-2 sm:py-3 px-1 sm:px-2 whitespace-nowrap">
                  売上達成率
                </th>
                <th className="text-right py-2 sm:py-3 px-1 sm:px-2 whitespace-nowrap">
                  利益目標
                </th>
                <th className="text-right py-2 sm:py-3 px-1 sm:px-2 whitespace-nowrap">
                  利益実績
                </th>
                <th className="text-right py-2 sm:py-3 px-1 sm:px-2 whitespace-nowrap">
                  利益達成率
                </th>
              </tr>
            </thead>
            <tbody>
              {getTableDisplayData().map((data) => {
                const revenueRate =
                  data.target > 0
                    ? ((data.actual / data.target) * 100).toFixed(1)
                    : "0.0";
                const profitRate =
                  data.profitTarget > 0
                    ? ((data.profit / data.profitTarget) * 100).toFixed(1)
                    : "0.0";
                return (
                  <tr key={data.id} className="border-b border-border/50">
                    <td className="py-2 sm:py-3 px-1 sm:px-2 font-medium">
                      {data.month}
                    </td>
                    <td
                      className={`py-2 sm:py-3 px-1 sm:px-2 text-right cursor-pointer hover:bg-blue-50 transition-colors ${
                        editedItems.has(`${data.id}-target`)
                          ? "bg-yellow-100 border-l-2 border-yellow-400"
                          : ""
                      }`}
                      onDoubleClick={() =>
                        handleCellDoubleClick(data.id, "target")
                      }
                      title="ダブルクリックで編集"
                    >
                      {editingCell === `${data.id}-target` ? (
                        <input
                          type="number"
                          defaultValue={data.target}
                          onBlur={(e) =>
                            handleCellUpdate(
                              data.id,
                              "target",
                              Number(e.target.value)
                            )
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleCellUpdate(
                                data.id,
                                "target",
                                Number(e.currentTarget.value)
                              );
                            } else if (e.key === "Escape") {
                              setEditingCell(null);
                            }
                          }}
                          className="w-full text-right border border-primary rounded px-1 focus:outline-none focus:ring-1 focus:ring-primary"
                          autoFocus
                        />
                      ) : (
                        data.target.toLocaleString()
                      )}
                    </td>
                    <td className="py-2 sm:py-3 px-1 sm:px-2 text-right">
                      {data.actual.toLocaleString()}
                    </td>
                    <td
                      className={`py-2 sm:py-3 px-1 sm:px-2 text-right font-medium ${
                        Number(revenueRate) >= 100
                          ? "text-success"
                          : Number(revenueRate) >= 90
                          ? "text-warning"
                          : "text-error"
                      }`}
                    >
                      {revenueRate}%
                    </td>
                    <td
                      className={`py-2 sm:py-3 px-1 sm:px-2 text-right cursor-pointer hover:bg-blue-50 transition-colors ${
                        editedItems.has(`${data.id}-profitTarget`)
                          ? "bg-yellow-100 border-l-2 border-yellow-400"
                          : ""
                      }`}
                      onDoubleClick={() =>
                        handleCellDoubleClick(data.id, "profitTarget")
                      }
                      title="ダブルクリックで編集"
                    >
                      {editingCell === `${data.id}-profitTarget` ? (
                        <input
                          type="number"
                          defaultValue={data.profitTarget}
                          onBlur={(e) =>
                            handleCellUpdate(
                              data.id,
                              "profitTarget",
                              Number(e.target.value)
                            )
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleCellUpdate(
                                data.id,
                                "profitTarget",
                                Number(e.currentTarget.value)
                              );
                            } else if (e.key === "Escape") {
                              setEditingCell(null);
                            }
                          }}
                          className="w-full text-right border border-primary rounded px-1 focus:outline-none focus:ring-1 focus:ring-primary"
                          autoFocus
                        />
                      ) : (
                        data.profitTarget.toLocaleString()
                      )}
                    </td>
                    <td className="py-2 sm:py-3 px-1 sm:px-2 text-right">
                      {data.profit.toLocaleString()}
                    </td>
                    <td
                      className={`py-2 sm:py-3 px-1 sm:px-2 text-right font-medium ${
                        Number(profitRate) >= 100
                          ? "text-success"
                          : Number(profitRate) >= 90
                          ? "text-warning"
                          : "text-error"
                      }`}
                    >
                      {profitRate}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BudgetActual;
