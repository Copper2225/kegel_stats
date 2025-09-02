import Database from 'better-sqlite3';

export interface ColumnDefinition {
    name: string;
    type: 'TEXT' | 'INTEGER' | 'REAL' | 'BLOB' | 'BOOLEAN';
    constraints?: string[];
}

export const mainColumns: ColumnDefinition[] = [
    { name: 'id', type: 'INTEGER', constraints: ['PRIMARY KEY', 'AUTOINCREMENT'] },
    { name: 'total', type: 'INTEGER', constraints: ['NOT NULL'] },
    { name: 'location', type: 'TEXT', constraints: ['NOT NULL'] },
    { name: 'date', type: 'TEXT', constraints: ['NOT NULL'] },
    { name: 'training', type: 'BOOLEAN', constraints: ['NOT NULL'] },
    { name: 'start', type: 'INTEGER', constraints: ['NOT NULL'] },
    { name: 'created_at', type: 'TEXT', constraints: ['NOT NULL', 'DEFAULT CURRENT_TIMESTAMP'] },
];

export const alleysColumns: ColumnDefinition[] = [
    { name: 'id', type: 'INTEGER', constraints: ['PRIMARY KEY', 'AUTOINCREMENT'] },
    { name: 'record_id', type: 'INTEGER', constraints: ['NOT NULL', 'REFERENCES KegelRecords(id) ON DELETE CASCADE'] },
    { name: 'number', type: 'INTEGER', constraints: ['NOT NULL'] },
    { name: 'full', type: 'INTEGER' },
    { name: 'total', type: 'INTEGER' },
    { name: 'clear', type: 'INTEGER' },
];

export class DatabaseHandler {
    private db: Database.Database;

    constructor(databasePath: string = 'database/database.sqlite') {
        this.db = new Database(databasePath);
        this.db.pragma('foreign_keys = ON');
    }

    createTable(columns: ColumnDefinition[], title: string): void {
        const columnDefinitions = columns
            .map((column) => {
                const constraints = column.constraints ? ` ${column.constraints.join(' ')}` : '';
                return `${column.name} ${column.type}${constraints}`;
            })
            .join(', ');

        const query = `CREATE TABLE IF NOT EXISTS "${title}" (${columnDefinitions})`;

        try {
            this.db.prepare(query).run();
            console.log(`Table "${title}" successfully initialized`);
        } catch (error) {
            console.error(`Error creating table "${title}":`, error);
            throw error;
        }
    }

    close(): void {
        this.db.close();
    }

    saveRecord(record: {
        total: number;
        alleys: Array<{ number: number; full: number; total: number; clear: number }>;
        location: string;
        date: string;
        training: boolean;
        start: number;
    }): number {
        const query = `
            INSERT INTO KegelRecords (total, location, date, training, start)
            VALUES (@total, @location, @date, @training, @start)
        `;

        try {
            const result = this.db.prepare(query).run({
                total: record.total,
                location: record.location,
                date: record.date,
                training: record.training ? 1 : 0,
                start: record.start,
            });

            const recordId = result.lastInsertRowid as number;

            // Save each alley from the array
            record.alleys.forEach((alley) => {
                this.saveAlley(recordId, alley);
            });

            return recordId;
        } catch (error) {
            console.error('Error saving record:', error);
            throw error;
        }
    }

    saveAlley(recordId: number, alley: { number: number; full: number; total: number; clear: number }): number {
        const query = `
            INSERT INTO Alleys (record_id, number, full, total, clear)
            VALUES (@record_id, @number, @full, @total, @clear)
        `;

        try {
            const result = this.db.prepare(query).run({
                record_id: recordId,
                number: alley.number,
                full: alley.full,
                total: alley.total,
                clear: alley.clear,
            });
            return result.lastInsertRowid as number;
        } catch (error) {
            console.error('Error saving alley:', error);
            throw error;
        }
    }

