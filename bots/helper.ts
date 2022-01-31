import {getRequest} from '../Utility';

// const server = 'http://localhost:8080';
const server = 'https://raptor-trading.herokuapp.com';

export async function api_getCoinPrices() {
  try {
    const data: any = await getRequest(server + '/coins/prices');
    return data.data;
  } catch (e) {
    console.error('helper::api_getCoinPrices', e);
  }
}

export async function api_getUser(username: string) {
  try {
    const data: any = await getRequest(server + '/users/' + username);
    return data.data;
  } catch (e) {
    console.error('helper::api_getUser', e);
  }
}
