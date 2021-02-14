import Admins from '../../../domine/model/admins';
import Employee from '../../../domine/model/employee';
import Client from '../../../domine/model/users';

const passwordUpdate = async (findByEmail, hash, role) => {
    switch (role) {
        case '1':
            await Admins.findOneAndUpdate(
                { _id: findByEmail['_id'] },
                { password: hash },
            );
            break;
        case '2':
            await Employee.findOneAndUpdate(
                { _id: findByEmail['_id'] },
                { password: hash },
            );
            break;
        case '3':
            await Client.findOneAndUpdate(
                { _id: findByEmail['_id'] },
                { password: hash },
            );
            break;
    }
};

const emailUpdate = async (dataIntoBody, findByEmail, role) => {
    let findDataExist;

    switch (role) {
        case '1':
            findDataExist = await Client.findOne({
                email: dataIntoBody.email,
            });
            if (!findDataExist) {
                findDataExist = await Employee.findOne({ email: dataIntoBody.email });
                if (!findDataExist) {
                    await Admins.findOneAndUpdate(
                        { _id: findByEmail['_id'] },
                        { email: dataIntoBody['email'] },
                    );
                } else {
                    throw {
                        code: 409,
                        status: 'CONFLICT',
                        message: ' EMAIL EXIST AS OTHER USER',
                    };
                }
            } else {
                throw {
                    code: 409,
                    status: 'CONFLICT',
                    message: ' EMAIL EXIST AS OTHER USER',
                };
            }
            break;
        case '2':
            findDataExist = await Admins.findOne({
                email: dataIntoBody.email,
            });
            if (!findDataExist) {
                findDataExist = await Client.findOne({ email: dataIntoBody.email });
                if (!findDataExist) {
                    await Employee.findOneAndUpdate(
                        { _id: findByEmail['_id'] },
                        { email: dataIntoBody['email'] },
                    );
                } else {
                    throw {
                        code: 409,
                        status: 'CONFLICT',
                        message: ' EMAIL EXIST AS OTHER USER',
                    };
                }
            } else {
                throw {
                    code: 409,
                    status: 'CONFLICT',
                    message: ' EMAIL EXIST AS OTHER USER',
                };
            }
            break;
        case '3':
            findDataExist = await Admins.findOne({
                email: dataIntoBody.email,
            });
            if (!findDataExist) {
                findDataExist = await Employee.findOne({ email: dataIntoBody.email });
                if (!findDataExist) {
                    await Client.findOneAndUpdate(
                        { _id: findByEmail['_id'] },
                        { email: dataIntoBody['email'] },
                    );
                } else {
                    throw {
                        code: 409,
                        status: 'CONFLICT',
                        message: ' EMAIL EXIST AS OTHER USER',
                    };
                }
            } else {
                throw {
                    code: 409,
                    status: 'CONFLICT',
                    message: ' EMAIL EXIST AS OTHER USER',
                };
            }
            break;
    }
};

const phoneUpdate = async (dataIntoBody, findByEmail, role) => {
    let findDataExist;

    switch (role) {
        case '1':
            findDataExist = await Client.findOne({
                phone: dataIntoBody.phone,
            });
            if (!findDataExist) {
                findDataExist = await Employee.findOne({ phone: dataIntoBody.phone });
                if (!findDataExist) {
                    await Admins.findOneAndUpdate(
                        { _id: findByEmail['_id'] },
                        { phone: dataIntoBody['phone'] },
                    );
                } else {
                    throw {
                        code: 409,
                        status: 'CONFLICT',
                        message: ' EMAIL EXIST AS OTHER USER',
                    };
                }
            } else {
                throw {
                    code: 409,
                    status: 'CONFLICT',
                    message: ' EMAIL EXIST AS OTHER USER',
                };
            }
            break;
        case '2':
            findDataExist = await Admins.findOne({
                phone: dataIntoBody.phone,
            });
            if (!findDataExist) {
                findDataExist = await Client.findOne({ email: dataIntoBody.email });
                if (!findDataExist) {
                    await Employee.findOneAndUpdate(
                        { _id: findByEmail['_id'] },
                        { phone: dataIntoBody['phone'] },
                    );
                } else {
                    throw {
                        code: 409,
                        status: 'CONFLICT',
                        message: ' EMAIL EXIST AS OTHER USER',
                    };
                }
            } else {
                throw {
                    code: 409,
                    status: 'CONFLICT',
                    message: ' EMAIL EXIST AS OTHER USER',
                };
            }
            break;
        case '3':
            findDataExist = await Admins.findOne({
                phone: dataIntoBody.phone,
            });
            if (!findDataExist) {
                findDataExist = await Employee.findOne({ email: dataIntoBody.email });
                if (!findDataExist) {
                    await Client.findOneAndUpdate(
                        { _id: findByEmail['_id'] },
                        { phone: dataIntoBody['phone'] },
                    );
                } else {
                    throw {
                        code: 409,
                        status: 'CONFLICT',
                        message: ' EMAIL EXIST AS OTHER USER',
                    };
                }
            } else {
                throw {
                    code: 409,
                    status: 'CONFLICT',
                    message: ' EMAIL EXIST AS OTHER USER',
                };
            }
            break;
    }
};

const addressUpdate = async (dataIntoBody, findByEmail, addressKeys, user) => {
    for (let addressItems of addressKeys) {
        if (
            dataIntoBody.address[addressItems] !== findByEmail.address[addressItems] &&
            dataIntoBody.address[addressItems] !== ''
        ) {
            switch (addressItems) {
                case 'street':
                    await user.findOneAndUpdate(
                        { _id: findByEmail['_id'] },
                        {
                            $set: {
                                'address.street': dataIntoBody.address['street'],
                            },
                        },
                    );

                    break;

                case 'numberStreet':
                    await user.findOneAndUpdate(
                        { _id: findByEmail['_id'] },
                        {
                            $set: {
                                'address.numberStreet':
                                    dataIntoBody.address['numberStreet'],
                            },
                        },
                    );
                    break;

                case 'level':
                    await user.findOneAndUpdate(
                        { _id: findByEmail['_id'] },
                        {
                            $set: {
                                'address.level': dataIntoBody.address['level'],
                            },
                        },
                    );
                    break;

                case 'postalCode':
                    await user.findOneAndUpdate(
                        { _id: findByEmail['_id'] },
                        {
                            $set: {
                                'address.postalCode': dataIntoBody.address['postalCode'],
                            },
                        },
                    );
                    break;
            }
        }
    }
};

export const updateProfile = {
    passwordUpdate,
    emailUpdate,
    phoneUpdate,
    addressUpdate,
};
