import { TbBeach, TbMountain, TbPool } from 'react-icons/tb';
import Container from '../Container';
import { GiBarn, GiBoatFishing, GiCactus, GiCastle, GiCaveEntrance, GiForestCamp, GiIsland, GiWindmill } from 'react-icons/gi';
import { MdOutlineVilla } from 'react-icons/md';
import CategoryBox from '../CategoryBox';
import { usePathname, useSearchParams } from 'next/navigation';
import { FaSkiing } from 'react-icons/fa';
import { BsSnow } from 'react-icons/bs';
import { IoDiamond } from 'react-icons/io5';

export const categories = [
   {
      label: 'Beach',
      icon: TbBeach,
      description: 'This propertiy is close to the beach!',
   },
   {
      label: 'Windmills',
      icon: GiWindmill,
      description: 'This propertiy has windmills!',
   },
   {
      label: 'Modern',
      icon: MdOutlineVilla,
      description: 'This propertiy is modern!',
   },
   {
      label: 'Countryside',
      icon: TbMountain,
      description: 'This propertiy is countryside!',
   },
   {
      label: 'Pool',
      icon: TbPool,
      description: 'This propertiy has a pool!',
   },
   {
      label: 'Islands',
      icon: GiIsland,
      description: 'This propertiy is on an island!',
   },
   {
      label: 'Lake',
      icon: GiBoatFishing,
      description: 'This propertiy is close to a lake!',
   },
   {
      label: 'Skiing',
      icon: FaSkiing,
      description: 'This propertiy has skiing activities!',
   },
   {
      label: 'Castles',
      icon: GiCastle,
      description: 'This propertiy is in a castle!',
   },
   {
      label: 'Camping',
      icon: GiForestCamp,
      description: 'This propertiy has camping activities!',
   },
   {
      label: 'Arctic',
      icon: BsSnow,
      description: 'This propertiy has camping activities!',
   },
   {
      label: 'Cave',
      icon: GiCaveEntrance,
      description: 'This propertiy is in a cave!',
   },
   {
      label: 'Desert',
      icon: GiCactus,
      description: 'This propertiy is in the desert!',
   },
   {
      label: 'Barns',
      icon: GiBarn,
      description: 'This propertiy is in the barn!',
   },
   {
      label: 'Lux',
      icon: IoDiamond,
      description: 'This propertiy is luxurious!',
   },
];

const Categories = () => {
   const params = useSearchParams();
   const category = params?.get('category');
   const pathName = usePathname();
   const isMainPage = pathName === '/';
   if (!isMainPage) {
      return null;
   }

   return (
      <Container>
         <div
            className="
                pt-4
                flex
                flex-row
                ites-center
                justify-between
                overflow-x-auto
   "
         >
            {categories.map((item) => (
               <CategoryBox key={item.label} label={item.label} selected={category === item.label} icon={item.icon} />
            ))}
         </div>
      </Container>
   );
};

export default Categories;
