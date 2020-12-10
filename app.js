const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();
app.use(cors());

async function getRestuarntDetail(req) {
  return axios.get(`https://place.map.kakao.com/main/v/${req.params.id}`);
}

app.get("/", (req, res) => {
  res.status(200).send("Hello, Fucking Depromeet ver 1.0.4").end();
});
app.get("/api/place/:id", async (req, res) => {
  try {
    const axiosRes = await getRestuarntDetail(req);
    const scoreSum = axiosRes.data.basicInfo.feedback.scoresum;
    const scoreCnt = axiosRes.data.basicInfo.feedback.scorecnt;
    let point;
    if (scoreSum === undefined || scoreCnt === undefined) {
      point = "0";
    } else {
      point = (scoreSum / scoreCnt).toFixed(1).toString();
    }

    const reviewCnt =
      axiosRes.data.blogReview === undefined ||
      axiosRes.data.blogReview.blogrvwcnt === undefined
        ? 0
        : axiosRes.data.blogReview.blogrvwcnt;

    const region =
      axiosRes.data.basicInfo.address.region.newaddrfullname === undefined
        ? ""
        : axiosRes.data.basicInfo.address.region.newaddrfullname;
    const newAddress =
      axiosRes.data.basicInfo.address.newaddr.newaddrfull === undefined
        ? ""
        : " " + axiosRes.data.basicInfo.address.newaddr.newaddrfull;
    const addressDetail =
      axiosRes.data.basicInfo.address.addressDetail === undefined
        ? ""
        : " " + axiosRes.data.basicInfo.address.addressDetail;

    const address = `${region}${newAddress}${addressDetail}`;

    const x = Number(req.query.x);
    const y = Number(req.query.y);

    const restaurantDetailResponse = {
      placeId: axiosRes.data.basicInfo.cid,
      title: axiosRes.data.basicInfo.placenamefull,
      photo: axiosRes.data.basicInfo.mainphotourl,
      address,
      scoreCnt: axiosRes.data.basicInfo.feedback.scorecnt,
      point,
      reviewCnt,
      x,
      y,
    };
    res.status(200).send(JSON.stringify(restaurantDetailResponse)).end();
  } catch (err) {
    console.error("GG", err);
  }
});
// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log("Press Ctrl+C to quit.");
});
// [END gae_node_request_example]
module.exports = app;
