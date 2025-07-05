import React, { useState, useEffect } from "react";
import {
  Users,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  Calendar,
  ChevronRight,
  ArrowLeft,
  BarChart3,
  PieChart,
  Calculator,
  User,
  MessageSquare,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  History,
} from "lucide-react";

interface CommentHistory {
  id: string;
  comment: string;
  date: string;
  yearMonth: string; // YYYY-MM形式
}

interface UserPerformanceData {
  userId: string;
  userName: string;
  email: string;
  businessName: string;
  lastUpdated: string;
  fiscalYearEndMonth: number; // 決算月（1-12）

  // 先月データ
  lastMonthSalesTarget: number;
  lastMonthSalesActual: number;
  lastMonthSalesAchievementRate: number;
  lastMonthProfitTarget: number;
  lastMonthProfitActual: number;
  lastMonthProfitAchievementRate: number;

  // 今月データ
  currentMonthSalesTarget: number;
  currentMonthSalesActual: number;
  currentMonthSalesAchievementRate: number;
  currentMonthProfitTarget: number;
  currentMonthProfitActual: number;
  currentMonthProfitAchievementRate: number;

  // 前年同月比・累計
  yearOverYearComparison: number;
  cumulativeAchievementRate: number;

  // コメント関連
  hasComment: boolean;
  comment: string;
  commentDate: string;

  // コメント履歴
  commentHistory: CommentHistory[];
}

