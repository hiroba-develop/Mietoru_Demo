import React, { useState } from "react";
import {
  ChevronUp,
  ChevronDown,
  Navigation as NavigationIcon,
  MapPin,
  Target,
  TrendingUp,
  BarChart3,
  CheckCircle,
  ArrowLeft,
  Map,
  Calendar,
  Clock,
  Info,
} from "lucide-react";

interface Advice {
  title: string;
  icon: React.ElementType;
  advice: string;
  details: string[];
}

interface QuarterAdvices {
  [key: number]: Advice;
}

const QuarterlyTaskDisplay: React.FC<{
  year: number;
  quarter: number;
  advice: Advice;
  checkedItems: { [key: string]: boolean };
  onCheckboxChange: (year: number, quarter: number, index: number) => void;
}> = ({ year, quarter, advice, checkedItems, onCheckboxChange }) => {
  const totalQuarterlyTasks = advice.details.length;
  const completedQuarterlyTasks = Object.keys(checkedItems).filter(
    (key) => key.startsWith(`${year}-${quarter}-`) && checkedItems[key]
  ).length;
  const quarterlyTaskProgress =
    totalQuarterlyTasks > 0
      ? (completedQuarterlyTasks / totalQuarterlyTasks) * 100
      : 0;
  const allQuarterlyTasksCompleted =
    totalQuarterlyTasks > 0 && completedQuarterlyTasks === totalQuarterlyTasks;

  return (
    <>
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mb-4 text-sm">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-0.5">
            <Info className="w-5 h-5 text-blue-500" />
          </div>
          <p className="font-medium text-blue-800">{advice.advice}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-700 mb-1">
          <span>進捗状況</span>
          <span>
            {completedQuarterlyTasks}/{totalQuarterlyTasks}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              allQuarterlyTasksCompleted ? "bg-yellow-500" : "bg-primary"
            }`}
            style={{
              width: `${quarterlyTaskProgress}%`,
              backgroundColor: allQuarterlyTasksCompleted
                ? "#FBBF24"
                : "#67BACA",
            }}
          />
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-2">
        {advice.details.map((detail: string, index: number) => {
          const checkboxKey = `${year}-${quarter}-${index}`;
          const isChecked = checkedItems[checkboxKey] || false;

          return (
            <div
              key={index}
              className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors ${
                isChecked
                  ? "bg-green-50 border-green-200"
                  : "bg-gray-50 border-gray-200 hover:border-gray-300"
              }`}
            >
              <button
                onClick={() => onCheckboxChange(year, quarter, index)}
                className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                  isChecked
                    ? "bg-green-500 border-green-500 text-white"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                {isChecked && <CheckCircle className="h-3 w-3" />}
              </button>
              <div className="flex-1">
                <p
                  className={`text-sm ${
                    isChecked ? "line-through text-gray-500" : "text-gray-800"
                  }`}
                >
                  {detail}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

