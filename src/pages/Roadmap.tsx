import React, { useState, useEffect } from "react";
import { Save, Navigation } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface YearlyTarget {
  year: number;
  netWorth: number; // 純資産
  revenue: number; // 売上
  profit: number; // 事業の利益
  phase: string;
}

// デモ用のロードマップデータ
const DEMO_ROADMAP_DATA = {
  // 事業年度設定
  fiscalYearStartMonth: 4,
  fiscalYearStartYear: 2023,

  // 今年度と10年目標の進捗データ
  currentYearData: {
    target: 2000, // 万円
    actual: 500, // 万円
    progress: 25.0, // %
  },

  tenYearData: {
    target: 5000, // 万円
    actual: 500, // 万円
    progress: 10.0, // %
  },

  // 年次目標データ
  yearlyTargets: [
    {
      year: 1,
      netWorth: 5000000, // 500万円
      revenue: 12000000, // 1200万円
      profit: 4800000, // 480万円
      phase: "創業期",
    },
    {
      year: 2,
      netWorth: 10000000, // 1000万円
      revenue: 18000000, // 1800万円
      profit: 7200000, // 720万円
      phase: "創業期",
    },
    {
      year: 3,
      netWorth: 15000000, // 1500万円
      revenue: 24000000, // 2400万円
      profit: 9600000, // 960万円
      phase: "創業期",
    },
    {
      year: 4,
      netWorth: 20000000, // 2000万円
      revenue: 30000000, // 3000万円
      profit: 12000000, // 1200万円
      phase: "転換期",
    },
    {
      year: 5,
      netWorth: 25000000, // 2500万円
      revenue: 36000000, // 3600万円
      profit: 14400000, // 1440万円
      phase: "転換期",
    },
    {
      year: 6,
      netWorth: 30000000, // 3000万円
      revenue: 42000000, // 4200万円
      profit: 16800000, // 1680万円
      phase: "成長期",
    },
    {
      year: 7,
      netWorth: 35000000, // 3500万円
      revenue: 48000000, // 4800万円
      profit: 19200000, // 1920万円
      phase: "成長期",
    },
    {
      year: 8,
      netWorth: 40000000, // 4000万円
      revenue: 54000000, // 5400万円
      profit: 21600000, // 2160万円
      phase: "成長期",
    },
    {
      year: 9,
      netWorth: 45000000, // 4500万円
      revenue: 60000000, // 6000万円
      profit: 24000000, // 2400万円
      phase: "成長期",
    },
    {
      year: 10,
      netWorth: 50000000, // 5000万円
      revenue: 66000000, // 6600万円
      profit: 26400000, // 2640万円
      phase: "成長期",
    },
  ],
};

