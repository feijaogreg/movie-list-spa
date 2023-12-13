/* eslint-disable @next/next/no-img-element */
"use client";
import {
  Button,
  FlexBox,
  Icon,
  Input,
  Title,
  Text,
  Card,
  CardHeader,
  List,
  StandardListItem,
  Grid,
} from "@ui5/webcomponents-react";
import React from "react";
import { useState } from "react";
import axios from "axios";
import Image from "next/image";

export default function Home() {
  const [searchInputValue, setSearchInputValue] = useState<String>("");
  const [moviesSearched, setMoviesSearched] = useState<any>({});
  const [selectedMovie, setSelectedMovie] = useState<any>({});

  const handleSearch = () => {
    axios
      .get("http://localhost:3000/movie/search", {
        params: { query: searchInputValue },
      })
      .then((response) => {
        console.log("FLAG H1 ", response.data);
        setMoviesSearched(response.data);
      })
      .catch((error) => {
        console.error("Error:", error.message);
      });
  };

  const fetchMovieDetails = async (imdbID: string) => {
    try {
      const response = await fetch(`http://localhost:3000/movie/details?imdbID=${imdbID}`);
      const data = await response.json();
      console.log(data)
      setSelectedMovie(data);
    } catch (error) {
      console.error('Error fetching movie details:', error);
    }
  };

  return (
    <main
      className="flex min-h-screen flex-col items-center p-24"
      style={{ width: "100%", height: "100%" }}
    >
      <div style={{ marginBottom: 40 }}>
        <FlexBox justifyContent="Center" style={{ marginBottom: 10 }}>
          <Title style={{ justifyContent: "Center" }}>Movies & Games Searcher</Title>
        </FlexBox>
        <FlexBox justifyContent="Center" style={{ marginBottom: 25 }}>
          <Text>
            Here you can search the movie or game you want and see all 
            of it informations, reset if you want to clean the list.
          </Text>
        </FlexBox>
        <FlexBox
          alignItems="Stretch"
          direction="Row"
          justifyContent="Center"
          wrap="NoWrap"
        >
          <Input
            onChange={(evt: any) => {
              setSearchInputValue(evt.target.value);
            }}
          />
          <Button onClick={() => handleSearch()}>Search</Button>
          <Button onClick={() => setMoviesSearched({})}>Reset</Button>
        </FlexBox>
      </div>

      {moviesSearched.Search ? (
        <>
          <FlexBox
            alignItems="Stretch"
            direction="Row"
            justifyContent="End"
            wrap="NoWrap"
          >
            {moviesSearched?.totalResults} results found
          </FlexBox>
          {moviesSearched?.Search.map((movie: any, key: any) => (
            <div
              key={key}
              style={{
                width: "90%",
                marginBottom: 20,
                padding: 20,
                borderColor: "#999",
                borderWidth: 2,
                borderRadius: 8,
              }}
            >
              <Grid>
                <React.Fragment key=".0">
                  <div
                    data-layout-indent="XL1 L1 M1 S0"
                    data-layout-span="XL8 L8 M8 S12"
                  >
                    <Title>{movie.Title}</Title>
                    {selectedMovie.imdbID==movie.imdbID ? (
                      <Text key={key}>
                        {selectedMovie.Plot}
                        <br />
                        <br />
                        Release date: {selectedMovie.Released}
                        <br />
                        Director: {selectedMovie.Director}
                        <br />
                        IMDB rating: {selectedMovie.imdbRating}
                      </Text>
                    ) : (
                      <Button key={key} onClick={() => fetchMovieDetails(movie.imdbID)}>Show more infos</Button>
                      )}
                    
                  </div>
                  <div>
                    <img
                      src={movie.Poster}
                      alt={movie.Title}
                      style={{ height: "300px", width: "auto", margin: "auto" }}
                    />
                  </div>
                </React.Fragment>
              </Grid>
            </div>
          ))}
        </>
      ) : null}
    </main>
  );
}
