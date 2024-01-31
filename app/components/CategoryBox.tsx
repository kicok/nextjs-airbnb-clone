'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import qs from 'query-string';
import { useCallback } from 'react';
import { IconType } from 'react-icons';

interface CategoryBoxProps {
   label: string;
   icon: IconType;
   selected?: boolean;
}
const CategoryBox = ({ label, icon: Icon, selected }: CategoryBoxProps) => {
   const router = useRouter();
   const params = useSearchParams();

   const handleClick = useCallback(() => {
      let currentQuery = {};

      if (params) {
         currentQuery = qs.parse(params.toString()); // url의 파라미터를 객체로 변환 '?foo=bar' => {foo: 'bar'}
         //https://www.npmjs.com/package/query-string
      }

      const updateQuery: any = {
         ...currentQuery,
         category: label, // category:label 추가 => url 생성
      };

      if (params?.get('category') === label) {
         // 같은 카테고리가 다시 선택되었다면 updateQuery에서 category 객체 삭제 => 클릭할때마다 반전하는 toggle 형태
         delete updateQuery.category;
      }

      // 객체를 url로 만든다.
      const url = qs.stringifyUrl(
         {
            url: '/',
            query: updateQuery,
         },
         { skipNull: true } // 파라미터가 (null | undefined) 이면 skip
      );

      router.push(url);
   }, [params, label, router]);
   return (
      <div
         onClick={handleClick}
         className={`             
                flex
                flex-col
                items-center
                justify-center
                gap-2
                p-3
                border-b-2
                hover:text-neutral-800
                transition
                cursor-pointer
                ${selected ? 'border-b-neutral-800' : 'border-transparent'}
                ${selected ? 'text-neutral-800' : 'text-neutral-500'}
   `}
      >
         <Icon size={26} />
         <div className="font-medium text-sm">{label}</div>
      </div>
   );
};

export default CategoryBox;
