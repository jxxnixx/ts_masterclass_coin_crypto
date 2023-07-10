/// App.tsx

import Circle from './Circle';

function App() {
  return (
    <div>
      <Circle bgColor = "teal"/>
      <Circle bgColor = "tomato"/>
    </div>
  );
}


/// Circle.tsx

import styled from "styled-components";

interface ContainerProps {
    bgColor : string;
}

const Container = styled.div<ContainerProps>`
    width : 200px;
    height : 200px;
    background-color : ${(props) => props.bgColor};
    border-radius : 100px;
`;

interface CircleProps {
    bgColor : string;
}

function Circle({bgColor} : CircleProps) { 
                // 이 bgColor의 type은 CircleProps의 obj이라고 말하는 것.
    return <Container bgColor={bgColor} />;
}

export default Circle;

// interface : object가 어떤 식으로 보일지를 설명해주는 것.
// 즉, object의 shape를 확인하도록 해줌.
// react의 propTypes와 비슷하나, 
// 차이점은 interface는 TypeScript와 코드가 실행되기 전에 확인해 준다는 것.
// JS는 런타임 에러! 그럼 사용자에게 좋지 않음. TS는 애초에 방지 가능.

// interface 예제

interface PlayerShape {
    name : string;
    age : number;
}

const sayHello = (playerObj : PlayerShape) => 
`Hello ${playerObj.name} you are ${playerObj.age} years old.`;

console.log(sayHello({name : "nico", age : 12}));


//// Optional props

interface ContainerProps {
  bgColor : string;

  borderColor : string; 
  // 이렇게 쓰면, 
  // css 적용할 바로 아래 styled component인 container에서
  // borderColor는 optional이 아닌 required가 됨.

  // 왜냐하면 색깔을 지정해두긴 해야 하잖아!
  // 아무것도 지정하지 않으면 나중에 사용됐을 때 할 수 있는 게 없으니까.

  // CircleProps에서 borderColor가 optional 이므로 
  // undefined가 될 수도 있다고 설정해줬지만,
  // 에러가 뜸.
}

const Container = styled.div<ContainerProps>`
  width : 200px;
  height : 200px;
  background-color : ${(props) => props.bgColor};
  border-radius : 100px;
  border : 1px solid ${(props) => props.borderColor}; 
`;


interface CircleProps {
  bgColor : string;      // default props, required
  borderColor ?: string; // optional props
  // borderColor : string | undefined 와 동일
}

function Circle({bgColor, borderColor} : CircleProps) { 
  return <Container bgColor={bgColor} borderColor = {borderColor} />; //
}

// 따라서,

function Circle({bgColor, borderColor} : CircleProps) { 
  return <Container bgColor={bgColor} borderColor = {borderColor ?? "white"} />;
}

// borderColor는 사용자가 만든 borderColor이며,
// 만약 undefined된 상태라면
// 초깃값 skyblue 보낸다고 설정해 해결할 수 있음.

function Circle({bgColor, borderColor} : CircleProps) { 
  return <Container bgColor={bgColor} borderColor = {borderColor ?? bgColor} />;
}

// 아니면, bgColor로 초깃값을 설정해 주든지.


// 인자 argument 상에서 초깃값 설정도 가능함.
// 이건 완전히 optional.

interface CircleProps {
  bgColor : string; 
  borderColor ?: string; 
  text ?: string;
}

// text의 초깃값은 "default text"
function Circle({bgColor, borderColor, text = "default text"} : CircleProps) { 
  return (
      <Container bgColor={bgColor} borderColor = {borderColor ?? "white"}>
          {text}
      </Container>
  );
}

// 그리고 App.tsx에서는
function App() {
  return (
    <div>
      <Circle borderColor = "skyblue" bgColor = "teal"/>
      <Circle text = "I'm here" bgColor = "tomato"/> 
    </div>
  );
}

//// State
function Circle({bgColor, borderColor} : CircleProps) { 
  const [value, setValue] = useState(0); 
  // 초깃값을 0으로 설정해줬기 때문에, ts는 value가 number라는 사실을 추측

  return (
      <Container bgColor={bgColor} borderColor = {borderColor ?? "white"} />
  );
}

// 여기서, value가 number 혹은 string 타입을 가지도록 하려면

const [value, setValue] = useState<number|string>(0);  // 이렇게 변경!

// 일반적으로는, state를 만들면 보통 같은 타입으로 쭉 감.
// 사용할 일은 많이 없을 것.


//// Form

import React, {useState} from "react";

function App() {
  const [value, setValue] = useState("");
  
  const onChange = (event : React.FormEvent<HTMLInputElement>) => {
    // 위 과정은, ts에게 event가 뭔지 설명하기 위한 것.
    // FormEvent 내에서, 우리는 어떤 종류의 element가 
    // onChange 이벤트를 발생시킬지를 특정할 수 있음.
    // HTMLInputElement를 통해서 
    // ts는 onChange 함수가 inputElement에 의해 실행될 것을 앎.

    // Synthetic Event

    const {currentTarget : {value}} = event;
    setValue(value);
    // 이 일련의 과정들은 value를 보호해주는 것.
  };

  const onSubmit = (event : React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("hello", value);
  }
  return (
    <div>
      <form onSubmit = {onSubmit}>
        <input
          value = {value}
          onChange = {onChange}
          type = "text"
          placeholder = "username"
        />
        <button>Log in</button>
      </form>
    </div>
  );
}


//// Theme_2

// styled.d.ts

import 'styled-components';
// theme 변경으로 btnColor는 optional로 변경하겠음! 에러 뜸

declare module 'styled-components' {
  export interface DefaultTheme {
    bgColor : string;
    textColor : string;
    btnColor ?: string;
  }
}

// theme.ts

import { DefaultTheme } from "styled-components";

export const lightTheme : DefaultTheme = {
    bgColor : "white",
    textColor : "black",
    btnColor : "tomato",
};

export const darkTheme : DefaultTheme = {
    bgColor : "black",
    textColor : "white",
    btnColor : "teal",
}

// index.ts

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '../App';
import { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme } from '../theme';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <ThemeProvider theme = {darkTheme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);

// App.ts

import styled from "styled-components";

const Container = styled.div`
  background-color : ${(props) => props.theme.bgColor}; 
`;
// theme 밖에서도 theme에 접근할 수 있엉! 짱 멋져!
// 보호를 제공받으면서 실수도 예방하고 접근도 가능! 

const H1 = styled.h1`
  color : ${(props) => props.theme.textColor};
`;

function App() {
  return (
    <Container>
      <H1>protected!</H1>
    </Container>
  );
}


///// #4. Router

// Coin.tsx

function Coin() {
  return <h1>Coin</h1>;
}

// Coins.tsx

function Coins() {
  return <h1>Coins</h1>;
}

// Router.tsx

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Coins from "./routes/Coins";
import Coin from "./routes/Coin";

