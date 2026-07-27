let jsonPath = "/Json/"

function w3_open() {
  $("#navbar").css("display", "block");
  $("#navbar").addClass("to_nav_in");
  $("#mask").css("background-color", "rgba(1, 0, 0, 0.3)");
  disableScroll();

  $("#open_nav").css("display", "none");
  setTimeout(() => {
    $("#navbar").removeClass("to_nav_in");
    $("#close_nav").css("display", "block");
    $("#mask").css("pointer-events", "fill");
  }, 800);
}

function w3_close(_callback) {
  $("#navbar").addClass("to_nav_out");
  $("#close_nav").css("display", "none");
  $("#mask").css("background-color", "rgba(0, 0, 0, 0)");
  $("#mask").css("pointer-events", "none");

  setTimeout(() => {
    $("#navbar").removeClass("to_nav_out");
    $("#navbar").css("display", "none");
    $("#open_nav").css("display", "block");
    if (_callback) { _callback(); }
    enableScroll();
  }, 500);
}

function go_link(_link, open) {
  w3_close(() => {
    if (open) {
      window.open(_link, '_blank');
    } else {
      location.href = _link;
    }
  })
}

//捲動
setTimeout(() => {
  let top_div = document.getElementsByClassName("top_div")[0];
  top_div.classList.remove('hide');
}, 100);

function disableScroll() {
  document.body.style.overflow = 'hidden';
}

function enableScroll() {
  document.body.style.overflow = '';
}

function crossfadeImages() {
  const images = document.querySelectorAll('.background-image');
  const imagePaths = ['home1.jpg', 'home2.jpg', 'home3.jpg', 'home4.jpg'];
  let currentImageIndex = 0;
  images[0].style.backgroundImage = `url(/imgs/${imagePaths[0]})`;

  setInterval(() => {
    images[currentImageIndex].classList.remove('active');
    currentImageIndex = (currentImageIndex + 1) % images.length;
    images[currentImageIndex].classList.add('active');
  }, 5000); // 5 seconds interval

  setInterval(() => {
    const nextImageIndex = (currentImageIndex + 1) % images.length;
    images[nextImageIndex].style.backgroundImage = `url(/imgs/${imagePaths[nextImageIndex]})`;
  }, 1000); // 1 second interval to update background images
}

let menu_onload = 0;
let loadedimgs = []
let menu_buttonContainer;
let menu_subBtn = [];
let menu_Buttons = [];
let fetchfile;
let hideSeason = false;

function FetchAllMenu(_language) {
  fetchfile = jsonPath + (_language === 'CN' ? 'menu.json' : 'EN_menu.json');
  menu_buttonContainer = document.getElementsByClassName("buttonContainer")[0];
  menu_Buttons = document.getElementsByClassName("menu_button");
  console.log(menu_Buttons)

  //Fetch Data
  fetch(fetchfile)
    .then(function (response) {
      return response.json();
    })
    .then(function (jsonData) {
      hideSeason = jsonData[0].hide;
      if (!hideSeason) {
        document.getElementsByClassName("sub_button-container")[0].style.display = 'block';
      }

      for (let i = 0; i < jsonData.length; i++) {
        menu_Buttons[i].children[0].innerText = jsonData[i].name;
        if (i === 0) {
          for (let j = 0; j < jsonData[0].seasons.length; j++) {
            const image = new Image();
            image.src = jsonData[0].seasons[j].image;
            image.onload = function () {
              menu_onload += 1;
              loadedimgs.push(image)
            };

            //增加按鈕
            menu_subBtn[j] = document.createElement('div');
            menu_subBtn[j].className = 'menu_btn';
            if (j == 0) {
              menu_subBtn[j].classList.add("active");
            }
            menu_subBtn[j].onclick = () => { ChangeMenu(0, j) };
            menu_buttonContainer.appendChild(menu_subBtn[j]);

          }
        } else {
          const image = new Image();
          image.src = jsonData[i].image;
          image.onload = function () {
            menu_onload += 1;
            if (hideSeason) {
              ChangeMenu(1);
            }
            else {
              ChangeMenu(0, 0);
            }
            loadedimgs.push(image)
            console.log(loadedimgs);
          };
        }
      }
    })
    .catch(function (error) {
      console.log('Error:', error);
    });
}

