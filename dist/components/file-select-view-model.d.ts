import { ComponentViewModel } from "../core/component-view-model";
import { DialogService } from "../services/dialog-service/dialog-service";
import { EventAggregator } from "../services/event-aggregator/event-aggregator";
export interface FileInfo {
    fileName: string;
    fileType: string;
    fileSize: number;
    fileData: string;
    fileMime: string;
    nativeFile: File;
}
export declare class FileSelectViewModel extends ComponentViewModel {
    private readonly _dialogService;
    private readonly _eventAggregator;
    private readonly _inputTemplate;
    private readonly _inputTemplateMultiple;
    private _inputElement;
    private _maxFileSizeBytes;
    private readonly mimeTypesList;
    private readonly maxFileSizeValue;
    private readonly isMultiple;
    constructor(dialogService: DialogService, eventAggregator: EventAggregator);
    protected onMount(element: HTMLElement): void;
    private processFiles;
    private ensureFileSizeIsAllowed;
    private initializeMaxFileSizeBytes;
}
