// 登入功能
document.addEventListener('DOMContentLoaded', function() {
  // 檢查登入狀態
  const isLoggedIn = sessionStorage.getItem('isLoggedIn');
  if (isLoggedIn) {
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('main-page').style.display = 'block';
  }

  // 登入表單提交
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      const messageDiv = document.getElementById('login-message');
      
      // 顯示載入中訊息
      messageDiv.textContent = '驗證中...';
      messageDiv.className = '';
      messageDiv.style.display = 'block';
      messageDiv.style.background = '#f0f0f0';
      messageDiv.style.border = '2px solid #ccc';
      messageDiv.style.color = '#666';
      
      try {
        // 發送 webhook 請求
        const response = await fetch('https://fastbooking.app.n8n.cloud/webhook-test/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: username,
            password: password
          })
        });
        
        const data = await response.json();
        
        // 檢查回傳結果
        if (data.status === 'OK' && data.message === '帳號密碼正確') {
          // 顯示成功訊息
          messageDiv.textContent = '登入成功！';
          messageDiv.className = 'success';
          messageDiv.style.display = 'block';
          
          // 延遲後跳轉到主頁面
          setTimeout(async function() {
            sessionStorage.setItem('isLoggedIn', 'true');
            document.getElementById('login-page').style.display = 'none';
            document.getElementById('main-page').style.display = 'block';
            
            // 登入成功後，自動查詢服務專用儀器資料
            await loadEquipmentData(data);
          }, 800);
        } else {
          // 顯示錯誤訊息
          messageDiv.textContent = data.message || '帳號或密碼錯誤！';
          messageDiv.className = 'error';
          messageDiv.style.display = 'block';
        }
      } catch (error) {
        // 網路錯誤或其他錯誤
        messageDiv.textContent = '連線失敗，請稍後再試！';
        messageDiv.className = 'error';
        messageDiv.style.display = 'block';
        console.error('登入錯誤:', error);
      }
    });
  }

  // 自動計算完整服務時間
  const surgeryTimeInput = document.getElementById('surgery-time-input');
  const preTimeInput = document.getElementById('pre-time-input');
  const postTimeInput = document.getElementById('post-time-input');
  const totalTimeDisplay = document.getElementById('total-time-display');

  if (surgeryTimeInput && preTimeInput && postTimeInput && totalTimeDisplay) {
    function calculateTotalTime() {
      const surgeryTime = parseInt(surgeryTimeInput.value) || 0;
      const preTime = parseInt(preTimeInput.value) || 0;
      const postTime = parseInt(postTimeInput.value) || 0;
      const total = surgeryTime + preTime + postTime;
      
      if (total > 0) {
        totalTimeDisplay.textContent = `${total} 分鐘`;
      } else {
        totalTimeDisplay.textContent = '請先輸入手術時間、術前時間及術後時間';
      }
    }

    surgeryTimeInput.addEventListener('input', calculateTotalTime);
    preTimeInput.addEventListener('input', calculateTotalTime);
    postTimeInput.addEventListener('input', calculateTotalTime);
  }

  // 登出功能
  const logoutBtn = document.querySelector('.logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      if (confirm('確定要登出嗎？')) {
        sessionStorage.removeItem('isLoggedIn');
        document.getElementById('main-page').style.display = 'none';
        document.getElementById('login-page').style.display = 'block';
        document.getElementById('login-form').reset();
        const messageDiv = document.getElementById('login-message');
        if (messageDiv) {
          messageDiv.style.display = 'none';
          // 清除所有內聯樣式
          messageDiv.removeAttribute('style');
          messageDiv.className = '';
          messageDiv.textContent = '';
        }
      }
    });
  }
});

// 新增假日日期欄位
function addHolidayDate() {
    const container = document.getElementById('holiday-dates-container');
    const newItem = document.createElement('div');
    newItem.className = 'form-row holiday-date-item';
    newItem.innerHTML = `
    <div class="form-group">
        <label>假日日期</label>
        <input type="date" name="holiday_date" required>
    </div>
    <div class="form-group" style="display: flex; align-items: flex-end;">
        <button type="button" class="btn btn-secondary" onclick="removeHolidayDate(this)" style="padding: 14px 20px;">移除</button>
    </div>
    `;
    container.appendChild(newItem);
}