function FetchNewMenu(_language) {
  // 設定 fetchfile 路徑
  fetchfile = jsonPath + (_language === 'CN' ? 'menu.json' : 'EN_menu.json');
  menu_content_container = document.getElementById("menu_content-container");

  // 創建彈出視窗容器
  const modalContainer = document.createElement('div');
  modalContainer.id = 'menu-modal';
  modalContainer.style.display = 'none';
  modalContainer.classList.add('modal-container');
  document.body.appendChild(modalContainer);

  // 設定彈出視窗內容結構
  modalContainer.innerHTML = `
  <div class="modal-content">
    <span class="close-button">&times;</span>
    <div class="modal-body">
      <img class="modal-image" src="" alt="">
      <div class="modal-text">
        <h2 class="modal-title">標題</h2>
        <div class="modal-price">價格</div>
        <div class="modal-text1">內容1</div>
        <div class="modal-text2">內容2</div>
        <div class="modal-text3">內容3</div>
      </div>
    </div>
  </div>
  `;

  // 顯示彈出視窗函數
  function showModal(data) {
    const modal = document.getElementById('menu-modal');
    document.body.style.overflow = 'hidden'; // 禁止背景捲動

    modal.querySelector('.modal-body').scrollTop = 0;
    modal.querySelector('.modal-image').src = data.image;
    modal.querySelector('.modal-title').textContent = data.name;
    modal.querySelector('.modal-price').textContent = data.price;
    modal.querySelector('.modal-text1').textContent = data.text1;
    modal.querySelector('.modal-text2').textContent = data.text2;
    modal.querySelector('.modal-text3').textContent = data.text3;

    modal.style.display = 'flex';
  }

  const closeButton = modalContainer.querySelector('.close-button');

  // 在關閉視窗時恢復捲動
  closeButton.onclick = function () {
    const modal = document.getElementById('menu-modal');
    const modalBody = modal.querySelector('.modal-body');
    if (modalBody) modalBody.scrollTop = 0;
    modal.style.display = 'none';
    document.body.style.overflow = ''; // 恢復背景捲動
  };

  // 點擊外部關閉
  window.onclick = function (event) {
    if (event.target == modalContainer) {
      const modal = document.getElementById('menu-modal');
      const modalBody = modal.querySelector('.modal-body');
      if (modalBody) modalBody.scrollTop = 0;
      modalContainer.style.display = 'none';
      document.body.style.overflow = ''; // 恢復背景捲動
    }
  };

  function createMenuItem(data) {
    const menuItem = document.createElement('div');
    menuItem.classList.add('menu-item');
  
    // 動態生成類型圖片
    let typeIcons = '';
    if (data.types && Array.isArray(data.types)) {
      typeIcons = data.types.map(type => 
        `<img class="menu-type-icon" src="imgs/Types_${type}.png" alt="">`
      ).join('');
    }
  
    // 動態生成 menu-item-code（如 "期間限定"）
    const codeDiv = data.code
      ? `<div class="menu-item-code" style="background-color:${data.color};">
            ${data.code}
         </div>` 
      : '';
  
    menuItem.innerHTML = `
      <div class="menu-item-image">
        <img src="${data.image}" alt="${data.name}">
      </div>
      <div class="menu-item-info">
        <div class="menu-item-header">
          ${codeDiv}
          <div class="menu-item-types">${typeIcons}</div> <!-- 插入類型圖片 -->
        </div>
        <h3 class="menu-item-title">${data.name}</h3>
        <div class="menu-item-price">${data.price}</div>
      </div>
    `;
  
    menuItem.onclick = () => showModal(data);
    return menuItem;
  }
  
  
  

  // 創建選單網格
  function createMenuGrid(jsonData) {
    const menuGrid = document.getElementsByClassName("menu_grid")[0];
    jsonData.forEach(data => {
      menuGrid.appendChild(createMenuItem(data));
    });

    return menuGrid;
  }

  // Fetch Data
  fetch(fetchfile)
    .then(function (response) {
      return response.json();
    })
    .then(function (jsonData) {
      menu_content_container.appendChild(createMenuGrid(jsonData));
    })
    .catch(function (error) {
      console.log('Error:', error);
    });
}



