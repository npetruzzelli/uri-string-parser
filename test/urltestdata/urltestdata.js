const urlTestData = [
  {
    input: 'http://user:pass@sub.host.com:8080/p/a/t/h?query=string#hash',
    uri: {
      scheme: 'http',
      authority: 'user:pass@sub.host.com:8080',
      path: '/p/a/t/h',
      query: 'query=string',
      fragment: 'hash'
    },
    url: {
      protocol: 'http:',
      slashes: '//',
      username: 'user',
      password: 'pass',
      hostname: 'sub.host.com',
      port: '8080',
      pathname: '/p/a/t/h',
      search: '?query=string',
      hash: '#hash'
    }
  },
  {
    input: '//ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js',
    uri: {
      authority: 'ajax.googleapis.com',
      path: '/ajax/libs/jquery/3.3.1/jquery.min.js'
    },
    url: {
      slashes: '//',
      hostname: 'ajax.googleapis.com',
      pathname: '/ajax/libs/jquery/3.3.1/jquery.min.js'
    }
  },
  {
    input: '/assets/scripts/main.js',
    uri: {
      path: '/assets/scripts/main.js'
    },
    url: {
      pathname: '/assets/scripts/main.js'
    }
  },
  {
    input: './assets/styles/main.css',
    uri: {
      path: './assets/styles/main.css'
    },
    url: {
      pathname: './assets/styles/main.css'
    }
  },
  {
    input: '../fonts/open-sans.ttf',
    uri: {
      path: '../fonts/open-sans.ttf'
    },
    url: {
      pathname: '../fonts/open-sans.ttf'
    }
  },
  {
    input: 'images/logo.png',
    uri: {
      path: 'images/logo.png'
    },
    url: {
      pathname: 'images/logo.png'
    }
  },
  {
    input: 'www.google.com/search?q=cat+pictures',
    uri: {
      path: 'www.google.com/search',
      query: 'q=cat+pictures'
    },
    url: {
      pathname: 'www.google.com/search',
      search: '?q=cat+pictures'
    }
  },
  {
    input: 'mailto:no-reply@host.com',
    uri: {
      scheme: 'mailto',
      path: 'no-reply@host.com'
    },
    url: {
      protocol: 'mailto:',
      pathname: 'no-reply@host.com'
    }
  },
  {
    input: 'http://:pass@sub.host.com:8080/p/a/t/h?query=string#hash',
    uri: {
      scheme: 'http',
      authority: ':pass@sub.host.com:8080',
      path: '/p/a/t/h',
      query: 'query=string',
      fragment: 'hash'
    },
    url: {
      protocol: 'http:',
      slashes: '//',
      password: 'pass',
      hostname: 'sub.host.com',
      port: '8080',
      pathname: '/p/a/t/h',
      search: '?query=string',
      hash: '#hash'
    }
  },
  {
    input: ':pass@sub.host.com:8080/p/a/t/h?query=string#hash',
    uri: {
      path: ':pass@sub.host.com:8080/p/a/t/h',
      query: 'query=string',
      fragment: 'hash'
    },
    url: {
      pathname: ':pass@sub.host.com:8080/p/a/t/h',
      search: '?query=string',
      hash: '#hash'
    }
  },
  {
    input: 'www.google.com:foo/p/a/t/h',
    uri: {
      scheme: 'www.google.com',
      path: 'foo/p/a/t/h'
    },
    url: {
      protocol: 'www.google.com:',
      pathname: 'foo/p/a/t/h'
    }
  }
]

module.exports = urlTestData
