const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).send("Hello, Fucking Depromeet!").end();
});
app.get("/api/place/:id", (req, res) => {
  try {
    axios
      .get(`https://place.map.kakao.com/main/v/${req.params.id}`)
      .then((axiosRes) => {
        const scoreSum = axiosRes.data.basicInfo.feedback.scoresum;
        const scoreCnt = axiosRes.data.basicInfo.feedback.scorecnt;
        let point;
        if (scoreSum === undefined || scoreCnt === undefined) {
          point = "0";
        } else {
          point = (scoreSum / scoreCnt).toFixed(1).toString();
        }

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

        const restaurantDetailResponse = {
          placeId: axiosRes.data.basicInfo.cid,
          title: axiosRes.data.basicInfo.placenamefull,
          photo: axiosRes.data.basicInfo.mainphotourl,
          address: address,
          scoreCnt: axiosRes.data.basicInfo.feedback.scorecnt,
          point: point,
          blogReviewCnt: axiosRes.data.blogReview.blogReviewCnt,
          x: 528047,
          y: 1121370,
        };
        res.status(200).send(JSON.stringify(restaurantDetailResponse)).end();
      });
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