function Router() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path = "/" element = {<Coin/>}></Route>
                <Route path = "/:coinID" element={<Coins/>}></Route>
                { // coinID <- 이 부분이, 
                  // Router에게 우리 URL이 변수값을 갖는다는 걸 말해주는 방식임.
                  // 즉, Router에게 URL의 이 부분의 값에 우린 관심이 있다고 말해주는 것.
                }
            </Routes>
        </BrowserRouter>
    )

}

// 이후에 
// App.tsx에 Router 불러주기

import Router from "./Router";

function App() {
  return <Router />;
}


//// Styles

/// styled.d.ts

import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    bgColor : string;
    textColor : string;
    accentColor : string;
  }
}

/// theme.ts


import { DefaultTheme } from "styled-components";

export const Theme : DefaultTheme = {
    bgColor : "#2f3640",
    textColor : "#f5f5fa",
    accentColor : "#44cd07",
}


/// Coin.tsx

import { useParams } from "react-router";
// useParams : 우리가 URL에서 관심 있어 하는 정보를 잡아낼 수 있게 해주는 것

function Coin() {
    const {coinID} = useParams();
    // ts에게 useParams가 coinID를 포함하는 오브젝트를 반환할 것이라고 말해줌.

    return <h1>Coin : {coinID} </h1>;
}

/// Coins.tsx

import styled from "styled-components";

const Title = styled.h1`
    color : ${(props) => props.theme.accentColor};
`;

function Coins() {
    return <Title>Coins</Title>;
}

/// App.tsx

import { createGlobalStyle } from "styled-components";
import Router from "./Router";

// 이 컴포넌트가 렌더링될 때, 전역 스코프에 스타일을 올려 줌!
// 현재 있는 css는 Reset css. 브라우저 상의 기본 css를 전부 없애 줌.
const GlobalStyle = createGlobalStyle`
@import url('https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300;400&display=swap');
  html, body, div, span, applet, object, iframe,
  h1, h2, h3, h4, h5, h6, p, blockquote, pre,
  a, abbr, acronym, address, big, cite, code,
  del, dfn, em, img, ins, kbd, q, s, samp,
  small, strike, strong, sub, sup, tt, var,
  b, u, i, center,
  dl, dt, dd, menu, ol, ul, li,
  fieldset, form, label, legend,
  table, caption, tbody, tfoot, thead, tr, th, td,
  article, aside, canvas, details, embed,
  figure, figcaption, footer, header, hgroup,
  main, menu, nav, output, ruby, section, summary,
  time, mark, audio, video {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
  }
  /* HTML5 display-role reset for older browsers */
  article, aside, details, figcaption, figure,
  footer, header, hgroup, main, menu, nav, section {
    display: block;
  }
  /* HTML5 hidden-attribute fix for newer browsers */
  *[hidden] {
      display: none;
  }
  body {
    line-height: 1;
  }
  menu, ol, ul {
    list-style: none;
  }
  blockquote, q {
    quotes: none;
  }
  blockquote:before, blockquote:after,
  q:before, q:after {
    content: '';
    content: none;
  }
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }
  * {
    box-sizing : border-box;
  }
  body {
    font-family: 'Source Sans Pro', sans-serif;
    background-color : ${(props) => props.theme.bgColor};
    color : ${(props) => props.theme.textColor}
  }
  a {
    text-decoration : none; // 밑줄 없애기
  }
`;
// Theme 설정되었고, Theme은 ThemeProvider로 인해 주어진 거고, 
// index.tsx를 보면 App은 ThemeProvider내에 존재하므로
// App에서 Theme에 접근 가능!


function App() {
  return (
    <> 
      <GlobalStyle/>
      <Router/>
    </>
  )
}

// <> : fragment. 유령 컴포넌트. 
// 부모 없이, 붙어 있는 많은 것을 리턴할 수 있게 해줌.
// 리턴 시 최종 컴포넌트는 하나여야 하므로.
 

///// Home_1 ) Coins 홈페이지 스타일 변경

import { Link } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  padding: 0px 20px;
`;

const Header = styled.header`
  height: 15vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CoinsList = styled.ul``;

const Coin = styled.li`
  background-color: white;
  color: ${(props) => props.theme.bgColor};
  border-radius: 15px;
  margin-bottom: 10px;
  a {
    padding: 20px; 
    // padding이 없으면 글씨 위에서만 클릭/링크 가능, 
    // padding을 넣어 줌으로써 글씨 주변 20px 전부 클릭 가능 영역이 됨.
    transition: color 0.2s ease-in;
    display: block; 
    // 선택 가능한 영역이 글씨에서 블록으로 늘어남.
  }
  &:hover {
    a {
      color: ${(props) => props.theme.accentColor};
    }
  }
`;

const Title = styled.h1`
  font-size: 48px;
  color: ${(props) => props.theme.accentColor};
`;

const coins = [
  {
    id: "btc-bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    rank: 1,
    is_new: false,
    is_active: true,
    type: "coin",
  },
  {
    id: "eth-ethereum",
    name: "Ethereum",
    symbol: "ETH",
    rank: 2,
    is_new: false,
    is_active: true,
    type: "coin",
  },
  {
    id: "hex-hex",
    name: "HEX",
    symbol: "HEX",
    rank: 3,
    is_new: false,
    is_active: true,
    type: "token",
  },
];

function Coins() {
  return (
    <Container>
      <Header>
        <Title>Coins</Title>
      </Header>
      <CoinsList>
        {coins.map((coin) => (
          <Coin key={coin.id}>
            <Link to={`/${coin.id}`}>{coin.name} &rarr;</Link>
          </Coin>
        ))}
      </CoinsList>
    </Container>
  );
}

//// Home_2) Coins data를 직접 저장해준 위와 달리, API를 통해 받아옴.

// step 1.

