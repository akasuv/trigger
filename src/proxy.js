module.exports = async function request() {
  console.log("------- Getting proxies ------");
  const res = await fetch(
    "https://proxy.webshare.io/api/v2/proxy/list/?page=1&page_size=100&mode=direct",
    {
      headers: {
        Authorization: "Token c0gdd082ta1dicrzoiccfscy7ekalq1s4rro2fs4",
      },
    },
  )
    .then((res) => res.json())
    .catch((error) => console.log("error", error));

  return res.results;
};
