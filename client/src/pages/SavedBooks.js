// import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Row} from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/client';

import { SAVE_BOOK, REMOVE_BOOK } from '../utils/mutations';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';


const SavedBooks = () => {

  const { loading, data} = useQuery(SAVE_BOOK);
  const [removeBook, {error}] = useMutation(REMOVE_BOOK);

  const userData = data?.me || [];

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {

    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
     
      const {data} = await removeBook({
        variables: { bookId }
      });

      // upon success, remove book's id from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
        <>
          <div fluid className='text-light bg-dark p-5'>
            <Container>
              <h1>Viewing saved books!</h1>
            </Container>
          </div>
          <Container>
            <h2>
              {userData.savedBooks.length
                ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
                : 'You have no saved books!'}
            </h2>
            <Row>
              {userData.savedBooks.map((book) => {
                return (
                       <Card key={book.bookId} border='dark'>
                      {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                      <Card.Body>
                        <Card.Title>{book.title}</Card.Title>
                        <p className='small'>Authors: {book.authors}</p>
                        {book.link ? <Card.Text><a href={book.link} target="_blank">More Information on Google Books</a></Card.Text> : null}
                        <Card.Text>{book.description}</Card.Text>
                        <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                          Delete this Book!
                        </Button>
                      </Card.Body>
                    </Card>
                  
                );
              })}
            </Row>
          </Container>
        </>
      );
    };
export default SavedBooks;
