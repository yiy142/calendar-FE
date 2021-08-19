import axios from 'axios';

// const axiosInstance = axios.create({
//   baseURL: 'https://71be990f4d73.ngrok.io',
//   headers: {
//     'Access-Control-Allow-Origin': '*',
//   },
// });


export default new class Service {
  async savePreference(payload) {
    const axiosInstance = axios.create({
      baseURL: 'https://71be990f4d73.ngrok.io',
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
    return axiosInstance.post("/preference/save", payload)
      .then(res => res).catch(err => { throw new Error(err) });
  }

  async getPreference(payload) {
    const axiosInstance = axios.create({
      baseURL: 'https://71be990f4d73.ngrok.io',
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
    return axiosInstance.post("/preference/get", payload)
      .then(res => res).catch(err => { throw new Error(err) });
  }

  async findNorm(payload) {
    const axiosInstance = axios.create({
      baseURL: 'https://71be990f4d73.ngrok.io',
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
    return axiosInstance.post("/mmAuth/calendar/findNorm", payload)
      .then(res => res).catch(err => {
        throw new Error(err);
      })
  }

  async findSlot(payload) {
    const axiosInstance = axios.create({
      baseURL: 'https://71be990f4d73.ngrok.io',
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
    return axiosInstance.post("/mmAuth/calendar/findSlot", payload)
      .then(res => res).catch(err => {
        throw new Error(err);
      })
  }

  async pushCalendar(payload) {
    const axiosInstance = axios.create({
      baseURL: 'https://71be990f4d73.ngrok.io',
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
    return axiosInstance.post("/mmAuth/calendar/pushCalendar", payload)
      .then(res => res).catch(err => { throw new Error(err) });
  }

  async getUserEmail(payload) {
    const axiosInstance = axios.create({
      baseURL: 'https://71be990f4d73.ngrok.io',
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
    return axiosInstance.post('/users/get', payload)
      .then(res => res).catch(err => { throw new Error(err) })
  }

  async listCalendars(payload) {
    const axiosInstance = axios.create({
      baseURL: 'https://71be990f4d73.ngrok.io',
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
    return axiosInstance.post("/auth/calendar/list", payload)
      .then((res) => res).catch((err) => {
        throw new Error(err);
      });
  }
  async shareCalendar(payload) {
    const axiosInstance = axios.create({
      baseURL: 'https://71be990f4d73.ngrok.io',
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
    return axiosInstance.post("/auth/calendar/shareCalendar", payload)
      .then((res) => res).catch(err => {
        throw new Error(err);
      })
  }

  async subscribeCalendar(payload) {
    const axiosInstance = axios.create({
      baseURL: 'https://71be990f4d73.ngrok.io',
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
    return axiosInstance.post("/mmAuth/calendar/subscribeCalendar", payload)
      .then((res) => res).catch(err => {
        throw new Error(err);
      })
  }

  async getUsers() {
    const axiosInstance = axios.create({
      baseURL: 'https://71be990f4d73.ngrok.io',
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
    return axiosInstance.get("/users/list")
      .then(res => res).catch(err => { throw new Error(err) })
  }
}();
