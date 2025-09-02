import { useCallback, useEffect, useMemo, useState } from 'react';
import { StatsRecord } from 'src/types/alleyConfig';
import { getAllRecords, searchRecords } from 'src/requests/loadRequests';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faFilter } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import { Badge, Button, Col, Form, Offcanvas, Row } from 'react-bootstrap';

const Header = styled.div`
    position: absolute;
    left: 0;
    right: 0;
    margin: auto;
    width: min-content;
    font-size: 1.8em;
`;

const StatsPage = () => {
    const [records, setRecords] = useState<StatsRecord[]>([]);
    const [allLocations, setAllLocations] = useState<string[]>([]);
    const [showFilter, setShowFilter] = useState(false);
    const [filters, setFilters] = useState({
        dateFrom: '',
        dateTo: '',
        location: '',
        training: 'any' as 'any' | 'training' | 'wettkampf',
        startLane: 'any' as 'any' | '1' | '2' | '3' | '4',
        lanes: new Set<number>([1, 2, 3, 4]),
        volleMin: '',
        volleMax: '',
        clearMin: '',
        clearMax: '',
        totalMin: '',
        totalMax: '',
        metric: 'total' as 'total' | 'volle' | 'clear',
    });

    const applyFilters = useCallback(async () => {
        const payload = {
            dateFrom: filters.dateFrom || undefined,
            dateTo: filters.dateTo || undefined,
            location: filters.location || undefined,
            trainingMode: filters.training,
            startLane: filters.startLane === 'any' ? null : Number(filters.startLane),
            lanes: Array.from(filters.lanes).sort((a, b) => a - b),
            volleMin: filters.volleMin === '' ? undefined : Number(filters.volleMin),
            volleMax: filters.volleMax === '' ? undefined : Number(filters.volleMax),
            clearMin: filters.clearMin === '' ? undefined : Number(filters.clearMin),
            clearMax: filters.clearMax === '' ? undefined : Number(filters.clearMax),
            totalMin: filters.totalMin === '' ? undefined : Number(filters.totalMin),
            totalMax: filters.totalMax === '' ? undefined : Number(filters.totalMax),
        } as const;

        const res = await searchRecords(payload);
        setRecords(res?.records ?? []);
    }, [filters]);

    useEffect(() => {
        // Load all locations for datalist
        getAllRecords().then((res) => {
            const locs = new Set<string>();
            (res?.records ?? []).forEach((r) => locs.add(r.location));
            setAllLocations(Array.from(locs).sort());
        });
        // Initial filtered load
        applyFilters();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const locations = allLocations;

    // Records are already filtered by backend
    const filteredRecords = records;

    const chartData = useMemo(() => {
        const getAlley = (cfg: StatsRecord['alleys'], lane: number) => {
            switch (lane) {
                case 1:
                    return cfg.alley1;
                case 2:
                    return cfg.alley2;
                case 3:
                    return cfg.alley3;
                case 4:
                default:
                    return cfg.alley4;
            }
        };

        const laneIds = Array.from(filters.lanes);
        const points = filteredRecords
            .map((r) => {
                const x = new Date(r.date).getTime();
                let y = 0;
                if (filters.metric === 'total') {
                    y = r.total;
                } else {
                    const laneValues = laneIds.map((lane) => {
                        const alley = getAlley(r.alleys, lane);
                        return filters.metric === 'volle' ? alley.full ?? 0 : alley.clear ?? 0;
                    });
                    y = laneValues.reduce((a, b) => a + b, 0);
                }
                return { x, y, date: r.date };
            })
            .sort((a, b) => a.x - b.x);

        return points;
    }, [filteredRecords, filters.lanes, filters.metric]);

    const activeFilterCount = useMemo(() => {
        let c = 0;
        if (filters.dateFrom) c++;
        if (filters.dateTo) c++;
        if (filters.location) c++;
        if (filters.training !== 'any') c++;
        if (filters.startLane !== 'any') c++;
        if (filters.volleMin) c++;
        if (filters.volleMax) c++;
        if (filters.clearMin) c++;
        if (filters.clearMax) c++;
        if (filters.totalMin) c++;
        if (filters.totalMax) c++;
        if (filters.lanes.size !== 4) c++;
        return c;
    }, [filters]);

    const resetFilters = useCallback(() => {
        setFilters({
            dateFrom: '',
            dateTo: '',
            location: '',
            training: 'any',
            startLane: 'any',
            lanes: new Set<number>([1, 2, 3, 4]),
            volleMin: '',
            volleMax: '',
            clearMin: '',
            clearMax: '',
            totalMin: '',
            totalMax: '',
            metric: filters.metric,
        });
    }, [filters.metric]);

    const toggleLane = useCallback((lane: number) => {
        setFilters((prev) => {
            const next = new Set(prev.lanes);
            if (next.has(lane)) next.delete(lane);
            else next.add(lane);
            if (next.size === 0) {
                // Prevent empty selection – keep at least one lane
                next.add(lane);
            }
            return { ...prev, lanes: next };
        });
    }, []);

    const Chart = useMemo(() => {
        const width = 800;
        const height = 320;
        const padding = { left: 40, right: 20, top: 20, bottom: 30 };

        if (chartData.length === 0) {
            return (
                <div className={"text-center text-muted py-5"}>Keine Daten für die aktuelle Filterauswahl</div>
            );
        }

        const xs = chartData.map((p) => p.x);
        const ys = chartData.map((p) => p.y);
        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const minY = Math.min(...ys);
        const maxY = Math.max(...ys);
        const xSpan = maxX - minX || 1;
        const ySpan = maxY - minY || 1;

        const xScale = (x: number) => padding.left + ((x - minX) / xSpan) * (width - padding.left - padding.right);
        const yScale = (y: number) => height - padding.bottom - ((y - minY) / ySpan) * (height - padding.top - padding.bottom);

        const pathD = chartData
            .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xScale(p.x)} ${yScale(p.y)}`)
            .join(' ');

        const xTicksCount = Math.min(6, chartData.length);
        const xTickXs = Array.from({ length: xTicksCount }, (_, i) => minX + (i * xSpan) / (xTicksCount - 1));
        const yTicksCount = 5;
        const yTickYs = Array.from({ length: yTicksCount }, (_, i) => minY + (i * ySpan) / (yTicksCount - 1));

        return (
            <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="340">
                <rect x="0" y="0" width={width} height={height} fill="#222" rx="8" />
                {/* Axes */}
                <line x1={padding.left} y1={height - padding.bottom} x2={width - padding.right} y2={height - padding.bottom} stroke="#888" />
                <line x1={padding.left} y1={padding.top} x2={padding.left} y2={height - padding.bottom} stroke="#888" />
                {/* X ticks */}
                {xTickXs.map((tx, i) => (
                    <g key={`xt-${i}`}>
                        <line x1={xScale(tx)} y1={height - padding.bottom} x2={xScale(tx)} y2={height - padding.bottom + 5} stroke="#888" />
                        <text x={xScale(tx)} y={height - padding.bottom + 18} fill="#bbb" fontSize="10" textAnchor="middle">
                            {new Date(tx).toLocaleDateString()}
                        </text>
                    </g>
                ))}
                {/* Y ticks */}
                {yTickYs.map((ty, i) => (
                    <g key={`yt-${i}`}>
                        <line x1={padding.left - 5} y1={yScale(ty)} x2={padding.left} y2={yScale(ty)} stroke="#888" />
                        <text x={padding.left - 8} y={yScale(ty) + 3} fill="#bbb" fontSize="10" textAnchor="end">
                            {Math.round(ty)}
                        </text>
                        <line x1={padding.left} y1={yScale(ty)} x2={width - padding.right} y2={yScale(ty)} stroke="#333" />
                    </g>
                ))}
                {/* Line */}
                <path d={pathD} fill="none" stroke="#0d6efd" strokeWidth="2" />
                {/* Points */}
                {chartData.map((p, i) => (
                    <circle key={`pt-${i}`} cx={xScale(p.x)} cy={yScale(p.y)} r={3} fill="#0d6efd" />
                ))}
            </svg>
        );
    }, [chartData]);

    return (
        <div className="h-100">
            <div className="d-flex align-items-center mb-2">
                <a href="/" className="btn btn-primary">
                    <FontAwesomeIcon icon={faChevronLeft} />
                </a>
                <Header>Statistiken</Header>
            </div>

            <Button className="d-flex gap-2 align-items-center" onClick={() => setShowFilter(true)}>
                <FontAwesomeIcon icon={faFilter} />
                Filter
                {activeFilterCount > 0 && (
                    <Badge bg="secondary">{activeFilterCount}</Badge>
                )}
            </Button>

            <Offcanvas show={showFilter} onHide={() => setShowFilter(false)} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Filter</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Form className={'d-flex flex-column gap-3'}>
                        <Row>
                            <Col>
                                <Form.Label>Von</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={filters.dateFrom}
                                    onChange={(e) => setFilters((f) => ({ ...f, dateFrom: e.target.value }))}
                                />
                            </Col>
                            <Col>
                                <Form.Label>Bis</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={filters.dateTo}
                                    onChange={(e) => setFilters((f) => ({ ...f, dateTo: e.target.value }))}
                                />
                            </Col>
                        </Row>

                        <Form.Group>
                            <Form.Label>Ort</Form.Label>
                            <Form.Control
                                list="locations"
                                placeholder="Ort filtern"
                                value={filters.location}
                                onChange={(e) => setFilters((f) => ({ ...f, location: e.target.value }))}
                            />
                            <datalist id="locations">
                                {locations.map((l) => (
                                    <option key={l} value={l} />
                                ))}
                            </datalist>
                        </Form.Group>

                        <Row>
                            <Col>
                                <Form.Label>Modus</Form.Label>
                                <Form.Select
                                    value={filters.training}
                                    onChange={(e) => setFilters((f) => ({ ...f, training: e.target.value as typeof f.training }))}
                                >
                                    <option value="any">Beliebig</option>
                                    <option value="training">Training</option>
                                    <option value="wettkampf">Wettkampf</option>
                                </Form.Select>
                            </Col>
                            <Col>
                                <Form.Label>Startbahn</Form.Label>
                                <Form.Select
                                    value={filters.startLane}
                                    onChange={(e) => setFilters((f) => ({ ...f, startLane: e.target.value as typeof f.startLane }))}
                                >
                                    <option value="any">Beliebig</option>
                                    <option value="1">Bahn 1</option>
                                    <option value="2">Bahn 2</option>
                                    <option value="3">Bahn 3</option>
                                    <option value="4">Bahn 4</option>
                                </Form.Select>
                            </Col>
                        </Row>

                        <div>
                            <div className={'mb-1 fw-bold'}>Bahnen</div>
                            <div className={'d-flex gap-3 flex-wrap'}>
                                {[1, 2, 3, 4].map((lane) => (
                                    <Form.Check
                                        key={lane}
                                        inline
                                        type="checkbox"
                                        id={`lane-${lane}`}
                                        label={`Bahn ${lane}`}
                                        checked={filters.lanes.has(lane)}
                                        onChange={() => toggleLane(lane)}
                                    />
                                ))}
                            </div>
                        </div>

                        <Row>
                            <Col>
                                <Form.Label>Volle min</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={filters.volleMin}
                                    onChange={(e) => setFilters((f) => ({ ...f, volleMin: e.target.value }))}
                                />
                            </Col>
                            <Col>
                                <Form.Label>Volle max</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={filters.volleMax}
                                    onChange={(e) => setFilters((f) => ({ ...f, volleMax: e.target.value }))}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Label>Räumen min</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={filters.clearMin}
                                    onChange={(e) => setFilters((f) => ({ ...f, clearMin: e.target.value }))}
                                />
                            </Col>
                            <Col>
                                <Form.Label>Räumen max</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={filters.clearMax}
                                    onChange={(e) => setFilters((f) => ({ ...f, clearMax: e.target.value }))}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Label>Gesamt min</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={filters.totalMin}
                                    onChange={(e) => setFilters((f) => ({ ...f, totalMin: e.target.value }))}
                                />
                            </Col>
                            <Col>
                                <Form.Label>Gesamt max</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={filters.totalMax}
                                    onChange={(e) => setFilters((f) => ({ ...f, totalMax: e.target.value }))}
                                />
                            </Col>
                        </Row>

                        <Form.Group>
                            <Form.Label>Diagramm-Metrik</Form.Label>
                            <div className={'d-flex gap-3'}>
                                <Form.Check
                                    inline
                                    type="radio"
                                    id={'metric-total'}
                                    label={'Gesamt'}
                                    checked={filters.metric === 'total'}
                                    onChange={() => setFilters((f) => ({ ...f, metric: 'total' }))}
                                />
                                <Form.Check
                                    inline
                                    type="radio"
                                    id={'metric-volle'}
                                    label={'Volle'}
                                    checked={filters.metric === 'volle'}
                                    onChange={() => setFilters((f) => ({ ...f, metric: 'volle' }))}
                                />
                                <Form.Check
                                    inline
                                    type="radio"
                                    id={'metric-clear'}
                                    label={'Räumen'}
                                    checked={filters.metric === 'clear'}
                                    onChange={() => setFilters((f) => ({ ...f, metric: 'clear' }))}
                                />
                            </div>
                        </Form.Group>

                        <div className={'d-flex gap-2 mt-2'}>
                            <Button variant={'secondary'} onClick={() => { resetFilters(); applyFilters(); }}>Zurücksetzen</Button>
                            <Button onClick={() => { applyFilters(); setShowFilter(false); }}>Übernehmen</Button>
                        </div>
                    </Form>
                </Offcanvas.Body>
            </Offcanvas>

            <div className={'mt-3'}>
                <div className={'d-flex justify-content-between align-items-center mb-2'}>
                    <div>
                        <span className={'me-2'}>Gefilterte Einträge:</span>
                        <Badge bg={'info'}>{filteredRecords.length}</Badge>
                    </div>
                    <div className={'text-muted'}>
                        {filters.metric === 'total' ? 'Gesamt' : filters.metric === 'volle' ? 'Volle' : 'Räumen'}
                        {filters.metric !== 'total' ? ` | Bahnen: ${Array.from(filters.lanes).sort().join(', ')}` : ''}
                    </div>
                </div>
                {Chart}
            </div>
        </div>
    );
};

export default StatsPage;
