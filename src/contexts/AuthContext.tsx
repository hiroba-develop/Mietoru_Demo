import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { AuthUser, InitialSetup, PriorityGoal } from "../types";
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
  user: AuthUser | null;
  userSetup: InitialSetup | null;
  isLoading: boolean;
  shouldRedirectToLogin: boolean;
  shouldRedirectToSetup: boolean;
  login: (
    email: string,
    password: string,
    userId?: string,
    settingFlg?: string,
    role?: string
  ) => Promise<void>;
  loginWithGoogleCredential: (
    credential: string,
    settingFlg?: string,
    userId?: string,
    role?: string
  ) => void;
  completeSetup: (setupData: InitialSetup) => void;
  updateUserSetup: (setupData: Partial<InitialSetup>) => void;
  loadUserSetup: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// デモ用の設定データ
const DEMO_USER_SETTINGS = {
  name: "デモユーザー",
  company: "デモ株式会社",
  telNo: "03-1234-5678",
  companySize: 2, // 法人（従業員1-5名）
  industry: 1, // IT・ソフトウェア
  fiscalYearStartYear: 2023,
  fiscalYearStartMonth: 4,
  totalAssets: 5000000, // 500万円
  businessExperience: 2, // 1-3年
  financialKnowledge: 2, // 基本レベル
};

// cookieを操作するためのユーティリティ関数
const setCookie = (name: string, value: string, days: number = 7) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
};

const getCookie = (name: string): string | null => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

