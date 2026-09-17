import { Compass, House, Undo2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import "./NotFoundPage.css";

/**
 * 前端 404：BrowserRouter 已经成功加载应用，但当前 URL 没有匹配的页面路由。
 * 它不是 API 404，也不是服务器直接返回的 HTTP 404；三者需要分别处理。
 */
export function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <section className="not-found-page" aria-labelledby="not-found-title">
      <div className="not-found-icon">
        <Compass size={34} />
      </div>
      <span className="not-found-code">404</span>
      <h1 id="not-found-title">页面未找到</h1>
      <p>这个地址可能已失效、被移动，或输入有误。</p>
      <div className="not-found-actions">
        <Link className="primary" to="/dashboard">
          <House size={16} />
          返回仪表盘
        </Link>
        <button className="secondary" onClick={() => navigate(-1)}>
          <Undo2 size={16} />
          返回上一页
        </button>
      </div>
    </section>
  );
}
