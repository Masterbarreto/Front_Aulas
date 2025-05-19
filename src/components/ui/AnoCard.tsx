import { GraduationCap } from "lucide-react";
import "../../Styles/anoCard.css";

interface AnoCardProps {
    titulo: string;
}

export function AnoCard({ titulo }: AnoCardProps) {
    return (
        <div className="ano-card">
            <GraduationCap size={42} color="#ccc" />
            <p>{titulo}</p>
        </div>
    );
}
