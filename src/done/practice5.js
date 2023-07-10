///// Dark Mode part 1

// state에 기반하는 
// 다크, 라이트 모드 변환 스위치를 만들기 위해서는
// index.tsx의 themeProvider를 App.tsx로 옮겨 줘야 함.
// theme.ts에 drakTheme, lightTheme 만들고
// App.tsx에 import 해 주기

import { createGlobalStyle } from "styled-components";
import Router from "./Router";
import {ReactQueryDevtools} from "react-query/devtools"
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from 'styled-components';
import { darkTheme,lightTheme } from './theme';
import { useState } from 'react';

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
    color : ${(props) => props.theme.textColor};
    line-height: 1.2;
  }
  a {
    text-decoration : none; // 밑줄 없애기
    color : inherit; // Link시에도 사용. color를 부모에게서 가져오라.
  }
`;

function App() {
  // 다크모드 , 라이트 모드 바꾸는 스위치 만들쟈.
  // 조건 생성 필요하니까 isDark라는 state 생성, 기본값은 true
  // return 문 안에, isDark이면 darkTheme / false 이면 lightTheme 사용
  // 그러니까 우리는 기본으로 darkTheme 으로 시작
  const [isDark, setIsDark] = useState(true);

  // setState function 사용 시 옵션이 2개임
  // 하나는 value를 그냥 보내는 것,
  // 나머지는 function으로 보내는 것.
  // 지금 우리의 function은 첫 argument로 현재의 state를 가짐.
  // 그러므로 현재 state의 반대를 리턴하도록 하자
  // isDark가 true면 false 리턴, false면 true 리턴
  const setIsDark = () => setIsDark((current)=> !current);
  
  // 가장 밖에 있던 GlobalStyle이
  // ThemeProvider 안으로 들어가는 것 조심!
  return (
    <> 
        <ThemeProvider theme = {isDark ? darkTheme : lightTheme}> 
          <HelmetProvider>
            <button onClick = {setIsDark}>Toggle Mode</button> 
            <GlobalStyle/>
            <Router/>
            <ReactQueryDevtools initialIsOpen = {true} />
          </HelmetProvider>
        </ThemeProvider>
    </>
  )
}

//// part 2

// 이제 버튼의 위치를 옮겨 보자!
// 버튼 출력 관련 부분들을 Coins.tsx로 옮기고
// Chart의 theme에서도 dark, light 로 theme을 변경해야 하니까
// Chart에서도 isDark에 접근하고 해당 function을 Coins로 보내줘야 함.

// step.1
// 이때, Router.tsx에 setIsDark를 보내줘야 하는데
// 만약 Router가 function을 받도록 하고 싶다면
// function이 어떻게 생겼는지 명시해야 함.
// 아무것도 받지 않고 아무것도 리턴하지 않는 함수의 타입은
// f : () => void 임.

// step.2
// 이후, setIsDark를 Coins Screen 으로 줘야 함.
// 종합해보면, App.tsx에서 setIsDark function을 Router.tsx로 보내고
// Router.tsx에서는 Coins로 보내고 있음. 보낼 때마다 props, interface도 필요.
// 그제서야 Coins에서 function을 받는 것.

// 이제 Coins에 함수를 받아 왔으니 
// Chart에게 우리가 dark인지 light인지 알려줘야 함.
// 그러려면 Chart.tsx가 isDark가 true인지 false인지 알 수 있어야 하니까
// isDark를 다시 Router로 보내야 함..
// 이때 또 interface 수정해주고 props 이용하고.

// 그러니까 isDark를 Chart에서 받기 위해
// isDark : App -> Router -> Coin -> Chart 로 내려주고
// App의 위치가 아닌 Coins의 위치에서
// setIsDark을 사용해 그 값을 바꿔주기 위해
// App -> Coins 로 내려 준 것..

// 이게 바로 global state. 어플리케이션 전체에서 공유되는 state.
// 어플리케이션이 특정 value에 접근해야 할 때 쓰는 것.
// component가 어디에 있든, 누가 접근하고자 하는지에 상관없이.
// 유저의 로그인 여부와 같은, 어플리케이션 전체에서 공유해야 하는 요소가 있을 때 이용.

// 근데, 별로 좋지 않음.. 
// 공유해야할 것들이 많아지면 직접 다 내려줘야 하기 때문에..
// 그러니까 isDark와 setIsDark를 어딘가 다른 곳에 두는 방식을 사용하는 것이 좋음.
// 그러면 props를 엄청 내려보내지 않아도 component가 이들에 언제 접근할 지 선택 가능!

// state management를 이용하면,
// 부모가 자식에게 props를 계속 내려주는 방법 말고
// isDark를 하나의 버블로 만들어서, 
// App이든 Header든 Chart든 접근할 수 있도록 하는 것.
// Header -> (isDark) <- Chart 이런 형식으로!

// 이것이, Recoil의 포인트.

// 돌아가는 것 확인했음!
// 바뀐 부분은 
// https://github.com/nomadcoders/react-masterclass/commit/cb658ec92f2f9c04ec3774a1e030950ba09df5a6
// 여기 있고, 코드는

// App.tsx

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
    color : ${(props) => props.theme.textColor};
    line-height: 1.2;
  }
  a {
    text-decoration : none; // 밑줄 없애기
    color : inherit; // Link시에도 사용. color를 부모에게서 가져오라.
  }
`;