const deleteCookie = (name: string) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Strict`;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [userSetup, setUserSetup] = useState<InitialSetup | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [shouldRedirectToLogin, setShouldRedirectToLogin] = useState(false);
  const [shouldRedirectToSetup, setShouldRedirectToSetup] = useState(false);

  useEffect(() => {
    // 保存された認証状態を復元
    const userId = getCookie("userId");
    const settingFlg = getCookie("settingFlg");

    // cookieに必要な情報がない場合は、必ずlogin画面に遷移
    if (!userId || !settingFlg) {
      setShouldRedirectToLogin(true);
      setIsLoading(false);
      return;
    }

    try {
      console.log("AuthContext: デモ認証状態復元", {
        settingFlg: settingFlg,
        settingFlgType: typeof settingFlg,
        userId: userId,
      });

      // ユーザー情報を設定
      const isSetupComplete = settingFlg === "1";
      const userToSet: AuthUser = {
        id: userId,
        email: "demo@example.com", // デフォルト値
        name: "デモユーザー", // デフォルト値
        isSetupComplete: isSetupComplete,
        createdAt: new Date(),
        lastLogin: new Date(),
      };

      setUser(userToSet);

      // cookieの「settingFlg」が"0"の場合は必ずセットアップ画面に遷移
      if (settingFlg === "0") {
        console.log(
          "AuthContext: settingFlgが'0'のため、セットアップ画面にリダイレクト"
        );
        setShouldRedirectToSetup(true);
      } else {
        console.log("AuthContext: settingFlgが'0'ではない", {
          settingFlg: settingFlg,
        });
      }
    } catch (err) {
      console.error("保存された認証情報の復元に失敗:", err);
      // エラー時はcookieをクリア
      deleteCookie("userId");
      deleteCookie("settingFlg");
      deleteCookie("role");
      setShouldRedirectToLogin(true);
    }

    setIsLoading(false);
  }, []);

  const login = async (
    email: string,
    _password: string,
    userId?: string,
    settingFlg?: string,
    role?: string
  ): Promise<void> => {
    setIsLoading(true);
    try {
      // userIdが必須パラメータとして提供されている必要がある
      if (!userId) {
        throw new Error("ユーザーIDが提供されていません");
      }

      // settingFlgに基づいてisSetupCompleteを決定
      const isSetupComplete = settingFlg === "1";

      const demoUser: AuthUser = {
        id: userId,
        email: email,
        name: "デモユーザー",
        isSetupComplete: isSetupComplete,
        createdAt: new Date(),
        lastLogin: new Date(),
      };

      setUser(demoUser);
      setShouldRedirectToLogin(false);
      setShouldRedirectToSetup(false);

      // 必要な情報をcookieに保存
      if (userId) {
        setCookie("userId", userId);
        setCookie("settingFlg", settingFlg || "0");
        if (role) {
          setCookie("role", role);
        }
      }
    } catch (error) {
      throw new Error("ログインに失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Google OAuth Credential (JWT) を直接処理してログインする。
   * @param credential Google ID Credential JWT
   * @param settingFlg 設定フラグ（1:設定済み、0:未設定）
   * @param userId ユーザーID
   * @param role ユーザーロール
   */
  const loginWithGoogleCredential = (
    credential: string,
    settingFlg?: string,
    userId?: string,
    role?: string
  ): void => {
    try {
      const decoded: any = jwtDecode(credential);

      // userIdを取得、なければGoogleのsubを使用
      const userIdToUse = userId || decoded.sub;

      // settingFlgに基づいてisSetupCompleteを決定
      const isSetupComplete = settingFlg === "1";

      const googleUser: AuthUser = {
        id: userIdToUse,
        email: decoded.email,
        name: decoded.name,
        avatar: decoded.picture,
        isSetupComplete: isSetupComplete,
        createdAt: new Date(),
        lastLogin: new Date(),
      };

      setUser(googleUser);
      setShouldRedirectToLogin(false);
      setShouldRedirectToSetup(false);

      // userId、settingFlgをcookieに保存
      setCookie("userId", userIdToUse);
      setCookie("settingFlg", settingFlg || "0");
      if (role) {
        setCookie("role", role);
      }
    } catch (error) {
      console.error("Google Credential の処理に失敗:", error);
      throw new Error("Googleログインに失敗しました");
    }
  };

  const completeSetup = (setupData: InitialSetup) => {
    if (user) {
      setUser({ ...user, isSetupComplete: true });
      setUserSetup(setupData);
      setShouldRedirectToSetup(false);

      // cookieのsettingFlgも更新
      setCookie("settingFlg", "1");
    }
  };

  const updateUserSetup = (setupData: Partial<InitialSetup>) => {
    if (userSetup) {
      const updatedSetup = { ...userSetup, ...setupData };
      setUserSetup(updatedSetup);
    }
  };

  const loadUserSetup = async () => {
    if (!user) return;

    try {
      console.log("デモ用設定データを読み込み中...");

      // デモ用の遅延
      await new Promise((resolve) => setTimeout(resolve, 500));

      // デモ設定データをInitialSetup形式に変換
      const setupData: InitialSetup = {
        userName: DEMO_USER_SETTINGS.name,
        companyName: DEMO_USER_SETTINGS.company,
        phoneNumber: DEMO_USER_SETTINGS.telNo,
        currentAssets: DEMO_USER_SETTINGS.totalAssets,
        companySize: getCompanySizeString(DEMO_USER_SETTINGS.companySize),
        fiscalYearStartMonth: DEMO_USER_SETTINGS.fiscalYearStartMonth,
        fiscalYearStartYear: DEMO_USER_SETTINGS.fiscalYearStartYear,
        industry: getIndustryString(DEMO_USER_SETTINGS.industry),
        businessExperience: getBusinessExperienceString(
          DEMO_USER_SETTINGS.businessExperience
        ),
        financialKnowledge: getFinancialKnowledgeString(
          DEMO_USER_SETTINGS.financialKnowledge
        ),
        priorityGoals: [
          "事業の売上を安定させる" as PriorityGoal,
          "経費を効率的に管理する" as PriorityGoal,
          "税務処理を適切に行う" as PriorityGoal,
        ],
        longTermGoal: {
          targetYear: new Date().getFullYear() + 10,
          targetNetWorth: 50000000,
          description: "10年で純資産5000万円を達成する",
        },
      };

      console.log("デモ設定データ読み込み完了:", setupData);
      setUserSetup(setupData);
    } catch (error) {
      console.error("デモユーザー設定の読み込みに失敗:", error);
    }
  };

  // APIの数値を文字列に変換するヘルパー関数
  const getCompanySizeString = (
    size?: number
  ):
    | "個人事業主"
    | "法人（従業員1-5名）"
    | "法人（従業員6-20名）"
    | "法人（従業員21名以上）" => {
    switch (size) {
      case 1:
        return "個人事業主";
      case 2:
        return "法人（従業員1-5名）";
      case 3:
        return "法人（従業員6-20名）";
      case 4:
        return "法人（従業員21名以上）";
      default:
        return "個人事業主";
    }
  };

  const getIndustryString = (
    industry?: number
  ):
    | "IT・ソフトウェア"
    | "製造業"
    | "小売業"
    | "飲食業"
    | "サービス業"
    | "建設業"
    | "医療・福祉"
    | "教育"
    | "金融・保険"
    | "不動産"
    | "その他" => {
    switch (industry) {
      case 1:
        return "IT・ソフトウェア";
      case 2:
        return "製造業";
      case 3:
        return "小売業";
      case 4:
        return "飲食業";
      case 5:
        return "サービス業";
      case 6:
        return "建設業";
      case 7:
        return "医療・福祉";
      case 8:
        return "教育";
      case 9:
        return "金融・保険";
      case 10:
        return "不動産";
      case 11:
        return "その他";
      default:
        return "IT・ソフトウェア";
    }
  };

  const getBusinessExperienceString = (
    experience?: number
  ): "1年未満" | "1-3年" | "3-5年" | "5-10年" | "10年以上" => {
    switch (experience) {
      case 1:
        return "1年未満";
      case 2:
        return "1-3年";
      case 3:
        return "3-5年";
      case 4:
        return "5-10年";
      case 5:
        return "10年以上";
      default:
        return "1年未満";
    }
  };

  const getFinancialKnowledgeString = (
    knowledge?: number
  ): "初心者" | "基本レベル" | "中級レベル" | "上級レベル" => {
    switch (knowledge) {
      case 1:
        return "初心者";
      case 2:
        return "基本レベル";
      case 3:
        return "中級レベル";
      case 4:
        return "上級レベル";
      default:
        return "初心者";
    }
  };

  const logout = () => {
    setUser(null);
    setUserSetup(null);
    setShouldRedirectToLogin(false);
    setShouldRedirectToSetup(false);
    // 認証関連データを削除
    deleteCookie("userId");
    deleteCookie("settingFlg");
    deleteCookie("role");
  };

  const value: AuthContextType = {
    user,
    userSetup,
    isLoading,
    shouldRedirectToLogin,
    shouldRedirectToSetup,
    login,
    loginWithGoogleCredential,
    completeSetup,
    updateUserSetup,
    loadUserSetup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
