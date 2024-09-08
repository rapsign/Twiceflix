# TWICEFLIX

TWICEFLIX is a React-based application designed to showcase YouTube content from the K-pop idol group TWICE. The app features a Netflix-like interface, allowing users to browse TWICE's video playlists with a responsive and engaging user experience.

## Features

- **Playlist List:** Displays TWICE video playlists with thumbnails from the latest videos.
- **Video Detail Modal:** Clicking on a playlist opens a modal showing the latest video details, including description and a play button.
- **Netflix-like Layout:** Provides a user interface reminiscent of Netflix for an enjoyable browsing experience.
- **Responsive Design:** Utilizes Chakra UI to ensure the application works well on various devices.
- **Playlist Carousel:** Uses Swiper to display playlists in a carousel format.

## Technologies

- **React**: Library for building user interfaces
- **Chakra UI**: UI library for consistent component design
- **Swiper**: Carousel/slider library
- **Firebase**: Backend platform for database and authentication
- **YouTube API**: For fetching video and playlist data from YouTube
- **Vite**: Build tool for fast startup and hot module replacement
- **React Router**: For routing within the application

## Prerequisites

- Node.js and npm installed on your machine
- A Firebase account with configured settings
- YouTube API key (obtainable from [Google Developers Console](https://console.developers.google.com/))

## Installation

1. **Clone this repository:**

   ```bash
   git clone https://github.com/username/repository-name.git
   cd repository-name

   ```

2. **Install dependencies:**

```bash
npm install
```

3. **Configure Firebase and YouTube API:**

```bash
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id

VITE_YOUTUBE_API_KEY=your-youtube-api-key
```

## Running Tests

To run the application in development mode:

```bash
  npm run dev
```

The app will be available at http://localhost:5173.

## License

This project is licensed under the [MIT](https://choosealicense.com/licenses/mit/)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

## Contact

For questions or support, please contact https://rinaldi-a-prayuda.vercel.app/
