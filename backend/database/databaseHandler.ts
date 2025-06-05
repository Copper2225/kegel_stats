import Database from 'better-sqlite3';

export interface ColumnDefinition {
    name: string;
    type: 'TEXT' | 'INTEGER' | 'REAL' | 'BLOB' | 'BOOLEAN';
    constraints?: string[];
}

export class DatabaseHandler {
    private db: Database.Database;

    constructor(databasePath: string = 'database/database.sqlite') {
        this.db = new Database(databasePath);
        this.db.pragma('foreign_keys = ON');
    }

    createTable(): void {
        const columns: ColumnDefinition[] = [
            { name: 'id', type: 'INTEGER', constraints: ['PRIMARY KEY', 'AUTOINCREMENT'] },
            { name: 'total', type: 'INTEGER', constraints: ['NOT NULL'] },
            { name: 'alleys', type: 'TEXT' },
            { name: 'location', type: 'TEXT', constraints: ['NOT NULL'] },
            { name: 'date', type: 'TEXT', constraints: ['NOT NULL'] },
            { name: 'training', type: 'BOOLEAN', constraints: ['NOT NULL'] },
            { name: 'created_at', type: 'TEXT', constraints: ['NOT NULL', 'DEFAULT CURRENT_TIMESTAMP'] },
        ];

        const columnDefinitions = columns
            .map((column) => {
                const constraints = column.constraints ? ` ${column.constraints.join(' ')}` : '';
                return `${column.name} ${column.type}${constraints}`;
            })
            .join(', ');

        const query = `CREATE TABLE IF NOT EXISTS "KegelRecords" (${columnDefinitions})`;

        try {
            this.db.prepare(query).run();
            console.log(`Table "KegelRecords" successfully initialized`);
        } catch (error) {
            console.error(`Error creating table "KegelRecords":`, error);
            throw error;
        }
    }

    close(): void {
        this.db.close();
    }

    saveRecord(record: { total: number; alleys: any; location: string; date: string; training: boolean }): number {
        const query = `
            INSERT INTO KegelRecords (total, alleys, location, date, training)
            VALUES (@total, @alleys, @location, @date, @training)
        `;

        try {
            const result = this.db.prepare(query).run({
                total: record.total,
                alleys: JSON.stringify(record.alleys),
                location: record.location,
                date: record.date,
                training: record.training ? 1 : 0,
            });
            return result.lastInsertRowid as number;
        } catch (error) {
            console.error('Error saving record:', error);
            throw error;
        }
    }

    getAllRecords(): any[] {
        const query = `
            SELECT * FROM KegelRecords
        `;

        try {
            const result = this.db.prepare(query).all();
            return result.map((record: any) => {
                return {
                    id: record.id,
                    total: record.total,
                    alleys: JSON.parse(record.alleys),
                    location: record.location,
                    date: record.date,
                    training: record.training,
                };
            });
        } catch (error) {
            console.error('Error fetching records:', error);
            throw error;
        }
    }
}
