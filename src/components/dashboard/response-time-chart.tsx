"use client";

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

interface DataPoint {
  time: string;
  responseTime: number;
}

interface ResponseTimeChartProps {
  data: DataPoint[];
}

export function ResponseTimeChart({ data }: ResponseTimeChartProps) {
  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="responseGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e9c176" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#e9c176" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(38,38,42,0.4)" />
          <XAxis dataKey="time" tick={{ fill: "#7E7E86", fontSize: 12 }} />
          <YAxis tick={{ fill: "#7E7E86", fontSize: 12 }} unit="ms" />
          <Tooltip
            contentStyle={{ backgroundColor: "#1A1A1D", border: "1px solid rgba(38,38,42,0.6)", borderRadius: 8, color: "#EDEDEF" }}
          />
          <Area type="monotone" dataKey="responseTime" stroke="#e9c176" fill="url(#responseGradient)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
