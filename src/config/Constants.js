import { Dimensions } from "react-native";

export const app_name = "MedicsStaff";
export const base_url = "http://localhost:8000/";
export const api_url = "http://localhost:8000/api/";
export const img_url = "http://localhost:8000/public/uploads/";
export const prefix = "staff/";
export const failed_url = base_url+"paypal_failed";
export const success_url = base_url+"paypal_success";

export const app_settings = prefix+"app_settings";
export const check_phone = prefix+"check_phone";
export const change_phone = prefix+"change_phone";
export const update_phone = prefix+"update_phone";
export const login = prefix+"login";
export const register = prefix+"register";
export const forgot_password = prefix+"forgot_password";
export const reset_password = prefix+"reset_password";
export const change_online_status = prefix+"change_online_status";
export const speciality_type_list = prefix+"speciality_type_list";
export const dashboard = prefix+"dashboard";
export const get_heatmap_coordinates = prefix+"get_heatmap_coordinates";
export const speciality_update = prefix+"speciality_update";
export const get_documents = prefix+"get_documents";
export const image_upload = "image_upload";
export const update_document = prefix+"update_document";
export const get_about = prefix+"get_about";
export const faq = prefix+"faq";
export const work_request_details = prefix+"work_request_details";
export const accept = prefix+"accept";
export const reject = prefix+"reject";
export const profile_update = prefix+"profile_update";
export const profile_picture_upload = prefix+"profile_image_upload";
export const profile_picture_update = prefix+"profile_picture_update";
export const sos_contact_list = "staff/sos_contact_list";
export const delete_sos_contact = "staff/delete_sos_contact";
export const add_sos_contact = "staff/add_sos_contact";
export const sos_sms = prefix+"sos_sms";
export const get_profile = prefix+"get_profile";
export const get_specialities = prefix+"get_specialities";
export const work_details = prefix+"work_details";
export const change_work_status = prefix+"change_work_status";
export const work_cancel = prefix+"work_cancel";
export const get_bill = prefix+"get_bill";
export const my_bookings = prefix+"my_bookings";
export const add_rating = prefix+"add_rating";
export const get_notification_messages = prefix+"get_notification_messages";
export const withdrawal_history = prefix+"withdrawal_history";
export const withdrawal_request = prefix+"withdrawal_request";
export const earnings = prefix+"earnings";
export const tutorials = prefix+"tutorials";
export const add_wallet = prefix+"add_wallet";
export const payment_methods = prefix+"payment_methods";
export const wallet = prefix+"wallet";
export const update_kyc = prefix+"update_kyc";
export const get_kyc = prefix+"get_kyc";
export const privacy_policies = prefix+"privacy_policies";
export const change_staff_settings = prefix+"change_staff_settings";
export const get_staff_settings = prefix+"get_staff_settings";
export const get_ongoing_work_details_shared = prefix+"get_ongoing_work_details_shared";
export const shared_work_accept = prefix+"accept";
export const shared_work_reject = prefix+"reject";
export const booking_completion_details = prefix+"booking_completion_details";
export const accept_policies = "accept_policies";
export const check_policies = prefix+"check_policies";
export const hiring_accept_reject = prefix + "hiring_accept_reject";
export const booking_hiring_confirm = prefix + "booking_hiring_confirm";


//Header configuration for animated view
export const maxHeaderHeight = 200;
export const minHeaderHeight = 60;

//Size
export const screenHeight = Math.round(Dimensions.get("window").height);
export const screenWidth = Math.round(Dimensions.get("window").width);
export const height_40 = Math.round((40 / 100) * screenHeight);
export const height_50 = Math.round((50 / 100) * screenHeight);
export const height_60 = Math.round((60 / 100) * screenHeight);
export const height_35 = Math.round((35 / 100) * screenHeight);
export const height_20 = Math.round((20 / 100) * screenHeight);
export const height_30 = Math.round((30 / 100) * screenHeight);
export const height_17 = Math.round((17 / 100) * screenHeight);

//Map
export const GOOGLE_KEY = "YOUR KEY HERE";
export const LATITUDE_DELTA = 0.0150;
export const LONGITUDE_DELTA = 0.0152;
export const DEFAULT_PADDING = { top: 40, right: 40, bottom: 40, left: 40 };