import { Link } from "react-router-dom";
import { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  padding: 0px 20px;

  max-width : 480px;
  margin : 0 auto;
  // 이 두 개를 추가해 주면 중앙에 위치하게 됨~
`;

const Header = styled.header`
  height: 15vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CoinsList = styled.ul``;

const Coin = styled.li`
  background-color: white;
  color: ${(props) => props.theme.bgColor};
  border-radius: 15px;
  margin-bottom: 10px;
  a {
    padding: 20px; 
    // padding이 없으면 글씨 위에서만 클릭/링크 가능, 
    // padding을 넣어 줌으로써 글씨 주변 20px 전부 클릭 가능 영역이 됨.
    transition: color 0.2s ease-in;
    display: block; 
    // 선택 가능한 영역이 글씨에서 블록으로 늘어남.
  }
  &:hover {
    a {
      color: ${(props) => props.theme.accentColor};
    }
  }
`;

const Title = styled.h1`
  font-size: 48px;
  color: ${(props) => props.theme.accentColor};
`;

// 서버에서 API를 연결해 데이터를 가져와 사용하려면,
// ts에게 우리 데이터가 어떻게 생겼는지 알려줘야 함!
// 따라서 해당 데이터의 interface를 만들어 ts에게 알려줘야 함.
// 데이터를 갖고 있던 coins를 지우고 interface 생성.

interface CoinInterface {
  id: string,
  name: string,
  symbol: string,
  rank: number,
  is_new: boolean,
  is_active: boolean,
  type: string,
},

function Coins() {
  const [coins, setCoins ] = useState<CoinInterface[]>([]);
  // 위에서 지운 coins를, useState 안에서 구현.
  // ts이므로, CoinInterface의 형식을 갖는다고 지정.
  return (
    <Container>
      <Header>
        <Title>Coins</Title>
      </Header>
      <CoinsList>
        {coins.map((coin) => (
          <Coin key={coin.id}>
            <Link to={`/${coin.id}`}>{coin.name} &rarr;</Link>
          </Coin>
        ))}
      </CoinsList>
    </Container>
  );
}

// step 2.

function Coins() {
  const [coins, setCoins ] = useState<CoinInterface[]>([]);
  
  // 코드가 언제 실행될지 고르기 위해 useEffect를 사용할 것.
  // , 뒤의 요소의 변화에 초점을 맞추기 때문에.

  // 그리고 async await를 사용할건데 또 함수를 만들긴 싫으니까
  // useEffect 안에서 쓸거임.
  // function 만들 때 쓸 수 있는 멋진 트릭 -> 그 자리에서 바로 function 실행 가능
  // 어떻게? 

  useEffect(() => {
    (async() => {
      const response = await fetch("https://api.coinpaprika.com/v1/coins");
      const json = await response.json();
      setCoins(json.slice(0,100));
    })(); // 이렇게! 해 주면! 바로 그 자리에서 실행! 
          // ()로 async 감싸고 그 괄호 끝나자마자 ()!
          // data 가 9000개가 넘으니까 100개만 가져오자!
  }, []);
  
  return (
    <Container>
      <Header>
        <Title>Coins</Title>
      </Header>
      <CoinsList>
        {coins.map((coin) => (
          <Coin key={coin.id}>
            <Link to={`/${coin.id}`}>{coin.name} &rarr;</Link>
          </Coin>
        ))}
      </CoinsList>
    </Container>
  );
}

// step 3.

const Loader = styled.span`
  text-align : center;
  display : block;
`;

function Coins() {

  const [coins, setCoins ] = useState<CoinInterface[]>([]);
  const [loading, setLoading] = useState(true); // setLoading 추가

  useEffect(() => {
    (async() => {
      const response = await fetch("https://api.coinpaprika.com/v1/coins");
      const json = await response.json();
      setCoins(json.slice(0,100));
      setLoading(false); // state 안에 코인이 다 세팅되면 loading을 false로!
    })(); 
  }, []);
  
  return (
    <Container>
      <Header>
        <Title>Coins</Title>
      </Header>
      {loading ? (   
        <Loader>"Loading..."</Loader> // 조건문 추가
      )}
      <CoinsList>
        {coins.map((coin) => (
          <Coin key={coin.id}>
            <Link to={`/${coin.id}`}>{coin.name} &rarr;</Link>
          </Coin>
        ))}
      </CoinsList>
    </Container>
  );
}
export default Coins;

// 이렇게 복잡하게 안 하고 react query 사용 가능


////// Route States

// Link Component 사용 시, 

// 1. string 이용. ex) <Link to = "/" ...>
// + query argument ex) <Link to = "/courses?sort=name" >

// 2. object 사용, 데이터 그 자체를 보낼 수도 있음.
// <Link 
// to={`/${coin.id}`}
// state = {{name : coin.name}} >

// 여기서, state : behind the scene 기법 

<Link 
  to={`/${coin.id}`}
  state = {{name : coin.name} 
  // 이렇게 하면 유저는 화면 전환 시 아무것도 볼 필요가 없게 됨.
  // 하지만, 사실 다른 화면으로 state를 보내고 있는 것임.
  // 어떻게 그 state를 받아올까?
  }
>
  <Img
    src={`https://cryptocurrencyliveprices.com/img/${coin.id}.png`}
  />
  {coin.name} &rarr;
</Link>


/// Coin.tsx

import { useState } from "react";
import { useLocation, useParams } from "react-router";
import styled from "styled-components";

const Container = styled.div`
  padding: 0px 20px;

  max-width : 480px;
  margin : 0 auto;
  // 이 두 개를 추가해 주면 중앙에 위치하게 됨~
`;

const Header = styled.header`
  height: 15vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 48px;
  color: ${(props) => props.theme.accentColor};
`;

const Loader = styled.span`
  text-align : center;
  display : block;
`;

function Coin() {
    const [loading, setLoading] = useState(true);
    const {coinID} = useParams();

    // state로 정보를 보내는 건, id를 활용하는 것보다 못생겼으므로
    // location, console.log를 이용해 무슨 정보가 오는지 알아보자!
    const location = useLocation();
    console.log(location);

    return( 
        <Container>
            <Header>
                <Title>Coin {coinID} </Title>
            </Header>
            {loading ? <Loader>"Loading..."</Loader> : null }
        </Container>
    );
}

// 똑같이, state 안에 있는 name을 가져와 보자.

const [loading, setLoading] = useState(true);
    const {coinID} = useParams();
    const {
        state : {name}, 
        // 여기 원래 에러임.
        // state라는 속성이 unknown이라 name이 존재하지 않다고 뜸.
    } = useLocation();


// 이걸 해결하려면, interface!! 속성 정의
interface RouteParams{
  coinID : string;
}

interface LocationParams {
  state: {
  name: string;
  rank: number;
  };
}

function Coin() {
  const [loading, setLoading] = useState(true);
  const { coinID } = useParams<keyof RouteParams>() as RouteParams;
  const { state } = useLocation() as LocationParams;
  // 이걸 이용하면, 
  // 타이틀에 coin의 name을 직접 뿌려줄 수 있다는 것!

  return( 
      <Container>
          <Header>
              <Title>{state.name}</Title> 
              { // 이렇게! 
              // 직접 API를 부르지 않고!
              // 이런 것들이 App을 빠르게 구동시키는 것처럼 보일 수 있음.
              // 이미 coin의 name은 state로 받아 알고 있으니까.

              // 근데, 누군가가 Home 화면에서 coin을 클릭해서 넘어오는 것이 아닌
              // url 자체로 넘어오려고 한다면
              // state가 생성되지 않아 에러가 뜰 것.

              // 즉, state가 생성되려면, 먼저 Home 화면을 열어야 함.
              // 우리가 클릭할 때 state가 생성되니까.
              // 이걸 해결하려면?
              }
          </Header>
          {loading ? <Loader>"Loading..."</Loader> : null }
      </Container>
  );
}

// 이렇게!

return( 
  <Container>
      <Header>
          <Title>{state?.name || "Loading.."}</Title>
          {
              // state가 존재하면 name을 가져오고
              // 아니면 Loading 출력
              // 그러니까 url을 쳐서 들어오면 Loading만 보게 되는 것!
          }
      </Header>
      {loading ? <Loader>"Loading..."</Loader> : null }
  </Container>
);


///// Coin Data
// 이제 코인 데이터를 화면에 출력해 보자!


function Coin() {
  const [loading, setLoading] = useState(true);
  const { coinID } = useParams<keyof RouteParams>() as RouteParams;
  const { state } = useLocation() as LocationParams;

  const [info, setInfo] = useState({});
  const [priceInfo, setPriceInfo] = useState({});

  useEffect(() => {
      (async() => {
          // 캡슐화. response를 받고, 그로부터 json을 받음.
          const infoData = await (
              await fetch(`https://api.coinpaprika.com/v1/coins/${coinID}`)
          ).json();
          const priceData = await (
              await fetch(`https://api.coinpaprika.com/v1/tickers/${coinID}`)
          ).json();

          setInfo(infoData); 
          setPriceInfo(priceData);
          // 받아온 데이터를 이렇게 state에 저장할 건데, 
          // 이렇게만 하면 ts가 앞 상황과 마찬가지로
          // info와 priceInfo는 빈 obj로 언제나 요소가 없을 것이라고 판단해
          // 아래에서 info.name 등을 사용할 수 없음.
          // 그러니까 또 처리해 줘야 함.

      })();
  },[]);

  return( 
      <Container>
          <Header>
              <Title>{state?.name || "Loading.."}</Title>
          </Header>
          {loading ? <Loader>"Loading..."</Loader> : null }
      </Container>
  );
}

///// Data Types

// 우리 마법의 유일한 결점
// - 무엇으로 이루어졌든 array가 있기만 하면, 그게 뭔지 직접 설명해줘야 한다는 것.

import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";
import styled from "styled-components";

const Container = styled.div`
  padding: 0px 20px;
  max-width : 480px;
  margin : 0 auto;
`;

const Header = styled.header`
  height: 15vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 48px;
  color: ${(props) => props.theme.accentColor};
`;

const Loader = styled.span`
  text-align : center;
  display : block;
`;

interface RouteParams{
    coinID : string;
}

interface LocationParams {
    state: {
    name: string;
    rank: number;
    };
}

interface InfoData {
    id: string;
    name: string;
    symbol: string;
    rank: number;
    is_new: boolean;
    is_active: boolean;
    type: string;
    description: string;
    message: string;
    open_source: boolean;
    started_at: string;
    development_status: string;
    hardware_wallet: boolean;
    proof_type: string;
    org_structure: string;
    hash_algorithm: string;
    first_data_at: string;
    last_data_at: string;
  }
  
  interface PriceData {
    id: string;
    name: string;
    symbol: string;
    rank: number;
    circulating_supply: number;
    total_supply: number;
    max_supply: number;
    beta_value: number;
    first_data_at: string;
    last_updated: string;
    quotes: {
      USD: {
        ath_date: string;
        ath_price: number;
        market_cap: number;
        market_cap_change_24h: number;
        percent_change_1h: number;
        percent_change_1y: number;
        percent_change_6h: number;
        percent_change_7d: number;
        percent_change_12h: number;
        percent_change_15m: number;
        percent_change_24h: number;
        percent_change_30d: number;
        percent_change_30m: number;
        percent_from_price_ath: number;
        price: number;
        volume_24h: number;
        volume_24h_change_24h: number;
      };
    };
  }

function Coin() {
    const [loading, setLoading] = useState(true);
    const { coinID } = useParams<keyof RouteParams>() as RouteParams;
    const { state } = useLocation() as LocationParams;

    const [info, setInfo] = useState<InfoData>(); //
    const [priceInfo, setPriceInfo] = useState<PriceData>(); //

    useEffect(() => {
        (async() => {
            const infoData = await (
                await fetch(`https://api.coinpaprika.com/v1/coins/${coinID}`)
            ).json();
            const priceData = await (
                await fetch(`https://api.coinpaprika.com/v1/tickers/${coinID}`)
            ).json();

            setInfo(infoData); 
            setPriceInfo(priceData);
            setLoading(false);
        })();
    },[coinID]);

    return( 
        <Container>
            <Header>
                <Title>{state?.name || "Loading.."}</Title>
            </Header>
            {loading ? <Loader>"Loading..."</Loader> : null }
        </Container>
    );
}

///// Nested Routes part One

import { useEffect, useState } from "react";
import { Routes, Route, useLocation, useParams } from "react-router";
import styled from "styled-components";
import Chart from "./Chart";
import Price from "./Price";

const Container = styled.div`
  padding: 0px 20px;
  max-width : 480px;
  margin : 0 auto;
`;

const Header = styled.header`
  height: 15vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 48px;
  color: ${(props) => props.theme.accentColor};
`;

const Loader = styled.span`
  text-align : center;
  display : block;
`;

const Overview = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 10px 20px;
  border-radius: 10px;
`;

const OverviewItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  span:first-child {
    font-size: 10px;
    font-weight: 400;
    text-transform: uppercase;
    margin-bottom: 5px;
  }
`;

const Description = styled.p`
  margin: 20px 0px;
`;


interface RouteParams{
    coinID : string;
}

interface LocationParams {
    state: {
    name: string;
    rank: number;
    };
}

interface InfoData {
    id: string;
    name: string;
    symbol: string;
    rank: number;
    is_new: boolean;
    is_active: boolean;
    type: string;
    description: string;
    message: string;
    open_source: boolean;
    started_at: string;
    development_status: string;
    hardware_wallet: boolean;
    proof_type: string;
    org_structure: string;
    hash_algorithm: string;
    first_data_at: string;
    last_data_at: string;
  }
  
  interface PriceData {
    id: string;
    name: string;
    symbol: string;
    rank: number;
    circulating_supply: number;
    total_supply: number;
    max_supply: number;
    beta_value: number;
    first_data_at: string;
    last_updated: string;
    quotes: {
      USD: {
        ath_date: string;
        ath_price: number;
        market_cap: number;
        market_cap_change_24h: number;
        percent_change_1h: number;
        percent_change_1y: number;
        percent_change_6h: number;
        percent_change_7d: number;
        percent_change_12h: number;
        percent_change_15m: number;
        percent_change_24h: number;
        percent_change_30d: number;
        percent_change_30m: number;
        percent_from_price_ath: number;
        price: number;
        volume_24h: number;
        volume_24h_change_24h: number;
      };
    };
  }

function Coin() {
    const [loading, setLoading] = useState(true);
    const { coinID } = useParams<keyof RouteParams>() as RouteParams;
    const { state } = useLocation() as LocationParams;

    const [info, setInfo] = useState<InfoData>();
    const [priceInfo, setPriceInfo] = useState<PriceData>();

    useEffect(() => {
        (async() => {
            const infoData = await (
                await fetch(`https://api.coinpaprika.com/v1/coins/${coinID}`)
            ).json();
            const priceData = await (
                await fetch(`https://api.coinpaprika.com/v1/tickers/${coinID}`)
            ).json();

            setInfo(infoData); 
            setPriceInfo(priceData);
            setLoading(false);
        })();
    },[coinID]);
    // []든 [coinID]든 상관 없음
    // []면 한 번 실행되고 끝이고,
    // [coinID]면 coinID가 url에 존재하기 때문에 불변임.
    // 따라서 동일하게 동작함.

    return( 
        <Container>
            <Header>
                <Title>
                  {state?.name ? state.name : loading ? "Loading.." : info?.name}
                  {
                    // Title에서 우리는 state에 name이 있는지 확인하고 있음.
                    // 여기서 state는 component로부터 오는 것이 아니라 location으로부터 오는 것.
                    // 위에 useLocation 사용함.
                    // name이 state에 있으니, 그 이름을 즉각적으로 보여줄 수 있고,
                    // 홈페이지로 와서 coin을 클릭할 때만 state?.name이 true가 될 것.
                    
                    // 혹은 우리가 loading 중이라면 "Loading..."을 보여줄 거고
                    // 아니라면 API로부터 받아온 name을 보여줄 것.
                    // 이 경우는 사용자가 홈페이지로부터 온 게 아닐 경우에 실행됨.
                    // 누군가 나에게 URL을 보내줘서 그것을 별도의 브라우저에서 열 때 실행.
                    // 그 상황엔 state가 없으므로, 앞 부분은 실행되지 않을 거고, 
                    // 로딩이면 로딩, 아니면 coin의 이름을 API로부터 (infoData를) 받아오는 것.
                  }
                </Title>
            </Header>
            {loading ? (
              <Loader>"Loading..."</Loader>
            ) : (
              <>
                <Overview>
                  <OverviewItem>
                    <span>Rank :</span>
                    <span>{info?.rank}</span>
                  </OverviewItem>
                  <OverviewItem>
                    <span>Symbol :</span>
                    <span>${info?.symbol}</span>
                  </OverviewItem>
                  <OverviewItem>
                    <span>Open Source :</span>
                    <span>${info?.open_source ? "Yes" : "No"}</span>
                  </OverviewItem>
                </Overview>
                <Description>{info?.description}</Description>
                <Overview>
                  <OverviewItem>
                    <span>Total Suply:</span>
                    <span>{priceInfo?.total_supply}</span>
                  </OverviewItem>
                  <OverviewItem>
                    <span>Max Supply:</span>
                    <span>{priceInfo?.max_supply}</span>
                  </OverviewItem>
                </Overview>
                {
                  // 나는 표나 차트 탭들을 state에 넣는 것 대신에 URL에서 컨트롤하고 싶음.
                  // 그래야 스크린이나 차트에 다이렉트로 접속할 수 있기 때문에.
                  // 이게 바로 Nested Routes
                }
                <Routes>
                  <Route path="chart" element={<Chart />} />
                  <Route path="price" element={<Price />} />
                </Routes>
              </>
            )}
        </Container>
    );
}


//// Nested Routes part Two

import { useEffect, useState } from "react";
import { Routes, Route, useLocation, useParams, useMatch } from "react-router";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Chart from "./Chart";
import Price from "./Price";

const Container = styled.div`
  padding: 0px 20px;
  max-width : 480px;
  margin : 0 auto;
`;

const Header = styled.header`
  height: 15vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 48px;
  color: ${(props) => props.theme.accentColor};
`;

const Loader = styled.span`
  text-align : center;
  display : block;
`;

const Overview = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 10px 20px;
  border-radius: 10px;
`;

const OverviewItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  span:first-child {
    font-size: 10px;
    font-weight: 400;
    text-transform: uppercase;
    margin-bottom: 5px;
  }
`;

const Description = styled.p`
  margin: 20px 0px;
`;

const Tabs = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin: 25px 0px;
  gap: 10px;
`;

const Tab = styled.span<{ isActive: boolean }>` 
// isActive라는 boolean 형태의 props

  text-align: center;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 400;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 7px 0px;
  border-radius: 10px;
  color: ${(props) =>
    props.isActive ? props.theme.accentColor : props.theme.textColor};
  a {
    display: block;
  }
`;

interface RouteParams{
    coinID : string;
}

interface LocationParams {
    state: {
    name: string;
    rank: number;
    };
}

interface InfoData {
    id: string;
    name: string;
    symbol: string;
    rank: number;
    is_new: boolean;
    is_active: boolean;
    type: string;
    description: string;
    message: string;
    open_source: boolean;
    started_at: string;
    development_status: string;
    hardware_wallet: boolean;
    proof_type: string;
    org_structure: string;
    hash_algorithm: string;
    first_data_at: string;
    last_data_at: string;
}
  
  interface PriceData {
    id: string;
    name: string;
    symbol: string;
    rank: number;
    circulating_supply: number;
    total_supply: number;
    max_supply: number;
    beta_value: number;
    first_data_at: string;
    last_updated: string;
    quotes: {
      USD: {
        ath_date: string;
        ath_price: number;
        market_cap: number;
        market_cap_change_24h: number;
        percent_change_1h: number;
        percent_change_1y: number;
        percent_change_6h: number;
        percent_change_7d: number;
        percent_change_12h: number;
        percent_change_15m: number;
        percent_change_24h: number;
        percent_change_30d: number;
        percent_change_30m: number;
        percent_from_price_ath: number;
        price: number;
        volume_24h: number;
        volume_24h_change_24h: number;
      };
    };
}

function Coin() {
    const [loading, setLoading] = useState(true);
    const { coinID } = useParams<keyof RouteParams>() as RouteParams;
    const { state } = useLocation() as LocationParams;

    const [info, setInfo] = useState<InfoData>();
    const [priceInfo, setPriceInfo] = useState<PriceData>();

    const priceMatch = useMatch("/:coinID/price");
    const chartMatch = useMatch("/:coinID/chart");
    // useMatch : 사용자가 특정한 URL에 있는지 여부를 알려줌.

    useEffect(() => {
        (async() => {
            const infoData = await (
                await fetch(`https://api.coinpaprika.com/v1/coins/${coinID}`)
            ).json();
            const priceData = await (
                await fetch(`https://api.coinpaprika.com/v1/tickers/${coinID}`)
            ).json();

            setInfo(infoData); 
            setPriceInfo(priceData);
            setLoading(false);
        })();
    },[coinID]);

    return( 
        <Container>
            <Header>
                <Title>
                  {state?.name ? state.name : loading ? "Loading.." : info?.name}
                </Title>
            </Header>
            {loading ? (
              <Loader>"Loading..."</Loader>
            ) : (
              <>
                <Overview>
                  <OverviewItem>
                    <span>Rank :</span>
                    <span>{info?.rank}</span>
                  </OverviewItem>
                  <OverviewItem>
                    <span>Symbol :</span>
                    <span>${info?.symbol}</span>
                  </OverviewItem>
                  <OverviewItem>
                    <span>Open Source :</span>
                    <span>${info?.open_source ? "Yes" : "No"}</span>
                  </OverviewItem>
                </Overview>
                <Description>{info?.description}</Description>
                <Overview>
                  <OverviewItem>
                    <span>Total Suply:</span>
                    <span>{priceInfo?.total_supply}</span>
                  </OverviewItem>
                  <OverviewItem>
                    <span>Max Supply:</span>
                    <span>{priceInfo?.max_supply}</span>
                  </OverviewItem>
                </Overview>

                <Tabs>
                  <Tab isActive = {chartMatch !== null}>
                    {
                      // useMatch가 true면, 해당 obj를 받고
                      // false면 null을 받는데,
                      // 이때 chartMatch가 맞으면,
                    }
                    <Link to = {`/${coinID}/chart`}>Chart</Link>
                  </Tab>
                  <Tab isActive = {priceMatch !== null}>
                    <Link to = {`/${coinID}/price`}>Price</Link>
                  </Tab>
                </Tabs>

                <Routes>
                  <Route path="chart" element={<Chart />} />
                  <Route path="price" element={<Price />} />
                </Routes>
              </>
            )}
        </Container>
    );
}




