import { StatsRecord } from 'src/types/alleyConfig';
import { useMemo } from 'react';

interface PerLaneChartProps {
    records: StatsRecord[];
    metric: 'total' | 'volle' | 'clear';
}

const PerLaneChart = ({ records, metric }: PerLaneChartProps) => {
    const width = 800;
    const height = 260;
    const padding = { left: 40, right: 20, top: 20, bottom: 30 };

    const series = useMemo(() => {
        const sorted = [...records].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        const lanes: Array<{ label: string; color: string; points: Array<{ x: number; y: number }> }> = [
            { label: 'Bahn 1', color: '#ff6b6b', points: [] },
            { label: 'Bahn 2', color: '#6bcBff', points: [] },
            { label: 'Bahn 3', color: '#51cf66', points: [] },
            { label: 'Bahn 4', color: '#b197fc', points: [] },
        ];
        const avg: { label: string; color: string; points: Array<{ x: number; y: number }> } = {
            label: 'Durchschnitt',
            color: '#ffc107',
            points: [],
        };

        sorted.forEach((r) => {
            const x = new Date(r.date).getTime();
            const vals = [r.alleys.alley1, r.alleys.alley2, r.alleys.alley3, r.alleys.alley4].map((a) => {
                if (metric === 'total') return a.total ?? 0;
                return metric === 'volle' ? (a.full ?? 0) : (a.clear ?? 0);
            });
            lanes[0].points.push({ x, y: vals[0] });
            lanes[1].points.push({ x, y: vals[1] });
            lanes[2].points.push({ x, y: vals[2] });
            lanes[3].points.push({ x, y: vals[3] });
            const mean = (vals[0] + vals[1] + vals[2] + vals[3]) / 4;
            avg.points.push({ x, y: mean });
        });

        return { lanes, avg };
    }, [records, metric]);

    const allPoints = useMemo(() => {
        const pts = [...series.avg.points];
        series.lanes.forEach((s) => pts.push(...s.points));
        return pts;
    }, [series]);

    const summaryBadges = useMemo(() => {
        const items = series.lanes.map((s) => {
            const mean = s.points.length > 0 ? s.points.reduce((acc, p) => acc + p.y, 0) / s.points.length : 0;
            return { label: s.label, color: s.color, mean };
        });
        const avgMean = series.avg.points.length > 0 ? series.avg.points.reduce((acc, p) => acc + p.y, 0) / series.avg.points.length : 0;
        items.push({ label: series.avg.label, color: series.avg.color, mean: avgMean });
        return items;
    }, [series]);

    if (allPoints.length === 0) {
        return <div className={'text-center text-muted py-4'}>Keine Daten</div>;
    }

    const xs = allPoints.map((p) => p.x);
    const ys = allPoints.map((p) => p.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const xSpan = maxX - minX || 1;
    const ySpan = maxY - minY || 1;

    const xScale = (x: number) => padding.left + ((x - minX) / xSpan) * (width - padding.left - padding.right);
    const yScale = (y: number) => height - padding.bottom - ((y - minY) / ySpan) * (height - padding.top - padding.bottom);

    const xTicksCount = Math.min(6, series.avg.points.length || 6);
    const xTickXs = Array.from({ length: xTicksCount }, (_, i) => minX + (i * xSpan) / (xTicksCount - 1));
    const yTicksCount = 5;
    const yTickYs = Array.from({ length: yTicksCount }, (_, i) => minY + (i * ySpan) / (yTicksCount - 1));

    const pathFor = (pts: Array<{ x: number; y: number }>) =>
        pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xScale(p.x)} ${yScale(p.y)}`).join(' ');

    return (
        <>
            <div className={'d-flex flex-wrap gap-2 mb-2'}>
                {summaryBadges.map((b, i) => (
                    <span key={`badge-${i}`} className={'badge'} style={{ backgroundColor: b.color }}>
                        {b.label}: Ø {b.mean.toFixed(1)}
                    </span>
                ))}
            </div>
            <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="280">
                <rect x="0" y="0" width={width} height={height} fill="#222" rx="8" />
                <line
                    x1={padding.left}
                    y1={height - padding.bottom}
                    x2={width - padding.right}
                    y2={height - padding.bottom}
                    stroke="#888"
                />
                <line x1={padding.left} y1={padding.top} x2={padding.left} y2={height - padding.bottom} stroke="#888" />

                {xTickXs.map((tx, i) => (
                    <g key={`xt-${i}`}>
                        <line x1={xScale(tx)} y1={height - padding.bottom} x2={xScale(tx)} y2={height - padding.bottom + 5} stroke="#888" />
                        <text x={xScale(tx)} y={height - padding.bottom + 18} fill="#bbb" fontSize="10" textAnchor="middle">
                            {new Date(tx).toLocaleDateString()}
                        </text>
                    </g>
                ))}
                {yTickYs.map((ty, i) => (
                    <g key={`yt-${i}`}>
                        <line x1={padding.left - 5} y1={yScale(ty)} x2={padding.left} y2={yScale(ty)} stroke="#888" />
                        <text x={padding.left - 8} y={yScale(ty) + 3} fill="#bbb" fontSize="10" textAnchor="end">
                            {Math.round(ty)}
                        </text>
                        <line x1={padding.left} y1={yScale(ty)} x2={width - padding.right} y2={yScale(ty)} stroke="#333" />
                    </g>
                ))}

                {series.lanes.map((s, idx) => (
                    <g key={`lane-${idx}`}>
                        <path d={pathFor(s.points)} fill="none" stroke={s.color} strokeWidth="2" />
                        {s.points.map((p, i) => (
                            <circle key={`pt-${idx}-${i}`} cx={xScale(p.x)} cy={yScale(p.y)} r={2.5} fill={s.color} />
                        ))}
                    </g>
                ))}
                {/* average across lanes per date */}
                <path d={pathFor(series.avg.points)} fill="none" stroke={series.avg.color} strokeWidth="2" strokeDasharray="6 4" />

                {/* simple legend */}
                <g>
                    {series.lanes.map((s, i) => (
                        <g key={`lg-${i}`}>
                            <rect x={padding.left + i * 120} y={8} width={10} height={10} fill={s.color} />
                            <text x={padding.left + i * 120 + 14} y={17} fill="#ddd" fontSize="10">
                                {s.label}
                            </text>
                        </g>
                    ))}
                    <g>
                        <rect x={width - padding.right - 200} y={8} width={10} height={10} fill={series.avg.color} />
                        <text x={width - padding.right - 186} y={17} fill="#ddd" fontSize="10">
                            Durchschnitt
                        </text>
                    </g>
                </g>
            </svg>
        </>
    );
};

export default PerLaneChart;
