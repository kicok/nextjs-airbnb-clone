'use client';

import { AiOutlineMenu } from 'react-icons/ai';
import Avatar from '../Avatar';
import { useCallback, useState } from 'react';

import MenuItem from './MenuItem';

import useRegisterModal from '@/app/hooks/useRegisterModal';
import useLoginModal from '@/app/hooks/useLoginModal';
import useRentModal from '@/app/hooks/useRentModal';
import { signOut } from 'next-auth/react';
import { SafeUser } from '@/app/type';

interface UserMenuProps {
   currentUser?: SafeUser | null;
}
const UserMenu = ({ currentUser }: UserMenuProps) => {
   const registerModal = useRegisterModal(); // zustand
   const loginModal = useLoginModal(); // zustand
   const rentModal = useRentModal(); // zustand

   const [isOpen, setIsOpen] = useState(false);
   const toggleOpen = useCallback(() => {
      setIsOpen((value) => !value);
   }, []);

   const onRent = useCallback(() => {
      if (!currentUser) {
         return loginModal.onOpen();
      }

      // Open Rent Modal
      rentModal.onOpen();
   }, [currentUser, loginModal, rentModal]);
   return (
      <div className="relative">
         <div className="flex flex-row items-center gap-3">
            <div
               onClick={() => onRent()}
               className="
                    hidden
                    md:block
                    text-sm
                    font-semibold
                    py-3
                    px-4
                    rounded-full
                    hover:bg-neutral-100
                    transition
                    cursor-pointer                
                "
            >
               Airbnb your home
            </div>
            <div
               onClick={toggleOpen}
               className="
                    p-4
                    md:py-1
                    border-[1px]
                    border-neutral-200
                    flex
                    flex-row
                    items-center
                    gap-3
                    rounded-full
                    cursor-pointer
                    hover:shadow-md
                    transition
                

                "
            >
               <AiOutlineMenu />
               <div className="hidden md:block">
                  <Avatar src={currentUser?.image} />
               </div>
            </div>
         </div>

         {isOpen && (
            <div
               className="
                    absolute 
                    rounded-xl 
                    shadow-md 
                    w-[40vw] 
                    md:w-3/4 
                    bg-white
                    overflow-hidden
                    right-0
                    top-12
                    text-sm
                    "
            >
               <div className="flex flex-col cursor-pointer">
                  {currentUser ? (
                     <>
                        <MenuItem onclick={() => {}} label="My trips" />
                        <MenuItem onclick={() => {}} label="My favorites" />
                        <MenuItem onclick={() => {}} label="My reservations" />
                        <MenuItem onclick={() => {}} label="My properties" />
                        <MenuItem onclick={() => rentModal.onOpen()} label="Airbnb my home" />
                        <hr />
                        <MenuItem onclick={() => signOut()} label="Logout" />
                     </>
                  ) : (
                     <>
                        <MenuItem onclick={loginModal.onOpen} label="Login" />
                        <MenuItem onclick={registerModal.onOpen} label="Sign up" />
                     </>
                  )}
               </div>
            </div>
         )}
      </div>
   );
};

export default UserMenu;
