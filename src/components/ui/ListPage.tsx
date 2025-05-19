import React from "react";
import { useNavigate } from "react-router-dom";
import { Hub } from "../ui/hub";
import Breadcrumbs from "../ui/Breadcrumbs";

export default function ListPage({ title, items, itemLink, loading, emptyMessage }) {
  const navigate = useNavigate();

  if (loading) return <div>Carregando...</div>;
  if (!items?.length) return <div>{emptyMessage || "Nenhum item encontrado."}</div>;

  return (
    <div className="home-container">
      <Hub />
      <div className="container-título">
        <Breadcrumbs />
        <h1>{title}</h1>
        <div className="courses-container">
          {items.map(item => (
            <div
              key={item.id}
              className="course-card"
              onClick={() => navigate(itemLink(item))}
              tabIndex={0}
            >
              {item.image && (
                <img src={item.image} alt={item.name} style={{ width: 60, height: 60 }} />
              )}
              <span>{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}