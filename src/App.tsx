import React, { useEffect, useState } from "react";
import "./css/styles.css";
import { Card } from "./components/Card/Card";
import { Search } from "./components/Search/Search";
import { MainContainer } from "./components/Containers/MainContainer";
import { CardsContainer } from "./components/Containers/CardsContainer";
import { nftType } from "./types/types";

type JsonResponse = {
  data: Array<Omit<nftType, 'fetchedAt' | 'createdAt'>>,
  elements?: number,
  errors: Array<{message: string}>
}
function App() {
  const [nfts, setNfts] = useState<nftType[] | undefined>([]);
  const [nftsApi, setNftsApi] = useState<nftType[]| undefined>([]);
  const [errors, setErrors] = useState<Array<{message: string}> | undefined >([]);
  const [elementsCount, setElementsCount] = useState<number>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const filteredList = nftsApi?.filter((nft) => {
      return (
        nft.title.toLowerCase()?.includes(value.toLowerCase()) ||
        nft.description.toLowerCase().includes(value.toLowerCase()) ||
        nft.creator.toLowerCase().includes(value.toLowerCase())
      );
    });
    setNfts(filteredList);
    setElementsCount(filteredList?.length)
  };

  useEffect(() => {
    const api = async () => {
      const resposneApi = await fetch(
        'https://636b20b6c07d8f936dae7fe4.mockapi.io/api/nft/all/1',
        {
          method: 'GET',
        }
      )
      const {data, errors, elements}:JsonResponse = await resposneApi.json();
      if (resposneApi.ok) {
        console.log(data)
        setNfts(data);
        setNftsApi(data);
        setElementsCount(elements);
        setErrors(errors);
        
      } else {
        setErrors([{message: `API en erreur : code ${resposneApi.status}`}])
        setNftsApi([])
        setNfts([])
        setElementsCount(0)
      }
    }
    api();
  },[])
  return (
    <MainContainer>
      <Search onChange={handleChange} />
      <div>
        {elementsCount && elementsCount > 0 ? (
          <div role={'alert'} className="elements">
            il y a {elementsCount} element(s)
          </div>
        ) : null}
        {errors && errors.length > 0 ? (
          <div role={'alert'} className="alert">
            il y a {errors?.length} erreur(s) : {errors?.[0].message}
          </div>
        ) : null}
      </div>
      <CardsContainer>
        {nfts?.map((nft,index) => (
          <Card key={index} nft={nft} />
        ))}
      </CardsContainer>
    </MainContainer>
  );
}

export default App;
