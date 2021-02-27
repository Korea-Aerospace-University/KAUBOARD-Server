var gv_categoryGrpId = "";
var gv_fYn = "3";

$(document).ready(function () {
  fnGetBbsDfList();

  $("#srchText").keydown(function (e) {
    gfnEnter(e, "fnGetBbsDfList");
  });

  if (gv_categoryGrpId != "") {
    gfnCodeSelect(gv_categoryGrpId, "selCategory", "전체");
  }
});

function fnGetBbsDfList(args) {
  var bbsId = "0119";

  if (args != null) {
    $("#currentPageNo").val(args);
  }

  var currentPageNo = $("#currentPageNo").val();
  if (currentPageNo == "") {
    currentPageNo = 1;
  }

  console.log("args : " + args);
  console.log("selPageSize : " + $("#selPageSize").val());

  gfnGetBbsList(
    bbsId,
    currentPageNo,
    cbMakeBbsDfList,
    $("#selSearch").val(), // sparam
    $("#srchText").val(), // sparamVal
    $("#selPageSize").val(), // pageUnit
    $("#selCategory").val() // stype
  );
}

function cbMakeBbsDfList(result) {
  console.log("cbMakeBbsDfList", result);

  $("#totArticles").text(result.resultCnt);

  var strHtml = "";

  $.each(result.resultList, function (idx, item) {
    if (item.ntcNo > 0) {
      strHtml += '<tr class="emp">';
      strHtml +=
        '<td><img src="/cmm_typeA/images/sub/icon_notice.png" class="icon_notice"></td>';
    } else {
      strHtml += "<tr>";
      strHtml +=
        "<td>" +
        (result.paginationInfo.totalRecordCount -
          ((result.boardVO.pageIndex - 1) * result.boardVO.pageSize + idx)) +
        "</td>";
    }

    console.log("item.replyLc", item.replyLc);

    if (item.replyLc > 0) {
      strHtml += '<td class="tit re' + item.replyLc + '"';
    } else {
      strHtml += '<td class="tit"';
    }
    strHtml +=
      " onclick=\"gfnGetBbsPermitCheck('View','" +
      item.bbsId +
      "', '" +
      item.nttId +
      "')\" >";
    if (item.hideAt == "Y") {
      strHtml += '<a href="javascript:void(0);" class="secret">';
    } else {
      strHtml += '<a href="javascript:void(0);" >';
    }
    if (item.replyLc > 0) {
      strHtml += '<img src="/cmm_typeA/images/sub/mark_re.png">';
    }
    strHtml += item.nttSj;
    strHtml += '<ul class="post_info">';
    strHtml += '<li class="writer">';
    strHtml +=
      '<img src="/cmm_typeA/images/sub/icon_pencil.png">' + item.frstRegisterNm;
    strHtml += "</li>";
    strHtml += '<li class="date">';
    strHtml +=
      '<img src="/cmm_typeA/images/sub/icon_calendar.png">' +
      item.frstRegisterPnttm;
    strHtml += "</li>";
    strHtml += '<li class="views">';
    strHtml +=
      '<img src="/cmm_typeA/images/sub/icon_view.png">' + item.inqireCo;
    strHtml += "</li>";
    if (gv_fYn != "N") {
      strHtml += '<li class="link">';
      if (item.atchFileCnt > 0) {
        strHtml +=
          '<img src="/cmm_typeA/images/sub/icon_link.png" onclick="javascript:gfnFileDownload(\'' +
          item.atchFileId +
          "','" +
          item.fileSn +
          "')\">";
      }
      strHtml += "</li>";
    }

    strHtml += '<li class="lock">';
    if (item.hideAt == "Y") {
      strHtml += '<img src="/cmm_typeA/images/sub/icon_lock.png">';
    }
    strHtml += "</li>";
    strHtml += "</ul>";
    strHtml += "</a></td>";
    strHtml += '<td class="not_m">' + item.frstRegisterNm + "</td>";
    strHtml += '<td class="not_m">' + item.frstRegisterPnttm + "</td>";
    strHtml += '<td class="not_m">' + item.inqireCo + "</td>";
    if (gv_fYn != "N") {
      if (item.atchFileCnt > 0) {
        strHtml += '<td class="not_m">';
        strHtml += '<img src="/cmm_typeA/images/sub/icon_link.png"></td>';
      } else {
        strHtml += "<td></td>";
      }
    }
    strHtml += "</tr>";
  });

  $("#bbsDfTable").html(strHtml);

  gfnPagination(result.paginationInfo, "divPagination", "fnGetBbsDfList");
}
