// import Employee from '../.././../domine/model/employee';
// import bcrypt from 'bcrypt';
//
// const registerEmployee = async (req, res) => {
//     try {
//         const {
//             name,
//             surnames,
//             password,
//             identification,
//             email,
//             phone,
//             companyID,
//             address,
//         } = req.body;
//
//         const hash = await bcrypt.hash(password, 15);
//
//         await Employee.create({
//             name,
//             surnames,
//             password: hash,
//             identification,
//             email,
//             phone,
//             companyID,
//             address,
//         });
//
//         res.send({ status: 'Ok', message: 'Employee Create' });
//     } catch (e) {
//         res.status(500).send({ status: 'Error', message: e });
//     }
// };
//
// export default {
//     registerEmployee,
// };
