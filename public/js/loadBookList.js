var isLoading = false;
var firstKey, prevKey, dataLen;
var lastCreateDate = 0;
var pagenumber = 0;


$(window).scroll(function(){
  if ($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
    if(isLoading == false) {
      loadBookList();
    }
  }
});

function loadBookList(){
  // loadBookList가 실행되고 있는 도중에는 스크롤 이벤트 발생하지 않음
  isLoading = true;
  var bookshelfRef = database.ref('bookshelf/').orderByChild('createDate');

  if (lastCreateDate) {
    // 만약 lastCreateDate가 있다면 21개의 데이터 호출 : 이후 중복 체크해서 제거해야함
    // 데이터는 createDate(정렬기준)가 lastCreateDate 보다 같거나 큰 값을 갖는 것 부터 시작
    bookshelfRef = bookshelfRef.limitToFirst(21).startAt(lastCreateDate);
  } else {
    // 처음에는 데이터의 처음부터 20개의 데이터 호출
    bookshelfRef = bookshelfRef.limitToFirst(20)
  }
  bookshelfRef.on('child_added', on_child_added);
  bookshelfRef.on('child_changed', on_child_changed);
}

function on_child_added(data) {

  // 데이터 중복 체크
  var bookData = data.val();
  var createDate = bookData.createDate;
  if (createDate == lastCreateDate) {
    isLoading = false;
    return;
  }

  var key = data.key
  var title = bookData.title;
  var publisher = bookData.publisher;
  var html =
  "<div class=\"book-container\" id=\"" + key + "\">" +
  "<div class=\"btns\">" +
  "<div class=\"edit\">" +
  "<a onclick=\"editData('"+key+"')\"><i class=\"material-icons\">mode_edit</i></a>" +
  "</div>" +
  "<div class=\"remove\" >" +
  "<a onclick=\"deleteData('"+key+"')\"><i class=\"material-icons\">delete</i></a>" +
  "</div>" +
  "</div>" +
  "<ul class=\"book-list\">" +
  "<li class=\"book-title origin-data\">" + title + "</li>" +
  "<input type=\"text\" name=\"title\" class=\"editData editTitle\">"+
  "<li class=\"publisher origin-data\">" + publisher + "</li>" +
  "<input type=\"text\" name=\"publisher\" class=\"editData editPublisher\">"+
  "<button type=\"button\" name=\"button\" onclick=\"saveData('"+key+"')\" class=\"input-btn\">save</button>" +
  "<button type=\"button\" name=\"button\" onclick=\"hideInputForm()\" class=\"input-btn\">cancel</button>"+
  "</ul>" +
  "</div>";

  $('.bookshelf').append(html)

  lastCreateDate = createDate;
  isLoading = false;
}

function on_child_changed(data) {
  var key = data.key;
  var data = data.val();
  var title = data.title;
  var publisher = data.publisher;

  $('#'+key+ " > ul.book-list > li.book-title").text(title);
  $('#'+key+ " > ul.book-list > li.publisher").text(publisher);
}