///////// React Query를 이용해 보자!!!

// React query는 우리가 우리 스스로 실행하고 있었던 로직들을 축약해 줌.
// fetch, loading, data, response, json ...

// Reactu query 사용을 위한 첫 단계는, api.ts에 fetcher 함수를 만드는 것.
// ex)
//  const response = await fetch("https://api.coinpaprika.com/v1/coins");
//  const json = await response.json();
// fetcher 함수는 꼭 fetch promise를 return해 줘야 함.

// Coins.tsx

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { useQuery } from "react-query";
import { fetchCoins } from "../api";

const Container = styled.div`
  padding: 0px 20px;

  max-width : 480px;
  margin : 0 auto;
  // 이 두 개를 추가해 주면 중앙에 위치하게 됨~
`;

const Header = styled.header`
  height: 15vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CoinsList = styled.ul``;

const Coin = styled.li`
  background-color: white;
  color: ${(props) => props.theme.bgColor};
  border-radius: 15px;
  margin-bottom: 10px;
  a {
    padding: 20px; 
    // padding이 없으면 글씨 위에서만 클릭/링크 가능, 
    // padding을 넣어 줌으로써 글씨 주변 20px 전부 클릭 가능 영역이 됨.

    transition: color 0.2s ease-in;
    display: flex; 
    // block -> 선택 가능한 영역이 글씨에서 블록으로 늘어남.
    // flex로 변경 -> 요소를 수평으로.

    align-items : center;
  }
  &:hover {
    a {
      color: ${(props) => props.theme.accentColor};
    }
  }
