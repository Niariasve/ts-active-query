export type Database = {
    users: {
        id: number;
        name: string;
        email: string;
        age: number;
        createdAt: Date;
    };

    products: {
        id: number;
        name: string;
        price: number;
        stock: number;
    };
}