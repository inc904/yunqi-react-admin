import { useState } from "react";
import "./Login.css";
import type { FormEvent } from "react";
import { Zap } from "lucide-react";
import api from "@/api";
import type { Auth } from "@/types";

/** 登录功能独立于应用壳：表单仅负责提交、保存身份状态并通知父组件切换页面。 */
export function Login({ onLogin }: { onLogin: (auth: Auth) => void }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    const form = new FormData(event.currentTarget);
    try {
      const result: any = await api.post("/auth/login", {
        username: form.get("username"),
        password: form.get("password"),
      });
      const auth = result.data as Auth;
      localStorage.setItem("yunqi-token", auth.token);
      localStorage.setItem("yunqi-auth", JSON.stringify(auth));
      onLogin(auth);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "登录失败");
    } finally {
      setLoading(false);
    }
  }
  return (
    <main className="login-page">
      <section className="login-aside">
        <div className="brand">
          <span className="brand-mark">
            <Zap size={22} fill="currentColor" />
          </span>
          <b>云栖商城</b>
          <span>运营台</span>
        </div>
        <div className="login-copy">
          <span className="eyebrow">OPERATIONS CONSOLE</span>
          <h1>
            让每一份运营决策
            <br />
            都有数据支撑。
          </h1>
          <p>商品、订单、会员与活动，一处高效协同。</p>
        </div>
        <div className="login-orbs" />
      </section>
      <section className="login-form-wrap">
        <form className="login-form" onSubmit={submit}>
          <span className="eyebrow">WELCOME BACK</span>
          <h2>登录运营台</h2>
          <p>使用演示账号快速体验完整的业务流程。</p>
          <label>
            账号
            <input name="username" defaultValue="admin" required />
          </label>
          <label>
            密码
            <input
              name="password"
              type="password"
              defaultValue="123456"
              required
            />
          </label>
          {message && <div className="error-banner">{message}</div>}
          <button className="primary full" disabled={loading}>
            {loading ? "登录中…" : "登录"}
          </button>
          <div className="demo-tip">
            <b>演示账号</b>
            <span>
              管理员：admin / 123456
              <br />
              运营人员：operator / 123456
            </span>
          </div>
        </form>
      </section>
    </main>
  );
}
