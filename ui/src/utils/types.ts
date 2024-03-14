export interface UserInfoType {
    ID: number;
    CreatedAt: string;
    UpdatedAt: string;
    DeletedAt: string | null;
    Email: string;
    Password: string;
    Username: string;
    Organisation: string;
    Role: string;
    EducationLevel: string;
    Transcript: string;
    StripeAccountID: string;
}

export interface resourceDataType {
    resourceDesc: string;
    resourceID: string;
    resourceLevel: string;
    resourceName: string;
    resourcePrice: number;
    resourceThumbnailURL: string;
    resources3URL: string;
    sellerID: number;
    sellerName: string;
    uuid: string;
}