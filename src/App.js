import './App.scss';
import React, { useState, useEffect } from "react"
import fetch from "isomorphic-fetch";

import ArticleCard from './Components/ArticleCard/ArticleCard';

function App() {
  // parse main articles content json from server
  const [infoTag, setInfoTag] = useState({})
  const [primaryIsLoading, setPrimaryIsLoading] = useState(false);
  const [recommendIsLoading, setRecommendIsLoading] = useState(false);
  const [articlesArray, setArticleArray] = useState([])
  const [dataArticles, setDataArticles] = useState({})
  const [pageNumber, setPageNumber] = useState(1)
  // parse recommended content json from server
  const [recommendedArticlesArray, setRecommendedArticlesArray] = useState([])
  const [dataRecommendations, setDataRecommendations] = useState({})
  const [recommendPageNumber, setRecommendPageNumber] = useState(1)

  const HOST = "https://cms.vietcetera.dev/client/api"

  const getTagAndItsRelates = `${HOST}/v2/tags/coi-mo`

  // const getTagsArticle = `${HOST}/v2/tags/articles/coi-mo?page=${pageNumber}&limit=8&languageSort=VN`;
  const getTagsArticle = (pageProcess) => `${HOST}/v2/tags/articles/coi-mo?page=${pageProcess}&limit=8&languageSort=VN`;

  const getTagsRecommendedArticles = (pageProcess) => `${HOST}/v2/tags/recommend-articles/coi-mo?page=${pageProcess}&limit=8`;

  const getInfoTag = () => {
    // fetch của browser
    // IE => ko có fetch
    try {
      // setIsLoading(true)
      // console.log("isLoading", isLoading)
      // const response = await fetch(`https://cms.vietcetera.dev/client/api//v2/tags/tan-chay`)
      // const json = response.json()
      // console.log("json", json)
      return fetch(getTagAndItsRelates)
        .then((response) => response.json())
        .then(json => {
          if (json.message === "GET_SUCCESSFUL") {
            setInfoTag(prevInfo => ({ ...prevInfo, ...json.data }))
          }
        })
      // .finally(() => {
      //   setIsLoading(false)
      //   console.log("isLoading tags", isLoading)
      // })
    }
    catch (e) {
      console.log("e", e)
      // setIsLoading(false)
    }
  }

  const getDataArticles = async (pageProcess) => {
    try {
      setPrimaryIsLoading(true)
      return await fetch(getTagsArticle(pageProcess))
        .then((response) => response.json())
        .then(json => {
          if (json.message === "GET_SUCCESSFUL") {
            setDataArticles(prevState => ({ ...prevState, ...json.data }))
            setArticleArray([...articlesArray, ...json.data.articles])
          }
        })
    }
    catch (e) {
      console.log("e", e)
      // setIsLoading(false)
    }
    finally {
      // setTimeout(() => setIsLoading(false), 1000)
      setPrimaryIsLoading(false)
    }
  }

  const getRecommendedArticles = async (pageProcess) => {
    try {
      setRecommendIsLoading(true)
      return await fetch(getTagsRecommendedArticles(pageProcess))
        .then((response) => response.json())
        .then(json => {
          if (json.message === "GET_SUCCESSFUL") {
            setDataRecommendations(prevState => ({ ...prevState, ...json.data }))
            setRecommendedArticlesArray([...recommendedArticlesArray, ...json.data.articles])
          }
        })
    }
    catch (e) {
      console.log("e", e)
    }
    finally {
      // setTimeout(() => setIsLoading(false), 1000)
      setRecommendIsLoading(false)
    }
  }

  useEffect(() => {
    console.log("didmount run")
    getInfoTag()
    getDataArticles(pageNumber)
    getRecommendedArticles(recommendPageNumber)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadMoreArticleOfTag = () => {
    // chạy đầu tiên
    setPageNumber(prevPage => prevPage + 1)
    // chạy thứ 2
    getDataArticles(pageNumber + 1)
    // kết thúc hàm
  }
  const loadMoreRecommendedArticles = () => {
    setRecommendPageNumber(prevPage => prevPage + 1)
    getRecommendedArticles(recommendPageNumber + 1)
  }


  return (
    <div className="tagPageContainer">
      <h1 className="tagName">#{infoTag.name}</h1>
      {infoTag.relatedTags && infoTag.relatedTags.length > 0 && <p className="relatedTagHeader">Related tags</p>}

      <div className="relatedTags">
        {infoTag.relatedTags && infoTag.relatedTags.map((relatedTag) => {
          return <a href={`/vn/tags/${relatedTag.slug}`} title={relatedTag.name} key={relatedTag.id}>#{relatedTag.name}</a>
        })}
        {/* {renderRelatedTags()} */}
      </div>
      <div className="articlesContainer">
        {articlesArray.length > 0 && articlesArray.map((singleArticle) => {
          return <ArticleCard articleDetails={singleArticle} key={singleArticle.id} />
        })}
      </div>
      {primaryIsLoading ? <div className="lds-dual-ring" /> : <div className="btnContainer">
        {dataArticles.isNextpaging ? <button onClick={loadMoreArticleOfTag}>Xem thêm bài viết</button> : <span>Bạn đã xem hết bài viết</span>}
      </div>}

      <h2 className="tag-recommendation">Có thể bạn quan tâm</h2>
      <div className="articlesContainer">
        {recommendedArticlesArray.length > 0 && recommendedArticlesArray.map((singleArticle) => {
          return <ArticleCard articleDetails={singleArticle} key={singleArticle.id} />
        })}
      </div>
      {recommendIsLoading ? <div className="lds-dual-ring" /> : <div className="btnContainer">
        {dataRecommendations.isNextpaging ? <button onClick={loadMoreRecommendedArticles}>Xem thêm bài viết</button> : <span>Bạn đã xem hết bài viết</span>}
      </div>}
    </div>
  );
}


export default App;

  // 1. pending
  // 2. fulfilled
  // 3. reject

  // const sum = (a, b) => {
  //   return a + b
  // }

  // const sum = (a,b) => a+b

  // async await => higher promise => sinh ra để replace promise traditional
  // promise => pure promise

  // component re-render from 2nd times => phụ thuộc vào state của component

  // this.setState({...this.state , article : res.json()})

  // state = {
  //   articles : []
  // }

  //  Didmount , didUpdate ,willUnMount => 3 life circle chính của react
  // class component => reactjs

  // conponentDidMount(){
  // const articles = this.state.articles
  // render sau khi component render xong
  // only run 1 time after component rendered
  // article = 8 bài
  // }

  // conponentDidUpdate(){
  // phụ thuộc dependency để update cho component => xài phải hiểu tránh việc infinity loop
  // article = 16 bài
  // }

  // conponentWillUnMount(){
  // xử lý logic return về mảng rỗng
  // only run 1 time after move out of component
  // }


  // re-render => cập nhật lại UI UX cho component => 2nd times
  // function component => react hooks
  // hooks have 3 props xài nhiều nhất useState , useEffect
  // useState sinh ra replace state bên class
  // useEffect sinh ra để replace lifes circle bên class
  // didmount => only run 1 time after component rendered
  // useEffect(() => {
  //   console.log("didmount run")
    // console.log("articles", articles)
  //   getArticlesOfTag()
  // }, [])
  // console.log("infoTag", infoTag)
  // did update => always run dont care anything
  // useEffect(() =>{

  // })

  // didupdate follow dependency
  // useEffect(() =>{

  // },[dependency])

  //  client side rendering ( CSR ) , server side rendering ( SSR )
  // quy ước của BE có 4 errorCode phổ biến
  // 1. errorCode = 200 => successful
  // 2. 404 => not fround
  // 3. 500 => something went wrong => api chết
  // 4. 999 => invalid value => giá trị ko hợp lệ
  //  es6 

  // const renderRelatedTags = () => {
  //   if (infoTag.relatedTags) {
  //     return infoTag.relatedTags.map((relatedTag) => {
  //       return <a href={`/vn/tags/${relatedTag.slug}`} title={relatedTag.name} key={relatedTag.id}>#{relatedTag.name}</a>
  //     })
  //   } else {
  //     return null
  //   }
  // }
