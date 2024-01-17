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

  dateOfInput: (str) => {
    const dateField = new Date(str);
    const originalDate = dateField;
    const day = originalDate.getDate().toString().padStart(2, "0");
    const month = (originalDate.getMonth() + 1).toString().padStart(2, "0");
    const year = originalDate.getFullYear();
    return `${year}-${month}-${day}`;
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

  formatPrice(value) {
    // Chuyển đổi giá trị thành chuỗi và sử dụng biểu thức chính quy để định dạng
    return value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " đ";
  },
  


  booleanToString: function (value) {
    return value ? "isEvaluated" : "not";
  },

  isAccountReported(accountStatus) {
    return accountStatus === "Reported";
  },

  getCurrentDate: () => {
    const currentDate = new Date();
    const day = currentDate.getDate().toString().padStart(2, "0");
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const year = currentDate.getFullYear();

    return `${day}/${month}/${year}`;
  },

  objectIdToString: (objectId) => {
    if (mongoose.isValidObjectId(objectId)) {
      return objectId.toString();
    }
    return objectId;
  },
  increaseIndex: (page, limit, index) => (page - 1) * limit + index + 1,
  inc: (value) => {
    // console.log(value);
    const res = parseInt(value, 10) + 1
    // console.log(res);
    return res;
  },
  eq: (v1, v2) => {
    return v1 == v2;
  },
  or: (a, v1, v2) => {
    return a == v1 || a == v2;
  },
  toStatus: (status) => {
    switch (status) {
      case "cancelled":
        return "Đã hủy";
      case "paying":
        return "Chờ thanh toán";
      case "pending":
        return "Chờ xử lý";
      case "successful":
        return "Thành công";
      default:
        return "";
    }
    return v1 === v2 ? v1 : "";
  },
  toReason: (reason) => {
    switch (reason) {
      case "payment":
        return "Thanh toán không thành công";
      case "shop":
        return "Hủy bởi shop";
      case "buyer":
        return "Hủy bởi người mua";
      default:
        return "";
    }
  },
  formatDate: (dateString) => {
    if (!dateString) return "";
    const dateObj = new Date(dateString);

    const ngay = dateObj.getDate();
    const thang = dateObj.getMonth() + 1; // Tháng trong JavaScript bắt đầu từ 0
    const nam = dateObj.getFullYear();
    const gio = dateObj.getHours();
    const phut = dateObj.getMinutes();
    const giay = dateObj.getSeconds();

    const chuoiNgayGio = `${ngay}/${thang}/${nam} ${gio}:${phut}:${giay}`;

    return chuoiNgayGio;
  },
  toOrderFilter: (filter) => {
    switch (filter) {
      case "near":
        return "Thời gian gần nhất";
      case "far":
        return "Thời gian xa nhất";
      case "pending":
        return "Chờ xử lý";
      case "paying":
        return "Chờ thanh toán";
      case "successful":
        return "Thành công";
      case "cancelled":
        return "Đã hủy";
      default:
        return "Sắp xếp";
    }
  },
};
