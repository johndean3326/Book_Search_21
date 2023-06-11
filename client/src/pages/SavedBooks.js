import React from 'react';
import {
  Container,
  Card,
  Button,
  Row,
  Col
} from 'react-bootstrap';

import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';
import { useQuery, useMutation } from '@apollo/client';
// Imports the GET_ME query
import { GET_ME } from '../utils/queries';
import { REMOVE_BOOK } from '../utils/mutations';


const SavedBooks = () => {
  // Creates the mutation for removing a specific book from the user's savedBook array.
  const [removeBook, { error }] = useMutation(REMOVE_BOOK);
  // Queries 'me' and assigns the parameters to data.
  const { loading, data } = useQuery(GET_ME);

  // This hook uses the 'useQuery(GET_ME)' function stored in 'data' to search for the user that is returned from 'me' query. This will be used later to access the savedBooks array in user. Data will be stored in an object.
  const userData = data?.me || {};
  
  // This is a function that will delete the selected book from the user's savedBooks array .
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;
   
    if (!token) {
      return false;
    }

    // Searches for a bookId in the user's savedBooks array and removes it if there is a match.
    try {
      const { data }  = await removeBook({
        variables: { bookId: bookId },
      });

      // Removes the deleted book's id (and subsequently the rest of the data for the book) from the array.
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  // Creates a loading screen if there is a delay in getting the data.
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <div className='text-light bg-dark p-5'>
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {userData.savedBooks.map((book) => {
            return (
              <Col key={book.bookId} md="4">
                <Card border='dark'>
                  {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;