function App() {

  const [isDark, setIsDark] = useState(true);
  const toggleDark = () => setIsDark((current)=> !current);
  
  return (
    <> 
        <ThemeProvider theme = {isDark ? darkTheme : lightTheme}> 
          <HelmetProvider>
            <GlobalStyle/>
            <Router isDark = {isDark} toggleDark = {toggleDark}/>
            <ReactQueryDevtools initialIsOpen = {true} />
          </HelmetProvider>
        </ThemeProvider>
    </>
  )
}

// Router.tsx

interface IRouterProps {
    toggleDark : () => void;
    isDark : boolean;
}

function Router({ toggleDark, isDark } : IRouterProps) {
    const coinID = useOutletContext<string>();

    return (
        <BrowserRouter>
             <Routes>
                <Route path="/:coinID/" element={<Coin isDark = {isDark} />} />
                <Route path="price" element={<Price />} />
                <Route path="chart" element={<Chart isDark={isDark} coinID={coinID}/>} />
                <Route path="/" element={<Coins toggleDark = {toggleDark} />} />
            </Routes>
        </BrowserRouter>
    );
}


// Chart.tsx
  
  interface ChartProps {
    coinID : string;
    isDark : boolean;
  }
  
  function Chart({coinID, isDark} : ChartProps) {
    // const params = useParams();
    // const coinID = useOutletContext<string>();
    const { isLoading, data } = useQuery<IHistorical[]>(
      ["ohlcv", coinID],
      () => fetchCoinHistory(coinID),
      {
        //refetchInterval: 10000, 
      }
    );
  
    return (
      <div>
        {isLoading ? (
          "Loading Chart..."
        ) : (
          <ApexCharts
            type="line"
            series={[
              {
                name: "price",
                data: data?.map((price) => price.close) as number[],
              },
            ]}
            options={{
              theme: {
                mode: isDark ? "dark" : "light",
              },
              chart: {
                height: 500,
                width: 500,
                toolbar: { show: false },
                background: "transparent",
              },
              grid: { show: false },
              stroke: {
                curve: "smooth",
                width: 4,
              },
              yaxis: {
                show: false,
              },
              xaxis: {
                labels: {
                  show: false,
                },
                axisBorder: {
                  show: false,
                },
                axisTicks: {
                  show: false,
                },
                type: "datetime",
                categories: data?.map((price) => price.time_close),
              },
              fill: {
                type: "gradient",
                gradient: { gradientToColors: ["#0be881"], stops: [0, 100] },
              },
              colors: ["#0fbcf9"],
              tooltip: {
                y: {
                  formatter: (value) => `$ ${value.toFixed(3)}`,
                },
              },
            }}
          />
        )}
      </div>
    );
  }

  
// Coin.tsx

interface ICoinProps {
    isDark : boolean;
  }
  
  function Coin({ isDark } : ICoinProps) {
      const { coinID } = useParams<keyof RouteParams>() as RouteParams;
      const location = useLocation();
      const { state } = location as LocationParams;
      console.log(coinID);
  
      const priceMatch = useMatch("/:coinID/price");
      const chartMatch = useMatch("/:coinID/chart");
  
      const {isLoading : infoLoading, data : infoData } = useQuery<InfoData>(
        ["info", coinID],
        () => fetchCoinInfo(coinID!),
        {
          //refetchInterval : 5000,
        }
      );
  
      const { isLoading : tickersLoading, data : tickersData } = useQuery<PriceData>(
        ["tickers", coinID],
        () => fetchCoinTickers(coinID!),
        {
          //refetchInterval : 5000,
        }
      );
  
      const loading = infoLoading || tickersLoading;
  
      return( 
          <Container>
            
            <Helmet>
              <title>
                {state?.name ? state.name : loading ? "Loading..." : infoData?.name }
              </title>
            </Helmet>
  
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
                    <span>Price :</span>
                    <span>$${tickersData?.quotes?.USD?.price?.toFixed(3)}</span>
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
  
                <Outlet context = {coinID} />
  
              </>
            )}
          </Container>
      );
  }

// Coins.tsx

