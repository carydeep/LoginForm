import React from 'react';
import { Button, Container, FormGroup, Input, Label } from 'reactstrap';
import { FastField, Form, Formik } from 'formik';
import InputField from '../../custom-fields/InputField';
import * as Yup from 'yup';
import UserApi from '../../api/userApi';

function Harsh() {

    const handleSubmit = async (values) => {
        try {
            const userName = await UserApi.checkPass(values.name, values.passwd);
            console.log(userName);
            if (userName.length == 0) {
                alert('User name incorrect');
            }
            else {
                alert("Welcome :" + values.name);
            }
        } catch (error) {
            alert('Fail: ' + error);
        }
    }

    const inititialValues = {
        name: '',
        passwd: '',
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('This field is required'),

        passwd: Yup.string().required('This field is required'),
    })

    return (
        <Formik
            initialValues={inititialValues}
            validationSchema={validationSchema}
            onSubmit={values => handleSubmit(values)}
        >
            {formikProps => {

                const { initialValues, errors, touched } = formikProps;

                return (
                    <Container className='themed-container' fluid='sm'>
                        <Form>
                            <FastField
                                name="name"
                                component={InputField}

                                label="Name"
                                placeholder="What's your name"
                            ></FastField>

                            <FastField
                                name="passwd"
                                component={InputField}

                                label="Password"
                                type="password"
                                placeholder="Pass?"
                            ></FastField>

                            <FormGroup>
                                <Button type="submit">Đăng nhập</Button>
                            </FormGroup>
                        </Form>
                    </Container>
                );
            }}
        </Formik>
    );
}

export default Harsh;