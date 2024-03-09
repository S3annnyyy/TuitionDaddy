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