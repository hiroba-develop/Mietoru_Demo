import React, { useState, useEffect } from "react";
import { TrendingUp, CheckCircle, Star, AlertCircle } from "lucide-react";
import Navigation from "./Navigation";

// デモデータ用の型定義
interface Task {
  id: number;
  taskId?: string;
  name: string;
  day: number;
  enabled: boolean;
  completed: boolean;
}

interface Sale {
  saleId?: string;
  userId?: string;
  year?: number;
  month?: number;
  saleTarget?: number;
  saleResult?: number;
}

interface Profit {
  profitId?: string;
  userId?: string;
  year?: number;
  month?: number;
  profitTarget?: number;
  profitResult?: number;
}

interface NetAsset {
  netAssetId?: string;
  userId?: string;
  year?: number;
  netAssetTarget?: number;
  netAssetResult?: number;
}

interface TaxAccountantComment {
  commentId?: string;
  userId?: string;
  year?: number;
  month?: number;
  comment?: string;
}

// デモデータ
const DEMO_TASKS: Task[] = [
  {
    id: 1,
    taskId: "task-1",
    name: "売上・経費の記録",
    day: 5,
    enabled: true,
    completed: true,
  },
  {
    id: 2,
    taskId: "task-2",
    name: "銀行口座の残高確認",
    day: 15,
    enabled: true,
    completed: false,
  },
];

const DEMO_SALES: Sale[] = [
  // 2025年データ
  {
    saleId: "sale-1",
    year: 2025,
    month: 1,
    saleTarget: 800000,
    saleResult: 750000,
  },
  {
    saleId: "sale-2",
    year: 2025,
    month: 2,
    saleTarget: 800000,
    saleResult: 820000,
  },
  {
    saleId: "sale-3",
    year: 2025,
    month: 3,
    saleTarget: 850000,
    saleResult: 880000,
  },
  {
    saleId: "sale-4",
    year: 2025,
    month: 4,
    saleTarget: 850000,
    saleResult: 890000,
  },
  {
    saleId: "sale-5",
    year: 2025,
    month: 5,
    saleTarget: 900000,
    saleResult: 920000,
  },
  {
    saleId: "sale-6",
    year: 2025,
    month: 6,
    saleTarget: 900000,
    saleResult: 850000,
  },
  {
    saleId: "sale-7",
    year: 2025,
    month: 7,
    saleTarget: 950000,
    saleResult: 980000,
  },
  // 2024年データ（前年比較用）
  {
    saleId: "sale-8",
    year: 2024,
    month: 12,
    saleTarget: 750000,
    saleResult: 720000,
  },
  {
    saleId: "sale-9",
    year: 2024,
    month: 11,
    saleTarget: 750000,
    saleResult: 780000,
  },
];

const DEMO_PROFITS: Profit[] = [
  // 2025年データ
  {
    profitId: "profit-1",
    year: 2025,
    month: 1,
    profitTarget: 200000,
    profitResult: 180000,
  },
  {
    profitId: "profit-2",
    year: 2025,
    month: 2,
    profitTarget: 200000,
    profitResult: 220000,
  },
  {
    profitId: "profit-3",
    year: 2025,
    month: 3,
    profitTarget: 220000,
    profitResult: 240000,
  },
  {
    profitId: "profit-4",
    year: 2025,
    month: 4,
    profitTarget: 220000,
    profitResult: 250000,
  },
  {
    profitId: "profit-5",
    year: 2025,
    month: 5,
    profitTarget: 240000,
    profitResult: 260000,
  },
  {
    profitId: "profit-6",
    year: 2025,
    month: 6,
    profitTarget: 240000,
    profitResult: 210000,
  },
  {
    profitId: "profit-7",
    year: 2025,
    month: 7,
    profitTarget: 250000,
    profitResult: 270000,
  },
  // 2024年データ（前年比較用）
  {
    profitId: "profit-8",
    year: 2024,
    month: 12,
    profitTarget: 180000,
    profitResult: 160000,
  },
  {
    profitId: "profit-9",
    year: 2024,
    month: 11,
    profitTarget: 180000,
    profitResult: 190000,
  },
];

const DEMO_NET_ASSETS: NetAsset[] = [
  {
    netAssetId: "asset-1",
    year: 2023,
    netAssetTarget: 1500000,
    netAssetResult: 1200000,
  },
  {
    netAssetId: "asset-2",
    year: 2024,
    netAssetTarget: 2000000,
    netAssetResult: 1800000,
  },
  {
    netAssetId: "asset-3",
    year: 2025,
    netAssetTarget: 2500000,
    netAssetResult: 2100000,
  },
];

const DEMO_TAX_COMMENTS: TaxAccountantComment[] = [
  {
    commentId: "comment-1",
    year: 2025,
    month: 7,
    comment:
      "売上が好調に推移しています。経費の管理をしっかり行い、利益率の向上を目指しましょう。また、設備投資を検討する場合は年内に実施することで節税効果が期待できます。",
  },
  {
    commentId: "comment-2",
    year: 2025,
    month: 6,
    comment:
      "前月の利益が若干下がりましたが、全体的には順調な成長を維持しています。夏に向けて売上増加を期待しつつ、無駄な経費の見直しを行いましょう。",
  },
];

