import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import '../../Styles/LinkModal.css';


interface LinkItem {
  id: string;
  url: string;
  name: string;
}

interface LinkModalProps {
  onLinksChange?: (links: LinkItem[]) => void;
}

export const LinkModal = forwardRef(({ onLinksChange }: LinkModalProps, ref) => {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [currentLink, setCurrentLink] = useState('');
  const [currentName, setCurrentName] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Expose a reset function to the parent component
  useImperativeHandle(ref, () => ({
    resetLinks: () => {
      setLinks([]);
      if (onLinksChange) {
        onLinksChange([]);
      }
    },
  }));

  const handleAddLink = () => {
    if (!currentLink.trim() || !currentName.trim()) {
      alert('Por favor, preencha tanto o link quanto o nome alternativo');
      return;
    }

    const newLink: LinkItem = {
      id: Date.now().toString(),
      url: currentLink.trim(),
      name: currentName.trim(),
    };

    const updatedLinks = [...links, newLink];
    setLinks(updatedLinks);

    setCurrentLink('');
    setCurrentName('');

    if (onLinksChange) {
      onLinksChange(updatedLinks);
    }

    setIsOpen(false);
  };

  const handleRemoveLink = (linkId: string) => {
    const updatedLinks = links.filter((link) => link.id !== linkId);
    setLinks(updatedLinks);

    if (onLinksChange) {
      onLinksChange(updatedLinks);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddLink();
    }
  };

  const handleStructuredLinksChange = (newLinks: LinkItem[]) => {
    setLinks(newLinks);
    // Converte para o formato que a API espera (URLs e nomes alternativos)
    const linkData = newLinks.map(link => ({ url: link.url, name: link.name }));
    setLinks(linkData); // Atualiza o estado com o formato correto
};

  return (
    <div className="link-modal-container">
      <button
        type="button"
        className="input-button"
        onClick={() => setIsOpen(true)}
      >
        <Plus size={16} />
        Adicionar Link
      </button>

      {isOpen && (
        <div className="dialog-overlay" onClick={handleClose}>
          <div
            className="dialog-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h2 style={{ color: '#fff', fontSize: '18px' }}>
                Cadastrar Link
              </h2>
              <button
                type="button"
                onClick={handleClose}
                style={{ background: 'none', border: 'none', color: '#a1a1aa' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ marginTop: '16px' }}>
              <label style={{ color: '#d4d4d8', marginBottom: '8px' }}>
                Nome:
              </label>
              <input
                type="text"
                value={currentName}
                onChange={(e) => setCurrentName(e.target.value)}
                onKeyPress={handleKeyPress}
                className="form-input"
                placeholder="Ex: Exercício"
              />
            </div>

            <div style={{ marginTop: '16px' }}>
              <label style={{ color: '#d4d4d8', marginBottom: '8px' }}>
                Link:
              </label>
              <input
                type="url"
                value={currentLink}
                onChange={(e) => setCurrentLink(e.target.value)}
                onKeyPress={handleKeyPress}
                className="form-input"
                placeholder="https://exemplo.com"
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button
                type="button"
                onClick={handleClose}
                className="button-secondary"
              >
                Fechar
              </button>
              <button
                type="button"
                onClick={handleAddLink}
                className="button-primary"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {links.length > 0 && (
        <div>
          {links.map((link) => (
            <div key={link.id} className="link-item">
              <div>
                <p style={{ color: '#fff', margin: 0 }}>{link.name}</p>
                <p style={{ color: '#888', margin: 0 }}>{link.url}</p>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveLink(link.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#888',
                  cursor: 'pointer',
                }}
              >
                <Minus size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});