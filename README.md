# Navigation Website

A small navigation website.

![banner](https://github.com/boxtoys/nav/assets/4360480/40d92e17-7d58-4c89-826a-e655341da93a)

## Features

- Data storage based on Google Sheets.
- API based on Vercel Serverless Functions.
- Data cache use LocalStorage & ServiceWorker.

## Deploy

1. Fork this project.
2. Create a new project in vercel dashboard and connect to your project.
3. Create Google Cloud platform credentials keyFile & extract `client_email`, `private_key` field.  set sheet name to `Sheet1`.
4. Set environment variables in the project dashboard.

## ENV

Environment variables required by the project.

| Key          | Value  | Description                              |
| ------------ | ------ | ---------------------------------------- |
| TOKEN        | String | access token                             |
| CLIENT_EMAIL | String | credentials keyFile `client_email` field |
| PRIVATE_KEY  | String | credentials keyFile `private_key` field  |

**Note:**

- Recommended `TOKEN` env is generated use `crypto.randomBytes(16).toString('hex')`
- Environment variables are best added using the vercel client, use the Web UI can be problematic

## WebUI Operation

1. Click the setting button to fill in `SheetID` & `Token` field.
2. Click the Add Link button to add website infomation.
3. Start your navigation website.

## APIs

### {domain}/api/list ![get](https://img.shields.io/badge/HTTP-GET-orange)

Get all data in data storage.

| Parameter | Type   | Description              | isRequired? |
| --------- | ------ | ------------------------ | ----------- |
| sheetId   | String | sheetId of Google Sheets | required    |
| token     | String | access token             | required    |

```js
const result = await axios.get(`${domain}/api/list`, {
  params: {
    token: "74e1dcd881627ee5efa73340324ee47f",
    sheetId: "f82452e3e4979a0a02d2a1ca6c7d74e41959fd6212d2",
  }
});

console.log(result); // output log: [{ name: 'example', icon: 'https://example.com/logo.png', desc: 'this is demo', link: 'https://example.com', category: 'demo' })]
```

### {domain}/api/extract ![post](https://img.shields.io/badge/HTTP-POST-brightgreen)

Parse the metadata of the website.

| Parameter | Type   | Description  | isRequired? |
| --------- | ------ | ------------ | ----------- |
| link      | String | website link | required    |
| token     | String | access token | required    |

```js
const result = await axios.post(
  `${domain}/api/extract`,
  {
    link: "https://www.google.com",
    token: "74e1dcd881627ee5efa73340324ee47f"
  }
);

console.log(result); // output log: { name: 'example', icon: 'https://example.com/logo.png', desc: 'this is demo' }
```

### {domain}/api/add ![post](https://img.shields.io/badge/HTTP-POST-brightgreen)

Add data to data storage.

| Parameter | Type   | Description              | isRequired? |
| --------- | ------ | ------------------------ | ----------- |
| sheetId   | String | sheetId of Google Sheets | required    |
| token     | String | access token             | required    |
| link      | String | website link             | required    |
| name      | String | website name             | required    |
| icon      | String | website icon             | required    |
| desc      | String | website description      | optional    |
| category  | String | website category         | optional    |

```js
const result = await axios
  .post(
    `${domain}/api/add`,
    {
      name: "Example",
      icon: "https://example.com/logo.png",
      desc: "This is demo",
      link: "https://example.com",
      category: "demo",
      token: "74e1dcd881627ee5efa73340324ee47f",
      sheetId: "f82452e3e4979a0a02d2a1ca6c7d74e41959fd6212d2"
    }
  )

console.log(result); // response status: 200
```

### {domain}/api/update ![post](https://img.shields.io/badge/HTTP-POST-brightgreen)

Update data to data storage.

| Parameter | Type   | Description              | isRequired? |
| --------- | ------ | ------------------------ | ----------- |
| sheetId   | String | sheetId of Google Sheets | required    |
| token     | String | access token             | required    |
| link      | String | website link             | required    |
| name      | String | website name             | required    |
| icon      | String | website icon             | required    |
| desc      | String | website description      | optional    |
| category  | String | website category         | optional    |

```js
const result = await axios
  .post(
    `${domain}/api/update`,
    {
      name: "Example",
      icon: "https://example.com/logo.png",
      desc: "This is demo",
      link: "https://example.com",
      category: "demo",
      token: "74e1dcd881627ee5efa73340324ee47f",
      sheetId: "f82452e3e4979a0a02d2a1ca6c7d74e41959fd6212d2"
    }
  )

console.log(result); // response status: 200
```

### {domain}/api/delete ![post](https://img.shields.io/badge/HTTP-POST-brightgreen)

Delete data from data storage.

| Parameter | Type   | Description              | isRequired? |
| --------- | ------ | ------------------------ | ----------- |
| link      | String | website link             | required    |
| token     | String | access token             | required    |
| sheetId   | String | sheetId of Google Sheets | required    |

```js
const result = await axios.post(
  `${domain}/api/delete`,
  {
    link: "https://www.google.com",
    token: "74e1dcd881627ee5efa73340324ee47f",
    sheetId: "f82452e3e4979a0a02d2a1ca6c7d74e41959fd6212d2",
  }
);

console.log(result); // output log: { name: 'example', icon: 'https://example.com/logo.png', desc: 'this is demo' }
```

## Related Documentation

[Vercel functions using environment variables](https://vercel.com/docs/concepts/functions/serverless-functions/quickstart#using-environment-variables)

[Create Google Cloud platform credentials keyFile](https://medium.com/@sakkeerhussainp/google-sheet-as-your-database-for-node-js-backend-a79fc5a6edd9)

## License

[MIT](LICENSE).
