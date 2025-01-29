var tasks = JSON.parse(localStorage.getItem("tasks")) || [
    { title: "شراء الخضروات", addedDate: "2025-01-20 10:00 AM", isCompleted: false },
    { title: "إكمال مشروع الكود", addedDate: "2025-01-21 02:30 PM", isCompleted: true },
    { title: "مراجعة البريد الإلكتروني", addedDate: "2025-01-22 09:15 AM", isCompleted: false },
  ];
  
  // متغير لتحديد إذا كنتِ في وضع التعديل
  var isEditing = false;
  var editIndex = null; // لتخزين مؤشر المهمة التي يتم تعديلها
  
  // وظيفة لحفظ البيانات في Local Storage
  function saveToLocalStorage() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
  
  // وظيفة لإعادة عرض المهام
  function renderTasks() {
    var showData = document.getElementById("showData");
    showData.innerHTML = ""; // إعادة بناء القائمة
  
    tasks.forEach((task, index) => {
      var d = `
        <li class="d-flex justify-content-between align-items-center border-bottom py-2">
          <div>
            <h3 class="fs-5 ${task.isCompleted ? 'text-decoration-line-through' : ''}">${task.title}</h3>
            <p class="text-muted dete m-0">
              <i class="fa fa-calendar"></i>
              <span>${task.addedDate}</span>
            </p>
          </div>
          <div class="fs-5">
            <i class="fa fa-trash me-2 text-danger" onclick="openDeleteConfirmation(${index})"></i>
            <i class="fa fa-edit me-2 text-primary" onclick="openEditModal(${index})"></i>
            ${task.isCompleted 
              ? '<i class="fa-solid fa-circle-check me-2 text-success" onclick="toggleTaskCompletion(' + index + ')" title="Mark as Incomplete"></i>' 
              : '<i class="fa fa-circle me-2 text-warning" onclick="toggleTaskCompletion(' + index + ')" title="Mark as Completed"></i>'
            }
          </div>
        </li>
      `;
      showData.innerHTML += d;
    });
  }
  
  // إضافة أو تعديل مهمة بناءً على حالة isEditing
  document.getElementById("saveTask").addEventListener("click", function () {
    var taskTitle = document.getElementById("taskTitle").value;
    if (taskTitle) {
      if (isEditing) {
        // إذا كان في وضع التعديل
        tasks[editIndex].title = taskTitle;
        tasks[editIndex].addedDate = new Date().toLocaleString();
        isEditing = false; // إعادة تعيين وضع التعديل
      } else {
        // إذا كان في وضع الإضافة
        var newTask = {
          title: taskTitle,
          addedDate: new Date().toLocaleString(),
          isCompleted: false,
        };
        tasks.push(newTask); // إضافة المهمة الجديدة إلى المصفوفة
      }
      saveToLocalStorage(); // حفظ المهام في Local Storage
      renderTasks(); // تحديث عرض المهام
      // إغلاق الموديل بعد الإضافة أو التعديل
      var taskModal = bootstrap.Modal.getInstance(document.getElementById('taskModal'));
      taskModal.hide();
      document.getElementById("taskTitle").value = ""; // مسح حقل العنوان
      // تغيير النص في الزر عند الإغلاق
      document.getElementById("saveTask").innerText = "إضافة مهمة جديدة"; // إعادة النص إلى الإضافة
    }
  });
  
  // عرض تنبيه لتأكيد الحذف باستخدام AlertifyJS
  function openDeleteConfirmation(index) {
    alertify.confirm(
      "تأكيد الحذف",
      "هل أنت متأكد من أنك تريد حذف هذه المهمة؟",
      function () {
        deleteTask(index); // حذف المهمة
      },
      function () {
        alertify.error("تم إلغاء الحذف");
      }
    );
  }
  
  // وظيفة لحذف مهمة
  function deleteTask(index) {
    tasks.splice(index, 1); // حذف المهمة من المصفوفة
    saveToLocalStorage(); // تحديث Local Storage
    renderTasks(); // إعادة عرض المهام
  }
  
  // فتح الموديل للتعديل على مهمة
  function openEditModal(index) {
    var task = tasks[index];
    document.getElementById("taskTitle").value = task.title;
    
    // تغيير الحالة إلى "تعديل" وتخزين مؤشر المهمة المعدلة
    isEditing = true;
    editIndex = index;
    
    // تغيير النص الموجود على الزر إلى "تعديل المهمة"
    document.getElementById("saveTask").innerText = "تعديل المهمة"; // تغيير النص إلى تعديل المهمة
  
    var taskModal = new bootstrap.Modal(document.getElementById('taskModal'));
    taskModal.show();
  }
  
  // وظيفة لتغيير حالة المهمة بين مكتملة وغير مكتملة
  function toggleTaskCompletion(index) {
    tasks[index].isCompleted = !tasks[index].isCompleted; // تغيير الحالة
    saveToLocalStorage(); // حفظ التحديثات في Local Storage
    renderTasks(); // تحديث العرض
  }
  
  // عرض المهام عند تحميل الصفحة
  renderTasks();
  