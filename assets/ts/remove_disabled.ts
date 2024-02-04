// 选择具有 disabled 属性的所有复选框
const checkboxes: NodeListOf<HTMLInputElement> = document.querySelectorAll('input[type="checkbox"][disabled]');

// 移除这些复选框的 disabled 属性
checkboxes.forEach(function(checkbox: HTMLInputElement) {
  checkbox.removeAttribute('disabled');
});