const Navigation = () => {
  const [currentYear] = useState(2025);
  const [currentQuarter] = useState(3);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [hoveredQuarter, setHoveredQuarter] = useState<string | null>(null);
  const [pinnedQuarter, setPinnedQuarter] = useState<string | null>(
    `${currentYear}-${currentQuarter}`
  );
  const [viewMode, setViewMode] = useState("quarter");
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>(
    {}
  );

  const quarterAdvice: QuarterAdvices = {
    1: {
      title: "事業をスタートさせよう",
      icon: Target,
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
      icon: TrendingUp,
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
      icon: BarChart3,
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
      icon: CheckCircle,
      advice: "確定申告・決算を行おう",
      details: [
        "確定申告・決算を行う",
        "「1年間でいくら売れたか、いくら残ったか」を計算",
        "来年の目標を立てる",
        "貯金がどれくらい増えたかチェック",
      ],
    },
  };

  const secondYearAdvice: QuarterAdvices = {
    1: {
      title: "事業を安定させよう",
      icon: Target,
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
      icon: TrendingUp,
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
      icon: BarChart3,
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
      icon: CheckCircle,
      advice: "2年目の決算・税務申告を行おう",
      details: [
        "2年目の決算・税務申告",
        "お金の流れをもっと詳しく分析",
        "来年の詳しい予算を作る",
        "個人の資産がどれくらい増えたかチェック",
      ],
    },
  };

  const getAdviceForYear = (year: number) => {
    if (year === 2024) return quarterAdvice;
    if (year === 2025) return secondYearAdvice;
    return secondYearAdvice;
  };

  const handleYearChange = (direction: "next" | "prev") => {
    if (direction === "next") {
      setSelectedYear((prev) => Math.min(prev + 1, 2034));
    } else {
      setSelectedYear((prev) => Math.max(prev - 1, 2024));
    }
  };

  const isCurrentPosition = (year: number, quarter: number) => {
    return year === currentYear && quarter === currentQuarter;
  };

  const isPassed = (year: number, quarter: number) => {
    if (year < currentYear) return true;
    if (year === currentYear && quarter < currentQuarter) return true;
    return false;
  };

  const isYearPassed = (year: number) => {
    return year < currentYear;
  };

  const isYearCurrent = (year: number) => {
    return year === currentYear;
  };

  const totalProgress =
    (((currentYear - 2024) * 4 + currentQuarter - 1) / 40) * 100;
  const remainingQuarters =
    40 - ((currentYear - 2024) * 4 + currentQuarter - 1);
  const elapsedQuarters = (currentYear - 2024) * 4 + currentQuarter - 1;

  const remainingMonths = remainingQuarters * 3;
  const remainingYears = Math.floor(remainingMonths / 12);
  const remainingMonthsOnly = remainingMonths % 12;
  const remainingTimeText =
    remainingYears > 0
      ? `${remainingYears}年${remainingMonthsOnly}ヶ月`
      : `${remainingMonthsOnly}ヶ月`;

  const elapsedMonths = elapsedQuarters * 3;
  const elapsedYears = Math.floor(elapsedMonths / 12);
  const elapsedMonthsOnly = elapsedMonths % 12;
  const elapsedTimeText =
    elapsedYears > 0
      ? `${elapsedYears}年${elapsedMonthsOnly}ヶ月目`
      : `${elapsedMonthsOnly}ヶ月目`;

  const handleCheckboxChange = (
    year: number,
    quarter: number,
    index: number
  ) => {
    const key = `${year}-${quarter}-${index}`;
    setCheckedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (viewMode === "year") {
    const years = Array.from({ length: 11 }, (_, i) => 2024 + i);

    return (
      <div
        className="w-full bg-white h-full flex flex-col border rounded-lg"
        style={{ borderColor: "#E0E0E0" }}
      >
        <div
          className="p-4 text-white rounded-t-lg"
          style={{ backgroundColor: "#67BACA" }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Map className="w-5 h-5" />
              <div>
                <div className="font-bold text-lg">全体マップ</div>
                <div className="text-sm opacity-90">2024年 - 2034年</div>
              </div>
            </div>
            <button
              onClick={() => setViewMode("quarter")}
              className="flex items-center space-x-2 px-3 py-1 rounded-lg bg-white hover:bg-gray-100 transition-all text-sm"
              style={{ color: "#67BACA" }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>戻る</span>
            </button>
          </div>
        </div>

        <div
          className="flex-1 p-4 flex justify-center items-center"
          style={{ backgroundColor: "#F0F8FF" }}
        >
          <div className="w-full max-w-[600px]">
            <svg
              viewBox="0 0 600 320"
              className="w-full h-auto border rounded-lg"
              style={{ borderColor: "#E0E0E0", backgroundColor: "#E8F4F8" }}
            >
              {/* 背景の装飾的な要素 */}
              <defs>
                <pattern
                  id="dots"
                  patternUnits="userSpaceOnUse"
                  width="20"
                  height="20"
                >
                  <circle cx="10" cy="10" r="1" fill="#67BACA" opacity="0.4" />
                  <circle cx="5" cy="15" r="0.5" fill="#B3DBC0" opacity="0.3" />
                  <circle cx="15" cy="5" r="0.8" fill="#67BACA" opacity="0.2" />
                </pattern>
                <linearGradient
                  id="roadGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop
                    offset="0%"
                    style={{ stopColor: "#67BACA", stopOpacity: 0.9 }}
                  />
                  <stop
                    offset="50%"
                    style={{ stopColor: "#B3DBC0", stopOpacity: 1 }}
                  />
                  <stop
                    offset="100%"
                    style={{ stopColor: "#67BACA", stopOpacity: 0.9 }}
                  />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* 背景のドット（星空風） */}
              <rect width="600" height="320" fill="url(#dots)" opacity="0.8" />

              {/* 年度ノード */}
              {years.map((year, index) => {
                // 5個ずつ2行に配置 + 最後の1個は3行目
                let row, col;
                if (index < 5) {
                  row = 0;
                  col = index;
                } else if (index < 10) {
                  row = 1;
                  col = index - 5;
                } else {
                  row = 2;
                  col = 0; // 2034年は左端
                }

                // 奇数行は右から左へ（蛇行）
                const adjustedCol = row % 2 === 1 ? 4 - col : col;

                const x = 80 + adjustedCol * 110;
                const y = 70 + row * 90;

                const isPassed = isYearPassed(year);
                const isCurrent = isYearCurrent(year);

                return (
                  <g key={year}>
                    {/* 年度の影 */}
                    <ellipse
                      cx={x + 2}
                      cy={y + 2}
                      rx="45"
                      ry="22"
                      fill="#000000"
                      opacity="0.1"
                    />

                    {/* 年度の楕円 */}
                    <ellipse
                      cx={x}
                      cy={y}
                      rx="45"
                      ry="22"
                      fill={
                        isCurrent ? "#FDF6F6" : isPassed ? "#F5F5F5" : "#FFFFFF"
                      }
                      stroke={
                        isCurrent ? "#FE0000" : isPassed ? "#E0E0E0" : "#E0E0E0"
                      }
                      strokeWidth={isCurrent ? "3" : "2"}
                      className="cursor-pointer transition-all duration-300"
                      onClick={() => {
                        setSelectedYear(year);
                        setViewMode("quarter");
                      }}
                      filter={isCurrent ? "url(#glow)" : "none"}
                    />

                    {/* 年度の内側の装飾 */}
                    {isCurrent && (
                      <ellipse
                        cx={x}
                        cy={y}
                        rx="38"
                        ry="18"
                        fill="none"
                        stroke="#FE0000"
                        strokeWidth="1"
                        opacity="0.3"
                      />
                    )}

                    {/* 年度ラベル */}
                    <text
                      x={x}
                      y={y - 2}
                      textAnchor="middle"
                      className="text-sm font-bold pointer-events-none"
                      fill={
                        isCurrent ? "#FE0000" : isPassed ? "#333333" : "#333333"
                      }
                    >
                      {year}年
                    </text>

                    {/* 年度の進捗インジケーター */}
                    {isCurrent && (
                      <text
                        x={x}
                        y={y + 12}
                        textAnchor="middle"
                        className="text-xs pointer-events-none"
                        fill="#FE0000"
                        opacity="0.8"
                      >
                        📍 イマココ
                      </text>
                    )}

                    {isPassed && (
                      <text
                        x={x}
                        y={y + 12}
                        textAnchor="middle"
                        className="text-xs pointer-events-none"
                        fill="#333333"
                        opacity="0.6"
                      >
                        ✓ 完了
                      </text>
                    )}
                  </g>
                );
              })}

              {/* 接続線（道路） */}
              {years.map((_, index) => {
                if (index === years.length - 1) return null;

                let currentRow, currentCol, nextRow, nextCol;

                // 現在の位置計算
                if (index < 5) {
                  currentRow = 0;
                  currentCol = index;
                } else if (index < 10) {
                  currentRow = 1;
                  currentCol = index - 5;
                } else {
                  currentRow = 2;
                  currentCol = 0;
                }

                // 次の位置計算
                if (index + 1 < 5) {
                  nextRow = 0;
                  nextCol = index + 1;
                } else if (index + 1 < 10) {
                  nextRow = 1;
                  nextCol = index + 1 - 5;
                } else {
                  nextRow = 2;
                  nextCol = 0;
                }

                // 座標計算
                const currentAdjustedCol =
                  currentRow % 2 === 1 ? 4 - currentCol : currentCol;
                const currentX = 80 + currentAdjustedCol * 110;
                const currentY = 70 + currentRow * 90;

                const nextAdjustedCol =
                  nextRow % 2 === 1 ? 4 - nextCol : nextCol;
                const nextX = 80 + nextAdjustedCol * 110;
                const nextY = 70 + nextRow * 90;

                if (currentRow === nextRow) {
                  // 同じ行での接続
                  const direction =
                    currentAdjustedCol < nextAdjustedCol ? 1 : -1;
                  return (
                    <line
                      key={`road-${index}`}
                      x1={currentX + 45 * direction}
                      y1={currentY}
                      x2={nextX - 45 * direction}
                      y2={nextY}
                      stroke="#67BACA"
                      strokeWidth="3"
                      opacity="0.6"
                    />
                  );
                } else {
                  // 行をまたぐ接続（カーブ）
                  const midX = (currentX + nextX) / 2;
                  const midY = (currentY + nextY) / 2;

                  return (
                    <path
                      key={`road-${index}`}
                      d={`M ${currentX} ${currentY + 22} Q ${midX} ${
                        midY + 30
                      } ${nextX} ${nextY - 22}`}
                      stroke="#67BACA"
                      strokeWidth="3"
                      fill="none"
                      opacity="0.6"
                    />
                  );
                }
              })}

              {/* スタート地点の装飾 */}
              <g>
                <text
                  x="80"
                  y="45"
                  textAnchor="middle"
                  className="text-sm font-bold"
                  fill="#67BACA"
                >
                  🚀 スタート
                </text>
              </g>

              {/* ゴール地点の装飾 */}
              <g>
                <text
                  x="80"
                  y="285"
                  textAnchor="middle"
                  className="text-sm font-bold"
                  fill="#67BACA"
                >
                  🎯 ゴール
                </text>
              </g>
            </svg>
          </div>
        </div>

        <div
          className="border-t p-4 rounded-b-lg"
          style={{ borderColor: "#E0E0E0", backgroundColor: "#F0F8FF" }}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium" style={{ color: "#333333" }}>
                全体進捗
              </span>
              <span className="font-bold" style={{ color: "#67BACA" }}>
                {Math.round(totalProgress)}%
              </span>
            </div>

            <div
              className="rounded-full h-2"
              style={{ backgroundColor: "#E0E0E0" }}
            >
              <div
                className="h-2 rounded-full transition-all duration-1000"
                style={{
                  width: `${totalProgress}%`,
                  backgroundColor: "#67BACA",
                }}
              ></div>
            </div>

            <div
              className="flex items-center justify-between text-xs"
              style={{ color: "#333333" }}
            >
              <span>2024年 - 2034年</span>
              <span>残り：{remainingTimeText}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full bg-white h-full flex flex-col border rounded-lg"
      style={{ borderColor: "#E0E0E0" }}
    >
      <div
        className="p-4 text-white rounded-t-lg"
        style={{ backgroundColor: "#67BACA" }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <div>
              <div className="font-bold text-lg">現在：{elapsedTimeText}</div>
            </div>
          </div>
          <button
            className="bg-white hover:bg-gray-100 px-3 py-1 rounded-lg font-medium text-sm transition-all"
            style={{ color: "#67BACA" }}
            onClick={() => setViewMode("year")}
          >
            全体マップ
          </button>
        </div>
      </div>

      <div
        className="p-4 border-b"
        style={{ backgroundColor: "#F0F8FF", borderColor: "#E0E0E0" }}
      >
        <div className="flex items-center justify-between">
          <button
            onClick={() => handleYearChange("prev")}
            disabled={selectedYear <= 2024}
            className="hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed p-2 rounded-lg bg-white border transition-all"
            style={{ borderColor: "#E0E0E0" }}
          >
            <ChevronUp className="w-4 h-4" style={{ color: "#333333" }} />
          </button>

          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" style={{ color: "#333333" }} />
            <span className="text-lg font-bold" style={{ color: "#333333" }}>
              {selectedYear}年度
            </span>
          </div>

          <button
            onClick={() => handleYearChange("next")}
            disabled={selectedYear >= 2034}
            className="hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed p-2 rounded-lg bg-white border transition-all"
            style={{ borderColor: "#E0E0E0" }}
          >
            <ChevronDown className="w-4 h-4" style={{ color: "#333333" }} />
          </button>
        </div>

        {selectedYear !== currentYear && (
          <div className="flex justify-center mt-3">
            <button
              onClick={() => setSelectedYear(currentYear)}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white font-medium transition-all text-sm hover:opacity-90"
              style={{ backgroundColor: "#67BACA" }}
            >
              <NavigationIcon className="w-4 h-4" />
              <span>現在位置へ</span>
            </button>
          </div>
        )}
      </div>

      <div
        className="flex-1 overflow-y-auto"
        style={{ backgroundColor: "#F8F9FA" }}
      >
        <div className="lg:flex lg:gap-4 p-2 lg:p-4">
          <div className="lg:w-1/3 lg:max-h-[500px] lg:overflow-y-auto">
            {[1, 2, 3, 4].map((quarter) => {
              const isCurrent = isCurrentPosition(selectedYear, quarter);
              const isComplete = isPassed(selectedYear, quarter);
              const currentAdvice = getAdviceForYear(selectedYear);
              const advice = currentAdvice[quarter];
              const quarterKey = `${selectedYear}-${quarter}`;
              const isExpanded = pinnedQuarter === quarterKey;

              return (
                <div key={quarter} className="relative">
                  {/* 四半期間の接続線 (モバイル用) */}
                  {quarter < 4 && (
                    <div
                      className="absolute left-8 top-20 w-0.5 h-4 z-0 lg:hidden"
                      style={{
                        backgroundColor: "#67BACA",
                        opacity: 0.3,
                      }}
                    />
                  )}

                  <div
                    className={`border-b cursor-pointer transition-all duration-300 hover:shadow-md relative z-10 mx-2 my-1 rounded-lg lg:mx-0`}
                    style={{
                      borderColor: "#E0E0E0",
                      backgroundColor: isExpanded
                        ? isCurrent
                          ? "#FDF6F6"
                          : isComplete
                          ? "#F5F5F5"
                          : "#FFFFFF"
                        : hoveredQuarter === quarterKey
                        ? isCurrent
                          ? "#FEF2F2"
                          : isComplete
                          ? "#F0F0F0"
                          : "#F8F8F8"
                        : isCurrent
                        ? "#FDF6F6"
                        : isComplete
                        ? "#F5F5F5"
                        : "#FFFFFF",
                      border: isCurrent
                        ? "2px solid #FE0000"
                        : `1px solid #E0E0E0`,
                      boxShadow: isCurrent
                        ? "0 0 15px rgba(254, 0, 0, 0.2)"
                        : "none",
                    }}
                    onMouseEnter={() => setHoveredQuarter(quarterKey)}
                    onMouseLeave={() => setHoveredQuarter(null)}
                    onClick={() => {
                      if (pinnedQuarter === quarterKey) {
                        setPinnedQuarter(null);
                      } else {
                        setPinnedQuarter(quarterKey);
                      }
                    }}
                  >
                    <div className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          {/* アイコンの背景装飾 */}
                          <div
                            className={`absolute inset-0 rounded-full opacity-20 ${
                              isCurrent ? "animate-pulse" : ""
                            }`}
                            style={{
                              backgroundColor: isCurrent
                                ? "#FE0000"
                                : isComplete
                                ? "#333333"
                                : "#67BACA",
                              transform: isCurrent
                                ? "scale(1.4)"
                                : "scale(1.2)",
                            }}
                          />

                          <div className="p-3 rounded-full bg-white relative z-10 shadow-sm">
                            <div className="w-5 h-5 flex items-center justify-center">
                              <span
                                className={`text-xs font-bold ${
                                  isCurrent ? "animate-pulse" : ""
                                }`}
                                style={{
                                  color: isCurrent
                                    ? "#FE0000"
                                    : isComplete
                                    ? "#333333"
                                    : "#67BACA",
                                  fontSize: isCurrent ? "0.8rem" : "0.75rem",
                                  fontWeight: isCurrent ? "900" : "700",
                                }}
                              >
                                {quarter}Q
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center space-x-2">
                                <span
                                  className="font-bold text-sm"
                                  style={{
                                    color: isCurrent ? "#FE0000" : "#333333",
                                  }}
                                >
                                  第{quarter}四半期
                                </span>
                                {isCurrent && (
                                  <span
                                    className="text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap animate-pulse"
                                    style={{
                                      backgroundColor: "#FDF6F6",
                                      color: "#FE0000",
                                      border: "1px solid #FE0000",
                                    }}
                                  >
                                    📍 イマココ
                                  </span>
                                )}
                                {isComplete && (
                                  <span
                                    className="text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap"
                                    style={{
                                      backgroundColor: "#F5F5F5",
                                      color: "#333333",
                                    }}
                                  >
                                    ✓ 完了
                                  </span>
                                )}
                              </div>
                              <div
                                className="text-sm mt-1 font-medium"
                                style={{
                                  color: isCurrent ? "#FE0000" : "#333333",
                                }}
                              >
                                {advice.title}
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <ChevronDown
                                className={`w-4 h-4 transition-transform duration-200 ${
                                  isExpanded ? "rotate-180" : ""
                                }`}
                                style={{
                                  color: isCurrent ? "#FE0000" : "#333333",
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 詳細情報パネル (モバイル用) */}
                  <div className="lg:hidden">
                    {isExpanded && (
                      <div
                        className="mx-2 mb-2 rounded-lg border shadow-sm"
                        style={{
                          borderColor: "#E0E0E0",
                          backgroundColor: isCurrent
                            ? "#FDF6F6"
                            : isComplete
                            ? "#F5F5F5"
                            : "#FFFFFF",
                        }}
                      >
                        <div className="p-3 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div
                                className="p-1 rounded-full"
                                style={{ backgroundColor: "#67BACA" }}
                              >
                                <MapPin className="w-3 h-3 text-white" />
                              </div>
                              <span
                                className="text-sm font-semibold"
                                style={{ color: "#333333" }}
                              >
                                {selectedYear}年 第{quarter}四半期
                              </span>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setPinnedQuarter(null);
                              }}
                              className="text-xs px-2 py-1 rounded-full bg-white border hover:bg-gray-50 transition-all shadow-sm"
                              style={{
                                borderColor: "#E0E0E0",
                                color: "#333333",
                              }}
                            >
                              ✕
                            </button>
                          </div>

                          <QuarterlyTaskDisplay
                            year={selectedYear}
                            quarter={quarter}
                            advice={advice}
                            checkedItems={checkedItems}
                            onCheckboxChange={handleCheckboxChange}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* 詳細情報パネル (PC用) */}
          <div className="hidden lg:block lg:w-2/3">
            {pinnedQuarter ? (
              (() => {
                const [yearStr, quarterStr] = pinnedQuarter.split("-");
                const year = parseInt(yearStr);
                const quarter = parseInt(quarterStr);
                const isCurrent = isCurrentPosition(year, quarter);
                const isComplete = isPassed(year, quarter);
                const advice = getAdviceForYear(year)[quarter];

                return (
                  <div
                    className="rounded-lg border shadow-sm sticky top-4"
                    style={{
                      borderColor: "#E0E0E0",
                      backgroundColor: isCurrent
                        ? "#FDF6F6"
                        : isComplete
                        ? "#F5F5F5"
                        : "#FFFFFF",
                    }}
                  >
                    <div className="p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div
                            className="p-1.5 rounded-full"
                            style={{ backgroundColor: "#67BACA" }}
                          >
                            <MapPin className="w-4 h-4 text-white" />
                          </div>
                          <span
                            className="text-base font-semibold"
                            style={{ color: "#333333" }}
                          >
                            {year}年 第{quarter}四半期
                          </span>
                        </div>
                        <button
                          onClick={() => setPinnedQuarter(null)}
                          className="text-sm px-3 py-1 rounded-full bg-white border hover:bg-gray-50 transition-all shadow-sm"
                          style={{
                            borderColor: "#E0E0E0",
                            color: "#333333",
                          }}
                        >
                          ✕ 閉じる
                        </button>
                      </div>

                      <QuarterlyTaskDisplay
                        year={year}
                        quarter={quarter}
                        advice={advice}
                        checkedItems={checkedItems}
                        onCheckboxChange={handleCheckboxChange}
                      />
                    </div>
                  </div>
                );
              })()
            ) : (
              <div className="hidden lg:flex items-center justify-center h-full bg-gray-50 rounded-lg border-2 border-dashed">
                <div className="text-center text-gray-500">
                  <MapPin className="mx-auto h-12 w-12" />
                  <p className="mt-2 text-lg font-medium">
                    詳細を表示する四半期を選択してください
                  </p>
                  <p className="mt-1 text-sm">
                    左のリストから項目をクリックすると、ここに詳細が表示されます。
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        className="border-t p-4 rounded-b-lg"
        style={{ borderColor: "#E0E0E0", backgroundColor: "#F0F8FF" }}
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium" style={{ color: "#333333" }}>
              全体進捗
            </span>
            <span className="font-bold" style={{ color: "#67BACA" }}>
              {Math.round(totalProgress)}%
            </span>
          </div>

          <div
            className="rounded-full h-2"
            style={{ backgroundColor: "#E0E0E0" }}
          >
            <div
              className="h-2 rounded-full transition-all duration-1000"
              style={{ width: `${totalProgress}%`, backgroundColor: "#67BACA" }}
            ></div>
          </div>

          <div
            className="flex items-center justify-between text-xs"
            style={{ color: "#333333" }}
          >
            <span>2024年 - 2034年</span>
            <span>残り：{remainingTimeText}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
