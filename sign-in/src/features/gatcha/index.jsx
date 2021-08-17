import React from 'react';
import ReCAPCHA from "react-google-recaptcha";
import { Container } from 'reactstrap'

function onchange(values) {
    console.log(values);
}

function Gatcha() {

    return (
        <Container>
            <ReCAPCHA
                sitekey='6LfnXQgcAAAAAMXSU4eXEthX4WAr8wmVbN8whQ_D'
                onChange={onchange}
            />
        </Container>
    );
}

export default Gatcha;