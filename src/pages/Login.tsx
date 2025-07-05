import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import type { CredentialResponse } from "@react-oauth/google";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

// デモユーザーデータ
const DEMO_USERS = [
  {
    email: "normalUser1@example.com",
    password: "normalUser1Pass",
    userId: "normal-user-001",
    settingFlg: "1", // 設定完了済み
    role: "0", // 一般ユーザー
  },
  {
    email: "normalUser2@example.com",
    password: "normalUser2Pass",
    userId: "normal-user-002",
    settingFlg: "0", // 未設定
    role: "0", // 一般ユーザー
  },
  {
    email: "taxUser@example.com",
    password: "taxUserPass",
    userId: "tax-user-001",
    settingFlg: "1", // 設定完了済み
    role: "1", // 税理士ユーザー
  },
];

const Login: React.FC = () => {
  const { user, isLoading, login, loginWithGoogleCredential } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoginMode, setIsLoginMode] = useState(true);

  // すでにログイン済みの場合はリダイレクト
  if (user && !isLoading) {
    return <Navigate to={user.isSetupComplete ? "/" : "/setup"} replace />;
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // 新規登録の場合はパスワード確認をチェック
    if (!isLoginMode) {
      if (password !== confirmPassword) {
        setError("パスワードが一致しません");
        return;
      }
    }

    try {
      if (isLoginMode) {
        // デモログイン処理
        console.log("デモログイン試行:", { email, password });

        // デモ用の遅延
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // デモユーザーをチェック
        const demoUser = DEMO_USERS.find(
          (user) => user.email === email && user.password === password
        );

        if (demoUser) {
          console.log("デモログイン成功:", demoUser);

          await login(
            email,
            password,
            demoUser.userId,
            demoUser.settingFlg,
            demoUser.role
          );
        } else {
          // 指定されたデモユーザー以外はログイン不可
          throw new Error("メールアドレスまたはパスワードが正しくありません");
        }
      } else {
        // デモモードでは新規登録は無効
        throw new Error("デモモードでは新規登録はご利用いただけません");
      }
    } catch (err) {
      console.error("デモ認証エラー:", err);
      setError(
        err instanceof Error
          ? err.message
          : isLoginMode
          ? "ログインに失敗しました"
          : "新規登録に失敗しました"
      );
    }
  };

  /** ログイン成功時の処理 */
  const handleLoginSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      setError("認証情報が取得できませんでした");
      return;
    }

    try {
      // JWT をデコードしてユーザー情報を取得
      const decoded: any = jwtDecode(credentialResponse.credential);
      console.log("Google認証成功:", decoded);
      const googleId = decoded.sub;

      // デモ用の遅延
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // デモ用のGoogle認証処理（常に成功）
      console.log("デモGoogle認証処理");

      // デモ用のユーザーID生成
      const userId = `google-user-${googleId}`;

      // 既存ユーザーかどうかのデモ判定
      const isExistingUser = Math.random() > 0.5; // 50%の確率で既存ユーザー
      const settingFlg = isExistingUser ? "1" : "0";

      console.log("デモGoogleログイン成功", {
        userId,
        settingFlg,
        isExistingUser,
      });

      loginWithGoogleCredential(
        credentialResponse.credential,
        settingFlg,
        userId,
        "0" // 一般ユーザー
      );
    } catch (err) {
      console.error("Google認証の処理に失敗:", err);
      setError("Google認証の処理に失敗しました");
    }
  };

  /** ログイン失敗時の処理 */
  const handleLoginError = () => {
    console.log("ログインに失敗しました");
    setError("Googleログインに失敗しました");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/5 px-4">
      <div className="max-w-md w-full space-y-8">
        {/* ロゴとタイトル */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 flex items-center justify-center mb-6">
            <div
              className="w-full h-full bg-contain bg-no-repeat bg-center"
              style={{ backgroundImage: "url(/mietoru_favicon.svg)" }}
              role="img"
              aria-label="ミエトル"
            />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">ミエトル</h2>
          <p className="mt-2 text-sm text-gray-600">
            経営が見える、成長が実感できる (デモモード)
          </p>
        </div>

        {/* デモログイン情報 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">
            デモログイン情報
          </h3>
          <div className="text-xs text-blue-700 space-y-1">
            <div>
              <strong>一般ユーザー（設定済み）:</strong> normalUser1@example.com
              / normalUser1Pass
            </div>
            <div>
              <strong>一般ユーザー（未設定）:</strong> normalUser2@example.com /
              normalUser2Pass
            </div>
            <div>
              <strong>税理士ユーザー:</strong> taxUser@example.com / taxUserPass
            </div>
          </div>
        </div>

        {/* ログインフォーム */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="space-y-6">
            {/* タブ切り替え */}
            <div className="flex rounded-lg bg-gray-100 p-1">
              <button
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  isLoginMode
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => {
                  setIsLoginMode(true);
                  setError("");
                }}
              >
                ログイン
              </button>
              <button
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  !isLoginMode
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => {
                  setIsLoginMode(false);
                  setError("");
                }}
              >
                新規登録
              </button>
            </div>

            {/* Google認証ボタン */}
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleLoginSuccess}
                onError={handleLoginError}
                text={isLoginMode ? "signin_with" : "signup_with"}
              />
            </div>

            {/* 区切り線 */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">または</span>
              </div>
            </div>

            {/* エラーメッセージ */}
            {error && (
              <div className="text-center text-sm text-red-500">{error}</div>
            )}

            {/* メールログインフォーム */}
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  メールアドレス
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                  placeholder="example@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  パスワード
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={
                    isLoginMode ? "current-password" : "new-password"
                  }
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                  placeholder="パスワードを入力"
                />
              </div>

              {/* パスワード確認用（新規登録の場合のみ表示） */}
              {!isLoginMode && (
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    パスワード（確認用）
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                    placeholder="パスワードを再入力"
                  />
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                >
                  {isLoading
                    ? isLoginMode
                      ? "ログイン中..."
                      : "新規登録中..."
                    : isLoginMode
                    ? "ログイン"
                    : "新規登録"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