function ChangeMenu(index, subindex) {
  // 先隱藏所有內容區塊
  let content = document.getElementsByClassName("menu_content")[0];
  content.classList.add('mask');
  content.classList.add('notransition');
  menu_buttonContainer = document.getElementsByClassName("buttonContainer")[0];
  menu_buttonContainer.style.display = subindex === undefined ? 'none' : 'flex';

  if (subindex !== undefined) {
    for (var i = 0; i < menu_subBtn.length; i++) {
      menu_subBtn[i].classList.remove("active");
    }
    menu_subBtn[subindex].classList.add("active");
  }

  let buttons = document.getElementsByClassName("menu_button");
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].classList.remove("active");
  }
  buttons[index].classList.add("active");

  //Fetch Data
  fetch(fetchfile)
    .then(function (response) {
      return response.json();
    })
    .then(function (jsonData) {

      let data = subindex === undefined ? jsonData[index] : jsonData[index].seasons[subindex];

      //價格
      let tmp = document.getElementsByClassName("menu_price");
      let menu_price = tmp[0].querySelectorAll('p')[0];
      menu_price.textContent = data.price;

      //圖片
      let menu_image = document.getElementsByClassName("menu_image")[0];
      menu_image.src = data.image;
      menu_image.alt = data.name;
      content.classList.remove('notransition');

      //文字

      document.getElementById("content_text_title").textContent = subindex !== undefined ? data.name : "";
      document.getElementById("content_text_title").style.display = subindex !== undefined ? 'block' : "none";

      document.getElementById("content_text1").textContent = data.text1;
      document.getElementById("content_text2").textContent = data.text2;
      document.getElementById("content_text3").textContent = data.text3;


      let wineDiv = document.getElementsByClassName("menu_content_wine")[0];
      let infoDiv = document.getElementsByClassName("menu_content_info")[0];
      if (index === 7) {
        wineDiv.style.display = 'block';
        infoDiv.style.display = 'none';
      } else {
        wineDiv.style.display = 'none';
        infoDiv.style.display = 'block';
      }

      menu_image.onload = function () {
        setTimeout(() => {
          content.classList.remove('mask');
        }, 10);
      };

    })
    .catch(function (error) {
      console.log('Error:', error);
    });
}

function callPhone(phoneNumber) {
  window.location.href = 'tel:' + phoneNumber;
}

function CreateNews(_language) {

  let container = document.getElementById("container");
  let _fetchfile = jsonPath + (_language === 'CN' ? 'news.json' : 'EN_news.json');

  fetch(_fetchfile)
    .then(function (response) {
      return response.json();
    })
    .then(function (jsonData) {
      let data = jsonData;
      for (let i = 0; i < data.length; i++) {
        console.log(data[i].data);
        //newsBox
        let newsBox = document.createElement('div');
        newsBox.classList.add('newsBox');
        container.appendChild(newsBox);

        //date
        let date = document.createElement('p');
        date.innerText = data[i].date;
        date.classList.add('newsDate');
        newsBox.appendChild(date);

        //Hline
        let hline = document.createElement('div');
        hline.classList.add('hline');
        newsBox.appendChild(hline);

        //HightLight
        let highlight = document.createElement('p');
        highlight.innerText = data[i].highlight;
        highlight.classList.add('highlight');
        newsBox.appendChild(highlight);

        //HightLight
        let innerContent = document.createElement('p');
        innerContent.innerText = data[i].text;
        innerContent.classList.add('innerContent');
        newsBox.appendChild(innerContent);
      }
      container.appendChild(document.createElement('br'));
    })
    .catch(function (error) {
      console.log('Error:', error);
    });
}


