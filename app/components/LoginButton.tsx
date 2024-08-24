import React from "react";

const handleLogin = () => {
  // サーバーのエンドポイントにリダイレクトすることで、Twitch認証ページに飛ぶ
  window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/twitch`;
};

const LoginButton: React.FC = () => (
  <button className="btn btn-secondary" onClick={handleLogin}>
    ログイン
  </button>
);

export default LoginButton;