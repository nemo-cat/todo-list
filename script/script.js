let todoList = [];
let key = 0;


// 할일 추가하는 함수
function addTodo()
{
    let text = $("#todo").val(); //input에 입력된 값 저장
    let currentDate = new Date(); //현재 날짜 생성
    let year = currentDate.getFullYear();
    let month = currentDate.getMonth() + 1;
    let day = currentDate.getDate();
    let writeDate = year + "." + month + "." + day;

    //새로운 투두 생성
    let newTodo = {
        index: key,
        text: text,
        checked: false,
        date: writeDate
    }
    addTodoSuccess(newTodo);
    resetValue() //input값 초기화
    key++;
}

function resetValue()
{
    document.getElementById("todo").value = "";
}

//성공하면 투두리스트에 추가 후 저장
function addTodoSuccess(newTodo)
{
    //html에 새로운 todo li 추가
    $("#todoList").append(appendTodoList(newTodo.index, newTodo.text, newTodo.checked));
    todoList.push(newTodo); //todoList에 추가
    saveLocalstorge() //로컬스토리지 저장
}

// 로컬스토리지에 저장
function saveLocalstorge()
{
    let todoListString = JSON.stringify(todoList);
    window.localStorage.setItem("todoList", todoListString);
}

// 투두리스트 초기화
function refreshTodoList()
{
    $("#todoList").html(""); //중복방지를 위해 리스트 비움
    if(todoList) //todoList에 값이 있어야 다음 실행(혹시모를 오류방지)
    {
        for(let i = 0; i < todoList.length; i++)
        {
            todoList[i].index = i;// todo 삭제하면서 index값이 꼬이게되므로, todoList의 index값을 다시 순서대로 맞춰줌.
            $("#todoList").append(appendTodoList(todoList[i].index, todoList[i].text, todoList[i].checked));
        }
    }
    
    key = todoList.length;
    saveLocalstorge() //로컬스토리지 저장
}

// 이전에 작성한 투두리스트를 불러오는 함수
function loadTodoList()
{
    let checking = window.localStorage.getItem("todoList"); //로컬스토리지의 todoList를 가져옴
    let changeData = JSON.parse(checking); //가져온 todoList를 object형태로 변경;

    //로컬스토리지에 데이터 있으면 추가
    if(checking)
    {
        todoList = changeData; //todoList를 changeData로 변경
        let todoLength = todoList.length;
        let lastTodoIndex = todoList[todoLength - 1].index; //todoList의 마지막 index값을 저장해줌
        key = lastTodoIndex + 1; //다음 todo 생성을위해 마지막 key값 + 1해줌;

        //html에 todoList추가
        for(let i = 0; i < todoList.length; i++)
        {
            $("#todoList").append(appendTodoList(todoList[i].index, todoList[i].text, todoList[i].checked));
        }
    }
}

// 엔터키로 리스트 등록하는 함수
function saveTextByEnter()
{
    if (window.event.keyCode == 13)
    {
        addTodo();
        resetValue();
    }
}

// 할일 개별 삭제하는 함수
function deleteTodo(index) 
{
    todoList.splice(index,1);
    refreshTodoList();
}

// 전체 목록 지우는 함수
function deleteAll(button)
{
    key = 0; //index값 초기화
    todoList = []; //todoList 비우기
    window.localStorage.clear();//로컬스토리지 초기화
    $("#todoList").html(""); //html 비우기
}

// label을 클릭했을때, checkbox가 체크되었는지 확인하는 함수
function todoChecked(index)
{
    // 몇번째 checkbox인지 담는 변수
    let chkIdx = $('#checkList' + index);
    // checkbox의 상태를 반대로 설정한다
    $('#checkList' + index).prop('checked',!chkIdx.is(':checked'));

    //todoList checked로 바꾸고 로컬스토리지에 저장
    todoList[index].checked = true;
    saveLocalstorge();
}

// 인덱스, 할일 텍스트, 체크여부를 받아와 li를 생성하는 함수
function appendTodoList(index, text, checked)
{
    let checkedText = "";
    if (checked == 1)
    {
        checkedText = "checked";
    }

    return  `<li>
                <input id='checkList${index}' type='checkbox' ${checkedText}/>
                <label onclick='todoChecked(${index})'>${text}</label>
                <button id='btn_delete' onclick='deleteTodo(${index})'>
                    <span class='hide'>할일삭제</span>
                </button>
            </li>`;
}