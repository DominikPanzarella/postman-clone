import DataProvider from '..//context/DataProvider';
import Home from '../Home/Home';

function PostmanWrapper({url, search, collections, onResponseMessageClick}) {
	return (
        <DataProvider>
            <Home url={url} search={search} collections={collections} onResponseMessageClick={onResponseMessageClick}></Home>
        </DataProvider>
  );
}

export default PostmanWrapper;
