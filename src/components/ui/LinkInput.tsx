import React, { useState, useEffect } from "react";
import "../../Styles/LinkInput.css";

function LinkInput({ clearLinks, onLinksChange }) {
  const [links, setLinks] = useState([]);

  useEffect(() => {
    if (clearLinks) setLinks([]);
  }, [clearLinks]);

  // Chama onLinksChange sempre que links mudar
  useEffect(() => {
    if (onLinksChange) onLinksChange(links);
  }, [links, onLinksChange]);

  // Garante que onLinksChange é chamado ao montar (para inicializar como [])
  useEffect(() => {
    if (onLinksChange) onLinksChange(links);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddLink = () => {
    setLinks([...links, ""]); // adiciona um novo campo vazio
  };

  const handleRemoveLink = (index) => {
    const newLinks = links.filter((_, i) => i !== index);
    setLinks(newLinks);
  };

  const handleChange = (value, index) => {
    const newLinks = [...links];
    newLinks[index] = value;
    setLinks(newLinks);
  };

  return (
    <div className="link-input-container">
      <div className="link-box add-link" onClick={handleAddLink}>
        <span className="icon add">+</span>
        <span className="text">Adicionar Link</span>
      </div>

      {links.map((link, index) => (
        <div key={index} className="link-box">
          <span className="icon remove" onClick={() => handleRemoveLink(index)}>
            –
          </span>
          <input
            type="text"
            placeholder="Video de expl..."
            value={link}
            onChange={(e) => handleChange(e.target.value, index)}
          />
        </div>
      ))}
    </div>
  );
}

export default LinkInput;

