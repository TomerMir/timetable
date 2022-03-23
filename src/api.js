import useToken from "./token"

//The API's url
const host = "https://mirmo.ddns.net/"

//Fetch data from the api 
//dataSource -> the url to fetch the data from. i.e https://mirmo.ddns.net/<dataSource>
async function fetchData(dataSource) {
    try {
      const data = await fetch(host+dataSource);
      const dataJSON = await data.json();
      
      if (dataJSON) {
        return await { data: dataJSON, error: false };
      }
    } catch (error) {
      return { data: false, error: "Could not comunicate with server" };
    }
  }
  
//Post data to the api 
//dataSource -> the url to fetch the data from. i.e https://mirmo.ddns.net/<dataSource>
//headers -> the http heades to send the request with.
//content -> the content to send.
async function postData(dataSource, headers, content) {
    try {
      const data = await fetch(host+dataSource, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(content)
      });
      const dataJSON = await data.json();
  
      if (dataJSON) {
        return { data: dataJSON, error: false };
      }
    } catch (error) {
      return { data: false, error: "Could not comunicate with server" };
    }
  }

//Fetch data from the api + authenication. It sends the request with the jwt
//dataSource -> the url to fetch the data from. i.e https://mirmo.ddns.net/<dataSource>
async function FetchDataAuth(dataSource) {
    const { getToken, validateToken } = useToken();
    const token = getToken()
    try {
      //Validates the token
      if (!validateToken()) {
        return {data: false, error: "Invalid token"}
      }
      //Creates the authorization header
      const headers = {'Authorization': 'Bearer '+ token.toString()}
      const data = await fetch(host+dataSource, {
        method: 'GET',
        headers: headers,
      });
      const dataJSON = await data.json();
      //Checks if data is not null
      if (dataJSON) {
        return { data: dataJSON, error: false };
      }
    } catch (error) {
      return { data: false, error: "Could not comunicate with server" };
    }
  }

//Posts data to the api + authenication. It sends the request with the jwt
//dataSource -> the url to fetch the data from. i.e https://mirmo.ddns.net/<dataSource>
//headers -> the http heades to send the request with.
//content -> the content to send.
async function PostDataAuth(dataSource, headers, content) {
    const { getToken, validateToken } = useToken();
    const token = getToken()
    try {
      //Validates the token
      if (!validateToken()) {
        return {data: false, error: "Invalid token"}
      }
      //Creates the authorization header
      headers.Authorization = 'Bearer '+ token.toString() 
      const data = await fetch(host+dataSource, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(content)
      });
      const dataJSON = await data.json();
      //Checks if data is not null
      if (dataJSON) {
        return { data: dataJSON, error: false };
      }
    } catch (error) {
      return { data: false, error: "Could not comunicate with server" };
    }
}
const Api = {
    fetchData,
    postData,
    PostDataAuth,
    FetchDataAuth
  };
  
export { Api as default };