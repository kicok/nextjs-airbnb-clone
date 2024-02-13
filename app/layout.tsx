import { Nunito } from 'next/font/google';
import './globals.css';
import Navbar from './components/navbar/Navbar';
import ClientOnly from './components/ClientOnly';
import RegisterModal from './components/modals/RegisterModal';
import LoginModal from './components/modals/LoginModal';
import RentModal from './components/modals/RentModal';
import ToasterProvider from './providers/ToasterProvider';
import getCurrentUser from './actions/getCurrentUser';

export const metadata = {
    title: 'Airbnb',
    description: 'Airbnb clone',
};

const font = Nunito({
    subsets: ['latin'],
});

const onClose = () => {};
const onSubmit = () => {};
export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const currentUser = await getCurrentUser();
    return (
        <html lang="en">
            <body className={font.className}>
                {/* <ClientOnly> */}
                <ToasterProvider />
                <RentModal />
                <RegisterModal />
                <LoginModal />
                <Navbar currentUser={currentUser} />
                {/* </ClientOnly> */}
                <div className="pb-2- pt-28">{children}</div>
            </body>
        </html>
    );
}
