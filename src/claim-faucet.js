const { getAddress } = require("viem");
const axios = require("axios");
const getProxy = require("./proxy");
const clientKey = "CAP-AF031EE52644E2D91E9C7C19978EDDC4";
const websiteKey = "0x4AAAAAAARdAuciFArKhVwt";
const websiteURL = "https://bartio.faucet.berachain.com";

async function capsolver() {
  const payload = {
    clientKey,
    task: {
      type: "AntiTurnstileTaskProxyLess",
      websiteKey,
      websiteURL,
      metadata: {
        action: "", // Optional, specify if needed
        type: "turnstile",
      },
    },
  };

  try {
    const res = await fetch("https://api.capsolver.com/createTask", {
      method: "POST",
      body: JSON.stringify(payload),
    }).then((res) => res.json());
    const task_id = res.taskId;
    if (!task_id) {
      console.log("Failed to create task:", res.data);
      return;
    }
    console.log("Got taskId:", task_id);

    while (true) {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Delay for 1 second

      const getResultPayload = { clientKey, taskId: task_id };
      const resp = await fetch("https://api.capsolver.com/getTaskResult", {
        method: "POST",
        body: JSON.stringify(getResultPayload),
      }).then((res) => res.json());
      const status = resp.status;

      if (status === "ready") {
        return resp.solution.token;
      }
      if (status === "failed" || resp.errorId) {
        console.log("Solve failed! response:", resp);
        return;
      }
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

async function claimFaucet(address, proxy) {
  const token = await capsolver();

  console.log("--------- Claiming faucet -----------");
  console.log("Address: ", address);
  console.log("Proxy: ", proxy);

  await axios({
    method: "POST",
    url: "https://bartio-faucet.berachain-devnet.com/api/claim",
    headers: {
      Authorization: `Bearer ${token}`,
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
      "Content-Type": "text/plain; charset=utf-8",
    },
    data: JSON.stringify({ address }),
    proxy: {
      protocol: "http",
      host: proxy.proxy_address,
      port: proxy.port,
      auth: {
        username: proxy.username,
        password: proxy.password,
      },
    },
  })
    .then((res) => console.log(res.data))
    .catch((err) => console.error(err));
}

const addressList = [
  "0x8b236591c7eb49d4321e4e92b0c4b79120024e3d",
  "0x7e7035dfbfcbbab291e3c9f7ee86cf84b4571bed",
  "0xd9bfce43841d983677373db90d80715f33c72f05",
  "0xe8a29c20f9cf100008c359d22a3fd3c9ce57f89c",
  "0xa638b4206595cf4806b030e4b58615c5a6a84e6e",
  "0x442f0029f48234af04a17441d2e9d2f6f5b6c696",
  "0x60877918db921e59386088c9acc352cfb5116619",
  "0x112d0c74823771e90f368f94f9364cc56851c877",
  "0x884f01869d287c83075f44174cf68af73a39d34c",
  "0x7bf747eb3b4af1c8b619f6ce38f90434977f72b2",
  "0x5a76609a0e2f64c8eef3989dc5924c025a3c6b28",
  "0xf21a3bdb27f153f8469933d20aa4a8ba34e4a685",
  "0x672b8f54c2d65e137bfc98f7d2762edaa1ab0892",
  "0x37c86768a937e8b37f510cb43bd90eb66c66ecfc",
  "0x21917fa45e82d03a173801db4006e575582b7e1b",
  "0x150344ccd6dadfb978839c9e5548d9d1038aab22",
  "0x08d04bfcfa403e4cd99afea6c106c5d6351e88be",
  "0x549ab11426100ae0245aa1be91946bbb899edb7a",
  "0x305ad747299ca2a6ebbebfa96f2063eaf6c6058c",
  "0x28e15c5804725d358fe93877e3262c3c64561fc2",
  "0x3f8b99139a740a89162b30079ca2fcd102d358a4",
  "0x73beee1b566739a60a658315e768d2f7b8aa92d6",
  "0xfc27141b7c2aa800a0f68dda04fce507ec0ff247",
  "0x1f5cd5be1b8f3c4dce770d70953f2dbe85e174d1",
  "0xeca83d1965303c14e61fb9caeca10d7a697d971d",
  "0x118850c91939d760a49ceb8732fb604159d6f21f",
  "0x295441fb02608d32cd46cf9fe0651c3b7f1907dd",
  "0x12236be6b80a09fb906477fd995a011e1e2a81a0",
  "0xc3cf5e3558775dd38627bc833e6c58b6a9775ca5",
  "0x511923daf0afc3b8a41fe60be538d09ba8be7faf",
  "0xca21cab76d2b0fb7993e2c866dbb2611e8f20616",
  "0xcd59486726827f875f3bba397511ddf16a6c8a70",
  "0x37b56ddff70174755f72e7585e65f5aa234ba147",
  "0x8f5a2f90979d4046d1a5411fd2fe2cd3b1c84ff5",
  "0x6cdb21fa9b2c6ff051961259f8687bf7bf2208fd",
  "0xeeb964e3c78e1774f266823278ad85eeb5268e03",
  "0x8b0ce01a1d593279248c496a15876e5e4b434a3e",
  "0x24646b3f887224a7828e8202e7f682986cb562de",
  "0x2c34bc80a053db7405be08b662ede90d173d8af1",
  "0x16a5f7139bc35e327533b2ec44443c4fb7fcb348",
  "0xbe48ee49dd16954555e4b057ff0b229cc87bd526",
  "0x9f7377620dd366772e9f913e5aafb82c2eb389c2",
  "0x7643cdc269d90f56aa89a3c825a961a47727826c",
  "0x32b84825f8f857f44ef9bb9146e9257169653ee6",
  "0x93fa701b25aabfb95e374f26af98e17ffa6cbc39",
  "0xdc22cd24ec50134f565db3f2d55d750c49cba695",
  "0xde7827b2ae86dfa833de24f4e0977d3289eb5401",
  "0xa4d44c95b7e559b8915716d85e4580ba0bb7c4d4",
  "0xcea0d514f6936dab86bd499c82fd72f0e9a1ceea",
  "0xe81fe4ebb74e81dbf2055ca9304241bc0a62c014",
  "0xb11843f4bd3c92fe19b1d0e670a605550f861d4b",
  "0xf772467ab4cbe86c853cc86d9f0fbfa96cf1299f",
  "0x9201f9351b0f577966be15d8db517faa48ed6658",
  "0x81d7e21c4a9f536d094f4d34e1b634acb6c8dddc",
  "0x270b855d87e48dac1af44550bbe41ab79cd5cec0",
  "0x4eefc0e18e693d43220750ee63b7748871cb27bc",
  "0x9e956739038ebed0140cfd580754f517ae1d5880",
  "0x13c95302863ce943700f81a5643851d8b4418430",
  "0x11bf97b69f5a0d8c568b8c8eab2276be27bcdb62",
  "0x0f09ef42fa1511777131f4e9122c7b9c66c7d58e",
  "0x1257a27b0217f77b0bacd4bd8eea9db08ead3f7e",
  "0xb1d4ffe09cacc98fcab629040a9d32575cf093ee",
  "0xcf6a72f5e3942e514a1faf2ad863084de28b2832",
  "0x4af8390839c4a174e7720e4df269767804d3596f",
  "0xe4b970c742ab6b1604fda2c337c2878e4b5ebf4c",
  "0xed9a8efb709f7bb36de0f565895efb79788179e7",
  "0x01539a78887d52d16702d0580066c29bdbde5e94",
  "0x1d0bdfe455e8a751e7a05af577c507354aa06f88",
  "0x3ef82e78f162a2c9af31f2290a781dc8821b2ecb",
  "0xe96369116cb710286ce33c439bc3bbd1e3b748df",
  "0x3c2c044ed5d47441388637cf7d9e21717a7e2752",
  "0xa7c40919f9b4e7087acfeb03a8979a3eece69b53",
  "0xbaecade2d5111fe7ba3c160d728164ebf7d35d5a",
  "0xc62e3dc8b1a064ae84be2ac45a7da44afd07532a",
  "0x3810b622931dceda2b75c28580622c36fde7b60b",
  "0x9a909254ab4d0016a56a9b530757805a10c42f16",
  "0xb78bd0911d0642e354370d7de956fee3a618d5ef",
  "0x4d47b9e099d2f689503f1dd98ce89a24f0f5ecbf",
  "0xf0b8a9217bc388e6ba3c57433775ef70bedb7a7e",
  "0xb9c89561974ac0fa5a37b0101ba82f08617a4a4e",
  "0xf991a03f22258dd9cf5d85a8891abefdd3885d1d",
  "0x31a9dd197a180fb4357855eee8bbae7f999e76e2",
  "0xf04d45573a35fbc1c7aeb006ba3406428eb88982",
  "0xa06567d08911bc8932148bed80c89e73859d395b",
  "0x36c71afdd6e86c22ad1637f055b3d3112f02e502",
  "0x95396c90e9e13463f15735395e2d53801c4615da",
  "0x0d728a967f0ebaa785a6e54c8dd671d903354218",
  "0x18d7667424412b155340e7e8482b562237d6d9ff",
  "0x4df41443d430a0d2b858458a1e91aaa4c7ca4175",
  "0x4bad2ac9db741bd83698dccf2f54469ac0ae6a9b",
  "0x9612c84f8fbac01f69fdf7f39694bed83c5683f2",
  "0x4b573e2595a70b5a2f0b02697e2fcbc40ca54e94",
  "0xcd2faf6164dddf28bd5ad1c5263f6039a79ae00a",
  "0x0fe2bd39c763a0a4e42502e8b16de0c268db9802",
  "0xff769722c36806698722df68a9c1273cdceebc03",
  "0x8b8024931d92c1d33bc4e75a789fe3a81ac6990c",
  "0x46327f63f9b265d903ab07cbe705563df076ac6d",
  "0x51c978dbd27a4178840a619819735234cd41c393",
  "0xd5153a6d7750e09d20351cbc6c07bffa72468cc1",
  "0x994a6c290feacddfb35f70ddfdf82a63d34efea8",
];

module.exports = async function batchRun() {
  const proxyList = await getProxy();

  if (proxyList.length) {
    addressList
      .map((item) => getAddress(item))
      .forEach(async (address, index) => {
        await claimFaucet(address, proxyList[index]);
      });
  }
};
