import React, { useState, useEffect } from "react";
import {
  Users,
  DollarSign,
  Target,
  Calendar,
  ChevronRight,
  ArrowLeft,
  BarChart3,
  User,
  MessageSquare,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  History,
  Map,
  PlusCircle,
  XCircle,
  Plus,
} from "lucide-react";

interface CommentHistory {
  id: string;
  comment: string;
  date: string;
  yearMonth: string; // YYYY-MM形式
}

interface PerformanceMetrics {
  target: number;
  actual: number;
  achievementRate: number;
}

interface MonthlyPerformance {
  sales: PerformanceMetrics;
  grossProfit: PerformanceMetrics;
  operatingProfit: PerformanceMetrics;
}

interface RoadmapAdvice {
  title: string;
  advice: string;
  details: string[];
}

interface RoadmapQuarter {
  [quarter: number]: RoadmapAdvice;
}

interface RoadmapYear {
  year: number;
  quarters: RoadmapQuarter;
}

interface UserPerformanceData {
  userId: string;
  userName: string;
  email: string;
  password?: string;
  businessName: string;
  capital?: number;
  companySize?: string;
  industry?: string;
  businessStartDate?: string;
  knowledgeLevel?: string;
  lastUpdated: string;
  fiscalYearEndMonth: number; // 決算月（1-12）

  performance: {
    currentMonth: MonthlyPerformance;
    lastMonth: MonthlyPerformance;
    twoMonthsAgo: MonthlyPerformance;
  };

  // コメント関連
  hasComment: boolean;
  comment: string;
  commentDate: string;

  // コメント履歴
  commentHistory: CommentHistory[];

  // ナビゲーションデータ
  roadmap: RoadmapYear[];
}

const defaultRoadmapYear1: RoadmapQuarter = {
  1: {
    title: "事業をスタートさせよう",
    advice: "個人事業主の届出や会社設立から始めよう",
    details: [
      "個人事業主の届出や会社設立の手続き",
      "「どんな商品・サービスを誰に売るか」を明確にする",
      "開業資金を準備する（自分のお金や借入）",
      "家計簿のような帳簿をつける仕組みを作る",
    ],
  },
  2: {
    title: "最初のお客様を見つけよう",
    advice: "実際に商品・サービスを売り始めよう",
    details: [
      "実際に商品・サービスを売り始める",
      "「いくら売れたか」を記録する",
      "毎月の売上と支出をチェックする習慣をつける",
      "確定申告の準備を始める",
    ],
  },
  3: {
    title: "売上を伸ばしていこう",
    advice: "お客様を増やす活動に力を入れよう",
    details: [
      "お客様を増やす活動に力を入れる",
      "「今月はいくら売りたいか」目標を決める",
      "お金の出入りを毎月チェックする",
      "税金の申告について勉強し始める",
    ],
  },
  4: {
    title: "1年目の成果を確認しよう",
    advice: "確定申告・決算を行おう",
    details: [
      "確定申告・決算を行う",
      "「1年間でいくら売れたか、いくら残ったか」を計算",
      "来年の目標を立てる",
      "貯金がどれくらい増えたかチェック",
    ],
  },
};

const defaultRoadmapYear2: RoadmapQuarter = {
  1: {
    title: "事業を安定させよう",
    advice: "既存のお客様との関係を大切にしよう",
    details: [
      "既存のお客様との関係を大切にする",
      "「来月はいくら売れそうか」予測の精度を上げる",
      "無駄な出費がないかチェックする",
      "人を雇うかどうか検討する",
    ],
  },
  2: {
    title: "事業を大きくする準備をしよう",
    advice: "スタッフを雇って教育しよう",
    details: [
      "スタッフを雇って教育する",
      "仕事の流れを整理して効率化する",
      "売上管理をもっと詳しくする",
      "3年後の目標を考える",
    ],
  },
  3: {
    title: "事業を広げよう",
    advice: "新しい商品・サービスを考えよう",
    details: [
      "新しい商品・サービスを考える",
      "営業活動を強化する",
      "「売上に対してどれくらい利益が出ているか」を改善",
      "設備投資を検討する",
    ],
  },
  4: {
    title: "経営の基盤を固めよう",
    advice: "2年目の決算・税務申告を行おう",
    details: [
      "2年目の決算・税務申告",
      "お金の流れをもっと詳しく分析",
      "来年の詳しい予算を作る",
      "個人の資産がどれくらい増えたかチェック",
    ],
  },
};

