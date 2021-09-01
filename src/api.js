import useToken from "./token"

const host = "http://localhost:5000/"

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
  
  async function FetchDataAuth(dataSource) {
    const { getToken, validateToken } = useToken();
    const token = getToken()
    try {
      if (!validateToken()) {
        return {data: false, error: "Invalid token"}
      }
      const headers = {'Authorization': 'Bearer '+ token.toString()}
      const data = await fetch(host+dataSource, {
        method: 'GET',
        headers: headers,
      });
      const dataJSON = await data.json();
      if (dataJSON) {
        return { data: dataJSON, error: false };
      }
    } catch (error) {
      return { data: false, error: "Could not comunicate with server" };
    }
  }
  
  async function PostDataAuth(dataSource, headers, content) {
    const { getToken, validateToken } = useToken();
    const token = getToken()
    try {
      if (!validateToken()) {
        return {data: false, error: "Invalid token"}
      }
      headers.Authorization = 'Bearer '+ token.toString() 
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
  const Api = {
    fetchData,
    postData,
    PostDataAuth,
    FetchDataAuth
  };
  
  export { Api as default };