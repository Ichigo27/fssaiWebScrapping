const Nightmare = require("nightmare");
const nightmare = Nightmare({ show: true });
const cheerio = require("cheerio");
const express = require("express");
const app = express();
const port = 8000;
const url = "https://foodlicensing.fssai.gov.in/cmsweb/TrackFBO.aspx";
const license_no = 11217303000066;

const fssaiAPI = () => {
    nightmare
    .goto(url)
    .type("#ctl00_ContentPlaceHolder1_txtLicense", license_no)
    .click("#ctl00_ContentPlaceHolder1_btnSubmit")
    .wait("#ctl00_ContentPlaceHolder1_div5")
    .evaluate(() => document.querySelector("body").innerHTML)
    .end()
    .then((response) => {
        console.log(getData(response));
        return response;
    })
    .catch((error) => {
        console.error("Search failed:", error);
    });
}

const getData = (html) => {
    const data = [];
    const $ = cheerio.load(html);
    let jsonObj = {}
    $("table tbody tr").each((i, tr) => {
        
        let key = $(tr).find(":nth-child(1)").text();
        let val = $(tr).find(":nth-child(2)").text();
        jsonObj[key] = val;
        
    });
    data.push(jsonObj);
    return data[0];
};

app.get("/:id", (req, res) => {
    res.send(getData(fssaiAPI(req.query.id)));
})

app.listen(port, () => {
    console.log(`Listening to the port no ${port}`);
})