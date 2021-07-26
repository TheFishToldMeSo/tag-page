import "./ArticleCard.scss"

export default function ArticleCard({ articleDetails }) {
    const rawHtml = (text, className = "") => {
        if (!text) return "";
        const regexCheckHtml = RegExp("<.+?>", "g").test(text);
        return regexCheckHtml ? (
            <div className={className} dangerouslySetInnerHTML={{ __html: text }} />
        ) : (
            text
        );
    };
    const HOST = "https://vietcetera.com/vn"

    let dayTime = articleDetails.publishDate.slice(8, 10) + " THG " + articleDetails.publishDate.slice(5, 7);


    return (
        <div className="ArticleCardDetail">
            <div className="ImgContainer">
                <a href={`${HOST}/${articleDetails.slug}`} title={articleDetails.title}>
                    <img className="ArticleImg" src={`https://vietcetera.com/${articleDetails.images.url}`} alt={articleDetails.title} width="272" height="184" />   </a>
            </div>
            <div className="ArticleContent">
                <a className="ArticleTitle" href={`${HOST}/${articleDetails.slug}`} title={articleDetails.title}>{articleDetails.title}</a>
                <div className="ArticleText">{rawHtml(articleDetails.excerpt)}</div>
                <div className="ArticleDetailContainer">
                    <div className="ArticleDetail">
                        <a href={`${HOST}/thong-tin-ca-nhan/${articleDetails.writer.username}`} title={articleDetails.writer.penname}>
                            <img className="authorImg" src={`https://vietcetera.com/${articleDetails.writer.avatar}`} alt={articleDetails.writer.penname} width="32" height="32" />
                        </a>
                        <a className="authorName" href={`${HOST}/thong-tin-ca-nhan/${articleDetails.writer.username}`} title={articleDetails.writer.penname}>{articleDetails.writer.penname}</a>
                        <p>·</p>
                        <p className="articleTime">{dayTime}</p>
                        <p>·</p>
                        <a className="articleCategories" href={`${HOST}/chu-de/${articleDetails.topic[0].key}`} title={articleDetails.topic[0].name}>{articleDetails.topic[0].name.toUpperCase()}</a>

                    </div>
                    <button className="saveBtn"> <img src="/saveBtn.png" alt="save" width="16" height="16" /></button>
                </div>
            </div>
        </div>
    );
}