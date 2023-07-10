import { Link } from "react-router-dom";
import styled from "styled-components";
import { useQuery } from "react-query";
import { fetchCoins } from "../api";
import { Helmet } from "react-helmet-async";
import { Outlet } from "react-router";
import { useSetRecoilState } from "recoil";
import { isDarkAtom } from "../atom";

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
  background-color: ${(props) => props.theme.cardBgColor};
  color: ${(props) => props.theme.textColor};
  border-radius: 15px;
  margin-bottom: 10px;
  border: 1px solid white;
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

interface ICoin {
  id: string,
  name: string,
  symbol: string,
  rank: number,
  is_new: boolean,
  is_active: boolean,
  type: string,
};

interface ICoinProps {}


function Coins() {

  const setDarkAtom = useSetRecoilState(isDarkAtom);
  // setDarkAtom 은 setState와 같은 방식으로 작동

  const {isLoading, data} = useQuery<ICoin[]>("allCoins", fetchCoins)

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
export default Coins;

