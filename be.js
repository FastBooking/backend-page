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
    } else {
    alert('至少需保留一個日期欄位');
    }
}

// 側邊欄選單切換
document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', function() {
    // 移除所有 active 類別
    document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
    document.querySelectorAll('.content-card').forEach(c => c.classList.remove('active'));
    
    // 添加 active 到當前選項
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
    
    // 移除同一組的 active
    parent.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    parent.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    
    // 添加 active
    this.classList.add('active');
    parent.querySelector('#' + targetTab).classList.add('active');
    });
});

// 自動計算完整服務時間
const surgeryTimeInput = document.getElementById('surgery-time-input');
const preTimeInput = document.getElementById('pre-time-input');
const postTimeInput = document.getElementById('post-time-input');
const totalTimeDisplay = document.getElementById('total-time-display');

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

// 表單提交處理
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e) {
    e.preventDefault();
    alert('資料已儲存！');
    this.reset();
    if (totalTimeDisplay) {
        totalTimeDisplay.textContent = '請先輸入手術時間、術前時間及術後時間';
    }
    });
});

// 搜尋功能移除，只保留篩選功能
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
        alert('資料已刪除！');
    }
    }
});

// 編輯按鈕（示例）
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-edit')) {
    alert('編輯功能：可以將該行資料載入到表單中進行修改');
    }
});