`;

const Title = styled.h1`
  font-size: 48px;
  color: ${(props) => props.theme.accentColor};
`;

const Loader = styled.span`
  text-align : center;
  display : block;
`;

const Img = styled.img`
  width : 35px;
  height : 35px;
  margin-right : 10px;
`;

interface CoinInterface {
  id: string,
  name: string,
  symbol: string,
  rank: number,
  is_new: boolean,
  is_active: boolean,
  type: string,
};

function Coins() {

  const {isLoading, data} = useQuery("allCoins", fetchCoins)
  // useQuery는 두 가지 인자가 필요한데
  // 첫 번째는 queryKey로, 우리 query의 고유식별자임.
  // 두 번째는 fetcher 함수로, 우리가 미리 만들어둔 파일에 존재함.
  
  // useQuery의 멋진 점 중 하나는 isLoading 이라고 불리는 boolean 값을 return 한다는 것.
  
  // react query의 멋진 점. 
  // 1. useQuery라는 hook이 fetcher 함수 fetchCoins를 불러오고
  // fetcher 함수가 isLoading 이라면, react query가 말해줌.
  // fetcher 함수가 끝나도, react query가 말해줌.
  // 2. fetchCoins가 끝나면, react query는 그 함수의 데이터를
  // 저 앞의 data에 넣어줄 것임.

  // index.js에 queryClient, queryClientProvider를 설정하자!

  /*
  const [coins, setCoins ] = useState<CoinInterface[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async() => {
      const response = await fetch("https://api.coinpaprika.com/v1/coins");
      const json = await response.json();
      setCoins(json.slice(0,100));
      setLoading(false); // state 안에 코인이 다 세팅되면 loading을 false로!
    })(); 
  }, []);
  */
  
  return (
    <Container>
      <Header>
        <Title>Coins</Title>
      </Header>
      {isLoading ? (                    // isLoading으로 바꿔주고
        <Loader>"Loading..."</Loader>
      ) : (
      <CoinsList>
        {data.map((coin) => (            // data로 바꿔주고
                  // 근데, ts가 data가 뭔지 모르기 때문에 에러가 뜸.
                  // 그러면 interface 넣어주면 되겠지
                  
          <Coin key = {coin.id}>
            <Link 
              to={`/${coin.id}`}
              state = {{name : coin.name}}
            >
              <Img
                src={`https://cryptocurrencyliveprices.com/img/${coin.id}.png`}
              />
              {coin.name} &rarr;
            </Link>
          </Coin>
        ))}
      </CoinsList>
      )}
    </Container>
  );
}