    getAllRecords(): any[] {
        const query = `
            SELECT r.*, 
                   GROUP_CONCAT(json_object(
                       'number', a.number,
                       'full', a.full,
                       'total', a.total,
                       'clear', a.clear
                   ) ORDER BY a.number) as alley_details
            FROM KegelRecords r
            LEFT JOIN Alleys a ON r.id = a.record_id
            GROUP BY r.id
            ORDER BY r.date DESC 
        `;

        try {
            const result = this.db.prepare(query).all();
            return result.map((record: any) => {
                const alleyDetails = record.alley_details ? JSON.parse(`[${record.alley_details}]`) : [];
                const alleys = alleyDetails.reduce((acc: any, alley: any) => {
                    acc[`alley${alley.number}`] = {
                        full: alley.full,
                        total: alley.total,
                        clear: alley.clear,
                    };
                    return acc;
                }, {});

                return {
                    id: record.id,
                    total: record.total,
                    alleys: { start: record.start, ...alleys },
                    location: record.location,
                    date: record.date,
                    training: record.training,
                    start: record.start,
                };
            });
        } catch (error) {
            console.error('Error fetching records:', error);
            throw error;
        }
    }

    getFilteredRecords(filters: {
        dateFrom?: string | null;
        dateTo?: string | null;
        location?: string | null;
        trainingMode?: 'any' | 'training' | 'wettkampf';
        startLane?: number | null;
        lanes?: number[] | null;
    }): any[] {
        const {
            dateFrom,
            dateTo,
            location,
            trainingMode = 'any',
            startLane = null,
            lanes = [1, 2, 3, 4],
        } = filters || {};

        const whereClauses: string[] = [];
        const havingClauses: string[] = [];
        const params: Record<string, unknown> = {};

        if (dateFrom) {
            whereClauses.push('r.date >= @dateFrom');
            params.dateFrom = dateFrom;
        }
        if (dateTo) {
            whereClauses.push('r.date <= @dateTo');
            params.dateTo = dateTo;
        }
        if (location && location.trim().length > 0) {
            whereClauses.push('LOWER(r.location) LIKE LOWER(@location)');
            params.location = `%${location}%`;
        }
        if (trainingMode !== 'any') {
            whereClauses.push('r.training = @training');
            params.training = trainingMode === 'training' ? 1 : 0;
        }
        if (typeof startLane === 'number') {
            whereClauses.push('r.start = @startLane');
            params.startLane = startLane;
        }
        // removed min/max filters

        const whereSQL = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';
        const havingSQL = havingClauses.length ? `HAVING ${havingClauses.join(' AND ')}` : '';

        const query = `
            SELECT r.*, 
                   GROUP_CONCAT(json_object(
                       'number', a.number,
                       'full', a.full,
                       'total', a.total,
                       'clear', a.clear
                   ) ORDER BY a.number) as alley_details,
                   SUM(IFNULL(a.full, 0)) as sum_full_selected,
                   SUM(IFNULL(a.clear, 0)) as sum_clear_selected
            FROM KegelRecords r
            LEFT JOIN Alleys a ON r.id = a.record_id
            ${whereSQL}
            GROUP BY r.id
            ${havingSQL}
            ORDER BY r.date DESC
        `;

        try {
            const result = this.db.prepare(query).all(params);
            return result.map((record: any) => {
                const alleyDetails = record.alley_details ? JSON.parse(`[${record.alley_details}]`) : [];
                const alleys = alleyDetails.reduce((acc: any, alley: any) => {
                    acc[`alley${alley.number}`] = {
                        full: alley.full,
                        total: alley.total,
                        clear: alley.clear,
                    };
                    return acc;
                }, {});

                return {
                    id: record.id,
                    total: record.total,
                    alleys: { start: record.start, ...alleys },
                    location: record.location,
                    date: record.date,
                    training: record.training,
                    start: record.start,
                };
            });
        } catch (error) {
            console.error('Error fetching filtered records:', error);
            throw error;
        }
    }

    deleteRecord(id: number): boolean {
        const query = `
            DELETE FROM KegelRecords
            WHERE id = @id
        `;

        try {
            const result = this.db.prepare(query).run({ id });
            return result.changes > 0;
        } catch (error) {
            console.error('Error deleting record:', error);
            throw error;
        }
    }
}
