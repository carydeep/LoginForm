import React from 'react';
import { Link } from 'react-router-dom';
import { Container, ListGroup, ListGroupItem } from 'reactstrap'


index.propTypes = {

};

function index(props) {
    return (
        <header>
            <Container>
                <ListGroup>
                    <ListGroupItem color="success"><Link to="/harsh" style={{ textDecoration: 'none' }}>Component harsh</Link></ListGroupItem>
                    <ListGroupItem color="info"><Link to="/gatcha" style={{ textDecoration: 'none' }} > Component gatcha</Link></ListGroupItem>
                    <ListGroupItem color="warning"><Link to="/faceId" style={{ textDecoration: 'none' }} > Component face ID</Link></ListGroupItem>
                </ListGroup>
            </Container>
        </header>
    );
}

export default index;