const Dashboard: React.FC = () => {
  // 状態管理
  const [monthlyTasks, setMonthlyTasks] = useState<Task[]>(DEMO_TASKS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // デモデータの状態管理
  const [salesData] = useState<Sale[]>(DEMO_SALES);
  const [profitsData] = useState<Profit[]>(DEMO_PROFITS);
  const [netAssetsData] = useState<NetAsset[]>(DEMO_NET_ASSETS);
  const [taxAccountantComments] =
    useState<TaxAccountantComment[]>(DEMO_TAX_COMMENTS);

  // 現在の年月を取得
  const currentDate = new Date();
  const currentMonthNumber = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  // デモデータロード（APIの代替）
  useEffect(() => {
    const loadDemoData = async () => {
      try {
        setLoading(true);
        // デモ用の遅延
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (err) {
        console.error("デモデータ読み込みエラー:", err);
        setError("デモデータの読み込み中にエラーが発生しました");
      } finally {
        setLoading(false);
      }
    };

    loadDemoData();
  }, []);

  // 今月の利益目標と実績（デモデータから取得）
  const getCurrentMonthData = () => {
    const currentSale = salesData.find(
      (sale) => sale.year === currentYear && sale.month === currentMonthNumber
    );
    const currentProfit = profitsData.find(
      (profit) =>
        profit.year === currentYear && profit.month === currentMonthNumber
    );

    return {
      saleResult: currentSale?.saleResult || 0,
      profitResult: currentProfit?.profitResult || 0,
      profitTarget: currentProfit?.profitTarget || 0,
    };
  };

  const currentMonthData = getCurrentMonthData();

  // タスクの完了状況
  const completedTasks = monthlyTasks.filter(
    (task) => task.enabled && task.completed
  ).length;
  const totalEnabledTasks = monthlyTasks.filter((task) => task.enabled).length;
  const taskProgress =
    totalEnabledTasks > 0 ? (completedTasks / totalEnabledTasks) * 100 : 0;
  const allTasksCompleted =
    totalEnabledTasks > 0 && completedTasks === totalEnabledTasks;

  // タスクの完了状態を切り替え（デモ版）
  const toggleTask = async (id: number) => {
    // デモ版では楽観的更新のみ
    const updatedTasks = monthlyTasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setMonthlyTasks(updatedTasks);

    // デモ用の遅延
    await new Promise((resolve) => setTimeout(resolve, 300));
  };

  // 前月比計算用のヘルパー関数
  const calculateMonthlyChange = (
    current: number,
    previous: number
  ): string => {
    if (previous === 0) {
      // 前月データがない場合
      if (current > 0) return "+100.0%"; // 今月に数値があれば100%増
      return "0.0%"; // 両方とも0なら変化なし
    }
    const changeRate = ((current - previous) / previous) * 100;
    return `${changeRate >= 0 ? "+" : ""}${changeRate.toFixed(1)}%`;
  };

  // 前月データを取得する関数
  const getPreviousMonthData = () => {
    let prevYear = currentYear;
    let prevMonth = currentMonthNumber - 1;

    if (prevMonth === 0) {
      prevMonth = 12;
      prevYear = currentYear - 1;
    }

    const prevSale = salesData.find(
      (sale) => sale.year === prevYear && sale.month === prevMonth
    );
    const prevProfit = profitsData.find(
      (profit) => profit.year === prevYear && profit.month === prevMonth
    );
    // 純資産は年単位のデータなので前年の数値を取得
    const prevNetAsset = netAssetsData.find((asset) => asset.year === prevYear);

    return {
      saleResult: prevSale?.saleResult || 0,
      profitResult: prevProfit?.profitResult || 0,
      netAssetResult: prevNetAsset?.netAssetResult || 0,
    };
  };

  const previousMonthData = getPreviousMonthData();

  // 利益達成率を計算
  const profitAchievementRate =
    currentMonthData.profitTarget > 0
      ? (currentMonthData.profitResult / currentMonthData.profitTarget) * 100
      : 0;

  // 前月の利益達成率を計算
  const previousProfitTarget =
    profitsData.find(
      (profit) =>
        profit.year ===
          (currentMonthNumber === 1 ? currentYear - 1 : currentYear) &&
        profit.month ===
          (currentMonthNumber === 1 ? 12 : currentMonthNumber - 1)
    )?.profitTarget || 0;

  const previousProfitAchievementRate =
    previousProfitTarget > 0
      ? (previousMonthData.profitResult / previousProfitTarget) * 100
      : 0;

  // KPIデータ（デモデータから取得）
  const kpiData = [
    {
      title: `今月の売上`,
      value: `${currentMonthData.saleResult.toLocaleString()}円`,
      change: calculateMonthlyChange(
        currentMonthData.saleResult,
        previousMonthData.saleResult
      ),
      trend:
        currentMonthData.saleResult >= previousMonthData.saleResult
          ? "up"
          : "down",
      color:
        currentMonthData.saleResult >= previousMonthData.saleResult
          ? "text-success"
          : "text-red-500",
    },
    {
      title: "今月の粗利益",
      value: `${currentMonthData.profitResult.toLocaleString()}円`,
      change: calculateMonthlyChange(
        currentMonthData.profitResult,
        previousMonthData.profitResult
      ),
      trend:
        currentMonthData.profitResult >= previousMonthData.profitResult
          ? "up"
          : "down",
      color:
        currentMonthData.profitResult >= previousMonthData.profitResult
          ? "text-success"
          : "text-red-500",
    },
    {
      title: "今月の営業利益",
      value: `${currentMonthData.profitResult.toLocaleString()}円`,
      change: calculateMonthlyChange(
        currentMonthData.profitResult,
        previousMonthData.profitResult
      ),
      trend:
        currentMonthData.profitResult >= previousMonthData.profitResult
          ? "up"
          : "down",
      color:
        currentMonthData.profitResult >= previousMonthData.profitResult
          ? "text-success"
          : "text-red-500",
    },
    {
      title: "今月の営業利益達成率",
      value: `${profitAchievementRate.toFixed(1)}%`,
      change: calculateMonthlyChange(
        profitAchievementRate,
        previousProfitAchievementRate
      ),
      trend:
        profitAchievementRate >= previousProfitAchievementRate ? "up" : "down",
      color:
        profitAchievementRate >= 100
          ? "text-success"
          : profitAchievementRate >= 80
          ? "text-warning"
          : "text-red-500",
    },
  ];

  // ローディング状態の表示
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-gray-500">ダッシュボードデータを読み込み中...</p>
        </div>
      </div>
    );
  }

  // エラー状態の表示
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 btn-primary"
          >
            再読み込み
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-text">
          ダッシュボード
        </h1>
        <div className="text-xs sm:text-sm text-text/70">
          最終更新: {new Date().toLocaleString("ja-JP")} (デモモード)
        </div>
      </div>

      {/* KPIカード */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {kpiData.map((kpi, index) => (
          <div key={index} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text/70">{kpi.title}</p>
                <p className="text-2xl font-bold text-text mt-1">{kpi.value}</p>
                <p className={`text-sm mt-1 ${kpi.color}`}>
                  <TrendingUp className="inline h-4 w-4 mr-1" />
                  前月比{kpi.change}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* 10年進捗可視化カード - カーナビ風 */}
      <Navigation />
      {/* アラート・通知エリアとタスクエリア */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 今月のタスク */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-text">
              今月のタスク
            </h3>
            {allTasksCompleted && (
              <div className="flex items-center space-x-1 text-yellow-500">
                <Star className="h-4 w-4 sm:h-5 sm:w-5 fill-current" />
                <span className="text-xs sm:text-sm font-bold">Clear!</span>
              </div>
            )}
          </div>

          {/* タスク進捗バー */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-text/70 mb-1">
              <span>進捗状況</span>
              <span>
                {completedTasks}/{totalEnabledTasks}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  allTasksCompleted ? "bg-yellow-500" : "bg-primary"
                }`}
                style={{ width: `${taskProgress}%` }}
              />
            </div>
          </div>

          {/* タスクリスト */}
          <div className="space-y-2">
            {monthlyTasks
              .filter((task) => task.enabled)
              .map((task) => (
                <div
                  key={task.id}
                  className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors ${
                    task.completed
                      ? "bg-green-50 border-green-200"
                      : "bg-gray-50 border-gray-200 hover:border-primary/50"
                  }`}
                >
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      task.completed
                        ? "bg-green-500 border-green-500 text-white"
                        : "border-gray-300 hover:border-primary"
                    }`}
                  >
                    {task.completed && <CheckCircle className="h-3 w-3" />}
                  </button>
                  <div className="flex-1">
                    <p
                      className={`text-sm ${
                        task.completed
                          ? "line-through text-gray-500"
                          : "text-text"
                      }`}
                    >
                      {task.name}
                    </p>
                    <p className="text-xs text-text/60">毎月{task.day}日</p>
                  </div>
                </div>
              ))}
          </div>

          {allTasksCompleted && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
              <p className="text-sm font-medium text-yellow-800">
                🎉 今月のタスクがすべて完了しました！
              </p>
              <p className="text-xs text-yellow-700 mt-1">
                お疲れ様でした。順調に事業管理ができています。
              </p>
            </div>
          )}
        </div>

        {/* 今月のワンポイントアドバイス */}
        <div className="card bg-blue/5 border-blue/20">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-text">
                今月のワンポイントアドバイス
              </h3>
              <p className="text-xs sm:text-sm text-text/70 mt-1">
                {(() => {
                  const currentComment = taxAccountantComments.find(
                    (comment) =>
                      comment.year === currentYear &&
                      comment.month === currentMonthNumber
                  );

                  if (currentComment?.comment) {
                    return currentComment.comment;
                  } else {
                    return "まだ今月のアドバイスコメントはありません";
                  }
                })()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