//Enviroment----------------------------------------
//輪播不使用原生捲動,改以 transform 移動,位置完全由 JS 控制
let env_sectionNum = [0, 0];
let env_buttonContainer = [];
let env_btns = [[], []];
let env_index = [0, 0];
let env_tracks = [];

function SetScrollListener() {
  const boxes = document.getElementsByClassName("contentBox");
  env_buttonContainer = document.getElementsByClassName("buttonContainer");

  for (let i = 0; i < boxes.length; i++) {
    const box = boxes[i];
    const track = box.querySelector('.contents');
    if (!track) { continue; } //crab-page 的 contentBox 是文字區塊,略過
    env_tracks[i] = track;
    const childElements = track.querySelectorAll('.imagezone');
    env_sectionNum[i] = childElements.length;

    for (let j = 0; j < childElements.length; j++) {
      env_btns[i][j] = document.createElement('div');
      env_btns[i][j].className = 'env_btn';
      env_btns[i][j].onclick = () => { ChangeEnvPic(j, i) };
      if (j == 0) {
        env_btns[i][j].classList.add("active");
      }
      env_buttonContainer[i].appendChild(env_btns[i][j]);
    }

    let startX = 0, startY = 0, startTime = 0;
    let axisLock = '';

    box.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      startTime = e.timeStamp;
      axisLock = '';
      track.style.transition = 'none'; //拖曳期間直接跟手,不要動畫
    }, { passive: true });

    box.addEventListener('touchmove', (e) => {
      const dx = e.touches[0].clientX - startX;
      const dy = e.touches[0].clientY - startY;

      //第一次明顯移動時判斷方向,直向交給頁面捲動
      if (!axisLock) {
        if (Math.abs(dx) < 5 && Math.abs(dy) < 5) { return; }
        axisLock = Math.abs(dx) > Math.abs(dy) ? 'h' : 'v';
      }
      if (axisLock !== 'h') { return; }

      const w = box.clientWidth;
      let offset = -env_index[i] * w + dx;

      //頭尾加阻尼,拖得動但拖不遠
      const minOffset = -(env_sectionNum[i] - 1) * w;
      if (offset > 0) { offset = offset / 3; }
      else if (offset < minOffset) { offset = minOffset + (offset - minOffset) / 3; }

      track.style.transform = 'translateX(' + offset + 'px)';
    }, { passive: true });

    box.addEventListener('touchend', (e) => {
      track.style.transition = '';
      if (axisLock !== 'h') { return; }
      axisLock = '';

      //拖過畫面寬 1/5,或快速一撥,就翻一張
      const dx = e.changedTouches[0].clientX - startX;
      const speed = Math.abs(dx) / Math.max(e.timeStamp - startTime, 1);
      let target = env_index[i];
      if (Math.abs(dx) > box.clientWidth / 5 || speed > 0.5) {
        target += dx < 0 ? 1 : -1;
      }
      target = Math.min(Math.max(target, 0), env_sectionNum[i] - 1);
      ChangeEnvPic(target, i);
    }, { passive: true });
  }
}

//更新圓點狀態
function SetEnvBtn(index, section) {
  for (var i = 0; i < env_sectionNum[section]; i++) {
    env_btns[section][i].classList.remove("active");
  }
  env_btns[section][index].classList.add("active");
}

//移動到指定圖片(圓點與滑動共用)
function ChangeEnvPic(index, section) {
  env_index[section] = index;
  SetEnvBtn(index, section);
  //track 寬度即一頁寬,一張 = 100%,視窗縮放也不會跑位
  env_tracks[section].style.transform = 'translateX(' + (-index * 100) + '%)';
}
