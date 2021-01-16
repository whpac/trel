export default class ProgressMonitor {
    protected _value: number = 0;
    protected _maximum: number = 0;

    public get value() {
        return this._value;
    }
    public set value(v: number) {
        this._value = v;
        this.on_change(this);
    }

    public get maximum() {
        return this._maximum;
    }
    public set maximum(v: number) {
        this._maximum = v;
        this.on_change(this);
    }

    public constructor(
        protected on_change: (pm: ProgressMonitor) => void
    ) { }
}