const generateDefaultRoadmap = (): RoadmapYear[] => {
  const roadmap: RoadmapYear[] = [];
  for (let i = 0; i < 11; i++) {
    const year = 2024 + i;
    if (year === 2024) {
      roadmap.push({ year, quarters: defaultRoadmapYear1 });
    } else if (year < 2034) {
      roadmap.push({ year, quarters: defaultRoadmapYear2 });
    } else {
      // 2034
      const goalAdvice: RoadmapAdvice = {
        title: "10年間のゴール",
        advice: "目標に向けて歩むあなたを、この場所で待っています。",
        details: [],
      };
      roadmap.push({
        year: 2034,
        quarters: {
          1: goalAdvice,
          2: goalAdvice,
          3: goalAdvice,
          4: goalAdvice,
        },
      });
    }
  }
  return roadmap;
};

const generateDefaultPerformance = (): {
  currentMonth: MonthlyPerformance;
  lastMonth: MonthlyPerformance;
  twoMonthsAgo: MonthlyPerformance;
} => {
  const zeroMetrics: PerformanceMetrics = {
    target: 0,
    actual: 0,
    achievementRate: 0,
  };
  const zeroMonthly: MonthlyPerformance = {
    sales: zeroMetrics,
    grossProfit: zeroMetrics,
    operatingProfit: zeroMetrics,
  };
  return {
    currentMonth: zeroMonthly,
    lastMonth: zeroMonthly,
    twoMonthsAgo: zeroMonthly,
  };
};

