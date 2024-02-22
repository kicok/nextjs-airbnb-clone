import getCurrentUser from './actions/getCurrentUser';
import getListings, { IListingsPrams } from './actions/getListings';
import ClientOnly from './components/ClientOnly';
import Container from './components/Container';
import EmptyState from './components/EmptyState';
import ListingCard from './components/listings/ListingCard';

interface HomeProps {
    searchParams: IListingsPrams;
}

export const dynamic = 'force-dynamic'; // 'auto' | 'force-dynamic' | 'error' | 'force-static';
// useSearchParams(), searchParams 값들을 사용해 페이지 변화가 이루어지고 이에 따라 render되는 html이 바껴야 하므로 build시에 동적랜더링으로 강제 변환해야 build가 정상적으로 될수 있음.
//  Next JS에는 정적 렌더링 / 동적 렌더링이 있는데, 정적 렌더링이 기본이고, 퍼포먼스상의 이유로 Next는 정적 렌더링을 권고한다. 페이지마다 둘중 하나를 선택할 수 있다.

export default async function Home({ searchParams }: HomeProps) {
    const listings = await getListings(searchParams);
    const currentUser = await getCurrentUser();

    if (listings.length === 0) {
        return (
            <ClientOnly>
                <EmptyState showReset />
            </ClientOnly>
        );
    }

    return (
        <ClientOnly>
            <Container>
                <div
                    className="
                     pt-24
                     grid
                     grid-cols-1
                     sm:grid-cols-2
                     md:grid-cols-3
                     lg:grid-cols-4
                     xl:grid-cols-5
                     2xl:grid-cols-6
                     gap-8
            
            "
                >
                    {listings.map((listing) => {
                        return (
                            <ListingCard
                                key={listing.id}
                                data={listing}
                                currentUser={currentUser}
                            />
                        );
                    })}
                </div>
            </Container>
        </ClientOnly>
    );
}