//Image Path
export const logo = require(".././assets/img/logo.png");
export const success_icon = require(".././assets/img/success.png");
export const id_proof_icon = require('.././assets/img/id_proof_icon.png');
export const speciality_certificate_icon = require('.././assets/img/speciality_certificate_icon.png');
export const speciality_insurance_icon = require('.././assets/img/speciality_insurance_icon.png');
export const speciality_image_icon = require('.././assets/img/speciality_image_icon.png');
export const upload_icon = require('.././assets/img/upload_icon.png');
export const work_cancel_icon = require('.././assets/img/work_cancel_icon.png');
export const discount_icon = require(".././assets/img/discount.png");
export const notification_bell = require(".././assets/img/notification-bell.png");
export const bg_img = require(".././assets/img/BG.png");
export const left_arrow = require(".././assets/img/left-arrow.png");
export const right_arrow = require(".././assets/img/right-arrow.png");
export const distance_icon = require(".././assets/img/distance.png");
export const withdrawal_icon = require(".././assets/img/withdrawal.png");
export const wallet_icon = require(".././assets/img/wallet.png");
export const no_data = require(".././assets/img/no_data.png");
export const income_icon = require(".././assets/img/income.png");
export const expense_icon = require(".././assets/img/expense.png");
export const cancel = require(".././assets/img/cancel.png");
export const chat_bg = require(".././assets/img/chat_bg.png");
export const register_icon = require(".././assets/img/registration.png");
export const vaccine_icon = require(".././assets/img/vaccine_certificate.png");
export const speciality_icon = require(".././assets/img/speciality_type.png");
export const expiry_icon = require(".././assets/img/expiry_date.png");
export const get_staff_rating = prefix+"get_staff_rating";
export const insurance_icon = require(".././assets/img/insurance.png");


//json path
export const profile_background = require(".././assets/json/profile_background.json");
export const pin_marker = require(".././assets/json/pin_marker.json");
export const no_favourites = require(".././assets/json/no_favorites.json");
export const sos = require(".././assets/json/sos.json");
export const btn_loader = require(".././assets/json/btn_loader.json");
export const accept_loader = require(".././assets/json/accept_loader.json");
export const reject_loader = require(".././assets/json/reject_loader.json");
export const loader = require(".././assets/json/loader.json");
export const no_data_loader = require(".././assets/json/no_data_loader.json");
export const location_enable = require(".././assets/json/location_enable.json");
export const app_update = require(".././assets/json/app_update.json");

//Font Family
export const regular = "GoogleSans-Regular";
export const normal = "Montreal-Regular";
export const bold = "Montreal-Bold";

//Font Sized
export const f_tiny = 10;
export const f_xs = 12;
export const f_s = 14;
export const f_m = 16;
export const f_l = 18;
export const f_xl = 20;
export const f_xxl = 22;
export const f_25 = 25;
export const f_30 = 30;
export const f_35 = 35;


export const month_names = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

//More Menu
export const menus = [
    {
      menu_name: 'KYC Verification',
      icon: 'files-o',
      route:'KycVerification'
    },

    {
      menu_name: 'FAQ',
      icon: 'question-circle-o',
      route:'Faq'
    },
    {
      menu_name: 'Earnings',
      icon: 'dollar',
      route:'Earnings'
    },

    {
      menu_name: 'Withdrawals',
      icon: 'credit-card',
      route:'Withdrawal'
    },
     {
      menu_name: 'Wallet Transactions',
      icon: 'money',
      route:'Wallet'
    },
    {
      menu_name: 'Referrals',
      icon: 'group',
      route:'ReferralDetails'
    },

    {
      menu_name: 'Documents',
      icon: 'drivers-license',
      route:'UploadedDocuments'
    },

    {
      menu_name: 'Admin Chat',
      icon: 'wechat',
      route:'AdminChat'
    },
    {
      menu_name: 'Emergency Contacts',
      icon: 'address-book-o',
      route:'EmergencyContacts'
    },
    {
      menu_name: 'Notifications',
      icon: 'bell',
      route:'Notifications'
    },
    {
      menu_name: 'About Us',
      icon: 'building-o',
      route:'AboutUs'
    },
    {
      menu_name: 'Privacy Policies',
      icon: 'info-circle',
      route:'PrivacyPolicies'
    },
    {
      menu_name: 'Setting',
      icon: 'cog',
      route:'Setting'
    },
    {
      menu_name: 'Logout',
      icon: 'sign-out',
      route:'Logout'
    },
  ]