// 이렇게! 배열이거나 undefined.

const {isLoading, data} = useQuery<CoinInterface[]>("allCoins", fetchCoins)

// 그리고 얘도 수정

{data?.map((coin) => ( ... // ? 추가
))}

// 그런데, data는 9000개의 코인 정보를 전부 다 가지고 있으므로,
// 너무 많으니까 이전처럼 100개만 자르자

{data?.slice(0, 100).map((coin) => (  ...  // slice 추가
))}


// React query가 개 멋진 점 
// 3. react query가 데이터를 캐시에 저장해두기 때문에,
// 코인을 처음 클릭해 들어갈 땐 Loading이 뜨지만 (API 접근)
// 나갔다가 다시 그 코인에 들어가면, Loading이 뜨지 않음.
// 데이터를 파괴하지 않음! 개멋지지

///// React Query part Two

// React query가 캐시에서 가져온 data를 주는 것을
// 좀더 시각화하기 위해서
// react query가 갖고 있는,
// render 할 수 있는 component인 Devtools를 import하면
// 사용자의 캐시에 있는 query를 볼 수 있음.

// App.js 에 가서 import 하고 
// <Router> 아래에 render 하자!

// 그럼 확인 가능함. 개쩔어.

// 이제 Coin.tsx를 Coins.tsx 처럼 수정해 주자!


// api.ts

