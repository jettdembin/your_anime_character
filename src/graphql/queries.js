"use client";

import { gql } from "@apollo/client";

export const GET_CHARACTER = gql`
  query GetCharacterDetails($id: Int) {
    Character(id: $id) {
      id
      name {
        full
        native
      }
      image {
        large
      }
      description
      media {
        nodes {
          id
          title {
            english
            romaji
          }
        }
      }
    }
  }
`;

export const GET_TOP_100_ANIME = gql`
  query GetTop100Anime {
    Page(page: 1, perPage: 100) {
      media(
        sort: SCORE_DESC
        format_in: [TV, TV_SHORT, MOVIE, OVA, ONA, SPECIAL]
      ) {
        id
        title {
          english
          native
        }
        description
        source
        coverImage {
          large
          extraLarge
        }
        trailer {
          id
          site
          thumbnail
        }
        nextAiringEpisode {
          airingAt
          timeUntilAiring
          episode
        }
        startDate {
          year
          month
          day
        }
        averageScore
        studios(isMain: true) {
          nodes {
            name
          }
        }
        popularity
        episodes
        genres
        status
        season
        seasonYear
      }
    }
  }
`;
