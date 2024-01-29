import { Nunito } from 'next/font/google';
import './globals.css';
import Navbar from './components/navbar/Navbar';
import Modal from './components/modal/Modal';
import ClientOnly from './components/ClientOnly';

export const metadata = {
   title: 'Airbnb',
   description: 'Airbnb clone',
};

const font = Nunito({
   subsets: ['latin'],
});

const onClose = () => {};
const onSubmit = () => {};
export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="en">
         <body className={font.className}>
            <Modal actionLabel="Submit" isOpen title="Login Modal" />
            <Navbar />

            {children}
         </body>
      </html>
   );
}
