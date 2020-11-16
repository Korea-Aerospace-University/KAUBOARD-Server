const axios = require("axios");
const cheerio = require("cheerio");
const iconv = require("iconv-lite");

let generalNotiList = [];
let schoolNotiList = [];

const filterFixedNoti = (noti = []) => {
  noti.filter((el) => {
    if (parseInt(el.slice(0, 4) === true)) {
      return true;
    } else {
      return false;
    }
  });
  return noti;
};

const getGeneralNoti = async () => {
  try {
    return await axios({
      url: "http://www.kau.ac.kr/page/kauspace/general_list.jsp",
      method: "GET",
      responseType: "arraybuffer",
    });
  } catch (err) {
    console.error(err);
  }
};

const getSchoolNoti = async () => {
  try {
    return await axios({
      url: "http://www.kau.ac.kr/page/kauspace/academicinfo_list.jsp",
      method: "GET",
      responseType: "arraybuffer",
    });
  } catch (err) {
    console.error(err);
  }
};

getGeneralNoti().then((res) => {
  let decoded = iconv.decode(res.data, "EUC-KR");
  const $ = cheerio.load(decoded);
  const notiTable = $("#board_form > div.board_list > table > tbody");
  for (let i = 0; i < notiTable.children().length; i++) {
    let content = notiTable
      .children()
      .eq(i)
      .text()
      .trim()
      .replace(/\s\s+/g, " ");

    let timeStamp = new Date(
      content.slice(content.indexOf("-") - 4, content.indexOf("-") + 6) +
        " 12:00:00"
    ).getTime();
    console.log(
      content.slice(content.indexOf("-") - 4, content.indexOf("-") + 6) +
        " 12:00:00"
    );
    console.log(timeStamp);
    generalNotiList = [
      ...generalNotiList,
      {
        content: content,
        date:
          content.slice(content.indexOf("-") - 4, content.indexOf("-") + 6) +
          " 12:00:00",
      },
    ];
  }
  console.log(generalNotiList[0].content);
  console.log(generalNotiList[0].date);
  console.log(generalNotiList);
});

getSchoolNoti().then((res) => {
  let decoded = iconv.decode(res.data, "EUC-KR");
  const $ = cheerio.load(decoded);
  const notiTable = $("#board_form > div.board_list > table > tbody");
  for (let i = 0; i < notiTable.children().length; i++) {
    schoolNotiList = [
      ...schoolNotiList,
      notiTable.children().eq(i).text().trim().replace(/\s\s+/g, " "),
    ];
  }
  console.log(schoolNotiList);
});
