import React, { useEffect, useState } from "react";
import { Navbar, Button, Link, Text, Grid, Row, Col, Modal } from "@nextui-org/react";
import './moviesPage.css'
import { HiMiniMagnifyingGlass } from "react-icons/hi2";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

export default function MoviesPage() {
    const [showAddMovie, setShowAddMovie] = useState(false)
    const [showAddReview, setShowAddReview] = useState(false)
    const [showMovieReviews, setShowMovieReviews] = useState(false)
    const [selectedMovie, setSelectedMovie] = useState({})
    const [movies, setMovies] = useState([]); 
    const [reviews, setReviews] = useState([]);

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

    const sendNewMovieToDB = async () => {
        try {
            const response = await fetch('http://localhost:3001/movies', { 
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
            console.log(data); 
    
            setNewMovie({
                name: '',
                releaseDate: '',
                totalStars: 0,
                totalReviews: 0
            });
    
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
            const response = await fetch('http://localhost:3001/reviews', {
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

            await fetchReviews();
        } catch (error) {
            console.error("Error adding new review:", error);
        }
    };

    const fetchMovies = async () => {
        try {
            const response = await fetch('http://localhost:3001/movies'); 
            console.log(response)
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
            const response = await fetch('http://localhost:3001/reviews'); 
            console.log(response)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log(data)
            setReviews(data); 
        } catch (error) {
            console.error("Error fetching reviews:", error);
        }
    };

    useEffect(() => {
        fetchMovies();
        fetchReviews();
    }, []); 

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
                    />
                </Row>
            </Grid.Container>

            <Grid.Container css={{
                padding: '12px 0px'
            }}>
                {movies.map((movie, index) => (
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
                                fontWeight: '$medium'
                            }}>
                                {movie.name}
                            </Text>
                            <Text css={{
                                fontStyle: 'italic',
                                padding: '4px 0px 8px 0px'
                            }}>
                                Released: {movie.releaseDate}
                            </Text>
                            <Text css={{
                                fontWeight: '$bold',
                                '&:hover': {
                                    cursor: 'pointer'
                                }
                            }}
                                onClick={() => {
                                    setSelectedMovie({
                                        id: movie.id,
                                        name: movie.name,
                                        releaseDate: movie.releaseDate,
                                        totalStars: movie.totalStars,
                                        totalReviews: movie.totalReviews
                                    })
                                    setShowMovieReviews(true)
                                }}>
                                Rating: {(movie.totalStars / movie.totalReviews).toFixed(2)} / 10
                            </Text>
                            <Row css={{
                                jc: 'flex-end',
                                gap: '4px'
                            }}>
                                <FaEdit className="icons" size={20} />
                                <MdDelete className="icons" size={20} />
                            </Row>
                        </Col>
                    </Grid>
                ))}
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
                            if (review.movieID === selectedMovie.id) {
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
                                                <FaEdit className="icons" size={20} />
                                                <MdDelete className="icons" size={20} />
                                            </Row>
                                        </Row>
                                    </Col>
                                )
                            }
                        })}

                    </Col>
                </Modal>
            }

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
                    <input className="movie-input" type="text" placeholder="Movie Name" onChange={(e)=>{
                        setNewMovie(prevState => ({
                            ...prevState,
                            name: e.target.value
                        }))
                    }}/>
                    <input className="movie-input" type='text' placeholder="Release Date (1st March, 2023)" onChange={(e)=>{
                        setNewMovie(prevState => ({
                            ...prevState,
                            releaseDate: e.target.value
                        }))
                    }}/>
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
                        onClick={()=>{
                            sendNewMovieToDB()
                        }}>
                            Create Movie
                        </Button>
                    </div>
                </Col>
            </Modal>

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
                    onChange={(e)=>{
                        setNewReview(prevState => ({
                            ...prevState,
                            name: e.target.value
                        }))
                    }}/>
                    <input className="movie-input" type='text' placeholder="Rating Out Of 10" 
                    onChange={(e)=>{
                        setNewReview(prevState => ({
                            ...prevState,
                            rating: e.target.value
                        }))
                    }}/>
                    <textarea className="movie-input" placeholder="Comments" 
                    onChange={(e)=>{
                        setNewReview(prevState => ({
                            ...prevState,
                            comment: e.target.value
                        }))
                    }}/>
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
                        }} onClick={sendNewReviewToDB}>
                            Create Review
                        </Button>
                    </div>
                </Col>
            </Modal>
        </>
    )
}
