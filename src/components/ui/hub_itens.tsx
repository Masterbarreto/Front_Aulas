import React from "react";


interface HubItensProps {
    icon: React.ReactNode;
    text: string;
    active?: boolean;
}

export function HubItens({ icon, text, active }: HubItensProps) {
    return (
        <div className={`ints-container ${active ? "active" : ""}`}>
            <div className="icon">{icon}</div>
            <div className="text">{text}</div>
        </div>
    );
}











