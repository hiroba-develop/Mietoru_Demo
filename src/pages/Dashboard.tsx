import React, { useState, useEffect, useMemo } from "react";
import {
  TrendingUp,
  AlertCircle,
  DollarSign,
  CheckCircle,
  Star,
  Navigation,
  MapPin,
  Target,
  CheckCircle2,
  Info,
} from "lucide-react";
import { FaRunning } from "react-icons/fa";

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

interface MonthlyProgress {
  month: number;
  year: number;
  phase: string;
  phaseColor: string;
  targetNetWorth: number;
  actualNetWorth: number;
  isCompleted: boolean;
  isCurrent: boolean;
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
    name: "請求書の発行",
    day: 10,
    enabled: true,
    completed: true,
  },
  {
    id: 3,
    taskId: "task-3",
    name: "銀行口座の残高確認",
    day: 15,
    enabled: true,
    completed: false,
  },
  {
    id: 4,
    taskId: "task-4",
    name: "取引先への支払い",
    day: 20,
    enabled: true,
    completed: false,
  },
  {
    id: 5,
    taskId: "task-5",
    name: "月次損益の確認",
    day: 25,
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

// デモ設定データ
const DEMO_FISCAL_YEAR_START_YEAR = 2023;
const DEMO_FISCAL_YEAR_START_MONTH = 4; // 4月開始

// ビジネスマンアイコンコンポーネント
const BusinessmanIcon: React.FC<{ isWalking: boolean }> = ({ isWalking }) => (
  <div className="relative pointer-events-none">
    <FaRunning
      className={`w-full h-full text-white transition-transform duration-500 ${
        isWalking ? "animate-bounce" : ""
      }`}
      style={{
        transform: isWalking ? "scaleX(-1)" : "scaleX(1)",
      }}
    />
  </div>
);

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

  // 設定データの状態管理
  const [fiscalYearStartYear] = useState<number>(DEMO_FISCAL_YEAR_START_YEAR);
  const [fiscalYearStartMonth] = useState<number>(DEMO_FISCAL_YEAR_START_MONTH);

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

  // ホバー状態管理
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // レスポンシブ対応のための画面幅監視
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 768
  );

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 現在の年月を取得
  const currentDate = new Date();
  const currentMonthNumber = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  // 事業年度開始年月から現在までの経過期間を計算
  const calculateBusinessPeriod = () => {
    if (!fiscalYearStartYear || !fiscalYearStartMonth) {
      return null;
    }

    const startYear = fiscalYearStartYear;
    const startMonth = fiscalYearStartMonth;

    // 年と月の差を計算
    let yearDiff = currentYear - startYear;
    let monthDiff = currentMonthNumber - startMonth;

    if (monthDiff < 0) {
      yearDiff--;
      monthDiff += 12;
    }

    const totalMonths = yearDiff * 12 + monthDiff;

    return {
      years: yearDiff,
      months: monthDiff,
      totalMonths: totalMonths,
      startYear,
      startMonth,
      isFuture: totalMonths < 0,
    };
  };

  const businessPeriod = calculateBusinessPeriod();

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
      title: `${currentYear}年${currentMonthNumber
        .toString()
        .padStart(2, "0")}月の売上`,
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
      title: "事業の利益",
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
      title: "利益達成率（今月）",
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

  // ロードマップ関連データ（実際の事業期間に基づいて生成）
  const monthlyProgress = useMemo((): MonthlyProgress[] => {
    const progressData: MonthlyProgress[] = [];

    for (let year = 1; year <= 10; year++) {
      for (let month = 1; month <= 12; month++) {
        const totalMonth = (year - 1) * 12 + month;

        // 新しいフェーズ分類に基づいてフェーズを決定
        let currentPhase: string;
        if (totalMonth <= 36) {
          currentPhase = "創業期"; // 1年目〜3年目
        } else if (totalMonth <= 60) {
          currentPhase = "転換期"; // 4年目〜5年目
        } else {
          currentPhase = "成長期"; // 6年目〜10年目
        }

        // 実際の事業期間に基づいて完了状態と現在位置を判定
        const actualTotalMonths = businessPeriod
          ? businessPeriod.totalMonths
          : 0;
        const isCompleted = totalMonth <= actualTotalMonths;
        const isCurrent = totalMonth === actualTotalMonths;

        progressData.push({
          month: totalMonth,
          year: year,
          phase: currentPhase,
          phaseColor: "#67BACA",
          targetNetWorth: 500000 * year,
          actualNetWorth: 400000 * year,
          isCompleted: isCompleted,
          isCurrent: isCurrent,
        });
      }
    }
    return progressData;
  }, [businessPeriod]);

  const currentMonth = monthlyProgress.find((m) => m.isCurrent);
  const completedMonths = monthlyProgress.filter((m) => m.isCompleted).length;
  const progressPercentage = (completedMonths / 120) * 100;

  // 年次ガイドデータ
  const yearlyGuides = [
    {
      year: 1,
      milestones: [
        "お金が少しずつ入ってくるようになった",
        "なんとか生活できるくらいにはなった",
      ],
      todoList: [
        "お客さんを見つけよう",
        "月に10万円以上の黒字を目指そう",
        "使ったお金を毎月記録しよう",
      ],
    },
    {
      year: 2,
      milestones: ["月の売上が50万円くらいに安定", "お金の流れがわかってきた"],
      todoList: [
        "無駄な支出を見直そう",
        "お金の使い方に優先順位をつけよう",
        "利益（売上−かかったお金）を20万円以上目指そう",
      ],
    },
    {
      year: 3,
      milestones: [
        "お客さんがリピートしてくれるように",
        "売上が月80万円くらいになる",
      ],
      todoList: [
        "「何が一番もうかるか」見えるようにしよう",
        "人にお願いする仕事を少しずつ増やしてみよう",
      ],
    },
    {
      year: 4,
      milestones: ["月100万円以上の売上が出てきた", "経費をかける余裕もある"],
      todoList: [
        "「手元にいくら残るか」を意識しよう",
        "広告や外注などに使うお金を計画的に",
      ],
    },
    {
      year: 5,
      milestones: ["年間で500万円くらい残るように", "事業がまわり始めている"],
      todoList: [
        "お金の記録をしっかりつけよう",
        "税理士に相談して節税を始めよう",
        "使わないお金は「手元に残す」習慣を",
      ],
    },
    {
      year: 6,
      milestones: ["チームや仲間がいる状態に", "売上以外にも収入が増えてくる"],
      todoList: [
        "毎月の売上が自動で入る仕組みを考えよう",
        "「時間を使わないでも収入がある状態」をつくる",
      ],
    },
    {
      year: 7,
      milestones: [
        "自分が動かなくても収入がある状態",
        "自分の時間に余裕ができてきた",
      ],
      todoList: [
        "お金を「使う・守る・ふやす」のバランスを考える",
        "資産（残しておくお金）を運用も検討しよう",
      ],
    },
    {
      year: 8,
      milestones: ["事業も生活も安定している", "将来への備えもできてきた"],
      todoList: [
        "「お金に働いてもらう」方法を学ぼう",
        "投資・資産運用を税理士と相談して始めよう",
      ],
    },
    {
      year: 9,
      milestones: [
        "自由に働き方を選べるように",
        "税金や老後の準備も視野に入る",
      ],
      todoList: [
        "ライフプランを見直そう",
        "事業を続ける？売る？次の目標は？と考えよう",
      ],
    },
    {
      year: 10,
      milestones: [
        "夢だった目標が現実に！",
        "好きなことをする時間・お金・自由が手に入った",
      ],
      todoList: [
        "成功パターンをふりかえろう",
        "次の目標を考えよう：家族、趣味、投資、社会貢献など",
      ],
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

      {/* 10年進捗可視化カード - カーナビ風 */}
      <div className="card bg-gradient-to-br from-primary/10 to-primary/20 border-2 border-primary/30 mb-4 sm:mb-0">
        <div className="flex items-center space-x-2 mb-4">
          <Navigation className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          <h3 className="text-base sm:text-lg font-semibold text-text">
            事業成長ナビゲーション
          </h3>
        </div>

        {/* 現在地と目的地の表示 */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="flex items-center space-x-2 mb-1">
              <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
              <span className="text-xs sm:text-sm font-medium text-gray-700">
                現在地
              </span>
            </div>
            {businessPeriod ? (
              <>
                <p className="text-base sm:text-lg font-bold text-primary">
                  {businessPeriod.isFuture ? (
                    "開始前"
                  ) : businessPeriod.years > 0 ? (
                    <>
                      {businessPeriod.years}年
                      {businessPeriod.months > 0 &&
                        `${businessPeriod.months}ヶ月目`}
                    </>
                  ) : (
                    `${businessPeriod.months}ヶ月目`
                  )}
                </p>
                <p className="text-xs sm:text-sm text-gray-600">
                  {(() => {
                    // 事業期間に基づいてフェーズを決定
                    if (businessPeriod.isFuture) return "準備期間";
                    const totalMonths = businessPeriod.totalMonths;
                    if (totalMonths <= 36) return "創業期"; // 1年目〜3年目
                    if (totalMonths <= 60) return "転換期"; // 4年目〜5年目
                    return "成長期"; // 6年目〜10年目
                  })()}
                </p>
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-text/70">🎯 今年の純利益目標</span>
                    <span className="font-medium">
                      {(() => {
                        const currentYearNetAsset = netAssetsData.find(
                          (asset) => asset.year === currentYear
                        );
                        return currentYearNetAsset?.netAssetTarget
                          ? `${currentYearNetAsset.netAssetTarget.toLocaleString()}円`
                          : "未設定";
                      })()}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-text/70">💰 今年の純利益実績</span>
                    <span className="font-medium">
                      {(() => {
                        const currentYearNetAsset = netAssetsData.find(
                          (asset) => asset.year === currentYear
                        );
                        return currentYearNetAsset?.netAssetResult
                          ? `${currentYearNetAsset.netAssetResult.toLocaleString()}円`
                          : "未設定";
                      })()}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              currentMonth && (
                <>
                  <p className="text-base sm:text-lg font-bold text-primary">
                    {(() => {
                      const totalMonths = currentMonth.month;
                      let yearValue = Math.floor((totalMonths - 1) / 12);
                      let monthValue = ((totalMonths - 1) % 12) + 1;

                      // 12の倍数の場合は次の年の0ヶ月目として処理
                      if (monthValue === 12) {
                        yearValue += 1;
                        monthValue = 0;
                      }

                      if (yearValue === 0) {
                        // 1年未満の場合
                        return `${monthValue}ヶ月`;
                      } else {
                        // 1年以上の場合
                        return `${yearValue}年${monthValue}ヶ月目`;
                      }
                    })()}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {currentMonth?.phase}
                  </p>
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-text/70">🎯 目標純資産</span>
                      <span className="font-medium">
                        {(currentMonth.targetNetWorth / 1000).toFixed(0)}万円
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-text/70">💰 現在純資産</span>
                      <span className="font-medium text-primary">
                        {(currentMonth.actualNetWorth / 1000).toFixed(0)}万円
                      </span>
                    </div>
                  </div>
                </>
              )
            )}
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="flex items-center space-x-2 mb-1">
              <MapPin className="h-3 w-3 text-accent" />
              <span className="text-xs sm:text-sm font-medium text-gray-700">
                目的地
              </span>
            </div>
            <p className="text-base sm:text-lg font-bold text-accent">10年目</p>
            {businessPeriod && (
              <p className="text-xs sm:text-sm text-accent">
                {(() => {
                  // 事業年度開始年月から10年後の年月を計算
                  let goalYear = businessPeriod.startYear + 10;
                  let goalMonth = businessPeriod.startMonth - 1; // 開始月の前月が終了月

                  if (goalMonth === 0) {
                    goalMonth = 12;
                    goalYear--;
                  }

                  return `${goalYear}年${goalMonth}月`;
                })()}
              </p>
            )}
            <p className="text-xs sm:text-sm text-gray-600">
              純利益 5,000万円達成
            </p>
          </div>
        </div>

        {/* 進捗サマリー */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <span className="text-xs sm:text-sm text-text/70">
            📍 進捗状況:{" "}
            {businessPeriod
              ? Math.max(0, businessPeriod.totalMonths)
              : completedMonths}
            ヶ月 / 120ヶ月
            {businessPeriod && businessPeriod.totalMonths < 0 && (
              <span className="ml-2 text-accent font-medium">
                事業開始まで準備を進めよう
              </span>
            )}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-medium text-primary bg-white px-2 py-1 rounded-full self-start sm:self-auto">
              {businessPeriod
                ? (
                    (Math.max(0, businessPeriod.totalMonths) / 120) *
                    100
                  ).toFixed(1)
                : progressPercentage.toFixed(1)}
              %
            </span>
          </div>
        </div>

        {/* 月次進捗の可視化 - 道路風デザイン */}
        <div className="relative">
          {/* 道路風進捗トラック */}
          <div className="relative bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg p-2 sm:p-4 shadow-inner overflow-x-auto md:overflow-x-hidden overflow-y-clip">
            <div className="flex items-center relative w-full min-w-[900px] md:min-w-0 pr-5 mt-6 sm:mt-8">
              {/* 月次進捗バー - 一直線のプログレスバー */}
              <div className="flex-1 relative z-10 h-8 sm:h-12 flex items-center">
                {/* 背景のベースライン */}
                <div className="absolute top-1/2 transform -translate-y-1/2 left-0 right-0 h-2 sm:h-3 bg-gray-500 opacity-50 rounded-full"></div>

                {/* 進捗バー */}
                <div
                  className="absolute top-1/2 transform -translate-y-1/2 left-0 h-2 sm:h-3 bg-primary shadow-primary/30 rounded-full transition-all duration-500"
                  style={{
                    width: `${progressPercentage + 3}%`,
                    maxWidth: "100%",
                  }}
                ></div>

                {/* 年マーカー */}
                {monthlyProgress
                  .filter((month) => month.month % 12 === 1 && month.month > 1)
                  .map((month, index) => {
                    const yearPosition = (month.month / 120) * 100;
                    return (
                      <div
                        key={index}
                        className="absolute -top-6 sm:-top-8 h-16 sm:h-20 flex flex-col items-center z-30"
                        style={{ left: `${yearPosition}%` }}
                      >
                        {/* メモリと年数表示 */}
                        <div className="flex flex-col items-center px-1 py-0.5 rounded text-center mb-1 shadow-sm">
                          <div className="text-xs sm:text-xs text-white font-medium whitespace-nowrap">
                            {month.year - 1}年
                          </div>
                          {/* お知らせアイコン（ホバーイベント付き） */}
                          <div
                            className="relative cursor-pointer mt-0.5 touch-manipulation"
                            onMouseEnter={(e) => {
                              setHoveredYear(month.year);
                              const rect =
                                e.currentTarget.getBoundingClientRect();
                              const viewportWidth = window.innerWidth;
                              const viewportHeight = window.innerHeight;

                              // ツールチップの幅を動的に決定
                              const tooltipWidth = Math.min(
                                320,
                                viewportWidth - 40
                              );

                              // レスポンシブな位置計算
                              let x, y;

                              // タッチデバイスかどうかの判定（モバイル/タブレット判定）
                              const isTouchDevice =
                                "ontouchstart" in window ||
                                navigator.maxTouchPoints > 0;

                              if (isTouchDevice && viewportWidth < 768) {
                                // モバイル・タブレット: 画面中央に表示
                                x = (viewportWidth - tooltipWidth) / 2;
                                y = viewportHeight * 0.3; // 画面上部30%の位置
                              } else {
                                // デスクトップ（画面幅が狭くても）: アイコンの横に表示
                                x = rect.right + 10;
                                y = rect.top;

                                // 画面右端を超える場合は左側に表示
                                if (x + tooltipWidth > viewportWidth - 20) {
                                  x = rect.left - tooltipWidth - 10;
                                }

                                // 画面左端を超える場合は上下中央に表示
                                if (x < 20) {
                                  x = Math.max(
                                    20,
                                    (viewportWidth - tooltipWidth) / 2
                                  );
                                  // 画面幅が狭い場合は縦位置を調整
                                  if (viewportWidth < 600) {
                                    y = Math.max(100, viewportHeight * 0.2);
                                  }
                                }

                                // 画面上端を超える場合は下に表示
                                if (y < 100) {
                                  y = rect.bottom + 10;
                                }

                                // 画面下端を超える場合は上に調整
                                if (y + 350 > viewportHeight) {
                                  y = Math.max(50, viewportHeight - 370);
                                }
                              }

                              setTooltipPosition({
                                x: Math.max(
                                  10,
                                  Math.min(x, viewportWidth - tooltipWidth - 10)
                                ),
                                y: Math.max(10, y),
                              });
                            }}
                            onMouseLeave={() => setHoveredYear(null)}
                            onClick={() => {
                              // スマホ用のタッチ対応
                              const isTouchDevice =
                                "ontouchstart" in window ||
                                navigator.maxTouchPoints > 0;
                              if (isTouchDevice && window.innerWidth < 768) {
                                if (hoveredYear === month.year) {
                                  setHoveredYear(null);
                                } else {
                                  setHoveredYear(month.year);
                                  const viewportWidth = window.innerWidth;
                                  const viewportHeight = window.innerHeight;
                                  const tooltipWidth = Math.min(
                                    320,
                                    viewportWidth - 40
                                  );

                                  setTooltipPosition({
                                    x: (viewportWidth - tooltipWidth) / 2,
                                    y: viewportHeight * 0.3,
                                  });
                                }
                              }
                            }}
                          >
                            <Info className="h-3 w-3 text-orange-400 hover:text-orange-300 transition-colors duration-200" />
                          </div>
                        </div>
                        {/* 年度区切り線（ホバーイベントなし） */}
                        <div className="w-0.5 sm:w-1 flex-1 bg-warning rounded-full shadow-md" />
                      </div>
                    );
                  })}
              </div>

              {/* ビジネスマン（現在位置） */}
              {businessPeriod && (
                <div
                  className="absolute flex items-center justify-center z-20 transition-all duration-1000 pointer-events-none"
                  style={{
                    right:
                      windowWidth < 768
                        ? `${96 - progressPercentage}%` // モバイル: 実際の事業期間に基づく位置
                        : `${96 - progressPercentage}%`, // デスクトップ: 実際の事業期間に基づく位置
                    top: "50%",
                    marginTop: "-12px",
                  }}
                >
                  <div className="bg-primary text-white rounded-full p-1 sm:p-2 shadow-lg border border-white sm:border-2 pointer-events-none">
                    <div className="w-4 h-4 sm:w-6 sm:h-6 pointer-events-none">
                      <BusinessmanIcon isWalking={true} />
                    </div>
                  </div>
                  {/* 現在位置の光る効果 */}
                  <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-30 pointer-events-none"></div>
                </div>
              )}

              {/* フォールバック: 事業期間データがない場合の従来の表示 */}
              {!businessPeriod && currentMonth && (
                <div
                  className="absolute flex items-center justify-center z-20 transition-all duration-1000 pointer-events-none"
                  style={{
                    right:
                      windowWidth < 768
                        ? `${99 - (currentMonth.month / 120) * 99}%` // モバイル: 現在地を中央寄りに表示
                        : `${99 - (currentMonth.month / 120) * 99}%`, // デスクトップ: %ベース
                    top: "50%",
                    marginTop: "-12px",
                  }}
                >
                  <div className="bg-primary text-white rounded-full p-1 sm:p-2 shadow-lg border border-white sm:border-2 pointer-events-none">
                    <div className="w-4 h-4 sm:w-6 sm:h-6 pointer-events-none">
                      <BusinessmanIcon isWalking={true} />
                    </div>
                  </div>
                  {/* 現在位置の光る効果 */}
                  <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-30 pointer-events-none"></div>
                </div>
              )}

              {/* ゴール地点 */}
              <div
                className="absolute flex items-center justify-center z-20"
                style={{
                  right: "-1%", // デスクトップ: %ベース
                  top: "50%",
                  marginTop: "-12px",
                }}
              >
                <div className="bg-accent text-white rounded-full p-1 sm:p-2 shadow-lg border border-white sm:border-2 animate-bounce">
                  <MapPin className="h-4 w-4 sm:h-6 sm:w-6" />
                </div>
              </div>
            </div>
          </div>

          {/* 現在の状況表示 - カーナビ風 */}
          {currentMonth && (
            <div className="mt-8 sm:mt-6 bg-white rounded-lg shadow-md border">
              <div className="bg-gradient-to-r from-primary to-primary/90 text-white px-3 sm:px-4 py-2 rounded-t-lg">
                <h4 className="text-sm sm:text-base font-medium flex items-center space-x-2">
                  <Navigation className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>現在の運行状況</span>
                </h4>
              </div>
              <div className="p-3 sm:p-4">
                {/* 現在年の目安とやることリスト */}
                {(() => {
                  // 実際の事業期間に基づいて年次ガイドを決定
                  const currentBusinessYear = businessPeriod
                    ? Math.floor(businessPeriod.totalMonths / 12) + 1
                    : currentMonth
                    ? currentMonth.year
                    : 1;

                  const currentYearGuide = yearlyGuides.find(
                    (g) => g.year === Math.min(currentBusinessYear, 10) // 最大10年目まで
                  );
                  if (!currentYearGuide) return null;

                  return (
                    <div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="bg-primary/5 rounded-lg p-3">
                          <div className="flex items-center space-x-2 mb-2">
                            <Target className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium text-text">
                              この年の目安
                            </span>
                          </div>
                          <ul className="space-y-1">
                            {currentYearGuide.milestones.map(
                              (milestone, index) => (
                                <li
                                  key={index}
                                  className="text-xs text-text/80 flex items-start space-x-2"
                                >
                                  <span className="text-primary mt-1 flex-shrink-0">
                                    •
                                  </span>
                                  <span className="mt-1">{milestone}</span>
                                </li>
                              )
                            )}
                          </ul>
                        </div>

                        <div className="bg-success/5 rounded-lg p-3">
                          <div className="flex items-center space-x-2 mb-2">
                            <CheckCircle2 className="h-4 w-4 text-success" />
                            <span className="text-sm font-medium text-text">
                              やることリスト
                            </span>
                          </div>
                          <ul className="space-y-1">
                            {currentYearGuide.todoList.map((todo, index) => (
                              <li
                                key={index}
                                className="text-xs text-text/80 flex items-start space-x-2"
                              >
                                <span className="text-success mt-1 flex-shrink-0">
                                  •
                                </span>
                                <span className="mt-1">{todo}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* KPIカード */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <div className="p-3 bg-primary/10 rounded-full">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ホバーツールチップ（最前面に表示） */}
      {hoveredYear && (
        <>
          {/* スマホ用背景オーバーレイ */}
          {(() => {
            const isTouchDevice =
              "ontouchstart" in window || navigator.maxTouchPoints > 0;
            return isTouchDevice && windowWidth < 768;
          })() && (
            <div
              className="fixed inset-0 bg-black bg-opacity-20 z-[99998]"
              onClick={() => setHoveredYear(null)}
            />
          )}

          <div
            className="fixed bg-white rounded-lg shadow-lg border border-gray-200 p-3 opacity-0 animate-fadeIn"
            style={{
              zIndex: 99999,
              left: `${tooltipPosition.x}px`,
              top: `${tooltipPosition.y}px`,
              animationFillMode: "forwards",
              width:
                windowWidth < 640
                  ? `${Math.min(280, windowWidth - 40)}px`
                  : "320px",
              maxWidth: windowWidth < 768 ? "calc(100vw - 40px)" : "400px",
              pointerEvents: (() => {
                const isTouchDevice =
                  "ontouchstart" in window || navigator.maxTouchPoints > 0;
                return isTouchDevice && windowWidth < 768 ? "auto" : "none";
              })(),
            }}
            onClick={(e) => {
              // スマホ版でツールチップをタップして閉じる
              const isTouchDevice =
                "ontouchstart" in window || navigator.maxTouchPoints > 0;
              if (isTouchDevice && windowWidth < 768) {
                e.stopPropagation();
                setHoveredYear(null);
              }
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm sm:text-base font-semibold text-primary">
                {hoveredYear - 1}年目の目標
              </div>
              {(() => {
                const isTouchDevice =
                  "ontouchstart" in window || navigator.maxTouchPoints > 0;
                return isTouchDevice && windowWidth < 768;
              })() && (
                <button
                  onClick={() => setHoveredYear(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ✕
                </button>
              )}
            </div>

            {(() => {
              const yearGuide = yearlyGuides.find(
                (g) => g.year === hoveredYear - 1
              );
              if (!yearGuide) return null;

              return (
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium text-gray-800">
                        この年の目安
                      </span>
                    </div>
                    <ul className="space-y-1.5">
                      {yearGuide.milestones.map((milestone, idx) => (
                        <li
                          key={idx}
                          className="text-sm text-gray-700 flex items-start space-x-2"
                        >
                          <span className="text-primary mt-1 flex-shrink-0">
                            •
                          </span>
                          <span>{milestone}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      <span className="text-sm font-medium text-gray-800">
                        やることリスト
                      </span>
                    </div>
                    <ul className="space-y-1.5">
                      {yearGuide.todoList.map((todo, idx) => (
                        <li
                          key={idx}
                          className="text-sm text-gray-700 flex items-start space-x-2"
                        >
                          <span className="text-success mt-1 flex-shrink-0">
                            •
                          </span>
                          <span>{todo}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })()}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
