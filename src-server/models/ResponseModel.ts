export enum EResponseStatus {
    SUCCESS = 'success'
    , ERROR = 'error'
    , FAIL = 'fail'
}

export interface IFailValidation {
    code: number;
    message: string;
}

export interface IErrorData<T extends object> {
    code?: number;
    message: string;
    data?: T;
}

export interface IFailData {
    code?: number;
    message: string;
    validations?: IFailValidation[];

}

export interface IResponseModel<T extends Object> {
    status: EResponseStatus;
    data: T;
}
