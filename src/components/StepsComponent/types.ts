export interface Props {
}

export enum UploadType {
    "release",
    "supporting_material"
}

export interface State {
    offsetY: number;
    request: any;
    transitioning: boolean;
    selected: any;
    orderID: string;
}

export interface Step {
    progress?: number;
    title: string;
    description: string;
    information?: string;
    metaDescription?: string;
    id: string;
    request?: boolean;
    options: StepOption[];
    end?: boolean;
    moreMargin?: boolean;
    noMargin?: boolean;
    tooltip?: string;
    hidePreviousSteps?: boolean;
    progressEnd?: boolean;
    hideIfLoggedIn?: boolean;
    hideProgressbar?: boolean;
    hideBasket?: boolean;
    weight?: number
}

export interface StepOption {
    type: string;
    placeholder?: string;
    id?: string;
    required?: boolean;
    next?: Step;
    text?: string;
    load?: boolean;
    verifyWith?: string;
    continuable?: boolean;
    send?: boolean;
    conditionId?: boolean;
    conditions?: string[];
    conditionsExclusive?: boolean;
    disabled?: boolean;
    package?: boolean;
    packageId?: number;
    packageCost?: number;
    description?: number;
    emailNotify?: boolean;
    group?: StepOption[];
    metaDescription?: string;
    store?: boolean;
    triggerUpload?: boolean;
    multiline?: boolean;
    end?: boolean;
    triggerSignup?: boolean;
    uploadType?: UploadType,
    validate?: string,
    gaId?: string,
    analyseJournalists?: boolean
}

export enum RequestStatus {
    IN_PROGRESS = 0,
    READY_FOR_APPROVAL = 1,
    DISTRIBUTED = 2
}

export interface Package {
    name: string;
    cost: number;
    id: number;
    stripeId? : string;
}
