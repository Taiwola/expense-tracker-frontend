export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    image?: string | null;
    password?: string | null;
    refreshToken?: string | null;
    roles: UserRoles;
    createdAt: Date;
    updatedAt: Date;
    categories: Category[];
    budgets: Budget[];
    incomes: Income[];
    expenses: Expense[];
    fullName: string
}

export enum UserRoles {
    ADMIN = 'Admin',
    USER = 'User',
  }

  export interface Category {
    id: string;
    name: string;
    description?: string | null; // Optional property
    user: User;
    expenses: Expense[];
    createdAt: Date;
    updatedAt: Date;
  }


  export interface Budget {
    id: string;
    amount: number; // Optional since it's nullable in the entity
    month: string;
    year: number; // Optional since it's nullable in the entity
    createdAt: Date;
    updatedAt: Date;
    user: User;
    incomes: Income[];
    expenses: Expense[];
  }


  export interface Income {
    id: string;
    amount: number; // Optional since it's nullable in the entity
    month: string;
    year: number;
    source: string;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    budget: Budget;
  }


  export interface Expense {
    id: string;
    amount: number; // Optional, reflecting the nullable property in the entity
    description: string; // Optional, reflecting the nullable property in the entity
    budget: Budget;
    category: Category;
    user: User;
    createdAt: Date;
    updatedAt: Date;
  }