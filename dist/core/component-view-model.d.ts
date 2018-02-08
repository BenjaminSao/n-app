export declare class ComponentViewModel {
    private readonly _watches;
    private _executeOnCreate;
    private _executeOnDestroy;
    private readonly ctx;
    /** Override */
    protected onCreate(): void;
    /** Override */
    protected onMount(element: HTMLElement): void;
    /** Override */
    protected onDestroy(): void;
    protected executeOnCreate(funcToExecute: () => void): void;
    protected executeOnDestroy(funcToExecute: () => void): void;
    protected watch<T>(propertyName: string, callback: (value: T, oldValue: T) => void): void;
    protected unWatch(propertyName: string): void;
    protected getBound<T>(propertyName: string): T;
}
