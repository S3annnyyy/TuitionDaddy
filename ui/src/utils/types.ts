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

export interface TutorProfile {
    tutorid: number,
    name: string,
    description: string,
    experience: string,
    subjectlevel: string[],
    photolink: string
}    

export interface TutorPrice {
    rowid: number,
    tutorid: number,
    subjectlevel: string,
    price: number
}

export interface TutorSlot {
    slotid: string,
    tutorid: number, 
    students: number | null,
    startat: Date,
    duration: number
}