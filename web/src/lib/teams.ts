// Country flag emojis and team colors for WC 2026 teams
export const TEAM_FLAGS: Record<string, string> = {
  Spain: "🇪🇸", Argentina: "🇦🇷", France: "🇫🇷", Ecuador: "🇪🇨",
  Brazil: "🇧🇷", England: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", Netherlands: "🇳🇱", Croatia: "🇭🇷",
  Morocco: "🇲🇦", Germany: "🇩🇪", Colombia: "🇨🇴", Portugal: "🇵🇹",
  Turkey: "🇹🇷", Japan: "🇯🇵", Canada: "🇨🇦", Mexico: "🇲🇽",
  Uruguay: "🇺🇾", Belgium: "🇧🇪", Italy: "🇮🇹", USA: "🇺🇸",
  "United States": "🇺🇸", "South Korea": "🇰🇷", Senegal: "🇸🇳",
  Switzerland: "🇨🇭", Denmark: "🇩🇰", Poland: "🇵🇱", Australia: "🇦🇺",
  "Saudi Arabia": "🇸🇦", Qatar: "🇶🇦", Algeria: "🇩🇿", Paraguay: "🇵🇾",
  "New Zealand": "🇳🇿", Peru: "🇵🇪", Chile: "🇨🇱", Nigeria: "🇳🇬",
  Cameroon: "🇨🇲", Egypt: "🇪🇬", Ghana: "🇬🇭", "Ivory Coast": "🇨🇮",
  Scotland: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", Wales: "🏴󠁧󠁢󠁷󠁬󠁳󠁿", Iran: "🇮🇷", Serbia: "🇷🇸",
  Greece: "🇬🇷", Austria: "🇦🇹", Hungary: "🇭🇺", Panama: "🇵🇦",
  "Costa Rica": "🇨🇷", Honduras: "🇭🇳", Jamaica: "🇯🇲",
};

export const TEAM_COLORS: Record<string, string> = {
  Spain: "#E03531", Argentina: "#75AADB", France: "#002395",
  Brazil: "#009C3B", England: "#CF081F", Netherlands: "#FF6600",
  Germany: "#FFCE00", Portugal: "#006600", Colombia: "#FCD116",
  Morocco: "#006233", Croatia: "#FF0000", Ecuador: "#FFD100",
  Uruguay: "#5EB6E4", Belgium: "#EF3340", Italy: "#009246",
  Mexico: "#006847", "South Korea": "#C60C30", Japan: "#BC002D",
  Turkey: "#E30A17", Canada: "#FF0000", Senegal: "#00853F",
};

export function getFlag(team: string): string {
  return TEAM_FLAGS[team] || "🏳️";
}

export function getTeamColor(team: string): string {
  return TEAM_COLORS[team] || "#f5c518";
}

export function formatPct(val: number): string {
  return (val * 100).toFixed(1) + "%";
}