// 移除假日日期欄位
function removeHolidayDate(btn) {
    const items = document.querySelectorAll('.holiday-date-item');
    if (items.length > 1) {
        btn.closest('.holiday-date-item').remove();
    }
}

// 側邊欄選單切換
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function() {
            document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
            document.querySelectorAll('.content-card').forEach(c => c.classList.remove('active'));
            
            this.classList.add('active');
            const section = this.getAttribute('data-section');
            document.getElementById(section + '-section').classList.add('active');
        });
    });

    // Tab 切換功能
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const parent = this.closest('.card-body');
            const targetTab = this.getAttribute('data-tab');
            
            parent.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            parent.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            this.classList.add('active');
            parent.querySelector('#' + targetTab).classList.add('active');
        });
    });

    // 表單提交處理
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function(e) {
            if (this.id !== 'login-form') {
                e.preventDefault();
                this.reset();
                const totalTimeDisplay = document.getElementById('total-time-display');
                if (totalTimeDisplay) {
                    totalTimeDisplay.textContent = '請先輸入手術時間、術前時間及術後時間';
                }
            }
        });
    });

    // 搜尋功能移除,只保留篩選功能
    document.querySelectorAll('[id$="-filter"]').forEach(filterSelect => {
        filterSelect.addEventListener('change', function() {
            const filterValue = this.value;
            const tableId = this.id.replace('-filter', '-table-body');
            const rows = document.querySelectorAll(`#${tableId} tr`);
            
            rows.forEach(row => {
                if (!filterValue || row.cells[0].textContent.includes(filterValue)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    });

    // 刪除按鈕
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-delete')) {
            if (confirm('確定要刪除這筆資料嗎？')) {
                e.target.closest('tr').remove();
            }
        }
    });

    // 編輯按鈕（示例）
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-edit')) {
            console.log('編輯功能：可以將該行資料載入到表單中進行修改');
        }
    });
});

// 新增：載入服務專用儀器資料的函數
async function loadEquipmentData(loginData) {
  try {
    // 發送登入回傳的資料到後端
    const response = await fetch('https://fastbooking.app.n8n.cloud/webhook-test/back', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData)
    });
    
    const equipmentData = await response.json();
    
    // 更新服務專用儀器表格
    updateEquipmentTable(equipmentData);
    
  } catch (error) {
    console.error('載入儀器資料錯誤:', error);
  }
}

// 新增：更新服務專用儀器表格的函數
function updateEquipmentTable(data) {
  console.log('=== 開始更新表格 ===');
  console.log('接收到的資料:', data);
  console.log('資料類型:', typeof data);
  console.log('是否為陣列:', Array.isArray(data));
  
  const tableBody = document.getElementById('equipment-table-body');
  
  if (!tableBody) {
    console.error('找不到表格元素 equipment-table-body！');
    return;
  }
  
  // 清空現有表格
  tableBody.innerHTML = '';
  
  // 處理資料：如果是單一物件，轉成陣列
  let dataArray = [];
  
  if (Array.isArray(data)) {
    dataArray = data;
  } else if (data && typeof data === 'object') {
    // 如果是單一物件，包裝成陣列
    console.log('⚠️ 接收到單一物件，轉換為陣列');
    dataArray = [data];
  } else {
    console.error('❌ 資料格式錯誤');
    tableBody.innerHTML = `
      <tr>
        <td colspan="4" style="text-align: center; padding: 40px; color: #999;">
          資料格式錯誤
        </td>
      </tr>
    `;
    return;
  }
  
  // 檢查陣列是否有資料
  if (dataArray.length === 0) {
    console.log('⚠️ 資料陣列是空的');
    tableBody.innerHTML = `
      <tr>
        <td colspan="4" style="text-align: center; padding: 40px; color: #999;">
          目前沒有資料
        </td>
      </tr>
    `;
    return;
  }
  
  // 插入資料到表格
  console.log(`準備插入 ${dataArray.length} 筆資料`);
  
  dataArray.forEach((item, index) => {
    console.log(`處理第 ${index + 1} 筆:`, item);
    
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.分店 || ''}</td>
      <td>${item.服務項目 || ''}</td>
      <td>${item.可用儀器數量 || ''}</td>
      <td>
        <button class="action-btn btn-edit">編輯</button>
        <button class="action-btn btn-delete">刪除</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
  
  console.log('✅ 表格更新完成！共', dataArray.length, '筆資料');
}