const BASE_URL = `https://api.coinpaprika.com/v1`;

export function fetchCoins() {
  return fetch(`${BASE_URL}/coins`).then((response) => response.json());
}

// url에 사용될 coinID는 argument로 넘겨줌. 형태는 string
export function fetchCoinInfo(coinID: string) {
  return fetch(`${BASE_URL}/coins/${coinID}`).then((response) =>
    response.json()
  );
}

export function fetchCoinTickers(coinID: string) {
  return fetch(`${BASE_URL}/tickers/${coinID}`).then((response) =>
    response.json()
  );
}

// Coin.tsx

import { useEffect, useState } from "react";
import { Routes, Route, useLocation, useParams, useMatch } from "react-router";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Chart from "./Chart";
import Price from "./Price";
import { useQuery } from "react-query";
import { fetchCoinInfo, fetchCoinTickers } from "../api";

const Container = styled.div`
  padding: 0px 20px;
  max-width : 480px;
  margin : 0 auto;
`;

const Header = styled.header`
  height: 15vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 48px;
  color: ${(props) => props.theme.accentColor};
`;

const Loader = styled.span`
  text-align : center;
  display : block;
`;

const Overview = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 10px 20px;
  border-radius: 10px;
`;

const OverviewItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  span:first-child {
    font-size: 10px;
    font-weight: 400;
    text-transform: uppercase;
    margin-bottom: 5px;
  }
`;

const Description = styled.p`
  margin: 20px 0px;
`;

const Tabs = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin: 25px 0px;
  gap: 10px;
`;

const Tab = styled.span<{ isActive: boolean }>` 
// isActive라는 boolean 형태의 props

  text-align: center;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 400;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 7px 0px;
  border-radius: 10px;
  color: ${(props) =>
    props.isActive ? props.theme.accentColor : props.theme.textColor};
  a {
    display: block;
  }
`;

interface RouteParams{
    coinID : string;
}

interface LocationParams {
    state: {
    name: string;
    rank: number;
    };
}

interface InfoData {
    id: string;
    name: string;
    symbol: string;
    rank: number;
    is_new: boolean;
    is_active: boolean;
    type: string;
    description: string;
    message: string;
    open_source: boolean;
    started_at: string;
    development_status: string;
    hardware_wallet: boolean;
    proof_type: string;
    org_structure: string;
    hash_algorithm: string;
    first_data_at: string;
    last_data_at: string;
}
  
  interface PriceData {
    id: string;
    name: string;
    symbol: string;
    rank: number;
    circulating_supply: number;
    total_supply: number;
    max_supply: number;
    beta_value: number;
    first_data_at: string;
    last_updated: string;
    quotes: {
      USD: {
        ath_date: string;
        ath_price: number;
        market_cap: number;
        market_cap_change_24h: number;
        percent_change_1h: number;
        percent_change_1y: number;
        percent_change_6h: number;
        percent_change_7d: number;
        percent_change_12h: number;
        percent_change_15m: number;
        percent_change_24h: number;
        percent_change_30d: number;
        percent_change_30m: number;
        percent_from_price_ath: number;
        price: number;
        volume_24h: number;
        volume_24h_change_24h: number;
      };
    };
}

function Coin() {
    const { coinID } = useParams<keyof RouteParams>() as RouteParams;
    const { state } = useLocation() as LocationParams;

    const priceMatch = useMatch("/:coinID/price");
    const chartMatch = useMatch("/:coinID/chart");

    const {isLoading : infoLoading, data : infoData } = useQuery<InfoData>(
      // 아래 qeury랑 isLoading 이름이 겹치면 안 되니까
      // 이름을 infoLoading으로 바꿔주자! 아래도 바꿔주고.

      ["info", coinID],
      // 모든 query는 각각의 고유한 id를 가지고 있어야 함.
      // 그리고 react query는, query를 array로 봄!
      // 따라서 위처럼 해 주면 됨. 각각 고유한 coinID를 가지니까.

      () => fetchCoinInfo(coinID)
      // 익명 함수를 만들어 fetcher 함수를 부르고 return.
    );

    const { isLoading : tickersLoading, data : tickersData } = useQuery<PriceData>(
      ["tikers", coinID],
      () => fetchCoinTickers(coinID)
    );

    const loading = infoLoading || tickersLoading;

    /*
    const [loading, setLoading] = useState(true);
    const [info, setInfo] = useState<InfoData>();
    const [priceInfo, setPriceInfo] = useState<PriceData>();

    useEffect(() => {
        (async() => {
            const infoData = await (
                await fetch(`https://api.coinpaprika.com/v1/coins/${coinID}`)
            ).json();
            const priceData = await (
                await fetch(`https://api.coinpaprika.com/v1/tickers/${coinID}`)
            ).json();

            setInfo(infoData); 
            setPriceInfo(priceData);
            setLoading(false);
        })();
    },[coinID]);
    */

    // 원래 info, priceInfo 였던 애들을 infoData, tickersData로 바꿔주기
    // 근데 ts가 infoData, tickersData가 뭔지 모르니까
    // 위쪽에서 정의할 때, 미리 만들어 둔 interface를 활용해주면 됨.
    // priceData, tickersData.
    return( 
        <Container>
            <Header>
                <Title>
                  {state?.name ? state.name : loading ? "Loading.." : infoData?.name}
                </Title>
            </Header>
            {loading ? (
              <Loader>"Loading..."</Loader>
            ) : (
              <>
                <Overview>
                  <OverviewItem>
                    <span>Rank :</span>
                    <span>{infoData?.rank}</span>
                  </OverviewItem>
                  <OverviewItem>
                    <span>Symbol :</span>
                    <span>${infoData?.symbol}</span>
                  </OverviewItem>
                  <OverviewItem>
                    <span>Open Source :</span>
                    <span>${infoData?.open_source ? "Yes" : "No"}</span>
                  </OverviewItem>
                </Overview>
                <Description>{infoData?.description}</Description>
                <Overview>
                  <OverviewItem>
                    <span>Total Suply:</span>
                    <span>{tickersData?.total_supply}</span>
                  </OverviewItem>
                  <OverviewItem>
                    <span>Max Supply:</span>
                    <span>{tickersData?.max_supply}</span>
                  </OverviewItem>
                </Overview>

                <Tabs>
                  <Tab isActive = {chartMatch !== null}>
                    <Link to = {`/${coinID}/chart`}>Chart</Link>
                  </Tab>
                  <Tab isActive = {priceMatch !== null}>
                    <Link to = {`/${coinID}/price`}>Price</Link>
                  </Tab>
                </Tabs>

                <Routes>
                  <Route path="chart" element={<Chart />} />
                  <Route path="price" element={<Price />} />
                </Routes>
              </>
            )}
        </Container>
    );
}


////////////// Price Chart

// Chart component는 
// 우리가 보고자 하는/ 보고 있는 가격의 암호화폐까 무엇인지 알아야 함.

