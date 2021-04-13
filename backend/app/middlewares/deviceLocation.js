module.exports = function deviceLocation(req) {
  var device, location, useragent;
  const userAgent = req.headers["user-agent"];
var useragent = JSON.parse(userAgent)
  const request = require("request");
  const ip = RequestIp.getClientIp(req);
  
  device = useragent.filter(([key, value]) => value == true);
  // eslint-disable-next-line
  console.log(device);
  request(
    "https://api.ipgeolocationapi.com/geolocate/" + ip + "",
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        location = JSON.parse(body.name); // Show the HTML for the Google homepage.
        // eslint-disable-next-line
        console.log(location);
      }
    }
  );
};
