import EmptyState from '../components/EmptyState';
import ClientOnly from '../components/ClientOnly';

import getCurrentUser from '../actions/getCurrentUser';
import getReservations from '../actions/getReservations';
import ReservationClient from './ReservationClient';

const ReservationPage = async () => {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
        return (
            <ClientOnly>
                <EmptyState title="Unauthroized" subtitle="Please login" />;
            </ClientOnly>
        );
    }

    const reservations = await getReservations({
        authorId: currentUser.id, // listing을 작성한 userId
    });

    if (reservations.length === 0) {
        return (
            <ClientOnly>
                <EmptyState
                    title="No reservations found"
                    subtitle="Looks like you have no reservations on your properties"
                />
            </ClientOnly>
        );
    }

    return (
        <ClientOnly>
            <ReservationClient reservations={reservations} currentUser={currentUser} />;
        </ClientOnly>
    );
};

export default ReservationPage;