const Roadmap: React.FC = () => {
  // アニメーション用の状態
  const [yearlyProgress, setYearlyProgress] = useState(0);
  const [tenYearProgress, setTenYearProgress] = useState(0);

  // ローディング状態
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // 進捗計算用の状態（デモデータで初期化）
  const [currentYearData] = useState(DEMO_ROADMAP_DATA.currentYearData);
  const [tenYearData] = useState(DEMO_ROADMAP_DATA.tenYearData);

  // 事業年度開始年月の状態
  const [fiscalYearStartMonth] = useState<number>(
    DEMO_ROADMAP_DATA.fiscalYearStartMonth
  );
  const [fiscalYearStartYear] = useState<number>(
    DEMO_ROADMAP_DATA.fiscalYearStartYear
  );

  const [targets, setTargets] = useState<YearlyTarget[]>(
    DEMO_ROADMAP_DATA.yearlyTargets
  );
  const [originalTargets, setOriginalTargets] = useState<YearlyTarget[]>(
    DEMO_ROADMAP_DATA.yearlyTargets
  );

  const phases = [
    { name: "創業期", years: "1年目〜3年目" },
    { name: "転換期", years: "4年目〜5年目" },
    { name: "成長期", years: "6年目〜10年目" },
  ];

  // デモデータを読み込み
  useEffect(() => {
    const loadDemoData = async () => {
      try {
        setIsLoading(true);

        // デモ用の遅延
        await new Promise((resolve) => setTimeout(resolve, 1500));
      } catch (err) {
        setError("データの読み込みに失敗しました");
      } finally {
        setIsLoading(false);
      }
    };

    loadDemoData();
  }, []);

  const handleTargetChange = (
    year: number,
    field: keyof YearlyTarget,
    value: string | number
  ) => {
    setTargets((prev) =>
      prev.map((target) =>
        target.year === year ? { ...target, [field]: value } : target
      )
    );
  };

  // 値が変更されているかどうかを判定する関数
  const isValueChanged = (year: number, field: keyof YearlyTarget): boolean => {
    const currentTarget = targets.find((t) => t.year === year);
    const originalTarget = originalTargets.find((t) => t.year === year);

    if (!currentTarget || !originalTarget) return false;

    return currentTarget[field] !== originalTarget[field];
  };

  // 変更されたinputのクラス名を取得する関数
  const getInputClassName = (
    year: number,
    field: keyof YearlyTarget
  ): string => {
    const baseClass = "input-field w-full text-sm";
    const changedClass = "bg-blue-50 border-blue-300";

    return isValueChanged(year, field)
      ? `${baseClass} ${changedClass}`
      : baseClass;
  };

  // 目標が変更されているかどうかを確認する関数
  const hasChanges = (): boolean => {
    for (const target of targets) {
      const originalTarget = originalTargets.find(
        (t) => t.year === target.year
      );
      if (!originalTarget) continue;

      if (
        target.netWorth !== originalTarget.netWorth ||
        target.revenue !== originalTarget.revenue ||
        target.profit !== originalTarget.profit
      ) {
        return true;
      }
    }
    return false;
  };

  // 保存ボタン押下時の処理
  const handleSave = async () => {
    // 変更がない場合はアラートを表示
    if (!hasChanges()) {
      alert("目標が変更されていません");
      return;
    }

    try {
      setIsSaving(true);

      // デモ用の遅延
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // 更新が成功したら、現在の目標を新しいオリジナル目標として設定
      setOriginalTargets([...targets]);
      alert("目標が正常に保存されました (デモモード)");
    } catch (err) {
      console.error("デモ目標保存エラー:", err);
      alert("目標の保存に失敗しました");
    } finally {
      setIsSaving(false);
    }
  };

  // アニメーション効果
  useEffect(() => {
    const targetYearlyProgress = currentYearData.progress;
    const targetTenYearProgress = tenYearData.progress;

    const yearlyTimer = setTimeout(() => {
      let progress = 0;
      const yearlyInterval = setInterval(() => {
        progress += 1;
        setYearlyProgress(progress);
        if (progress >= targetYearlyProgress) {
          clearInterval(yearlyInterval);
          // 進捗が0%の場合、確実に0%と表示されるようにする
          if (targetYearlyProgress === 0) {
            setYearlyProgress(0);
          }
        }
      }, 20);
    }, 300);

    const tenYearTimer = setTimeout(() => {
      let progress = 0;
      const tenYearInterval = setInterval(() => {
        progress += 0.5;
        setTenYearProgress(progress);
        if (progress >= targetTenYearProgress) {
          clearInterval(tenYearInterval);
          // 進捗が0%の場合、確実に0%と表示されるようにする
          if (targetTenYearProgress === 0) {
            setTenYearProgress(0);
          }
        }
      }, 40);
    }, 800);

    return () => {
      clearTimeout(yearlyTimer);
      clearTimeout(tenYearTimer);
    };
  }, [currentYearData.progress, tenYearData.progress]);

  // ローディング表示
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text/70">データを読み込み中...</p>
          <p className="text-sm text-blue-600 mt-2">(デモモード)</p>
        </div>
      </div>
    );
  }

  // エラー表示
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            再読み込み
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Navigation className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-text">
            ロードマップ設定 (デモモード)
          </h1>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button
            className="btn-primary flex items-center justify-center space-x-2 text-sm"
            onClick={handleSave}
            disabled={isSaving}
          >
            <Save className="h-4 w-4" />
            <span>{isSaving ? "保存中..." : "保存"}</span>
          </button>
        </div>
      </div>

      {/* 10年ロードマップ進捗 */}
      <div className="card">
        <h3 className="text-base sm:text-lg font-semibold text-text mb-4">
          10年ロードマップ進捗
        </h3>
        <div className="mb-6 text-center">
          <p className="text-sm sm:text-base text-text/80 leading-relaxed">
            10年間で純資産5000万円を目指すロードマップを作成します。
            <br />
            １年ごとの目標をご提案します。
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* 今年度進捗 */}
          <div>
            <h4 className="text-md font-medium text-text mb-3 text-center">
              今年度目標
            </h4>
            <div className="w-full h-48 flex items-center justify-center">
              <div className="relative w-32 h-32">
                <svg
                  className="w-full h-full transform -rotate-90"
                  viewBox="0 0 100 100"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#E0E0E0"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#67BACA"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${(yearlyProgress * 251.2) / 100} 251.2`}
                    strokeLinecap="round"
                    className="transition-all duration-300"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-lg font-bold text-primary">
                      {yearlyProgress === 0
                        ? "0.0%"
                        : `${yearlyProgress.toFixed(1)}%`}
                    </div>
                    <div className="text-xs text-gray-600">今年度進捗</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm text-text/70">
                {currentYearData.actual}万 / {currentYearData.target}万
              </p>
            </div>
          </div>

          {/* 10年進捗 */}
          <div>
            <h4 className="text-md font-medium text-text mb-3 text-center">
              10年目標
            </h4>
            <div className="w-full h-48 flex items-center justify-center">
              <div className="relative w-32 h-32">
                <svg
                  className="w-full h-full transform -rotate-90"
                  viewBox="0 0 100 100"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#E0E0E0"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#67BACA"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${(tenYearProgress * 251.2) / 100} 251.2`}
                    strokeLinecap="round"
                    className="transition-all duration-300"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-lg font-bold text-primary">
                      {tenYearProgress === 0
                        ? "0.0%"
                        : `${tenYearProgress.toFixed(1)}%`}
                    </div>
                    <div className="text-xs text-gray-600">10年進捗</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm text-text/70">
                {tenYearData.actual}万 / {tenYearData.target}万
              </p>
            </div>
          </div>
        </div>

        {/* 凡例 */}
        <div className="flex justify-center mt-4 space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span className="text-sm text-text/70">達成</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
            <span className="text-sm text-text/70">未達成</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* 設定フォーム */}
        <div className="card">
          <h3 className="text-base sm:text-lg font-semibold text-text mb-4">
            10年間の目標設定
          </h3>
          <div className="space-y-4 max-h-96 sm:max-h-dvh overflow-y-auto">
            {targets.map((target) => (
              <div
                key={target.year}
                className="border border-border rounded-lg p-3 sm:p-4"
              >
                <h4 className="text-sm sm:text-base font-medium text-text mb-3">
                  {target.year}年目（{fiscalYearStartYear + target.year - 1}年
                  {fiscalYearStartMonth}月〜
                  {fiscalYearStartMonth === 1
                    ? `${fiscalYearStartYear + target.year}年12月`
                    : `${fiscalYearStartYear + target.year}年${
                        fiscalYearStartMonth - 1
                      }月`}
                  ）
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs sm:text-sm text-text/70 mb-1">
                      純資産（万円）
                    </label>
                    <input
                      type="number"
                      value={target.netWorth / 10000}
                      onChange={(e) =>
                        handleTargetChange(
                          target.year,
                          "netWorth",
                          Number(e.target.value) * 10000
                        )
                      }
                      className={getInputClassName(target.year, "netWorth")}
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm text-text/70 mb-1">
                      売上（万円）
                    </label>
                    <input
                      type="number"
                      value={target.revenue / 10000}
                      onChange={(e) =>
                        handleTargetChange(
                          target.year,
                          "revenue",
                          Number(e.target.value) * 10000
                        )
                      }
                      className={getInputClassName(target.year, "revenue")}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs sm:text-sm text-text/70 mb-1">
                      事業の利益（万円）
                    </label>
                    <input
                      type="number"
                      value={target.profit / 10000}
                      onChange={(e) =>
                        handleTargetChange(
                          target.year,
                          "profit",
                          Number(e.target.value) * 10000
                        )
                      }
                      className={getInputClassName(target.year, "profit")}
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-xs sm:text-sm text-text/70">
                    事業フェーズ:{" "}
                    <span className="font-medium text-text">
                      {target.phase}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 可視化エリア */}
        <div className="space-y-6">
          {/* 純資産推移グラフ */}
          <div className="card">
            <h3 className="text-base sm:text-lg font-semibold text-text mb-4">
              純資産推移予測
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={targets}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                <XAxis
                  dataKey="year"
                  stroke="#333333"
                  tickFormatter={(value) => `${value}年`}
                />
                <YAxis
                  stroke="#333333"
                  domain={[0, 50000000]} // 5000万円をMAXに設定
                  tickFormatter={(value) => `${(value / 10000).toFixed(0)}万`}
                />
                <Tooltip
                  formatter={(value: number) => [
                    `${(value / 10000).toLocaleString()}万円`,
                    "",
                  ]}
                  labelFormatter={(label) => `${label}年目`}
                  labelStyle={{ color: "#333333" }}
                />
                <Line
                  type="monotone"
                  dataKey="netWorth"
                  stroke="#67BACA"
                  strokeWidth={3}
                  dot={{ fill: "#67BACA", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* 事業フェーズ概要 */}
          <div className="card">
            <h3 className="text-base sm:text-lg font-semibold text-text mb-4">
              事業フェーズ概要
            </h3>
            <div className="space-y-3">
              {phases.map((phase, _) => (
                <div key={phase.name} className="flex items-center space-x-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-text">
                        {phase.name}
                      </span>
                      <span className="text-sm text-text/70">
                        ({phase.years})
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Roadmap;
