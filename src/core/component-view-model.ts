import { given } from "n-defensive";
import { ApplicationException, InvalidOperationException } from "n-exception";


// public
export class ComponentViewModel
{    
    private readonly _watches: { [index: string]: Function } = {};
    private _executeOnCreate: () => void;
    private _executeOnDestroy: () => void;
    
    
    private get ctx(): any { return (<any>this)["_ctx"]; }
    
    /** Override */
    protected onCreate(): void
    { 
        if (this._executeOnCreate)
            this._executeOnCreate();      
    }
    
    /** Override */
    protected onMount(element: HTMLElement): void
    { }
    
    /** Override */
    protected onDestroy(): void
    { 
        for (let key in this._watches)
        {
            if (this._watches[key])
            {
                this._watches[key]();
                this._watches[key] = undefined;
            }
        }
        
        if (this._executeOnDestroy)
            this._executeOnDestroy();    
    }
    
    protected executeOnCreate(funcToExecute: () => void): void
    {
        given(funcToExecute, "funcToExecute").ensureHasValue();
        this._executeOnCreate = funcToExecute;
    }
    
    protected executeOnDestroy(funcToExecute: () => void): void
    {
        given(funcToExecute, "funcToExecute").ensureHasValue();
        this._executeOnDestroy = funcToExecute;
    }
    
    protected watch<T>(propertyName: string, callback: (value: T, oldValue: T) => void): void
    {
        if (!this.ctx)
            throw new InvalidOperationException("calling watch() in the constructor");
        
        given(propertyName, "propertyName").ensureHasValue().ensure(t => !t.isEmptyOrWhiteSpace());
        
        propertyName = propertyName.trim();
        
        if (this._watches[propertyName])
            throw new ApplicationException(`Watch already defined for property '${propertyName}'.`);
        
        this._watches[propertyName] = this.ctx.$watch(propertyName,
            function (newVal: any, oldVal: any)
            {
                callback(newVal, oldVal);
            }, { deep: true });
    }
    
    protected unWatch(propertyName: string): void
    {
        given(propertyName, "propertyName").ensureHasValue().ensure(t => !t.isEmptyOrWhiteSpace());

        propertyName = propertyName.trim();
        
        if (this._watches[propertyName])
        {
            this._watches[propertyName]();
            this._watches[propertyName] = undefined;
        }    
    }
    
    protected getBound<T>(propertyName: string): T
    {
        if (!this.ctx)
            throw new InvalidOperationException("calling getBound() in the constructor");
        
        given(propertyName, "propertyName").ensureHasValue().ensure(t => !t.isEmptyOrWhiteSpace());
        
        return this.ctx[propertyName] as T;
    }
}