import { gql, useMutation, useQuery } from "@apollo/client";
import react from "react";
import {
  COMMENT_FRAGMENT,
  FEED_PHOTO,
  PHOTO_FRAGMENT,
  ROOM_FRAGMENT,
  USER_FRAGMENT,
} from "./fragments";

export const FOLLOW_MUTATION = gql`
  mutation followUser($username: String!) {
    followUser(username: $username) {
      ok
    }
  }
`;
export const UNFOLLOW_MUTATION = gql`
  mutation unFollow($username: String!) {
    unFollow(username: $username) {
      ok
    }
  }
`;
export const LIKE_MUTATION = gql`
  mutation toggleLike($toggleLikeId: Int!) {
    toggleLike(id: $toggleLikeId) {
      ok
      error
    }
  }
`;
export const SEE_PROFILE_MUTATION = gql`
  query seeProfile($username: String!) {
    seeProfile(username: $username) {
      id
      firstName
      lastName
      username
      email
      bio
      avatar
      totalFollowers
      totalFollowing
      isMe
      isFollowing
      photos {
        file
        id
      }
    }
  }
`;
export const FEED_QUERY = gql`
  query seeFeed($offset: Int!) {
    seeFeed(offset: $offset) {
      ...PhotoFragment
      user {
        id
        username
        avatar
      }
      caption
      comments {
        ...CommentFragment
      }
      isMine
    }
  }
  ${PHOTO_FRAGMENT}
  ${COMMENT_FRAGMENT}
`;
export const LIKES_QUERY = gql`
  query seePhotoLike($seePhotoLikeId: Int!) {
    seePhotoLike(id: $seePhotoLikeId) {
      ...UserFragment
    }
  }
  ${USER_FRAGMENT}
`;

export const SEE_PROFILE = gql`
  query seeProfile($username: String!) {
    seeProfile(username: $username) {
      avatar
      username
      totalFollowers
      totalFollowing
      lastName
      firstName
      bio
      isMe
      id
      photos {
        id
        file
      }
    }
  }
`;
// export const SEE_ROOMS_QUERY = gql`
//   query seeRooms {
//     seeRooms {
//       id
//       unreadTotal
//       user {
//         avatar
//         username
//       }
//     }
//   }
// `;

// export const SEE_PROFILE = gql`
//   query seeProfile($username: String!) {
//     seeProfile(username: $username) {
//       avatar
//       username
//       totalFollowers
//       totalFollowing
//       lastName
//       firstName
//       bio
//       isMe
//       id
//       photos {
//         id
//         file
//       }
//     }
//   }
// `;

// export const SEARCH_PHOTOS = gql`
//   query searchPhotos($keyword: String!) {
//     searchPhotos(keyword: $keyword) {
//       id
//       file
//     }
//   }
// `;
// export const SEE_PHOTO = gql`
//   ${PHOTO_FRAGMENT}
//   ${COMMENT_FRAGMENT}
//   query seePhoto($id: Int!) {
//     seePhoto(id: $id) {
//       ...PhotoFragment
//       user {
//         id
//         username
//         avatar
//         __typename
//       }
//       caption
//       commentsNumber
//       comments {
//         ...CommentFragment
//       }
//       createAt
//       isMine
//     }
//   }
// `;

// export const CREATE_COMMENT = gql`
//   mutation createComment($photoId: Int!, $payLoad: String!) {
//     createComment(photoId: $photoId, payLoad: $payLoad) {
//       ok
//       id
//     }
//   }
// `;

// export const ULOAD_PHOTO = gql`
//   mutation uploadPhoto($file: Upload!, $caption: String) {
//     uploadPhoto(file: $file, caption: $caption) {
//       ...FeedPhoto
//     }
//   }
//   ${FEED_PHOTO}
// `;