// デモ用のクライアントデータ
const DEMO_USERS: UserPerformanceData[] = [
  {
    userId: "user001",
    userName: "田中 太郎",
    email: "tanaka@example.com",
    businessName: "田中コンサルティング",
    capital: 10000000,
    companySize: "6-20人",
    industry: "コンサルティング",
    businessStartDate: "2023-04",
    knowledgeLevel: "中級者",
    lastUpdated: "2025-07-05",
    fiscalYearEndMonth: 3, // 3月決算
    performance: {
      twoMonthsAgo: {
        sales: { target: 1000000, actual: 1050000, achievementRate: 105.0 },
        grossProfit: { target: 400000, actual: 420000, achievementRate: 105.0 },
        operatingProfit: {
          target: 200000,
          actual: 210000,
          achievementRate: 105.0,
        },
      },
      lastMonth: {
        sales: { target: 1000000, actual: 950000, achievementRate: 95.0 },
        grossProfit: { target: 400000, actual: 380000, achievementRate: 95.0 },
        operatingProfit: {
          target: 200000,
          actual: 190000,
          achievementRate: 95.0,
        },
      },
      currentMonth: {
        sales: { target: 1200000, actual: 800000, achievementRate: 66.7 },
        grossProfit: { target: 500000, actual: 320000, achievementRate: 64.0 },
        operatingProfit: {
          target: 250000,
          actual: 160000,
          achievementRate: 64.0,
        },
      },
    },
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
    roadmap: generateDefaultRoadmap(),
  },
  {
    userId: "user002",
    userName: "佐藤 花子",
    email: "sato@example.com",
    businessName: "佐藤デザイン事務所",
    capital: 3000000,
    companySize: "1-5人",
    industry: "デザイン",
    businessStartDate: "2024-01",
    knowledgeLevel: "初心者",
    lastUpdated: "2025-07-04",
    fiscalYearEndMonth: 12, // 12月決算
    performance: {
      twoMonthsAgo: {
        sales: { target: 800000, actual: 820000, achievementRate: 102.5 },
        grossProfit: { target: 320000, actual: 330000, achievementRate: 103.1 },
        operatingProfit: {
          target: 160000,
          actual: 165000,
          achievementRate: 103.1,
        },
      },
      lastMonth: {
        sales: { target: 800000, actual: 920000, achievementRate: 115.0 },
        grossProfit: { target: 320000, actual: 380000, achievementRate: 118.8 },
        operatingProfit: {
          target: 160000,
          actual: 190000,
          achievementRate: 118.8,
        },
      },
      currentMonth: {
        sales: { target: 900000, actual: 750000, achievementRate: 83.3 },
        grossProfit: { target: 360000, actual: 300000, achievementRate: 83.3 },
        operatingProfit: {
          target: 180000,
          actual: 150000,
          achievementRate: 83.3,
        },
      },
    },
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
    roadmap: generateDefaultRoadmap(),
  },
  {
    userId: "user003",
    userName: "山田 一郎",
    email: "yamada@example.com",
    businessName: "山田商事",
    capital: 50000000,
    companySize: "21-50人",
    industry: "卸売",
    businessStartDate: "2020-06",
    knowledgeLevel: "上級者",
    lastUpdated: "2025-07-03",
    fiscalYearEndMonth: 6, // 6月決算
    performance: {
      twoMonthsAgo: {
        sales: { target: 1400000, actual: 1300000, achievementRate: 92.9 },
        grossProfit: { target: 560000, actual: 520000, achievementRate: 92.9 },
        operatingProfit: {
          target: 280000,
          actual: 260000,
          achievementRate: 92.9,
        },
      },
      lastMonth: {
        sales: { target: 1500000, actual: 1350000, achievementRate: 90.0 },
        grossProfit: { target: 600000, actual: 540000, achievementRate: 90.0 },
        operatingProfit: {
          target: 300000,
          actual: 270000,
          achievementRate: 90.0,
        },
      },
      currentMonth: {
        sales: { target: 1600000, actual: 1200000, achievementRate: 75.0 },
        grossProfit: { target: 640000, actual: 480000, achievementRate: 75.0 },
        operatingProfit: {
          target: 320000,
          actual: 240000,
          achievementRate: 75.0,
        },
      },
    },
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
    roadmap: generateDefaultRoadmap(),
  },
  {
    userId: "user004",
    userName: "鈴木 美咲",
    email: "suzuki@example.com",
    businessName: "鈴木マーケティング",
    capital: 5000000,
    companySize: "1-5人",
    industry: "マーケティング",
    businessStartDate: "2023-10",
    knowledgeLevel: "初心者",
    lastUpdated: "2025-07-05",
    fiscalYearEndMonth: 9, // 9月決算
    performance: {
      twoMonthsAgo: {
        sales: { target: 500000, actual: 550000, achievementRate: 110.0 },
        grossProfit: { target: 200000, actual: 220000, achievementRate: 110.0 },
        operatingProfit: {
          target: 100000,
          actual: 110000,
          achievementRate: 110.0,
        },
      },
      lastMonth: {
        sales: { target: 600000, actual: 680000, achievementRate: 113.3 },
        grossProfit: { target: 240000, actual: 272000, achievementRate: 113.3 },
        operatingProfit: {
          target: 120000,
          actual: 136000,
          achievementRate: 113.3,
        },
      },
      currentMonth: {
        sales: { target: 700000, actual: 520000, achievementRate: 74.3 },
        grossProfit: { target: 280000, actual: 208000, achievementRate: 74.3 },
        operatingProfit: {
          target: 140000,
          actual: 104000,
          achievementRate: 74.3,
        },
      },
    },
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
    roadmap: generateDefaultRoadmap(),
  },
  {
    userId: "user005",
    userName: "高橋 健太",
    email: "takahashi@example.com",
    businessName: "高橋IT開発",
    capital: 20000000,
    companySize: "6-20人",
    industry: "IT",
    businessStartDate: "2021-02",
    knowledgeLevel: "中級者",
    lastUpdated: "2025-07-02",
    fiscalYearEndMonth: 12, // 12月決算
    performance: {
      twoMonthsAgo: {
        sales: { target: 1800000, actual: 1900000, achievementRate: 105.6 },
        grossProfit: { target: 720000, actual: 760000, achievementRate: 105.6 },
        operatingProfit: {
          target: 360000,
          actual: 380000,
          achievementRate: 105.6,
        },
      },
      lastMonth: {
        sales: { target: 2000000, actual: 2200000, achievementRate: 110.0 },
        grossProfit: { target: 800000, actual: 880000, achievementRate: 110.0 },
        operatingProfit: {
          target: 400000,
          actual: 440000,
          achievementRate: 110.0,
        },
      },
      currentMonth: {
        sales: { target: 2100000, actual: 1800000, achievementRate: 85.7 },
        grossProfit: { target: 840000, actual: 720000, achievementRate: 85.7 },
        operatingProfit: {
          target: 420000,
          actual: 360000,
          achievementRate: 85.7,
        },
      },
    },
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
    roadmap: generateDefaultRoadmap(),
  },
];

