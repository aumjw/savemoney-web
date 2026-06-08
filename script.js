// ===== เก็บข้อมูลทั้งหมด =====
let items = JSON.parse(localStorage.getItem("items") || "[]");
let selectedType = "income"; // ค่าเริ่มต้น = รายรับ

// ===== ดึง element จาก HTML =====
const descInput = document.getElementById("desc");
const amountInput = document.getElementById("amount");
const dateInput = document.getElementById("date");

const btnIncome = document.getElementById("btn-income");
const btnExpense = document.getElementById("btn-expense");
const btnAdd = document.getElementById("btn-add");
const btnRest = document.getElementById("btn-reset");

const btnHistory = document.getElementById("history");
const modal = document.getElementById("modal");
const modalList = document.getElementById("modal-list");
const btnClose = document.getElementById("btn-close");

// ===== ตั้งวันที่เป็นวันนี้ =====
dateInput.value = new Date().toISOString().split("T")[0];

// ===== เปลี่ยนชื่อ heeader =====
function login() {
  const username = document.getElementById("usname").value;
  const password = document.getElementById("password").value;

  if (username === "") {
    alert("กรอก username !");
    return;
  }
  if (password == "") {
    alert("กรุณากรอกรหัสผ่าน !");
    return;
  }
  localStorage.setItem("username", username); // เก็บชื่อไว้
  window.location.href = "main.html"; // ไปหน้า main
}
const showName = document.getElementById("show-name");
if (showName) {
  showName.textContent = localStorage.getItem("username");
}

// ===== สลับปุ่มประเภท =====
function setType(type) {
  selectedType = type;

  if (type === "income") {
    btnIncome.classList.add("active-income");
    btnIncome.classList.remove("active-expense");
    btnExpense.classList.remove("active-income", "active-expense");
  } else {
    btnExpense.classList.add("active-expense");
    btnExpense.classList.remove("active-income");
    btnIncome.classList.remove("active-income", "active-expense");
  }
}

btnIncome.addEventListener("click", () => setType("income"));
btnExpense.addEventListener("click", () => setType("expense"));

// ===== เพิ่มรายการ =====
btnAdd.addEventListener("click", () => {
  const desc = descInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const date = dateInput.value;

  // เช็คว่ากรอกครบ
  if (!desc || !amount || !date) {
    alert("กรุณากรอกข้อมูลให้ครบ");
    return;
  }

  // เพิ่มลง array
  items.push({ desc, amount, date, type: selectedType });

  // บันทึกลง localStorage
  localStorage.setItem("items", JSON.stringify(items));

  // รีเฟรชหน้าจอ
  render();

  // เคลียร์ฟอร์ม
  descInput.value = "";
  amountInput.value = "";
});

// ===== คำนวณและแสดงผล =====
function render() {
  // คำนวณยอด
  const totalIncome = items
    .filter((i) => i.type === "income")
    .reduce((sum, i) => sum + i.amount, 0);

  const totalExpense = items
    .filter((i) => i.type === "expense")
    .reduce((sum, i) => sum + i.amount, 0);

  const balance = totalIncome - totalExpense;

  // อัพเดท box ยอดรวม
  document.getElementById("total-income").textContent =
    totalIncome.toLocaleString() + " บาท";
  document.getElementById("total-expense").textContent =
    totalExpense.toLocaleString() + " บาท";
  document.getElementById("balance").textContent =
    balance.toLocaleString() + " บาท";
}
// ===== ล้างข้อมูลทั้งหมด =====
btnRest.addEventListener("click", () => {
  if (confirm("ต้องการล้างข้อมูลทั้งหมดใช่ไหม?")) {
    items = [];
    localStorage.removeItem("items");
    render();
  }
});
btnHistory.addEventListener("click", () => {
  // แสดงรายการทั้งหมด
  if (items.length === 0) {
    modalList.innerHTML =
      "<p style='color:#888;text-align:center;'>ยังไม่มีรายการ</p>";
  } else {
    modalList.innerHTML = [...items]
      .reverse()
      .map(
        (i) => `
      <div class="history-item">
        <div>
          <div>${i.desc}</div>
          <div style="color:#aaa;font-size:0.8rem;">${i.date}</div>
        </div>
        <span class="${i.type}">
          ${i.type === "income" ? "+" : "-"}${i.amount.toLocaleString()} บาท
        </span>
      </div>
    `,
      )
      .join("");
  }

  modal.style.display = "flex";
});

// ปิด modal
btnClose.addEventListener("click", () => {
  modal.style.display = "none";
});

// กดนอก modal ก็ปิด
modal.addEventListener("click", (e) => {
  if (e.target === modal) modal.style.display = "none";
});

// ===== โหลดข้อมูลตอนเปิดหน้า =====
render();
