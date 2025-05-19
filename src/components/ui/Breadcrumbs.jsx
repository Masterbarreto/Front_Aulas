import { Link, useLocation } from "react-router-dom";

export default function Breadcrumbs() {
  const { pathname } = useLocation();
  const parts = pathname.split("/").filter(Boolean);

  return (
    <nav className="breadcrumbs">
      <Link to="/home">Início</Link>
      {parts.map((part, idx) => {
        const to = "/" + parts.slice(0, idx + 1).join("/");
        return (
          <span key={to}>
            {" / "}
            <Link to={to}>{part}</Link>
          </span>
        );
      })}
    </nav>
  );
}