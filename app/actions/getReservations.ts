import prisma from '@/app/libs/prismadb';

interface IPrams {
    listingId?: string;
    userId?: string;
    authorId?: string;
}

export default async function getReservations(params: IPrams) {
    try {
        const { listingId, userId, authorId } = params;

        const query: any = {};

        if (listingId) {
            query.listingId = listingId;
        }

        if (userId) {
            query.userId = userId; // 현재 로그인한 사용자의 예약 현황
        }

        if (authorId) {
            query.listing = { userId: authorId }; // 현재 로그인한 사용자가 작성한 게시물에 예약요청이 들어왔을때
        }

        const reservations = await prisma.reservation.findMany({
            where: query,
            include: {
                listing: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        const safeReservations = reservations.map((reservation) => ({
            ...reservation,
            createdAt: reservation.createdAt.toISOString(),
            startDate: reservation.startDate.toISOString(),
            endDate: reservation.endDate.toISOString(),
            listing: {
                ...reservation.listing,
                createdAt: reservation.listing.createdAt.toISOString(),
            },
        }));

        // console.log('reservation', reservations);

        return safeReservations;
    } catch (error: any) {
        throw new Error(error);
    }
}