// デモ用のクライアントデータ
const DEMO_USERS: UserPerformanceData[] = [
  {
    userId: "user001",
    userName: "田中 太郎",
    email: "tanaka@example.com",
    businessName: "田中コンサルティング",
    lastUpdated: "2025-07-05",
    fiscalYearEndMonth: 3, // 3月決算
    lastMonthSalesTarget: 1000000,
    lastMonthSalesActual: 950000,
    lastMonthSalesAchievementRate: 95.0,
    lastMonthProfitTarget: 400000,
    lastMonthProfitActual: 380000,
    lastMonthProfitAchievementRate: 95.0,
    currentMonthSalesTarget: 1200000,
    currentMonthSalesActual: 800000,
    currentMonthSalesAchievementRate: 66.7,
    currentMonthProfitTarget: 500000,
    currentMonthProfitActual: 320000,
    currentMonthProfitAchievementRate: 64.0,
    yearOverYearComparison: 112.5,
    cumulativeAchievementRate: 88.5,
    hasComment: true,
    comment:
      "7月は売上が目標を下回っていますが、6月は順調でした。夏季の集客アップと経費管理を見直し、秋に向けて準備を進めることをお勧めします。",
    commentDate: "2025-07-05",
    commentHistory: [
      {
        id: "comment001",
        comment:
          "年度始めとして順調なスタートです。今後も継続的な成長を目指していきましょう。",
        date: "2025-04-15",
        yearMonth: "2025-04",
      },
      {
        id: "comment002",
        comment:
          "5月は目標を上回る実績でした。この調子を維持しつつ、コスト管理にも注意を払ってください。",
        date: "2025-05-16",
        yearMonth: "2025-05",
      },
      {
        id: "comment003",
        comment:
          "6月の実績も好調を維持しています。夏季に向けてマーケティング強化を検討しましょう。",
        date: "2025-06-14",
        yearMonth: "2025-06",
      },
      {
        id: "comment004",
        comment:
          "7月は売上が目標を下回っていますが、6月は順調でした。夏季の集客アップと経費管理を見直し、秋に向けて準備を進めることをお勧めします。",
        date: "2025-07-05",
        yearMonth: "2025-07",
      },
    ],
  },
  {
    userId: "user002",
    userName: "佐藤 花子",
    email: "sato@example.com",
    businessName: "佐藤デザイン事務所",
    lastUpdated: "2025-07-04",
    fiscalYearEndMonth: 12, // 12月決算
    lastMonthSalesTarget: 800000,
    lastMonthSalesActual: 920000,
    lastMonthSalesAchievementRate: 115.0,
    lastMonthProfitTarget: 320000,
    lastMonthProfitActual: 380000,
    lastMonthProfitAchievementRate: 118.8,
    currentMonthSalesTarget: 900000,
    currentMonthSalesActual: 750000,
    currentMonthSalesAchievementRate: 83.3,
    currentMonthProfitTarget: 360000,
    currentMonthProfitActual: 300000,
    currentMonthProfitAchievementRate: 83.3,
    yearOverYearComparison: 125.8,
    cumulativeAchievementRate: 95.2,
    hasComment: true,
    comment:
      "6月は目標を大幅に上回る結果で素晴らしいです！7月も堅調に推移しています。創意工夫とクライアント満足度の維持を心がけてください。",
    commentDate: "2025-07-04",
    commentHistory: [
      {
        id: "comment005",
        comment:
          "4月の実績は素晴らしいです。デザイン案件の品質が高いことが評価されています。",
        date: "2025-04-20",
        yearMonth: "2025-04",
      },
      {
        id: "comment006",
        comment:
          "6月は目標を大幅に上回る結果で素晴らしいです！7月も堅調に推移しています。創意工夫とクライアント満足度の維持を心がけてください。",
        date: "2025-07-04",
        yearMonth: "2025-07",
      },
    ],
  },
  {
    userId: "user003",
    userName: "山田 一郎",
    email: "yamada@example.com",
    businessName: "山田商事",
    lastUpdated: "2025-07-03",
    fiscalYearEndMonth: 6, // 6月決算
    lastMonthSalesTarget: 1500000,
    lastMonthSalesActual: 1350000,
    lastMonthSalesAchievementRate: 90.0,
    lastMonthProfitTarget: 600000,
    lastMonthProfitActual: 540000,
    lastMonthProfitAchievementRate: 90.0,
    currentMonthSalesTarget: 1600000,
    currentMonthSalesActual: 1200000,
    currentMonthSalesAchievementRate: 75.0,
    currentMonthProfitTarget: 640000,
    currentMonthProfitActual: 480000,
    currentMonthProfitAchievementRate: 75.0,
    yearOverYearComparison: 108.2,
    cumulativeAchievementRate: 82.5,
    hasComment: false,
    comment: "",
    commentDate: "",
    commentHistory: [
      {
        id: "comment007",
        comment:
          "夏の繁忙期に向けて準備を進めましょう。在庫管理と資金繰りに注意が必要です。",
        date: "2025-05-10",
        yearMonth: "2025-05",
      },
    ],
  },
  {
    userId: "user004",
    userName: "鈴木 美咲",
    email: "suzuki@example.com",
    businessName: "鈴木マーケティング",
    lastUpdated: "2025-07-05",
    fiscalYearEndMonth: 9, // 9月決算
    lastMonthSalesTarget: 600000,
    lastMonthSalesActual: 680000,
    lastMonthSalesAchievementRate: 113.3,
    lastMonthProfitTarget: 240000,
    lastMonthProfitActual: 272000,
    lastMonthProfitAchievementRate: 113.3,
    currentMonthSalesTarget: 700000,
    currentMonthSalesActual: 520000,
    currentMonthSalesAchievementRate: 74.3,
    currentMonthProfitTarget: 280000,
    currentMonthProfitActual: 208000,
    currentMonthProfitAchievementRate: 74.3,
    yearOverYearComparison: 118.7,
    cumulativeAchievementRate: 93.8,
    hasComment: false,
    comment: "",
    commentDate: "",
    commentHistory: [
      {
        id: "comment008",
        comment:
          "春のキャンペーンが好評でした。秋に向けて新しい戦略を練りましょう。",
        date: "2025-04-25",
        yearMonth: "2025-04",
      },
    ],
  },
  {
    userId: "user005",
    userName: "高橋 健太",
    email: "takahashi@example.com",
    businessName: "高橋IT開発",
    lastUpdated: "2025-07-02",
    fiscalYearEndMonth: 12, // 12月決算
    lastMonthSalesTarget: 2000000,
    lastMonthSalesActual: 2200000,
    lastMonthSalesAchievementRate: 110.0,
    lastMonthProfitTarget: 800000,
    lastMonthProfitActual: 880000,
    lastMonthProfitAchievementRate: 110.0,
    currentMonthSalesTarget: 2100000,
    currentMonthSalesActual: 1800000,
    currentMonthSalesAchievementRate: 85.7,
    currentMonthProfitTarget: 840000,
    currentMonthProfitActual: 720000,
    currentMonthProfitAchievementRate: 85.7,
    yearOverYearComparison: 135.2,
    cumulativeAchievementRate: 102.3,
    hasComment: true,
    comment:
      "IT開発案件の受注が好調です。技術者のスキルアップと品質管理を継続していきましょう。",
    commentDate: "2025-07-02",
    commentHistory: [
      {
        id: "comment009",
        comment:
          "新技術への投資が売上増につながっています。継続的な学習を推奨します。",
        date: "2025-05-20",
        yearMonth: "2025-05",
      },
      {
        id: "comment010",
        comment:
          "IT開発案件の受注が好調です。技術者のスキルアップと品質管理を継続していきましょう。",
        date: "2025-07-02",
        yearMonth: "2025-07",
      },
    ],
  },
];

