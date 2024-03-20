import React, { useEffect, useState } from "react";
import { Navbar, Button, Link, Text, Grid, Row, Col, Modal } from "@nextui-org/react";
import './moviesPage.css'
import { HiMiniMagnifyingGlass } from "react-icons/hi2";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

export default function MoviesPage() {
    const [showAddMovie, setShowAddMovie] = useState(false)
    const [showEditMovie, setShowEditMovie] = useState(false)
    const [showAddReview, setShowAddReview] = useState(false)
    const [showEditReview, setShowEditReview] = useState(false)

    const [showMovieReviews, setShowMovieReviews] = useState(false)
    const [selectedMovie, setSelectedMovie] = useState({})

    const [movies, setMovies] = useState([]);
    const [reviews, setReviews] = useState([]);

    const [searchedMovie, setSearchedMovie] = useState('')
    const [refresh, setRefresh] = useState(false)

    const [movieToEdit, setMovieToEdit] = useState({})

    const [reviewToEdit, setReviewToEdit] = useState({})

    const [newMovie, setNewMovie] = useState({
        name: '',
        releaseDate: '',
        totalStars: 0,
        totalReviews: 0
    })

    const [newReview, setNewReview] = useState({
        movieID: '',
        name: '',
        rating: 0,
        comment: ''
    })

    const deleteMovie = async (movieId) => {
        try {
            const response = await fetch(`https://saasmonk-assg-backend.onrender.com/movies/${movieId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log(data.message);
    
            // Refresh the movie list to reflect the deletion
            await fetchMovies();
        } catch (error) {
            console.error("Error deleting movie:", error);
        }
    };

    const editMovie = async (movieId) => {
        try {
            const response = await fetch(`https://saasmonk-assg-backend.onrender.com/movies/${movieId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: movieToEdit.name,
                    releaseDate: movieToEdit.releaseDate,
                })
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log(data.message);
        
            setShowEditMovie(false); 
            setRefresh(prev => !prev);
        } catch (error) {
            console.error("Error editing movie:", error);
        }
    };

    const editReview = async (reviewId) => {
        try {
            const response = await fetch(`https://saasmonk-assg-backend.onrender.com/reviews/${reviewId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    movieId: reviewToEdit.movieId,
                    name: reviewToEdit.name,
                    rating: reviewToEdit.rating,
                    comment: reviewToEdit.comment
                })
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log(data.message);
        
            setShowEditReview(false); 
            setRefresh(prev => !prev);
        } catch (error) {
            console.error("Error editing review:", error);
        }
    };

    const deleteReview = async (reviewId) => {
        try {
            const response = await fetch(`https://saasmonk-assg-backend.onrender.com/reviews/${reviewId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log(data.message);
    
            // Refresh the movie list to reflect the deletion
            await fetchMovies();
        } catch (error) {
            console.error("Error deleting review:", error);
        }
    };

    const sendNewMovieToDB = async () => {
        try {
            const response = await fetch('https://saasmonk-assg-backend.onrender.com/movies', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newMovie)
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            // console.log(data); 

            setNewMovie({
                name: '',
                releaseDate: '',
                totalStars: 0,
                totalReviews: 0
            });
            setShowAddMovie(false)
            await fetchMovies();
        } catch (error) {
            console.error("Error adding new movie:", error);
        }
    };

    const handleMovieSelection = (e) => {
        const movieId = e.target.value;
        const selectedMovie = movies.find(movie => movie._id === movieId);
        setSelectedMovie(selectedMovie);
        setNewReview(prevState => ({
            ...prevState,
            movieID: movieId
        }));
    };

    const sendNewReviewToDB = async () => {
        if (!newReview.movieID) {
            console.error("No movie selected for the review.");
            return;
        }

        try {
            const response = await fetch('https://saasmonk-assg-backend.onrender.com/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newReview)
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log("Review added:", data);
            setShowAddReview(false)
            await fetchReviews();
        } catch (error) {
            console.error("Error adding new review:", error);
        }
    };

    const fetchMovies = async () => {
        try {
            const response = await fetch('https://saasmonk-assg-backend.onrender.com/movies');
            // console.log(response)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setMovies(data);
        } catch (error) {
            console.error("Error fetching movies:", error);
        }
    };

    const fetchReviews = async () => {
        try {
            const response = await fetch('https://saasmonk-assg-backend.onrender.com/reviews');
            // console.log(response)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            // console.log(data)
            setReviews(data);
        } catch (error) {
            console.error("Error fetching reviews:", error);
        }
    };

    useEffect(() => {
        fetchMovies();
        fetchReviews();
    }, [refresh]);

    return (
        <>
            <Grid.Container>
                <Row css={{
                    padding: '16px',
                    backgroundColor: '$gray300',
                    alignItems: 'center'
                }}>
                    <Text css={{
                        fontSize: '$lg',
                        fontWeight: '$medium'
                    }}>
                        MOVIECRITIC
                    </Text>

                    <Row css={{
                        jc: 'flex-end',
                        gap: '8px'
                    }}>
                        <Button auto css={{
                            backgroundColor: '$white',
                            borderRadius: '4px',
                            border: '$space$1 solid $purple500',
                            color: '$purple700'
                        }}
                            onPress={() => {
                                setShowAddMovie(true)
                            }}>
                            Add new movie
                        </Button>

                        <Button auto css={{
                            backgroundColor: '$purple600',
                            borderRadius: '4px',
                            color: '$white'
                        }}
                            onPress={() => {
                                setShowAddReview(true)
                            }}>
                            Add new review
                        </Button>
                    </Row>
                </Row>
            </Grid.Container>

            <Grid.Container>
                <Text css={{
                    fontWeight: '$medium',
                    fontSize: '$xl4',
                    padding: '24px',
                    width: '100vw'
                }}>
                    The best movie reviews site!
                </Text>

                <Row css={{
                    alignItems: 'center',
                    padding: '8px',
                    border: '2px solid #7828C8',
                    width: 'max-content',
                    margin: '0px 24px',
                    borderRadius: '4px'
                }}>
                    <HiMiniMagnifyingGlass size={16} style={{ margin: '4px' }} />
                    <input type="text" className="search-input" placeholder="Search for your favourite movie"
                        onChange={(e) => {
                            setSearchedMovie(e.target.value)
                        }} />
                </Row>
            </Grid.Container>

            <Grid.Container css={{ padding: '12px 0px' }}>
                {
                    movies
                        .filter(movie => searchedMovie.length === 0 || movie.name.includes(searchedMovie))
                        .map((movie, index) => (
                            <Grid key={index} css={{
                                padding: '24px',
                                backgroundColor: '$purple200',
                                margin: '24px',
                            }}>
                                <Col css={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}>
                                    <Text css={{
                                        fontSize: '$xl2',
                                        fontWeight: '$medium',
                                        '&:hover':{
                                            cursor: 'pointer'
                                        }
                                    }} onClick={() => {
                                        setSelectedMovie({
                                            id: movie._id,
                                            name: movie.name,
                                            releaseDate: movie.releaseDate,
                                            totalStars: movie.totalStars,
                                            totalReviews: movie.totalReviews
                                        })
                                        setShowMovieReviews(true)
                                    }}>
                                        {movie.name}
                                    </Text>
                                    <Text css={{
                                        fontStyle: 'italic',
                                        padding: '4px 0px 8px 0px'
                                    }}>
                                        Released: {movie.releaseDate}
                                    </Text>
                                    {movie.totalReviews === 0 ? (
                                        <Text css={{
                                            fontWeight: '$bold',
                                        }}>No Reviews...</Text>
                                    ) : (
                                        <Text css={{
                                            fontWeight: '$bold',
                                            '&:hover': {
                                                cursor: 'pointer'
                                            }
                                        }}
                                            onClick={() => {
                                                setSelectedMovie({
                                                    id: movie._id,
                                                    name: movie.name,
                                                    releaseDate: movie.releaseDate,
                                                    totalStars: movie.totalStars,
                                                    totalReviews: movie.totalReviews
                                                })
                                                setShowMovieReviews(true)
                                            }}>
                                            Rating: {movie.totalStars === 0 ? 0 : (movie.totalStars / movie.totalReviews).toFixed(2)} / 10
                                        </Text>
                                    )}
                                    <Row css={{
                                        jc: 'flex-end',
                                        gap: '4px'
                                    }}>
                                        <FaEdit className="icons" size={20} onClick={() => {
                                            setMovieToEdit({
                                                id: movie._id,
                                                name: movie.name,
                                                releaseDate: movie.releaseDate,
                                                totalStars: movie.totalStars,
                                                totalReviews: movie.totalReviews
                                            })
                                            setShowEditMovie(true)
                                        }} />
                                        <MdDelete onClick={() => deleteMovie(movie._id)} className="icons" size={20} />
                                    </Row>
                                </Col>
                            </Grid>
                        ))
                }
            </Grid.Container>

            {Object.keys(selectedMovie).length > 0 && showMovieReviews &&
                <Modal
                    closeButton
                    aria-labelledby="Movie Reviews Modal"
                    open={showMovieReviews}
                    onClose={() => {
                        setShowMovieReviews(false)
                    }}
                    fullScreen
                >
                    <Col css={{
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                        <Text css={{
                            fontSize: '$xl',
                            fontWeight: '$semibold'
                        }}>
                            Movie Reviews
                        </Text>
                        <Row css={{
                            jc: 'space-between',
                            padding: '24px'
                        }}>
                            <Text css={{
                                fontWeight: '$semibold',
                                fontSize: '$xl3'
                            }}>
                                {selectedMovie.name}
                            </Text>
                            <Text css={{
                                fontWeight: '$semibold',
                                fontSize: '$xl3',
                                color: '$purple600'
                            }}>
                                {(selectedMovie.totalStars / selectedMovie.totalReviews).toFixed(2)} / 10
                            </Text>
                        </Row>

                        {reviews.map((review, index) => {
                            if (review.movieId === selectedMovie.id) {
                                console.log(review)
                                return (
                                    <Col css={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        width: '95vw',
                                        margin: '24px',
                                        borderWidth: '1px',
                                        borderStyle: 'solid',
                                        borderColor: '$gray400',
                                        padding: '12px 24px'
                                    }}>
                                        <Row css={{
                                            jc: 'space-between'
                                        }}>
                                            <Text css={{
                                                fontSize: '$xl2',
                                                fontWeight: '$medium'
                                            }}>
                                                {review.comment}
                                            </Text>

                                            <Text css={{
                                                fontSize: '$xl2',
                                                fontWeight: '$medium',
                                                color: '$purple600'
                                            }}>
                                                {review.rating}/10
                                            </Text>
                                        </Row>

                                        <Row css={{
                                            jc: 'space-between',
                                            paddingTop: '4px',
                                            alignItems: 'center'
                                        }}>
                                            <Text css={{
                                                whiteSpace: 'nowrap',
                                                fontSize: '$lg',
                                                fontWeight: '$medium',
                                                fontStyle: 'italic'
                                            }}>
                                                By {review.name}
                                            </Text>

                                            <Row css={{
                                                jc: 'flex-end',
                                                gap: '4px',
                                            }}>
                                                <FaEdit className="icons" size={20} onClick={() => {
                                                    setReviewToEdit({
                                                        _id: review._id,
                                                        movieId: review.movieId,
                                                        name: review.name,
                                                        rating: review.rating,
                                                        comment: review.comment
                                                    })
                                                    setShowEditReview(true)
                                                }} />
                                                <MdDelete onClick={() => {
                                                    deleteReview(review._id)
                                                    setShowMovieReviews(false)
                                                    }} className="icons" size={20} />
                                            </Row>
                                        </Row>
                                    </Col>
                                )
                            }
                        })}

                    </Col>
                </Modal>
            }

            {/* Add Movie Modal */}
            <Modal
                closeButton
                aria-labelledby="Add Movie Modal"
                open={showAddMovie}
                onClose={() => {
                    setShowAddMovie(false)
                }}
            >
                <Col css={{
                    display: 'flex',
                    flexDirection: 'column',
                    jc: 'flex-start',
                    padding: '24px'
                }}>
                    <Text css={{
                        fontSize: '$xl2',
                        fontWeight: '$semibold',
                        textAlign: 'left',
                        paddingLeft: '12px'
                    }}>
                        Add New Movie
                    </Text>
                    <input className="movie-input" type="text" placeholder="Movie Name" onChange={(e) => {
                        setNewMovie(prevState => ({
                            ...prevState,
                            name: e.target.value
                        }))
                    }} />
                    <input className="movie-input" type='text' placeholder="Release Date (1st March, 2023)" onChange={(e) => {
                        setNewMovie(prevState => ({
                            ...prevState,
                            releaseDate: e.target.value
                        }))
                    }} />
                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        marginRight: '24px',
                        marginTop: '12px'
                    }}>
                        <Button auto css={{
                            backgroundColor: '$purple600',
                            borderRadius: '6px',
                            color: '$white',
                            padding: '16px',
                            maxW: 'max-content',
                        }}
                            onClick={() => {
                                sendNewMovieToDB()
                                setShowAddMovie(false)
                                setRefresh(true)
                            }}>
                            Create Movie
                        </Button>
                    </div>
                </Col>
            </Modal>

            {/* Edit Movie Modal */}
            {Object.keys(movieToEdit).length > 0 && showEditMovie &&
                <Modal
                    closeButton
                    aria-labelledby="Edit Movie Modal"
                    open={showEditMovie}
                    onClose={() => {
                        setShowEditMovie(false)
                    }}
                >
                    <Col css={{
                        display: 'flex',
                        flexDirection: 'column',
                        jc: 'flex-start',
                        padding: '24px'
                    }}>
                        <Text css={{
                            fontSize: '$xl2',
                            fontWeight: '$semibold',
                            textAlign: 'left',
                            paddingLeft: '12px'
                        }}>
                            Edit movie
                        </Text>
                        <input className="movie-input" type="text" placeholder={movieToEdit.name} onChange={(e) => {
                            setMovieToEdit(movieToEdit => ({
                                ...movieToEdit,
                                name: e.target.value
                            }))
                        }} />
                        <input className="movie-input" type='text' placeholder={movieToEdit.releaseDate} onChange={(e) => {
                            setMovieToEdit(movieToEdit => ({
                                ...movieToEdit,
                                releaseDate: e.target.value
                            }))
                        }} />
                        <div style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            marginRight: '24px',
                            marginTop: '12px'
                        }}>
                            <Button auto css={{
                                backgroundColor: '$purple600',
                                borderRadius: '6px',
                                color: '$white',
                                padding: '16px',
                                maxW: 'max-content',
                            }}
                                onClick={() => {
                                    setShowEditMovie(false)
                                    setRefresh(true)
                                    editMovie(movieToEdit.id)
                                }}>
                                Edit Movie
                            </Button>
                        </div>
                    </Col>
                </Modal>
            }

            {/* Add Review Modal */}
            <Modal
                closeButton
                aria-labelledby="Add Movie Modal"
                open={showAddReview}
                onClose={() => {
                    setShowAddReview(false)
                }}
            >
                <Col css={{
                    display: 'flex',
                    flexDirection: 'column',
                    jc: 'flex-start',
                    padding: '24px'
                }}>
                    <Text css={{
                        fontSize: '$xl2',
                        fontWeight: '$semibold',
                        textAlign: 'left',
                        paddingLeft: '12px'
                    }}>
                        Add New Review
                    </Text>
                    <select className="movie-input" id="movie-dropdown" onChange={handleMovieSelection}>
                        <option value="" selected disabled hidden>
                            Choose a movie
                        </option>
                        {movies.map((movie) => (
                            <option key={movie._id} value={movie._id}>{movie.name}</option>
                        ))}
                    </select>
                    <input className="movie-input" type="text" placeholder="Your Name"
                        onChange={(e) => {
                            setNewReview(prevState => ({
                                ...prevState,
                                name: e.target.value
                            }))
                        }} />
                    <input className="movie-input" type='text' placeholder="Rating Out Of 10"
                        onChange={(e) => {
                            setNewReview(prevState => ({
                                ...prevState,
                                rating: e.target.value
                            }))
                        }} />
                    <textarea className="movie-input" placeholder="Comments"
                        onChange={(e) => {
                            setNewReview(prevState => ({
                                ...prevState,
                                comment: e.target.value
                            }))
                        }} />
                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        marginRight: '24px',
                        marginTop: '12px'
                    }}>
                        <Button auto css={{
                            backgroundColor: '$purple600',
                            borderRadius: '6px',
                            color: '$white',
                            padding: '16px',
                            maxW: 'max-content',
                        }} onClick={() => {
                            sendNewReviewToDB()
                            setShowAddReview(false)
                            setRefresh(true)
                        }}>
                            Create Review
                        </Button>
                    </div>
                </Col>
            </Modal>

            {/* Edit Review Modal */}
            {Object.keys(reviewToEdit).length > 0 && showEditReview &&
                <Modal
                    closeButton
                    aria-labelledby="Edit Review Modal"
                    open={showEditReview}
                    onClose={() => {
                        setShowEditReview(false)
                    }}
                >
                    <Col css={{
                        display: 'flex',
                        flexDirection: 'column',
                        jc: 'flex-start',
                        padding: '24px'
                    }}>
                        <Text css={{
                            fontSize: '$xl2',
                            fontWeight: '$semibold',
                            textAlign: 'left',
                            paddingLeft: '12px'
                        }}>
                            Edit Review
                        </Text>
                        {movies.map((movie) => {
                            if (movie._id == reviewToEdit.movieId) {
                                return (
                                    <select className="movie-input" id="movie-dropdown">
                                        <option value="" selected disabled hidden key={movie._id}>{movie.name}</option>
                                    </select>
                                )
                            }
                        }
                        )}
                        <input className="movie-input" type="text" placeholder={reviewToEdit.name}
                            onChange={(e) => {
                                setReviewToEdit(reviewToEdit => ({
                                    ...reviewToEdit,
                                    name: e.target.value
                                }))
                            }} />
                        <input className="movie-input" type='text' placeholder={reviewToEdit.rating}
                            onChange={(e) => {
                                setReviewToEdit(reviewToEdit => ({
                                    ...reviewToEdit,
                                    rating: e.target.value
                                }))
                            }} />
                        <textarea className="movie-input" placeholder={reviewToEdit.comment}
                            onChange={(e) => {
                                setReviewToEdit(reviewToEdit => ({
                                    ...reviewToEdit,
                                    comment: e.target.value
                                }))
                            }} />
                        <div style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            marginRight: '24px',
                            marginTop: '12px'
                        }}>
                            <Button auto css={{
                                backgroundColor: '$purple600',
                                borderRadius: '6px',
                                color: '$white',
                                padding: '16px',
                                maxW: 'max-content',
                            }} onClick={() => {
                                editReview(reviewToEdit._id)
                                setShowEditReview(false)
                                setRefresh(true)
                            }}>
                                Edit Review
                            </Button>
                        </div>
                    </Col>
                </Modal>
            }
        </>
    )
}
