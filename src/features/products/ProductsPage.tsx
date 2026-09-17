import { useState } from "react";
import "./ProductsPage.css";
import type { FormEvent } from "react";
import { Plus, SlidersHorizontal } from "lucide-react";
import api from "@/api";
import { usePage } from "@/hooks/useRequest";
import { date, money } from "@/lib/presentation";
import {
  Drawer,
  Empty,
  FilterBar,
  PageTitle,
  Pagination,
  State,
  TagPill,
  Toast,
} from "@/components/ui";
import type { Product } from "@/types";

/** 商品模块独立维护筛选、分页和业务动作；通用 UI 组件不感知商品字段。 */
export function ProductsPage({ canEdit }: { canEdit: boolean }) {
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("");
  const [drawer, setDrawer] = useState<Product | "new" | null>(null);
  const [message, setMessage] = useState("");
  const list = usePage<Product>("/products", {
    page,
    pageSize: 10,
    _sort: "sales",
    _order: "desc",
    ...(keyword ? { name_like: keyword } : {}),
    ...(status ? { status } : {}),
  });
  async function changeStatus(product: Product) {
    const next = product.status === "on_sale" ? "off-shelf" : "publish";
    if (
      !confirm(
        `确认${next === "publish" ? "上架" : "下架"}「${product.name}」吗？`,
      )
    )
      return;
    try {
      await api.post(`/products/${product.id}/${next}`);
      setMessage(next === "publish" ? "商品已上架" : "商品已下架");
      list.reload();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "操作失败");
    }
  }
  return (
    <>
      <PageTitle
        title="商品管理"
        description={`管理在售商品、库存与 SKU。${list.meta ? ` 当前共 ${list.meta.total} 件商品` : ""}`}
        action={
          canEdit ? (
            <button className="primary" onClick={() => setDrawer("new")}>
              <Plus size={16} />
              新建商品
            </button>
          ) : undefined
        }
      />
      {message && <Toast message={message} onClose={() => setMessage("")} />}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setPage(1);
          list.reload();
        }}
        className="card"
      >
        <FilterBar
          onReset={() => {
            setKeyword("");
            setStatus("");
            setPage(1);
          }}
        >
          <label>
            商品名称
            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="请输入商品名称"
            />
          </label>
          <label>
            销售状态
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option value="">全部状态</option>
              <option value="on_sale">销售中</option>
              <option value="off_sale">已下架</option>
              <option value="draft">草稿</option>
            </select>
          </label>
        </FilterBar>
      </form>
      <section className="card table-card">
        <State loading={list.loading} error={list.error}>
          {list.items.length ? (
            <table>
              <thead>
                <tr>
                  <th>商品</th>
                  <th>品牌</th>
                  <th className="align-right">售价</th>
                  <th className="align-right">库存</th>
                  <th className="align-right">销量</th>
                  <th>状态</th>
                  <th>更新时间</th>
                  <th className="operations">操作</th>
                </tr>
              </thead>
              <tbody>
                {list.items.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div className="product-cell">
                        <img src={product.cover} />
                        <div>
                          <b>{product.name}</b>
                          <small>{product.subtitle}</small>
                        </div>
                      </div>
                    </td>
                    <td>{product.brand}</td>
                    <td className="align-right money">
                      {money(product.price)}
                    </td>
                    <td className="align-right">{product.stock}</td>
                    <td className="align-right">{product.sales}</td>
                    <td>
                      <TagPill value={product.status} />
                    </td>
                    <td>{date(product.updatedAt)}</td>
                    <td className="operations">
                      <button
                        className="link-button"
                        onClick={() => setDrawer(product)}
                      >
                        编辑
                      </button>
                      {canEdit && (
                        <button
                          className="link-button"
                          onClick={() => changeStatus(product)}
                        >
                          {product.status === "on_sale" ? "下架" : "上架"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <Empty
              onReset={() => {
                setKeyword("");
                setStatus("");
              }}
            />
          )}
        </State>
        <Pagination meta={list.meta} page={page} setPage={setPage} />
      </section>
      {drawer && (
        <ProductDrawer
          product={drawer}
          onClose={() => setDrawer(null)}
          onSaved={() => {
            setDrawer(null);
            list.reload();
            setMessage("商品已保存");
          }}
        />
      )}
    </>
  );
}

function ProductDrawer({
  product,
  onClose,
  onSaved,
}: {
  product: Product | "new";
  onClose: () => void;
  onSaved: () => void;
}) {
  const editing = product !== "new";
  const [submitting, setSubmitting] = useState(false);
  const [publish, setPublish] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      name: form.get("name"),
      subtitle: form.get("subtitle"),
      brand: form.get("brand"),
      categoryId: form.get("categoryId"),
      price: Number(form.get("price")),
      originalPrice: Number(form.get("originalPrice")),
      stock: Number(form.get("stock")),
      cover: form.get("cover"),
      images: [form.get("cover")],
      status: editing ? (product as Product).status : "draft",
      sales: editing ? (product as Product).sales : 0,
      skus: editing ? (product as Product).skus : [],
    };
    setSubmitting(true);
    try {
      const saved: any = editing
        ? await api.patch(`/products/${(product as Product).id}`, payload)
        : await api.post("/products", payload);
      if (publish) await api.post(`/products/${saved.data.id}/publish`);
      onSaved();
    } catch (error) {
      alert(error instanceof Error ? error.message : "保存失败");
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <Drawer title={editing ? "编辑商品" : "新建商品"} onClose={onClose}>
      <form className="drawer-form" onSubmit={submit}>
        <h4>基础信息</h4>
        <label>
          商品名称 <i>*</i>
          <input
            name="name"
            defaultValue={editing ? product.name : ""}
            required
          />
        </label>
        <label>
          商品卖点
          <input
            name="subtitle"
            defaultValue={editing ? product.subtitle : ""}
          />
        </label>
        <div className="form-grid">
          <label>
            品牌
            <input
              name="brand"
              defaultValue={editing ? product.brand : ""}
              required
            />
          </label>
          <label>
            分类 ID
            <input
              name="categoryId"
              defaultValue={editing ? product.categoryId : "cat_1"}
              required
            />
          </label>
        </div>
        <label>
          主图 URL
          <input
            name="cover"
            type="url"
            defaultValue={
              editing
                ? product.cover
                : "https://picsum.photos/seed/new-product/240/240"
            }
            required
          />
        </label>
        <h4>销售信息</h4>
        <div className="form-grid three">
          <label>
            售价 <i>*</i>
            <input
              name="price"
              type="number"
              min="0"
              step="0.01"
              defaultValue={editing ? product.price : ""}
              required
            />
          </label>
          <label>
            划线价
            <input
              name="originalPrice"
              type="number"
              min="0"
              step="0.01"
              defaultValue={editing ? product.originalPrice : ""}
              required
            />
          </label>
          <label>
            库存 <i>*</i>
            <input
              name="stock"
              type="number"
              min="0"
              defaultValue={editing ? product.stock : ""}
              required
            />
          </label>
        </div>
        <div className="sku-note">
          <SlidersHorizontal size={16} />
          <div>
            <b>SKU 组合</b>
            <span>
              生产项目可在此接入规格组合生成器；本项目保留接口已有 skus 字段。
            </span>
          </div>
        </div>
        <div className="drawer-footer">
          <button type="button" className="secondary" onClick={onClose}>
            取消
          </button>
          <button
            type="submit"
            className="secondary"
            disabled={submitting}
            onClick={() => setPublish(false)}
          >
            保存草稿
          </button>
          {!editing && (
            <button
              type="submit"
              className="primary"
              disabled={submitting}
              onClick={() => setPublish(true)}
            >
              {submitting ? "提交中…" : "保存并上架"}
            </button>
          )}
        </div>
      </form>
    </Drawer>
  );
}
