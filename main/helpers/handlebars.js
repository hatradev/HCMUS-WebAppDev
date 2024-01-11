const mongoose = require("mongoose");

module.exports = {
  accessArr: (arr, index) => arr[index],
  showStar: (stars) => {
    return stars ? stars : 0;
  },
  convertDate: (str) => {
    dateField = new Date(str);
    // Lấy ngày tháng năm từ đối tượng Date
    const originalDate = dateField;
    const day = originalDate.getDate();
    const month = originalDate.getMonth() + 1; // Tháng bắt đầu từ 0 nên cộng thêm 1
    const year = originalDate.getFullYear();
    const hours = originalDate.getHours();
    const minutes = originalDate.getMinutes();
    return `${hours}:${
      minutes == 0 ? "0" + String(minutes) : minutes
    } ${day}/${month}/${year}`;
  },

  dateOfOrder: (str) => {
    const dateField = new Date(str);
    const originalDate = dateField;
    const day = originalDate.getDate().toString().padStart(2, "0");
    const month = (originalDate.getMonth() + 1).toString().padStart(2, "0");
    const year = originalDate.getFullYear();
    return `${day}/${month}/${year}`;
  },

  calculateTotalPrice: (price, quantity) => {
    return price * quantity;
  },
  formatCurrency: (number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(number);
  },

  booleanToString: function (value) {
    return value ? "isEvaluated" : "not";
  },

  isAccountReported(accountStatus) {
    return accountStatus === "Reported";
  },

  getCurrentDate: () => {
    const currentDate = new Date();
    const day = currentDate.getDate().toString().padStart(2, '0');
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const year = currentDate.getFullYear();

    return `${day}/${month}/${year}`;
  },

  objectIdToString: (objectId) => {
    if (mongoose.isValidObjectId(objectId)) {
      return objectId.toString();
    }
    return objectId;
  },
  increaseIndex: (page, limit, index) => (page - 1)*limit + index + 1,
};
