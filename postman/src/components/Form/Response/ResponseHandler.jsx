import HTMLHandler from "./HTML/HTMLHandler";
import IMAGEHandler from "./IMAGE/IMAGEHandler";
import JSONHandler from "./JSON/JSONHandler";
import PDFHandler from "./PDF/PDFHandler";

const ResponseHandler = ({apiResponse, onResponseMessageClick}) => {

    const responseHeader = apiResponse.data.headers || '';
    const contentTypeArray = responseHeader['Content-Type'] || '';
    const contentTypeHeader = contentTypeArray[0];

    const body = apiResponse.data.body || '';

    if(contentTypeHeader.includes('json'))
    {
        return (<div onClick={()=>onResponseMessageClick(apiResponse)}><JSONHandler apiResponse={apiResponse}></JSONHandler></div>);

    }else if(contentTypeHeader.includes('text/html') || (typeof data === 'string' && data.trim().startsWith('<'))){

        return (<div onClick={()=>onResponseMessageClick(apiResponse)}><HTMLHandler apiResponse={apiResponse}></HTMLHandler></div>)

    }else if (contentTypeHeader.includes('image/')) {
    
        return (<div onClick={()=>onResponseMessageClick(apiResponse)}><IMAGEHandler apiResponse={apiResponse}/></div>)

    }else if (contentTypeHeader.includes('application/pdf')) {
    
        return (<div onClick={()=>onResponseMessageClick(apiResponse)}><PDFHandler apiResponse={apiResponse}/></div>)

    }else {
        //TODO: add UnableToSeeResponse
        return (<ResponseHandler apiResponse={apiResponse}></ResponseHandler>);
    }

};


export default ResponseHandler;
