import prisma from '@/app/libs/prismadb';
export interface IListingsPrams {
    userId?: string;
    guestCount?: number;
    roomCount?: number;
    bathroomCount?: number;
    startDate?: string;
    endDate?: string;
    locationValue?: string;
    category?: string;
}

export default async function getListings(params: IListingsPrams) {
    try {
        const {
            userId,
            guestCount,
            roomCount,
            bathroomCount,
            startDate,
            endDate,
            locationValue,
            category,
        } = params;

        let query: any = {};

        if (userId) {
            query.userId = userId;
        }

        if (category) {
            query.category = category;
        }

        if (roomCount) {
            query.roomCount = {
                gte: +roomCount,
            };
        }
        if (bathroomCount) {
            query.bathroomCount = {
                gte: +bathroomCount,
            };
        }
        if (guestCount) {
            query.guestCount = {
                gte: +guestCount,
            };
        }

        if (locationValue) {
            query.locationValue = locationValue;
        }

        if (startDate && endDate) {
            query.NOT = {
                //역방향 필터링 사용하여 아래의 조건을 뒤집는다.
                // reservation collection 에 예약이 안되있는 기간을 검색
                reservations: {
                    // some : 적어도 하나이상의 이하 조건이 만족하는거
                    some: {
                        OR: [
                            // 1.  기존 예약된 reservation collection 에서

                            // startDate 설정
                            {
                                // 2. endDate 보다 내가 선택한 startDate가 크거나 같은날과
                                endDate: { gte: startDate },
                                // 3. startDate 보다 작거나 같은 날
                                startDate: { lte: startDate },
                                // 4. 즉 endDate <= search startDate >= startDate
                            },
                            // endDate 설정
                            {
                                // 5. startDate 보다 내가 선택한 endDate가 작거나 같은날과
                                startDate: { lte: endDate },
                                // 6. endDate 보다 크거나 같은 날
                                endDate: { gte: endDate },
                                // 7. 즉 startDate >= search endDate >= endDate
                            },
                        ],
                    },
                },
            };
        }

        const listings = await prisma.listing.findMany({
            where: query,
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
