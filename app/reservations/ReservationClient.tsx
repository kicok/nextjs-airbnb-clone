'use client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

import { SafeReservation, SafeUser } from '../type';
import Container from '../components/Container';
import Heading from '../components/Heading';
import toast from 'react-hot-toast';
import ListingCard from '../components/listings/ListingCard';

interface ReservationClientProps {
    reservations: SafeReservation[];
    currentUser?: SafeUser | null;
}
const ReservationClient = ({ reservations, currentUser }: ReservationClientProps) => {
    const router = useRouter();
    const [deletingId, setDeleteingId] = useState('');

    const onCancel = useCallback(
        (id: string) => {
            setDeleteingId(id);

            axios
                .delete(`/api/reservations/${id}`)
                .then(() => {
                    toast.success('Reservation cancelled');
                    router.refresh();
                })
                .catch(() => {
                    toast.error('Something went wrong');
                })
                .finally(() => {
                    setDeleteingId('');
                });
        },
        [router]
    );
    return (
        <Container>
            <Heading title="Reservations" subtitle="Bookings on your properties" />
            <div
                className="
                    mt-10
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
                {reservations.map((reservation) => (
                    <ListingCard
                        key={reservation.id}
                        reservation={reservation}
                        data={reservation.listing}
                        actionId={reservation.id}
                        onAction={onCancel}
                        disabled={deletingId === reservation.id}
                        actionLabel="Cancel guest reservation"
                        currentUser={currentUser}
                    />
                ))}
            </div>
        </Container>
    );
};

export default ReservationClient;