interface ICoinProps {
    toggleDark : () => void;
  }
  
  function Coins({toggleDark} : ICoinProps) {
  
    const {isLoading, data} = useQuery<ICoin[]>("allCoins", fetchCoins)
    
    return (
      <Container>
        <Helmet>
          <title>Coins</title>
        </Helmet>
        <Header>
          <Title>Coins</Title>
          <button onClick = {toggleDark}> Toggle Dark </button>
        </Header>
        {isLoading ? (  
          <Loader>"Loading..."</Loader>
        ) : (
        <CoinsList>
          {data?.slice(0, 100).map((coin) => (  
            <Coin key = {coin.id}>
              <Link to={`/${coin.id}`} state = {{name : coin.name}}>
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


///// Introduction to Recoil
// Recoil이 아까 말했던 버블 역할을 해줄 수 있음!
// 버블을 atom이라고 부르지롱.
// 각각의 atom에는 다른 값을 저장할 수 있음.
// atom을 이용하면, props를 여기저기 전달할 필요가 없음!
// atom은 component에 종속되지 않고, 다른 어딘가에 있는데,
// 사용 시에는 component에서 직접 atom에 접근하면 됨.
// 부모 component에 접근하고 이딴 거 다 필요없음.
// 위에서도 Chart에서 isDark 쓰려고
// Router랑 Coin Screen에는 isDark가 쓰이지도 않는데 옮겨줬자나.

// 걍 Recoil 쓰면 다 해결이라공ㅇㅇㅇ
// 그러니까 props로 넘겼던 것들 다 지우고

// 일단 index.tsx에 recoilRoot로 묶어주자

<React.StrictMode>
  <RecoilRoot> //
    <QueryClientProvider client = {queryClient}>
      <App />
    </QueryClientProvider>
  </RecoilRoot> //
</React.StrictMode>

// App.tsx

function App() {
  
  const isDark = useRecoilValue(isDarkAtom);
  // recoil value를 가져오는 것.
  
  return (
    <> 
        <ThemeProvider theme = {isDark ? darkTheme : lightTheme}> 
          <HelmetProvider>
            <GlobalStyle/>
            <Router />
            <ReactQueryDevtools initialIsOpen = {true} />
          </HelmetProvider>
        </ThemeProvider>
    </>
  )
}

// Chart.tsx


import { useQuery } from "react-query";
import { useOutletContext, useParams } from "react-router-dom";
import { fetchCoinHistory } from "../api";
import ApexCharts from "react-apexcharts";
import { isDarkAtom } from "../atom";
import { useRecoilValue } from "recoil";

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

interface ChartProps {
  coinID : string;
}

function Chart({coinID} : ChartProps) {
  
  const isDark = useRecoilValue(isDarkAtom);
  // 가져오는 것.

  const { isLoading, data } = useQuery<IHistorical[]>(
    ["ohlcv", coinID],
    () => fetchCoinHistory(coinID),
    {
      //refetchInterval: 10000, 
    }
  );

  return (
    <div>
      {isLoading ? (
        "Loading Chart..."
      ) : (
        <ApexCharts
          type="line"
          series={[
            {
              name: "price",
              data: data?.map((price) => price.close) as number[],
            },
          ]}
          options={{
            theme: {
              mode: isDark ? "dark" : "light",
            },
            chart: {
              height: 500,
              width: 500,
              toolbar: { show: false },
              background: "transparent",
            },
            grid: { show: false },
            stroke: {
              curve: "smooth",
              width: 4,
            },
            yaxis: {
              show: false,
            },
            xaxis: {
              labels: {
                show: false,
              },
              axisBorder: {
                show: false,
              },
              axisTicks: {
                show: false,
              },
              type: "datetime",
              categories: data?.map((price) => price.time_close),
            },
            fill: {
              type: "gradient",
              gradient: { gradientToColors: ["#0be881"], stops: [0, 100] },
            },
            colors: ["#0fbcf9"],
            tooltip: {
              y: {
                formatter: (value) => `$ ${value.toFixed(3)}`,
              },
            },
          }}
        />
      )}
    </div>
  );
}

//// Introduction to Recoil part 2
// Coins의 Header 안에 toggle button을 만들자!
// recoil을 활용해서 atom을 수정할 수 있도록.

function Coins() {

  const setDarkAtom = useSetRecoilState(isDarkAtom);
  // setDarkAtom 은 setState와 같은 방식으로 작동
  // 즉, 그 전 상태값인 prev에 접근할 수도 있고,
  // 사용자가 원하는 값을 전달할 수도 있음. ex) true, false

  const {isLoading, data} = useQuery<ICoin[]>("allCoins", fetchCoins)
  
  return (
    <Container>
      <Helmet>
        <title>Coins</title>
      </Helmet>
      <Header>
        <Title>Coins</Title>
        <button onClick={() => setDarkAtom((prev) => !prev)}>Toggle Mode</button>
        {
          // 따라서, 사용 시에도 value를 보내 주거나 
          // 이전 value를 가져와 반대를 return 할 수 있음
          // 이 상황에 (false)나 (true)를 넘겨 준다면,
          // 영원히 dark theme 혹은 light theme에서 변하지 않음.
        }
      </Header>
      {isLoading ? (  
        <Loader>"Loading..."</Loader>
      ) : (
      <CoinsList>
        {data?.slice(0, 100).map((coin) => (  
          <Coin key = {coin.id}>
            <Link to={`/${coin.id}`} state = {{name : coin.name}}>
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

// 

const setDarkAtom = useSetRecoilState(isDarkAtom);
const toggleDarkAtom = () => setDarkAtom(prev => !prev);

<button onClick={toggleDarkAtom}>Toggle Mode</button>

// 이렇게 해도 됨.

// 만약, atom에 접근한 component에 의해 atom이 변경되면,
// component도 변경된 값으로 다시 리렌더링될 것.
// 우리는 atom의 값을 가져올 수도 있고, 변경할 수도 있음!