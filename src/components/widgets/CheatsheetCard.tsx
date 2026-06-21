import { Card, CardContent } from "@ui/card.tsx";
import { TerminalSquare } from "lucide-react";

interface CheatsheetCardProps {
  title?: string;
  subtitle: string;
  description: string;
}

export default function CheatsheetCard({
  title = "Cheatsheets",
  subtitle,
  description,
}: CheatsheetCardProps) {
  return (
    <Card className="bg-red-950 border border-red-500/20 rounded-[14px] p-5 relative overflow-hidden">
      <CardContent className="p-0">
        {/* Decorative background icon */}
        <div className="absolute top-[80px] left-60 pointer-events-none">
          <div className="w-[120px] h-[120px] opacity-50 -rotate-10 text-white">
            <TerminalSquare className="w-full h-full" strokeWidth={1.2} />
          </div>
        </div>

        <div className="relative">
          <p className="text-white/40 text-base font-medium tracking-[3.2px] uppercase mb-[15px]">
            {title}
          </p>
          <h3 className="text-white text-[32px] font-bold leading-normal mb-2.5">
            {subtitle}
          </h3>
          <p className="text-white text-base leading-normal whitespace-pre-line">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