// 옵션 1.
// useParams

import { useParams } from "react-router";

function Chart() {
  const params = useParams(); // router로부터 parameter 가져오기
  console.log(params);

    return <h1>Chart</h1>;
}
  
// 근데, coin screen은 url로부터 이미 coinID값을 알고 있으므로,
// 이런 식으로 다시 가져올 필요는 없음.
// 그냥 props를 보내도 됨.

// props로 coinID를 보낼 건데, 
// 당연히 chart는 coinID prop을 가지고 있지 않으므로
// interface를 만들자!

interface ChartProps{
  coinID : string;
}

function Chart({coinID} : ChartProps) {
    return <h1>Chart</h1>;
}

// Chart에 사용하기 위한 데이터를 받아오자.
  
// api.ts

export function fetchCoinHistory(coinID: string) {
  // 우리가 꼭 보내야 하는 필수 query parameter :
  // 우리가 언제를 기준으로 데이터를 받고 싶은지를 말하는 starting time.
  // start지점, end 지점
  // date, seconds 전부 가능.

  const endDate = Math.floor(Date.now() / 1000);
  // floor : 내림, ceil : 올림
  const startDate = endDate - 60 * 60 * 24 * 7;
  // endDate로부터 일주일 전. 2주 전으로 하려면 *2 해주면 됨.
  return fetch(
    `${BASE_URL}/coins/${coinID}/ohlcv/historical?start=${startDate}&end=${endDate}`
  ).then((response) => response.json());
}

// Chart.tsx

import { useQuery } from "react-query";
import { fetchCoinHistory } from "../api";

interface ChartProps{
  coinID : string;
}

interface IHistorical {
  time_open: string;
  time_close: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  market_cap: number;
}

function Chart({coinID} : ChartProps) 
{
  // 특정 시점의 highest, lowest, close, volume을 array로 줄 것.
  // 고유 key값 : "ohlcv"
  // data의 형태를 ts에게 말해줘야 하니까, interface 이용.
  const {isLoading, data} = useQuery<IHistorical[]>(["ohlcv", coinID], () =>
    fetchCoinHistory(coinID)
    
  );

  return <h1>Chart</h1>;
}
  
// Coin.tsx

<Route path="chart" element={<Chart coinID="coinID" />} /> 
// <Chart /> 에서 parameter 추가


///// Price Chart part 2

/// APEXCHARTS 를 이용해 시각화하자! 개 좋음.

import { useQuery } from "react-query";
import { fetchCoinHistory } from "../api";
import ApexChart from "react-apexcharts";

interface ChartProps{
  coinID : string;
}

interface IHistorical {
  time_open: string;
  time_close: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  market_cap: number;
}

function Chart({coinID} : ChartProps) 
{
  const {isLoading, data} = useQuery<IHistorical[]>(["ohlcv", coinID], () =>
    fetchCoinHistory(coinID)
    
  );

  return (
    <div>
      {isLoading ? (
        "Loading chart..."
      ) : ( 
        <ApexChart
          type = "line"
  
          // data를 보내는 건  series 라는 property에 다 있음.
          // 우리가 보내고 싶은 모든 data는 series에 있음.
          series = {[
            {
              name : "Price",
              data : data?.map((price) => price.close)??[],
              // data를 가져다가 price.close로 array 만들기
            },
          ]}
          
          // options에 관련한 것들은 사이트에 짱 많음. 보고 하자.
          // 찾기 힘들면, demo 를 보면 됨.
          options = {{
            theme : {
              mode : "dark",
            },
            chart : {
              height:300,
              width : 500,
              toolbar : {
                show : false,
              },
              background : "transparent",
            },
            grid : { show : false },
            stroke : {
              curve : "smooth",
              width : 4,
            },
            yaxis : {
              show : false,
            },
            xaxis : {
              axisBorder : {show : false},
              axisTicks : {show : false},
              labels : {show : false},
            },
          }}
        />
      )}
    </div>
  );
}
  

/// Price Chart part 3

// 모양 다듬기

import { useQuery } from "react-query";
import { fetchCoinHistory } from "../api";
import ApexChart from "react-apexcharts";

interface ChartProps{
  coinID : string;
}

interface IHistorical {
  time_open: string;
  time_close: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  market_cap: number;
}

function Chart({coinID} : ChartProps) 
{
  const {isLoading, data} = useQuery<IHistorical[]>(["ohlcv", coinID], () =>
    fetchCoinHistory(coinID)
    
  );

  return (
    <div>
      {isLoading ? (
        "Loading chart..."
      ) : ( 
        <ApexChart
          type = "line"
  
          // data를 보내는 건  series 라는 property에 다 있음.
          // 우리가 보내고 싶은 모든 data는 series에 있음.
          series = {[
            {
              name : "Price",
              data : data?.map((price) => price.close)??[],
              // data를 가져다가 price.close로 array 만들기
            },
          ]}
          
          // options에 관련한 것들은 사이트에 짱 많음. 보고 하자.
          options = {{
            theme : {
              mode : "dark",
            },
            chart : {
              height:300,
              width : 500,
              toolbar : {
                show : false,
              },
              background : "transparent",
            },
            grid : { show : false },
            stroke : {
              curve : "smooth",
              width : 4,
            },
            yaxis : {
              show : false,
            },
            xaxis : {
              axisBorder : {show : false},
              axisTicks : {show : false},
              labels : {show : false},
              type: "datetime",
              categories: data?.map((price) => price.time_close), 
              // 출력되는 부분
            },
            fill: {
              type: "gradient",
              gradient: { gradientToColors: ["#0be881"], stops: [0, 100] },
            },
            colors: ["#0fbcf9"],
            tooltip: {
              y: {
                formatter: (value) => `$${value.toFixed(2)}`,
              },
            },
          }}
        />
      )}
    </div>
  );
}

///// Price Chart - Final

// 실시간 효과(가격 변화 in 백그라운드)
// 주기적으로 백그라운드에서 앱 업뎃 가능
// react-helmet으로 탭 헤드 이름 바꾸기. 

function Chart({coinID} : ChartProps) 
{
  const { isLoading, data } = useQuery<IHistorical[]>(
    ["ohlcv", coinID],
    () => fetchCoinHistory(coinID),
    {
      refetchInterval: 10000, // 자동 실시간 업뎃 in 백그라운드. refetch.
    }
  );

  .. 

}

// Coin.tsx

const {isLoading : infoLoading, data : infoData } = useQuery<InfoData>(

  ["info", coinID],
  () => fetchCoinInfo(coinID),
  {
    refetchInterval : 5000,
  }
);

<Container>
  <HelmetProvider>
    <title>
      {state?.name ? state.name : loading ? "Loading..." : infoData?.name }
    </title>
  </HelmetProvider>
</Container>


// Coins.tsx

<Container>
  <HelmetProvider>
    <title>Coins</title>
  </HelmetProvider>
</Container>

