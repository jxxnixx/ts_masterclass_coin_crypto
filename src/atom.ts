// atom은 두 가지를 요구함.
// key - 이름, 유일해야 함.
// 기본값
// 이게 우리가 버블을 만들기 위한 전부임.
// 그럼 App, chart와 어떻게 연결할까?
// App.tsx에 useRecoilValue를 쓰고 const 변수에 넣어 사용하면 됨.

import { atom } from "recoil";

export const isDarkAtom = atom({
    key : "isDark",
    default : true,
});