import ColumnsContainer from "./columnsContainer";
import IndexesContainer from "./indexesContainer";
import Column from "./column";
import Index from "./index";
import Driver from "./driver";
import { CreateTable } from "webiny-sql";

class Table {
    static engine: string;
    static tableName: string;
    static defaultCharset: string;
    static collate: string;
    static comment: ?string;
    static autoIncrement: ?string;
    columns: { [string]: Column };
    indexes: { [string]: Index };
    columnsContainer: ColumnsContainer;
    indexesContainer: IndexesContainer;

    constructor() {
        this.engine = null;
        this.tableName = null;
        this.defaultCharset = null;
        this.collate = null;
        this.comment = null;
        this.autoIncrement = null;
        this.columns = {};
        this.indexes = {};
        this.columnsContainer = this.createColumnsContainer();
        this.indexesContainer = this.createIndexesContainer();
    }

    column(column: string): ColumnsContainer {
        return this.getColumnsContainer().column(column);
    }

    index(index: string): IndexesContainer {
        return this.getIndexesContainer().index(index);
    }

    createColumnsContainer(): ColumnsContainer {
        const setClass = this.getDriver().getColumnsClass();
        return new setClass(this);
    }

    createIndexesContainer(): IndexesContainer {
        const setClass = this.getDriver().getIndexesClass();
        return new setClass(this);
    }

    getColumnsContainer(): ColumnsContainer {
        return this.columnsContainer;
    }

    getIndexesContainer(): IndexesContainer {
        return this.indexesContainer;
    }

    getColumn(column: string): ?Column {
        if (column in this.columns) {
            return this.columns[column];
        }
        return undefined;
    }

    setColumn(name: string, column: Column): this {
        this.columns[name] = column;
        return this;
    }

    getColumns(): { [string]: Column } {
        return this.columns;
    }

    getIndex(index: string): ?Index {
        if (index in this.indexes) {
            return this.indexes[index];
        }
        return undefined;
    }

    setIndex(name: string, index: Index): this {
        this.indexes[name] = index;
        return this;
    }

    getIndexes(): { [string]: Index } {
        return this.indexes;
    }

    toObject(): { [string]: {} } {
        const json = {
            autoIncrement: this.constructor.getAutoIncrement(),
            name: this.constructor.getName(),
            comment: this.constructor.getComment(),
            engine: this.constructor.getEngine(),
            collate: this.constructor.getCollate(),
            defaultCharset: this.constructor.getDefaultCharset(),
            columns: [],
            indexes: []
        };

        for (let name in this.getColumns()) {
            const column = ((this.getColumn(name): any): Column);
            json.columns.push(column.getObjectValue());
        }

        for (let name in this.getIndexes()) {
            const index = ((this.getIndex(name): any): Index);
            json.indexes.push(index.getObjectValue());
        }

        return json;
    }

    toSQL() {
        const statement = new CreateTable(this.toObject());
        return statement.generate();
    }

    static setDriver(driver): this {
        this.driver = driver;
        return this;
    }

    /**
     * Returns instance of set driver.
     */
    static getDriver(): Driver {
        return this.driver;
    }

    /**
     * Returns instance of set driver.
     */
    getDriver(): Driver {
        return this.constructor.driver;
    }

    static setEngine(value) {
        this.engine = value;
        return this;
    }

    static getEngine() {
        return this.engine;
    }

    static setDefaultCharset(defaultCharset) {
        this.defaultCharset = defaultCharset;
        return this;
    }

    static getDefaultCharset() {
        return this.defaultCharset;
    }

    static setCollate(collate) {
        this.collate = collate;
        return this;
    }

    static getCollate() {
        return this.collate;
    }

    static setName(name) {
        this.tableName = name;
        return this;
    }

    static getName() {
        return this.tableName;
    }

    static setComment(comment) {
        this.comment = comment;
        return this;
    }

    static getComment() {
        return this.comment;
    }

    static setAutoIncrement(autoIncrement: boolean = true) {
        this.autoIncrement = autoIncrement;
        return this;
    }

    static getAutoIncrement() {
        return this.autoIncrement;
    }
}

Table.engine = null;
Table.tableName = null;
Table.defaultCharset = null;
Table.collate = null;
Table.comment = null;
Table.autoIncrement = null;

Table.setDriver(new Driver());

export default Table;
