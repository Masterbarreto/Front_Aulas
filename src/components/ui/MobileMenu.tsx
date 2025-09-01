import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, LayoutDashboard, ArrowUpToLine, SquareLibrary, Building2, Users, Power } from "lucide-react";
import "../../Styles/MobileMenu.css";

export function MobileMenu() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cargo, setCargo] = useState<string | null>(null);

  useEffect(() => {
    // Tentar ler o cargo do usuário do localStorage
    const storedCargo = localStorage.getItem("cargo");
    if (storedCargo) {
      setCargo(storedCargo);
    } else {
      // Se não houver cargo no localStorage, definir como "Professor"
      localStorage.setItem("cargo", "Professor");
      setCargo("Professor");
    }
  }, []);

  // Verifica se o usuário é admin ou Professor
  const isPrivileged = cargo === "admin" || cargo === "Professor";

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Botão do menu mobile */}
      <button className="mobile-menu-button-inline" onClick={toggleMobileMenu}>
        <Menu size={18} />
      </button>

      {/* Overlay e Menu mobile */}
      {isMobileMenuOpen && (
        <>
          <div className="mobile-menu-overlay" onClick={closeMobileMenu}></div>
          <div className="mobile-menu-content active" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-menu-header">
              <button className="mobile-menu-close" onClick={closeMobileMenu}>
                <X size={24} />
              </button>
            </div>
            
            {/* Hub Mobile com estrutura simplificada e permissões */}
            <div className="hub-mobile-content">
              <div className="mobile-hub-section">
                {/* Dashboard: apenas admin ou Professor */}
                {isPrivileged && (
                  <div className="mobile-hub-item" onClick={() => { navigate("/home"); closeMobileMenu(); }}>
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                  </div>
                )}

                {/* Upload e Gerenciar: apenas admin */}
                {cargo === "admin" && (
                  <>
                    <div className="mobile-hub-item" onClick={() => { navigate("/upload"); closeMobileMenu(); }}>
                      <ArrowUpToLine size={20} />
                      <span>Upload de Atividades</span>
                    </div>
                    <div className="mobile-hub-item" onClick={() => { navigate("/editar-aula"); closeMobileMenu(); }}>
                      <SquareLibrary size={20} />
                      <span>Gerenciar Atividades</span>
                    </div>
                  </>
                )}

                {/* Relatório: apenas admin ou Professor */}
                {isPrivileged && (
                  <div className="mobile-hub-item" onClick={() => { navigate("/relatorio-aulas"); closeMobileMenu(); }}>
                    <Building2 size={20} />
                    <span>Relatório de Aulas</span>
                  </div>
                )}
              </div>
              
              <div className="mobile-hub-section">
                {/* Configurações e Sair: apenas para usuários logados */}
                {cargo && (
                  <>
                    {cargo !== "admin" && (
                      <div className="mobile-hub-item" onClick={() => { navigate("/login"); closeMobileMenu(); }}>
                        <Users size={20} />
                        <span>Login Administrativo</span>
                      </div>
                    )}
                    <div className="mobile-hub-item" onClick={() => { 
                      try {
                        localStorage.clear();
                        setCargo("Professor");
                        navigate("/");
                        closeMobileMenu();
                      } catch (error) {
                        console.error("Erro ao tentar sair:", error);
                      }
                    }}>
                      <Power size={20} />
                      <span>Sair</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
