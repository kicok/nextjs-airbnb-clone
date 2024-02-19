import prisma from '@/app/libs/prismadb';
import getCurrentUser from './getCurrentUser';

const getFavoriteListings = async () => {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return [];
        }

        // user collections에서 바로 가져오지 않는 이유는 이미 currentUser.favoriteIds 값을 가지고 있으므로 listing 에서 in 으로 가져오는게 빠르므로...
        const favorites = await prisma.listing.findMany({
            where: {
                id: {
                    in: [...(currentUser.favoriteIds || [])],
                },
            },
        });

        const safeFavorites = favorites.map((favorite) => ({
            ...favorite,
            createdAt: favorite.createdAt.toISOString(),
        }));

        return safeFavorites;
    } catch (error: any) {
        throw new Error(error);
    }
};

export default getFavoriteListings;
