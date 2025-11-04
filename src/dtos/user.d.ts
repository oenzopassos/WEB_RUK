type User = {
    id: string;
    name: string;
    email: string;
    telephones: {
        number: string;
        area_code: string;
    }[];
};


type LoginResponse = {
    token: string;
    user: User;
};
