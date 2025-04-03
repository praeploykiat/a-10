// const express = require('express');
// const router = express.Router();


// router.get('/',(req,res) => {
//     res.status(200).json({success:true,msg:'Show all hospitals'});
// });

// router.get('/:id', (req,res) => {
//     res.status(200).json({success:true,msg:`Show hospital ${req.params.id}`});
// });

// router.post('/', (req,res) => {
//     res.status(200).json({success:true,msg:'Create new Hospital'});
// });

// router.put('/:id',(req,res) => {
//     res.status(200).json({success:true,msg:`Update hospital ${req.params.id}`});
// });

// router.delete('/:id' , (req,res) => {
//     res.status(200).json({success:true,msg:`Delete hospital ${req.params.id}`});
// });

// module.exports=router;




const express = require('express');
const {protect,authorize} = require('../middleware/auth');
const {getHospitals,getHospital,createHospital,updateHospital,deleteHospital} = require('../controller/hospitals');

//hospital schema YAML
/**
 * @swagger
 * components:
 *      schemas:
 *          Hospital:
 *              type: object
 *              required:
 *                  - name
 *                  - address
 *              properties:
 *                  id:
 *                      type: string
 *                      format: uuis
 *                      description: The auto-generated id of the hospital
 *                      example: d290f1ee-6c54-4b01-90e6-d701748f0851
 *                  ลำดับ:
 *                      type: string
 *                      description: Ordinal number
 *                  name:
 *                      type: string
 *                      description: Hospital name
 *                  address:
 *                      type: string
 *                      description: House No., Street, Road
 *                  district:
 *                      type: string
 *                      description: District
 *                  province:
 *                      type: string
 *                      description: province
 *                  postalcode:
 *                      type: string
 *                      description: 5-digit postal code
 *                  tel:
 *                      type: string
 *                      description: telephone number
 *                  region:
 *                      type: string
 *                      description: region
 *              example:
 *                  id: 609bda561452242d88d36e37
 *                  ลำดับ: 121
 *                  name: Happy Hospital
 *                  address: 121 ถ.สุขุมวิท
 *                  district: บางนา
 *                  province: กรุงเทพมหานคร
 *                  postalcode: 10110
 *                  tel: 02-2187000
 *                  region: กรุงเทพมหานคร(Bangkok)
 *                      
 * 
 */

//hospital tag
/**
 * @swagger
 * tags:
 *  name: Hospitals
 *  description: The hospitals managing API
 */

/**
 * @swagger
 * /hospitals:
 *      get:
 *          summary: Returns the list of all the hospitals
 *          tags: [Hospitals]
 *          responses: 
 *              200:
 *                  description: The list of the hospitals
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items:
 *                                  $ref: '#/components/schemas/Hospital'
 */

//get one hospital
/**
 * @swagger
 * /hospitals/{id}:
 *      get:
 *          summary: Get the hospital by id
 *          tags: [Hospitals]
 *          parameters: 
 *              - in: path
 *                name: id
 *                schema:
 *                      type: string
 *                required: true
 *                description: the hospital id
 *          responses: 
 *              200:
 *                  description: The hospital description by id
 *                  contents:
 *                      application/json:
 *                          schema:
 *                                 $ref: '#/components/schemas/Hospital'
 *              404:
 *                  description: The hospital was not found
 */

//include other resource routers
const appointmentRouter = require('./appointments');

const router = express.Router();

//Re-route into other resource routers
router.use('/:hospitalId/appointments/',appointmentRouter);

router.route('/').get(getHospitals).post(protect,authorize('admin'),createHospital);
router.route('/:id').get(getHospital).put(protect,authorize('admin'),updateHospital).delete(protect,authorize('admin'),deleteHospital);


module.exports=router;
