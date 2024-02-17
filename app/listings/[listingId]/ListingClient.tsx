'use client';
import axios from 'axios';
import toast from 'react-hot-toast';
import { differenceInCalendarDays, eachDayOfInterval } from 'date-fns';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Container from '@/app/components/Container';
import { SafeListing, SafeReservation, SafeUser } from '@/app/type';
import ListingHead from '@/app/components/listings/ListingHead';
import ListingInfo from '@/app/components/listings/ListingInfo';
import { categories } from '@/app/components/navbar/Categories';
import ListingReservation from '@/app/components/listings/ListingReservation';

import useLoginModal from '@/app/hooks/useLoginModal';
import { Range } from 'react-date-range';

const initialDateRange = {
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
};

interface ListingClientProps {
    reservations?: SafeReservation[];

    // prisma에서 값을 가져올때 listing을 호출할때 include{user:true} 가 있으므로 user 타입을 추가한다.
    listing: SafeListing & {
        user: SafeUser;
    };
    currentUser?: SafeUser | null;
}

const ListingClient = ({ listing, reservations = [], currentUser }: ListingClientProps) => {
    const loginModal = useLoginModal();
    const router = useRouter();

    //예약 날짜의 시작일~종료일사이의 기간을 비활성화시키기위한 코드
    const disabledDates = useMemo(() => {
        let dates: Date[] = [];

        reservations.forEach((reservation) => {
            // eachDayOfInterval : 지정된 시간 간격내의 날짜배열을 반환한다.
            const range = eachDayOfInterval({
                start: new Date(reservation.startDate),
                end: new Date(reservation.endDate),
            });

            dates = [...dates, ...range];
        });
        return dates;
    }, [reservations]);

    const [isLoading, setIsLoading] = useState(false);
    const [totalPrice, setTotalPrice] = useState(listing.price);
    const [dateRange, setDateRange] = useState<Range>(initialDateRange);

    const onCreateReservation = useCallback(() => {
        if (!currentUser) {
            return loginModal.onOpen();
        }
        setIsLoading(true);

        axios
            .post('/api/reservations', {
                totalPrice,
                startDate: dateRange.startDate,
                endDate: dateRange.endDate,
                listingId: listing.id,
            })
            .then(() => {
                toast.success('Listing reserverd');
                setDateRange(initialDateRange);
                // Redirect to /trips
                router.refresh();
            })
            .catch(() => {
                toast.error('Something went wrong');
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [currentUser, loginModal, dateRange, listing, router, totalPrice]);

    // totalPrice
    useEffect(() => {
        if (dateRange.startDate && dateRange.endDate) {
            const dayCount = differenceInCalendarDays(dateRange.endDate, dateRange.startDate);
            /**
             *  * const result = differenceInCalendarDays(
             *   new Date(2011, 6, 3, 0, 1),
             *   new Date(2011, 6, 2, 23, 59)
             * )==> 1
             */
            // const dayCount2 = differenceInDays(dateRange.endDate, dateRange.startDate);
            // 위의 코드처럼 2날짜사이의 날짜의 차이를 게산 하지만 시간개념이 추가되어 24시간 미만이면 1일이 아님
            // 즉 1일은 현지시간과 이전날의 현지시간이 같아질 때를 말함.

            /**
             * * const result = differenceInDays(
             *   new Date(2011, 6, 3, 0, 1),
             *   new Date(2011, 6, 2, 23, 59)
             * ) => 0
             *
             */

            if (dayCount && listing.price) {
                setTotalPrice(dayCount * listing.price);
            } else {
                setTotalPrice(listing.price); // 1박 비용: dafault값 (calendar의 날짜를 선택하지 않았을때)
            }
        }
    }, [dateRange, listing.price]);

    const category = useMemo(() => {
        return categories.find((item) => item.label === listing.category);
    }, [listing.category]);
    return (
        <Container>
            <div className="max-w-screen-lg mx-auto">
                <div className="flex flex-col gap-6">
                    <ListingHead
                        title={listing.title}
                        imageSrc={listing.imageSrc}
                        locationValue={listing.locationValue}
                        id={listing.id}
                        currentUser={currentUser}
                    />
                    <div
                        className="
                        grid
                        grid-cols-1
                        md:grid-cols-7
                        md:gap-10
                        mt-6
                     "
                    >
                        <ListingInfo
                            user={listing.user}
                            category={category}
                            description={listing.description}
                            guestCount={listing.guestCount}
                            roomCount={listing.roomCount}
                            bathroomCount={listing.bathroomCount}
                            locationValue={listing.locationValue}
                        />
                        <div
                            className="
                                order-first
                                mb-10
                                md:order-last
                                md:col-span-3
                            "
                        >
                            <ListingReservation
                                price={listing.price}
                                totalPrice={totalPrice}
                                onChangeDate={(value) => setDateRange(value)}
                                dateRange={dateRange}
                                onSubmit={onCreateReservation}
                                disabled={isLoading}
                                disabledDates={disabledDates}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default ListingClient;