const TaxAccountantDashboard: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<UserPerformanceData | null>(
    null
  );
  const [users, setUsers] = useState<UserPerformanceData[]>(DEMO_USERS);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentComment, setCurrentComment] = useState("");
  const [isCommentSaving, setIsCommentSaving] = useState(false);
  const [showCommentHistory, setShowCommentHistory] = useState(false);
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // デモ用のローディングシミュレーション
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // 1秒後にローディングを終了

    return () => clearTimeout(timer); // クリーンアップ関数
  }, []); // 空の依存配列でコンポーネントマウント時に一度だけ実行

  const [editableRoadmap, setEditableRoadmap] = useState<RoadmapYear[]>([]);
  const [openYear, setOpenYear] = useState<number | null>(null);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  const industryOptions = [
    "コンサルティング",
    "デザイン",
    "卸売",
    "マーケティング",
    "IT",
    "小売",
    "飲食",
    "建設",
    "不動産",
    "その他",
  ];

  const initialNewUserState = {
    userName: "",
    email: "",
    password: "",
    businessName: "",
    capital: 0,
    companySize: "1-5人",
    industry: "コンサルティング",
    businessStartDate: "",
    knowledgeLevel: "初心者",
    fiscalYearEndMonth: 12,
  };

  const [newUser, setNewUser] = useState(initialNewUserState);

  const handleNewUserChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddNewUser = () => {
    if (
      !newUser.email ||
      !newUser.userName ||
      !newUser.password ||
      !newUser.businessName
    ) {
      alert(
        "必須項目（メールアドレス、パスワード、ユーザー名、会社名）を入力してください。"
      );
      return;
    }

    const newUserWithDefaults: UserPerformanceData = {
      userId: `user_${Date.now()}`,
      lastUpdated: new Date().toISOString().split("T")[0],
      performance: generateDefaultPerformance(),
      hasComment: false,
      comment: "",
      commentDate: "",
      commentHistory: [],
      roadmap: generateDefaultRoadmap(),
      ...newUser,
      capital: Number(newUser.capital), // ensure capital is a number
    };

    setUsers((prevUsers) => [...prevUsers, newUserWithDefaults]);
    setIsAddUserModalOpen(false);
    setNewUser(initialNewUserState);
  };

  // selectedUser が変更されたときにロードマップ編集用のstateを更新
  useEffect(() => {
    if (selectedUser) {
      setEditableRoadmap(selectedUser.roadmap);
    } else {
      setEditableRoadmap([]);
    }
    setOpenYear(null); // ユーザー切り替え時にアコーディオンを閉じる
  }, [selectedUser]);

  // フィルタリングとソート
  const filteredAndSortedUsers = users
    .filter(
      (user) =>
        user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.businessName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.userName.localeCompare(b.userName));

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

  const handleRoadmapChange = (
    year: number,
    quarter: number,
    field: "title" | "advice",
    value: string
  ) => {
    setEditableRoadmap((prev) =>
      prev.map((y) => {
        if (y.year === year) {
          const newQuarters = { ...y.quarters };
          newQuarters[quarter] = {
            ...newQuarters[quarter],
            [field]: value,
          };
          return { ...y, quarters: newQuarters };
        }
        return y;
      })
    );
  };

  const handleDetailChange = (
    year: number,
    quarter: number,
    detailIndex: number,
    value: string
  ) => {
    setEditableRoadmap((prev) =>
      prev.map((y) => {
        if (y.year === year) {
          const newQuarters = { ...y.quarters };
          const newDetails = [...newQuarters[quarter].details];
          newDetails[detailIndex] = value;
          newQuarters[quarter] = {
            ...newQuarters[quarter],
            details: newDetails,
          };
          return { ...y, quarters: newQuarters };
        }
        return y;
      })
    );
  };

  const addDetail = (year: number, quarter: number) => {
    setEditableRoadmap((prev) =>
      prev.map((y) => {
        if (y.year === year) {
          const newQuarters = { ...y.quarters };
          const newDetails = [...newQuarters[quarter].details, ""];
          newQuarters[quarter] = {
            ...newQuarters[quarter],
            details: newDetails,
          };
          return { ...y, quarters: newQuarters };
        }
        return y;
      })
    );
  };

  const removeDetail = (year: number, quarter: number, detailIndex: number) => {
    setEditableRoadmap((prev) =>
      prev.map((y) => {
        if (y.year === year) {
          const newQuarters = { ...y.quarters };
          const newDetails = newQuarters[quarter].details.filter(
            (_, i) => i !== detailIndex
          );
          newQuarters[quarter] = {
            ...newQuarters[quarter],
            details: newDetails,
          };
          return { ...y, quarters: newQuarters };
        }
        return y;
      })
    );
  };

  const handleSaveRoadmap = () => {
    if (!selectedUser) return; // ユーザーが選択されていない場合は何もしない

    const updatedUsers = users.map((user) =>
      user.userId === selectedUser.userId
        ? { ...user, roadmap: editableRoadmap }
        : user
    );
    setUsers(updatedUsers);

    const updatedSelectedUser = updatedUsers.find(
      (user) => user.userId === selectedUser.userId
    );
    if (updatedSelectedUser) {
      setSelectedUser(updatedSelectedUser);
    }
    alert("ナビゲーションを保存しました (デモモード)");
  };

  // ユーザー詳細画面
  if (selectedUser) {
    const currentDate = new Date("2025-07-01"); // デモデータに基づいた現在日付
    const formatYearMonth = (date: Date) => {
      return `${date.getFullYear()}年${date.getMonth() + 1}月`;
    };

    const currentMonthDate = currentDate;
    const lastMonthDate = new Date(currentDate);
    lastMonthDate.setMonth(currentDate.getMonth() - 1);
    const twoMonthsAgoDate = new Date(currentDate);
    twoMonthsAgoDate.setMonth(currentDate.getMonth() - 2);

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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 先々月実績 */}
          <div className="card">
            <h3 className="text-lg font-semibold text-text mb-4 flex items-center space-x-2">
              <History className="h-5 w-5 text-primary" />
              <span>{`${formatYearMonth(twoMonthsAgoDate)}実績`}</span>
            </h3>
            <div className="space-y-3">
              {/* 売上 */}
              <div
                className={`p-3 rounded-lg border ${getPerformanceBgColor(
                  selectedUser.performance.twoMonthsAgo.sales.achievementRate
                )}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-text/70">売上</span>
                  <DollarSign className="h-4 w-4 text-primary" />
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="text-text/60">目標</p>
                    <p className="font-semibold">
                      {formatCurrency(
                        selectedUser.performance.twoMonthsAgo.sales.target
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-text/60">実績</p>
                    <p className="font-semibold">
                      {formatCurrency(
                        selectedUser.performance.twoMonthsAgo.sales.actual
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-text/60">達成率</p>
                    <p
                      className={`font-bold ${getPerformanceColor(
                        selectedUser.performance.twoMonthsAgo.sales
                          .achievementRate
                      )}`}
                    >
                      {formatPercentage(
                        selectedUser.performance.twoMonthsAgo.sales
                          .achievementRate
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* 粗利益 */}
              <div
                className={`p-3 rounded-lg border ${getPerformanceBgColor(
                  selectedUser.performance.twoMonthsAgo.grossProfit
                    .achievementRate
                )}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-text/70">
                    粗利益
                  </span>
                  <Target className="h-4 w-4 text-success" />
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="text-text/60">目標</p>
                    <p className="font-semibold">
                      {formatCurrency(
                        selectedUser.performance.twoMonthsAgo.grossProfit.target
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-text/60">実績</p>
                    <p className="font-semibold">
                      {formatCurrency(
                        selectedUser.performance.twoMonthsAgo.grossProfit.actual
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-text/60">達成率</p>
                    <p
                      className={`font-bold ${getPerformanceColor(
                        selectedUser.performance.twoMonthsAgo.grossProfit
                          .achievementRate
                      )}`}
                    >
                      {formatPercentage(
                        selectedUser.performance.twoMonthsAgo.grossProfit
                          .achievementRate
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* 営業利益 */}
              <div
                className={`p-3 rounded-lg border ${getPerformanceBgColor(
                  selectedUser.performance.twoMonthsAgo.operatingProfit
                    .achievementRate
                )}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-text/70">
                    営業利益
                  </span>
                  <Target className="h-4 w-4 text-info" />
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="text-text/60">目標</p>
                    <p className="font-semibold">
                      {formatCurrency(
                        selectedUser.performance.twoMonthsAgo.operatingProfit
                          .target
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-text/60">実績</p>
                    <p className="font-semibold">
                      {formatCurrency(
                        selectedUser.performance.twoMonthsAgo.operatingProfit
                          .actual
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-text/60">達成率</p>
                    <p
                      className={`font-bold ${getPerformanceColor(
                        selectedUser.performance.twoMonthsAgo.operatingProfit
                          .achievementRate
                      )}`}
                    >
                      {formatPercentage(
                        selectedUser.performance.twoMonthsAgo.operatingProfit
                          .achievementRate
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 先月実績 */}
          <div className="card">
            <h3 className="text-lg font-semibold text-text mb-4 flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-primary" />
              <span>{`${formatYearMonth(lastMonthDate)}実績`}</span>
            </h3>

            <div className="space-y-3">
              {/* 売上 */}
              <div
                className={`p-3 rounded-lg border ${getPerformanceBgColor(
                  selectedUser.performance.lastMonth.sales.achievementRate
                )}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-text/70">売上</span>
                  <DollarSign className="h-4 w-4 text-primary" />
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="text-text/60">目標</p>
                    <p className="font-semibold">
                      {formatCurrency(
                        selectedUser.performance.lastMonth.sales.target
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-text/60">実績</p>
                    <p className="font-semibold">
                      {formatCurrency(
                        selectedUser.performance.lastMonth.sales.actual
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-text/60">達成率</p>
                    <p
                      className={`font-bold ${getPerformanceColor(
                        selectedUser.performance.lastMonth.sales.achievementRate
                      )}`}
                    >
                      {formatPercentage(
                        selectedUser.performance.lastMonth.sales.achievementRate
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* 粗利益 */}
              <div
                className={`p-3 rounded-lg border ${getPerformanceBgColor(
                  selectedUser.performance.lastMonth.grossProfit.achievementRate
                )}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-text/70">
                    粗利益
                  </span>
                  <Target className="h-4 w-4 text-success" />
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="text-text/60">目標</p>
                    <p className="font-semibold">
                      {formatCurrency(
                        selectedUser.performance.lastMonth.grossProfit.target
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-text/60">実績</p>
                    <p className="font-semibold">
                      {formatCurrency(
                        selectedUser.performance.lastMonth.grossProfit.actual
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-text/60">達成率</p>
                    <p
                      className={`font-bold ${getPerformanceColor(
                        selectedUser.performance.lastMonth.grossProfit
                          .achievementRate
                      )}`}
                    >
                      {formatPercentage(
                        selectedUser.performance.lastMonth.grossProfit
                          .achievementRate
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* 営業利益 */}
              <div
                className={`p-3 rounded-lg border ${getPerformanceBgColor(
                  selectedUser.performance.lastMonth.operatingProfit
                    .achievementRate
                )}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-text/70">
                    営業利益
                  </span>
                  <Target className="h-4 w-4 text-info" />
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="text-text/60">目標</p>
                    <p className="font-semibold">
                      {formatCurrency(
                        selectedUser.performance.lastMonth.operatingProfit
                          .target
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-text/60">実績</p>
                    <p className="font-semibold">
                      {formatCurrency(
                        selectedUser.performance.lastMonth.operatingProfit
                          .actual
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-text/60">達成率</p>
                    <p
                      className={`font-bold ${getPerformanceColor(
                        selectedUser.performance.lastMonth.operatingProfit
                          .achievementRate
                      )}`}
                    >
                      {formatPercentage(
                        selectedUser.performance.lastMonth.operatingProfit
                          .achievementRate
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
              <span>{`${formatYearMonth(currentMonthDate)}実績`}</span>
            </h3>

            <div className="space-y-3">
              {/* 売上 */}
              <div
                className={`p-3 rounded-lg border ${getPerformanceBgColor(
                  selectedUser.performance.currentMonth.sales.achievementRate
                )}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-text/70">売上</span>
                  <DollarSign className="h-4 w-4 text-primary" />
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="text-text/60">目標</p>
                    <p className="font-semibold">
                      {formatCurrency(
                        selectedUser.performance.currentMonth.sales.target
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-text/60">実績</p>
                    <p className="font-semibold">
                      {formatCurrency(
                        selectedUser.performance.currentMonth.sales.actual
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-text/60">達成率</p>
                    <p
                      className={`font-bold ${getPerformanceColor(
                        selectedUser.performance.currentMonth.sales
                          .achievementRate
                      )}`}
                    >
                      {formatPercentage(
                        selectedUser.performance.currentMonth.sales
                          .achievementRate
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* 粗利益 */}
              <div
                className={`p-3 rounded-lg border ${getPerformanceBgColor(
                  selectedUser.performance.currentMonth.grossProfit
                    .achievementRate
                )}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-text/70">
                    粗利益
                  </span>
                  <Target className="h-4 w-4 text-success" />
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="text-text/60">目標</p>
                    <p className="font-semibold">
                      {formatCurrency(
                        selectedUser.performance.currentMonth.grossProfit.target
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-text/60">実績</p>
                    <p className="font-semibold">
                      {formatCurrency(
                        selectedUser.performance.currentMonth.grossProfit.actual
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-text/60">達成率</p>
                    <p
                      className={`font-bold ${getPerformanceColor(
                        selectedUser.performance.currentMonth.grossProfit
                          .achievementRate
                      )}`}
                    >
                      {formatPercentage(
                        selectedUser.performance.currentMonth.grossProfit
                          .achievementRate
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* 営業利益 */}
              <div
                className={`p-3 rounded-lg border ${getPerformanceBgColor(
                  selectedUser.performance.currentMonth.operatingProfit
                    .achievementRate
                )}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-text/70">
                    営業利益
                  </span>
                  <Target className="h-4 w-4 text-info" />
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="text-text/60">目標</p>
                    <p className="font-semibold">
                      {formatCurrency(
                        selectedUser.performance.currentMonth.operatingProfit
                          .target
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-text/60">実績</p>
                    <p className="font-semibold">
                      {formatCurrency(
                        selectedUser.performance.currentMonth.operatingProfit
                          .actual
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-text/60">達成率</p>
                    <p
                      className={`font-bold ${getPerformanceColor(
                        selectedUser.performance.currentMonth.operatingProfit
                          .achievementRate
                      )}`}
                    >
                      {formatPercentage(
                        selectedUser.performance.currentMonth.operatingProfit
                          .achievementRate
                      )}
                    </p>
                  </div>
                </div>
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

        {/* ナビゲーション編集セクション */}
        <div className="card">
          <h3 className="text-lg font-semibold text-text mb-4 flex items-center space-x-2">
            <Map className="h-5 w-5 text-primary" />
            <span>ナビゲーション編集</span>
          </h3>
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
            {editableRoadmap.map((yearData) => (
              <div key={yearData.year} className="border rounded-lg">
                <button
                  onClick={() =>
                    setOpenYear(
                      openYear === yearData.year ? null : yearData.year
                    )
                  }
                  className="w-full text-left p-4 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <span className="font-semibold">{yearData.year}年度</span>
                  {openYear === yearData.year ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </button>
                {openYear === yearData.year && (
                  <div className="p-4 border-t space-y-4">
                    {Object.entries(yearData.quarters).map(
                      ([q, advice]: [string, RoadmapAdvice]) => {
                        const quarter = parseInt(q);
                        return (
                          <div
                            key={quarter}
                            className="mb-4 p-4 border rounded-md bg-white shadow-sm"
                          >
                            <h4 className="font-bold text-primary mb-3">
                              第{quarter}四半期
                            </h4>
                            <div className="space-y-3">
                              <div>
                                <label className="block text-sm font-medium text-text/70 mb-1">
                                  タイトル
                                </label>
                                <input
                                  type="text"
                                  value={advice.title}
                                  onChange={(e) =>
                                    handleRoadmapChange(
                                      yearData.year,
                                      quarter,
                                      "title",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-text/70 mb-1">
                                  アドバイス
                                </label>
                                <textarea
                                  value={advice.advice}
                                  onChange={(e) =>
                                    handleRoadmapChange(
                                      yearData.year,
                                      quarter,
                                      "advice",
                                      e.target.value
                                    )
                                  }
                                  rows={2}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-y"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-text/70 mb-1">
                                  詳細タスク
                                </label>
                                <div className="space-y-2">
                                  {advice.details.map(
                                    (detail: string, index: number) => (
                                      <div
                                        key={index}
                                        className="flex items-center space-x-2"
                                      >
                                        <input
                                          type="text"
                                          value={detail}
                                          onChange={(e) =>
                                            handleDetailChange(
                                              yearData.year,
                                              quarter,
                                              index,
                                              e.target.value
                                            )
                                          }
                                          className="flex-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                        />
                                        <button
                                          onClick={() =>
                                            removeDetail(
                                              yearData.year,
                                              quarter,
                                              index
                                            )
                                          }
                                          className="text-red-500 hover:text-red-700 transition-colors"
                                        >
                                          <XCircle className="h-5 w-5" />
                                        </button>
                                      </div>
                                    )
                                  )}
                                  <button
                                    onClick={() =>
                                      addDetail(yearData.year, quarter)
                                    }
                                    className="flex items-center space-x-2 text-sm text-primary hover:text-primary/80 transition-colors"
                                  >
                                    <PlusCircle className="h-4 w-4" />
                                    <span>タスクを追加</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={handleSaveRoadmap}
              className="px-6 py-2 text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
            >
              ナビゲーションを保存
            </button>
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
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsAddUserModalOpen(true)}
            className="flex items-center px-4 py-2 text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            ユーザー追加
          </button>
          <div className="text-sm text-text/70">
            登録ユーザー数: {users.length}名
            {isLoading && <span className="ml-2">(読み込み中...)</span>}
          </div>
        </div>
      </div>

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
                <span>名前順</span>
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
                      <p className="text-sm text-text/70">
                        {user.hasComment && (
                          <div className="flex items-center space-x-1 text-green-600">
                            <CheckCircle className="h-4 w-4" />
                            <span className="text-xs font-medium">
                              コメント済み
                            </span>
                          </div>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ChevronRight className="h-5 w-5 text-text/40" />
                  </div>
                </div>

                <div className="space-y-3">
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

      {/* 新規ユーザー追加モーダル */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 sm:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">新規ユーザー追加</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-text/70 mb-1">
                  メールアドレス *
                </label>
                <input
                  type="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleNewUserChange}
                  autoComplete="off"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-text/70 mb-1">
                  パスワード *
                </label>
                <input
                  type="text"
                  name="password"
                  value={newUser.password}
                  onChange={handleNewUserChange}
                  autoComplete="off"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* User Name */}
              <div>
                <label className="block text-sm font-medium text-text/70 mb-1">
                  ユーザー名 *
                </label>
                <input
                  type="text"
                  name="userName"
                  value={newUser.userName}
                  onChange={handleNewUserChange}
                  autoComplete="off"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Company Name */}
              <div>
                <label className="block text-sm font-medium text-text/70 mb-1">
                  会社名 *
                </label>
                <input
                  type="text"
                  name="businessName"
                  value={newUser.businessName}
                  onChange={handleNewUserChange}
                  autoComplete="off"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Capital */}
              <div>
                <label className="block text-sm font-medium text-text/70 mb-1">
                  資本金 (円)
                </label>
                <input
                  type="number"
                  name="capital"
                  value={newUser.capital}
                  onChange={handleNewUserChange}
                  autoComplete="off"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Company Size */}
              <div>
                <label className="block text-sm font-medium text-text/70 mb-1">
                  会社規模
                </label>
                <select
                  name="companySize"
                  value={newUser.companySize}
                  onChange={handleNewUserChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option>1-5人</option>
                  <option>6-20人</option>
                  <option>21-50人</option>
                  <option>51人以上</option>
                </select>
              </div>

              {/* Industry */}
              <div>
                <label className="block text-sm font-medium text-text/70 mb-1">
                  業界
                </label>
                <select
                  name="industry"
                  value={newUser.industry}
                  onChange={handleNewUserChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  {industryOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Business Start Date */}
              <div>
                <label className="block text-sm font-medium text-text/70 mb-1">
                  事業開始年月
                </label>
                <input
                  type="month"
                  name="businessStartDate"
                  value={newUser.businessStartDate}
                  onChange={handleNewUserChange}
                  autoComplete="off"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Knowledge Level */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-text/70 mb-1">
                  財務・会計の知識レベル
                </label>
                <select
                  name="knowledgeLevel"
                  value={newUser.knowledgeLevel}
                  onChange={handleNewUserChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option>初心者</option>
                  <option>中級者</option>
                  <option>上級者</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={() => setIsAddUserModalOpen(false)}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={handleAddNewUser}
                className="px-4 py-2 text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
              >
                追加
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaxAccountantDashboard;
