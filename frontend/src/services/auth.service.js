import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth/';

class AuthService {
  login(user) {
    return axios
      .post(
        API_URL + 'signin',
        {
          username: user.username,
          password: user.password
        },

        {
          headers: {
            'Content-Type': 'application/json'
          },
          crossdomain: true
        }
      )
      .then(response => {
        // eslint-disable-next-line
        console.log(response.data);
        if (response.data.accessToken) {
          localStorage.setItem('user', JSON.stringify(response.data));
        }

        return response.data;
      });
  }
  loginGuest(user) {
    return axios
      .post(
        API_URL + 'signinguest',
        {
          username: user.username
        },

        {
          headers: {
            'Content-Type': 'application/json'
          },
          crossdomain: true
        }
      )
      .then(
        response => {
          // eslint-disable-next-line
          console.log(response.data);
          if (response.data.accessToken) {
            localStorage.setItem('user', JSON.stringify(response.data));
            
          }
          return response.data;
        },
        err => {
          // eslint-disable-next-line
          console.log(err);
          return err;
        }
      );
  }
  emailCode(user) {
    return axios
      .post(
        API_URL + 'emailCodelogin',
        {
          email: user.email
        },

        {
          headers: {
            'Content-Type': 'application/json'
          },
          crossdomain: true
        }
      )
      .then(
        response => {
          // eslint-disable-next-line
          console.log(response.data);
          return response.data;
        },
        err => {
          // eslint-disable-next-line
          console.log(err);
          return err;
        }
      );
  }

  resetPass(user) {
    return axios
      .post(
        API_URL + 'forgot',
        {
          email: user.email  
        },

        {
          headers: {
            'Content-Type': 'application/json'
          },
          crossdomain: true
        }
      )
      .then(response => {
        // eslint-disable-next-line
        console.log(response.data);
        return response.data;
      });
  }
  confirmPass(user) {
    return axios
      .post(
        API_URL + 'changepassword',
        {
          user: user
        },

        {
          headers: {
            'Content-Type': 'application/json'
          },
          crossdomain: true
        }
      )
      .then(response => {
        // eslint-disable-next-line
        console.log(response.data);
        return response.data;
      });
  }
  confirmcode(code) {
    // eslint-disable-next-line
    console.log(code);
    return axios
      .post(
        API_URL + 'confirmcode',
        {
          code: code
        },

        {
          headers: {
            'Content-Type': 'application/json'
          },
          crossdomain: true
        }
      )
      .then(response => {
        // eslint-disable-next-line
        console.log(response);
        return response;
      });
  }
  confirmtoken(token) {
    return axios
      .post(
        API_URL + 'confirmtoken',
        {
          token: token
        },

        {
          headers: {
            'Content-Type': 'application/json'
          },
          crossdomain: true
        }
      )
      .then(response => {
        // eslint-disable-next-line
        // console.log(response.data);
        return response.data;
      });
  }
  logout() { 
    localStorage.removeItem('user');
  }

  register(user) {
    return axios.post(API_URL + 'signup', {
      username: user.username,
      email: user.email,
      password: user.password
    });
  }
}

export default new AuthService();
