import { Listing, User } from '@prisma/client';

// createdAt 프러퍼티를 제거한뒤 string 타입의 createdAt 을 추가
export type SafeListing = Omit<Listing, 'createdAt'> & {
    createdAt: string;
};

export type SafeUser = Omit<User, 'createdAt' | 'updatedAt' | 'emailVerified'> & {
    createdAt: string;
    updatedAt: string;
    emailVerified: string | null;
};