const TaxAccountantDashboard: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<UserPerformanceData | null>(
    null
  );
  const [users, setUsers] = useState<UserPerformanceData[]>(DEMO_USERS);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "performance">("name");
  const [currentComment, setCurrentComment] = useState("");
  const [isCommentSaving, setIsCommentSaving] = useState(false);
  const [showCommentHistory, setShowCommentHistory] = useState(false);
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // デモデータを読み込み
  useEffect(() => {
    const loadDemoData = async () => {
      try {
        setIsLoading(true);

        // デモ用の遅延
        await new Promise((resolve) => setTimeout(resolve, 1000));

        console.log("デモクライアント管理データ読み込み完了");
      } catch (err) {
        console.error("デモデータ読み込みエラー:", err);
        setError("データの読み込み中にエラーが発生しました");
      } finally {
        setIsLoading(false);
      }
    };

    loadDemoData();
  }, []);

  // フィルタリングとソート
  const filteredAndSortedUsers = users
    .filter(
      (user) =>
        user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.businessName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.userName.localeCompare(b.userName);
        case "performance":
          return b.cumulativeAchievementRate - a.cumulativeAchievementRate;
        default:
          return 0;
      }
    });

  const formatCurrency = (amount: number) => {
    return (amount / 10000).toFixed(0) + "万円";
  };

  const formatPercentage = (rate: number) => {
    return rate.toFixed(1) + "%";
  };

  const getPerformanceColor = (rate: number) => {
    if (rate >= 100) return "text-green-600";
    if (rate >= 80) return "text-yellow-600";
    return "text-red-600";
  };

  const getPerformanceBgColor = (rate: number) => {
    if (rate >= 100) return "bg-green-50 border-green-200";
    if (rate >= 80) return "bg-yellow-50 border-yellow-200";
    return "bg-red-50 border-red-200";
  };

  // コメント保存関数（デモ版）
  const handleSaveComment = async () => {
    if (!selectedUser || !currentComment.trim()) return;

    setIsCommentSaving(true);

    try {
      // デモ用の遅延
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;

      console.log("デモコメント保存:", {
        userId: selectedUser.userId,
        comment: currentComment.trim(),
        year,
        month,
      });

      const currentDateStr = new Date().toISOString().split("T")[0];
      const currentYearMonth = currentDateStr.substring(0, 7); // YYYY-MM形式

      // 新しいコメント履歴エントリを作成
      const newHistoryEntry: CommentHistory = {
        id: `comment_${Date.now()}`,
        comment: currentComment.trim(),
        date: currentDateStr,
        yearMonth: currentYearMonth,
      };

      // ユーザーデータを更新
      const updatedUsers = users.map((user) =>
        user.userId === selectedUser.userId
          ? {
              ...user,
              hasComment: true,
              comment: currentComment.trim(),
              commentDate: currentDateStr,
              commentHistory: [...user.commentHistory, newHistoryEntry],
            }
          : user
      );

      setUsers(updatedUsers);

      // 選択中のユーザーも更新
      const updatedSelectedUser = updatedUsers.find(
        (user) => user.userId === selectedUser.userId
      );
      if (updatedSelectedUser) {
        setSelectedUser(updatedSelectedUser);
      }

      setCurrentComment("");
      // 下書きがあれば削除
      localStorage.removeItem(`comment_draft_${selectedUser.userId}`);

      alert("コメントを保存しました (デモモード)");
    } catch (err) {
      console.error("デモコメント保存エラー:", err);
      alert("コメントの保存中にエラーが発生しました");
    } finally {
      setIsCommentSaving(false);
    }
  };

  // コメント下書き保存関数
  const handleSaveDraft = () => {
    if (!currentComment.trim()) return;
    localStorage.setItem(
      `comment_draft_${selectedUser?.userId}`,
      currentComment
    );
    if (window.confirm("下書きを保存しました。ユーザー一覧に戻りますか？")) {
      setSelectedUser(null);
    }
  };

  // ユーザー選択時にコメントを読み込む
  const handleUserSelect = (user: UserPerformanceData) => {
    setSelectedUser(user);
    // 下書きがあれば読み込む
    const draft = localStorage.getItem(`comment_draft_${user.userId}`);
    if (draft && !user.hasComment) {
      setCurrentComment(draft);
    } else {
      setCurrentComment("");
    }
  };

  // 年のリストを取得
  const getAvailableYears = () => {
    if (!selectedUser) return [];

    const years = selectedUser.commentHistory.map(
      (comment) => comment.yearMonth.split("-")[0]
    );
    const uniqueYears = [...new Set(years)].sort().reverse();

    return uniqueYears;
  };

  // 月のリストを取得（選択された年に応じて）
  const getAvailableMonths = (year: string) => {
    if (!selectedUser || !year) return [];

    const months = selectedUser.commentHistory
      .filter((comment) => comment.yearMonth.startsWith(year))
      .map((comment) => comment.yearMonth.split("-")[1]);
    const uniqueMonths = [...new Set(months)].sort();

    return uniqueMonths;
  };

  // フィルタリングされた履歴を取得
  const getFilteredHistory = () => {
    if (!selectedUser) return [];

    let filteredHistory = [...selectedUser.commentHistory];

    if (selectedYear && selectedMonth) {
      const targetYearMonth = `${selectedYear}-${selectedMonth}`;
      filteredHistory = filteredHistory.filter(
        (comment) => comment.yearMonth === targetYearMonth
      );
    } else if (selectedYear) {
      filteredHistory = filteredHistory.filter((comment) =>
        comment.yearMonth.startsWith(selectedYear)
      );
    }

    return filteredHistory.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  };

  // 月名を日本語に変換
  const getMonthName = (month: string) => {
    const monthNames = {
      "01": "1月",
      "02": "2月",
      "03": "3月",
      "04": "4月",
      "05": "5月",
      "06": "6月",
      "07": "7月",
      "08": "8月",
      "09": "9月",
      "10": "10月",
      "11": "11月",
      "12": "12月",
    };
    return monthNames[month as keyof typeof monthNames] || month;
  };

  // 決算月を日本語に変換
  const getFiscalYearEndMonthName = (month: number) => {
    const monthNames = {
      1: "1月",
      2: "2月",
      3: "3月",
      4: "4月",
      5: "5月",
      6: "6月",
      7: "7月",
      8: "8月",
      9: "9月",
      10: "10月",
      11: "11月",
      12: "12月",
    };
    return monthNames[month as keyof typeof monthNames] || `${month}月`;
  };

  // ユーザー詳細画面
  if (selectedUser) {
    return (
      <div className="space-y-6">
        {/* ヘッダー */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSelectedUser(null)}
              className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>ユーザー一覧に戻る</span>
            </button>
          </div>
        </div>

        {/* ユーザー情報 */}
        <div className="card">
          <div className="flex items-center space-x-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-text">
                {selectedUser.userName}
              </h2>
              <p className="text-text/70">{selectedUser.email}</p>
              <p className="text-text/70">{selectedUser.businessName}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-text/70 mb-1">決算月</div>
              <div className="text-lg font-semibold text-primary">
                {getFiscalYearEndMonthName(selectedUser.fiscalYearEndMonth)}
              </div>
            </div>
          </div>
        </div>

        {/* 予実管理状況 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 先月実績 */}
          <div className="card">
            <h3 className="text-lg font-semibold text-text mb-4 flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-primary" />
              <span>先月実績</span>
            </h3>

            <div className="space-y-4">
              {/* 売上 */}
              <div
                className={`p-4 rounded-lg border ${getPerformanceBgColor(
                  selectedUser.lastMonthSalesAchievementRate
                )}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-text/70">売上</span>
                  <DollarSign className="h-4 w-4 text-primary" />
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-text/60">目標</p>
                    <p className="font-semibold">
                      {formatCurrency(selectedUser.lastMonthSalesTarget)}
                    </p>
                  </div>
                  <div>
                    <p className="text-text/60">実績</p>
                    <p className="font-semibold">
                      {formatCurrency(selectedUser.lastMonthSalesActual)}
                    </p>
                  </div>
                  <div>
                    <p className="text-text/60">達成率</p>
                    <p
                      className={`font-bold ${getPerformanceColor(
                        selectedUser.lastMonthSalesAchievementRate
                      )}`}
                    >
                      {formatPercentage(
                        selectedUser.lastMonthSalesAchievementRate
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* 利益 */}
              <div
                className={`p-4 rounded-lg border ${getPerformanceBgColor(
                  selectedUser.lastMonthProfitAchievementRate
                )}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-text/70">利益</span>
                  <Target className="h-4 w-4 text-success" />
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-text/60">目標</p>
                    <p className="font-semibold">
                      {formatCurrency(selectedUser.lastMonthProfitTarget)}
                    </p>
                  </div>
                  <div>
                    <p className="text-text/60">実績</p>
                    <p className="font-semibold">
                      {formatCurrency(selectedUser.lastMonthProfitActual)}
                    </p>
                  </div>
                  <div>
                    <p className="text-text/60">達成率</p>
                    <p
                      className={`font-bold ${getPerformanceColor(
                        selectedUser.lastMonthProfitAchievementRate
                      )}`}
                    >
                      {formatPercentage(
                        selectedUser.lastMonthProfitAchievementRate
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 今月実績 */}
          <div className="card">
            <h3 className="text-lg font-semibold text-text mb-4 flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-accent" />
              <span>今月実績</span>
            </h3>

            <div className="space-y-4">
              {/* 売上 */}
              <div
                className={`p-4 rounded-lg border ${getPerformanceBgColor(
                  selectedUser.currentMonthSalesAchievementRate
                )}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-text/70">売上</span>
                  <DollarSign className="h-4 w-4 text-primary" />
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-text/60">目標</p>
                    <p className="font-semibold">
                      {formatCurrency(selectedUser.currentMonthSalesTarget)}
                    </p>
                  </div>
                  <div>
                    <p className="text-text/60">実績</p>
                    <p className="font-semibold">
                      {formatCurrency(selectedUser.currentMonthSalesActual)}
                    </p>
                  </div>
                  <div>
                    <p className="text-text/60">達成率</p>
                    <p
                      className={`font-bold ${getPerformanceColor(
                        selectedUser.currentMonthSalesAchievementRate
                      )}`}
                    >
                      {formatPercentage(
                        selectedUser.currentMonthSalesAchievementRate
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* 利益 */}
              <div
                className={`p-4 rounded-lg border ${getPerformanceBgColor(
                  selectedUser.currentMonthProfitAchievementRate
                )}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-text/70">利益</span>
                  <Target className="h-4 w-4 text-success" />
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-text/60">目標</p>
                    <p className="font-semibold">
                      {formatCurrency(selectedUser.currentMonthProfitTarget)}
                    </p>
                  </div>
                  <div>
                    <p className="text-text/60">実績</p>
                    <p className="font-semibold">
                      {formatCurrency(selectedUser.currentMonthProfitActual)}
                    </p>
                  </div>
                  <div>
                    <p className="text-text/60">達成率</p>
                    <p
                      className={`font-bold ${getPerformanceColor(
                        selectedUser.currentMonthProfitAchievementRate
                      )}`}
                    >
                      {formatPercentage(
                        selectedUser.currentMonthProfitAchievementRate
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 比較データ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-text mb-4 flex items-center space-x-2">
              <PieChart className="h-5 w-5 text-warning" />
              <span>前年同月比</span>
            </h3>
            <div className="text-center">
              <p
                className={`text-3xl font-bold ${
                  selectedUser.yearOverYearComparison >= 100
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {formatPercentage(selectedUser.yearOverYearComparison)}
                <span className="text-sm text-text/70 ml-1">前月比</span>
              </p>
              <p className="text-sm text-text/70 mt-1 flex items-center justify-center">
                {selectedUser.yearOverYearComparison >= 100 ? "成長" : "減少"}
                {selectedUser.yearOverYearComparison >= 100 ? (
                  <TrendingUp className="h-5 w-5 text-green-600 ml-2" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-600 ml-2" />
                )}
              </p>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-text mb-4 flex items-center space-x-2">
              <Calculator className="h-5 w-5 text-info" />
              <span>累計達成率</span>
            </h3>
            <div className="text-center">
              <p
                className={`text-3xl font-bold ${getPerformanceColor(
                  selectedUser.cumulativeAchievementRate
                )}`}
              >
                {formatPercentage(selectedUser.cumulativeAchievementRate)}
              </p>
              <p className="text-sm text-text/70 mt-1">年間目標に対する進捗</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    selectedUser.cumulativeAchievementRate >= 100
                      ? "bg-green-500"
                      : selectedUser.cumulativeAchievementRate >= 80
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                  style={{
                    width: `${Math.min(
                      selectedUser.cumulativeAchievementRate,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 既存コメント表示 */}
        {selectedUser.hasComment && (
          <div className="card bg-blue-50 border-blue-200">
            <div className="flex items-center space-x-2 mb-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold text-text">
                最新のアドバイス
              </h3>
              <span className="text-sm text-text/70">
                {selectedUser.commentDate.includes("T")
                  ? selectedUser.commentDate.replace("T", " ").split(".")[0]
                  : selectedUser.commentDate}
              </span>
            </div>
            <div className="p-4 bg-white rounded-lg border border-blue-200">
              <p className="text-text whitespace-pre-wrap">
                {selectedUser.comment}
              </p>
            </div>
          </div>
        )}

        {/* アドバイス履歴セクション */}
        {selectedUser.commentHistory.length > 0 && (
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text flex items-center space-x-2">
                <History className="h-5 w-5 text-primary" />
                <span>アドバイス履歴</span>
                <span className="text-sm text-text/70">
                  （{selectedUser.commentHistory.length}件）
                </span>
              </h3>
              <button
                onClick={() => setShowCommentHistory(!showCommentHistory)}
                className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors"
              >
                <span>
                  {showCommentHistory ? "履歴を閉じる" : "履歴を表示"}
                </span>
                {showCommentHistory ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
            </div>

            {showCommentHistory && (
              <div className="space-y-4">
                {/* フィルター */}
                <div className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-text/70 mb-1">
                      年で絞り込み
                    </label>
                    <select
                      value={selectedYear}
                      onChange={(e) => {
                        setSelectedYear(e.target.value);
                        setSelectedMonth(""); // 年が変わったら月をリセット
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">すべての年</option>
                      {getAvailableYears().map((year) => (
                        <option key={year} value={year}>
                          {year}年
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-text/70 mb-1">
                      月で絞り込み
                    </label>
                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      disabled={!selectedYear}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <option value="">すべての月</option>
                      {getAvailableMonths(selectedYear).map((month) => (
                        <option key={month} value={month}>
                          {getMonthName(month)}
                        </option>
                      ))}
                    </select>
                  </div>
                  {(selectedYear || selectedMonth) && (
                    <div className="flex items-end">
                      <button
                        onClick={() => {
                          setSelectedYear("");
                          setSelectedMonth("");
                        }}
                        className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        フィルタークリア
                      </button>
                    </div>
                  )}
                </div>

                {/* 履歴一覧 */}
                <div className="space-y-3">
                  {getFilteredHistory().map((historyItem) => (
                    <div
                      key={historyItem.id}
                      className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span className="font-medium text-text">
                            {historyItem.yearMonth.split("-")[0]}年
                            {getMonthName(historyItem.yearMonth.split("-")[1])}
                          </span>
                        </div>
                        <span className="text-sm text-text/70">
                          {historyItem.date.includes("T")
                            ? historyItem.date.replace("T", " ").split(".")[0]
                            : historyItem.date}
                        </span>
                      </div>
                      <div className="p-3 bg-white rounded border">
                        <p className="text-text whitespace-pre-wrap">
                          {historyItem.comment}
                        </p>
                      </div>
                    </div>
                  ))}

                  {getFilteredHistory().length === 0 && (
                    <div className="text-center py-8">
                      <History className="h-8 w-8 text-text/30 mx-auto mb-2" />
                      <p className="text-text/70">
                        {selectedYear || selectedMonth
                          ? "選択された期間にアドバイスはありません"
                          : "アドバイス履歴がありません"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* アドバイス入力エリア */}
        <div className="card">
          <h3 className="text-lg font-semibold text-text mb-4">
            {selectedUser.hasComment
              ? "新しいアドバイス追加"
              : "ワンポイントアドバイス入力"}
          </h3>
          <textarea
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            rows={4}
            placeholder="こちらに税理士からのアドバイスを入力してください..."
            value={currentComment}
            onChange={(e) => setCurrentComment(e.target.value)}
          />
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-text/70">
              {currentComment.length}/500文字
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleSaveDraft}
                disabled={!currentComment.trim() || isCommentSaving}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                下書き保存
              </button>
              <button
                onClick={handleSaveComment}
                disabled={!currentComment.trim() || isCommentSaving}
                className="px-4 py-2 text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isCommentSaving && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                )}
                <span>送信</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ユーザー一覧画面
  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-text">
          クライアント管理 (デモモード)
        </h1>
        <div className="text-sm text-text/70">
          登録ユーザー数: {users.length}名
          {isLoading && <span className="ml-2">(読み込み中...)</span>}
        </div>
      </div>

      {/* エラー表示 */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          <p>{error}</p>
        </div>
      )}

      {/* ローディング表示 */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text/70">データを読み込んでいます...</p>
          <p className="text-sm text-blue-600 mt-2">(デモモード)</p>
        </div>
      ) : (
        <>
          {/* 検索・フィルター */}
          <div className="card">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="ユーザー名または事業名で検索..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-text/70">並び順:</span>
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value as "name" | "performance")
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="name">名前順</option>
                  <option value="performance">達成率順</option>
                </select>
              </div>
            </div>
          </div>

          {/* ユーザー一覧 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedUsers.map((user) => (
              <div
                key={user.userId}
                className={`card hover:shadow-lg transition-shadow cursor-pointer ${
                  user.hasComment ? "border-l-4 border-l-green-500" : ""
                }`}
                onClick={() => handleUserSelect(user)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-text">
                          {user.userName}
                        </h3>
                        {user.hasComment && (
                          <MessageSquare className="h-4 w-4 text-green-600" />
                        )}
                      </div>
                      <p className="text-sm text-text/70">{user.email}</p>
                      <p className="text-sm text-text/70">
                        {user.businessName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {user.hasComment && (
                      <div className="flex items-center space-x-1 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-xs font-medium">
                          コメント済み
                        </span>
                      </div>
                    )}
                    <ChevronRight className="h-5 w-5 text-text/40" />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-text/70">累計達成率</span>
                    <span
                      className={`font-bold ${getPerformanceColor(
                        user.cumulativeAchievementRate
                      )}`}
                    >
                      {formatPercentage(user.cumulativeAchievementRate)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-text/70">前年同月比</span>
                    <div className="flex items-center space-x-1">
                      {user.yearOverYearComparison >= 100 ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                      <span
                        className={`font-bold ${
                          user.yearOverYearComparison >= 100
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {formatPercentage(user.yearOverYearComparison)}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-text/70">決算月</span>
                    <span className="text-sm font-medium text-primary">
                      {getFiscalYearEndMonthName(user.fiscalYearEndMonth)}
                    </span>
                  </div>

                  {user.hasComment && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-text/70">アドバイス日</span>
                      <span className="text-sm text-green-600 font-medium">
                        {user.commentDate.includes("T")
                          ? user.commentDate.replace("T", " ").split(".")[0]
                          : user.commentDate}
                      </span>
                    </div>
                  )}

                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        user.cumulativeAchievementRate >= 100
                          ? "bg-green-500"
                          : user.cumulativeAchievementRate >= 80
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{
                        width: `${Math.min(
                          user.cumulativeAchievementRate,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredAndSortedUsers.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-text/30 mx-auto mb-4" />
              <p className="text-text/70">
                該当するユーザーが見つかりませんでした
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TaxAccountantDashboard;
