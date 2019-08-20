const express=require('express');
const userController=require('../controllers/userController');
const adminController=require('../controllers/adminController');
const driverController=require('../controllers/driverController');
const router=express.Router();

router.route('/user/signup').post(userController.signUpPage);
router.route('/user/login').post(userController.loginPage);
router.route('/user/booking').post(userController.createbooking);

router.route('/user/getdetails/:id').get(userController.getbookingById);
router.route('/user/getdetails').get(userController.getbooking);
router.route("/user/getdetails/:from_date/:to_date").get(userController.getbookingByDate)

router.route('/admin/getdetails/:id').get(adminController.getbookingById);
router.route('/admin/getdetails').get(adminController.getbooking);
router.route("/admin/getdetails/:from_date/:to_date").get(adminController.getbookingByDate)
router.route('/admin/freedriver').get(adminController.freeDriver)
router.route('/admin/assignBooking/:id').put(adminController.assignBooking);

router.route('/driver/signup').post(driverController.signUpPage);
router.route('/driver/login').post(driverController.loginPage);


module.exports=router;