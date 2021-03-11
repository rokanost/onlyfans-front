class InstaError extends Error {
  constructor(error) {
    super('An error occurred in API');
    if (error === 'unknown endpoint') {
      this.error = 'An error occured in API';
    } else {
      this.error = error;
    }
  }
}

class Client {
  constructor() {
    this.baseURL = '';
    this.headers = {
      Authorization: null,
      Accept: 'application/json'
    };
    this.client = ({ method, url, payload }) => {
      let body;
      if (Object.prototype.toString.call(payload) === '[object FormData]') {
        delete this.headers['Content-Type'];
        body = payload;
      } else {
        this.headers['Content-Type'] = 'application/json';
        body = JSON.stringify(payload);
      }

      return fetch(`${this.baseURL}${url}`, {
        headers: this.headers,
        method,
        body
      });
    };

    if (localStorage.getItem('instaInfo')) {
      const secret = JSON.parse(localStorage.getItem('instaInfo')).secret;
      this.setCustomHeaders(secret);
    }
  }

  setCustomHeaders(secret) {
    this.headers['x-instaclone-userId'] = JSON.parse(
      localStorage.getItem('instaInfo')
    ).userId;
    this.headers.Authorization = `Bearer ${secret}`;
  }

  async get(path, params) {
    const url = `${path}/${params}`;
    const _response = await this.client({ method: 'GET', url });
    const response = await _response.json();
    if (response.error) {
      throw new InstaError(response.error);
    }
    return response;
  }

  async post(path, params, payload) {
    const url = `${path}/${params}`;
    const _response = await this.client({ method: 'POST', url, payload });
    const response = await _response.json();
    if (response.error) {
      throw new InstaError(response.error);
    }
    return response;
  }

  async update(path, params, payload) {
    const url = `${path}/${params}`;
    const _response = await this.client({
      method: 'PUT',
      url,
      payload
    });
    const response = await _response.json();
    if (response.error) {
      throw new InstaError(response.error);
    }
    return response;
  }

  async delete(path) {
    const response = await this.client({ method: 'DELETE', url: path });
    const result = await response.json();
    if (result.error) {
      throw new InstaError(result.error);
    }
    return result;
  }
}

const client = new Client();
export default client;
