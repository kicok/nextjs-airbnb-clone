import prisma from '@/app/libs/prismadb';
export default async function getListings() {
    try {
        const listings = await prisma.listing.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });

        const safeListings = listings.map((listing) => ({
            ...listing,
            createdAt: listing.createdAt.toISOString(),
        }));

        return safeListings;
        // return listings; // 현재 버전에서는 이 것을 그대로 사용해도 [warning:Warning: Only plain objects can be passed to Client Components from Server Components] 이 뜨지 않는다.
    } catch (error: any) {
        throw new Error(error);
    }
}
